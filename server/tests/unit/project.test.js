const mongoose = require('mongoose');
const Project = require('../../models/Project');
const User = require('../../models/User');

describe('Project Model', () => {
  let testUser;

  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true 
    });

    // Create a test user for referencing in projects
    testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
    await testUser.save();
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Project.deleteMany({});
  });

  it('should create and save a project successfully', async () => {
    const projectData = {
      name: 'Test Project',
      description: 'This is a test project',
      owner: testUser._id,
      members: [testUser._id],
      startDate: new Date(),
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) // 30 days from now
    };

    const project = new Project(projectData);
    const savedProject = await project.save();

    expect(savedProject._id).toBeDefined();
    expect(savedProject.name).toBe(projectData.name);
    expect(savedProject.description).toBe(projectData.description);
    expect(savedProject.owner.toString()).toBe(testUser._id.toString());
    expect(savedProject.members[0].toString()).toBe(testUser._id.toString());
    expect(savedProject.status).toBe('active'); // Default status
    expect(savedProject.createdAt).toBeDefined();
  });

  it('should fail to save project without required fields', async () => {
    // Project without name
    const projectWithoutName = new Project({
      description: 'This is a test project',
      owner: testUser._id
    });

    let error;
    try {
      await projectWithoutName.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.name).toBeDefined();
  });

  it('should update project status correctly', async () => {
    const project = new Project({
      name: 'Test Project',
      description: 'This is a test project',
      owner: testUser._id,
      members: [testUser._id]
    });
    await project.save();

    // Update status to completed
    project.status = 'completed';
    const updatedProject = await project.save();

    expect(updatedProject.status).toBe('completed');
  });

  it('should not allow invalid status', async () => {
    const project = new Project({
      name: 'Test Project',
      description: 'This is a test project',
      owner: testUser._id,
      members: [testUser._id],
      status: 'invalid-status' // Invalid status
    });

    let error;
    try {
      await project.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.status).toBeDefined();
  });

  it('should add and remove members correctly', async () => {
    // Create a project
    const project = new Project({
      name: 'Test Project',
      description: 'This is a test project',
      owner: testUser._id,
      members: [testUser._id]
    });
    await project.save();

    // Create a new user to add as member
    const newMember = new User({
      name: 'New Member',
      email: 'member@example.com',
      password: 'password123'
    });
    await newMember.save();

    // Add the new member
    project.members.push(newMember._id);
    await project.save();

    // Check if member was added
    let updatedProject = await Project.findById(project._id);
    expect(updatedProject.members.length).toBe(2);
    expect(updatedProject.members[1].toString()).toBe(newMember._id.toString());

    // Remove the new member
    updatedProject.members = updatedProject.members.filter(
      id => id.toString() !== newMember._id.toString()
    );
    await updatedProject.save();

    // Check if member was removed
    updatedProject = await Project.findById(project._id);
    expect(updatedProject.members.length).toBe(1);
    expect(updatedProject.members[0].toString()).toBe(testUser._id.toString());
  });
});