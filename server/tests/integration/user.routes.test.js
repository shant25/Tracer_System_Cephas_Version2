const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const User = require('../../models/User');
const Project = require('../../models/Project');
const Task = require('../../models/Task');
const jwt = require('jsonwebtoken');
const config = require('../../config/default');

describe('User Routes', () => {
  let testUser;
  let token;
  let adminUser;
  let adminToken;

  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true 
    });

    // Create test user
    testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'user'
    });
    await testUser.save();

    // Create admin user
    adminUser = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin'
    });
    await adminUser.save();

    // Generate tokens
    const payload = { user: { id: testUser._id } };
    token = jwt.sign(payload, config.jwtSecret, { expiresIn: '1h' });

    const adminPayload = { user: { id: adminUser._id } };
    adminToken = jwt.sign(adminPayload, config.jwtSecret, { expiresIn: '1h' });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Project.deleteMany({});
    await Task.deleteMany({});
  });

  describe('GET /api/users', () => {
    it('should get all users if user is admin', async () => {
      const res = await request(app)
        .get('/api/users')
        .set('x-auth-token', adminToken)
        .expect(200);

      expect(res.body).toBeInstanceOf(Array);
      expect(res.body.length).toBeGreaterThanOrEqual(2); // At least testUser and adminUser
      const userEmails = res.body.map(user => user.email);
      expect(userEmails).toContain(testUser.email);
      expect(userEmails).toContain(adminUser.email);
    });

    it('should return 403 if user is not admin', async () => {
      const res = await request(app)
        .get('/api/users')
        .set('x-auth-token', token)
        .expect(403);

      expect(res.body.msg).toBe('Unauthorized access');
    });
  });

  describe('GET /api/users/me', () => {
    it('should get current user profile', async () => {
      const res = await request(app)
        .get('/api/users/me')
        .set('x-auth-token', token)
        .expect(200);

      expect(res.body.name).toBe(testUser.name);
      expect(res.body.email).toBe(testUser.email);
      expect(res.body.password).toBeUndefined(); // Password should not be returned
    });

    it('should return 401 if not authenticated', async () => {
      const res = await request(app)
        .get('/api/users/me')
        .expect(401);

      expect(res.body.msg).toBe('No token, authorization denied');
    });
  });

  describe('PUT /api/users/me', () => {
    it('should update current user profile', async () => {
      const updateData = {
        name: 'Updated Name',
        email: 'updated@example.com',
        bio: 'Updated bio'
      };

      const res = await request(app)
        .put('/api/users/me')
        .set('x-auth-token', token)
        .send(updateData)
        .expect(200);

      expect(res.body.name).toBe(updateData.name);
      expect(res.body.email).toBe(updateData.email);
      expect(res.body.bio).toBe(updateData.bio);
    });

    it('should return 400 if required fields are missing', async () => {
      const updateData = {
        // name is missing
        email: 'updated@example.com'
      };

      const res = await request(app)
        .put('/api/users/me')
        .set('x-auth-token', token)
        .send(updateData)
        .expect(400);

      expect(res.body.errors).toBeDefined();
    });

    it('should return 400 if email is already in use', async () => {
      // Try to update to admin's email
      const updateData = {
        name: 'Updated Name',
        email: adminUser.email
      };

      const res = await request(app)
        .put('/api/users/me')
        .set('x-auth-token', token)
        .send(updateData)
        .expect(400);

      expect(res.body.msg).toBe('Email already in use');
    });
  });

  describe('PUT /api/users/password', () => {
    it('should update current user password', async () => {
      const passwordData = {
        currentPassword: 'password123',
        newPassword: 'newpassword123'
      };

      const res = await request(app)
        .put('/api/users/password')
        .set('x-auth-token', token)
        .send(passwordData)
        .expect(200);

      expect(res.body.msg).toBe('Password updated successfully');
    });

    it('should return 400 if current password is incorrect', async () => {
      const passwordData = {
        currentPassword: 'wrongpassword',
        newPassword: 'newpassword123'
      };

      const res = await request(app)
        .put('/api/users/password')
        .set('x-auth-token', token)
        .send(passwordData)
        .expect(400);

      expect(res.body.msg).toBe('Current password is incorrect');
    });

    it('should return 400 if new password is too short', async () => {
      const passwordData = {
        currentPassword: 'password123',
        newPassword: 'short'
      };

      const res = await request(app)
        .put('/api/users/password')
        .set('x-auth-token', token)
        .send(passwordData)
        .expect(400);

      expect(res.body.errors).toBeDefined();
    });
  });

  describe('GET /api/users/:id', () => {
    it('should get user profile by ID', async () => {
      const res = await request(app)
        .get(`/api/users/${testUser._id}`)
        .set('x-auth-token', token)
        .expect(200);

      expect(res.body.name).toBe(testUser.name);
      expect(res.body.email).toBe(testUser.email);
      expect(res.body.password).toBeUndefined(); // Password should not be returned
    });

    it('should return 404 if user does not exist', async () => {
      const nonExistentId = mongoose.Types.ObjectId();
      
      const res = await request(app)
        .get(`/api/users/${nonExistentId}`)
        .set('x-auth-token', token)
        .expect(404);

      expect(res.body.msg).toBe('User not found');
    });
  });

  describe('GET /api/users/:id/statistics', () => {
    it('should get user statistics for own profile', async () => {
     // Create a test project
     const project = new Project({
      name: 'Test Project',
      description: 'This is a test project',
      owner: testUser._id,
      members: [testUser._id]
    });
    await project.save();

    // Create some tasks
    const completedTask = new Task({
      title: 'Completed Task',
      description: 'This is a completed task',
      project: project._id,
      createdBy: testUser._id,
      assignedTo: testUser._id,
      status: 'completed',
      completedAt: new Date()
    });
    await completedTask.save();

    const inProgressTask = new Task({
      title: 'In Progress Task',
      description: 'This is an in-progress task',
      project: project._id,
      createdBy: testUser._id,
      assignedTo: testUser._id,
      status: 'in-progress'
    });
    await inProgressTask.save();

    const pendingTask = new Task({
      title: 'Pending Task',
      description: 'This is a pending task',
      project: project._id,
      createdBy: testUser._id,
      assignedTo: testUser._id,
      status: 'pending'
    });
    await pendingTask.save();

    const res = await request(app)
      .get(`/api/users/${testUser._id}/statistics`)
      .set('x-auth-token', token)
      .expect(200);

    expect(res.body.totalTasks).toBe(3);
    expect(res.body.completedTasks).toBe(1);
    expect(res.body.inProgressTasks).toBe(1);
    expect(res.body.pendingTasks).toBe(1);
    expect(res.body.totalProjects).toBe(1);
    expect(res.body.ownedProjects).toBe(1);
    expect(res.body.completionPercentage).toBe(33); // 1/3 * 100 = 33.33... rounded to 33
  });

  it('should allow admin to get other user statistics', async () => {
    const res = await request(app)
      .get(`/api/users/${testUser._id}/statistics`)
      .set('x-auth-token', adminToken)
      .expect(200);

    expect(res.body).toHaveProperty('totalTasks');
    expect(res.body).toHaveProperty('completedTasks');
    expect(res.body).toHaveProperty('totalProjects');
  });

  it('should return 403 for non-admin trying to get other user statistics', async () => {
    // Create another regular user
    const anotherUser = new User({
      name: 'Another User',
      email: 'another@example.com',
      password: 'password123',
      role: 'user'
    });
    await anotherUser.save();

    // Generate token for another user
    const anotherPayload = { user: { id: anotherUser._id } };
    const anotherToken = jwt.sign(anotherPayload, config.jwtSecret, { expiresIn: '1h' });

    const res = await request(app)
      .get(`/api/users/${testUser._id}/statistics`)
      .set('x-auth-token', anotherToken)
      .expect(403);

    expect(res.body.msg).toBe('Unauthorized access');
  });
});

