const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path'); // Added path utility
const Category = require('./models/Category');

// Explicitly point dotenv to look at your root .env file layout
dotenv.config({ path: path.join(__dirname, '.env') });

const categories = [
  { name: 'Tech & Innovation', description: 'Conferences, hackathons, and developer meetups.' },
  { name: 'Luxury & Hospitality', description: 'High-end hotel branding, networking, and gala events.' },
  { name: 'Music & Festivals', description: 'Live concerts, festivals, and acoustic nights.' },
  { name: 'Business & Startup', description: 'Pitch nights, seminars, and corporate networking.' }
];

const seedDB = async () => {
  try {
    // Safety check log to confirm the environment string is loading
    if (!process.env.MONGO_URI) {
      throw new Error('CRITICAL: process.env.MONGO_URI is undefined. Check your .env file name and contents.');
    }

    console.log('📦 Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🔗 Connected! Seeding database categories...');

    // Clear existing categories to avoid duplicates
    await Category.deleteMany({});
    
    // Insert seed data
    await Category.insertMany(categories);
    console.log('✅ Categories successfully seeded!');
    
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDB();