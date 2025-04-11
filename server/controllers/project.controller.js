/**
 * Project controller for Tracer App
 */
const Project = require('../models/project.model');
const Task = require('../models/task.model');
const { successResponse, ApiError, catchAsync } = require('../utils/apiResponse');

/**
 * Get all projects
 * @route GET /api/projects
 * @access Private
 */
const getAllProjects = catchAsync(async (req, res, next) => {
  // Get query parameters
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;
  
  let query = {};
  
  // Get projects based on user role and user ID
  if (req.user.role === 'admin') {
    // Admin can see all projects
  } else {
    // Regular users can only see their projects (owned or team member)
    query = {
      $or: [
        { owner: req.user.id },
        { 'team.user': req.user.id }
      ]
    };
  }
  
  // Filter by status
  if (req.query.status) {
    query.status = req.query.status;
  }
  
  // Filter by archived status
  if (req.query.archived === 'true') {
    query.isArchived = true;
  } else if (req.query.archived === 'false' || !req.query.archived) {
    query.isArchived = false;
  }
  
  // Filter by owner
  if (req.query.owner) {
    query.owner = req.query.owner;
  }
  
  // Filter by priority
  if (req.query.priority) {
    query.priority = req.query.priority;
  }
  
  // Search by name
  if (req.query.search) {
    const searchRegex = new RegExp(req.query.search, 'i');
    query = {
      ...query,
      $or: [
        { name: searchRegex },
        { description: searchRegex },
        { tags: searchRegex }
      ]
    };
  }
  
  // Count total projects
  const total = await Project.countDocuments(query);
  
  // Get projects
  const projects = await Project.find(query)
    .populate('owner', 'firstName lastName email avatar')
    .populate('team.user', 'firstName lastName email avatar')
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit);
  
  // Calculate pagination info
  const totalPages = Math.ceil(total / limit);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;
  
  return successResponse(res, 200, 'Projects retrieved successfully', {
    projects,
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
 * Get project by ID
 * @route GET /api/projects/:id
 * @access Private
 */
const getProjectById = catchAsync(async (req, res, next) => {
  const projectId = req.params.id;
  
  const project = await Project.findById(projectId)
    .populate('owner', 'firstName lastName email avatar')
    .populate('team.user', 'firstName lastName email avatar');
  
  if (!project) {
    return next(new ApiError(404, 'Project not found'));
  }
  
  // Check if user has access to the project
  if (
    req.user.role !== 'admin' && 
    project.owner._id.toString() !== req.user.id && 
    !project.team.some(member => member.user._id.toString() === req.user.id)
  ) {
    return next(new ApiError(403, 'You do not have permission to access this project'));
  }
  
  // Get tasks count by status
  const taskStats = await Task.aggregate([
    { $match: { project: project._id } },
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);
  
  // Format task stats
  const tasks = {
    total: 0,
    todo: 0,
    'in-progress': 0,
    review: 0,
    completed: 0
  };
  
  taskStats.forEach(stat => {
    tasks[stat._id] = stat.count;
    tasks.total += stat.count;
  });
  
  // Calculate progress
  let progress = 0;
  if (tasks.total > 0) {
    progress = Math.round((tasks.completed / tasks.total) * 100);
  }
  
  return successResponse(res, 200, 'Project retrieved successfully', { 
    project, 
    tasks,
    progress
  });
});

/**
 * Create new project
 * @route POST /api/projects
 * @access Private
 */
const createProject = catchAsync(async (req, res, next) => {
  const { name, description, status, startDate, endDate, priority, tags } = req.body;
  
  // Create project
  const project = await Project.create({
    name,
    description,
    status: status || 'planning',
    startDate: startDate || Date.now(),
    endDate,
    priority: priority || 'medium',
    tags: tags || [],
    owner: req.user.id,
    team: [{ user: req.user.id, role: 'owner', addedAt: Date.now() }]
  });
  
  // Populate owner details
  await project.populate('owner', 'firstName lastName email avatar');
  
  return successResponse(res, 201, 'Project created successfully', { project });
});

/**
 * Update project
 * @route PUT /api/projects/:id
 * @access Private
 */
const updateProject = catchAsync(async (req, res, next) => {
  const projectId = req.params.id;
  const { name, description, status, startDate, endDate, priority, tags, isArchived } = req.body;
  
  // Find project
  const project = await Project.findById(projectId);
  
  if (!project) {
    return next(new ApiError(404, 'Project not found'));
  }
  
  // Check if user has permission to update project
  const isAdmin = req.user.role === 'admin';
  const isOwner = project.owner.toString() === req.user.id;
  const isManager = project.team.some(
    member => member.user.toString() === req.user.id && member.role === 'manager'
  );
  
  if (!isAdmin && !isOwner && !isManager) {
    return next(new ApiError(403, 'You do not have permission to update this project'));
  }
  
  // Update fields
  if (name) project.name = name;
  if (description !== undefined) project.description = description;
  if (status) project.status = status;
  if (startDate) project.startDate = startDate;
  if (endDate !== undefined) project.endDate = endDate;
  if (priority) project.priority = priority;
  if (tags) project.tags = tags;
  if (isArchived !== undefined) project.isArchived = isArchived;
  
  project.updatedAt = Date.now();
  
  // Save project
  await project.save();
  
  // Populate owner and team details
  await project.populate('owner', 'firstName lastName email avatar');
  await project.populate('team.user', 'firstName lastName email avatar');
  
  return successResponse(res, 200, 'Project updated successfully', { project });
});

/**
 * Delete project
 * @route DELETE /api/projects/:id
 * @access Private
 */
const deleteProject = catchAsync(async (req, res, next) => {
  const projectId = req.params.id;
  
  // Find project
  const project = await Project.findById(projectId);
  
  if (!project) {
    return next(new ApiError(404, 'Project not found'));
  }
  
  // Check if user has permission to delete project
  const isAdmin = req.user.role === 'admin';
  const isOwner = project.owner.toString() === req.user.id;
  
  if (!isAdmin && !isOwner) {
    return next(new ApiError(403, 'You do not have permission to delete this project'));
  }
  
  // Delete all tasks associated with the project
  await Task.deleteMany({ project: projectId });
  
  // Delete project
  await Project.findByIdAndDelete(projectId);
  
  return successResponse(res, 200, 'Project deleted successfully');
});

/**
 * Add team member to project
 * @route POST /api/projects/:id/team
 * @access Private
 */
const addTeamMember = catchAsync(async (req, res, next) => {
  const projectId = req.params.id;
  const { userId, role } = req.body;
  
  // Find project
  const project = await Project.findById(projectId);
  
  if (!project) {
    return next(new ApiError(404, 'Project not found'));
  }
  
  // Check if user has permission to add team members
  const isAdmin = req.user.role === 'admin';
  const isOwner = project.owner.toString() === req.user.id;
  const isManager = project.team.some(
    member => member.user.toString() === req.user.id && member.role === 'manager'
  );
  
  if (!isAdmin && !isOwner && !isManager) {
    return next(new ApiError(403, 'You do not have permission to add team members to this project'));
  }
  
  // Add team member
  project.addTeamMember(userId, role || 'member');
  
  // Save project
  await project.save();
  
  // Populate team details
  await project.populate('team.user', 'firstName lastName email avatar');
  
  return successResponse(res, 200, 'Team member added successfully', { project });
});

/**
 * Remove team member from project
 * @route DELETE /api/projects/:id/team/:userId
 * @access Private
 */
const removeTeamMember = catchAsync(async (req, res, next) => {
  const projectId = req.params.id;
  const userId = req.params.userId;
  
  // Find project
  const project = await Project.findById(projectId);
  
  if (!project) {
    return next(new ApiError(404, 'Project not found'));
  }
  
  // Check if user has permission to remove team members
  const isAdmin = req.user.role === 'admin';
  const isOwner = project.owner.toString() === req.user.id;
  const isManager = project.team.some(
    member => member.user.toString() === req.user.id && member.role === 'manager'
  );
  
  // Allow users to remove themselves
  const isSelf = userId === req.user.id;
  
  if (!isAdmin && !isOwner && !isManager && !isSelf) {
    return next(new ApiError(403, 'You do not have permission to remove team members from this project'));
  }
  
  // Prevent removing the owner
  if (project.owner.toString() === userId) {
    return next(new ApiError(400, 'Project owner cannot be removed from the team'));
  }
  
  // Check if user is in team
  if (!project.isTeamMember(userId)) {
    return next(new ApiError(404, 'User is not a member of this project'));
  }
  
  // Remove team member
  project.removeTeamMember(userId);
  
  // Save project
  await project.save();
  
  return successResponse(res, 200, 'Team member removed successfully', { project });
});

/**
 * Get project stats
 * @route GET /api/projects/stats
 * @access Private
 */
const getProjectStats = catchAsync(async (req, res, next) => {
  let query = {};
  
  // Get projects based on user role and user ID
  if (req.user.role !== 'admin') {
    query = {
      $or: [
        { owner: req.user.id },
        { 'team.user': req.user.id }
      ]
    };
  }
  
  // Total projects
  const totalProjects = await Project.countDocuments(query);
  
  // Projects by status
  const projectsByStatus = await Project.aggregate([
    { $match: query },
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);
  
  // Projects by priority
  const projectsByPriority = await Project.aggregate([
    { $match: query },
    { $group: { _id: '$priority', count: { $sum: 1 } } }
  ]);
  
  // Active and archived projects
  const activeProjects = await Project.countDocuments({ ...query, isArchived: false });
  const archivedProjects = await Project.countDocuments({ ...query, isArchived: true });
  
  // Format status stats
  const statusStats = {
    planning: 0,
    active: 0,
    completed: 0,
    'on-hold': 0,
    cancelled: 0
  };
  
  projectsByStatus.forEach(status => {
    statusStats[status._id] = status.count;
  });
  
  // Format priority stats
  const priorityStats = {
    low: 0,
    medium: 0,
    high: 0,
    critical: 0
  };
  
  projectsByPriority.forEach(priority => {
    priorityStats[priority._id] = priority.count;
  });
  
  return successResponse(res, 200, 'Project statistics retrieved successfully', {
    totalProjects,
    activeProjects,
    archivedProjects,
    statusStats,
    priorityStats
  });
});

module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  addTeamMember,
  removeTeamMember,
  getProjectStats
};