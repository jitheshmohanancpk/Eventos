import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AddEvent = () => {
  const navigate = useNavigate();
  const { token } = useAuth(); 
  
  const [formData, setFormData] = useState({
    title: '', description: '', date: '', startTime: '10:00', endTime: '13:00',
    city: '', state: 'Kerala', priceType: 'free', price: 0, image: '', tags: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanToken = token ? token.replace(/['"]+/g, '') : null;

    if (!cleanToken) {
      alert("Authentication error: Please log in again.");
      return;
    }

    const eventPayload = {
      title: formData.title,
      description: formData.description,
      categoryId: '65f1a2b3c4d5e6f7a8b9c0d1', // Ensure this ID exists in your DB
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      priceType: formData.priceType,
      price: formData.priceType === 'free' ? 0 : Number(formData.price),
      location: {
        address: "Default Address", // Added to satisfy schema requirement
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
        console.error("Backend Error:", result);
        alert(`Failed: ${result.message || "Invalid input"}`);
      }
    } catch (err) {
      console.error("Network Error:", err);
      alert("Server unreachable.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10 min-h-screen bg-white">
      <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-slate-500 mb-6">
        <ArrowLeft size={16} /> Back
      </button>

      <h1 className="text-3xl font-black mb-8">Create New Event</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-slate-50 p-8 rounded-3xl border border-slate-100">
        <input required type="text" placeholder="Event Title" className="w-full p-4 border rounded-2xl" onChange={(e) => setFormData({...formData, title: e.target.value})} />
        <input type="url" placeholder="Image URL" className="w-full p-4 border rounded-2xl" onChange={(e) => setFormData({...formData, image: e.target.value})} />
        <textarea required rows="3" placeholder="Description" className="w-full p-4 border rounded-2xl" onChange={(e) => setFormData({...formData, description: e.target.value})} />
        
        <div className="grid grid-cols-2 gap-4">
          <input required type="text" placeholder="City" className="p-4 border rounded-2xl" onChange={(e) => setFormData({...formData, city: e.target.value})} />
          <input required type="text" placeholder="State" className="p-4 border rounded-2xl" value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})} />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <input required type="date" className="p-4 border rounded-2xl" onChange={(e) => setFormData({...formData, date: e.target.value})} />
          <input required type="time" className="p-4 border rounded-2xl" value={formData.startTime} onChange={(e) => setFormData({...formData, startTime: e.target.value})} />
          <input required type="time" className="p-4 border rounded-2xl" value={formData.endTime} onChange={(e) => setFormData({...formData, endTime: e.target.value})} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <select className="p-4 border rounded-2xl" value={formData.priceType} onChange={(e) => setFormData({...formData, priceType: e.target.value})}>
            <option value="free">Free</option>
            <option value="paid">Paid</option>
          </select>
          {formData.priceType === 'paid' && (
            <input required type="number" placeholder="Price (₹)" className="p-4 border rounded-2xl" onChange={(e) => setFormData({...formData, price: e.target.value})} />
          )}
        </div>

        <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black hover:bg-indigo-700">
          Publish Event
        </button>
      </form>
    </div>
  );
};

export default AddEvent;