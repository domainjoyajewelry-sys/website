const mongoose = require('mongoose');

const giftCardSchema = mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    isUsed: {
      type: Boolean,
      required: true,
      default: false,
    },
    purchasedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    recipientEmail: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const GiftCard = mongoose.model('GiftCard', giftCardSchema);

module.exports = GiftCard;
