import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EventCard from '../components/EventCard';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🌟 NEW STATES: Manage Search, Category, and Sorting
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    const fetchEvents = async () => {
      setError(null);
      try {
        // 🚀 DYNAMIC QUERY: Appends filters as active URL parameters matching your backend
        // ✅ FIX: Swapped http://localhost:5000/api/events to /api/events to respect your Vite proxy config
        const res = await axios.get('/api/events', {
          params: {
            search: search || undefined,   // sending undefined prevents blank parameters in url
            category: category || undefined,
            sort: sort
          }
        });
        
        // 🛡️ DATA NORMALIZATION (Kept exactly as you built it):
        const eventData = res.data?.data || (Array.isArray(res.data) ? res.data : []);
        
        setEvents(eventData);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events. Please check if the server is running.");
      } finally {
        setLoading(false);
      }
    };
    
    // ⏳ DEBOUNCE LOGIC: Triggers immediately on select change, adds a 400ms typing delay for search input
    setLoading(true); 
    const delayDebounceFn = setTimeout(() => {
      fetchEvents();
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [search, category, sort]); // 🔄 Re-runs dynamically whenever any filter state updates

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Upcoming Events</h1>
          <p className="text-slate-500 font-medium mt-1">Discover ongoing and upcoming local experiences</p>
        </div>
        <p className="text-slate-400 font-bold text-sm bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
          {!loading && `${events.length} ${events.length === 1 ? 'Event' : 'Events'} available`}
        </p>
      </div>

      {/* 🛠️ FILTER CONTROL BAR (Matches your layout aesthetic perfectly) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        
        {/* Search Input Box */}
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search food, art, music festivals..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all shadow-sm"
          />
        </div>

        {/* Category Dropdown Selection */}
        <div>
          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all shadow-sm cursor-pointer appearance-none"
          >
            <option value="">All Categories</option>
            <option value="Food">Food Festival</option>
            <option value="Art">Art Festival</option>
            <option value="Music">Music Festival</option>
            <option value="Cultural">Cultural Fest</option>
          </select>
        </div>

        {/* Sorting Dropdown (Value names map directly to your backend sortOptions array config) */}
        <div>
          <select 
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all shadow-sm cursor-pointer appearance-none"
          >
            <option value="newest">Newest First</option>
            <option value="popular">Most Popular (Views)</option>
            <option value="priceLowToHigh">Price: Low to High</option>
            <option value="priceHighToLow">Price: High to Low</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

      </div>
      
      {/* EVENTS MAIN GRID & LOADING LAYOUTS */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-96 bg-slate-100 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-20 bg-red-50 rounded-3xl text-red-600 font-bold">
          {error}
        </div>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-3xl">
          <p className="text-slate-500 font-bold">No events found matching your search parameters.</p>
        </div>
      )}
    </div>
  );
};

export default Home;