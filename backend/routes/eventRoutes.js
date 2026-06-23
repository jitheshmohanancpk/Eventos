const express = require('express');
const router = express.Router();

// 1. IMPORT MODELS
// Note: It is best practice to require the model file directly
const Event = require('../models/Event');
require('../models/Category'); 

// 2. IMPORT CONTROLLERS
const { 
  getEvents, 
  getEventById, 
  createEvent, 
  updateEvent, 
  deleteEvent 
} = require('../controllers/eventController');
const { getCalendarData } = require('../controllers/engagementController');

// 3. IMPORT MIDDLEWARE
const { protect, authorizeRoles } = require('../middleware/auth');

// ==========================================
// ROUTES
// ==========================================

// --- SPECIFIC PROTECTED ROUTES ---
// Must come before dynamic routes like /:id
router.get('/my-events', protect, authorizeRoles('organizer'), async (req, res, next) => {
  try {
    const myEvents = await Event.find({ organizerId: req.user._id })
      .populate({
        path: 'categoryId',
        select: 'name'
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

// --- DYNAMIC ROUTES (Specific paths BEFORE generic :id) ---
// Placing /calendar before /:id ensures Express doesn't mistake 'calendar' for an ID
router.get('/:id/calendar', getCalendarData);
router.get('/:id', getEventById);
router.put('/:id', protect, authorizeRoles('organizer'), updateEvent);
router.delete('/:id', protect, authorizeRoles('organizer'), deleteEvent);

// --- PUBLIC & BASE ROUTES ---
router.get('/', getEvents);
router.post('/', protect, authorizeRoles('organizer'), createEvent);

module.exports = router;