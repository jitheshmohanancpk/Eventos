const Event = require('../models/Event');
const User = require('../models/User');

// @desc    Get all events with organizer details
// @route   GET /api/admin/events
const getAllEvents = async (req, res, next) => {
    try {
        const events = await Event.find().populate('organizerId', 'name email');
        res.status(200).json({ success: true, count: events.length, data: events });
    } catch (error) {
        next(error);
    }
};

// @desc    Toggle event status (Enable/Disable)
// @route   PUT /api/admin/events/:id/status
const toggleEventStatus = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);
        
        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }

        event.isActive = !event.isActive;
        await event.save();
        
        res.status(200).json({ success: true, data: event });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete event
// @route   DELETE /api/admin/events/:id
const deleteEvent = async (req, res, next) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        
        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }
        
        res.status(200).json({ success: true, message: 'Event deleted successfully' });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all organizers
// @route   GET /api/admin/organizers
const getAllOrganizers = async (req, res, next) => {
    try {
        const organizers = await User.find({ role: 'organizer' }).select('-password');
        res.status(200).json({ success: true, count: organizers.length, data: organizers });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete organizer
// @route   DELETE /api/admin/organizers/:id
const deleteOrganizer = async (req, res, next) => {
    try {
        // Optional: Add logic to check if user is actually an 'organizer' before deletion
        const user = await User.findByIdAndDelete(req.params.id);
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'Organizer not found' });
        }
        
        res.status(200).json({ success: true, message: 'Organizer deleted successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllEvents,
    toggleEventStatus,
    deleteEvent,
    getAllOrganizers,
    deleteOrganizer
};