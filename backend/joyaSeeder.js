const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./models/categoryModel');
const Product = require('./models/productModel');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const seedData = async () => {
  try {
    await Product.deleteMany();
    await Category.deleteMany();

    const categories = await Category.insertMany([
      { name: 'Rings', name_he: 'טבעות', description: 'Timeless rings for every occasion', description_he: 'טבעות נצחיות לכל אירוע', slug: 'rings', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=2940' },
      { name: 'Necklaces', name_he: 'שרשראות', description: 'Elegant necklaces and pendants', description_he: 'שרשראות ותליונים אלגנטיים', slug: 'necklaces', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2940' },
      { name: 'Earrings', name_he: 'עגילים', description: 'Stunning earrings and studs', description_he: 'עגילים וצמודים מרהיבים', slug: 'earrings', image: 'https://images.unsplash.com/photo-1630019051930-47382dbdb588?q=80&w=2940' },
      { name: 'Bracelets', name_he: 'צמידים', description: 'Beautiful bracelets for your wrist', description_he: 'צמידים יפים לפרק כף היד', slug: 'bracelets', image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=2940' },
    ]);

    const products = [
      {
        name: 'Diamond Solitaire Ring',
        name_he: 'טבעת יהלום סוליטר',
        description: 'A classic 18k white gold ring featuring a brilliant-cut diamond.',
        description_he: 'טבעת זהב לבן 18 קראט קלאסית הכוללת יהלום בחיתוך מבריק.',
        price: 4500,
        images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=2940'],
        category: categories[0]._id,
        countInStock: 5,
        featured: true,
        materials: '18K White Gold, Diamond',
        materials_he: 'זהב לבן 18K, יהלום',
      },
      {
        name: 'Gold Pearl Necklace',
        name_he: 'שרשרת פניני זהב',
        description: 'Exquisite 14k yellow gold necklace with a south sea pearl.',
        description_he: 'שרשרת זהב צהוב 14 קראט יוקרתית עם פנינת דרום הים.',
        price: 1200,
        images: ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2940'],
        category: categories[1]._id,
        countInStock: 8,
        featured: true,
        materials: '14K Yellow Gold, Pearl',
        materials_he: 'זהב צהוב 14K, פנינה',
      },
      {
        name: 'Sapphire Drop Earrings',
        name_he: 'עגילי טיפת ספיר',
        description: 'Deep blue sapphire earrings surrounded by diamonds.',
        description_he: 'עגילי ספיר כחולים עמוקים מוקפים ביהלומים.',
        price: 2800,
        images: ['https://images.unsplash.com/photo-1630019051930-47382dbdb588?q=80&w=2940'],
        category: categories[2]._id,
        countInStock: 3,
        featured: true,
        materials: 'Platinum, Sapphire, Diamond',
        materials_he: 'פלטינה, ספיר, יהלום',
      },
      {
        name: 'Classic Gold Bracelet',
        name_he: 'צמיד זהב קלאסי',
        description: 'Minimalist 18k yellow gold bracelet for everyday wear.',
        description_he: 'צמיד זהב צהוב 18 קראט מינימליסטי ללבוש יומיומי.',
        price: 950,
        images: ['https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=2940'],
        category: categories[3]._id,
        countInStock: 12,
        featured: true,
        materials: '18K Yellow Gold',
        materials_he: 'זהב צהוב 18K',
      }
    ];

    await Product.insertMany(products);

    console.log('Joya Data Seeded Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
