
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/userModel');

dotenv.config({ path: './.env' });

const connectDB = async () => {
  try {
    console.log('MONGO_URI in seedAdmin:', process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log('MongoDB Connected...');
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

const seedAdmin = async () => {
  await connectDB();

  try {
    // Clear existing users to ensure a clean seed
    await User.deleteMany({});
    console.log('All existing users cleared.');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const adminUser = new User({
      name: 'Admin',
      email: 'admin@example.com',
      password: hashedPassword,
      isAdmin: true,
    });

    await adminUser.save();
    console.log('Admin user created');
  } catch (error) {
    console.error(error.message);
  } finally {
    mongoose.disconnect();
    console.log('MongoDB Disconnected');
  }
};

seedAdmin();
