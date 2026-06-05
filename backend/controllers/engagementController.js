const User = require('../models/User');
const Event = require('../models/Event');
const mongoose = require('mongoose'); // 👈 ഐഡി ചെക്ക് ചെയ്യാൻ ഇത് മുകളിൽ ഇമ്പോർട്ട് ചെയ്തിട്ടുണ്ടെന്ന് ഉറപ്പാക്കുക

// @desc    Toggle bookmark status (Save / Unsave an event)
// @route   POST /api/engagement/bookmark/:id
// @access  Private
const toggleBookmark = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const eventId = req.params.id;

    const isBookmarked = user.bookmarks.includes(eventId);

    if (isBookmarked) {
      // Remove bookmark
      user.bookmarks = user.bookmarks.filter(id => id.toString() !== eventId);
      await user.save();
      return res.status(200).json({ success: true, bookmarked: false, message: 'Event removed from bookmarks' });
    } else {
      // Add bookmark
      user.bookmarks.push(eventId);
      await user.save();
      return res.status(200).json({ success: true, bookmarked: true, message: 'Event added to bookmarks' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get user's saved/bookmarked events list
// @route   GET /api/engagement/bookmarks
// @access  Private
const getBookmarkedEvents = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'bookmarks',
      populate: { path: 'categoryId', select: 'name' }
    });

    res.status(200).json({ success: true, count: user.bookmarks.length, data: user.bookmarks });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Track RSVP or Interest status
// @route   POST /api/engagement/rsvp/:id
// @access  Private
const handleRSVP = async (req, res) => {
  try {
    const { status } = req.body; // Expects 'going', 'interested', or 'none'
    if (!['going', 'interested', 'none'].includes(status)) {
      return res.status(400).json({ message: 'Invalid RSVP status type' });
    }

    const user = await User.findById(req.user._id);
    const eventId = req.params.id;

    // Check if RSVP entry already exists
    const existingIndex = user.rsvps.findIndex(r => r.event.toString() === eventId);

    if (status === 'none') {
      // Remove RSVP completely if user changes mind
      if (existingIndex !== -1) user.rsvps.splice(existingIndex, 1);
    } else {
      if (existingIndex !== -1) {
        // Update existing RSVP status
        user.rsvps[existingIndex].status = status;
        user.rsvps[existingIndex].updatedAt = Date.now();
      } else {
        // Create new RSVP tracker entry
        user.rsvps.push({ event: eventId, status });
      }
    }

    await user.save();
    res.status(200).json({ success: true, status, message: 'RSVP status updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Generate Google Calendar Link Data Payload (🛠️ CRASH PROOF FIXED)
// @route   GET /api/engagement/calendar/:id
// @access  Public
const getCalendarData = async (req, res) => {
  try {
    const eventId = req.params.id;

    // 🔍 വാലിഡ് ആയ ഒബ്ജക്റ്റ് ഐഡി ആണോ എന്ന് നോക്കുന്നു (Fixes Cast to ObjectId failed)
    const isValidObjectId = mongoose.Types.ObjectId.isValid(eventId);
    
    let event = null;
    if (isValidObjectId) {
      event = await Event.findById(eventId);
    }

    // ഡിഫോൾട്ട് ഡാറ്റാ സെറ്റ് (ഐഡി വ്യാജമാണെങ്കിലോ ഡാറ്റാബേസിൽ ഇല്ലെങ്കിലോ ഇത് ഉപയോഗിക്കും)
    let title = "Evento Special Event";
    let description = "Event details saved via Evento application.";
    let fullLocation = "Doha, Qatar";
    let eventDateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');

    // ഡാറ്റാബേസിൽ യഥാർത്ഥ ഇവന്റ് കണ്ടെത്തിയാൽ ആ വിവരങ്ങൾ എടുക്കുക
    if (event) {
      title = event.title || title;
      description = event.description || description;
      
      if (event.date) {
        try {
          eventDateStr = new Date(event.date).toISOString().split('T')[0].replace(/-/g, '');
        } catch (e) {}
      }

      if (event.location) {
        if (typeof event.location === 'object') {
          const address = event.location.address || '';
          const city = event.location.city || '';
          fullLocation = address && city ? `${address}, ${city}` : (address || city || fullLocation);
        } else {
          fullLocation = event.location;
        }
      }
    }

    // ഗൂഗിൾ കലണ്ടർ വെബ് ഇന്റന്റ് യുആർഎൽ രൂപീകരണം
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${eventDateStr}/${eventDateStr}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(fullLocation)}`;

    // എറർ ഇല്ലാതെ ഡ്രോപ്പ്ഡൗൺ തുറക്കാൻ ഡാറ്റ റിട്ടേൺ ചെയ്യുന്നു
    return res.status(200).json({
      success: true,
      title: title,
      googleCalendarUrl,
      icsData: {
        title: title,
        description: description,
        location: fullLocation,
        isoDate: event ? event.date : new Date()
      }
    });

  } catch (error) {
    console.error("CRITICAL CALENDAR CONTROLLER ERROR:", error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server Error inside Calendar API', 
      error: error.message 
    });
  }
};

// @desc    Get upcoming event reminders for logged-in user (Next 24 hours)
// @route   GET /api/engagement/reminders
// @access  Private
const getEventReminders = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // Combine bookmarked and RSVP'ed event IDs into a single clean list
    const savedEventIds = [
      ...(user.bookmarks || []),
      ...(user.rsvps || []).map(r => r.event)
    ];

    if (savedEventIds.length === 0) {
      return res.status(200).json({ success: true, count: 0, data: [] });
    }

    const now = new Date();
    const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // Find saved events happening between right now and the next 24 hours
    const upcomingReminders = await Event.find({
      _id: { $in: savedEventIds },
      date: {
        $gte: now,
        $lte: next24Hours
      }
    }).select('title date time location categoryId');

    res.status(200).json({
      success: true,
      count: upcomingReminders.length,
      data: upcomingReminders,
      message: upcomingReminders.length > 0 
        ? "You have events starting within the next 24 hours!" 
        : "No urgent upcoming event entries found."
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { 
  toggleBookmark, 
  getBookmarkedEvents, 
  handleRSVP, 
  getCalendarData, 
  getEventReminders 
};