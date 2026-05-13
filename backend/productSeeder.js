const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/productModel');
const Category = require('./models/categoryModel');
const Order = require('./models/orderModel');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();

    // Fetch categories to get their IDs
    const categories = await Category.find({});
    
    if (categories.length === 0) {
      console.error('No categories found. Please run categorySeeder first.');
      process.exit(1);
    }

    // Create a map of category names to IDs
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.name.en] = cat._id;
    });

    const products = [
      // EARRINGS (3 products)
      {
        name: {
          en: 'Gold Hoop Earrings',
          he: 'עגילי חישוק זהב',
        },
        image: 'https://images.pexels.com/photos/2735970/pexels-photo-2735970.jpeg',
        description: {
          en: 'Classic gold hoop earrings for a timeless look.',
          he: 'עגילי חישוק זהב קלאסיים למראה נצחי.',
        },
        brand: 'JewelryCo',
        category: categoryMap['Earrings'],
        price: {
          usd: 89.99,
          ils: 300,
        },
        countInStock: 10,
        rating: 4.5,
        numReviews: 12,
        isFeatured: true,
        isOnSale: true,
        salePrice: {
          usd: 69.99,
          ils: 230,
        },
        saleStartDate: new Date('2023-01-01'),
        saleEndDate: new Date('2029-12-31'),
        isBestSeller: true,
      },
      {
        name: {
          en: 'Diamond Stud Earrings',
          he: 'עגילי יהלום צמודים',
        },
        image: 'https://images.pexels.com/photos/2735970/pexels-photo-2735970.jpeg',
        description: {
          en: 'Elegant diamond stud earrings that add a touch of sparkle.',
          he: 'עגילי יהלום צמודים ואלגנטיים שמוסיפים נגיעה של נצנוץ.',
        },
        brand: 'JewelryCo',
        category: categoryMap['Earrings'],
        price: {
          usd: 299.99,
          ils: 1000,
        },
        countInStock: 5,
        rating: 5,
        numReviews: 20,
        isFeatured: true,
        isSitePick: true,
      },
      {
        name: {
          en: 'Pearl Drop Earrings',
          he: 'עגילי טיפת פנינה',
        },
        image: 'https://images.pexels.com/photos/2735970/pexels-photo-2735970.jpeg',
        description: {
          en: 'Beautiful pearl drop earrings for an elegant look.',
          he: 'עגילי טיפת פנינה יפים למראה אלגנטית.',
        },
        brand: 'JewelryCo',
        category: categoryMap['Earrings'],
        price: {
          usd: 179.99,
          ils: 600,
        },
        countInStock: 8,
        rating: 4.6,
        numReviews: 14,
        isFeatured: true,
      },
      // BRACELETS
      {
        name: {
          en: 'Silver Charm Bracelet',
          he: 'צמיד כסף עם קסמים',
        },
        image: 'https://images.pexels.com/photos/266621/pexels-photo-266621.jpeg',
        description: {
          en: 'A beautiful silver charm bracelet to personalize your style.',
          he: 'צמיד כסף יפהפה עם קסמים להתאמה אישית של הסגנון שלך.',
        },
        brand: 'JewelryCo',
        category: categoryMap['Bracelets'],
        price: {
          usd: 129.99,
          ils: 430,
        },
        countInStock: 15,
        rating: 4.0,
        numReviews: 8,
        isFeatured: true,
      },
      {
        name: {
          en: 'Leather Wrap Bracelet',
          he: 'צמיד עור כרוך',
        },
        image: 'https://images.pexels.com/photos/266621/pexels-photo-266621.jpeg',
        description: {
          en: 'A stylish leather wrap bracelet for a modern, edgy look.',
          he: 'צמיד עור כרוך מסוגנן למראה מודרני ונועז.',
        },
        brand: 'JewelryCo',
        category: categoryMap['Bracelets'],
        price: {
          usd: 49.99,
          ils: 165,
        },
        countInStock: 20,
        rating: 4.5,
        numReviews: 15,
        isFeatured: false,
      },
      {
        name: {
          en: 'Tennis Bracelet',
          he: 'צמיד טניס',
        },
        image: 'https://images.pexels.com/photos/266621/pexels-photo-266621.jpeg',
        description: {
          en: 'Classic tennis bracelet with brilliant diamonds.',
          he: 'צמיד טניס קלאסי עם יהלומים זהירים.',
        },
        brand: 'JewelryCo',
        category: categoryMap['Bracelets'],
        price: {
          usd: 599.99,
          ils: 1990,
        },
        countInStock: 4,
        rating: 4.9,
        numReviews: 22,
        isFeatured: true,
      },
      // NECKLACES
      {
        name: {
          en: 'Pearl Pendant Necklace',
          he: 'שרשרת תליון פנינה',
        },
        image: 'https://images.pexels.com/photos/906056/pexels-photo-906056.jpeg',
        description: {
          en: 'A classic pearl pendant necklace for a touch of elegance.',
          he: 'שרשרת תליון פנינה קלאסית למגע של אלגנטיות.',
        },
        brand: 'JewelryCo',
        category: categoryMap['Necklaces'],
        price: {
          usd: 149.99,
          ils: 500,
        },
        countInStock: 7,
        rating: 4.8,
        numReviews: 25,
        isFeatured: true,
      },
      {
        name: {
          en: 'Gold Chain Necklace',
          he: 'שרשרת זהב',
        },
        image: 'https://images.pexels.com/photos/1458867/pexels-photo-1458867.jpeg',
        description: {
          en: 'A versatile gold chain necklace that can be worn alone or layered.',
          he: 'שרשרת זהב רב-תכליתית שניתן לענוד לבד או בשכבות.',
        },
        brand: 'JewelryCo',
        category: categoryMap['Necklaces'],
        price: {
          usd: 199.99,
          ils: 660,
        },
        countInStock: 12,
        rating: 4.7,
        numReviews: 18,
        isFeatured: false,
      },
      {
        name: {
          en: 'Diamond Pendant',
          he: 'תליון יהלום',
        },
        image: 'https://images.pexels.com/photos/906056/pexels-photo-906056.jpeg',
        description: {
          en: 'Stunning diamond pendant with gold chain.',
          he: 'תליון יהלום מדהים עם שרשרת זהב.',
        },
        brand: 'JewelryCo',
        category: categoryMap['Necklaces'],
        price: {
          usd: 899.99,
          ils: 2990,
        },
        countInStock: 6,
        rating: 5,
        numReviews: 28,
        isFeatured: true,
      },
      // 18K GOLD
      {
        name: {
          en: '18K Gold Ring',
          he: 'טבעת זהב 18K',
        },
        image: 'https://images.pexels.com/photos/3266703/pexels-photo-3266703.jpeg',
        description: {
          en: 'Elegant 18K gold ring with timeless design.',
          he: 'טבעת זהב 18K אלגנטית עם עיצוב נצחי.',
        },
        brand: 'JewelryCo',
        category: categoryMap['18K Gold'],
        price: {
          usd: 799.99,
          ils: 2650,
        },
        countInStock: 5,
        rating: 4.9,
        numReviews: 19,
        isFeatured: true,
      },
      {
        name: {
          en: '18K Gold Bracelet',
          he: 'צמיד זהב 18K',
        },
        image: 'https://images.pexels.com/photos/266621/pexels-photo-266621.jpeg',
        description: {
          en: 'Premium 18K gold bracelet for luxury wear.',
          he: 'צמיד זהב 18K פרימיום ללבוש יוקרתי.',
        },
        brand: 'JewelryCo',
        category: categoryMap['18K Gold'],
        price: {
          usd: 1099.99,
          ils: 3650,
        },
        countInStock: 3,
        rating: 5,
        numReviews: 16,
        isFeatured: true,
      },
      // FINE JEWELRY
      {
        name: {
          en: 'Diamond Solitaire Ring',
          he: 'טבעת סוליטר יהלום',
        },
        image: 'https://images.pexels.com/photos/3266703/pexels-photo-3266703.jpeg',
        description: {
          en: 'A stunning diamond solitaire ring, the perfect symbol of love.',
          he: 'טבעת סוליטר יהלום מהממת, הסמל המושלם לאהבה.',
        },
        brand: 'JewelryCo',
        category: categoryMap['Fine Jewelry'],
        price: {
          usd: 1299.99,
          ils: 4300,
        },
        countInStock: 3,
        rating: 5,
        numReviews: 30,
        isFeatured: true,
      },
      {
        name: {
          en: 'Luxury Diamond Set',
          he: 'סט יהלום יוקרתי',
        },
        image: 'https://images.pexels.com/photos/3266703/pexels-photo-3266703.jpeg',
        description: {
          en: 'Complete luxury diamond jewelry set with earrings, necklace, and bracelet.',
          he: 'סט תכשיטי יהלום יוקרתי שלם עם עגילים, שרשרת וצמיד.',
        },
        brand: 'JewelryCo',
        category: categoryMap['Fine Jewelry'],
        price: {
          usd: 2499.99,
          ils: 8300,
        },
        countInStock: 2,
        rating: 5,
        numReviews: 12,
        isFeatured: true,
      },
    ];

    await Product.insertMany(products);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

importData();