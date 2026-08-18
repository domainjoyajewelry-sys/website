const asyncHandler = require('express-async-handler');
const Prize = require('../models/prizeModel');
const User = require('../models/userModel');

// @desc    Fetch all active prizes
// @route   GET /api/prizes
// @access  Public
const getPrizes = asyncHandler(async (req, res) => {
  const prizes = await Prize.find({ isActive: true });
  res.json(prizes);
});

// @desc    Admin: Fetch all prizes
// @route   GET /api/prizes/admin
// @access  Private/Admin
const getAdminPrizes = asyncHandler(async (req, res) => {
  const prizes = await Prize.find({});
  res.json(prizes);
});

// @desc    Create a prize
// @route   POST /api/prizes
// @access  Private/Admin
const createPrize = asyncHandler(async (req, res) => {
  const { label, label_he, value, chance, isActive } = req.body;
  const prize = new Prize({ label, label_he, value, chance, isActive });
  const createdPrize = await prize.save();
  res.status(201).json(createdPrize);
});

// @desc    Update a prize
// @route   PUT /api/prizes/:id
// @access  Private/Admin
const updatePrize = asyncHandler(async (req, res) => {
  const { label, label_he, value, chance, isActive } = req.body;
  const prize = await Prize.findById(req.params.id);

  if (prize) {
    prize.label = label || prize.label;
    prize.label_he = label_he || prize.label_he;
    prize.value = value || prize.value;
    prize.chance = chance !== undefined ? chance : prize.chance;
    prize.isActive = isActive !== undefined ? isActive : prize.isActive;

    const updatedPrize = await prize.save();
    res.json(updatedPrize);
  } else {
    res.status(404);
    throw new Error('Prize not found');
  }
});

// @desc    Record a spin and award a prize (Supports Guests & Registered Users)
// @route   POST /api/prizes/spin
// @access  Public / Optional Auth
const recordSpin = asyncHandler(async (req, res) => {
  const { prizeId, email, name } = req.body;
  const prize = await Prize.findById(prizeId);

  if (!prize) {
    res.status(404);
    throw new Error('Prize not found');
  }

  let recipientEmail = email;

  if (req.user) {
    const user = await User.findById(req.user._id);
    if (user) {
      if (user.hasSpunWheel) {
        res.status(400);
        throw new Error('You have already used your spin');
      }
      user.hasSpunWheel = true;
      user.wonPrize = prize.label;
      await user.save();
      recipientEmail = user.email;
    }
  }

  // Generate unique prize coupon code
  const cleanLabel = (prize.value || prize.label || 'GIFT').toString().toUpperCase().replace(/[^A-Z0-9]/g, '');
  const couponCode = `JOYA-${cleanLabel}-${Math.floor(1000 + Math.random() * 9000)}`;

  console.log(`[WHEEL PRIZE AWARDED] Recipient: ${recipientEmail || 'Guest'}, Code: ${couponCode}, Prize: ${prize.label}`);

  res.json({
    success: true,
    message: 'Prize recorded successfully',
    prize: prize.label,
    prize_he: prize.label_he,
    couponCode: couponCode,
    email: recipientEmail
  });
});

// @desc    Delete a prize
// @route   DELETE /api/prizes/:id
// @access  Private/Admin
const deletePrize = asyncHandler(async (req, res) => {
  const prize = await Prize.findById(req.params.id);
  if (prize) {
    await prize.deleteOne();
    res.json({ message: 'Prize removed' });
  } else {
    res.status(404);
    throw new Error('Prize not found');
  }
});

module.exports = {
  getPrizes,
  getAdminPrizes,
  createPrize,
  updatePrize,
  recordSpin,
  deletePrize
};
