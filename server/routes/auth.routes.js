const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const User = require('../models/User');
const config = require('../config/default');

/**
 * @route   POST api/auth/register
 * @desc    Register a user
 * @access  Public
 */
router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
  ],
  async (req, res) => {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // Check if user exists
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: 'User already exists' });
      }

      // Create new user
      user = new User({
        name,
        email,
        password
      });

      // Hash password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      // Save user to database
      await user.save();

      // Create JWT payload
      const payload = {
        user: {
          id: user.id
        }
      };

      // Generate and return JWT
      jwt.sign(
        payload,
        config.jwtSecret,
        { expiresIn: '5d' },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

/**
 * @route   POST api/auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  async (req, res) => {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Check if user exists
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }

      // Verify password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }

      // Create JWT payload
      const payload = {
        user: {
          id: user.id
        }
      };

      // Generate and return JWT
      jwt.sign(
        payload,
        config.jwtSecret,
        { expiresIn: '5d' },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

/**
 * @route   GET api/auth/user
 * @desc    Get authenticated user
 * @access  Private
 */
router.get('/user', auth, async (req, res) => {
  try {
    // Get user from database without password
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

/**
 * @route   POST api/auth/forgot-password
 * @desc    Send password reset email
 * @access  Public
 */
router.post(
  '/forgot-password',
  [
    check('email', 'Please include a valid email').isEmail()
  ],
  async (req, res) => {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    try {
      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: 'User not found' });
      }

      // Generate reset token
      const resetToken = jwt.sign(
        { id: user.id },
        config.jwtResetSecret,
        { expiresIn: '1h' }
      );

      // Save reset token to user
      user.resetToken = resetToken;
      user.resetTokenExpires = Date.now() + 3600000; // 1 hour
      await user.save();

      // In production, send email with reset link
      // For demo, just return token
      res.json({ msg: 'Password reset link sent', resetToken });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

/**
 * @route   POST api/auth/reset-password
 * @desc    Reset password with token
 * @access  Public
 */
router.post(
  '/reset-password',
  [
    check('token', 'Token is required').not().isEmpty(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
  ],
  async (req, res) => {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { token, password } = req.body;

    try {
      // Verify token
      const decoded = jwt.verify(token, config.jwtResetSecret);
      
      // Find user
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(400).json({ msg: 'Invalid token' });
      }

      // Check if token is valid and not expired
      if (user.resetToken !== token || user.resetTokenExpires < Date.now()) {
        return res.status(400).json({ msg: 'Token expired or invalid' });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      
      // Clear reset token
      user.resetToken = undefined;
      user.resetTokenExpires = undefined;
      
      await user.save();

      res.json({ msg: 'Password reset successful' });
    } catch (err) {
      console.error(err.message);
      res.status(401).json({ msg: 'Token is not valid' });
    }
  }
);

module.exports = router;