const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { 
  toggleBookmark, 
  getBookmarkedEvents, 
  handleRSVP, 
  getCalendarData 
} = require('../controllers/engagementController');

// Bookmark Endpoints
router.post('/bookmark/:id', protect, toggleBookmark);
router.get('/bookmarks', protect, getBookmarkedEvents);

// RSVP Endpoint
router.post('/rsvp/:id', protect, handleRSVP);

// Public Calendar Endpoint
router.get('/calendar/:id', getCalendarData);

module.exports = router;