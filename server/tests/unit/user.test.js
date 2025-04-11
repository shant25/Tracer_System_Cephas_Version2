const mongoose = require('mongoose');
const User = require('../../models/User');

describe('User Model', () => {
  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true 
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  it('should create and save a user successfully', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };

    const user = new User(userData);
    const savedUser = await user.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.name).toBe(userData.name);
    expect(savedUser.email).toBe(userData.email);
    expect(savedUser.createdAt).toBeDefined();
  });

  it('should fail to save user without required fields', async () => {
    const userWithoutName = new User({
      email: 'test@example.com',
      password: 'password123'
    });

    let error;
    try {
      await userWithoutName.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.name).toBeDefined();
  });

  it('should not allow duplicate email addresses', async () => {
    // Create first user
    const firstUser = new User({
      name: 'First User',
      email: 'duplicate@example.com',
      password: 'password123'
    });
    await firstUser.save();

    // Try to create second user with same email
    const secondUser = new User({
      name: 'Second User',
      email: 'duplicate@example.com',
      password: 'password456'
    });

    let error;
    try {
      await secondUser.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.code).toBe(11000); // MongoDB duplicate key error code
  });

  it('should validate email format', async () => {
    const userWithInvalidEmail = new User({
      name: 'Test User',
      email: 'invalid-email',
      password: 'password123'
    });

    let error;
    try {
      await userWithInvalidEmail.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.email).toBeDefined();
  });
});