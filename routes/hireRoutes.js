const express = require('express');
const router = express.Router();
const sendEmail = require('../utilities/sendEmail');
const hire = require('../models/hire');

router.post('/submit', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const newHire = new hire({ name, email, message });
    await newHire.save();

    try {
      await sendEmail({
        email: 'cogops93@gmail.com',
        subject: ` NEW PROJECT BRIEF: ${name}`,
        html: `<h3>New Lead Captured</h3><p><strong>Client:</strong> ${name}</p><p><strong>Message:</strong> ${message}</p>`
      });

      await sendEmail({
        email: email,
        subject: 'CogOps // TRANSMISSION RECEIVED',
        html: `
          <div style="font-family: sans-serif; text-align: center; padding: 20px;">
            <h1 style="letter-spacing: -2px;">RECEIVED.</h1>
            <p>Hello ${name}, your brief has been logged into the CogOps infrastructure.</p>
            <p>A technical lead will synchronize with you shortly.</p>
          </div>
        `
      });
    } catch (mailErr) {
      console.log("Email sync delayed, but data is safe in Compass.");
    }

    res.status(200).json({ message: "HIRE DATA LOGGED SUCCESSFULLY" });
  } catch (err) {
    res.status(500).json({ message: "SYSTEM ERROR", error: err.message });
  }
});

module.exports = router;