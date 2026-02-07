require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Course = require('../models/Course');
const Subscription = require('../models/Subscription');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mini-course-subscription';

const dummyUsers = [
  { name: 'Alice Demo', email: 'alice@demo.com', password: 'demo123' },
  { name: 'Bob Test', email: 'bob@test.com', password: 'test123' },
  { name: 'Charlie User', email: 'charlie@user.com', password: 'user123' },
];

const dummyCourses = [
  {
    title: 'React Fundamentals',
    description: 'Learn React from scratch: components, hooks, and state management. Build modern UIs with confidence.',
    price: 0,
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop',
  },
  {
    title: 'Node.js & Express Backend',
    description: 'Build scalable REST APIs with Node.js and Express. Authentication, MongoDB, and deployment.',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1627398242794-70208e692c8b?w=400&h=250&fit=crop',
  },
  {
    title: 'MongoDB Mastery',
    description: 'Master MongoDB: schemas, aggregation, indexing, and Mongoose ODM. From basics to production.',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=250&fit=crop',
  },
  {
    title: 'TailwindCSS for Rapid UI',
    description: 'Ship beautiful, responsive interfaces fast with TailwindCSS. Utility-first CSS and component patterns.',
    price: 0,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop',
  },
  {
    title: 'JWT & Secure Auth',
    description: 'Implement JWT authentication, refresh tokens, and secure APIs. Best practices for production.',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1614064548238-40e519593c8e?w=400&h=250&fit=crop',
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    await Course.deleteMany({});
    await Subscription.deleteMany({});

    const users = await User.insertMany(dummyUsers);
    const courses = await Course.insertMany(dummyCourses);

    console.log('\n========== DUMMY CREDENTIALS (use these to login) ==========');
    dummyUsers.forEach((u, i) => {
      console.log(`User ${i + 1}: Email: ${u.email}  |  Password: ${u.password}`);
    });
    console.log('================================================================\n');

    console.log(`Seeded ${users.length} users, ${courses.length} courses.`);
    console.log('Seed completed successfully.\n');
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
