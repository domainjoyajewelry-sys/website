const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./models/categoryModel');
const Product = require('./models/productModel');
const AdBanner = require('./models/adBannerModel');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const seedData = async () => {
  try {
    // 1. Clean everything
    await Product.deleteMany();
    await Category.deleteMany();
    await AdBanner.deleteMany();

    // 2. Create only necessary categories for the new items
    const categories = await Category.insertMany([
      { 
        name: 'Piercing', 
        name_he: 'פירסינג', 
        description: 'Exquisite body jewelry for the discerning collector', 
        description_he: 'תכשיטי גוף מעולים לאספנים אניני טעם', 
        slug: 'piercing', 
        image: '/images/new/p1.jpeg' 
      },
      { 
        name: 'Earrings', 
        name_he: 'עגילים', 
        description: 'Timeless elegance for every moment', 
        description_he: 'אלגנטיות נצחית לכל רגע', 
        slug: 'earrings', 
        image: '/images/new/p4.jpeg' 
      }
    ]);

    // 3. Seed only the new products based on the uploaded images
    const products = [
      {
        name: 'Royal Sun Piercing Stud',
        name_he: 'עגיל פירסינג שמש מלכותית',
        description: 'A masterpiece of 14k gold, featuring intricate detailing inspired by celestial bodies.',
        description_he: 'יצירת מופת מזהב 14 קראט, הכוללת פירוט מורכב בהשראת גרמי השמיים.',
        price: 1250,
        images: ['/images/new/p1.jpeg'],
        category: categories[0]._id,
        countInStock: 8,
        featured: true, isNewArrival: true,
        materials: '14K Gold, Premium Craftsmanship',
        materials_he: 'זהב 14K, עבודת יד ברמה גבוהה',
        variants: [
          { color: 'Gold', color_he: 'זהב', image: '/images/new/p1.jpeg', hex: '#D4AF37' },
          { color: 'Silver', color_he: 'כסף', image: '/images/new/p2.jpeg', hex: '#C0C0C0' }
        ],
        piercingSide: 'both',
        unitType: 'single',
        pipeLength: '1cm'
      },
      {
        name: 'Celestial Bloom Stud',
        name_he: 'עגיל פריחת השמיים',
        description: 'Delicate and divine, this silver piece captures the essence of a blooming universe.',
        description_he: 'עדין ואלוהי, פריט כסף זה לוכד את מהות היקום הפורח.',
        price: 950,
        images: ['/images/new/p2.jpeg'],
        category: categories[0]._id,
        countInStock: 12,
        featured: true, isNewArrival: true,
        materials: 'Sterling Silver',
        materials_he: 'כסף סטרלינג',
        variants: [
          { color: 'Silver', color_he: 'כסף', image: '/images/new/p2.jpeg', hex: '#C0C0C0' },
          { color: 'Rose Gold', color_he: 'רוז גולד', image: '/images/new/p3.jpeg', hex: '#B76E79' }
        ],
        piercingSide: 'right',
        unitType: 'single',
        pipeLength: '1.2cm'
      },
      {
        name: 'Goddess Rose Gold Piercing',
        name_he: 'פירסינג רוז גולד האלה',
        description: 'Infused with warmth and grace, our rose gold variant is designed for those who seek unique beauty.',
        description_he: 'חדור חמימות וחן, גרסת הרוז גולד שלנו עוצבה עבור אלו המחפשים יופי ייחודי.',
        price: 1100,
        images: ['/images/new/p3.jpeg'],
        category: categories[0]._id,
        countInStock: 5,
        featured: true, isNewArrival: true,
        materials: '18K Rose Gold',
        materials_he: 'רוז גולד 18K',
        variants: [
          { color: 'Rose Gold', color_he: 'רוז גולד', image: '/images/new/p3.jpeg', hex: '#B76E79' },
          { color: 'Gold', color_he: 'זהב', image: '/images/new/p1.jpeg', hex: '#D4AF37' }
        ],
        piercingSide: 'left',
        unitType: 'single',
        pipeLength: '1cm'
      },
      {
        name: 'Infinity Arc Hoop',
        name_he: 'חישוק קשת האינסוף',
        description: 'A seamless blend of modern geometry and classic jewelry design.',
        description_he: 'שילוב חלק של גיאומטריה מודרנית ועיצוב תכשיטים קלאסי.',
        price: 1400,
        images: ['/images/new/p4.jpeg'],
        category: categories[1]._id,
        countInStock: 15,
        featured: true, isNewArrival: true,
        materials: '18K Yellow Gold',
        materials_he: 'זהב צהוב 18K',
        variants: [
          { color: 'Gold', color_he: 'זהב', image: '/images/new/p4.jpeg', hex: '#D4AF37' }
        ],
        piercingSide: 'both',
        unitType: 'pair',
        pipeLength: '2cm'
      }
    ];

    await Product.insertMany(products);

    // 4. Reset Banner to use the new video
    await AdBanner.create({
      title: 'The New Era of JOYA',
      title_he: 'העידן החדש של ג׳ויה',
      subtitle: 'Premium Piercing Collection',
      subtitle_he: 'קולקציית פירסינג פרימיום',
      image: '/images/new/p1.jpeg',
      video: '/videos/hero-bg.mp4',
      backgroundType: 'video',
      isActive: true,
      order: 0
    });

    console.log('Database Purged and Re-Seeded with ONLY your new data!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
