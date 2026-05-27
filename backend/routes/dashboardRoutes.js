const express = require('express');
const router = express.Router();
const { getDashboardStats, getSalesData } = require('../controllers/dashboardController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/stats', protect, admin, getDashboardStats);
router.get('/sales', protect, admin, getSalesData);

module.exports = router;
