import React from 'react';
import { Mail, Phone, MapPin, Send, Instagram, Twitter, Linkedin } from 'lucide-react';

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message Sent! We will get back to you soon.");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 1. Header Section */}
      <section className="bg-slate-900 py-20 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
          Get in <span className="text-indigo-400">Touch</span>
        </h1>
        <p className="text-slate-400 max-w-lg mx-auto font-medium">
          Have questions about an event or want to list your own? Our team is here to help you.
        </p>
      </section>

      {/* 2. Contact Content */}
      <section className="max-w-7xl mx-auto px-6 -mt-12 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white p-8 rounded-[32px] shadow-xl border border-gray-100 flex items-start gap-4">
              <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Email Us</h3>
                <p className="text-slate-500 text-sm">support@evento.com</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[32px] shadow-xl border border-gray-100 flex items-start gap-4">
              <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-600">
                <Phone size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Call Us</h3>
                <p className="text-slate-500 text-sm">+91 98765 43210</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[32px] shadow-xl border border-gray-100 flex items-start gap-4">
              <div className="bg-rose-50 p-3 rounded-2xl text-rose-600">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Office</h3>
                <p className="text-slate-500 text-sm">Infopark, Kochi, Kerala</p>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-slate-50 p-8 rounded-[32px] flex justify-around">
              <a href="#" className="text-slate-400 hover:text-indigo-600 transition"><Instagram /></a>
              <a href="#" className="text-slate-400 hover:text-indigo-600 transition"><Twitter /></a>
              <a href="#" className="text-slate-400 hover:text-indigo-600 transition"><Linkedin /></a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white p-8 md:p-12 rounded-[40px] shadow-2xl border border-gray-50">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="John Doe"
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-indigo-500 outline-none transition"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="john@example.com"
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-indigo-500 outline-none transition"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Subject</label>
                <select className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-indigo-500 outline-none transition appearance-none">
                  <option>General Inquiry</option>
                  <option>Event Listing Help</option>
                  <option>Ticketing Issue</option>
                  <option>Partnership</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Message</label>
                <textarea 
                  rows="5" 
                  placeholder="How can we help you?"
                  className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-indigo-500 outline-none transition resize-none"
                  required
                ></textarea>
              </div>

              <button 
                type="submit"
                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all hover:shadow-xl hover:shadow-indigo-200"
              >
                <Send size={20} /> Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;