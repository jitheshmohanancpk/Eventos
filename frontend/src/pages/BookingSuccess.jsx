import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, MapPin, Calendar, User, Phone, Ticket, QrCode, Download, Home } from 'lucide-react';

const BookingSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // മുമ്പത്തെ പേജിൽ നിന്ന് വരുന്ന ഡാറ്റ
  const { eventTitle, ticketNumber, totalRate, fullName, phone, email } = location.state || {};
  

  if (!fullName) return <div className="p-20 text-center">No Booking Found!</div>;

  return (
    <div className="min-h-screen bg-slate-100 py-12 px-6 flex flex-col items-center">
      
      {/* Success Header */}
      <div className="text-center mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="bg-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600">
          <CheckCircle size={40} />
        </div>
        <h1 className="text-3xl font-black text-slate-900">Booking Confirmed!</h1>
        <p className="text-slate-500 font-medium">Your digital ticket is ready.</p>
      </div>

      {/* --- THE DIGITAL TICKET CARD --- */}
      <div className="w-full max-w-md bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gray-100 relative">
        
        {/* Ticket Top: Event Info */}
        <div className="bg-indigo-600 p-8 text-white relative">
          <div className="absolute top-0 right-0 p-6 opacity-20">
            <Ticket size={80} rotate={45} />
          </div>
          <h2 className="text-sm font-black uppercase tracking-widest opacity-80 mb-1">Admission Ticket</h2>
          <h3 className="text-2xl font-black leading-tight">{eventTitle}</h3>
        </div>

        {/* Ticket Middle: User & Seat Info */}
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Attendee</p>
              <p className="font-bold text-slate-800 truncate">{fullName}</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Phone</p>
              <p className="font-bold text-slate-800">{phone}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-50">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Tickets</p>
              <p className="text-lg font-black text-indigo-600">{ticketNumber} Seats</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Seat Numbers</p>
              <p className="font-bold text-slate-800">
                {/* ഒരു സാമ്പിൾ സീറ്റ് നമ്പർ ജനറേഷൻ */}
                {Array.from({ length: ticketNumber }).map((_, i) => `A${10 + i}`).join(', ')}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-50 flex items-center gap-3">
            <MapPin size={16} className="text-indigo-500" />
            <p className="text-sm font-bold text-slate-600">Grand Arena, Kochi, Kerala</p>
          </div>
        </div>

        {/* Ticket Divider (The Cut line) */}
        <div className="flex items-center px-4">
          <div className="w-6 h-6 bg-slate-100 rounded-full -ml-7"></div>
          <div className="flex-1 border-t-2 border-dashed border-slate-200 mx-2"></div>
          <div className="w-6 h-6 bg-slate-100 rounded-full -mr-7"></div>
        </div>

        {/* Ticket Bottom: QR Code Scan Section */}
        <div className="p-8 bg-slate-50 flex flex-col items-center justify-center text-center">
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-200 mb-4">
            <QrCode size={100} className="text-slate-900" />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Scan at Venue</p>
          <p className="text-[11px] font-bold text-slate-500">Booking ID: EVT-{Math.floor(Math.random() * 900000 + 100000)}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-10 w-full max-w-md">
        <button 
          onClick={() => window.print()}
          className="flex-1 bg-white text-slate-900 py-4 rounded-2xl font-black flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 transition-all shadow-sm"
        >
          <Download size={20} /> Save PDF
        </button>
        <button 
          onClick={() => navigate('/')}
          className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all shadow-xl"
        >
          <Home size={20} /> Home
        </button>
      </div>

    </div>
  );
};

export default BookingSuccess;