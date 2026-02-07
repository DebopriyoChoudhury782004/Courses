require('dotenv').config();
if (!process.env.JWT_SECRET && process.env.NODE_ENV !== 'production') {
  process.env.JWT_SECRET = 'dev-secret-change-in-production';
}
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const coursesRoutes = require('./routes/courses');
const subscriptionsRoutes = require('./routes/subscriptions');
const myCoursesRoutes = require('./routes/myCourses');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/courses', coursesRoutes);
app.use('/subscribe', subscriptionsRoutes);
app.use('/my-courses', myCoursesRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
  });
});

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start().catch((err) => {
  console.error('Failed to start server:', err.message);
  process.exit(1);
});
