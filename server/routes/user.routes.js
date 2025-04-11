const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');

/**
 * @route   GET api/users
 * @desc    Get all users (for admin)
 * @access  Private/Admin
 */
router.get('/', auth, async (req, res) => {
  try {
    // Check if requesting user is admin
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ msg: 'Unauthorized access' });
    }

    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

/**
 * @route   GET api/users/me
 * @desc    Get current user's profile
 * @access  Private
 */
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

/**
 * @route   PUT api/users/me
 * @desc    Update current user's profile
 * @access  Private
 */
router.put(
  '/me',
  [
    auth,
    [
      check('name', 'Name is required').not().isEmpty(),
      check('email', 'Please include a valid email').isEmail()
    ]
  ],
  async (req, res) => {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, bio, avatar } = req.body;

    try {
      // Check if email is already in use by another user
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== req.user.id) {
        return res.status(400).json({ msg: 'Email already in use' });
      }

      // Find and update user
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }

      user.name = name;
      user.email = email;
      if (bio) user.bio = bio;
      if (avatar) user.avatar = avatar;

      await user.save();

      // Return user without password
      const updatedUser = await User.findById(req.user.id).select('-password');
      res.json(updatedUser);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

/**
 * @route   PUT api/users/password
 * @desc    Update current user's password
 * @access  Private
 */
router.put(
  '/password',
  [
    auth,
    [
      check('currentPassword', 'Current password is required').exists(),
      check('newPassword', 'Please enter a new password with 6 or more characters').isLength({ min: 6 })
    ]
  ],
  async (req, res) => {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { currentPassword, newPassword } = req.body;

    try {
      // Find user
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }

      // Verify current password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Current password is incorrect' });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);

      await user.save();
      res.json({ msg: 'Password updated successfully' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

/**
 * @route   GET api/users/:id
 * @desc    Get user profile by ID
 * @access  Private
 */
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(500).send('Server error');
  }
});

/**
 * @route   GET api/users/search/:query
 * @desc    Search users by name or email
 * @access  Private
 */
router.get('/search/:query', auth, async (req, res) => {
  try {
    const searchQuery = req.params.query;
    
    const users = await User.find({
      $or: [
        { name: { $regex: searchQuery, $options: 'i' } },
        { email: { $regex: searchQuery, $options: 'i' } }
      ]
    }).select('-password');
    
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

/**
 * @route   GET api/users/:id/projects
 * @desc    Get all projects for a user
 * @access  Private/Admin or Self
 */
router.get('/:id/projects', auth, async (req, res) => {
  try {
    // Check if requesting user is self or admin
    if (req.user.id !== req.params.id) {
      const user = await User.findById(req.user.id);
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ msg: 'Unauthorized access' });
      }
    }

    // Find projects where user is owner or member
    const projects = await Project.find({
      $or: [
        { owner: req.params.id },
        { members: { $in: [req.params.id] } }
      ]
    }).sort({ createdAt: -1 });
    
    res.json(projects);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(500).send('Server error');
  }
});

/**
 * @route   GET api/users/:id/tasks
 * @desc    Get all tasks assigned to a user
 * @access  Private/Admin or Self
 */
router.get('/:id/tasks', auth, async (req, res) => {
  try {
    // Check if requesting user is self or admin
    if (req.user.id !== req.params.id) {
      const user = await User.findById(req.user.id);
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ msg: 'Unauthorized access' });
      }
    }

    // Find tasks assigned to the user
    const tasks = await Task.find({ assignedTo: req.params.id })
      .populate('project', 'name')
      .populate('createdBy', 'name email')
      .sort({ dueDate: 1 });
    
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(500).send('Server error');
  }
});

/**
 * @route   GET api/users/:id/statistics
 * @desc    Get user statistics
 * @access  Private/Admin or Self
 */
