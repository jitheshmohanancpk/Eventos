import React from 'react';
import { Power, Trash2 } from 'lucide-react';

const EventTable = ({ events, onToggle, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-4 border-b font-semibold text-gray-700">Title</th>
            <th className="p-4 border-b font-semibold text-gray-700">Date</th>
            <th className="p-4 border-b font-semibold text-gray-700">Status</th>
            <th className="p-4 border-b font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event._id} className="hover:bg-gray-50 transition">
              <td className="p-4 border-b">{event.title}</td>
              <td className="p-4 border-b text-gray-600">
                {new Date(event.date).toLocaleDateString()}
              </td>
              <td className="p-4 border-b">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  event.isActive 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {event.isActive ? 'Active' : 'Disabled'}
                </span>
              </td>
              <td className="p-4 border-b flex gap-3">
                <button 
                  onClick={() => onToggle(event._id)}
                  className="text-blue-600 hover:text-blue-800 transition"
                  title="Toggle Status"
                >
                  <Power size={18} />
                </button>
                <button 
                  onClick={() => onDelete(event._id)}
                  className="text-red-600 hover:text-red-800 transition"
                  title="Delete Event"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EventTable;