// File: project.model.js (previously project.modal.js)

/**
 * Project model for Tracer App
 */
const mongoose = require('mongoose');
const slugify = require('slugify');
const crypto = require('crypto');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true,
    maxlength: [100, 'Project name cannot exceed 100 characters']
  },
  slug: {
    type: String,
    unique: true,
    index: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  status: {
    type: String,
    enum: ['planning', 'active', 'completed', 'on-hold', 'cancelled'],
    default: 'planning'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Project owner is required']
  },
  team: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['owner', 'manager', 'member', 'guest'],
      default: 'member'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  tags: [String],
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual populate of tasks
projectSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'project',
  justOne: false
});

// Indices
projectSchema.index({ owner: 1 });
projectSchema.index({ 'team.user': 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ startDate: 1, endDate: 1 });

// Generate slug before saving
projectSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    // Generate a slug from the name
    this.slug = slugify(this.name, { 
      lower: true,
      strict: true,
      // Add a unique identifier to ensure uniqueness
      suffix: '-' + Math.floor(Math.random() * 1000000).toString()
    });
  }
  
  // Update updatedAt timestamp
  this.updatedAt = Date.now();
  
  next();
});

// Calculate progress
projectSchema.methods.calculateProgress = async function() {
  // Get all tasks for this project
  await this.populate('tasks');
  
  if (!this.tasks || this.tasks.length === 0) {
    return 0;
  }
  
  // Count completed tasks
  const completedTasks = this.tasks.filter(task => task.status === 'completed').length;
  
  // Calculate percentage
  return Math.round((completedTasks / this.tasks.length) * 100);
};

// Add user to team
projectSchema.methods.addTeamMember = function(userId, role = 'member') {
  // Check if user is already in the team
  const existingMember = this.team.find(member => member.user.toString() === userId.toString());
  
  if (existingMember) {
    // Update role if user is already in the team
    existingMember.role = role;
  } else {
    // Add new team member
    this.team.push({
      user: userId,
      role: role,
      addedAt: Date.now()
    });
  }
};

// Remove user from team
projectSchema.methods.removeTeamMember = function(userId) {
  this.team = this.team.filter(member => member.user.toString() !== userId.toString());
};

// Check if user is in team
projectSchema.methods.isTeamMember = function(userId) {
  return this.team.some(member => member.user.toString() === userId.toString());
};

// Create Project model
const Project = mongoose.model('Project', projectSchema);

// Later in the code, generate a better random slug:
this.slug = slugify(this.name, { 
  lower: true,
  strict: true
}) + '-' + crypto.randomBytes(4).toString('hex');

module.exports = Project;