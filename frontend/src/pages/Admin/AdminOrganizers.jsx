import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Trash2, Loader2, Mail, User } from 'lucide-react';

const AdminOrganizers = () => {
  const [organizers, setOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrganizers();
  }, []);

  const loadOrganizers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/admin/organizers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrganizers(res.data.data);
    } catch (err) {
      console.error("Error loading organizers:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this organizer?")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/admin/organizers/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        loadOrganizers();
      } catch (err) {
        alert("Failed to delete organizer.");
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar - Consistent with Dashboard */}
      <aside className="w-64 bg-slate-900 text-white p-6">
        <h2 className="text-xl font-bold mb-8">Admin Panel</h2>
        <nav className="space-y-4">
          <div className="flex items-center gap-3 cursor-pointer p-2 hover:bg-slate-800 rounded">
            <Users size={20} /> Dashboard
          </div>
          <div className="flex items-center gap-3 cursor-pointer p-2 bg-blue-600 rounded">
            <Users size={20} /> Organizers
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Organizer Management</h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin text-blue-600" size={40} />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 border-b">Name</th>
                  <th className="p-4 border-b">Email</th>
                  <th className="p-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {organizers.map((org) => (
                  <tr key={org._id} className="hover:bg-gray-50">
                    <td className="p-4 border-b flex items-center gap-2">
                      <User size={18} className="text-gray-400" /> {org.name}
                    </td>
                    <td className="p-4 border-b text-gray-600">
                      <div className="flex items-center gap-2">
                        <Mail size={16} /> {org.email}
                      </div>
                    </td>
                    <td className="p-4 border-b">
                      <button 
                        onClick={() => handleDelete(org._id)}
                        className="text-red-600 hover:text-red-800 transition"
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminOrganizers;