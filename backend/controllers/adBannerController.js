const asyncHandler = require('express-async-handler');
const AdBanner = require('../models/adBannerModel');

// @desc    Fetch all ad banners
// @route   GET /api/adbanners
// @access  Public
const getAdBanners = asyncHandler(async (req, res) => {
  const adBanners = await AdBanner.find({});
  res.json(adBanners);
});

// @desc    Fetch single ad banner
// @route   GET /api/adbanners/:id
// @access  Public
const getAdBannerById = asyncHandler(async (req, res) => {
  const adBanner = await AdBanner.findById(req.params.id);

  if (adBanner) {
    res.json(adBanner);
  } else {
    res.status(404);
    throw new Error('Ad Banner not found');
  }
});

// @desc    Create an ad banner
// @route   POST /api/adbanners
// @access  Private/Admin
const createAdBanner = asyncHandler(async (req, res) => {
  const { title, title_he, subtitle, subtitle_he, image, link, isActive, order } = req.body;

  const adBanner = new AdBanner({
    title,
    title_he,
    subtitle,
    subtitle_he,
    image,
    link,
    isActive,
    order,
  });

  const createdAdBanner = await adBanner.save();
  res.status(201).json(createdAdBanner);
});

// @desc    Update an ad banner
// @route   PUT /api/adbanners/:id
// @access  Private/Admin
const updateAdBanner = asyncHandler(async (req, res) => {
  const { title, title_he, subtitle, subtitle_he, image, link, isActive, order } = req.body;

  const adBanner = await AdBanner.findById(req.params.id);

  if (adBanner) {
    adBanner.title = title;
    adBanner.title_he = title_he;
    adBanner.subtitle = subtitle;
    adBanner.subtitle_he = subtitle_he;
    adBanner.image = image;
    adBanner.link = link;
    adBanner.isActive = isActive;
    adBanner.order = order;

    const updatedAdBanner = await adBanner.save();
    res.json(updatedAdBanner);
  } else {
    res.status(404);
    throw new Error('Ad Banner not found');
  }
});

// @desc    Delete an ad banner
// @route   DELETE /api/adbanners/:id
// @access  Private/Admin
const deleteAdBanner = asyncHandler(async (req, res) => {
  const adBanner = await AdBanner.findById(req.params.id);

  if (adBanner) {
    await adBanner.deleteOne();
    res.json({ message: 'Ad Banner removed' });
  } else {
    res.status(404);
    throw new Error('Ad Banner not found');
  }
});

module.exports = {
  getAdBanners,
  getAdBannerById,
  createAdBanner,
  updateAdBanner,
  deleteAdBanner,
};
