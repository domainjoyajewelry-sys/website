const mongoose = require('mongoose');

const prizeSchema = mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
    },
    label_he: {
      type: String,
      required: true,
    },
    value: {
      type: String, // e.g., '10% OFF', 'FREE_SHIPPING', 'GIFT_CARD_50'
      required: true,
    },
    chance: {
      type: Number, // Percentage or weight
      default: 1,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Prize = mongoose.model('Prize', prizeSchema);

module.exports = Prize;
