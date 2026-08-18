const Settings = require('../models/settingsModel');

// @desc    Get site settings
// @route   GET /api/settings
// @access  Public
exports.getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({
        shippingType: 'free',
        shippingFee: 0,
        freeShippingThreshold: 500,
        shippingNotice_he: 'משלוח מהיר חינם על כל ההזמנות',
        shippingNotice_en: 'Complimentary Express Shipping on All Orders',
      });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error fetching settings' });
  }
};

// @desc    Update site settings
// @route   PUT /api/settings
// @access  Private/Admin
exports.updateSettings = async (req, res) => {
  try {
    const {
      shippingType,
      shippingFee,
      freeShippingThreshold,
      shippingNotice_he,
      shippingNotice_en,
    } = req.body;

    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({});
    }

    if (shippingType !== undefined) settings.shippingType = shippingType;
    if (shippingFee !== undefined) settings.shippingFee = Number(shippingFee);
    if (freeShippingThreshold !== undefined) settings.freeShippingThreshold = Number(freeShippingThreshold);
    if (shippingNotice_he !== undefined) settings.shippingNotice_he = shippingNotice_he;
    if (shippingNotice_en !== undefined) settings.shippingNotice_en = shippingNotice_en;

    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error updating settings' });
  }
};
