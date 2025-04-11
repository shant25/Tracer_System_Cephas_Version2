/**
 * Validation utilities for Tracer App
 */
const Joi = require('joi');

/**
 * User validation schemas
 */
const userValidation = {
  // Register user schema
  register: Joi.object({
    firstName: Joi.string().trim().min(2).max(50).required()
      .messages({
        'string.empty': 'First name is required',
        'string.min': 'First name must be at least 2 characters',
        'string.max': 'First name cannot exceed 50 characters',
        'any.required': 'First name is required'
      }),
    lastName: Joi.string().trim().min(2).max(50).required()
      .messages({
        'string.empty': 'Last name is required',
        'string.min': 'Last name must be at least 2 characters',
        'string.max': 'Last name cannot exceed 50 characters',
        'any.required': 'Last name is required'
      }),
    email: Joi.string().email().trim().lowercase().required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'string.empty': 'Email is required',
        'any.required': 'Email is required'
      }),
    password: Joi.string().min(8).required()
      .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])'))
      .messages({
        'string.min': 'Password must be at least 8 characters',
        'string.empty': 'Password is required',
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
        'any.required': 'Password is required'
      }),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required()
      .messages({
        'any.only': 'Passwords do not match',
        'string.empty': 'Please confirm your password',
        'any.required': 'Please confirm your password'
      }),
    role: Joi.string().valid('user', 'admin', 'manager').default('user')
  }),
  
  // Login user schema
  login: Joi.object({
    email: Joi.string().email().trim().lowercase().required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'string.empty': 'Email is required',
        'any.required': 'Email is required'
      }),
    password: Joi.string().required()
      .messages({
        'string.empty': 'Password is required',
        'any.required': 'Password is required'
      })
  }),
  
  // Update user schema
  update: Joi.object({
    firstName: Joi.string().trim().min(2).max(50)
      .messages({
        'string.min': 'First name must be at least 2 characters',
        'string.max': 'First name cannot exceed 50 characters'
      }),
    lastName: Joi.string().trim().min(2).max(50)
      .messages({
        'string.min': 'Last name must be at least 2 characters',
        'string.max': 'Last name cannot exceed 50 characters'
      }),
    email: Joi.string().email().trim().lowercase()
      .messages({
        'string.email': 'Please provide a valid email address'
      }),
    role: Joi.string().valid('user', 'admin', 'manager'),
    isActive: Joi.boolean()
  }),
  
  // Change password schema
  changePassword: Joi.object({
    currentPassword: Joi.string().required()
      .messages({
        'string.empty': 'Current password is required',
        'any.required': 'Current password is required'
      }),
    newPassword: Joi.string().min(8).required()
      .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])'))
      .messages({
        'string.min': 'New password must be at least 8 characters',
        'string.empty': 'New password is required',
        'string.pattern.base': 'New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
        'any.required': 'New password is required'
      }),
    confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required()
      .messages({
        'any.only': 'Passwords do not match',
        'string.empty': 'Please confirm your new password',
        'any.required': 'Please confirm your new password'
      })
  }),
  
  // Reset password schema
  resetPassword: Joi.object({
    resetToken: Joi.string().required()
      .messages({
        'string.empty': 'Reset token is required',
        'any.required': 'Reset token is required'
      }),
    password: Joi.string().min(8).required()
      .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])'))
      .messages({
        'string.min': 'Password must be at least 8 characters',
        'string.empty': 'Password is required',
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
        'any.required': 'Password is required'
      }),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required()
      .messages({
        'any.only': 'Passwords do not match',
        'string.empty': 'Please confirm your password',
        'any.required': 'Please confirm your password'
      })
  })
};

/**
 * Project validation schemas
 */
