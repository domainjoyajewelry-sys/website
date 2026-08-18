const express = require('express');
const router = express.Router();
const {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
} = require('../controllers/orderController');
const { protect, admin, optionalAuth } = require('../middleware/authMiddleware');

router.route('/').post(optionalAuth, addOrderItems).get(optionalAuth, getOrders);
router.route('/myorders').get(optionalAuth, getMyOrders);
router.route('/:id').get(optionalAuth, getOrderById);
router.route('/:id/pay').put(optionalAuth, updateOrderToPaid);
router.route('/:id/deliver').put(optionalAuth, updateOrderToDelivered);

module.exports = router;
