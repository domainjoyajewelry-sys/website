const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });

const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const axios = require('axios');

const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const AdBanner = require('../models/adBannerModel');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'hqh00rk0',
  api_key: process.env.CLOUDINARY_API_KEY || '452875985878436',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'zK8MboIz9gktnwuX8S1XPVzjLk8',
});

const uploadUrlToCloudinary = async (imageUrl) => {
  if (!imageUrl || imageUrl.includes('res.cloudinary.com')) {
    return imageUrl; // Already Cloudinary URL
  }

  try {
    let sourceToUpload = imageUrl;
    if (imageUrl.startsWith('/images/')) {
      sourceToUpload = path.join(__dirname, '../../frontend/public', imageUrl);
    }

    console.log(`Uploading to Cloudinary: ${imageUrl} (Source: ${sourceToUpload})`);
    const result = await cloudinary.uploader.upload(sourceToUpload, {
      folder: 'joya_boutique_migrated',
    });
    console.log(`-> Migrated to Cloudinary: ${result.secure_url}`);
    return result.secure_url;
  } catch (error) {
    console.error(`Failed to upload image (${imageUrl}):`, error.message);
    return imageUrl; // Keep original if upload fails
  }
};

const migrate = async () => {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB Atlas!');

    // 1. Migrate Categories
    console.log('\n--- Migrating Categories ---');
    const categories = await Category.find();
    for (const cat of categories) {
      if (cat.image && !cat.image.includes('res.cloudinary.com')) {
        const newUrl = await uploadUrlToCloudinary(cat.image);
        if (newUrl !== cat.image) {
          cat.image = newUrl;
          await cat.save();
        }
      }
    }

    // 2. Migrate Banners
    console.log('\n--- Migrating Banners ---');
    const banners = await AdBanner.find();
    for (const banner of banners) {
      if (banner.image && !banner.image.includes('res.cloudinary.com')) {
        const newUrl = await uploadUrlToCloudinary(banner.image);
        if (newUrl !== banner.image) {
          banner.image = newUrl;
          await banner.save();
        }
      }
    }

    // 3. Migrate Products & Variants
    console.log('\n--- Migrating Products ---');
    const products = await Product.find();
    for (const prod of products) {
      let updated = false;

      // Migrate primary images array
      if (prod.images && prod.images.length > 0) {
        const newImages = [];
        for (const img of prod.images) {
          if (!img.includes('res.cloudinary.com')) {
            const newUrl = await uploadUrlToCloudinary(img);
            newImages.push(newUrl);
            updated = true;
          } else {
            newImages.push(img);
          }
        }
        prod.images = newImages;
      }

      // Migrate variant images
      if (prod.variants && prod.variants.length > 0) {
        for (const variant of prod.variants) {
          if (variant.image && !variant.image.includes('res.cloudinary.com')) {
            const newUrl = await uploadUrlToCloudinary(variant.image);
            if (newUrl !== variant.image) {
              variant.image = newUrl;
              updated = true;
            }
          }
        }
      }

      if (updated) {
        await prod.save();
        console.log(`Saved product: ${prod.name}`);
      }
    }

    console.log('\n✅ All images successfully migrated to Cloudinary!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrate();
