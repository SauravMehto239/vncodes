const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get('/login-users', async (req, res) => {
  try {
    // Get all users (excluding password) sorted by last login time
    const users = await User.find({}, '-password').sort({ lastLogin: -1 });
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

module.exports = router;
