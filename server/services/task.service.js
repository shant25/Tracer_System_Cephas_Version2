/**
 * Task service for Tracer App
 */
const Task = require('../models/task.model');
const Project = require('../models/project.model');
const User = require('../models/user.model');
const { ApiError } = require('../utils/apiResponse');
const emailService = require('./email.service');
const logger = require('../utils/logger');

/**
 * Get all tasks with filtering and pagination
 * @param {Object} filters - Filter criteria
 * @param {Object} pagination - Pagination options
 * @param {Object} user - Current user
 * @returns {Object} Tasks and pagination info
 */
const getAllTasks = async (filters, pagination, user) => {
  try {
    const { 
      project, assignedTo, status, priority, 
      dueDate, search, tags 
    } = filters;
    
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;
    
    let query = {};
    
    // Filter by project
    if (project) {
      query.project = project;
      
      // Verify project exists and user has access
      const projectDoc = await Project.findById(project);
      if (!projectDoc) {
        throw new ApiError(404, 'Project not found');
      }
      
      // Check if user has access to the project
      const hasAccess = 
        user.role === 'admin' ||
        projectDoc.owner.toString() === user.id ||
        projectDoc.team.some(member => member.user.toString() === user.id);
      
      if (!hasAccess) {
        throw new ApiError(403, 'You do not have permission to access tasks for this project');
      }
    } else {
      // If no project specified, only show tasks from projects where user is a member
      const userProjects = await Project.find({
        $or: [
          { owner: user.id },
          { 'team.user': user.id }
        ]
      }).select('_id');
      
      const projectIds = userProjects.map(project => project._id);
      
      query.project = { $in: projectIds };
    }
    
    // Filter by assigned user
    if (assignedTo) {
      query.assignedTo = assignedTo === 'me' ? user.id : assignedTo;
    }
    
    // Filter by status
    if (status) {
      query.status = status;
    }
    
    // Filter by priority
    if (priority) {
      query.priority = priority;
    }
    
    // Filter by tags
    if (tags) {
      const tagList = Array.isArray(tags) ? tags : [tags];
      query.tags = { $in: tagList };
    }
    
    // Filter by due date
    if (dueDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (dueDate === 'today') {
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        query.dueDate = {
          $gte: today,
          $lt: tomorrow
        };
      } else if (dueDate === 'week') {
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);
        
        query.dueDate = {
          $gte: today,
          $lt: nextWeek
        };
      } else if (dueDate === 'overdue') {
        query.dueDate = {
          $lt: today
        };
        query.status = { $ne: 'completed' };
      }
    }
    
    // Search by title or description
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query = {
        ...query,
        $or: [
          { title: searchRegex },
          { description: searchRegex },
          { tags: searchRegex }
        ]
      };
    }
    
    // Count total tasks
    const total = await Task.countDocuments(query);
    
    // Get tasks
    const tasks = await Task.find(query)
      .populate('project', 'name slug status')
      .populate('assignedTo', 'firstName lastName email avatar')
      .populate('createdBy', 'firstName lastName email avatar')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);
    
    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;
    
    return {
      tasks,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext,
        hasPrev
      }
    };
  } catch (error) {
    logger.error('Error in getAllTasks service:', error);
    throw error;
  }
};

/**
 * Get task by ID
 * @param {String} taskId - Task ID
 * @param {Object} user - Current user
 * @returns {Object} Task details
 */
const getTaskById = async (taskId, user) => {
  try {
    const task = await Task.findById(taskId)
      .populate('project', 'name slug status')
      .populate('assignedTo', 'firstName lastName email avatar')
      .populate('createdBy', 'firstName lastName email avatar')
      .populate('comments.user', 'firstName lastName email avatar')
      .populate('timeTracking.logs.user', 'firstName lastName email avatar');
    
    if (!task) {
      throw new ApiError(404, 'Task not found');
    }
    
    // Check if user has access to the project
    const project = await Project.findById(task.project._id);
    
    const hasAccess = 
      user.role === 'admin' ||
      project.owner.toString() === user.id ||
      project.team.some(member => member.user.toString() === user.id);
    
    if (!hasAccess) {
      throw new ApiError(403, 'You do not have permission to access this task');
    }
    
    return task;
  } catch (error) {
    logger.error('Error in getTaskById service:', error);
    throw error;
  }
};

/**
 * Create new task
 * @param {Object} taskData - Task data
 * @param {Object} user - Current user
 * @returns {Object} Created task
 */
