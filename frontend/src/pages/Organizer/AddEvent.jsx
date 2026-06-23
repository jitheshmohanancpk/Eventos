import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AddEvent = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '', description: '', date: '', startTime: '10:00', endTime: '13:00',
    city: '', state: 'Kerala', priceType: 'free', price: 0, image: '', tags: ''
  });

  // Centralized input handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const cleanToken = token ? token.replace(/['"]+/g, '') : null;
    if (!cleanToken) {
      alert("Authentication error: Please log in again.");
      setLoading(false);
      return;
    }

    const eventPayload = {
      title: formData.title,
      description: formData.description,
      categoryId: '65f1a2b3c4d5e6f7a8b9c0d1',
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      priceType: formData.priceType,
      price: formData.priceType === 'free' ? 0 : Number(formData.price),
      location: {
        address: "Default Address",
        city: formData.city,
        state: formData.state,
        geo: { type: 'Point', coordinates: [76.2673, 9.9312] }
      },
      images: formData.image ? [formData.image] : [],
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : ['Event']
    };

    try {
      const response = await fetch('http://localhost:5000/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cleanToken}`
        },
        body: JSON.stringify(eventPayload)
      });

      const result = await response.json();

      if (response.ok) {
        alert("Event Created Successfully! 🎉");
        navigate('/dashboard');
      } else {
        alert(`Failed: ${result.message || "Invalid input"}`);
      }
    } catch (err) {
      alert("Server unreachable.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10 min-h-screen bg-white">
      <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-slate-500 mb-6">
        <ArrowLeft size={16} /> Back
      </button>

      <h1 className="text-3xl font-black mb-8">Create New Event</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-slate-50 p-8 rounded-3xl border border-slate-100">
        <input required name="title" type="text" placeholder="Event Title" className="w-full p-4 border rounded-2xl" onChange={handleInputChange} />
        <input name="image" type="url" placeholder="Image URL" className="w-full p-4 border rounded-2xl" onChange={handleInputChange} />
        <textarea required name="description" rows="3" placeholder="Description" className="w-full p-4 border rounded-2xl" onChange={handleInputChange} />
        
        <div className="grid grid-cols-2 gap-4">
          <input required name="city" type="text" placeholder="City" className="p-4 border rounded-2xl" onChange={handleInputChange} />
          <input required name="state" type="text" placeholder="State" className="p-4 border rounded-2xl" value={formData.state} onChange={handleInputChange} />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <input required name="date" type="date" className="p-4 border rounded-2xl" onChange={handleInputChange} />
          <input required name="startTime" type="time" className="p-4 border rounded-2xl" value={formData.startTime} onChange={handleInputChange} />
          <input required name="endTime" type="time" className="p-4 border rounded-2xl" value={formData.endTime} onChange={handleInputChange} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <select name="priceType" className="p-4 border rounded-2xl" value={formData.priceType} onChange={handleInputChange}>
            <option value="free">Free</option>
            <option value="paid">Paid</option>
          </select>
          {formData.priceType === 'paid' && (
            <input required name="price" type="number" placeholder="Price (₹)" className="p-4 border rounded-2xl" onChange={handleInputChange} />
          )}
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className={`w-full py-4 rounded-2xl font-black transition ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} text-white`}
        >
          {loading ? 'Publishing...' : 'Publish Event'}
        </button>
      </form>
    </div>
  );
};

export default AddEvent;