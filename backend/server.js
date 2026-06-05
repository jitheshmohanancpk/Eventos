const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

const app = express();

// --- GLOBAL MIDDLEWARE ---
app.use(cors());
app.use(express.json()); // Required for JSON bodies
app.use(express.urlencoded({ extended: true })); // Required for form-data/x-www-form-urlencoded

// --- MODEL REGISTRATION ---
// Ensure these files only export the Mongoose model, NO other logic
require('./models/Category'); 
require('./models/Event');
require('./models/User'); 

// --- ROUTES ---
// We import routes here. 
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/engagement', require('./routes/engagementRoutes'));

// Root Test Route
app.get('/', (req, res) => {
  res.send('🚀 Evento API is online!');
});

// --- GLOBAL ERROR HANDLER ---
// This must be defined AFTER all routes
app.use((err, req, res, next) => {
  console.error("--- GLOBAL ERROR HANDLER ---");
  console.error("Error Name:", err.name);
  console.error("Error Message:", err.message);
  console.error("Stack Trace:", err.stack);

  // Return a clear JSON response instead of crashing the process
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
      console.log(`⚙️ Server is alive on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ CRITICAL: MongoDB connection failed:', err.message);
    process.exit(1); 
  });