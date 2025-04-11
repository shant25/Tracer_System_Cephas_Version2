const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const User = require('../../models/User');
const Project = require('../../models/Project');
const Task = require('../../models/Task');
const jwt = require('jsonwebtoken');
const config = require('../../config/default');

describe('Project Routes', () => {
  let testUser;
  let token;
  let testProject;

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
  });

  describe('GET /api/projects', () => {
    it('should get all projects for authenticated user', async () => {
      const res = await request(app)
        .get('/api/projects')
        .set('x-auth-token', token)
        .expect(200);

      expect(res.body).toBeInstanceOf(Array);
      expect(res.body.length).toBe(1);
      expect(res.body[0].name).toBe('Test Project');
    });

    it('should return 401 if not authenticated', async () => {
      const res = await request(app)
        .get('/api/projects')
        .expect(401);

      expect(res.body.msg).toBe('No token, authorization denied');
    });
  });

  describe('POST /api/projects', () => {
    it('should create a new project', async () => {
      const projectData = {
        name: 'New Project',
        description: 'This is a new project',
        startDate: new Date(),
        endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) // 30 days from now
      };

      const res = await request(app)
        .post('/api/projects')
        .set('x-auth-token', token)
        .send(projectData)
        .expect(200);

      expect(res.body.name).toBe(projectData.name);
      expect(res.body.description).toBe(projectData.description);
      expect(res.body.owner).toBe(testUser._id.toString());
      expect(res.body.members).toContain(testUser._id.toString());
    });

    it('should return 400 if required fields are missing', async () => {
      const projectData = {
        // name is missing
        description: 'This is a new project'
      };

      const res = await request(app)
        .post('/api/projects')
        .set('x-auth-token', token)
        .send(projectData)
        .expect(400);

      expect(res.body.errors).toBeDefined();
    });
  });

  describe('GET /api/projects/:id', () => {
    it('should get a project by ID', async () => {
      const res = await request(app)
        .get(`/api/projects/${testProject._id}`)
        .set('x-auth-token', token)
        .expect(200);

      expect(res.body.name).toBe(testProject.name);
      expect(res.body.description).toBe(testProject.description);
      expect(res.body.owner._id).toBe(testUser._id.toString());
    });

    it('should return 404 if project does not exist', async () => {
      const nonExistentId = mongoose.Types.ObjectId();
      
      const res = await request(app)
        .get(`/api/projects/${nonExistentId}`)
        .set('x-auth-token', token)
        .expect(404);

      expect(res.body.msg).toBe('Project not found');
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

      // Create a project that doesn't include the other user
      const privateProject = new Project({
        name: 'Private Project',
        description: 'This is a private project',
        owner: testUser._id,
        members: [testUser._id] // anotherUser is not a member
      });
      await privateProject.save();

      const res = await request(app)
        .get(`/api/projects/${privateProject._id}`)
        .set('x-auth-token', otherToken)
        .expect(403);

      expect(res.body.msg).toBe('Access denied');
    });
  });

  describe('PUT /api/projects/:id', () => {
    it('should update a project', async () => {
      const updateData = {
        name: 'Updated Project',
        description: 'This is an updated project'
      };

      const res = await request(app)
        .put(`/api/projects/${testProject._id}`)
        .set('x-auth-token', token)
        .send(updateData)
        .expect(200);

      expect(res.body.name).toBe(updateData.name);
      expect(res.body.description).toBe(updateData.description);
    });

    it('should return 404 if project does not exist', async () => {
      const nonExistentId = mongoose.Types.ObjectId();
      
      const updateData = {
        name: 'Updated Project',
        description: 'This is an updated project'
      };

      const res = await request(app)
        .put(`/api/projects/${nonExistentId}`)
        .set('x-auth-token', token)
        .send(updateData)
        .expect(404);

      expect(res.body.msg).toBe('Project not found');
    });

    it('should return 403 if user is not the project owner', async () => {
      // Create another user
      const anotherUser = new User({
        name: 'Another User',
        email: 'another@example.com',
        password: 'password123'
      });
      await anotherUser.save();

      // Add user as a member (but not owner)
      testProject.members.push(anotherUser._id);
      await testProject.save();

      // Create token for the other user
      const otherPayload = { user: { id: anotherUser._id } };
      const otherToken = jwt.sign(otherPayload, config.jwtSecret, { expiresIn: '1h' });

      const updateData = {
        name: 'Updated Project',
        description: 'This is an updated project'
      };

      const res = await request(app)
        .put(`/api/projects/${testProject._id}`)
        .set('x-auth-token', otherToken)
        .send(updateData)
        .expect(403);

      expect(res.body.msg).toBe('Not authorized to update this project');
    });
  });

  describe('DELETE /api/projects/:id', () => {
    it('should delete a project and its tasks', async () => {
      // Create a test task associated with the project
      const task = new Task({
        title: 'Test Task',
        description: 'This is a test task',
        project: testProject._id,
        createdBy: testUser._id,
        assignedTo: testUser._id
      });
      await task.save();

      const res = await request(app)
        .delete(`/api/projects/${testProject._id}`)
        .set('x-auth-token', token)
        .expect(200);

      expect(res.body.msg).toBe('Project and associated tasks removed');

      // Verify project was deleted
      const deletedProject = await Project.findById(testProject._id);
      expect(deletedProject).toBeNull();

      // Verify associated tasks were deleted
      const deletedTask = await Task.findById(task._id);
      expect(deletedTask).toBeNull();
    });

    it('should return 404 if project does not exist', async () => {
        const nonExistentId = mongoose.Types.ObjectId();
        
        const res = await request(app)
          .delete(`/api/projects/${nonExistentId}`)
          .set('x-auth-token', token)
          .expect(404);
  
        expect(res.body.msg).toBe('Project not found');
      });
  
      it('should return 403 if user is not the project owner', async () => {
        // Create another user
        const anotherUser = new User({
          name: 'Another User',
          email: 'another@example.com',
          password: 'password123'
        });
        await anotherUser.save();
  
        // Add user as a member (but not owner)
        testProject.members.push(anotherUser._id);
        await testProject.save();
  
        // Create token for the other user
        const otherPayload = { user: { id: anotherUser._id } };
        const otherToken = jwt.sign(otherPayload, config.jwtSecret, { expiresIn: '1h' });
  
        const res = await request(app)
          .delete(`/api/projects/${testProject._id}`)
          .set('x-auth-token', otherToken)
          .expect(403);
  
        expect(res.body.msg).toBe('Not authorized to delete this project');
      });
    });
  
    describe('GET /api/projects/:id/tasks', () => {
      it('should get all tasks for a project', async () => {
        // Create test tasks for the project
        const task1 = new Task({
          title: 'Task 1',
          description: 'This is task 1',
          project: testProject._id,
          createdBy: testUser._id,
          assignedTo: testUser._id
        });
        await task1.save();
  
        const task2 = new Task({
          title: 'Task 2',
          description: 'This is task 2',
          project: testProject._id,
          createdBy: testUser._id,
          assignedTo: testUser._id
        });
        await task2.save();
  
        const res = await request(app)
          .get(`/api/projects/${testProject._id}/tasks`)
          .set('x-auth-token', token)
          .expect(200);
  
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.length).toBe(2);
        expect(res.body[0].title).toBe('Task 1');
        expect(res.body[1].title).toBe('Task 2');
      });
  
      it('should return 404 if project does not exist', async () => {
        const nonExistentId = mongoose.Types.ObjectId();
        
        const res = await request(app)
          .get(`/api/projects/${nonExistentId}/tasks`)
          .set('x-auth-token', token)
          .expect(404);
  
        expect(res.body.msg).toBe('Project not found');
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
          .get(`/api/projects/${testProject._id}/tasks`)
          .set('x-auth-token', otherToken)
          .expect(403);
  
        expect(res.body.msg).toBe('Access denied');
      });
    });
  
    describe('POST /api/projects/:id/members', () => {
      it('should add a member to a project', async () => {
        // Create a user to add as member
        const newMember = new User({
          name: 'New Member',
          email: 'member@example.com',
          password: 'password123'
        });
        await newMember.save();
  
        const res = await request(app)
          .post(`/api/projects/${testProject._id}/members`)
          .set('x-auth-token', token)
          .send({ email: newMember.email })
          .expect(200);
  
        // Check if member was added to project
        expect(res.body.members).toBeInstanceOf(Array);
        expect(res.body.members.some(member => member.email === newMember.email)).toBe(true);
      });
  
      it('should return 404 if user to add does not exist', async () => {
        const res = await request(app)
          .post(`/api/projects/${testProject._id}/members`)
          .set('x-auth-token', token)
          .send({ email: 'nonexistent@example.com' })
          .expect(404);
  
        expect(res.body.msg).toBe('User not found');
      });
  
      it('should return 400 if user is already a member', async () => {
        // Try to add the owner (who is already a member)
        const res = await request(app)
          .post(`/api/projects/${testProject._id}/members`)
          .set('x-auth-token', token)
          .send({ email: testUser.email })
          .expect(400);
  
        expect(res.body.msg).toBe('User is already a member');
      });
  
      it('should return 403 if user is not the project owner', async () => {
        // Create another user
        const anotherUser = new User({
          name: 'Another User',
          email: 'another@example.com',
          password: 'password123'
        });
        await anotherUser.save();
  
        // Add user as a member (but not owner)
        testProject.members.push(anotherUser._id);
        await testProject.save();
  
        // Create token for the other user
        const otherPayload = { user: { id: anotherUser._id } };
        const otherToken = jwt.sign(otherPayload, config.jwtSecret, { expiresIn: '1h' });
  
        // Try to add a new member
        const newMember = new User({
          name: 'New Member',
          email: 'member@example.com',
          password: 'password123'
        });
        await newMember.save();
  
        const res = await request(app)
          .post(`/api/projects/${testProject._id}/members`)
          .set('x-auth-token', otherToken)
          .send({ email: newMember.email })
          .expect(403);
  
        expect(res.body.msg).toBe('Not authorized to add members');
      });
    });
  });