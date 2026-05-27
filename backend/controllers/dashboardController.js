const asyncHandler = require('express-async-handler');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const User = require('../models/userModel');

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
  const totalRevenue = await Order.aggregate([
    { $match: { isPaid: true } },
    { $group: { _id: null, total: { $sum: '$totalPrice' } } },
  ]);

  const ordersCount = await Order.countDocuments();
  const productsCount = await Product.countDocuments();
  const usersCount = await User.countDocuments();

  // For real-time visitors, we'll simulate a number for now
  // In a real app, this could come from a session store or redis
  const onlineVisitors = Math.floor(Math.random() * 50) + 10;

  res.json({
    revenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
    orders: ordersCount,
    products: productsCount,
    users: usersCount,
    onlineVisitors,
  });
});

// @desc    Get sales data for charts
// @route   GET /api/dashboard/sales
// @access  Private/Admin
const getSalesData = asyncHandler(async (req, res) => {
  const sales = await Order.aggregate([
    { $match: { isPaid: true } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        total: { $sum: '$totalPrice' },
      },
    },
    { $sort: { _id: 1 } },
    { $limit: 30 },
  ]);

  res.json(sales.map((s) => ({ date: s._id, total: s.total })));
});

module.exports = {
  getDashboardStats,
  getSalesData,
};
