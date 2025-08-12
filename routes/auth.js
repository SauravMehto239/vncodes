const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// @route   POST /api/auth/signup
// @desc    Register new user
router.post('/signup', async (req, res) => {
  const { name, email, password, mobileNumber, country, state, city, zipCode } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({ 
      name,
      email, 
      password: hashedPassword,
      mobileNumber,
      country,
      state,
      city,
      zipCode,
      createdAt: new Date()
    });
    await user.save();

    return res.status(201).json({ 
      message: 'User registered successfully', 
      user: { 
        id: user._id,
        name: user.name,
        email: user.email,
        mobileNumber: user.mobileNumber,
        country: user.country,
        state: user.state,
        city: user.city,
        zipCode: user.zipCode,
        createdAt: user.createdAt
      } 
    });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// @route   GET /api/auth/signup-data
// @desc    Get all signup data for admin dashboard
router.get('/signup-data', async (req, res) => {
  try {
    // Get all users with signup data (excluding password)
    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    
    // Transform data to match signup response format
    const signupData = users.map(user => ({
      id: user._id,
      name: user.name,
      email: user.email,
      mobileNumber: user.mobileNumber,
      country: user.country,
      state: user.state,
      city: user.city,
      zipCode: user.zipCode,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin
    }));

    res.json(signupData);
  } catch (err) {
    console.error('Error fetching signup data:', err);
    res.status(500).json({ message: 'Error fetching signup data' });
  }
});

// @route   GET /api/auth/getsignup-data
// @desc    Get all signup data for admin dashboard (new endpoint)
router.get('/getsignup-data', async (req, res) => {
  try {
    // Get all users with signup data (excluding password)
    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    
    // Transform data to match signup response format
    const signupData = users.map(user => ({
      id: user._id,
      name: user.name,
      email: user.email,
      mobileNumber: user.mobileNumber,
      country: user.country,
      state: user.state,
      city: user.city,
      zipCode: user.zipCode,
      createdAt: user.createdAt
    }));

    res.json(signupData);
  } catch (err) {
    console.error('Error fetching signup data:', err);
    res.status(500).json({ message: 'Error fetching signup data' });
  }
});

// @route   DELETE /api/auth/signup-data/:id
// @desc    Delete user by ID
router.delete('/signup-data/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ message: 'Error deleting user' });
  }
});

// @route   DELETE /api/auth/getsignup-data/:id
// @desc    Delete user by ID (new endpoint)
router.delete('/getsignup-data/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ message: 'Error deleting user' });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Update last login time
    user.lastLogin = new Date();
    await user.save();

    return res.status(200).json({ 
      message: 'Login successful', 
      user: { 
        id: user._id,
        email: user.email 
      },
      token: token
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// @route   GET /api/auth/login-users
// @desc    Get all logged in users (for admin dashboard)
router.get('/login-users', async (req, res) => {
  try {
    const users = await User.find({}, '-password').sort({ lastLogin: -1 });
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

module.exports = router;
