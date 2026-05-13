const express = require('express');
const router = express.Router();
const {
  getAdBanners,
  getAdBannerById,
  createAdBanner,
  updateAdBanner,
  deleteAdBanner,
} = require('../controllers/adBannerController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getAdBanners).post(protect, admin, createAdBanner);
router
  .route('/:id')
  .get(getAdBannerById)
  .put(protect, admin, updateAdBanner)
  .delete(protect, admin, deleteAdBanner);

module.exports = router;
