const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const sendEmail = require('../utilities/sendEmail');
const users = require('../models/users'); 

router.post('/signup', async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;
    console.log("Incoming Signup Request:", email); 

    let user = await users.findOne({ email });
    if (user) return res.status(400).json({ message: "ENTITY ALREADY REGISTERED" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new users({ firstName, lastName, email, password: hashedPassword, role });
    await user.save();
    console.log("User saved to MongoDB"); 

    try {
      await sendEmail({
        email: email,
        subject: 'CogOps // IDENTITY ESTABLISHED',
        html: `<h1>Welcome to CogOps</h1><p>Identity confirmed for ${firstName}.</p>`
      });
    } catch (mailErr) {
      console.error("MAIL ERROR (Bypassed for demo):", mailErr.message); 
    }

    res.status(201).json({ message: "IDENTITY ESTABLISHED" });

  } catch (err) {
    console.error("FULL SYSTEM ERROR:", err); 
    res.status(500).json({ message: "AUTH ERROR", error: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await users.findOne({ email }); 
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);

    res.status(200).json({
      token,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role 
      }
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get('/me', async (req, res) => {
  try {
    res.status(200).json({ 
      success: true, 
      message: "Sync Established",
      system: "CogOps Core v1.0.4" 
    });
  } catch (err) {
    res.status(500).json({ message: "Sync Protocol Failed" });
  }
});

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await users.findOne({ email }); 

    if (!user) {
      return res.status(200).json({ message: "If this email is registered, a reset link has been sent." });
    }

    await sendEmail({
      email: email,
      subject: 'CogOps // ACCESS KEY RECOVERY',
      html: `<p>Identity verification initiated. Use the following protocol to reset your key: http://localhost:3000/reset-password?id=${user._id}</p>`
    });

    res.status(200).json({ message: "Recovery protocol transmitted." });
  } catch (err) {
    console.error("FORGOT PW ERROR:", err);
    res.status(500).json({ message: "Transmission failure." });
  }
});

module.exports = router;