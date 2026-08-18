const express = require('express');
const router = express.Router();
const {
  getLookbook,
  getAdminLookbooks,
  saveLookbook,
  deleteLookbook
} = require('../controllers/lookbookController');
const { optionalAuth } = require('../middleware/authMiddleware');

router.route('/').get(getLookbook).post(optionalAuth, saveLookbook);
router.route('/admin').get(optionalAuth, getAdminLookbooks);
router.route('/:id').delete(optionalAuth, deleteLookbook);

module.exports = router;