const createTask = async (taskData, user) => {
  try {
    const { 
      title, description, project, status, priority, 
      dueDate, assignedTo, tags, subtasks, timeTracking 
    } = taskData;
    
    // Verify project exists and user has access
    const projectDoc = await Project.findById(project);
    
    if (!projectDoc) {
      throw new ApiError(404, 'Project not found');
    }
    
    // Check if user has access to the project
    const hasAccess = 
      user.role === 'admin' ||
      projectDoc.owner.toString() === user.id ||
      projectDoc.team.some(member => member.user.toString() === user.id);
    
    if (!hasAccess) {
      throw new ApiError(403, 'You do not have permission to create tasks for this project');
    }
    
    // Create task
    const task = await Task.create({
      title,
      description: description || '',
      project,
      status: status || 'todo',
      priority: priority || 'medium',
      dueDate: dueDate || null,
      assignedTo: assignedTo || null,
      createdBy: user.id,
      tags: tags || [],
      subtasks: subtasks || [],
      timeTracking: timeTracking ? {
        estimate: timeTracking.estimate || 0,
        timeSpent: 0,
        logs: []
      } : {
        estimate: 0,
        timeSpent: 0,
        logs: []
      }
    });
    
    // Populate references
    await task.populate('project', 'name slug status');
    await task.populate('assignedTo', 'firstName lastName email avatar');
    await task.populate('createdBy', 'firstName lastName email avatar');
    
    // Send task assignment email if task is assigned
    if (assignedTo && assignedTo !== user.id) {
      try {
        const assignedUser = await User.findById(assignedTo);
        if (assignedUser) {
          await emailService.sendTaskAssignmentEmail(
            assignedUser,
            task,
            projectDoc,
            user
          );
        }
      } catch (emailError) {
        logger.error('Error sending task assignment email:', emailError);
        // Continue even if email fails
      }
    }
    
    return task;
  } catch (error) {
    logger.error('Error in createTask service:', error);
    throw error;
  }
};

/**
 * Update task
 * @param {String} taskId - Task ID
 * @param {Object} taskData - Task data to update
 * @param {Object} user - Current user
 * @returns {Object} Updated task
 */
const updateTask = async (taskId, taskData, user) => {
  try {
    const {
      title, description, status, priority,
      dueDate, assignedTo, tags, timeTracking
    } = taskData;
    
    // Find task
    const task = await Task.findById(taskId);
    
    if (!task) {
      throw new ApiError(404, 'Task not found');
    }
    
    // Verify project exists and user has access
    const project = await Project.findById(task.project);
    
    const hasAccess = 
      user.role === 'admin' ||
      project.owner.toString() === user.id ||
      project.team.some(member => member.user.toString() === user.id);
    
    if (!hasAccess) {
      throw new ApiError(403, 'You do not have permission to update this task');
    }
    
    // Check if assignment is changing
    const isAssignmentChanging = 
      assignedTo !== undefined && 
      (!task.assignedTo || task.assignedTo.toString() !== assignedTo) &&
      assignedTo !== null;
    
    // Update fields
    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (assignedTo !== undefined) task.assignedTo = assignedTo;
    if (tags) task.tags = tags;
    if (timeTracking && timeTracking.estimate !== undefined) {
      task.timeTracking.estimate = timeTracking.estimate;
    }
    
    task.updatedAt = Date.now();
    
    // Save task
    await task.save();
    
    // Populate references
    await task.populate('project', 'name slug status');
    await task.populate('assignedTo', 'firstName lastName email avatar');
    await task.populate('createdBy', 'firstName lastName email avatar');
    
    // Send task assignment email if task is assigned to a new user
    if (isAssignmentChanging) {
      try {
        const assignedUser = await User.findById(assignedTo);
        if (assignedUser) {
          await emailService.sendTaskAssignmentEmail(
            assignedUser,
            task,
            project,
            user
          );
        }
      } catch (emailError) {
        logger.error('Error sending task assignment email:', emailError);
        // Continue even if email fails
      }
    }
    
    return task;
  } catch (error) {
    logger.error('Error in updateTask service:', error);
    throw error;
  }
};

/**
 * Delete task
 * @param {String} taskId - Task ID
 * @param {Object} user - Current user
 * @returns {Boolean} Success status
 */
