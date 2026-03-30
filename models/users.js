const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  currentPhase: { type: Number, default: 0 }, 
  track: { type: String, enum: ['Frontend', 'Backend', 'UI/UX', 'QA', 'None'], default: 'None' },
  enrolledDate: { type: Date, default: Date.now },
  role: { 
    type: String, 
    enum: ['academy', 'agency', 'hire'], 
    default: 'academy' 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('user', UserSchema);