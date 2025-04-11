/**
 * Main routes index for Tracer App
 */
const express = require('express');
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const projectRoutes = require('./project.routes');
const taskRoutes = require('./task.routes');
const { ApiError } = require('../utils/apiResponse');

const router = express.Router();

// Mount route groups
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/projects', projectRoutes);
router.use('/tasks', taskRoutes);

// API Documentation route
router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Tracer API v1',
    documentation: '/api/docs',
    version: '1.0.0'
  });
});

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

// Handle 404 routes
router.use((req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
});

module.exports = router;