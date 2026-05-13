const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./models/categoryModel');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await Category.deleteMany();

    // Main categories (root level)
    const mainCategories = [
      {
        name: { en: 'Earrings', he: 'עגילים' },
        description: { en: 'Beautiful earrings for every occasion', he: 'עגילים יפים לכל מناسبה' },
        isActive: true,
      },
      {
        name: { en: 'Bracelets', he: 'צמידים' },
        description: { en: 'Elegant bracelets collection', he: 'קולקציית צמידים אלגנטית' },
        isActive: true,
      },
      {
        name: { en: 'Necklaces', he: 'שרשראות' },
        description: { en: 'Stunning necklaces for every style', he: 'שרשראות מדהימות לכל סגנון' },
        isActive: true,
      },
      {
        name: { en: '18K Gold', he: 'זהב 18K' },
        description: { en: 'Premium 18K fine jewelry collection', he: 'קולקציית תכשיטים עדינים בזהב 18K' },
        isActive: true,
      },
      {
        name: { en: 'Fine Jewelry', he: 'תכשיטים עדינים' },
        description: { en: 'Luxury fine jewelry pieces', he: 'פיסות תכשיטים עדינות יוקרתיות' },
        isActive: true,
      },
    ];

    // Insert main categories first
    const savedCategories = await Category.insertMany(mainCategories);
    const categoryMap = {};
    savedCategories.forEach(cat => {
      categoryMap[cat.name.en] = cat._id;
    });

    // Subcategories (will be added later after we confirm the structure)
    const subcategories = [
      // Earrings subcategories
      { name: { en: 'Drop Earrings', he: 'עגילי טיפה' }, parent: categoryMap['Earrings'] },
      { name: { en: 'Stud Earrings', he: 'עגילי גדל' }, parent: categoryMap['Earrings'] },
      { name: { en: 'Hoop Earrings', he: 'עגילי חישוק' }, parent: categoryMap['Earrings'] },
      
      // Bracelets subcategories
      { name: { en: 'Tennis Bracelets', he: 'צמידי טניס' }, parent: categoryMap['Bracelets'] },
      { name: { en: 'Charm Bracelets', he: 'צמידי קסם' }, parent: categoryMap['Bracelets'] },
      { name: { en: 'Bangle Bracelets', he: 'צמידי טבעות' }, parent: categoryMap['Bracelets'] },
      
      // Necklaces subcategories
      { name: { en: 'Pendant Necklaces', he: 'שרשראות תלוי' }, parent: categoryMap['Necklaces'] },
      { name: { en: 'Chain Necklaces', he: 'שרשראות שרשרת' }, parent: categoryMap['Necklaces'] },
      { name: { en: 'Choker Necklaces', he: 'שרשראות צוואר' }, parent: categoryMap['Necklaces'] },
    ];

    await Category.insertMany(subcategories);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

importData();