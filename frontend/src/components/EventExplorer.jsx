import React, { useState, useEffect } from 'react';
import { fetchFilteredEvents } from '../api/eventApi';

function EventExplorer() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [city, setCity] = useState(''); 
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const result = await fetchFilteredEvents({ search, city, page, limit: 6 });
        setEvents(result.data);
        setPagination(result.pagination);
      } catch (error) {
        console.error("Failed loading discovery stream:", error);
      }
    };
    loadEvents();
  }, [search, city, page]); 

  // 🛡️ UPGRADED: Bulletproof Security Environment Wrapper
  const shareEvent = async (eventId, eventTitle) => {
    const eventLink = `${window.location.origin}/events/${eventId}`;
    
    // Check if web sharing is completely available AND securely permitted by the environment
    if (navigator.share && typeof navigator.canShare === 'function') {
      try {
        await navigator.share({
          title: eventTitle || 'Check out this event!',
          text: `Join me at ${eventTitle}!`,
          url: eventLink
        });
        return; // Success exit
      } catch (err) {
        // Fall through to clipboard if user cancels share drawer
        if (err.name === 'AbortError') return;
        console.warn("Native share failed, falling back to clipboard:", err);
      }
    }

    // Modern Secure Clipboard Fallback
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(eventLink);
        alert('🔗 Event link copied to clipboard!');
        return;
      } catch (err) {
        console.error("Clipboard write failed:", err);
      }
    }

    // Absolute Local Environment/Unsecure HTTP Fallback Window Prompt
    window.prompt("Copy this event link to share:", eventLink);
  };

  return (
    <div style={{ padding: '24px', fontFamily: 'Arial, sans-serif' }}>
      <h2>🗓️ Discover Events</h2>
      
      {/* City filter quick toggle inputs for validation testing */}
      <div style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
        <button 
          onClick={() => { setCity(''); setPage(1); }} 
          style={{ 
            fontWeight: city === '' ? 'bold' : 'normal',
            padding: '6px 12px',
            cursor: 'pointer'
          }}
        >
          All Cities
        </button>
        <button 
          onClick={() => { setCity('Doha'); setPage(1); }} 
          style={{ 
            fontWeight: city === 'Doha' ? 'bold' : 'normal',
            padding: '6px 12px',
            cursor: 'pointer'
          }}
        >
          Doha
        </button>
      </div>

      <input 
        type="text" 
        placeholder="Search Tech, Gala, Design..." 
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }} 
        style={{
          padding: '10px 16px',
          width: '100%',
          maxWidth: '400px',
          borderRadius: '8px',
          border: '1px solid #ccc',
          marginBottom: '24px',
          display: 'block'
        }}
      />

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: '20px' 
      }}>
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event._id} style={{
              border: '1px solid #E5E5E5',
              borderRadius: '12px',
              padding: '16px',
              backgroundColor: '#F9F9F9',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '200px'
            }}>
              <div>
                <h3 style={{ margin: '0 0 8px 0' }}>{event.title}</h3>
                <p style={{ color: '#545554', fontSize: '14px' }}>{event.description}</p>
                <div style={{ fontSize: '12px', color: '#888' }}>
                  📍 {event.location?.city || 'Unknown'} | 🏷️ {event.categoryId?.name || 'General'}
                </div>
              </div>

              {/* Action Toolbar with the Share button */}
              <div style={{ 
                marginTop: '16px', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center' 
              }}>
                <span style={{ fontWeight: 'bold' }}>
                  {event.priceType === 'free' ? 'FREE' : `${event.price} QAR`}
                </span>
                
                <button 
                  onClick={() => shareEvent(event._id, event.title)}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #D1D1D1',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  📤 Share
                </button>
              </div>
            </div>
          ))
        ) : (
          <div style={{ padding: '20px', color: '#666', gridColumn: '1 / -1' }}>
            <p>No events found matching your criteria.</p>
            <p style={{ fontSize: '12px', color: '#999' }}>Active Filter: City = "{city || 'All'}", Search = "{search || 'None'}"</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default EventExplorer;