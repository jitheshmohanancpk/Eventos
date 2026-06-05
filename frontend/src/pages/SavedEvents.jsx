import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Trash2, ArrowLeft, Heart, Bell } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';

const SavedEvents = () => {
  const navigate = useNavigate();
  const { wishlist, toggleWishlist } = useWishlist();

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <button 
              onClick={() => navigate('/')} 
              className="group flex items-center gap-2 text-slate-500 font-bold mb-4 hover:text-indigo-600 transition-all"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
              Back to Home
            </button>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter">
              Saved <span className="text-indigo-600">Events.</span>
            </h1>
          </div>
          <div className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600">
              <Heart size={24} fill="currentColor" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Interested In</p>
              <p className="text-2xl font-black text-slate-900">{wishlist.length} Events</p>
            </div>
          </div>
        </div>

        {/* List or Empty State */}
        {wishlist.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[40px] border-2 border-dashed border-slate-200">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Your wishlist is empty</h2>
            <button onClick={() => navigate('/events')} className="bg-slate-900 text-white px-10 py-4 mt-4 rounded-full font-bold hover:bg-indigo-600">
              Browse Events
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {wishlist.map((event) => (
              <SavedEventCard key={event._id} event={event} onRemove={() => toggleWishlist(event)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const SavedEventCard = ({ event, onRemove }) => {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(event.date));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(event.date));
    }, 1000);
    return () => clearInterval(timer);
  }, [event.date]);

  function calculateTimeLeft(targetDate) {
    const difference = +new Date(targetDate) - +new Date();
    if (difference <= 0) return null;
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60)
    };
  }

  // FIXED: Handle location object gracefully
  const displayLocation = typeof event.location === 'object' 
    ? (event.location.address || event.location.city || "Location Varies") 
    : event.location;

  return (
    <div className="bg-white rounded-[32px] p-4 flex flex-col lg:flex-row gap-6 border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-500 group">
      <div className="relative lg:w-72 h-48 rounded-[24px] overflow-hidden">
        <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-2 rounded-2xl text-center shadow-sm">
          <p className="text-[10px] font-black text-indigo-600 uppercase tracking-tighter leading-none">
            {new Date(event.date).toLocaleString('default', { month: 'short' })}
          </p>
          <p className="text-xl font-black text-slate-900 leading-none mt-1">
            {new Date(event.date).getDate()}
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-between py-2">
        <div>
          <div className="flex justify-between items-start mb-4">
            <span className="bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
              {event.category || 'General'}
            </span>
            <button onClick={onRemove} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all">
              <Trash2 size={20} />
            </button>
          </div>
          <h3 className="text-2xl font-black text-slate-800 mb-3 tracking-tight group-hover:text-indigo-600 transition-colors">{event.title}</h3>
          <div className="flex flex-wrap items-center gap-5 text-slate-500 text-sm font-bold">
            <div className="flex items-center gap-1.5"><MapPin size={16} className="text-indigo-500" /> {displayLocation}</div>
            <div className="flex items-center gap-1.5"><Clock size={16} className="text-indigo-500" /> {event.time}</div>
            <div className="text-slate-900 bg-slate-100 px-3 py-1 rounded-lg">₹{event.price}</div>
          </div>
        </div>

        <div className="mt-6 bg-slate-900 rounded-[24px] p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-lg"><Bell size={18} className="text-indigo-400" /></div>
            <p className="text-xs font-black uppercase tracking-[0.1em] text-slate-400">Time Until Event</p>
          </div>
          {timeLeft ? (
            <div className="flex gap-6 items-center">
              <TimerBox label="Days" value={timeLeft.days} />
              <TimerBox label="Hrs" value={timeLeft.hours} />
              <TimerBox label="Min" value={timeLeft.minutes} />
              <TimerBox label="Sec" value={timeLeft.seconds} isLast />
            </div>
          ) : (
            <div className="text-indigo-400 font-black tracking-widest uppercase text-sm">Event Happening Now!</div>
          )}
        </div>
      </div>
    </div>
  );
};

const TimerBox = ({ label, value, isLast }) => (
  <div className="flex flex-col items-center">
    <div className="flex items-center">
       <span className={`text-xl font-black ${isLast ? 'text-indigo-400' : 'text-white'}`}>
        {String(value).padStart(2, '0')}
       </span>
       {!isLast && <span className="ml-4 text-slate-700 font-bold">:</span>}
    </div>
    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">{label}</span>
  </div>
);

export default SavedEvents;