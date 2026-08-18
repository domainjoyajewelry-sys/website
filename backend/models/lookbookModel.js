const mongoose = require('mongoose');

const hotspotSchema = mongoose.Schema({
  x: { type: Number, required: true }, // Percentage 0 - 100
  y: { type: Number, required: true }, // Percentage 0 - 100
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: false
  },
  label: { type: String, required: false },
  label_he: { type: String, required: false },
  price: { type: Number, required: false },
  image: { type: String, required: false }
});

const lookbookSchema = mongoose.Schema(
  {
    title: { type: String, required: true, default: 'Earring & Ear Piercing Style Guide' },
    title_he: { type: String, required: true, default: 'מדריך סטיילינג עגילים ופירסינג' },
    subtitle: { type: String, default: 'Click on the hot spots to shop the curated ear curation look' },
    subtitle_he: { type: String, default: 'לחצו על נקודות החמות למעבר ישיר לעגיל שאהבתם' },
    image: { type: String, required: true, default: '/images/lookbook_model.jpg' },
    hotspots: [hotspotSchema],
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const Lookbook = mongoose.model('Lookbook', lookbookSchema);
module.exports = Lookbook;
