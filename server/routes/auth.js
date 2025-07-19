const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const transporter = require("../utils/sendEmail");

// Register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const newUser = new User({ name, email, password: hashed });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /forgot-password
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });

    // ✅ Save token and expiration to user document
    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    const resetLink = `${process.env.FRONTEND_URI}/reset-password/${token}`;

    await transporter.sendMail({
      from: `"Quiz App" <balvaraza2@gmail.com>`,
      to: email,
      subject: "Reset your password",
      html: `<p>Click the link to reset your password:</p><a href="${resetLink}">${resetLink}</a>`,
    });

    res.json({ message: "Reset link sent to your email." });
  } catch (error) {
    console.error("Nodemailer Error:", error);
    res.status(500).json({ message: "Failed to send reset link" });
  }
});



// POST /reset-password/:token
router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(400).json({ message: "Token expired" });
  }

  const user = await User.findOne({
    _id: payload.id,
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  });

  if (!user) return res.status(400).json({ message: "Invalid or expired token" });

  user.password = await bcrypt.hash(password, 10);
  user.resetToken = null;
  user.resetTokenExpiration = null;
  await user.save();

  res.json({ message: "Password reset successful" });
});

module.exports = router;
