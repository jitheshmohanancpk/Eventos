import React from 'react';
import { Target, Sparkles, Map, ShieldCheck, Mail,} from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: <Sparkles className="text-indigo-600" />,
      title: "Recommendations",
      desc: "Our smart engine learns your interests to suggest workshops and meetups you'll actually love."
    },
    {
      icon: <Map className="text-indigo-600" />,
      title: "Location Aware",
      desc: "Find events exactly where you are, we've got the city covered."
    },
    {
      icon: <ShieldCheck className="text-indigo-600" />,
      title: "Verified Organizers",
      desc: "Every workshop and meetup is vetted to ensure a high-quality experience for all attendees."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* 1. Header Section */}
      <section className="bg-slate-50 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tighter">
            Connecting People through <br />
            <span className="text-indigo-600">Shared Experiences.</span>
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            Evento is more than just a listing site. It's a community-driven platform 
            designed to help you discover hidden gems, learn new skills, and meet 
            like-minded people in your city.
          </p>
        </div>
      </section>

      {/* 2. Mission & Features */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((f, i) => (
            <div key={i} className="p-8 rounded-[32px] border border-gray-100 bg-white hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6">
                {f.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">{f.title}</h3>
              <p className="text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Contact / Footer-like Section */}
      <section className="max-w-5xl mx-auto px-6 py-20 border-t border-gray-100">
        <div className="bg-slate-900 rounded-[40px] p-12 text-center text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4">Have a Question?</h2>
            <p className="text-slate-400 mb-10">We'd love to hear from you. Get in touch with our team.</p>
            
            <div className="flex flex-wrap justify-center gap-6">
              <a href="#" className="flex items-center gap-2 bg-white/10 px-6 py-3 rounded-full hover:bg-white/20 transition">
                <Mail size={18} /> hello@evento.com
              </a>
              {/* <a href="#" className="flex items-center gap-2 bg-white/10 px-6 py-3 rounded-full hover:bg-white/20 transition">
                <Github size={18} /> GitHub
              </a> */}
              {/* <a href="#" className="flex items-center gap-2 bg-white/10 px-6 py-3 rounded-full hover:bg-white/20 transition">
                <Twitter size={18} /> Twitter
              </a> */}
            </div>
          </div>
          {/* Decorative background circle */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl"></div>
        </div>
      </section>
    </div>
  );
};

export default About;