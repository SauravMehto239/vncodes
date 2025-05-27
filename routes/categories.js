const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// Utility to validate category input
const validateCategory = ({ name, description, thumbnail }) => {
  return name && description && thumbnail;
};

// Create a new category
router.post('/', async (req, res) => {
  try {
    const { name, description, thumbnail } = req.body;

    if (!validateCategory(req.body)) {
      return res.status(400).json({ message: 'Name, description, and thumbnail are required' });
    }

    const newCategory = new Category({ name, description, thumbnail });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (err) {
    console.error('Error creating category:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get a category by ID
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (err) {
    console.error('Error fetching category:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update a category
router.put('/:id', async (req, res) => {
  try {
    const { name, description, thumbnail } = req.body;

    if (!validateCategory(req.body)) {
      return res.status(400).json({ message: 'Name, description, and thumbnail are required' });
    }

    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description, thumbnail },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Category not found' });
    res.json(updated);
  } catch (err) {
    console.error('Error updating category:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a category
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    console.error('Error deleting category:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
