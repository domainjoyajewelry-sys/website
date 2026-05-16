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
      { 
        name: 'Rings', 
        name_he: 'טבעות', 
        description: 'Timeless rings for every occasion', 
        description_he: 'טבעות נצחיות לכל אירוע', 
        slug: 'rings', 
        image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800' 
      },
      { 
        name: 'Necklaces', 
        name_he: 'שרשראות', 
        description: 'Elegant necklaces and pendants', 
        description_he: 'שרשראות ותליונים אלגנטיים', 
        slug: 'necklaces', 
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800' 
      },
      { 
        name: 'Earrings', 
        name_he: 'עגילים', 
        description: 'Stunning earrings and studs', 
        description_he: 'עגילים וצמודים מרהיבים', 
        slug: 'earrings', 
        image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800' 
      },
      { 
        name: 'Bracelets', 
        name_he: 'צמידים', 
        description: 'Beautiful bracelets for your wrist', 
        description_he: 'צמידים יפים לפרק כף היד', 
        slug: 'bracelets', 
        image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800' 
      },
      { 
        name: 'Piercing', 
        name_he: 'פירסינג', 
        description: 'High quality body jewelry', 
        description_he: 'תכשיטי גוף באיכות גבוהה', 
        slug: 'piercing', 
        image: 'https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?auto=format&fit=crop&q=80&w=800' 
      },
    ]);

    const products = [
      // RINGS
      {
        name: 'Diamond Solitaire Ring',
        name_he: 'טבעת יהלום סוליטר',
        description: 'A classic 18k white gold ring featuring a brilliant-cut diamond.',
        description_he: 'טבעת זהב לבן 18 קראט קלאסית הכוללת יהלום בחיתוך מבריק.',
        price: 4500,
        images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800'],
        category: categories[0]._id,
        countInStock: 5,
        featured: true,
        materials: '18K White Gold, Diamond',
        materials_he: 'זהב לבן 18K, יהלום',
        colors: 'Silver',
        colors_he: 'כסף',
      },
      {
        name: 'Gold Infinity Band',
        name_he: 'טבעת אינפיניטי זהב',
        description: 'Elegant 14k yellow gold infinity band symbolising eternal love.',
        description_he: 'טבעת אינפיניטי אלגנטית מזהב צהוב 14 קראט המסמלת אהבה נצחית.',
        price: 1800,
        images: ['https://images.unsplash.com/photo-1627225924765-552d49cf47ad?auto=format&fit=crop&q=80&w=800'],
        category: categories[0]._id,
        countInStock: 10,
        featured: true,
        materials: '14K Yellow Gold',
        materials_he: 'זהב צהוב 14K',
        colors: 'Gold',
        colors_he: 'זהב',
      },
      {
        name: 'Rose Gold Petal Ring',
        name_he: 'טבעת עלה רוז גולד',
        description: 'Delicate rose gold ring with a petal-inspired design.',
        description_he: 'טבעת רוז גולד עדינה בעיצוב בהשראת עלי כותרת.',
        price: 2200,
        images: ['https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&q=80&w=800'],
        category: categories[0]._id,
        countInStock: 7,
        featured: false,
        materials: '14K Rose Gold',
        materials_he: 'רוז גולד 14K',
        colors: 'Rose Gold',
        colors_he: 'רוז גולד',
      },

      // NECKLACES
      {
        name: 'Gold Pearl Necklace',
        name_he: 'שרשרת פניני זהב',
        description: 'Exquisite 14k yellow gold necklace with a south sea pearl.',
        description_he: 'שרשרת זהב צהוב 14 קראט יוקרתית עם פנינת דרום הים.',
        price: 1200,
        images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800'],
        category: categories[1]._id,
        countInStock: 8,
        featured: true,
        materials: '14K Yellow Gold, Pearl',
        materials_he: 'זהב צהוב 14K, פנינה',
        colors: 'Gold',
        colors_he: 'זהב',
      },
      {
        name: 'Emerald Drop Pendant',
        name_he: 'תליון טיפת אזמרגד',
        description: 'Stunning emerald pendant set in 18k yellow gold.',
        description_he: 'תליון אזמרגד מדהים משובץ בזהב צהוב 18 קראט.',
        price: 3500,
        images: ['https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&q=80&w=800'],
        category: categories[1]._id,
        countInStock: 3,
        featured: true,
        materials: '18K Yellow Gold, Emerald',
        materials_he: 'זהב צהוב 18K, אזמרגד',
        colors: 'Gold',
        colors_he: 'זהב',
      },
      {
        name: 'Diamond Cluster Necklace',
        name_he: 'שרשרת מקבץ יהלומים',
        description: 'A cluster of brilliant diamonds on a white gold chain.',
        description_he: 'מקבץ יהלומים מבריקים על שרשרת זהב לבן.',
        price: 5800,
        images: ['https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&q=80&w=800'],
        category: categories[1]._id,
        countInStock: 2,
        featured: false,
        materials: '18K White Gold, Diamond',
        materials_he: 'זהב לבן 18K, יהלום',
        colors: 'Silver',
        colors_he: 'כסף',
      },

      // EARRINGS
      {
        name: 'Sapphire Drop Earrings',
        name_he: 'עגילי טיפת ספיר',
        description: 'Deep blue sapphire earrings surrounded by diamonds.',
        description_he: 'עגילי ספיר כחולים עמוקים מוקפים ביהלומים.',
        price: 2800,
        images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800'],
        category: categories[2]._id,
        countInStock: 3,
        featured: true,
        materials: 'Platinum, Sapphire, Diamond',
        materials_he: 'פלטינה, ספיר, יהלום',
        colors: 'Silver',
        colors_he: 'כסף',
        bodyPart: 'Ear',
        bodyPart_he: 'אוזן',
      },
      {
        name: 'Classic Gold Hoops',
        name_he: 'חישוקי זהב קלאסיים',
        description: 'Essential 14k yellow gold hoop earrings.',
        description_he: 'עגילי חישוק חיוניים מזהב צהוב 14 קראט.',
        price: 650,
        images: ['https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&q=80&w=800'],
        category: categories[2]._id,
        countInStock: 15,
        featured: false,
        materials: '14K Yellow Gold',
        materials_he: 'זהב צהוב 14K',
        colors: 'Gold',
        colors_he: 'זהב',
        bodyPart: 'Ear',
        bodyPart_he: 'אוזן',
      },
      {
        name: 'Diamond Studs',
        name_he: 'עגילי יהלום צמודים',
        description: 'Timeless diamond stud earrings in white gold.',
        description_he: 'עגילי יהלום צמודים נצחיים בזהב לבן.',
        price: 3200,
        images: ['https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&q=80&w=800'],
        category: categories[2]._id,
        countInStock: 5,
        featured: true,
        materials: '18K White Gold, Diamond',
        materials_he: 'זהב לבן 18K, יהלום',
        colors: 'Silver',
        colors_he: 'כסף',
        bodyPart: 'Ear',
        bodyPart_he: 'אוזן',
      },

      // BRACELETS
      {
        name: 'Classic Gold Bracelet',
        name_he: 'צמיד זהב קלאסי',
        description: 'Minimalist 18k yellow gold bracelet for everyday wear.',
        description_he: 'צמיד זהב צהוב 18 קראט מינימליסטי ללבוש יומיומי.',
        price: 950,
        images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800'],
        category: categories[3]._id,
        countInStock: 12,
        featured: true,
        materials: '18K Yellow Gold',
        materials_he: 'זהב צהוב 18K',
        colors: 'Gold',
        colors_he: 'זהב',
      },
      {
        name: 'Platinum Link Bracelet',
        name_he: 'צמיד חוליות פלטינה',
        description: 'Heavy platinum link bracelet with a high-polish finish.',
        description_he: 'צמיד חוליות פלטינה כבד בגימור מלוטש.',
        price: 4200,
        images: ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800'],
        category: categories[3]._id,
        countInStock: 4,
        featured: true,
        materials: 'Platinum',
        materials_he: 'פלטינה',
        colors: 'Silver',
        colors_he: 'כסף',
      },

      // PIERCING
      {
        name: 'Titanium Nose Stud',
        name_he: 'עגיל אף טיטניום',
        description: 'Simple and safe G23 titanium nose stud.',
        description_he: 'עגיל אף מטיטניום G23 פשוט ובטוח.',
        price: 80,
        images: ['https://images.unsplash.com/photo-1516139008210-96e45dccd83b?auto=format&fit=crop&q=80&w=800'],
        category: categories[4]._id,
        countInStock: 50,
        featured: false,
        materials: 'Titanium',
        materials_he: 'טיטניום',
        colors: 'Silver',
        colors_he: 'כסף',
        bodyPart: 'Nose',
        bodyPart_he: 'אף',
      },
      {
        name: 'Rose Gold Helix Hoop',
        name_he: 'חישוק הליקס רוז גולד',
        description: 'Elegant 14k rose gold hoop for helix piercings.',
        description_he: 'חישוק זהב אדום 14 קראט אלגנטי לפירסינג הליקס.',
        price: 250,
        images: ['https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?auto=format&fit=crop&q=80&w=800'],
        category: categories[4]._id,
        countInStock: 20,
        featured: true,
        materials: '14K Rose Gold',
        materials_he: 'רוז גולד 14K',
        colors: 'Rose Gold',
        colors_he: 'רוז גולד',
        bodyPart: 'Ear',
        bodyPart_he: 'אוזן',
      },
      {
        name: 'Diamond Cartilage Stud',
        name_he: 'עגיל סחוס יהלום',
        description: 'Internal threaded 14k white gold stud with a tiny diamond.',
        description_he: 'עגיל צמוד מזהב לבן 14 קראט עם יהלום קטן.',
        price: 450,
        images: ['https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&q=80&w=800'],
        category: categories[4]._id,
        countInStock: 10,
        featured: true,
        materials: '14K White Gold, Diamond',
        materials_he: 'זהב לבן 14K, יהלום',
        colors: 'Silver',
        colors_he: 'כסף',
        bodyPart: 'Ear',
        bodyPart_he: 'אוזן',
      }
    ];

    await Product.insertMany(products);

    console.log('Joya Data Seeded Successfully with Expanded Catalog!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
