/**
 * Task model for Tracer App
 */
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    maxlength: [100, 'Task title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: [true, 'Project is required']
  },
  status: {
    type: String,
    enum: ['todo', 'in-progress', 'review', 'completed'],
    default: 'todo'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  dueDate: {
    type: Date
  },
  completedAt: {
    type: Date
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Creator is required']
  },
  tags: [String],
  attachments: [{
    filename: String,
    originalname: String,
    path: String,
    size: Number,
    mimetype: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    text: {
      type: String,
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  timeTracking: {
    estimate: {
      type: Number, // Time estimate in minutes
      default: 0
    },
    timeSpent: {
      type: Number, // Time spent in minutes
      default: 0
    },
    logs: [{
      startTime: Date,
      endTime: Date,
      duration: Number, // Duration in minutes
      description: String,
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    }]
  },
  subtasks: [{
    title: {
      type: String,
      required: true,
      trim: true
    },
    completed: {
      type: Boolean,
      default: false
    },
    completedAt: Date
  }],
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

// Indices
taskSchema.index({ project: 1 });
taskSchema.index({ assignedTo: 1 });
taskSchema.index({ status: 1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ priority: 1 });
taskSchema.index({ 'tags': 1 });

// Update the updatedAt field before saving
taskSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Set completedAt when status changes to completed
  if (this.isModified('status') && this.status === 'completed' && !this.completedAt) {
    this.completedAt = Date.now();
  }
  
  // Reset completedAt when status changes from completed to something else
  if (this.isModified('status') && this.status !== 'completed' && this.completedAt) {
    this.completedAt = null;
  }
  
  next();
});

// Method to calculate subtask completion percentage
taskSchema.methods.calculateSubtaskProgress = function() {
  if (!this.subtasks || this.subtasks.length === 0) {
    return 0;
  }
  
  const completedSubtasks = this.subtasks.filter(subtask => subtask.completed).length;
  return Math.round((completedSubtasks / this.subtasks.length) * 100);
};

// Method to log time
taskSchema.methods.logTime = function(userId, startTime, endTime, description = '') {
  // Calculate duration in minutes
  const start = new Date(startTime);
  const end = new Date(endTime);
  const durationMs = end - start;
  const durationMinutes = Math.round(durationMs / 60000);
  
  // Add time log
  this.timeTracking.logs.push({
    startTime: start,
    endTime: end,
    duration: durationMinutes,
    description,
    user: userId
  });
  
  // Update total time spent
  this.timeTracking.timeSpent += durationMinutes;
  
  return durationMinutes;
};

// Method to add comment
taskSchema.methods.addComment = function(userId, text) {
  this.comments.push({
    text,
    user: userId,
    createdAt: Date.now()
  });
};

// Method to add subtask
taskSchema.methods.addSubtask = function(title) {
  this.subtasks.push({
    title,
    completed: false
  });
};

// Method to attach file
taskSchema.methods.addAttachment = function(fileInfo) {
  this.attachments.push({
    ...fileInfo,
    uploadedAt: Date.now()
  });
};

// Create Task model
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;