import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, Loader2 } from 'lucide-react';

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/events/${id}`);
        const result = await response.json();
        if (response.ok) {
          setFormData(result.data || result); 
        }
      } catch (err) {
        console.error("Error fetching event:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanToken = token ? token.replace(/['"]+/g, '') : null;
    
    // CRITICAL: Construct a clean payload. 
    // Do NOT send the whole object (it might contain _id, populated sub-docs, etc.)
    const submitPayload = {
      title: formData.title,
      description: formData.description,
      price: Number(formData.price),
      priceType: formData.priceType || 'free',
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      location: formData.location, // Ensure this object is intact
      tags: formData.tags
    };

    try {
      const response = await fetch(`http://localhost:5000/api/events/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cleanToken}`
        },
        body: JSON.stringify(submitPayload)
      });
      
      if (response.ok) {
        alert("Event updated successfully!");
        navigate('/dashboard');
      } else {
        const errorData = await response.json();
        console.error("Update failed:", errorData);
        alert(`Update failed: ${errorData.message || "Unknown error"}`);
      }
    } catch (err) {
      alert("Failed to update event.");
    }
  };

  if (loading) return <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto" /></div>;

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-slate-500 mb-6">
        <ArrowLeft size={16} /> Back to Dashboard
      </button>
      
      <h1 className="text-3xl font-black mb-8">Edit Event</h1>
      
      {formData ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-bold">Title</label>
          <input 
            className="w-full p-4 border rounded-2xl"
            value={formData.title || ''}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
          />
          
          <label className="block text-sm font-bold">Description</label>
          <textarea 
            className="w-full p-4 border rounded-2xl"
            value={formData.description || ''}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />

          <label className="block text-sm font-bold">Price (₹)</label>
          <input 
            type="number"
            className="w-full p-4 border rounded-2xl"
            value={formData.price || 0}
            onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
          />
          
          <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700">
            Update Event
          </button>
        </form>
      ) : (
        <p className="text-red-500 font-bold">Event not found.</p>
      )}
    </div>
  );
};

export default EditEvent;
