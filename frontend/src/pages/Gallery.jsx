import React, { useState } from 'react';
import { events } from '../data/events';
import { Search, MapPin, Calendar, User, SlidersHorizontal } from 'lucide-react';

const Gallery = () => {
  const [search, setSearch] = useState("");
  const [activeVenue, setActiveVenue] = useState("All");
  const [activeOrganizer, setActiveOrganizer] = useState("All");

  // 1. തനതായ (Unique) വന്യൂകളും ഓർഗനൈസർമാരും ലിസ്റ്റ് ചെയ്യാൻ
  const venues = ["All", ...new Set(events.map(e => e.location))];
  const organizers = ["All", ...new Set(events.map(e => e.organizer))];

  // 2. ഫിൽട്ടറിംഗ് ലോജിക്
  const filteredGallery = events.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(search.toLowerCase());
    const matchesVenue = activeVenue === "All" || e.location === activeVenue;
    const matchesOrganizer = activeOrganizer === "All" || e.organizer === activeOrganizer;
    
    return matchesSearch && matchesVenue && matchesOrganizer;
  });

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header Section */}
      <div className="bg-slate-900 py-20 px-6 text-center">
        <h1 className="text-5xl font-black text-white mb-4 italic tracking-tighter">EVENT GALLERY.</h1>
        <p className="text-slate-400 max-w-xl mx-auto">Relive the best moments from our past events and discover what's coming next.</p>
      </div>

      {/* Filter Bar Section */}
      <div className="max-w-7xl mx-auto px-6 -mt-10">
        <div className="bg-white rounded-[32px] shadow-2xl p-6 border border-slate-100 flex flex-col gap-6">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search event memories..."
              className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl outline-none font-bold"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Venue Filter */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                <MapPin size={12}/> Filter by Venue
              </label>
              <select 
                className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold text-slate-700 appearance-none border-r-8 border-transparent"
                onChange={(e) => setActiveVenue(e.target.value)}
              >
                {venues.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>

            {/* Organizer Filter */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                <User size={12}/> Filter by Organizer
              </label>
              <select 
                className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold text-slate-700 appearance-none border-r-8 border-transparent"
                onChange={(e) => setActiveOrganizer(e.target.value)}
              >
                {organizers.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="max-w-7xl mx-auto px-6 mt-16">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            Captured Moments <span className="text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full text-sm">{filteredGallery.length}</span>
          </h2>
        </div>

        {filteredGallery.length > 0 ? (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {filteredGallery.map((event) => (
              <div key={event.id} className="relative group overflow-hidden rounded-[30px] break-inside-avoid shadow-lg">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {/* Image Overlay Information */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-8 flex flex-col justify-end">
                  <span className="text-indigo-400 text-xs font-black uppercase mb-2 tracking-widest">{event.category}</span>
                  <h3 className="text-white text-xl font-black mb-2">{event.title}</h3>
                  <div className="flex flex-col gap-1 text-slate-300 text-xs font-bold">
                    <span className="flex items-center gap-2"><MapPin size={14}/> {event.location}</span>
                    <span className="flex items-center gap-2"><Calendar size={14}/> {event.date || 'TBA'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
            <h3 className="text-xl font-black text-slate-400 uppercase">No Moments Found</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;