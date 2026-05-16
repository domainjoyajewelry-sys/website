const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/userModel');

dotenv.config();

const connectDB = async () => {
  try {
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
    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@joya.co.il' });
    if (!adminExists) {
      const adminUser = new User({
        full_name: 'Admin User',
        email: 'admin@joya.co.il',
        password: 'AdminPassword2026!',
        role: 'admin',
      });
      await adminUser.save();
      console.log('Admin user created successfully. Email: admin@joya.co.il, Password: AdminPassword2026!');
    } else {
      console.log('Admin user already exists.');
    }
  } catch (error) {
    console.error(error.message);
  } finally {
    mongoose.disconnect();
    console.log('MongoDB Disconnected');
    process.exit(0);
  }
};

seedAdmin();