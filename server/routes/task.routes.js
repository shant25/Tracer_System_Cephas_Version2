const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');

/**
 * @route   GET api/tasks
 * @desc    Get all tasks assigned to authenticated user
 * @access  Private
 */
router.get('/', auth, async (req, res) => {
  try {
    // Find tasks assigned to the user
    const tasks = await Task.find({ assignedTo: req.user.id })
      .populate('project', 'name')
      .populate('createdBy', 'name email')
      .sort({ dueDate: 1 });
    
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

/**
 * @route   POST api/tasks
 * @desc    Create a new task
 * @access  Private
 */
router.post(
  '/',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty(),
      check('project', 'Project is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { 
        title, 
        description, 
        project, 
        priority, 
        status, 
        dueDate, 
        assignedTo 
      } = req.body;

      // Check if project exists and user has access
      const projectObj = await Project.findById(project);
      if (!projectObj) {
        return res.status(404).json({ msg: 'Project not found' });
      }

      // Check if user has access to project
      if (projectObj.owner.toString() !== req.user.id && 
          !projectObj.members.includes(req.user.id)) {
        return res.status(403).json({ msg: 'Not authorized to create tasks in this project' });
      }

      // Check if assignedTo user is a member of the project
      if (assignedTo && 
          !projectObj.members.includes(assignedTo) && 
          projectObj.owner.toString() !== assignedTo) {
        return res.status(400).json({ msg: 'Assigned user must be a project member' });
      }

      // Create new task
      const newTask = new Task({
        title,
        description,
        project,
        priority: priority || 'medium',
        status: status || 'pending',
        createdBy: req.user.id,
        assignedTo: assignedTo || req.user.id,
        dueDate: dueDate || null
      });

      const task = await newTask.save();

      // Populate and return the task
      const populatedTask = await Task.findById(task._id)
        .populate('project', 'name')
        .populate('assignedTo', 'name email')
        .populate('createdBy', 'name email');

      res.json(populatedTask);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

/**
 * @route   GET api/tasks/:id
 * @desc    Get task by ID
 * @access  Private
 */
router.get('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('project', 'name')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    // Check if task exists
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    // Get project to check access
    const project = await Project.findById(task.project);

    // Check if user has access to project
    if (project.owner.toString() !== req.user.id && 
        !project.members.includes(req.user.id)) {
      return res.status(403).json({ msg: 'Access denied' });
    }

    res.json(task);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Task not found' });
    }
    res.status(500).send('Server error');
  }
});

/**
 * @route   PUT api/tasks/:id
 * @desc    Update a task
 * @access  Private
 */
router.put(
  '/:id',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
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
      let task = await Task.findById(req.params.id);

      // Check if task exists
      if (!task) {
        return res.status(404).json({ msg: 'Task not found' });
      }

      // Get project to check access
      const project = await Project.findById(task.project);

      // Check if user has access to project and is task creator or project owner
      const isAuthorized = project.owner.toString() === req.user.id || 
                          (task.createdBy.toString() === req.user.id && 
                          project.members.includes(req.user.id));

      if (!isAuthorized) {
        return res.status(403).json({ msg: 'Not authorized to update this task' });
      }

      const { 
        title, 
        description, 
        priority, 
        status, 
        dueDate, 
        assignedTo 
      } = req.body;

      // Check if assignedTo user is a member of the project
      if (assignedTo && 
          !project.members.includes(assignedTo) && 
          project.owner.toString() !== assignedTo) {
        return res.status(400).json({ msg: 'Assigned user must be a project member' });
      }

      // Update task fields
      task.title = title;
      task.description = description;
      if (priority) task.priority = priority;
      if (status) task.status = status;
      if (dueDate) task.dueDate = dueDate;
      if (assignedTo) task.assignedTo = assignedTo;

      await task.save();

      // Populate and return the task
      const updatedTask = await Task.findById(task._id)
        .populate('project', 'name')
        .populate('assignedTo', 'name email')
        .populate('createdBy', 'name email');

      res.json(updatedTask);
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Task not found' });
      }
      res.status(500).send('Server error');
    }
  }
);

/**
 * @route   DELETE api/tasks/:id
 * @desc    Delete a task
 * @access  Private
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    // Check if task exists
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    // Get project to check access
    const project = await Project.findById(task.project);

    // Check if user is the project owner or task creator
    const isAuthorized = project.owner.toString() === req.user.id || 
                        (task.createdBy.toString() === req.user.id && 
                        project.members.includes(req.user.id));

    if (!isAuthorized) {
      return res.status(403).json({ msg: 'Not authorized to delete this task' });
    }

    await task.remove();
    res.json({ msg: 'Task removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Task not found' });
    }
    res.status(500).send('Server error');
  }
});

/**
 * @route   PUT api/tasks/:id/status
 * @desc    Update task status
 * @access  Private
 */
router.put(
  '/:id/status',
  [
    auth,
    [
      check('status', 'Status is required').isIn(['pending', 'in-progress', 'completed'])
    ]
  ],
  async (req, res) => {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let task = await Task.findById(req.params.id);

      // Check if task exists
      if (!task) {
        return res.status(404).json({ msg: 'Task not found' });
      }

      // Get project to check access
      const project = await Project.findById(task.project);

      // Check if user is assigned to the task or is project owner
      const isAuthorized = project.owner.toString() === req.user.id || 
                          task.assignedTo.toString() === req.user.id;

      if (!isAuthorized) {
        return res.status(403).json({ msg: 'Not authorized to update this task status' });
      }

      // Update task status
      task.status = req.body.status;
      
      // If completed, set completedAt
      if (req.body.status === 'completed') {
        task.completedAt = Date.now();
      } else {
        // If not completed, clear completedAt
        task.completedAt = null;
      }

      await task.save();

      // Populate and return the task
      const updatedTask = await Task.findById(task._id)
        .populate('project', 'name')
        .populate('assignedTo', 'name email')
        .populate('createdBy', 'name email');

      res.json(updatedTask);
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Task not found' });
      }
      res.status(500).send('Server error');
    }
  }
);