const deleteTask = async (taskId, user) => {
  try {
    // Find task
    const task = await Task.findById(taskId);
    
    if (!task) {
      throw new ApiError(404, 'Task not found');
    }
    
    // Verify project exists and user has access
    const project = await Project.findById(task.project);
    
    const hasAccess = 
      user.role === 'admin' ||
      project.owner.toString() === user.id ||
      project.team.some(member => 
        member.user.toString() === user.id && 
        (member.role === 'owner' || member.role === 'manager')
      );
    
    // Also allow task creator to delete it
    const isCreator = task.createdBy.toString() === user.id;
    
    if (!hasAccess && !isCreator) {
      throw new ApiError(403, 'You do not have permission to delete this task');
    }
    
    // Delete task
    await Task.findByIdAndDelete(taskId);
    
    return true;
  } catch (error) {
    logger.error('Error in deleteTask service:', error);
    throw error;
  }
};

/**
 * Add comment to task
 * @param {String} taskId - Task ID
 * @param {Object} commentData - Comment data
 * @param {Object} user - Current user
 * @returns {Object} New comment
 */
const addComment = async (taskId, commentData, user) => {
  try {
    const { text } = commentData;
    
    // Find task
    const task = await Task.findById(taskId);
    
    if (!task) {
      throw new ApiError(404, 'Task not found');
    }
    
    // Verify project exists and user has access
    const project = await Project.findById(task.project);
    
    const hasAccess = 
      user.role === 'admin' ||
      project.owner.toString() === user.id ||
      project.team.some(member => member.user.toString() === user.id);
    
    if (!hasAccess) {
      throw new ApiError(403, 'You do not have permission to comment on this task');
    }
    
    // Add comment
    task.addComment(user.id, text);
    
    // Save task
    await task.save();
    
    // Populate comment user
    await task.populate('comments.user', 'firstName lastName email avatar');
    
    // Get the newly added comment
    const newComment = task.comments[task.comments.length - 1];
    
    return newComment;
  } catch (error) {
    logger.error('Error in addComment service:', error);
    throw error;
  }
};

/**
 * Add subtask to task
 * @param {String} taskId - Task ID
 * @param {Object} subtaskData - Subtask data
 * @param {Object} user - Current user
 * @returns {Object} New subtask
 */
const addSubtask = async (taskId, subtaskData, user) => {
  try {
    const { title } = subtaskData;
    
    // Find task
    const task = await Task.findById(taskId);
    
    if (!task) {
      throw new ApiError(404, 'Task not found');
    }
    
    // Verify project exists and user has access
    const project = await Project.findById(task.project);
    
    const hasAccess = 
      user.role === 'admin' ||
      project.owner.toString() === user.id ||
      project.team.some(member => member.user.toString() === user.id);
    
    if (!hasAccess) {
      throw new ApiError(403, 'You do not have permission to add subtasks to this task');
    }
    
    // Add subtask
    task.addSubtask(title);
    
    // Save task
    await task.save();
    
    // Get the newly added subtask
    const newSubtask = task.subtasks[task.subtasks.length - 1];
    
    return newSubtask;
  } catch (error) {
    logger.error('Error in addSubtask service:', error);
    throw error;
  }
};

/**
 * Update subtask
 * @param {String} taskId - Task ID
 * @param {String} subtaskId - Subtask ID
 * @param {Object} subtaskData - Subtask data to update
 * @param {Object} user - Current user
 * @returns {Object} Updated subtask
 */
const updateSubtask = async (taskId, subtaskId, subtaskData, user) => {
  try {
    const { title, completed } = subtaskData;
    
    // Find task
    const task = await Task.findById(taskId);
    
    if (!task) {
      throw new ApiError(404, 'Task not found');
    }
    
    // Verify project exists and user has access
    const project = await Project.findById(task.project);
    
    const hasAccess = 
      user.role === 'admin' ||
      project.owner.toString() === user.id ||
      project.team.some(member => member.user.toString() === user.id);
    
    if (!hasAccess) {
      throw new ApiError(403, 'You do not have permission to update subtasks for this task');
    }
    
    // Find subtask
    const subtask = task.subtasks.id(subtaskId);
    
    if (!subtask) {
      throw new ApiError(404, 'Subtask not found');
    }
    
    // Update subtask
    if (title !== undefined) subtask.title = title;
    if (completed !== undefined) {
      subtask.completed = completed;
      subtask.completedAt = completed ? Date.now() : null;
    }
    
    // Save task
    await task.save();
    
    return subtask;
  } catch (error) {
    logger.error('Error in updateSubtask service:', error);
    throw error;
  }
};

