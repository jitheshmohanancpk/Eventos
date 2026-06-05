const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['user', 'organizer'], default: 'user' },
  phone: { type: String, trim: true },
  organizerProfile: {
    companyName: String,
    currentEventName: String,
    eventLocation: String,
    logo: String
  },
  otp: String,
  otpExpires: Date
}, { timestamps: true });

// Password comparison method
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);