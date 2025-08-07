const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const upload = require('../middleware/upload');
const path = require('path');
const fs = require('fs');

// Create a new product
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, description, price } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    if (!title || !description || !price || !image) {
      return res.status(400).json({ message: 'Title, description, price, and image are required' });
    }
    const newProduct = new Product({ title, description, price, image });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a product
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { title, description, price } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (title) product.title = title;
    if (description) product.description = description;
    if (price) product.price = price;
    if (req.file) {
      // Delete old image
      if (product.image && product.image.startsWith('/uploads/')) {
        const oldPath = path.join(__dirname, '..', product.image);
        fs.unlink(oldPath, (err) => { if (err) console.error('Error deleting old image:', err); });
      }
      product.image = `/uploads/${req.file.filename}`;
    }
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    // Delete image file
    if (product.image && product.image.startsWith('/uploads/')) {
      const imgPath = path.join(__dirname, '..', product.image);
      fs.unlink(imgPath, (err) => { if (err) console.error('Error deleting image:', err); });
    }
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 
