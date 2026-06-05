import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Mail, Globe, MapPin, Calendar, ArrowLeft, CheckCircle, ShieldCheck } from 'lucide-react';

const OrganizerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Organizers.jsx-ൽ ഉള്ള അതേ ഡാറ്റ ഇവിടെയും നൽകുന്നു (Import error ഒഴിവാക്കാൻ)
  const allOrganizers = [
    {
      id: 1,
      name: "Tech-Kerala Community",
      type: "Tech Hub",
      location: "Kochi, Kerala",
      eventsHosted: 12,
      bio: "A community of developers and innovators focused on AI, Web3, and future technologies.",
      image: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80",
      verified: true
    },
    {
      id: 2,
      name: "Artbeat Productions",
      type: "Music & Art",
      location: "Bengaluru, Karnataka",
      eventsHosted: 45,
      bio: "Bringing independent artists to the spotlight through soulful acoustic nights and galleries.",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80",
      verified: true
    },
    {
      id: 3,
      name: "Linkin Park Productions",
      type: "Concerts",
      location: "Global / Mumbai",
      eventsHosted: 8,
      bio: "Specializing in large-scale international music tours and high-energy rock concerts.",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Linkin_Park_logo_2024.svg/960px-Linkin_Park_logo_2024.svg.png",
      verified: false
    },
    {
      id: 4,
      name: "Velocity Sports Management",
      type: "Sports",
      location: "Mumbai, Maharashtra",
      eventsHosted: 85,
      bio: "Organizing city-wide marathons and professional turf tournaments.",
      image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=400",
      verified: true
    },
    {
        id: 5,
        name: "Green Root Workshops",
        type: "Workshop",
        location: "Pune, Maharashtra",
        eventsHosted: 32,
        bio: "Sustainable living workshops ranging from organic gardening to upcycling.",
        image: "https://images.unsplash.com/photo-1459156212016-c812468e2115?q=80&w=400",
        verified: false
    }
    // നിങ്ങൾക്ക് ആവശ്യമായ കൂടുതൽ ഡാറ്റ ഇവിടെ ചേർക്കാം...
  ];

  // URL-ലെ ID വെച്ച് കൃത്യമായ ഓർഗനൈസറെ കണ്ടുപിടിക്കുന്നു
  const organizer = allOrganizers.find(org => org.id === parseInt(id));

  // ഓർഗനൈസറെ കണ്ടുപിടിക്കാൻ കഴിഞ്ഞില്ലെങ്കിൽ
  if (!organizer) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50">
        <h2 className="text-2xl font-black text-slate-800">Organizer Not Found!</h2>
        <p className="text-slate-500 mb-6">The organizer you are looking for doesn't exist.</p>
        <button 
          onClick={() => navigate('/Organizers')} 
          className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-indigo-700 transition-all"
        >
          Back to Organizers
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header/Cover Section */}
      <div className="relative h-[300px] w-full bg-slate-900">
        <img 
          src={organizer.image} 
          className="w-full h-full object-cover opacity-40 blur-sm" 
          alt="Cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50/50"></div>
        <button 
          onClick={() => navigate(-1)} 
          className="absolute top-8 left-8 bg-white p-3 rounded-full shadow-xl hover:scale-110 transition-transform z-20"
        >
          <ArrowLeft size={20} className="text-slate-900" />
        </button>
      </div>

      {/* Profile Card Section */}
      <div className="max-w-4xl mx-auto px-6 -mt-24 relative z-10">
        <div className="bg-white rounded-[40px] p-10 shadow-2xl border border-white/20 flex flex-col items-center text-center">
          {/* Profile Image */}
          <div className="relative">
            <img 
              src={organizer.image} 
              className="w-40 h-40 rounded-[35px] border-8 border-white shadow-xl object-cover mb-6" 
              alt={organizer.name} 
            />
            {organizer.verified && (
              <div className="absolute bottom-8 right-2 bg-blue-500 text-white p-2 rounded-full border-4 border-white">
                <ShieldCheck size={20} fill="currentColor" />
              </div>
            )}
          </div>
          
          <p className="text-indigo-600 font-black uppercase tracking-widest text-sm mb-2">
            {organizer.type}
          </p>
          
          <h1 className="text-4xl font-black text-slate-900 mb-4">{organizer.name}</h1>
          
          <p className="text-slate-500 text-lg leading-relaxed max-w-2xl mb-10">
            {organizer.bio || "This organizer is a key partner of Evento, bringing high-quality experiences to the community."}
          </p>

          {/* Stats & Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full border-t border-slate-100 pt-10">
            <div className="flex flex-col items-center p-4 rounded-3xl bg-slate-50">
              <MapPin className="text-indigo-600 mb-3" size={28} />
              <span className="text-xs font-black text-slate-400 uppercase tracking-tighter mb-1">Location</span>
              <span className="font-bold text-slate-800">{organizer.location}</span>
            </div>
            
            <div className="flex flex-col items-center p-4 rounded-3xl bg-slate-50">
              <Calendar className="text-indigo-600 mb-3" size={28} />
              <span className="text-xs font-black text-slate-400 uppercase tracking-tighter mb-1">Events Hosted</span>
              <span className="font-bold text-slate-800">{organizer.eventsHosted} Successful Events</span>
            </div>

            <div className="flex flex-col items-center p-4 rounded-3xl bg-slate-50">
              <Mail className="text-indigo-600 mb-3" size={28} />
              <span className="text-xs font-black text-slate-400 uppercase tracking-tighter mb-1">Contact</span>
              <span className="font-bold text-slate-800 text-sm truncate w-full px-2">
                contact@{organizer.name.toLowerCase().split(' ')[0]}.com
              </span>
            </div>
          </div>

          {/* Action Button */}
          <button className="mt-12 w-full md:w-auto bg-slate-900 text-white px-12 py-4 rounded-2xl font-black hover:bg-indigo-600 transition-all shadow-xl flex items-center justify-center gap-3">
            Contact Organizer <Globe size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrganizerDetails;