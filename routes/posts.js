const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const upload = require('../middleware/upload');
const fs = require('fs');
const path = require('path');

// Create a new post
router.post('/', upload.single('image_file'), async (req, res) => {
  try {
    const { title, category, description, type, amount, image_link } = req.body;

    // Validate required fields
    if (!title || !category || !description || !type) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Validate amount for paid posts
    let postAmount = 0;
    if (type === 'paid') {
      if (!amount) {
        return res.status(400).json({ message: 'Amount is required for paid posts' });
      }
      postAmount = amount;
    }

    // Prepare media fields
    let mediaUrl = '';
    let externalMediaLink = '';

    if (req.file) {
      mediaUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    } else if (image_link) {
      externalMediaLink = image_link;
    }

    const newPost = new Post({
      title,
      category,
      description,
      type,
      amount: postAmount,
      image_url: mediaUrl,       // stored locally
      image_link: externalMediaLink  // external media
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('category');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific post by ID
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('category');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a post
router.put('/:id', upload.single('image_file'), async (req, res) => {
  try {
    const { title, category, description, type, amount, image_link } = req.body;

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Update fields if provided
    if (title) post.title = title;
    if (category) post.category = category;
    if (description) post.description = description;
    if (type) post.type = type;

    if (type === 'paid') {
      if (!amount) {
        return res.status(400).json({ message: 'Amount is required for paid posts' });
      }
      post.amount = amount;
    } else {
      post.amount = 0;
    }

    // Update media
    if (req.file) {
      // Delete old media file if stored locally
      if (post.image_url && post.image_url.startsWith(`${req.protocol}://${req.get('host')}/uploads/`)) {
        const oldPath = path.join(__dirname, '..', 'uploads', path.basename(post.image_url));
        fs.unlink(oldPath, (err) => {
          if (err) console.error('Error deleting old file:', err);
        });
      }
      post.image_url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
      post.image_link = ''; // Clear external link if uploading new file
    } else if (image_link) {
      // If external link is provided, clear local image_url
      if (post.image_url && post.image_url.startsWith(`${req.protocol}://${req.get('host')}/uploads/`)) {
        const oldPath = path.join(__dirname, '..', 'uploads', path.basename(post.image_url));
        fs.unlink(oldPath, (err) => {
          if (err) console.error('Error deleting old file:', err);
        });
      }
      post.image_link = image_link;
      post.image_url = '';
    }

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a post
router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Delete media file if stored locally
    if (post.image_url && post.image_url.startsWith(`${req.protocol}://${req.get('host')}/uploads/`)) {
      const mediaPath = path.join(__dirname, '..', 'uploads', path.basename(post.image_url));
      fs.unlink(mediaPath, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }

    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
