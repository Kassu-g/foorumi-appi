const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
router.post('/register', async (req, res) => {
  const { email, password, username, isAdmin } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(403).json({ message: 'Email already in use' });

  try {
    const newUser = new User({ email, password, username, isAdmin });
    await newUser.save();
    res.json(newUser);
  } catch (err) {
    res.status(500).json({ error: 'Failed to register user' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { _id: user._id, username: user.username, isAdmin: user.isAdmin },
      process.env.SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;