const projectValidation = {
  // Create project schema
  create: Joi.object({
    name: Joi.string().trim().min(3).max(100).required()
      .messages({
        'string.empty': 'Project name is required',
        'string.min': 'Project name must be at least 3 characters',
        'string.max': 'Project name cannot exceed 100 characters',
        'any.required': 'Project name is required'
      }),
    description: Joi.string().trim().max(500)
      .messages({
        'string.max': 'Description cannot exceed 500 characters'
      }),
    status: Joi.string().valid('planning', 'active', 'completed', 'on-hold', 'cancelled')
      .default('planning'),
    startDate: Joi.date().iso(),
    endDate: Joi.date().iso().min(Joi.ref('startDate'))
      .messages({
        'date.min': 'End date must be after start date'
      }),
    priority: Joi.string().valid('low', 'medium', 'high', 'critical')
      .default('medium'),
    tags: Joi.array().items(Joi.string().trim())
  }),
  
  // Update project schema
  update: Joi.object({
    name: Joi.string().trim().min(3).max(100)
      .messages({
        'string.min': 'Project name must be at least 3 characters',
        'string.max': 'Project name cannot exceed 100 characters'
      }),
    description: Joi.string().trim().max(500)
      .messages({
        'string.max': 'Description cannot exceed 500 characters'
      }),
    status: Joi.string().valid('planning', 'active', 'completed', 'on-hold', 'cancelled'),
    startDate: Joi.date().iso(),
    endDate: Joi.date().iso().min(Joi.ref('startDate'))
      .messages({
        'date.min': 'End date must be after start date'
      }),
    priority: Joi.string().valid('low', 'medium', 'high', 'critical'),
    tags: Joi.array().items(Joi.string().trim()),
    isArchived: Joi.boolean()
  }),
  
  // Add team member schema
  addTeamMember: Joi.object({
    userId: Joi.string().required()
      .messages({
        'string.empty': 'User ID is required',
        'any.required': 'User ID is required'
      }),
    role: Joi.string().valid('owner', 'manager', 'member', 'guest')
      .default('member')
  })
};

/**
 * Task validation schemas
 */
const taskValidation = {
  // Create task schema
  create: Joi.object({
    title: Joi.string().trim().min(3).max(100).required()
      .messages({
        'string.empty': 'Task title is required',
        'string.min': 'Task title must be at least 3 characters',
        'string.max': 'Task title cannot exceed 100 characters',
        'any.required': 'Task title is required'
      }),
    description: Joi.string().trim().max(1000)
      .messages({
        'string.max': 'Description cannot exceed 1000 characters'
      }),
    project: Joi.string().required()
      .messages({
        'string.empty': 'Project ID is required',
        'any.required': 'Project ID is required'
      }),
    status: Joi.string().valid('todo', 'in-progress', 'review', 'completed')
      .default('todo'),
    priority: Joi.string().valid('low', 'medium', 'high', 'critical')
      .default('medium'),
    dueDate: Joi.date().iso(),
    assignedTo: Joi.string(),
    tags: Joi.array().items(Joi.string().trim()),
    subtasks: Joi.array().items(
      Joi.object({
        title: Joi.string().trim().required()
          .messages({
            'string.empty': 'Subtask title is required',
            'any.required': 'Subtask title is required'
          }),
        completed: Joi.boolean().default(false)
      })
    ),
    timeTracking: Joi.object({
      estimate: Joi.number().min(0)
    })
  }),
  
  // Update task schema
  update: Joi.object({
    title: Joi.string().trim().min(3).max(100)
      .messages({
        'string.min': 'Task title must be at least 3 characters',
        'string.max': 'Task title cannot exceed 100 characters'
      }),
    description: Joi.string().trim().max(1000)
      .messages({
        'string.max': 'Description cannot exceed 1000 characters'
      }),
    status: Joi.string().valid('todo', 'in-progress', 'review', 'completed'),
    priority: Joi.string().valid('low', 'medium', 'high', 'critical'),
    dueDate: Joi.date().iso(),
    assignedTo: Joi.string().allow(null, ''),
    tags: Joi.array().items(Joi.string().trim()),
    timeTracking: Joi.object({
      estimate: Joi.number().min(0)
    })
  }),
  
  // Add comment schema
  addComment: Joi.object({
    text: Joi.string().trim().required()
      .messages({
        'string.empty': 'Comment text is required',
        'any.required': 'Comment text is required'
      })
  }),
  
  // Add subtask schema
  addSubtask: Joi.object({
    title: Joi.string().trim().required()
      .messages({
        'string.empty': 'Subtask title is required',
        'any.required': 'Subtask title is required'
      })
  }),
  
  // Update subtask schema
  updateSubtask: Joi.object({
    subtaskId: Joi.string().required()
      .messages({
        'string.empty': 'Subtask ID is required',
        'any.required': 'Subtask ID is required'
      }),
    title: Joi.string().trim(),
    completed: Joi.boolean()
  }),
  
  // Log time schema
  logTime: Joi.object({
    startTime: Joi.date().iso().required()
      .messages({
        'date.base': 'Start time must be a valid date',
        'any.required': 'Start time is required'
      }),
    endTime: Joi.date().iso().min(Joi.ref('startTime')).required()
      .messages({
        'date.base': 'End time must be a valid date',
        'date.min': 'End time must be after start time',
        'any.required': 'End time is required'
      }),
    description: Joi.string().trim()
  })
};

module.exports = {
  userValidation,
  projectValidation,
  taskValidation
};