describe('DELETE /api/users/me', () => {
  it('should delete current user if no owned projects', async () => {
    // Create another user to delete
    const userToDelete = new User({
      name: 'Delete Me',
      email: 'delete@example.com',
      password: 'password123'
    });
    await userToDelete.save();

    // Generate token for user to delete
    const deletePayload = { user: { id: userToDelete._id } };
    const deleteToken = jwt.sign(deletePayload, config.jwtSecret, { expiresIn: '1h' });

    const res = await request(app)
      .delete('/api/users/me')
      .set('x-auth-token', deleteToken)
      .expect(200);

    expect(res.body.msg).toBe('User deleted successfully');

    // Verify user was deleted
    const deletedUser = await User.findById(userToDelete._id);
    expect(deletedUser).toBeNull();
  });

  it('should not delete user if they own projects', async () => {
    // Create a project owned by testUser
    const project = new Project({
      name: 'Test Project',
      description: 'This is a test project',
      owner: testUser._id
    });
    await project.save();

    const res = await request(app)
      .delete('/api/users/me')
      .set('x-auth-token', token)
      .expect(400);

    expect(res.body.msg).toBe('Cannot delete account while owning projects. Transfer ownership or delete projects first.');

    // Verify user still exists
    const user = await User.findById(testUser._id);
    expect(user).toBeTruthy();
  });
});

