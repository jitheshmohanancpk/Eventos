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
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/events/${id}`);
        const result = await response.json();
        if (response.ok) {
          // Setting the initial form state from API result
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

  // Unified handler for top-level fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Dedicated handler for nested location fields
  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      location: { ...prev.location, [name]: value }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const cleanToken = token ? token.replace(/['"]+/g, '') : null;
    
    // Constructing a payload to match backend schema exactly
    const submitPayload = {
      title: formData.title,
      description: formData.description,
      price: Number(formData.price),
      priceType: formData.priceType,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      location: formData.location, 
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
        alert("Event updated successfully! 🎉");
        navigate('/dashboard');
      } else {
        const errorData = await response.json();
        alert(`Update failed: ${errorData.message || "Unknown error"}`);
      }
    } catch (err) {
      alert("Failed to update event. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-indigo-600" size={40} /></div>;

  return (
    <div className="max-w-2xl mx-auto px-6 py-10 bg-white min-h-screen">
      <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-slate-500 mb-6 hover:text-slate-800">
        <ArrowLeft size={16} /> Back to Dashboard
      </button>
      
      <h1 className="text-3xl font-black mb-8">Edit Event</h1>
      
      {formData ? (
        <form onSubmit={handleSubmit} className="space-y-6 bg-slate-50 p-8 rounded-3xl border border-slate-100">
          <label className="block text-sm font-bold">Title</label>
          <input name="title" className="w-full p-4 border rounded-2xl" value={formData.title || ''} onChange={handleInputChange} />
          
          <label className="block text-sm font-bold">Description</label>
          <textarea name="description" className="w-full p-4 border rounded-2xl" value={formData.description || ''} onChange={handleInputChange} />

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-bold">City</label>
                <input name="city" className="w-full p-4 border rounded-2xl" value={formData.location?.city || ''} onChange={handleLocationChange} />
             </div>
             <div>
                <label className="block text-sm font-bold">Price (₹)</label>
                <input name="price" type="number" className="w-full p-4 border rounded-2xl" value={formData.price || 0} onChange={handleInputChange} />
             </div>
          </div>
          
          <button 
            type="submit" 
            disabled={submitting} 
            className={`w-full py-4 rounded-2xl font-black transition ${submitting ? 'bg-slate-400' : 'bg-indigo-600 hover:bg-indigo-700'} text-white`}
          >
            {submitting ? 'Updating...' : 'Update Event'}
          </button>
        </form>
      ) : (
        <p className="text-red-500 font-bold text-center">Event not found.</p>
      )}
    </div>
  );
};

export default EditEvent;