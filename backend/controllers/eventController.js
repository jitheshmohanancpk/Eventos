const Event = require('../models/Event');
const mongoose = require('mongoose');

// @desc    Advanced Discovery Engine: Search, Filter, Sort & Paginate Events
const getEvents = async (req, res, next) => {
  try {
    let query = {};
    if (req.query.search) query.$text = { $search: req.query.search };
    if (req.query.category) query.categoryId = req.query.category;
    if (req.query.priceType) query.priceType = req.query.priceType;
    
    if (req.query.city) {
      query['location.city'] = { $regex: `^${req.query.city}$`, $options: 'i' };
    }

    if (req.query.startDate || req.query.endDate) {
      query.date = {};
      if (req.query.startDate) query.date.$gte = new Date(req.query.startDate);
      if (req.query.endDate) query.date.$lte = new Date(req.query.endDate);
    }

    const sortOptions = {
      popular: { views: -1 },
      priceLowToHigh: { price: 1 },
      priceHighToLow: { price: -1 },
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 }
    };
    const sortBy = sortOptions[req.query.sort] || { createdAt: -1 };

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const totalEvents = await Event.countDocuments(query);
    
    const events = await Event.find(query)
      .populate('categoryId', 'name')
      .populate('organizerId', 'name organizerProfile.companyName')
      .sort(sortBy)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: events.length,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalEvents / limit),
        totalResults: totalEvents,
        hasNextPage: page < Math.ceil(totalEvents / limit)
      },
      data: events
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get single event detail
const getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid Event ID format' });
    }

    const event = await Event.findById(id)
      .populate('categoryId', 'name description')
      .populate('organizerId', 'name email organizerProfile');

    if (!event) return res.status(404).json({ message: 'Event not found' });
    
    // Returning as { data: event } to match the structure your frontend expects
    res.status(200).json({ data: event });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Create a new event
const createEvent = async (req, res) => {
  try {
    const { title, description, categoryId, date, startTime, endTime, location, priceType, price, images, tags } = req.body;

    let lng = parseFloat(location?.geo?.coordinates?.[0]) || parseFloat(location?.geo?.lng);
    let lat = parseFloat(location?.geo?.coordinates?.[1]) || parseFloat(location?.geo?.lat);

    if (isNaN(lng) || isNaN(lat)) {
      return res.status(400).json({ message: 'Validation Error', error: 'Invalid coordinates' });
    }

    const newEvent = await Event.create({
      title, description, categoryId, organizerId: req.user._id, date, startTime, endTime,
      location: { ...location, geo: { type: 'Point', coordinates: [lng, lat] } },
      priceType, 
      price: priceType === 'free' ? 0 : price,
      images: images || [], 
      tags: tags || []
    });

    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update an event
const updateEvent = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: 'Invalid ID' });
    
    let event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    
    if (event.organizerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // FIX: Replaced { new: true } with { returnDocument: 'after' } to resolve Mongoose warning
    event = await Event.findByIdAndUpdate(
        req.params.id, 
        req.body, 
        { returnDocument: 'after', runValidators: true }
    );
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Delete an event
const deleteEvent = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: 'Invalid ID' });

    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    
    if (event.organizerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await event.deleteOne();
    res.json({ message: 'Event removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { getEvents, getEventById, createEvent, updateEvent, deleteEvent };