//app/routes/profile.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const requireLogin = require('../middleware/requireLogin');

//1.4 User Profile Management, two routes to get and update user profile from the database backend(PostgreSQL)
// GET /api/profile — fetch current user's profile
router.get('/profile', requireLogin, async (req, res) => {
  try {
    const user = await User.findProfile(req.session.username);
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch profile' });
  }
});

// POST /api/profile — update current user's profile
router.post('/profile', requireLogin, async (req, res) => {
  const { firstName, middleName, lastName, address, email } = req.body;

  try {
    await User.updateProfile(req.session.username, { firstName, middleName, lastName, address, email });

    req.session.firstName = firstName;

    res.json({ success: true, message: 'Profile updated successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
});

module.exports = router;