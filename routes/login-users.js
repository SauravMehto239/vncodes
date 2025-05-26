const express = require("express");
const router = express.Router();
const User = require("../models/User");
router.get('/login-users', async (req, res) => {
  try {
    // Extract userIds from activeTokens by verifying tokens
    const users = [];

    for (const token of activeTokens) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId, '-password');
        if (user) {
          users.push(user);
        }
      } catch (err) {
        // Token expired or invalid, remove from activeTokens
        activeTokens.delete(token);
      }
    }

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching logged-in users' });
  }
});
