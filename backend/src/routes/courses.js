const express = require('express');
const Course = require('../models/Course');

const router = express.Router();

// GET /courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch courses' });
  }
});

// GET /courses/:id
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(500).json({ message: err.message || 'Failed to fetch course' });
  }
});

module.exports = router;
