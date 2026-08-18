const mongoose = require('mongoose');

const settingsSchema = mongoose.Schema(
  {
    shippingType: {
      type: String,
      enum: ['free', 'flat', 'threshold'],
      default: 'free',
    },
    shippingFee: {
      type: Number,
      default: 0,
    },
    freeShippingThreshold: {
      type: Number,
      default: 500,
    },
    shippingNotice_he: {
      type: String,
      default: 'משלוח מהיר חינם על כל ההזמנות',
    },
    shippingNotice_en: {
      type: String,
      default: 'Complimentary Express Shipping on All Orders',
    },
  },
  {
    timestamps: true,
  }
);

const Settings = mongoose.model('Settings', settingsSchema);

module.exports = Settings;
