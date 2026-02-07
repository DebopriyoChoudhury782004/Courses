const express = require('express');
const { body, validationResult } = require('express-validator');
const Course = require('../models/Course');
const Subscription = require('../models/Subscription');
const auth = require('../middleware/auth');
const { VALID_PROMO_CODE, PROMO_DISCOUNT_PERCENT } = require('../constants/promo');

const router = express.Router();

// POST /subscribe (protected)
router.post(
  '/subscribe',
  auth,
  [
    body('courseId').isMongoId().withMessage('Valid course ID required'),
    body('promoCode').optional().trim(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
      }

      const { courseId, promoCode } = req.body;
      const userId = req.user._id;

      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }

      const existing = await Subscription.findOne({ userId, courseId });
      if (existing) {
        return res.status(400).json({ message: 'Already subscribed to this course' });
      }

      let pricePaid = course.price;

      if (course.price > 0) {
        // Paid course – promo required and must be valid
        if (!promoCode || promoCode.trim() === '') {
          return res.status(400).json({
            message: 'Promo code required for paid courses',
            originalPrice: course.price,
          });
        }
        const appliedPromo = promoCode.trim().toUpperCase();
        if (appliedPromo !== VALID_PROMO_CODE) {
          return res.status(400).json({
            message: 'Invalid promo code',
            originalPrice: course.price,
          });
        }
        pricePaid = Math.round((course.price * (100 - PROMO_DISCOUNT_PERCENT)) / 100);
      }

      const subscription = await Subscription.create({
        userId,
        courseId,
        pricePaid,
        subscribedAt: new Date(),
      });

      await subscription.populate('courseId', 'title description price image');

      res.status(201).json({
        message: 'Subscribed successfully',
        subscription: {
          id: subscription._id,
          courseId: subscription.courseId,
          pricePaid: subscription.pricePaid,
          subscribedAt: subscription.subscribedAt,
        },
      });
    } catch (err) {
      res.status(500).json({ message: err.message || 'Subscription failed' });
    }
  }
);

module.exports = router;
