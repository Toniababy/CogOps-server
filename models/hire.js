const mongoose = require('mongoose');

const HireSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, default: 'pending' }, 
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('hire', HireSchema);