import React, { useState, useEffect } from 'react';
import { 
  fetchAllEvents, toggleEventStatus, deleteEvent, 
  getAllUsers, deleteUser 
} from '../../services/adminService';
import { Power, Trash2, Edit, Trash, Loader2 } from 'lucide-react';

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [view, setView] = useState('events');
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [eventsRes, usersRes] = await Promise.allSettled([fetchAllEvents(), getAllUsers()]);
      if (eventsRes.status === 'fulfilled') setEvents(eventsRes.value?.data?.data || []);
      if (usersRes.status === 'fulfilled') {
        setUsers(usersRes.value?.data?.data || []);
      }
    } catch (err) { console.error("Failed to load data:", err); }
    finally { setLoading(false); }
  };

  // Logic: Matches 'organizer' and 'user' (for attendees)
  const filteredUsers = users.filter(u => {
    const role = u.role?.toLowerCase();
    if (view === 'organizers') return role === 'organizer';
    if (view === 'attendees') return role === 'user'; // Matches DB console output
    return false;
  });

  // Handlers
  const handleToggleEvent = async (id) => { try { await toggleEventStatus(id); loadData(); } catch(e) { alert("Status update failed"); } };
  
  const handleDeleteEvent = async (id) => {
    if (window.confirm("Delete this event?")) {
      try { await deleteEvent(id); loadData(); } catch(e) { alert("Failed to delete event"); }
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Delete this user?")) {
      try {
        await deleteUser(id);
        loadData();
      } catch (e) { alert("Failed to delete user. Ensure backend route exists."); }
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-slate-900 text-white p-6">
        <h2 className="text-xl font-bold mb-8">Admin Panel</h2>
        <nav className="space-y-4">
          <div className="cursor-pointer p-2 hover:bg-slate-800 rounded" onClick={() => setView('events')}>Events</div>
          <div className="cursor-pointer p-2 hover:bg-slate-800 rounded" onClick={() => setView('organizers')}>Organizers</div>
          <div className="cursor-pointer p-2 hover:bg-slate-800 rounded" onClick={() => setView('attendees')}>Attendees</div>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6 capitalize">{view} Management</h1>
        
        {loading ? (
          <div className="flex justify-center mt-10"><Loader2 className="animate-spin" size={40}/></div>
        ) : (
          view === 'events' ? (
            <div className="bg-white p-6 shadow rounded overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50"><tr><th className="p-3">Title</th><th className="p-3">Status</th><th className="p-3">Actions</th></tr></thead>
                <tbody>
                  {events.map(event => (
                    <tr key={event._id} className="border-b">
                      <td className="p-3">{event.title}</td>
                      <td className="p-3">{event.isActive ? 'Active' : 'Disabled'}</td>
                      <td className="p-3 flex gap-3">
                        <button onClick={() => handleToggleEvent(event._id)} className="text-blue-600"><Power size={18}/></button>
                        <button onClick={() => handleDeleteEvent(event._id)} className="text-red-600"><Trash2 size={18}/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white p-6 shadow rounded">
              <h2 className="text-lg font-bold mb-4">{view} ({filteredUsers.length} found)</h2>
              <table className="w-full text-left">
                <thead><tr className="border-b text-gray-500"><th className="pb-3">Name</th><th className="pb-3">Email</th><th className="pb-3">Actions</th></tr></thead>
                <tbody>
                  {filteredUsers.map(u => (
                    <tr key={u._id} className="border-b">
                      <td className="py-3">{u.name}</td>
                      <td className="py-3 text-gray-600">{u.email}</td>
                      <td className="py-3 flex gap-3">
                        <button onClick={() => alert("Edit functionality coming soon")} className="text-blue-500"><Edit size={18}/></button>
                        <button onClick={() => handleDeleteUser(u._id)} className="text-red-500"><Trash size={18}/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;