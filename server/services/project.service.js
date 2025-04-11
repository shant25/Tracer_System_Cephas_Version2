/**
 * Project service for Tracer App
 */
const Project = require('../models/project.model');
const Task = require('../models/task.model');
const User = require('../models/user.model');
const { ApiError } = require('../utils/apiResponse');
const emailService = require('./email.service');
const logger = require('../utils/logger');

/**
 * Get all projects with filtering and pagination
 * @param {Object} filters - Filter criteria
 * @param {Object} pagination - Pagination options
 * @param {Object} user - Current user
 * @returns {Object} Projects and pagination info
 */
const getAllProjects = async (filters, pagination, user) => {
  try {
    const { search, status, archived, owner, priority, tags } = filters;
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;
    
    let query = {};
    
    // Get projects based on user role and user ID
    if (user.role !== 'admin') {
      // Regular users can only see their projects (owned or team member)
      query = {
        $or: [
          { owner: user.id },
          { 'team.user': user.id }
        ]
      };
    }
    
    // Filter by status
    if (status) {
      query.status = status;
    }
    
    // Filter by archived status
    if (archived === 'true') {
      query.isArchived = true;
    } else if (archived === 'false' || archived === undefined) {
      query.isArchived = false;
    }
    
    // Filter by owner
    if (owner) {
      query.owner = owner;
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
    
    // Search by name or description
    if (search) {
      const searchRegex = new RegExp(search, 'i');
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
    
    return {
      projects,
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
    logger.error('Error in getAllProjects service:', error);
    throw error;
  }
};

/**
 * Get project by ID
 * @param {String} projectId - Project ID
 * @param {Object} user - Current user
 * @returns {Object} Project with task stats
 */
const getProjectById = async (projectId, user) => {
  try {
    const project = await Project.findById(projectId)
      .populate('owner', 'firstName lastName email avatar')
      .populate('team.user', 'firstName lastName email avatar');
    
    if (!project) {
      throw new ApiError(404, 'Project not found');
    }
    
    // Check if user has access to the project
    if (
      user.role !== 'admin' && 
      project.owner._id.toString() !== user.id && 
      !project.team.some(member => member.user._id.toString() === user.id)
    ) {
      throw new ApiError(403, 'You do not have permission to access this project');
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
    
    return { project, tasks, progress };
  } catch (error) {
    logger.error('Error in getProjectById service:', error);
    throw error;
  }
};

/**
 * Create new project
 * @param {Object} projectData - Project data
 * @param {Object} user - Current user
 * @returns {Object} Created project
 */
const createProject = async (projectData, user) => {
  try {
    // Create project
    const project = await Project.create({
      name: projectData.name,
      description: projectData.description || '',
      status: projectData.status || 'planning',
      startDate: projectData.startDate || Date.now(),
      endDate: projectData.endDate || null,
      priority: projectData.priority || 'medium',
      tags: projectData.tags || [],
      owner: user.id,
      team: [{ user: user.id, role: 'owner', addedAt: Date.now() }]
    });
    
    // Populate owner details
    await project.populate('owner', 'firstName lastName email avatar');
    
    return project;
  } catch (error) {
    logger.error('Error in createProject service:', error);
    throw error;
  }
};

/**
 * Update project
 * @param {String} projectId - Project ID
 * @param {Object} projectData - Project data to update
 * @param {Object} user - Current user
 * @returns {Object} Updated project
 */
const updateProject = async (projectId, projectData, user) => {
  try {
    // Find project
    const project = await Project.findById(projectId);
    
    if (!project) {
      throw new ApiError(404, 'Project not found');
    }
    
    // Check if user has permission to update project
    const isAdmin = user.role === 'admin';
    const isOwner = project.owner.toString() === user.id;
    const isManager = project.team.some(
      member => member.user.toString() === user.id && member.role === 'manager'
    );
    
    if (!isAdmin && !isOwner && !isManager) {
      throw new ApiError(403, 'You do not have permission to update this project');
    }
    
    // Update fields
    if (projectData.name) project.name = projectData.name;
    if (projectData.description !== undefined) project.description = projectData.description;
    if (projectData.status) project.status = projectData.status;
    if (projectData.startDate) project.startDate = projectData.startDate;
    if (projectData.endDate !== undefined) project.endDate = projectData.endDate;
    if (projectData.priority) project.priority = projectData.priority;
    if (projectData.tags) project.tags = projectData.tags;
    if (projectData.isArchived !== undefined) project.isArchived = projectData.isArchived;
    
    project.updatedAt = Date.now();
    
    // Save project
    await project.save();
    
    // Populate owner and team details
    await project.populate('owner', 'firstName lastName email avatar');
    await project.populate('team.user', 'firstName lastName email avatar');
    
    return project;
  } catch (error) {
    logger.error('Error in updateProject service:', error);
    throw error;
  }
};

/**
 * Delete project
 * @param {String} projectId - Project ID
 * @param {Object} user - Current user
 * @returns {Boolean} Success status
 */
const deleteProject = async (projectId, user) => {
  try {
    // Find project
    const project = await Project.findById(projectId);
    
    if (!project) {
      throw new ApiError(404, 'Project not found');
    }
    
    // Check if user has permission to delete project
    const isAdmin = user.role === 'admin';
    const isOwner = project.owner.toString() === user.id;
    
    if (!isAdmin && !isOwner) {
      throw new ApiError(403, 'You do not have permission to delete this project');
    }
    
    // Delete all tasks associated with the project
    await Task.deleteMany({ project: projectId });
    
    // Delete project
    await Project.findByIdAndDelete(projectId);
    
    return true;
  } catch (error) {
    logger.error('Error in deleteProject service:', error);
    throw error;
  }
};

/**
 * Add team member to project
 * @param {String} projectId - Project ID
 * @param {String} userId - User ID to add
 * @param {String} role - User role in project
 * @param {Object} currentUser - Current user
 * @returns {Object} Updated project
 */
const addTeamMember = async (projectId, userId, role, currentUser) => {
  try {
    // Find project
    const project = await Project.findById(projectId);
    
    if (!project) {
      throw new ApiError(404, 'Project not found');
    }
    
    // Check if user has permission to add team members
    const isAdmin = currentUser.role === 'admin';
    const isOwner = project.owner.toString() === currentUser.id;
    const isManager = project.team.some(
      member => member.user.toString() === currentUser.id && member.role === 'manager'
    );
    
    if (!isAdmin && !isOwner && !isManager) {
      throw new ApiError(403, 'You do not have permission to add team members to this project');
    }
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    
    // Add team member
    project.addTeamMember(userId, role || 'member');
    
    // Save project
    await project.save();
    
    // Populate team details
    await project.populate('team.user', 'firstName lastName email avatar');
    
    // Send invitation email
    try {
      await emailService.sendProjectInvitationEmail(
        user,
        project,
        role || 'member',
        currentUser
      );
    } catch (emailError) {
      logger.error('Error sending project invitation email:', emailError);
      // Continue even if email fails
    }
    
    return project;
  } catch (error) {
    logger.error('Error in addTeamMember service:', error);
    throw error;
  }
};

/**
 * Remove team member from project
 * @param {String} projectId - Project ID
 * @param {String} userId - User ID to remove
 * @param {Object} currentUser - Current user
 * @returns {Object} Updated project
 */
const removeTeamMember = async (projectId, userId, currentUser) => {
  try {
    // Find project
    const project = await Project.findById(projectId);
    
    if (!project) {
      throw new ApiError(404, 'Project not found');
    }
    
    // Check if user has permission to remove team members
    const isAdmin = currentUser.role === 'admin';
    const isOwner = project.owner.toString() === currentUser.id;
    const isManager = project.team.some(
      member => member.user.toString() === currentUser.id && member.role === 'manager'
    );
    
    // Allow users to remove themselves
    const isSelf = userId === currentUser.id;
    
    if (!isAdmin && !isOwner && !isManager && !isSelf) {
      throw new ApiError(403, 'You do not have permission to remove team members from this project');
    }
    
    // Prevent removing the owner
    if (project.owner.toString() === userId) {
      throw new ApiError(400, 'Project owner cannot be removed from the team');
    }
    
    // Check if user is in team
    if (!project.isTeamMember(userId)) {
      throw new ApiError(404, 'User is not a member of this project');
    }
    
    // Remove team member
    project.removeTeamMember(userId);
    
    // Save project
    await project.save();
    
    return project;
  } catch (error) {
    logger.error('Error in removeTeamMember service:', error);
    throw error;
  }
};

/**
 * Get project statistics
 * @param {Object} user - Current user
 * @returns {Object} Project statistics
 */
const getProjectStats = async (user) => {
  try {
    let query = {};
    
    // Get projects based on user role and user ID
    if (user.role !== 'admin') {
      query = {
        $or: [
          { owner: user.id },
          { 'team.user': user.id }
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
    
    return {
      totalProjects,
      activeProjects,
      archivedProjects,
      statusStats,
      priorityStats
    };
  } catch (error) {
    logger.error('Error in getProjectStats service:', error);
    throw error;
  }
};

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