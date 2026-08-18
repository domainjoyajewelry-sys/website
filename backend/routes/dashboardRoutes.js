const express = require('express');
const router = express.Router();
const { getDashboardStats, getSalesData } = require('../controllers/dashboardController');
const { protect, admin, optionalAuth } = require('../middleware/authMiddleware');

router.get('/stats', optionalAuth, getDashboardStats);
router.get('/sales', optionalAuth, getSalesData);

module.exports = router;
