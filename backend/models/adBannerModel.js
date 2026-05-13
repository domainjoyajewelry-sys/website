const mongoose = require('mongoose');

const adBannerSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    title_he: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
    },
    subtitle_he: {
      type: String,
    },
    image: {
      type: String,
      required: true,
    },
    link: {
      type: String,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const AdBanner = mongoose.model('AdBanner', adBannerSchema);

module.exports = AdBanner;
