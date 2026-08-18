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
    video: {
      type: String, // Optional URL for background video
    },
    videoActive: {
      type: Boolean,
      default: true,
    },
    backgroundType: {
      type: String,
      enum: ['image', 'video', 'solid', 'gradient'],
      default: 'image',
    },
    bgColor: {
      type: String,
      default: '#000000',
    },
    bgGradient: {
      type: String,
      default: '#18181b',
    },
    overlayOpacity: {
      type: Number,
      default: 40,
    },
    textColor: {
      type: String,
      default: '#ffffff',
    },
    navTheme: {
      type: String,
      enum: ['dark', 'light'],
      default: 'dark',
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
