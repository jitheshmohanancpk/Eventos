const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

const app = express();

// --- GLOBAL MIDDLEWARE ---
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// --- MODEL REGISTRATION ---
// Ensure these paths match your folder structure
require('./models/Category'); 
require('./models/Event');
require('./models/User'); 

// --- ROUTES ---
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const engagementRoutes = require('./routes/engagementRoutes');
const adminRoutes = require('./routes/adminRoutes'); 

// Register Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/engagement', engagementRoutes);
app.use('/api/admin', adminRoutes);

// Root Test Route
app.get('/', (req, res) => {
  res.send('🚀 Evento API is online!');
});

// --- GLOBAL ERROR HANDLER ---
// CRITICAL: This MUST be the last middleware defined
app.use((err, req, res, next) => {
  console.error("--- GLOBAL ERROR HANDLER ---");
  console.error("Error Details:", err.message);

  res.status(err.status || 500).json({ 
    success: false, 
    message: err.message || 'Internal Server Error' 
  });
});

// --- DATABASE CONNECTION ---
const PORT = process.env.PORT || 5000;

if (!process.env.MONGO_URI) {
    console.error("FATAL ERROR: MONGO_URI is not defined in .env");
    process.exit(1);
}

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Database connected successfully!');
    app.listen(PORT, () => {
      console.log(`⚙️ Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ CRITICAL: MongoDB connection failed:', err.message);
    process.exit(1); 
  });