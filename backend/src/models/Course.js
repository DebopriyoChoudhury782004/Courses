const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0, default: 0 },
    image: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', courseSchema);
