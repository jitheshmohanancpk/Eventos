import React, { useEffect, useState } from 'react';
import { fetchAllEvents, toggleEventStatus, deleteEvent } from '../../services/adminService';

const AdminEvents = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const res = await fetchAllEvents();
      setEvents(res.data.data);
    } catch (err) {
      console.error("Failed to load events", err);
    }
  };

  const handleToggle = async (id) => {
    await toggleEventStatus(id);
    loadEvents(); // Refresh list
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      await deleteEvent(id);
      loadEvents(); // Refresh list
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Event Management</h1>
      <table className="w-full border-collapse border">
        <thead>
          <tr>
            <th className="border p-2">Title</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event._id}>
              <td className="border p-2">{event.title}</td>
              <td className="border p-2">{event.isActive ? 'Active' : 'Disabled'}</td>
              <td className="border p-2 space-x-2">
                <button onClick={() => handleToggle(event._id)} className="bg-blue-500 text-white p-1 rounded">
                  Toggle Status
                </button>
                <button onClick={() => handleDelete(event._id)} className="bg-red-500 text-white p-1 rounded">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminEvents;