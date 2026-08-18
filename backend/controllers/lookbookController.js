const asyncHandler = require('express-async-handler');
const Lookbook = require('../models/lookbookModel');
const Product = require('../models/productModel');

// Default Seed Data if no lookbooks exist in DB yet
const DEFAULT_LOOKBOOK = {
  title: 'Earring & Ear Piercing Style Guide',
  title_he: 'מדריך סטיילינג עגילים ופירסינג',
  subtitle: 'Click on any marker to explore and shop the look',
  subtitle_he: 'לחצו על הנקודות המנצנצות לצפייה ורכישת התכשיט',
  image: '/images/lookbook_model.jpg',
  isActive: true,
  hotspots: [
    {
      x: 63,
      y: 50,
      label: 'Diamond Drop Chandelier Earring',
      label_he: 'עגיל ענתיק נתלה שנדליר יהלומים',
      price: 3450,
      image: '/images/new/p1.jpeg'
    },
    {
      x: 66,
      y: 43,
      label: 'Gold Huggie Lobe Hoop',
      label_he: 'עגיל חישוק קלאסי תנוך זהב',
      price: 890,
      image: '/images/new/p2.jpeg'
    },
    {
      x: 62,
      y: 38,
      label: 'Tragus Diamond Hoop',
      label_he: 'עגיל טרגוס יהלום משובץ',
      price: 650,
      image: '/images/new/p3.jpeg'
    },
    {
      x: 73,
      y: 33,
      label: 'Helix Triple Diamond Stud',
      label_he: 'עגיל הליקס שלישיית יהלומים',
      price: 1200,
      image: '/images/new/p1.jpeg'
    }
  ]
};

// @desc    Get active lookbook with hotspots
// @route   GET /api/lookbook
// @access  Public
const getLookbook = asyncHandler(async (req, res) => {
  let lookbooks = await Lookbook.find({ isActive: true }).populate('hotspots.product');

  if (!lookbooks || lookbooks.length === 0) {
    // Return default seed lookbook
    return res.json([DEFAULT_LOOKBOOK]);
  }

  res.json(lookbooks);
});

// @desc    Admin: Get all lookbooks
// @route   GET /api/lookbook/admin
// @access  Public / Admin
const getAdminLookbooks = asyncHandler(async (req, res) => {
  let lookbooks = await Lookbook.find({}).populate('hotspots.product');
  if (!lookbooks || lookbooks.length === 0) {
    const created = await Lookbook.create(DEFAULT_LOOKBOOK);
    return res.json([created]);
  }
  res.json(lookbooks);
});

// @desc    Admin: Create or update lookbook
// @route   POST /api/lookbook
// @access  Public / Admin
const saveLookbook = asyncHandler(async (req, res) => {
  const { _id, title, title_he, subtitle, subtitle_he, image, hotspots, isActive } = req.body;

  if (_id) {
    const existing = await Lookbook.findById(_id);
    if (existing) {
      existing.title = title || existing.title;
      existing.title_he = title_he || existing.title_he;
      existing.subtitle = subtitle || existing.subtitle;
      existing.subtitle_he = subtitle_he || existing.subtitle_he;
      existing.image = image || existing.image;
      existing.hotspots = hotspots || existing.hotspots;
      existing.isActive = isActive !== undefined ? isActive : existing.isActive;

      const updated = await existing.save();
      return res.json(updated);
    }
  }

  const created = await Lookbook.create({
    title,
    title_he,
    subtitle,
    subtitle_he,
    image,
    hotspots,
    isActive
  });

  res.status(201).json(created);
});

// @desc    Admin: Delete lookbook
// @route   DELETE /api/lookbook/:id
// @access  Public / Admin
const deleteLookbook = asyncHandler(async (req, res) => {
  const lookbook = await Lookbook.findById(req.params.id);
  if (lookbook) {
    await lookbook.deleteOne();
    res.json({ message: 'Lookbook removed' });
  } else {
    res.status(404);
    throw new Error('Lookbook not found');
  }
});

module.exports = {
  getLookbook,
  getAdminLookbooks,
  saveLookbook,
  deleteLookbook
};
