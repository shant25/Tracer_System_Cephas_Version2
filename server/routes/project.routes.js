const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User');

/**
 * @route   GET api/projects
 * @desc    Get all projects for authenticated user
 * @access  Private
 */
router.get('/', auth, async (req, res) => {
  try {
    // Find projects where user is owner or member
    const projects = await Project.find({
      $or: [
        { owner: req.user.id },
        { members: { $in: [req.user.id] } }
      ]
    }).sort({ createdAt: -1 });
    
    res.json(projects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

/**
 * @route   POST api/projects
 * @desc    Create a new project
 * @access  Private
 */
router.post(
  '/',
  [
    auth,
    [
      check('name', 'Project name is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, description, startDate, endDate, members } = req.body;

      // Create new project
      const newProject = new Project({
        name,
        description,
        startDate: startDate || Date.now(),
        endDate,
        owner: req.user.id,
        members: members || []
      });

      // Add owner to members automatically if not already included
      if (!newProject.members.includes(req.user.id)) {
        newProject.members.push(req.user.id);
      }

      const project = await newProject.save();
      res.json(project);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

/**
 * @route   GET api/projects/:id
 * @desc    Get project by ID
 * @access  Private
 */
router.get('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('members', 'name email');

    // Check if project exists
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    // Check if user has access to project
    if (project.owner.toString() !== req.user.id && 
        !project.members.some(member => member._id.toString() === req.user.id)) {
      return res.status(403).json({ msg: 'Access denied' });
    }

    res.json(project);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Project not found' });
    }
    res.status(500).send('Server error');
  }
});

/**
 * @route   PUT api/projects/:id
 * @desc    Update a project
 * @access  Private
 */
router.put(
  '/:id',
  [
    auth,
    [
      check('name', 'Project name is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let project = await Project.findById(req.params.id);

      // Check if project exists
      if (!project) {
        return res.status(404).json({ msg: 'Project not found' });
      }

      // Check if user is the project owner
      if (project.owner.toString() !== req.user.id) {
        return res.status(403).json({ msg: 'Not authorized to update this project' });
      }

      const { name, description, startDate, endDate, members, status } = req.body;

      // Update project fields
      project.name = name || project.name;
      project.description = description || project.description;
      if (startDate) project.startDate = startDate;
      if (endDate) project.endDate = endDate;
      if (members) project.members = members;
      if (status) project.status = status;

      // Add owner to members automatically if not already included
      if (!project.members.includes(req.user.id)) {
        project.members.push(req.user.id);
      }

      await project.save();
      res.json(project);
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Project not found' });
      }
      res.status(500).send('Server error');
    }
  }
);

/**
 * @route   DELETE api/projects/:id
 * @desc    Delete a project
 * @access  Private
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    // Check if project exists
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    // Check if user is the project owner
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized to delete this project' });
    }

    // Delete all tasks associated with this project
    await Task.deleteMany({ project: project._id });

    // Delete project
    await project.remove();

    res.json({ msg: 'Project and associated tasks removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Project not found' });
    }
    res.status(500).send('Server error');
  }
});

/**
 * @route   GET api/projects/:id/tasks
 * @desc    Get all tasks for a project
 * @access  Private
 */
router.get('/:id/tasks', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    // Check if project exists
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    // Check if user has access to project
    if (project.owner.toString() !== req.user.id && 
        !project.members.includes(req.user.id)) {
      return res.status(403).json({ msg: 'Access denied' });
    }

    // Get all tasks for the project
    const tasks = await Task.find({ project: req.params.id })
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Project not found' });
    }
    res.status(500).send('Server error');
  }
});

/**
 * @route   POST api/projects/:id/members
 * @desc    Add a member to project
 * @access  Private
 */
router.post(
  '/:id/members',
  [
    auth,
    [
      check('email', 'Email is required').isEmail()
    ]
  ],
  async (req, res) => {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const project = await Project.findById(req.params.id);

      // Check if project exists
      if (!project) {
        return res.status(404).json({ msg: 'Project not found' });
      }

      // Check if user is the project owner
      if (project.owner.toString() !== req.user.id) {
        return res.status(403).json({ msg: 'Not authorized to add members' });
      }

      // Find user by email
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }

      // Check if user is already a member
      if (project.members.includes(user._id)) {
        return res.status(400).json({ msg: 'User is already a member' });
      }

      // Add user to members
      project.members.push(user._id);
      await project.save();

      // Return updated project with populated members
      const updatedProject = await Project.findById(req.params.id)
        .populate('owner', 'name email')
        .populate('members', 'name email');

      res.json(updatedProject);
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Project not found' });
      }
      res.status(500).send('Server error');
    }
  }
);

/**
 * @route   DELETE api/projects/:id/members/:userId
 * @desc    Remove a member from project
 * @access  Private
 */
router.delete('/:id/members/:userId', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    // Check if project exists
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    // Check if user is the project owner
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized to remove members' });
    }

    // Check if removing owner (not allowed)
    if (req.params.userId === project.owner.toString()) {
      return res.status(400).json({ msg: 'Cannot remove project owner' });
    }

    // Check if member exists in project
    if (!project.members.includes(req.params.userId)) {
      return res.status(404).json({ msg: 'Member not found in project' });
    }

    // Remove member from project
    project.members = project.members.filter(
      member => member.toString() !== req.params.userId
    );

    await project.save();

    // Return updated project with populated members
    const updatedProject = await Project.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('members', 'name email');

    res.json(updatedProject);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Project or member not found' });
    }
    res.status(500).send('Server error');
  }
});

/**
 * @route   GET api/projects/:id/statistics
 * @desc    Get project statistics
 * @access  Private
 */
router.get('/:id/statistics', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    // Check if project exists
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    // Check if user has access to project
    if (project.owner.toString() !== req.user.id && 
        !project.members.includes(req.user.id)) {
      return res.status(403).json({ msg: 'Access denied' });
    }

    // Get all tasks for the project
    const tasks = await Task.find({ project: req.params.id });

    // Calculate statistics
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'completed').length;
    const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
    const pendingTasks = tasks.filter(task => task.status === 'pending').length;

    // Calculate completion percentage
    const completionPercentage = totalTasks > 0 
      ? Math.round((completedTasks / totalTasks) * 100) 
      : 0;

    // Calculate days remaining
    const daysRemaining = project.endDate 
      ? Math.ceil((new Date(project.endDate) - new Date()) / (1000 * 60 * 60 * 24))
      : null;

    // Return statistics
    res.json({
      totalTasks,
      completedTasks,
      inProgressTasks,
      pendingTasks,
      completionPercentage,
      daysRemaining
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Project not found' });
    }
    res.status(500).send('Server error');
  }
});

module.exports = router;