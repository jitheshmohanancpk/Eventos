import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext"; 
import { 
  User, Building2, Mail, Phone, MapPin, 
  Camera, Ticket, CheckCircle, ArrowLeft, Loader2
} from 'lucide-react';

const SignUp = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); 
  
  const [userType, setUserType] = useState('user'); 
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [currentEventName, setCurrentEventName] = useState('');
  const [eventLocation, setEventLocation] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    setLoading(true);

    // Prepare FormData
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('role', userType);
    formData.append('phone', phone);

    if (userType === 'organizer') {
      formData.append('name', companyName);
      formData.append('companyName', companyName);
      formData.append('currentEventName', currentEventName);
      formData.append('eventLocation', eventLocation);
      
      const fileInput = document.getElementById('logo-upload');
      if (fileInput?.files[0]) {
        formData.append('logo', fileInput.files[0]);
      }
    } else {
      formData.append('name', name);
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        body: formData, // Browser sets multipart/form-data boundary automatically
      });

      const result = await response.json();

      if (response.ok) {
        if (result.token) login(result, result.token);
        setShowSuccess(true);
      } else {
        setError(result.message || 'Registration failed.');
      }
    } catch (err) {
      console.error("SignUp Error:", err);
      setError('Cannot connect to the server. Check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6 flex items-center justify-center relative">
      <button onClick={() => navigate('/')} className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 font-bold hover:text-indigo-600 transition">
        <ArrowLeft size={20} /> Back
      </button>

      <div className="max-w-2xl w-full bg-white rounded-[40px] shadow-2xl pt-10 mt-10 p-10">
        <div className="flex bg-slate-100 p-2 mb-8 rounded-2xl">
          <button onClick={() => setUserType('user')} className={`flex-1 py-3 rounded-xl font-bold transition ${userType === 'user' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500'}`}>Attendee</button>
          <button onClick={() => setUserType('organizer')} className={`flex-1 py-3 rounded-xl font-bold transition ${userType === 'organizer' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500'}`}>Organizer</button>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-4 rounded-2xl font-bold text-sm mb-5">⚠️ {error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-5">
            <input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl outline-none" />
            <input required type="tel" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl outline-none" />
          </div>
          
          <div className="grid grid-cols-2 gap-5">
            <input required type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl outline-none" />
            <input required type="password" placeholder="Confirm" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl outline-none" />
          </div>

          {userType === 'user' ? (
            <input required type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl outline-none" />
          ) : (
            <div className="space-y-5">
              <input required type="text" placeholder="Company Name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl outline-none" />
              <input required type="text" placeholder="Event Name" value={currentEventName} onChange={(e) => setCurrentEventName(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl outline-none" />
              <input required type="text" placeholder="Location" value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl outline-none" />
              <div className="flex items-center gap-4 border-2 border-dashed border-slate-200 p-4 rounded-2xl">
                <Camera className="text-slate-400" />
                <input type="file" id="logo-upload" accept="image/*" className="text-slate-500 w-full" />
              </div>
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black hover:bg-indigo-600 transition">
            {loading ? <Loader2 className="animate-spin mx-auto" /> : "Create Account"}
          </button>
        </form>
      </div>

      {showSuccess && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-[40px] p-10 text-center w-full max-w-sm">
            <CheckCircle size={48} className="text-green-500 mx-auto mb-6" />
            <h3 className="text-3xl font-black mb-4">All Set!</h3>
            {/* <button onClick={() => navigate(userType === 'organizer' ? '/OrganizerDashboard' : '/')} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black">Let's Go!</button> */}

<button 
  onClick={() => navigate(userType === 'organizer' ? '/dashboard' : '/')} 
  className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black"
>
  Let's Go!
</button>

          </div>
        </div>
      )}
    </div>
  );
};

export default SignUp;