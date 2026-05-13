const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const dropDB = async () => {
  try {
    await connectDB();
    await mongoose.connection.db.dropDatabase();
    console.log('Database dropped');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

dropDB();