const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const config = require('../../config/default');

describe('Auth Routes', () => {
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

  describe('POST /api/auth/register', () => {
    it('should register a new user and return a token', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      const res = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(200);

      expect(res.body.token).toBeDefined();

      // Verify user was created in database
      const user = await User.findOne({ email: userData.email });
      expect(user).toBeTruthy();
      expect(user.name).toBe(userData.name);
    });

    it('should return 400 if required fields are missing', async () => {
      const userData = {
        name: 'Test User',
        // email is missing
        password: 'password123'
      };

      const res = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(res.body.errors).toBeDefined();
    });

    it('should return 400 if user already exists', async () => {
      // Create a user first
      const existingUser = new User({
        name: 'Existing User',
        email: 'existing@example.com',
        password: 'password123'
      });
      await existingUser.save();

      // Try to register with the same email
      const userData = {
        name: 'New User',
        email: 'existing@example.com',
        password: 'password456'
      };

      const res = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(res.body.msg).toBe('User already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login user and return a token', async () => {
      // Create a user first
      const user = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });
      await user.save();

      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const res = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(res.body.token).toBeDefined();
    });

    it('should return 400 if user does not exist', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };

      const res = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(400);

      expect(res.body.msg).toBe('Invalid credentials');
    });

    it('should return 400 if password is incorrect', async () => {
      // Create a user first
      const user = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });
      await user.save();

      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      const res = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(400);

      expect(res.body.msg).toBe('Invalid credentials');
    });
  });

  describe('GET /api/auth/user', () => {
    it('should return user data if authenticated', async () => {
      // Create a user
      const user = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });
      await user.save();

      // Create token for the user
      const payload = { user: { id: user._id } };
      const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '1h' });

      const res = await request(app)
        .get('/api/auth/user')
        .set('x-auth-token', token)
        .expect(200);

      expect(res.body.name).toBe(user.name);
      expect(res.body.email).toBe(user.email);
      expect(res.body.password).toBeUndefined(); // Password should not be returned
    });

    it('should return 401 if no token is provided', async () => {
      const res = await request(app)
        .get('/api/auth/user')
        .expect(401);

      expect(res.body.msg).toBe('No token, authorization denied');
    });

    it('should return 401 if token is invalid', async () => {
      const res = await request(app)
        .get('/api/auth/user')
        .set('x-auth-token', 'invalid-token')
        .expect(401);

      expect(res.body.msg).toBe('Token is not valid');
    });
  });
});