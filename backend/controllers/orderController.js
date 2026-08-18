const asyncHandler = require('express-async-handler');
const Order = require('../models/orderModel');
const { sendOrderConfirmationEmail } = require('../services/emailService');

// @desc    Create new order
// @route   POST /api/orders
// @access  Public / Optional Auth
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    const order = new Order({
      orderItems: orderItems.map((x) => ({
        name: x.name || x.name_he || 'Jewelry Item',
        qty: x.qty || x.quantity || 1,
        image: x.image || (x.images && x.images[0]) || '/logo.png',
        price: x.price || 0,
        product: (x.productId && x.productId.length === 24) ? x.productId : ((x._id && x._id.length === 24) ? x._id : undefined),
      })),
      user: req.user ? req.user._id : undefined,
      shippingAddress: {
        fullName: shippingAddress?.fullName || 'Customer',
        address: shippingAddress?.address || 'N/A',
        city: shippingAddress?.city || 'Israel',
        postalCode: shippingAddress?.postalCode || '',
        country: shippingAddress?.country || 'Israel',
        phone: shippingAddress?.phone || 'N/A',
      },
      paymentMethod: paymentMethod || 'Cardcom',
      itemsPrice: itemsPrice || totalPrice || 0,
      shippingPrice: shippingPrice || 0,
      taxPrice: taxPrice || 0,
      totalPrice: totalPrice || 0,
      isPaid: true,
      paidAt: Date.now(),
    });

    const createdOrder = await order.save();

    // Trigger email sending
    const targetEmail = shippingAddress?.email || (req.user && req.user.email);
    sendOrderConfirmationEmail(createdOrder, targetEmail).catch(err => {
      console.error('Email error:', err);
    });

    res.status(201).json(createdOrder);
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'full_name email'
  );

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address,
    };

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id full_name');
  res.json(orders);
});

module.exports = {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
};
