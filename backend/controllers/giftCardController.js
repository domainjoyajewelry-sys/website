const asyncHandler = require('express-async-handler');
const GiftCard = require('../models/giftCardModel');

// @desc    Create a new gift card
// @route   POST /api/giftcards
// @access  Public (usually after payment)
const createGiftCard = asyncHandler(async (req, res) => {
  const { amount, recipientEmail } = req.body;

  // Generate a random 12-character uppercase code
  const code = Math.random().toString(36).substring(2, 14).toUpperCase();

  const giftCard = await GiftCard.create({
    code,
    amount,
    recipientEmail,
    purchasedBy: req.user ? req.user._id : null,
  });

  if (giftCard) {
    res.status(201).json(giftCard);
  } else {
    res.status(400);
    throw new Error('Invalid gift card data');
  }
});

// @desc    Get gift card by code
// @route   GET /api/giftcards/:code
// @access  Public
const getGiftCardByCode = asyncHandler(async (req, res) => {
  const giftCard = await GiftCard.findOne({ code: req.params.code });

  if (giftCard) {
    res.json(giftCard);
  } else {
    res.status(404);
    throw new Error('Gift card not found');
  }
});

module.exports = {
  createGiftCard,
  getGiftCardByCode,
};
