/**
 * Task controller for Tracer App
 */
const Task = require('../models/task.model');
const Project = require('../models/project.model');
const { successResponse, ApiError, catchAsync } = require('../utils/apiResponse');

/**
 * Get all tasks
 * @route GET /api/tasks
 * @access Private
 */
const getAllTasks = catchAsync(async (req, res, next) => {
  // Get query parameters
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;
  
  let query = {};
  
  // Filter by project
  if (req.query.project) {
    query.project = req.query.project;
    
    // Verify project exists and user has access
    const project = await Project.findById(req.query.project);
    if (!project) {
      return next(new ApiError(404, 'Project not found'));
    }
    
    // Check if user has access to the project
    const hasAccess = 
      req.user.role === 'admin' ||
      project.owner.toString() === req.user.id ||
      project.team.some(member => member.user.toString() === req.user.id);
    
    if (!hasAccess) {
      return next(new ApiError(403, 'You do not have permission to access tasks for this project'));
    }
  } else {
    // If no project specified, only show tasks from projects where user is a member
    const userProjects = await Project.find({
      $or: [
        { owner: req.user.id },
        { 'team.user': req.user.id }
      ]
    }).select('_id');
    
    const projectIds = userProjects.map(project => project._id);
    
    query.project = { $in: projectIds };
  }
  
  // Filter by assigned user
  if (req.query.assignedTo) {
    query.assignedTo = req.query.assignedTo === 'me' ? req.user.id : req.query.assignedTo;
  }
  
  // Filter by status
  if (req.query.status) {
    query.status = req.query.status;
  }
  
  // Filter by priority
  if (req.query.priority) {
    query.priority = req.query.priority;
  }
  
  // Filter by due date
  if (req.query.dueDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (req.query.dueDate === 'today') {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      query.dueDate = {
        $gte: today,
        $lt: tomorrow
      };
    } else if (req.query.dueDate === 'week') {
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);
      
      query.dueDate = {
        $gte: today,
        $lt: nextWeek
      };
    } else if (req.query.dueDate === 'overdue') {
      query.dueDate = {
        $lt: today
      };
      query.status = { $ne: 'completed' };
    }
  }
  
  // Search by title or description
  if (req.query.search) {
    const searchRegex = new RegExp(req.query.search, 'i');
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
  
  return successResponse(res, 200, 'Tasks retrieved successfully', {
    tasks,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext,
      hasPrev
    }
  });
});

/**
 * Get task by ID
 * @route GET /api/tasks/:id
 * @access Private
 */
const getTaskById = catchAsync(async (req, res, next) => {
  const taskId = req.params.id;
  
  const task = await Task.findById(taskId)
    .populate('project', 'name slug status')
    .populate('assignedTo', 'firstName lastName email avatar')
    .populate('createdBy', 'firstName lastName email avatar')
    .populate('comments.user', 'firstName lastName email avatar')
    .populate('timeTracking.logs.user', 'firstName lastName email avatar');
  
  if (!task) {
    return next(new ApiError(404, 'Task not found'));
  }
  
  // Check if user has access to the project
  const project = await Project.findById(task.project._id);
  
  const hasAccess = 
    req.user.role === 'admin' ||
    project.owner.toString() === req.user.id ||
    project.team.some(member => member.user.toString() === req.user.id);
  
  if (!hasAccess) {
    return next(new ApiError(403, 'You do not have permission to access this task'));
  }
  
  return successResponse(res, 200, 'Task retrieved successfully', { task });
});

/**
 * Create new task
 * @route POST /api/tasks
 * @access Private
 */
