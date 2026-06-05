import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Linkedin, Github, Mail, Send, Sparkles } from 'lucide-react';


const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white pt-20 pb-10 px-6 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* 1. Newsletter Section */}
        <div className="bg-indigo-600 rounded-[40px] p-8 md:p-12 mb-20 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-black mb-2">Stay with Evento!</h2>
            <p className="text-indigo-100 font-medium">Get the latest event updates directly in your inbox.</p>
          </div>
          {/* <div className="w-full md:w-auto flex items-center bg-white/10 p-2 rounded-2xl backdrop-blur-md relative z-10">
            <input 
              type="email" 
              placeholder="yourname@mail.com" 
              className="bg-transparent border-none outline-none px-4 py-2 text-white placeholder:text-indigo-200 w-full md:w-64"
            />
            <button className="bg-white text-indigo-600 p-3 rounded-xl hover:bg-indigo-50 transition shadow-lg">
              <Send size={20} />
            </button>
          </div> */}
          {/* Decorative Circle */}
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        {/* 2. Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="text-2xl font-black tracking-tighter flex items-center gap-2 mb-6">
              {/* <div className="bg-indigo-500 p-1.5 rounded-lg">
                <Sparkles size={20} className="text-white" />
              </div> */}
              EVENTO
            </Link>
            <p className="text-slate-400 leading-relaxed mb-6 font-medium">
              Discover, experience, and connect with the most happening events in your city. 
              Powered by AI for smarter recommendations.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-slate-800 rounded-xl hover:bg-indigo-500 transition-all text-slate-300 hover:text-white"><Instagram size={20} /></a>
              <a href="#" className="p-2 bg-slate-800 rounded-xl hover:bg-indigo-500 transition-all text-slate-300 hover:text-white"><Twitter size={20} /></a>
              <a href="#" className="p-2 bg-slate-800 rounded-xl hover:bg-indigo-500 transition-all text-slate-300 hover:text-white"><Linkedin size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-6">Platform</h3>
            <ul className="space-y-4 font-bold text-slate-300">
              <li><Link to="/Events" className="hover:text-indigo-400 transition">Events</Link></li>
              <li><Link to="/Organizers" className="hover:text-indigo-400 transition">Organizers</Link></li>
              <li><Link to="/Venues" className="hover:text-indigo-400 transition">Venues</Link></li>
              <li><Link to="/Gallery" className="hover:text-indigo-400 transition">Gallery</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-6">Company</h3>
            <ul className="space-y-4 font-bold text-slate-300">
              <li><Link to="/About" className="hover:text-indigo-400 transition">About Us</Link></li>
              <li><Link to="/Contact" className="hover:text-indigo-400 transition">Contact</Link></li>
              {/* <li><Link to="/careers" className="hover:text-indigo-400 transition">Careers</Link></li>
              <li><Link to="/privacy" className="hover:text-indigo-400 transition">Privacy Policy</Link></li> */}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-6">Get Help</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="text-indigo-500 shrink-0" size={20} />
                <span className="text-slate-300 font-bold">hello@evento.com</span>
              </div>
              <p className="text-slate-500 text-sm font-medium">
                Got a question? We are available Mon-Fri, 9am - 6pm.
              </p>
            </div>
          </div>
        </div>

        {/* 3. Bottom Bar */}
        <div className="pt-10 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-sm font-bold">
          <p>© 2026 EVENTO. All rights reserved.</p>
          {/* <div className="flex gap-6">
            <a href="#" className="hover:text-white transition">Terms</a>
            <a href="#" className="hover:text-white transition">Cookies</a>
            <a href="#" className="hover:text-white transition">Security</a>
          </div> */}
        </div>

      </div>
    </footer>
  );
};

export default Footer;