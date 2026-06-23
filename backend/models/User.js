const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  
  // 'attendee' is included here. Ensure your frontend sends 'attendee' in lowercase.
  role: { 
    type: String, 
    enum: ['user', 'organizer', 'admin', 'attendee'], 
    default: 'user' 
  },
  
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

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);