/**
 * @route   PUT api/tasks/:id/assign
 * @desc    Assign a task to a user
 * @access  Private
 */
router.put(
  '/:id/assign',
  [
    auth,
    [
      check('assignedTo', 'User ID is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let task = await Task.findById(req.params.id);

      // Check if task exists
      if (!task) {
        return res.status(404).json({ msg: 'Task not found' });
      }

      // Get project to check access
      const project = await Project.findById(task.project);

      // Check if user is project owner or task creator
      const isAuthorized = project.owner.toString() === req.user.id || 
                          (task.createdBy.toString() === req.user.id && 
                          project.members.includes(req.user.id));

      if (!isAuthorized) {
        return res.status(403).json({ msg: 'Not authorized to assign this task' });
      }

      // Check if user to assign is a member of the project
      const { assignedTo } = req.body;
      if (!project.members.includes(assignedTo) && 
          project.owner.toString() !== assignedTo) {
        return res.status(400).json({ msg: 'Assigned user must be a project member' });
      }

      // Update assigned user
      task.assignedTo = assignedTo;
      await task.save();

      // Populate and return the task
      const updatedTask = await Task.findById(task._id)
        .populate('project', 'name')
        .populate('assignedTo', 'name email')
        .populate('createdBy', 'name email');

      res.json(updatedTask);
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Task not found' });
      }
      res.status(500).send('Server error');
    }
  }
);

/**
 * @route   POST api/tasks/:id/comments
 * @desc    Add a comment to a task
 * @access  Private
 */
router.post(
  '/:id/comments',
  [
    auth,
    [
      check('text', 'Comment text is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let task = await Task.findById(req.params.id);

      // Check if task exists
      if (!task) {
        return res.status(404).json({ msg: 'Task not found' });
      }

      // Get project to check access
      const project = await Project.findById(task.project);

      // Check if user has access to project
      if (project.owner.toString() !== req.user.id && 
          !project.members.includes(req.user.id)) {
        return res.status(403).json({ msg: 'Access denied' });
      }

      // Create new comment
      const newComment = {
        user: req.user.id,
        text: req.body.text,
        name: req.user.name
      };

      // Add comment to task
      task.comments.unshift(newComment);
      await task.save();

      res.json(task.comments);
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Task not found' });
      }
      res.status(500).send('Server error');
    }
  }
);

/**
 * @route   DELETE api/tasks/:id/comments/:comment_id
 * @desc    Delete a comment
 * @access  Private
 */
router.delete('/:id/comments/:comment_id', auth, async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    // Check if task exists
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    // Get project to check access
    const project = await Project.findById(task.project);

    // Find the comment
    const comment = task.comments.find(
      comment => comment.id === req.params.comment_id
    );

    // Check if comment exists
    if (!comment) {
      return res.status(404).json({ msg: 'Comment not found' });
    }

    // Check if user is comment author or project owner
    if (comment.user.toString() !== req.user.id && 
        project.owner.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized to delete this comment' });
    }

    // Remove comment
    task.comments = task.comments.filter(
      comment => comment.id !== req.params.comment_id
    );

    await task.save();
    res.json(task.comments);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Task or comment not found' });
    }
    res.status(500).send('Server error');
  }
});

/**
 * @route   GET api/tasks/search
 * @desc    Search tasks by title or description
 * @access  Private
 */
router.get('/search/:query', auth, async (req, res) => {
  try {
    const searchQuery = req.params.query;

    // Find projects where user is a member or owner
    const projects = await Project.find({
      $or: [
        { owner: req.user.id },
        { members: { $in: [req.user.id] } }
      ]
    });

    const projectIds = projects.map(project => project._id);

    // Search for tasks within user's projects
    const tasks = await Task.find({ 
      project: { $in: projectIds },
      $or: [
        { title: { $regex: searchQuery, $options: 'i' } },
        { description: { $regex: searchQuery, $options: 'i' } }
      ]
    })
      .populate('project', 'name')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

/**
 * @route   GET api/tasks/overdue
 * @desc    Get all overdue tasks assigned to the user
 * @access  Private
 */
router.get('/status/overdue', auth, async (req, res) => {
  try {
    // Find overdue tasks assigned to the user
    const tasks = await Task.find({ 
      assignedTo: req.user.id,
      status: { $ne: 'completed' },
      dueDate: { $lt: new Date() }
    })
      .populate('project', 'name')
      .populate('createdBy', 'name email')
      .sort({ dueDate: 1 });
    
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

/**
 * @route   GET api/tasks/upcoming
 * @desc    Get upcoming tasks (due in the next 7 days)
 * @access  Private
 */
router.get('/status/upcoming', auth, async (req, res) => {
  try {
    // Calculate date 7 days from now
    const oneWeekAhead = new Date();
    oneWeekAhead.setDate(oneWeekAhead.getDate() + 7);

    // Find upcoming tasks assigned to the user
    const tasks = await Task.find({ 
      assignedTo: req.user.id,
      status: { $ne: 'completed' },
      dueDate: { 
        $gte: new Date(),
        $lte: oneWeekAhead 
      }
    })
      .populate('project', 'name')
      .populate('createdBy', 'name email')
      .sort({ dueDate: 1 });
    
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;