const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).populate('category').populate('subCategory');
  res.json(products);
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category').populate('subCategory');

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
    subcategory,
    subcategory_he,
    subCategory,
    countInStock,
    featured,
    isNewArrival,
    materials,
    materials_he,
    gemstones,
    gemstones_he,
    colors,
    colors_he,
    bodyPart,
    bodyPart_he,
    variants,
    piercingSide,
    unitType,
    pipeLength,
  } = req.body;

  const product = new Product({
    name: name || 'Sample name',
    name_he: name_he || 'שם לדוגמה',
    description: description || 'Sample description',
    description_he: description_he || 'תיאור לדוגמה',
    price: price || 0,
    images: images || ['/images/sample.jpg'],
    category,
    subcategory: subcategory || '',
    subcategory_he: subcategory_he || '',
    subCategory: subCategory || null,
    countInStock: countInStock || 0,
    featured: featured || false,
    isNewArrival: isNewArrival || false,
    materials: materials || 'Sample Materials',
    materials_he: materials_he || 'חומרים לדוגמה',
    gemstones: gemstones || '',
    gemstones_he: gemstones_he || '',
    colors: colors || '',
    colors_he: colors_he || '',
    bodyPart: bodyPart || '',
    bodyPart_he: bodyPart_he || '',
    variants: variants || [],
    piercingSide: piercingSide || 'none',
    unitType: unitType || 'none',
    pipeLength: pipeLength || '',
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
    subcategory,
    subcategory_he,
    subCategory,
    countInStock,
    featured,
    isNewArrival,
    materials,
    materials_he,
    gemstones,
    gemstones_he,
    colors,
    colors_he,
    bodyPart,
    bodyPart_he,
    variants,
    piercingSide,
    unitType,
    pipeLength,
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
    product.subcategory = subcategory || '';
    product.subcategory_he = subcategory_he || '';
    product.subCategory = subCategory || null;
    product.countInStock = countInStock;
    product.featured = featured !== undefined ? featured : product.featured;
    product.isNewArrival = isNewArrival !== undefined ? isNewArrival : product.isNewArrival;
    product.materials = materials;
    product.materials_he = materials_he;
    product.gemstones = gemstones;
    product.gemstones_he = gemstones_he;
    product.colors = colors;
    product.colors_he = colors_he;
    product.bodyPart = bodyPart;
    product.bodyPart_he = bodyPart_he;
    product.variants = variants || product.variants;
    product.piercingSide = piercingSide || product.piercingSide;
    product.unitType = unitType || product.unitType;
    product.pipeLength = pipeLength || product.pipeLength;

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
