const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    name_he,
    description,
    description_he,
    price,
    images,
    category,
    countInStock,
    featured,
    materials,
    materials_he,
    gemstones,
    gemstones_he,
  } = req.body;

  const product = new Product({
    name: name || 'Sample name',
    name_he: name_he || 'שם לדוגמה',
    description: description || 'Sample description',
    description_he: description_he || 'תיאור לדוגמה',
    price: price || 0,
    user: req.user._id,
    images: images || ['/images/sample.jpg'],
    category: category || '60c72b2f9f1b2c001c8e4d2a', // Placeholder category ID
    countInStock: countInStock || 0,
    featured: featured || false,
    materials: materials || 'Sample Materials',
    materials_he: materials_he || 'חומרים לדוגמה',
    gemstones: gemstones || '',
    gemstones_he: gemstones_he || '',
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    name_he,
    description,
    description_he,
    price,
    images,
    category,
    countInStock,
    featured,
    materials,
    materials_he,
    gemstones,
    gemstones_he,
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.name_he = name_he;
    product.description = description;
    product.description_he = description_he;
    product.price = price;
    product.images = images;
    product.category = category;
    product.countInStock = countInStock;
    product.featured = featured;
    product.materials = materials;
    product.materials_he = materials_he;
    product.gemstones = gemstones;
    product.gemstones_he = gemstones_he;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

module.exports = {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
};
