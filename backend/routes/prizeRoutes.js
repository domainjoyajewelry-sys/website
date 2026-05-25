const express = require('express');
const router = express.Router();
const {
  getPrizes,
  getAdminPrizes,
  createPrize,
  updatePrize,
  recordSpin,
  deletePrize
} = require('../controllers/prizeController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getPrizes)
  .post(protect, admin, createPrize);

router.route('/admin')
  .get(protect, admin, getAdminPrizes);

router.route('/spin')
  .post(protect, recordSpin);

router.route('/:id')
  .put(protect, admin, updatePrize)
  .delete(protect, admin, deletePrize);

module.exports = router;
