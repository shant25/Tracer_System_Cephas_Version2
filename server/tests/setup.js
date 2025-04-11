// tests/setup.js
// This file runs before each test file

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

// Setup MongoDB Memory Server
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  // Connect to the in-memory database
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Clear all collections before each test
beforeEach(async () => {
  const collections = mongoose.connection.collections;
  
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

// Close connection after all tests are done
afterAll(async () => {
  await mongoose.connection.close();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

// tests/global-setup.js
// This file runs once before all test files

module.exports = async function() {
  // You can add global setup logic here if needed
  console.log('Starting the test suite');
  
  // Set environment variables for testing
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test-jwt-secret';
  process.env.JWT_EXPIRES_IN = '1h';
};

// tests/global-teardown.js
// This file runs once after all test files

module.exports = async function() {
  // You can add global teardown logic here if needed
  console.log('All tests completed');
};