const express = require('express');
const Subscription = require('../models/Subscription');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /my-courses (protected)
router.get('/', auth, async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ userId: req.user._id })
      .populate('courseId', 'title description price image')
      .sort({ subscribedAt: -1 });

    const myCourses = subscriptions.map((sub) => ({
      id: sub._id,
      courseId: sub.courseId._id,
      title: sub.courseId.title,
      description: sub.courseId.description,
      price: sub.courseId.price,
      image: sub.courseId.image,
      pricePaid: sub.pricePaid,
      subscribedAt: sub.subscribedAt,
    }));

    res.json(myCourses);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch your courses' });
  }
});

module.exports = router;
