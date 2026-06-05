const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Ensure models are registered to avoid 'Schema not registered' errors
const Event = mongoose.model('Event');
require('../models/Category'); 

const { 
  getEvents, 
  getEventById, 
  createEvent, 
  updateEvent, 
  deleteEvent 
} = require('../controllers/eventController');
const { getCalendarData } = require('../controllers/engagementController');
const { protect, authorizeRoles } = require('../middleware/auth');

// ==========================================
// 1. SPECIFIC PROTECTED ROUTES (MUST BE FIRST)
// ==========================================
// Placing /my-events above /:id prevents the router from 
// mistaking 'my-events' for a MongoDB ObjectId.
router.get('/my-events', protect, authorizeRoles('organizer'), async (req, res, next) => {
  try {
    const myEvents = await Event.find({ organizerId: req.user._id })
      .populate({
        path: 'categoryId',
        select: 'name' // Explicitly select field to avoid errors
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: myEvents.length,
      data: myEvents
    });
  } catch (error) {
    next(error); 
  }
});

// ==========================================
// 2. PUBLIC ROUTES
// ==========================================
router.get('/', getEvents);
router.get('/:id', getEventById);
router.get('/:id/calendar', getCalendarData);

// ==========================================
// 3. DYNAMIC PROTECTED ROUTES (MUST BE LAST)
// ==========================================
router.post('/', protect, authorizeRoles('organizer'), createEvent);
router.put('/:id', protect, authorizeRoles('organizer'), updateEvent);
router.delete('/:id', protect, authorizeRoles('organizer'), deleteEvent);

module.exports = router;