router.get('/:id/statistics', auth, async (req, res) => {
  try {
    // Check if requesting user is self or admin
    if (req.user.id !== req.params.id) {
      const user = await User.findById(req.user.id);
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ msg: 'Unauthorized access' });
      }
    }

    // Find tasks assigned to the user
    const tasks = await Task.find({ assignedTo: req.params.id });

    // Find projects where user is owner
    const ownedProjects = await Project.find({ owner: req.params.id });

    // Find projects where user is a member
    const memberProjects = await Project.find({ 
      members: { $in: [req.params.id] },
      owner: { $ne: req.params.id }
    });

    // Calculate statistics
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'completed').length;
    const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
    const pendingTasks = tasks.filter(task => task.status === 'pending').length;
    
    // Calculate completion percentage
    const completionPercentage = totalTasks > 0 
      ? Math.round((completedTasks / totalTasks) * 100) 
      : 0;

    // Calculate overdue tasks
    const overdueTasks = tasks.filter(task => 
      task.status !== 'completed' && 
      task.dueDate && 
      new Date(task.dueDate) < new Date()
    ).length;

    // Return statistics
    res.json({
      totalTasks,
      completedTasks,
      inProgressTasks,
      pendingTasks,
      overdueTasks,
      completionPercentage,
      totalProjects: ownedProjects.length + memberProjects.length,
      ownedProjects: ownedProjects.length,
      memberProjects: memberProjects.length
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(500).send('Server error');
  }
});

/**
 * @route   DELETE api/users/me
 * @desc    Delete current user
 * @access  Private
 */
router.delete('/me', auth, async (req, res) => {
  try {
    // Find user's projects
    const ownedProjects = await Project.find({ owner: req.user.id });
    
    // Check if user owns any projects
    if (ownedProjects.length > 0) {
      return res.status(400).json({ 
        msg: 'Cannot delete account while owning projects. Transfer ownership or delete projects first.' 
      });
    }

    // Remove user as member from projects
    await Project.updateMany(
      { members: { $in: [req.user.id] } },
      { $pull: { members: req.user.id } }
    );

    // Reassign tasks to project owners
    const assignedTasks = await Task.find({ assignedTo: req.user.id });
    
    for (const task of assignedTasks) {
      const project = await Project.findById(task.project);
      if (project) {
        task.assignedTo = project.owner;
        await task.save();
      }
    }

    // Delete user
    await User.findByIdAndRemove(req.user.id);

    res.json({ msg: 'User deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

/**
 * @route   DELETE api/users/:id
 * @desc    Delete user by id (admin only)
 * @access  Private/Admin
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    // Check if requesting user is admin
    const adminUser = await User.findById(req.user.id);
    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ msg: 'Unauthorized access' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check if trying to delete an admin
    if (user.role === 'admin') {
      return res.status(400).json({ msg: 'Cannot delete admin user' });
    }

    // Find user's projects
    const ownedProjects = await Project.find({ owner: req.params.id });
    
    // Reassign project ownership or delete
    for (const project of ownedProjects) {
      // If there are members, reassign to first member
      if (project.members.length > 1) {
        const newOwnerId = project.members.find(
          member => member.toString() !== req.params.id
        );
        
        if (newOwnerId) {
          project.owner = newOwnerId;
          // Remove new owner from members
          project.members = project.members.filter(
            member => member.toString() !== newOwnerId.toString()
          );
          await project.save();
          continue;
        }
      }
      
      // If no members to reassign to, delete the project and its tasks
      await Task.deleteMany({ project: project._id });
      await project.remove();
    }

    // Remove user as member from projects
    await Project.updateMany(
      { members: { $in: [req.params.id] } },
      { $pull: { members: req.params.id } }
    );

    // Reassign tasks to project owners
    const assignedTasks = await Task.find({ assignedTo: req.params.id });
    
    for (const task of assignedTasks) {
      const project = await Project.findById(task.project);
      if (project) {
        task.assignedTo = project.owner;
        await task.save();
      }
    }

    // Delete user
    await User.findByIdAndRemove(req.params.id);

    res.json({ msg: 'User deleted successfully' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(500).send('Server error');
  }
});

module.exports = router;