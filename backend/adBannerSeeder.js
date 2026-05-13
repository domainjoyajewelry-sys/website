
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const AdBanner = require('./models/adBannerModel');

dotenv.config();

const seedAdBanner = async () => {
  try {
    await connectDB();

    await AdBanner.deleteMany();

    const adBanner = new AdBanner({
      name: 'Ad Banner',
      imageUrl: 'https://images.pexels.com/photos/5872186/pexels-photo-5872186.jpeg',
      link: '#'
    });

    await adBanner.save();

    console.log('Ad banner seeded');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

seedAdBanner();
