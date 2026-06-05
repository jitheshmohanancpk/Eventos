import React, { useState } from 'react';
import { Calendar, MapPin, Share2, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';

// 📅 CALENDAR WIDGET COMPONENT
const CardCalendarSync = ({ eventId, title, location }) => {
  const [calendarLinks, setCalendarLinks] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCalendarClick = async (e) => {
    e.stopPropagation();
    if (dropdownOpen) { setDropdownOpen(false); return; }
    if (calendarLinks) { setDropdownOpen(true); return; }
    if (!eventId) return;

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/events/${eventId}/calendar`);
      const result = await response.json();
      if (result) {
        setCalendarLinks(result);
        setDropdownOpen(true);
      }
    } catch (err) {
      console.error("Calendar fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={handleCalendarClick}
        className="flex items-center gap-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-3 py-2 rounded-xl text-xs font-black transition-all active:scale-95 cursor-pointer"
      >
        <Calendar size={14} />
        {loading ? '...' : 'Calendar'}
      </button>

      {dropdownOpen && calendarLinks && (
        <div className="absolute bottom-full left-0 mb-2 w-48 bg-white border border-slate-200 rounded-xl shadow-2xl z-[9999] p-1">
          <a href={calendarLinks.googleCalendarUrl} target="_blank" rel="noopener noreferrer" className="block px-3 py-2.5 text-xs text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors font-semibold">
            🔵 Google Calendar
          </a>
        </div>
      )}
    </div>
  );
};

// 🏛️ MAIN EVENT CARD COMPONENT
const EventCard = ({ event }) => {
  const navigate = useNavigate();
  const { wishlist, toggleWishlist } = useWishlist();
  
  if (!event) return null;

  // const isSaved = wishlist?.some(item => item._id === event?._id);
  const isSaved = event?._id && wishlist?.some(item => item._id === event._id);

  const handleNavigate = () => {
    if (event?._id) navigate(`/event/${event._id}`);
  };

  const handleToggleSave = (e) => {
    e.stopPropagation();
    toggleWishlist(event);
  };

  const shareEvent = async (e) => {
    e.stopPropagation();
    if (!event?._id) return;
    const eventLink = `${window.location.origin}/event/${event._id}`;
    try {
      await navigator.share({ title: event.title, url: eventLink });
    } catch (err) {
      navigator.clipboard.writeText(eventLink);
    }
  };

  // SAFE PRICE FORMATTER
  const formatPrice = (price) => {
    if (price === 0 || price === "0" || !price) return "Free";
    const numPrice = typeof price === 'string' ? parseFloat(price.replace(/[^0-9.-]+/g, "")) : price;
    return isNaN(numPrice) ? "Free" : `₹${numPrice.toLocaleString('en-IN')}`;
  };

  return (
    <div 
      onClick={handleNavigate}
      className="bg-white rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all flex flex-col h-full cursor-pointer group relative"
    >
      <div className="relative h-48 w-full overflow-hidden bg-slate-100 rounded-t-3xl">
        <img 
          // DYNAMIC FALLBACK: Uses event._id to generate a unique placeholder image
          src={event.images?.[0] || `https://picsum.photos/seed/${event._id || Math.random()}/600/400`} 
          alt={event.title || "Event Image"} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
        <button onClick={handleToggleSave} className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-sm text-slate-600 hover:text-rose-500 transition-colors">
          <Heart size={16} fill={isSaved ? "#f43f5e" : "none"} className={isSaved ? "text-rose-500" : ""} />
        </button>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-black text-slate-900 text-lg mb-1 line-clamp-1">{event.title || "Untitled Event"}</h3>
        <div className="my-3">
          <div className={`text-2xl font-black ${event.priceType === 'free' ? 'text-emerald-600' : 'text-indigo-700'}`}>
            {formatPrice(event.price)}
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold mb-4">
          <MapPin size={14} className="text-indigo-600" />
          <span>{event.location?.city || 'Location TBA'}</span>
        </div>

        <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
          <CardCalendarSync eventId={event._id} title={event.title} location={event.location?.city} />
          <button onClick={shareEvent} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors">
            <Share2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;