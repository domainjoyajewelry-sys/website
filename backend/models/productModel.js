const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    name_he: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    description_he: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    images: {
      type: [String], // Array of image URLs
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
    featured: {
      type: Boolean,
      required: true,
      default: false,
    },
    isNewArrival: {
      type: Boolean,
      required: true,
      default: false,
    },
    materials: {
      type: String,
      required: true,
    },
    materials_he: {
      type: String,
      required: true,
    },
    gemstones: {
      type: String,
    },
    gemstones_he: {
      type: String,
    },
    colors: {
      type: String,
    },
    colors_he: {
      type: String,
    },
    bodyPart: {
      type: String,
    },
    bodyPart_he: {
      type: String,
    },
    variants: [
      {
        color: { type: String, required: true },
        color_he: { type: String, required: true },
        image: { type: String, required: true },
        hex: { type: String }, // Hex code for UI circles
      }
    ],
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
