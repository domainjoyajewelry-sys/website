const express = require('express');
const router = express.Router();
const {
  createGiftCard,
  getGiftCardByCode,
} = require('../controllers/giftCardController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(createGiftCard);
router.route('/:code').get(getGiftCardByCode);

module.exports = router;
