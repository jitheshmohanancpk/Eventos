const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add an event title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add an event description'],
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Please link this event to a category'],
    },
    organizerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: [true, 'Please add an event date'],
    },
    startTime: {
      type: String,
      required: [true, 'Please add a start time'],
    },
    endTime: {
      type: String,
      required: [true, 'Please add an end time'],
    },
    location: {
      address: {
        type: String,
        required: [true, 'Please add a street address'],
      },
      city: {
        type: String,
        required: [true, 'Please add a city'],
        trim: true,
      },
      state: {
        type: String,
        required: [true, 'Please add a state/region'],
      },
      geo: {
        type: {
          type: String,
          enum: ['Point'],
          required: true,
        },
        coordinates: {
          type: [Number], // [longitude, latitude]
          required: true,
        },
      },
      // Moved capacity fields to the location level for better query performance
      capacity: { 
        type: Number 
      },
      availableTickets: { 
        type: Number 
      },
    },
    priceType: {
      type: String,
      enum: ['free', 'paid'],
      default: 'free',
    },
    price: {
      type: Number,
      default: 0,
    },
    images: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// 1. Core Geospatial Indexing for distance-based queries
eventSchema.index({ 'location.geo': '2dsphere' });

// 2. CRITICAL WEEK 2 FIX: Compound Text Index to enable high-speed global searches
eventSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Event', eventSchema);