const express = require('express');
const router = express.Router();

// Import controller and middleware using CommonJS require
const { 
    getAllEvents, 
    toggleEventStatus, 
    deleteEvent, 
    getAllOrganizers, 
    deleteOrganizer 
} = require('../controllers/adminController');

const { protect, authorizeRoles } = require('../middleware/auth');

// All routes in this file require the user to be logged in (protect)
// and have an 'admin' role (checked via authorizeRoles)
router.use(protect, authorizeRoles('admin'));

// --- Event Management ---
router.get('/events', getAllEvents);
router.put('/events/:id/status', toggleEventStatus);
router.delete('/events/:id', deleteEvent);

// --- Organizer Management ---
router.get('/organizers', getAllOrganizers);
router.delete('/organizers/:id', deleteOrganizer);

// Export using CommonJS
module.exports = router;