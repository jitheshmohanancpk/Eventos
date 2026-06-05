import React, { useState } from 'react';
import { Save, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '9876543210'
  });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-white py-12 px-6">
      <div className="max-w-xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 font-bold mb-8 hover:text-indigo-600">
          <ChevronLeft size={20} /> Back to Profile
        </button>

        <h1 className="text-3xl font-black text-slate-900 mb-8">Edit Settings</h1>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-600 uppercase tracking-wider">Public Name</label>
            <input 
              name="name"
              value={profile.name}
              onChange={handleChange}
              className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-600 outline-none font-bold text-slate-800"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-600 uppercase tracking-wider">Email Address</label>
            <input 
              name="email"
              value={profile.email}
              onChange={handleChange}
              className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-600 outline-none font-bold text-slate-800"
            />
          </div>

          <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition">
            <Save size={20} /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;