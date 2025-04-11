const mongoose = require('mongoose');
const Task = require('../../models/Task');
const User = require('../../models/User');
const Project = require('../../models/Project');

describe('Task Model', () => {
  let testUser;
  let testProject;

  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true 
    });

    // Create a test user
    testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
    await testUser.save();

    // Create a test project
    testProject = new Project({
      name: 'Test Project',
      description: 'This is a test project',
      owner: testUser._id,
      members: [testUser._id]
    });
    await testProject.save();
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Project.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Task.deleteMany({});
  });

  it('should create and save a task successfully', async () => {
    const taskData = {
      title: 'Test Task',
      description: 'This is a test task',
      project: testProject._id,
      createdBy: testUser._id,
      assignedTo: testUser._id,
      priority: 'medium',
      status: 'pending',
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) // 7 days from now
    };

    const task = new Task(taskData);
    const savedTask = await task.save();

    expect(savedTask._id).toBeDefined();
    expect(savedTask.title).toBe(taskData.title);
    expect(savedTask.description).toBe(taskData.description);
    expect(savedTask.project.toString()).toBe(testProject._id.toString());
    expect(savedTask.createdBy.toString()).toBe(testUser._id.toString());
    expect(savedTask.assignedTo.toString()).toBe(testUser._id.toString());
    expect(savedTask.priority).toBe(taskData.priority);
    expect(savedTask.status).toBe(taskData.status);
    expect(savedTask.dueDate).toBeDefined();
    expect(savedTask.createdAt).toBeDefined();
  });

  it('should fail to save task without required fields', async () => {
    // Task without title
    const taskWithoutTitle = new Task({
      description: 'This is a test task',
      project: testProject._id,
      createdBy: testUser._id,
      assignedTo: testUser._id
    });

    let error;
    try {
      await taskWithoutTitle.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.title).toBeDefined();
  });

  it('should update task status correctly', async () => {
    const task = new Task({
      title: 'Test Task',
      description: 'This is a test task',
      project: testProject._id,
      createdBy: testUser._id,
      assignedTo: testUser._id,
      status: 'pending'
    });
    await task.save();

    // Update status to in-progress
    task.status = 'in-progress';
    await task.save();

    // Update status to completed
    task.status = 'completed';
    const updatedTask = await task.save();

    expect(updatedTask.status).toBe('completed');
    expect(updatedTask.completedAt).toBeDefined();
  });

  it('should not allow invalid priority', async () => {
    const task = new Task({
      title: 'Test Task',
      description: 'This is a test task',
      project: testProject._id,
      createdBy: testUser._id,
      assignedTo: testUser._id,
      priority: 'invalid-priority' // Invalid priority
    });

    let error;
    try {
      await task.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.priority).toBeDefined();
  });

  it('should not allow invalid status', async () => {
    const task = new Task({
      title: 'Test Task',
      description: 'This is a test task',
      project: testProject._id,
      createdBy: testUser._id,
      assignedTo: testUser._id,
      status: 'invalid-status' // Invalid status
    });

    let error;
    try {
      await task.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.status).toBeDefined();
  });

  it('should add comments to a task', async () => {
    const task = new Task({
      title: 'Test Task',
      description: 'This is a test task',
      project: testProject._id,
      createdBy: testUser._id,
      assignedTo: testUser._id
    });
    await task.save();

    // Add a comment
    task.comments.push({
      user: testUser._id,
      text: 'This is a test comment',
      name: testUser.name
    });
    
    const updatedTask = await task.save();

    expect(updatedTask.comments.length).toBe(1);
    expect(updatedTask.comments[0].text).toBe('This is a test comment');
    expect(updatedTask.comments[0].user.toString()).toBe(testUser._id.toString());
    expect(updatedTask.comments[0].name).toBe(testUser.name);
    expect(updatedTask.comments[0].date).toBeDefined();
  });
});