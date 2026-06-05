import React, { useState } from 'react';
import { events } from '../data/events';
import EventCard from '../components/EventCard';
import { Filter, ChevronRight } from 'lucide-react';

const EventsSection = ({ limit = null, title = "Upcoming Events" }) => {
  const [activeFilter, setActiveFilter] = useState("All");

  const categories = ["All", "Technology", "Music", "Workshop", "Meetup", "Cultural", "Sports",];

  // Filter logic
  const filteredEvents = activeFilter === "All" 
    ? events 
    : events.filter(e => e.category === activeFilter);

  // If a limit is passed (e.g., show only 3 on Home), slice the array
  const displayedEvents = limit ? filteredEvents.slice(0, limit) : filteredEvents;



  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-8 h-[2px] bg-indigo-600"></span>
              <span className="text-indigo-600 font-bold text-sm uppercase tracking-widest">Discover</span>
            </div>
            <h2 className="text-4xl font-black text-slate-900">{title}</h2>
          </div>

          {/* Category Quick-Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            <Filter size={18} className="text-slate-400 mr-2 shrink-0" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-5 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                  activeFilter === cat
                    ? 'bg-slate-900 text-white shadow-lg'
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* The Grid */}
        {displayedEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {displayedEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[40px]">
            <p className="text-slate-400 font-medium">No events found in this category.</p>
          </div>
        )}

        {/* "View All" Button - Only shows if limited */}
        {limit && events.length > limit && (
          <div className="mt-16 text-center">
            <button className="inline-flex items-center gap-2 bg-white border-2 border-slate-900 text-slate-900 px-8 py-4 rounded-2xl font-black hover:bg-slate-900 hover:text-white transition-all group">
              Explore All Events
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default EventsSection;