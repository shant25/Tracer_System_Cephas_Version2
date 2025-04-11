// Global test setup that runs once before all test files
module.exports = async () => {
  // Set environment variables for tests
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test_secret_key_for_jwt_signing';
  process.env.JWT_EXPIRES_IN = '1h';
  process.env.JWT_RESET_SECRET = 'test_reset_token_secret';
  
  console.log('Test environment set up successfully.');
  
  // Allow MongoDB Memory Server to start completely
  await new Promise(resolve => setTimeout(resolve, 1000));
};