const createTask = catchAsync(async (req, res, next) => {
  const { 
    title, description, project, status, priority, 
    dueDate, assignedTo, tags, subtasks, timeTracking 
  } = req.body;
  
  // Verify project exists and user has access
  const projectDoc = await Project.findById(project);
  
  if (!projectDoc) {
    return next(new ApiError(404, 'Project not found'));
  }
  
  // Check if user has access to the project
  const hasAccess = 
    req.user.role === 'admin' ||
    projectDoc.owner.toString() === req.user.id ||
    projectDoc.team.some(member => member.user.toString() === req.user.id);
  
  if (!hasAccess) {
    return next(new ApiError(403, 'You do not have permission to create tasks for this project'));
  }
  
  // Create task
  const task = await Task.create({
    title,
    description,
    project,
    status: status || 'todo',
    priority: priority || 'medium',
    dueDate: dueDate || null,
    assignedTo: assignedTo || null,
    createdBy: req.user.id,
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
  
  return successResponse(res, 201, 'Task created successfully', { task });
});

/**
 * Update task
 * @route PUT /api/tasks/:id
 * @access Private
 */
const updateTask = catchAsync(async (req, res, next) => {
  const taskId = req.params.id;
  const {
    title, description, status, priority,
    dueDate, assignedTo, tags, timeTracking
  } = req.body;
  
  // Find task
  const task = await Task.findById(taskId);
  
  if (!task) {
    return next(new ApiError(404, 'Task not found'));
  }
  
  // Verify project exists and user has access
  const project = await Project.findById(task.project);
  
  const hasAccess = 
    req.user.role === 'admin' ||
    project.owner.toString() === req.user.id ||
    project.team.some(member => member.user.toString() === req.user.id);
  
  if (!hasAccess) {
    return next(new ApiError(403, 'You do not have permission to update this task'));
  }
  
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
  
  return successResponse(res, 200, 'Task updated successfully', { task });
});

/**
 * Delete task
 * @route DELETE /api/tasks/:id
 * @access Private
 */
const deleteTask = catchAsync(async (req, res, next) => {
  const taskId = req.params.id;
  
  // Find task
  const task = await Task.findById(taskId);
  
  if (!task) {
    return next(new ApiError(404, 'Task not found'));
  }
  
  // Verify project exists and user has access
  const project = await Project.findById(task.project);
  
  const hasAccess = 
    req.user.role === 'admin' ||
    project.owner.toString() === req.user.id ||
    project.team.some(member => 
      member.user.toString() === req.user.id && 
      (member.role === 'owner' || member.role === 'manager')
    );
  
  // Also allow task creator to delete it
  const isCreator = task.createdBy.toString() === req.user.id;
  
  if (!hasAccess && !isCreator) {
    return next(new ApiError(403, 'You do not have permission to delete this task'));
  }
  
  // Delete task
  await Task.findByIdAndDelete(taskId);
  
  return successResponse(res, 200, 'Task deleted successfully');
});

/**
 * Add comment to task
 * @route POST /api/tasks/:id/comments
 * @access Private
 */
const addComment = catchAsync(async (req, res, next) => {
  const taskId = req.params.id;
  const { text } = req.body;
  
  // Find task
  const task = await Task.findById(taskId);
  
  if (!task) {
    return next(new ApiError(404, 'Task not found'));
  }
  
  // Verify project exists and user has access
  const project = await Project.findById(task.project);
  
  const hasAccess = 
    req.user.role === 'admin' ||
    project.owner.toString() === req.user.id ||
    project.team.some(member => member.user.toString() === req.user.id);
  
  if (!hasAccess) {
    return next(new ApiError(403, 'You do not have permission to comment on this task'));
  }
  
  // Add comment
  task.addComment(req.user.id, text);
  
  // Save task
  await task.save();
  
  // Populate comment user
  await task.populate('comments.user', 'firstName lastName email avatar');
  
  // Get the newly added comment
  const newComment = task.comments[task.comments.length - 1];
  
  return successResponse(res, 201, 'Comment added successfully', { comment: newComment });
});

/**
 * Add subtask to task
 * @route POST /api/tasks/:id/subtasks
 * @access Private
 */
const addSubtask = catchAsync(async (req, res, next) => {
  const taskId = req.params.id;
  const { title } = req.body;
  
  // Find task
  const task = await Task.findById(taskId);
  
  if (!task) {
    return next(new ApiError(404, 'Task not found'));
  }
  
  // Verify project exists and user has access
  const project = await Project.findById(task.project);
  
  const hasAccess = 
    req.user.role === 'admin' ||
    project.owner.toString() === req.user.id ||
    project.team.some(member => member.user.toString() === req.user.id);
  
  if (!hasAccess) {
    return next(new ApiError(403, 'You do not have permission to add subtasks to this task'));
  }
  
  // Add subtask
  task.addSubtask(title);
  
  // Save task
  await task.save();
  
  // Get the newly added subtask
  const newSubtask = task.subtasks[task.subtasks.length - 1];
  
  return successResponse(res, 201, 'Subtask added successfully', { subtask: newSubtask });
});

/**
 * Update subtask
 * @route PUT /api/tasks/:id/subtasks/:subtaskId
 * @access Private
 */
const updateSubtask = catchAsync(async (req, res, next) => {
  const taskId = req.params.id;
  const subtaskId = req.params.subtaskId;
  const { title, completed } = req.body;
  
  // Find task
  const task = await Task.findById(taskId);
  
  if (!task) {
    return next(new ApiError(404, 'Task not found'));
  }
  
  // Verify project exists and user has access
  const project = await Project.findById(task.project);
  
  const hasAccess = 
    req.user.role === 'admin' ||
    project.owner.toString() === req.user.id ||
    project.team.some(member => member.user.toString() === req.user.id);
  
  if (!hasAccess) {
    return next(new ApiError(403, 'You do not have permission to update subtasks for this task'));
  }
  
  // Find subtask
  const subtask = task.subtasks.id(subtaskId);
  
  if (!subtask) {
    return next(new ApiError(404, 'Subtask not found'));
  }
  
  // Update subtask
  if (title !== undefined) subtask.title = title;
  if (completed !== undefined) {
    subtask.completed = completed;
    subtask.completedAt = completed ? Date.now() : null;
  }
  
  // Save task
  await task.save();
  
  return successResponse(res, 200, 'Subtask updated successfully', { subtask });
});

/**
 * Delete subtask
 * @route DELETE /api/tasks/:id/subtasks/:subtaskId
 * @access Private
 */
const deleteSubtask = catchAsync(async (req, res, next) => {
  const taskId = req.params.id;
  const subtaskId = req.params.subtaskId;
  
  // Find task
  const task = await Task.findById(taskId);
  
  if (!task) {
    return next(new ApiError(404, 'Task not found'));
  }
  
  // Verify project exists and user has access
  const project = await Project.findById(task.project);
  
  const hasAccess = 
    req.user.role === 'admin' ||
    project.owner.toString() === req.user.id ||
    project.team.some(member => member.user.toString() === req.user.id);
  
  if (!hasAccess) {
    return next(new ApiError(403, 'You do not have permission to delete subtasks from this task'));
  }
  
  // Find subtask
  const subtask = task.subtasks.id(subtaskId);
  
  if (!subtask) {
    return next(new ApiError(404, 'Subtask not found'));
  }
  
  // Remove subtask
  subtask.remove();
  
  // Save task
  await task.save();
  
  return successResponse(res, 200, 'Subtask deleted successfully');
});

/**
 * Log time for task
 * @route POST /api/tasks/:id/time
 * @access Private
 */
const logTime = catchAsync(async (req, res, next) => {
  const taskId = req.params.id;
  const { startTime, endTime, description } = req.body;
  
  // Find task
  const task = await Task.findById(taskId);
  
  if (!task) {
    return next(new ApiError(404, 'Task not found'));
  }
  
  // Verify project exists and user has access
  const project = await Project.findById(task.project);
  
  const hasAccess = 
    req.user.role === 'admin' ||
    project.owner.toString() === req.user.id ||
    project.team.some(member => member.user.toString() === req.user.id);
  
  if (!hasAccess) {
    return next(new ApiError(403, 'You do not have permission to log time for this task'));
  }
  
  // Log time
  const duration = task.logTime(req.user.id, startTime, endTime, description);
  
  // Save task
  await task.save();
  
  // Get the newly added time log
  const newTimeLog = task.timeTracking.logs[task.timeTracking.logs.length - 1];
  
  return successResponse(res, 201, `Time logged successfully (${duration} minutes)`, { 
    timeLog: newTimeLog,
    timeSpent: task.timeTracking.timeSpent
  });
});

/**
 * Get task stats
 * @route GET /api/tasks/stats
 * @access Private
 */
const getTaskStats = catchAsync(async (req, res, next) => {
  // Get projects accessible to user
  const userProjects = await Project.find({
    $or: [
      { owner: req.user.id },
      { 'team.user': req.user.id }
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
    assignedTo: req.user.id
  });
  
  // Tasks created by user
  const createdTasks = await Task.countDocuments({
    project: { $in: projectIds },
    createdBy: req.user.id
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
  
  return successResponse(res, 200, 'Task statistics retrieved successfully', {
    totalTasks,
    assignedTasks,
    createdTasks,
    overdueTasks,
    statusStats,
    priorityStats
  });
});

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