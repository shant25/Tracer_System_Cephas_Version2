const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const User = require('../../models/User');
const Project = require('../../models/Project');
const Task = require('../../models/Task');
const jwt = require('jsonwebtoken');
const config = require('../../config/default');

describe('Task Routes', () => {
  let testUser;
  let token;
  let testProject;
  let testTask;

  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true 
    });

    // Create test user
    testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
    await testUser.save();

    // Generate token for the user
    const payload = { user: { id: testUser._id } };
    token = jwt.sign(payload, config.jwtSecret, { expiresIn: '1h' });
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Project.deleteMany({});
    await Task.deleteMany({});

    // Create a test project for each test
    testProject = new Project({
      name: 'Test Project',
      description: 'This is a test project',
      owner: testUser._id,
      members: [testUser._id]
    });
    await testProject.save();

    // Create a test task for each test
    testTask = new Task({
      title: 'Test Task',
      description: 'This is a test task',
      project: testProject._id,
      createdBy: testUser._id,
      assignedTo: testUser._id,
      priority: 'medium',
      status: 'pending'
    });
    await testTask.save();
  });

  describe('GET /api/tasks', () => {
    it('should get all tasks assigned to authenticated user', async () => {
      const res = await request(app)
        .get('/api/tasks')
        .set('x-auth-token', token)
        .expect(200);

      expect(res.body).toBeInstanceOf(Array);
      expect(res.body.length).toBe(1);
      expect(res.body[0].title).toBe('Test Task');
    });

    it('should return 401 if not authenticated', async () => {
      const res = await request(app)
        .get('/api/tasks')
        .expect(401);

      expect(res.body.msg).toBe('No token, authorization denied');
    });
  });

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const taskData = {
        title: 'New Task',
        description: 'This is a new task',
        project: testProject._id,
        priority: 'high',
        status: 'pending',
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) // 7 days from now
      };

      const res = await request(app)
        .post('/api/tasks')
        .set('x-auth-token', token)
        .send(taskData)
        .expect(200);

      expect(res.body.title).toBe(taskData.title);
      expect(res.body.description).toBe(taskData.description);
      expect(res.body.project.name).toBe(testProject.name);
      expect(res.body.createdBy.name).toBe(testUser.name);
      expect(res.body.assignedTo.name).toBe(testUser.name);
      expect(res.body.priority).toBe(taskData.priority);
      expect(res.body.status).toBe(taskData.status);
    });

    it('should return 400 if required fields are missing', async () => {
      const taskData = {
        // title is missing
        description: 'This is a new task',
        project: testProject._id
      };

      const res = await request(app)
        .post('/api/tasks')
        .set('x-auth-token', token)
        .send(taskData)
        .expect(400);

      expect(res.body.errors).toBeDefined();
    });

    it('should return 404 if project does not exist', async () => {
      const nonExistentId = mongoose.Types.ObjectId();
      
      const taskData = {
        title: 'New Task',
        description: 'This is a new task',
        project: nonExistentId
      };

      const res = await request(app)
        .post('/api/tasks')
        .set('x-auth-token', token)
        .send(taskData)
        .expect(404);

      expect(res.body.msg).toBe('Project not found');
    });
  });

  describe('GET /api/tasks/:id', () => {
    it('should get a task by ID', async () => {
      const res = await request(app)
        .get(`/api/tasks/${testTask._id}`)
        .set('x-auth-token', token)
        .expect(200);

      expect(res.body.title).toBe(testTask.title);
      expect(res.body.description).toBe(testTask.description);
      expect(res.body.project.name).toBe(testProject.name);
    });

    it('should return 404 if task does not exist', async () => {
      const nonExistentId = mongoose.Types.ObjectId();
      
      const res = await request(app)
        .get(`/api/tasks/${nonExistentId}`)
        .set('x-auth-token', token)
        .expect(404);

      expect(res.body.msg).toBe('Task not found');
    });

    it('should return 403 if user has no access to project', async () => {
      // Create another user
      const anotherUser = new User({
        name: 'Another User',
        email: 'another@example.com',
        password: 'password123'
      });
      await anotherUser.save();

      // Create token for the other user
      const otherPayload = { user: { id: anotherUser._id } };
      const otherToken = jwt.sign(otherPayload, config.jwtSecret, { expiresIn: '1h' });

      const res = await request(app)
        .get(`/api/tasks/${testTask._id}`)
        .set('x-auth-token', otherToken)
        .expect(403);

      expect(res.body.msg).toBe('Access denied');
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should update a task', async () => {
      const updateData = {
        title: 'Updated Task',
        description: 'This is an updated task',
        priority: 'high'
      };

      const res = await request(app)
        .put(`/api/tasks/${testTask._id}`)
        .set('x-auth-token', token)
        .send(updateData)
        .expect(200);

      expect(res.body.title).toBe(updateData.title);
      expect(res.body.description).toBe(updateData.description);
      expect(res.body.priority).toBe(updateData.priority);
    });

    it('should return 404 if task does not exist', async () => {
      const nonExistentId = mongoose.Types.ObjectId();
      
      const updateData = {
        title: 'Updated Task',
        description: 'This is an updated task'
      };

      const res = await request(app)
        .put(`/api/tasks/${nonExistentId}`)
        .set('x-auth-token', token)
        .send(updateData)
        .expect(404);

      expect(res.body.msg).toBe('Task not found');
    });

    it('should return 403 if user is not authorized to update', async () => {
      // Create another user
      const anotherUser = new User({
        name: 'Another User',
        email: 'another@example.com',
        password: 'password123'
      });
      await anotherUser.save();

      // Create a project where anotherUser is a member
      const anotherProject = new Project({
        name: 'Another Project',
        description: 'This is another project',
        owner: testUser._id,
        members: [testUser._id, anotherUser._id]
      });
      await anotherProject.save();

      // Create a task created by testUser
      const anotherTask = new Task({
        title: 'Another Task',
        description: 'This is another task',
        project: anotherProject._id,
        createdBy: testUser._id, // Created by testUser
        assignedTo: anotherUser._id // Assigned to anotherUser
      });
      await anotherTask.save();

      // Create token for the other user
      const otherPayload = { user: { id: anotherUser._id } };
      const otherToken = jwt.sign(otherPayload, config.jwtSecret, { expiresIn: '1h' });

      const updateData = {
        title: 'Updated Task',
        description: 'This is an updated task'
      };

      const res = await request(app)
        .put(`/api/tasks/${anotherTask._id}`)
        .set('x-auth-token', otherToken)
        .send(updateData)
        .expect(403);

      expect(res.body.msg).toBe('Not authorized to update this task');
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete a task', async () => {
      const res = await request(app)
        .delete(`/api/tasks/${testTask._id}`)
        .set('x-auth-token', token)
        .expect(200);

      expect(res.body.msg).toBe('Task removed');

      // Verify task was deleted
      const deletedTask = await Task.findById(testTask._id);
      expect(deletedTask).toBeNull();
    });

    it('should return 404 if task does not exist', async () => {
      const nonExistentId = mongoose.Types.ObjectId();
      
      const res = await request(app)
        .delete(`/api/tasks/${nonExistentId}`)
        .set('x-auth-token', token)
        .expect(404);

      expect(res.body.msg).toBe('Task not found');
    });

    it('should return 403 if user is not authorized to delete', async () => {
      // Create another user
      const anotherUser = new User({
        name: 'Another User',
        email: 'another@example.com',
        password: 'password123'
      });
      await anotherUser.save();

      // Create a project where anotherUser is a member
      const anotherProject = new Project({
        name: 'Another Project',
        description: 'This is another project',
        owner: testUser._id,
        members: [testUser._id, anotherUser._id]
      });
      await anotherProject.save();

      // Create a task created by testUser
      const anotherTask = new Task({
        title: 'Another Task',
        description: 'This is another task',
        project: anotherProject._id,
        createdBy: testUser._id, // Created by testUser
        assignedTo: anotherUser._id // Assigned to anotherUser
      });
      await anotherTask.save();

      // Create token for the other user
      const otherPayload = { user: { id: anotherUser._id } };
      const otherToken = jwt.sign(otherPayload, config.jwtSecret, { expiresIn: '1h' });

      const res = await request(app)
        .delete(`/api/tasks/${anotherTask._id}`)
        .set('x-auth-token', otherToken)
        .expect(403);

      expect(res.body.msg).toBe('Not authorized to delete this task');
    });
  });

  describe('PUT /api/tasks/:id/status', () => {
    it('should update task status', async () => {
      const statusData = {
        status: 'in-progress'
      };

      const res = await request(app)
        .put(`/api/tasks/${testTask._id}/status`)
        .set('x-auth-token', token)
        .send(statusData)
        .expect(200);

      expect(res.body.status).toBe(statusData.status);
      expect(res.body.completedAt).toBeNull();

      // Update to completed
      const completeData = {
        status: 'completed'
      };

      const completeRes = await request(app)
        .put(`/api/tasks/${testTask._id}/status`)
        .set('x-auth-token', token)
        .send(completeData)
        .expect(200);

      expect(completeRes.body.status).toBe(completeData.status);
      expect(completeRes.body.completedAt).toBeDefined();
    });

    it('should return 400 if status is invalid', async () => {
      const statusData = {
        status: 'invalid-status'
      };

      const res = await request(app)
        .put(`/api/tasks/${testTask._id}/status`)
        .set('x-auth-token', token)
        .send(statusData)
        .expect(400);

      expect(res.body.errors).toBeDefined();
    });

    it('should return 403 if user is not assigned to the task or project owner', async () => {
      // Create another user
      const anotherUser = new User({
        name: 'Another User',
        email: 'another@example.com',
        password: 'password123'
      });
      await anotherUser.save();

      // Create a project where anotherUser is a member
      const anotherProject = new Project({
        name: 'Another Project',
        description: 'This is another project',
        owner: testUser._id,
        members: [testUser._id, anotherUser._id]
      });
      await anotherProject.save();

      // Create a task assigned to testUser
      const anotherTask = new Task({
        title: 'Another Task',
        description: 'This is another task',
        project: anotherProject._id,
        createdBy: testUser._id,
        assignedTo: testUser._id // Assigned to testUser, not anotherUser
      });
      await anotherTask.save();

      // Create token for the other user
      const otherPayload = { user: { id: anotherUser._id } };
      const otherToken = jwt.sign(otherPayload, config.jwtSecret, { expiresIn: '1h' });

      const statusData = {
        status: 'in-progress'
      };

      const res = await request(app)
        .put(`/api/tasks/${anotherTask._id}/status`)
        .set('x-auth-token', otherToken)
        .send(statusData)
        .expect(403);

      expect(res.body.msg).toBe('Not authorized to update this task status');
    });
  });

  describe('POST /api/tasks/:id/comments', () => {
    it('should add a comment to a task', async () => {
      const commentData = {
        text: 'This is a test comment'
      };

      const res = await request(app)
        .post(`/api/tasks/${testTask._id}/comments`)
        .set('x-auth-token', token)
        .send(commentData)
        .expect(200);

      expect(res.body).toBeInstanceOf(Array);
      expect(res.body.length).toBe(1);
      expect(res.body[0].text).toBe(commentData.text);
      expect(res.body[0].user).toBe(testUser._id.toString());
      expect(res.body[0].name).toBe(testUser.name);
    });

    it('should return 400 if comment text is missing', async () => {
      const commentData = {
        // text is missing
      };

      const res = await request(app)
        .post(`/api/tasks/${testTask._id}/comments`)
        .set('x-auth-token', token)
        .send(commentData)
        .expect(400);

      expect(res.body.errors).toBeDefined();
    });

    it('should return 404 if task does not exist', async () => {
      const nonExistentId = mongoose.Types.ObjectId();
      
      const commentData = {
        text: 'This is a test comment'
      };

      const res = await request(app)
        .post(`/api/tasks/${nonExistentId}/comments`)
        .set('x-auth-token', token)
        .send(commentData)
        .expect(404);

      expect(res.body.msg).toBe('Task not found');
    });
  });
});