describe('DELETE /api/users/:id', () => {
  it('should allow admin to delete other users', async () => {
    // Create a user to be deleted
    const userToDelete = new User({
      name: 'Delete Me',
      email: 'delete@example.com',
      password: 'password123',
      role: 'user'
    });
    await userToDelete.save();

    const res = await request(app)
      .delete(`/api/users/${userToDelete._id}`)
      .set('x-auth-token', adminToken)
      .expect(200);

    expect(res.body.msg).toBe('User deleted successfully');

    // Verify user was deleted
    const deletedUser = await User.findById(userToDelete._id);
    expect(deletedUser).toBeNull();
  });

  it('should not allow regular users to delete other users', async () => {
    // Create another user
    const anotherUser = new User({
      name: 'Another User',
      email: 'another@example.com',
      password: 'password123'
    });
    await anotherUser.save();

    const res = await request(app)
      .delete(`/api/users/${anotherUser._id}`)
      .set('x-auth-token', token) // Using regular user token
      .expect(403);

    expect(res.body.msg).toBe('Unauthorized access');

    // Verify user still exists
    const user = await User.findById(anotherUser._id);
    expect(user).toBeTruthy();
  });

  it('should not allow deleting admin users', async () => {
    const res = await request(app)
      .delete(`/api/users/${adminUser._id}`)
      .set('x-auth-token', adminToken) // Even with admin token
      .expect(400);

    expect(res.body.msg).toBe('Cannot delete admin user');

    // Verify admin user still exists
    const admin = await User.findById(adminUser._id);
    expect(admin).toBeTruthy();
  });

  it('should reassign owned projects when deleting a user', async () => {
    // Create a user to be deleted
    const userToDelete = new User({
      name: 'Delete Me',
      email: 'delete@example.com',
      password: 'password123'
    });
    await userToDelete.save();

    // Create another user as project member
    const memberUser = new User({
      name: 'Project Member',
      email: 'member@example.com',
      password: 'password123'
    });
    await memberUser.save();

    // Create a project owned by userToDelete with memberUser as member
    const project = new Project({
      name: 'Test Project',
      description: 'This is a test project',
      owner: userToDelete._id,
      members: [userToDelete._id, memberUser._id]
    });
    await project.save();

    // Create a task assigned to userToDelete
    const task = new Task({
      title: 'Test Task',
      description: 'This is a test task',
      project: project._id,
      createdBy: userToDelete._id,
      assignedTo: userToDelete._id
    });
    await task.save();

    // Admin deletes the user
    const res = await request(app)
      .delete(`/api/users/${userToDelete._id}`)
      .set('x-auth-token', adminToken)
      .expect(200);

    expect(res.body.msg).toBe('User deleted successfully');

    // Verify project ownership was transferred to a member
    const updatedProject = await Project.findById(project._id);
    expect(updatedProject).toBeTruthy();
    expect(updatedProject.owner.toString()).toBe(memberUser._id.toString());

    // Verify task was reassigned
    const updatedTask = await Task.findById(task._id);
    expect(updatedTask).toBeTruthy();
    expect(updatedTask.assignedTo.toString()).toBe(memberUser._id.toString());
  });
});

describe('GET /api/users/search/:query', () => {
  it('should search users by name or email', async () => {
    // Create some users with searchable names/emails
    const userA = new User({
      name: 'Search Test User',
      email: 'searchtest@example.com',
      password: 'password123'
    });
    await userA.save();

    const userB = new User({
      name: 'Another User',
      email: 'search_this@example.com',
      password: 'password123'
    });
    await userB.save();

    // Search by name
    const nameRes = await request(app)
      .get('/api/users/search/search')
      .set('x-auth-token', token)
      .expect(200);

    expect(nameRes.body).toBeInstanceOf(Array);
    expect(nameRes.body.length).toBeGreaterThanOrEqual(1);
    expect(nameRes.body.some(user => user.name === userA.name)).toBe(true);

    // Search by email
    const emailRes = await request(app)
      .get('/api/users/search/search_this')
      .set('x-auth-token', token)
      .expect(200);

    expect(emailRes.body).toBeInstanceOf(Array);
    expect(emailRes.body.length).toBeGreaterThanOrEqual(1);
    expect(emailRes.body.some(user => user.email === userB.email)).toBe(true);
  });

  it('should return empty array if no users match search', async () => {
    const res = await request(app)
      .get('/api/users/search/nonexistentuser12345')
      .set('x-auth-token', token)
      .expect(200);

    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBe(0);
  });
});
});