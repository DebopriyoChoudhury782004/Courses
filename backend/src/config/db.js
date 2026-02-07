const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mini-course-subscription';
  const options = {
    serverSelectionTimeoutMS: 10000,
    maxPoolSize: 10,
  };

  try {
    const conn = await mongoose.connect(uri, options);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    if (error.message?.includes('ENOTFOUND')) {
      console.error('Tip: Check MONGODB_URI host (e.g. Atlas cluster URL or localhost).');
    }
    if (error.message?.includes('authentication failed')) {
      console.error('Tip: Check username and password in MONGODB_URI. Special characters in password must be URL-encoded.');
    }
    process.exit(1);
  }
};

module.exports = connectDB;
