import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar, MapPin, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from "../../context/AuthContext";

const OrganizerDashboard = () => {
  const navigate = useNavigate();
  const { token, user, authenticated } = useAuth();
  
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMyEvents = async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      setError('');
      const response = await fetch('http://localhost:5000/api/events/my-events', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();

      if (response.ok) {
        // Defensive check: ensure result.data is an array
        setMyEvents(Array.isArray(result.data) ? result.data : []); 
      } else {
        setError(result.message || 'Failed to fetch events');
      }
    } catch (err) {
      console.error("Dashboard Fetch Error:", err);
      setError('Server connection failed. Please check your backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Redirect if explicitly not authenticated
    if (authenticated === false) {
      navigate('/login');
      return;
    }
    
    if (token) {
      fetchMyEvents();
    } else {
      setLoading(false);
    }
  }, [token, authenticated, navigate]);

  const handleEdit = (eventId) => {
    if (!eventId) return;
    navigate(`/edit-event/${eventId}`);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 min-h-screen bg-white">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 pb-6 border-b border-slate-100">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Organizer Dashboard</h1>
          <p className="text-slate-500 font-medium mt-1">Welcome back, {user?.name || 'Organizer'}!</p>
        </div>
        <button 
          onClick={() => navigate('/add-event')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3.5 rounded-2xl font-black flex items-center gap-2 shadow-xl shadow-indigo-100 transition"
        >
          <Plus size={18} /> Create New Event
        </button>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
          <Loader2 className="animate-spin text-indigo-600" size={32} />
          <p className="font-bold text-sm">Fetching your live events...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-100 text-red-600 p-5 rounded-2xl font-bold text-sm mb-6 flex items-center gap-2">
          <AlertCircle size={20} /> {error}
        </div>
      ) : myEvents.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200 px-4">
          <Calendar className="mx-auto text-slate-300 mb-4" size={48} />
          <h3 className="text-xl font-black text-slate-700 tracking-tight">No Events Created Yet</h3>
          <p className="text-slate-400 text-sm font-medium mt-1 max-w-sm mx-auto">
            You haven't listed any events. Click on the button above to launch your first event!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myEvents.map((event) => (
            <div 
              key={event._id} 
              onClick={() => handleEdit(event._id)}
              className="bg-white border border-slate-100 shadow-md rounded-3xl overflow-hidden p-5 flex flex-col hover:shadow-xl transition duration-300 cursor-pointer"
            >
              <div className="w-full h-44 bg-slate-100 rounded-2xl overflow-hidden mb-4 relative">
                <img 
                  src={event.images?.[0] || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=600'} 
                  alt={event.title} 
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=600' }}
                />
              </div>
              <h3 className="font-black text-slate-800 text-lg line-clamp-1">{event.title}</h3>
              <div className="mt-auto pt-4 border-t border-slate-50 flex justify-between items-center text-xs font-black text-slate-400 uppercase">
                <span className="flex items-center gap-1.5"><Calendar size={14} /> {event.date ? new Date(event.date).toLocaleDateString() : 'TBD'}</span>
                <span className="flex items-center gap-1.5"><MapPin size={14} /> {event.location?.city || 'Venue'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrganizerDashboard;