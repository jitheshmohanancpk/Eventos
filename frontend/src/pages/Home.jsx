import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EventCard from '../components/EventCard';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        // Updated URL and added error handling
        const res = await axios.get('http://localhost:5000/api/events');
        
        // 🛡️ DATA NORMALIZATION:
        // Handle both formats: { data: [...] } or direct [...]
        const eventData = res.data?.data || (Array.isArray(res.data) ? res.data : []);
        
        setEvents(eventData);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events. Please check if the server is running.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex justify-between items-end mb-8">
        <h1 className="text-4xl font-black text-slate-900">Upcoming Events</h1>
        <p className="text-slate-400 font-bold text-sm">
          {!loading && `${events.length} ${events.length === 1 ? 'Event' : 'Events'} available`}
        </p>
      </div>
      
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
          <p className="text-slate-500 font-bold">No events found at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default Home;