/**
 * Delete subtask
 * @param {String} taskId - Task ID
 * @param {String} subtaskId - Subtask ID
 * @param {Object} user - Current user
 * @returns {Boolean} Success status
 */
const deleteSubtask = async (taskId, subtaskId, user) => {
  try {
    // Find task
    const task = await Task.findById(taskId);
    
    if (!task) {
      throw new ApiError(404, 'Task not found');
    }
    
    // Verify project exists and user has access
    const project = await Project.findById(task.project);
    
    const hasAccess = 
      user.role === 'admin' ||
      project.owner.toString() === user.id ||
      project.team.some(member => member.user.toString() === user.id);
    
    if (!hasAccess) {
      throw new ApiError(403, 'You do not have permission to delete subtasks from this task');
    }
    
    // Find subtask
    const subtask = task.subtasks.id(subtaskId);
    
    if (!subtask) {
      throw new ApiError(404, 'Subtask not found');
    }
    
    // Remove subtask
    subtask.remove();
    
    // Save task
    await task.save();
    
    return true;
  } catch (error) {
    logger.error('Error in deleteSubtask service:', error);
    throw error;
  }
};

/**
 * Log time for task
 * @param {String} taskId - Task ID
 * @param {Object} timeData - Time tracking data
 * @param {Object} user - Current user
 * @returns {Object} Time log details
 */
const logTime = async (taskId, timeData, user) => {
  try {
    const { startTime, endTime, description } = timeData;
    
    // Find task
    const task = await Task.findById(taskId);
    
    if (!task) {
      throw new ApiError(404, 'Task not found');
    }
    
    // Verify project exists and user has access
    const project = await Project.findById(task.project);
    
    const hasAccess = 
      user.role === 'admin' ||
      project.owner.toString() === user.id ||
      project.team.some(member => member.user.toString() === user.id);
    
    if (!hasAccess) {
      throw new ApiError(403, 'You do not have permission to log time for this task');
    }
    
    // Log time
    const duration = task.logTime(user.id, startTime, endTime, description);
    
    // Save task
    await task.save();
    
    // Get the newly added time log
    const newTimeLog = task.timeTracking.logs[task.timeTracking.logs.length - 1];
    
    return {
      timeLog: newTimeLog,
      timeSpent: task.timeTracking.timeSpent,
      duration
    };
  } catch (error) {
    logger.error('Error in logTime service:', error);
    throw error;
  }
};

/**
 * Get task statistics
 * @param {Object} user - Current user
 * @returns {Object} Task statistics
 */
const getTaskStats = async (user) => {
  try {
    // Get projects accessible to user
    const userProjects = await Project.find({
      $or: [
        { owner: user.id },
        { 'team.user': user.id }
      ]
    }).select('_id');
    
    const projectIds = userProjects.map(project => project._id);
    
    // Tasks by status
    const tasksByStatus = await Task.aggregate([
      { $match: { project: { $in: projectIds } } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    // Tasks by priority
    const tasksByPriority = await Task.aggregate([
      { $match: { project: { $in: projectIds } } },
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);
    
    // Tasks assigned to user
    const assignedTasks = await Task.countDocuments({
      project: { $in: projectIds },
      assignedTo: user.id
    });
    
    // Tasks created by user
    const createdTasks = await Task.countDocuments({
      project: { $in: projectIds },
      createdBy: user.id
    });
    
    // Overdue tasks
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const overdueTasks = await Task.countDocuments({
      project: { $in: projectIds },
      dueDate: { $lt: today },
      status: { $ne: 'completed' }
    });
    
    // Format status stats
    const statusStats = {
      todo: 0,
      'in-progress': 0,
      review: 0,
      completed: 0
    };
    
    tasksByStatus.forEach(status => {
      statusStats[status._id] = status.count;
    });
    
    // Format priority stats
    const priorityStats = {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0
    };
    
    tasksByPriority.forEach(priority => {
      priorityStats[priority._id] = priority.count;
    });
    
    // Total tasks
    const totalTasks = Object.values(statusStats).reduce((sum, count) => sum + count, 0);
    
    return {
      totalTasks,
      assignedTasks,
      createdTasks,
      overdueTasks,
      statusStats,
      priorityStats
    };
  } catch (error) {
    logger.error('Error in getTaskStats service:', error);
    throw error;
  }
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  addComment,
  addSubtask,
  updateSubtask,
  deleteSubtask,
  logTime,
  getTaskStats
};