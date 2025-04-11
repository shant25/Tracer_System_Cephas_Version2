const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../../config/default');
const User = require('../../models/User');
const authMiddleware = require('../../middleware/auth');

// Mock Express request and response
const mockRequest = (token) => {
  return {
    header: jest.fn().mockReturnValue(token)
  };
};

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  return res;
};

// Mock next function
const mockNext = jest.fn();

describe('Auth Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 401 if no token is provided', async () => {
    const req = mockRequest(null);
    const res = mockResponse();

    await authMiddleware(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ msg: 'No token, authorization denied' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 401 if token is invalid', async () => {
    const req = mockRequest('invalid-token');
    const res = mockResponse();

    jwt.verify = jest.fn().mockImplementation(() => {
      throw new Error('Invalid token');
    });

    await authMiddleware(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ msg: 'Token is not valid' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should call next() if token is valid', async () => {
    const req = mockRequest('valid-token');
    const res = mockResponse();
    const user = { id: 'user123' };

    jwt.verify = jest.fn().mockReturnValue({ user });

    await authMiddleware(req, res, mockNext);

    expect(req.user).toEqual(user);
    expect(mockNext).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});

describe('User Model Password Hashing', () => {
  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true 
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should hash password before saving user', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };

    const user = new User(userData);
    await user.save();

    // Password should be hashed and not equal to the original
    expect(user.password).not.toBe(userData.password);
    
    // Verify that the hashed password matches the original
    const passwordMatch = await bcrypt.compare(userData.password, user.password);
    expect(passwordMatch).toBe(true);
  });
});