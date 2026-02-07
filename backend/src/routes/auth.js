const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

const router = express.Router();

const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// POST /auth/signup
router.post(
  '/signup',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('name').optional().trim(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
      }

      const { email, password, name } = req.body;
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      const user = await User.create({ email, password, name: name || '' });
      const token = generateToken(user._id);
      res.status(201).json({
        message: 'User created',
        token,
        user: { id: user._id, email: user.email, name: user.name },
      });
    } catch (err) {
      res.status(500).json({ message: err.message || 'Signup failed' });
    }
  }
);

// POST /auth/login
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
      }

      const { email, password } = req.body;
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const match = await user.comparePassword(password);
      if (!match) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const token = generateToken(user._id);
      res.json({
        message: 'Login successful',
        token,
        user: { id: user._id, email: user.email, name: user.name },
      });
    } catch (err) {
      res.status(500).json({ message: err.message || 'Login failed' });
    }
  }
);

module.exports = router;
