import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { User, Mail, Phone, Send, CheckCircle } from 'lucide-react';

const Booking = () => {
  const { id } = useParams(); // ഇവന്റ് ഐഡി ലഭിക്കാൻ
  const navigate = useNavigate();
  const form = useRef();
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();
    setLoading(true);

    // നിങ്ങളുടെ EmailJS വാല്യൂസ് ഇവിടെ നൽകുക
    emailjs.sendForm(
      'service_ajyktoh', 
      'service_t3zpyzf', 
      form.current, 
      'zxa-RvNNX1CmjQCsi'
    )
    .then((result) => {
        setIsSuccess(true);
        setLoading(false);
    }, (error) => {
        alert("Email sending failed. Please try again.");
        setLoading(false);
    });
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-white p-10 rounded-[40px] shadow-2xl text-center max-w-md w-full border border-green-100">
          <CheckCircle className="text-green-500 mx-auto mb-6" size={80} />
          <h2 className="text-3xl font-black text-slate-800 mb-2">Booking Confirmed!</h2>
          <p className="text-slate-500 mb-8">A confirmation mail has been sent to your email address.</p>
          <button onClick={() => navigate('/')} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold">Back to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-6">
      <div className="max-w-xl mx-auto bg-white rounded-[40px] shadow-2xl p-10 border border-gray-100">
        <h1 className="text-4xl font-black text-slate-900 mb-2">Book Your <span className="text-indigo-600">Spot</span></h1>
        <p className="text-slate-500 mb-10 font-medium">Please fill in your details to complete the registration.</p>

        <form ref={form} onSubmit={sendEmail} className="space-y-6">
          {/* Hidden input to pass event ID if needed in email */}
          <input type="hidden" name="event_id" value={id} />

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input type="text" name="user_name" required placeholder="John Doe" 
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input type="email" name="user_email" required placeholder="john@example.com" 
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input type="tel" name="user_phone" required placeholder="+91 98765 43210" 
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition" />
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-slate-800 transition shadow-xl disabled:opacity-50">
            {loading ? "Processing..." : <><Send size={22} /> Confirm Booking</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Booking;