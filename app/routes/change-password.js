//app/routes/change-password.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const requireLogin = require('../middleware/requireLogin');

// protected route to change password, requires user to be logged in (checks session)
router.post('/change-password', requireLogin, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const username = req.session.username;

  try {
    const user = await User.findByUsername(username);

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.password !== oldPassword) return res.status(401).json({ success: false, message: 'Old password is incorrect' });

    await User.updatePassword(username, newPassword);

    console.log(`Password updated for user: ${username}`);
    res.json({ success: true, message: 'Password changed successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update password' });
  }
});

module.exports = router;