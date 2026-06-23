import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Added useLocation
import { useAuth } from "../context/AuthContext";
import { Loader2 } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get the location object
  const { login } = useAuth(); 
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Determine where to go after successful login
  const from = location.state?.from?.pathname || null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    try {
      if (!showOtpInput) {
        // STEP 1: Request OTP
        const response = await fetch(`${BASE_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const result = await response.json();
        if (response.ok) {
          setShowOtpInput(true);
        } else {
          setError(result.message || 'Login failed');
        }
      } else {
        // STEP 2: Verify OTP
        const response = await fetch(`${BASE_URL}/api/auth/verify-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, otp }),
        });
        const result = await response.json();

        if (response.ok && result.token) {
          localStorage.setItem("token", result.token);
          login(result.user, result.token);
          
          // UPDATED REDIRECT LOGIC
          if (from) {
            // If they were trying to go somewhere, send them back there
            navigate(from, { replace: true });
          } else {
            // Otherwise, default to role-based dashboard
            const role = result.user?.role?.toLowerCase();
            navigate(role === 'admin' ? '/admin/dashboard' : role === 'organizer' ? '/dashboard' : '/');
          }
        } else {
          setError(result.message || 'Invalid OTP');
        }
      }
    } catch (err) {
      setError('Server connection error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6 py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl border shadow-xl">
        <h1 className="text-3xl font-black mb-8 text-center">{showOtpInput ? "Verify OTP" : "Welcome Back"}</h1>
        
        {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6">{error}</div>}

        <form onSubmit={handleLoginSubmit} className="space-y-5">
          {!showOtpInput ? (
            <>
              <input type="email" placeholder="Email" className="w-full p-4 bg-slate-50 border rounded-2xl" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <input type="password" placeholder="Password" className="w-full p-4 bg-slate-50 border rounded-2xl" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </>
          ) : (
            <input type="text" placeholder="Enter 6-digit OTP" className="w-full p-4 bg-slate-50 border rounded-2xl text-center tracking-widest text-xl" value={otp} onChange={(e) => setOtp(e.target.value)} required maxLength={6} />
          )}

          <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black">
            {loading ? <Loader2 className="animate-spin mx-auto" /> : (showOtpInput ? "Verify & Sign In" : "Send OTP")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;