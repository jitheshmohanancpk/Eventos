import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Plus, Minus, Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ticketCount, setTicketCount] = useState(1);
  
  // Use the updated context methods
  const { wishlist, updateWishlist } = useWishlist();

  useEffect(() => {
    if (!id || id === 'undefined') {
      setLoading(false);
      return;
    }

    const fetchEvent = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/events/${id}`);
        setEvent(res.data.data); 
      } catch (err) {
        console.error("Error fetching event details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  // Integrated Toggle Logic using _id
  const handleToggleWishlist = (eventData) => {
    if (!eventData) return;
    
    let newList;
    const exists = wishlist.find(item => item._id === eventData._id);
    
    if (exists) {
      newList = wishlist.filter(item => item._id !== eventData._id);
    } else {
      newList = [...wishlist, eventData];
    }
    
    // Using the updateWishlist function ensures Navbar triggers re-render
    updateWishlist(newList); 
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-bold">Loading...</div>;

  if (!event) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-bold">Event not found!</h2>
        <Link to="/" className="text-indigo-600 underline font-bold">Go back to home</Link>
      </div>
    );
  }

  const isSaved = wishlist?.some(item => item?._id === event?._id);
  const unitPrice = event?.price || 0;
  const totalPrice = unitPrice * ticketCount;

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 font-bold">
          <ArrowLeft size={20} /> Back
        </button>
        
        <button 
          onClick={() => handleToggleWishlist(event)}
          className={`flex items-center gap-2 font-bold px-4 py-2 rounded-full border transition ${
            isSaved ? "bg-red-50 border-red-200 text-red-600" : "bg-gray-50 border-gray-100 text-gray-600"
          }`}
        >
          <Heart size={20} className={isSaved ? "fill-red-500" : ""} />
          {isSaved ? "Saved" : "Save Event"}
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <img src={event?.images?.[0]} className="w-full h-[450px] object-cover rounded-[40px] shadow-lg" alt={event?.title} />
          <h1 className="text-4xl font-black text-slate-900 mt-8 mb-4">{event?.title}</h1>
          <p className="text-gray-600 text-lg">{event?.description}</p>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 p-8 bg-slate-50 rounded-[35px] border border-slate-100 shadow-xl">
            <div className="flex justify-between items-center mb-6">
               <span className="text-slate-500 text-sm">Price per ticket</span>
               <span className="font-black text-slate-900">₹{unitPrice}</span>
            </div>

            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-100">
              <span className="font-bold">Quantity</span>
              <div className="flex items-center gap-4">
                <button onClick={() => setTicketCount(t => Math.max(1, t - 1))} className="p-2 bg-slate-100 rounded-lg"><Minus size={16}/></button>
                <span className="text-xl font-black">{ticketCount}</span>
                <button onClick={() => setTicketCount(t => t + 1)} className="p-2 bg-slate-100 rounded-lg"><Plus size={16}/></button>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-dashed border-slate-200">
              <div className="flex justify-between mb-6">
                <span className="font-black">Total Price</span>
                <span className="text-3xl font-black text-indigo-600">₹{totalPrice}</span>
              </div>
              <button 
                onClick={() => {
                  const bookingData = { eventTitle: event?.title, ticketNumber: ticketCount, totalRate: totalPrice };
                  localStorage.setItem('booking_data', JSON.stringify(bookingData));
                  navigate('/emailer', { state: bookingData });
                }} 
                className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black hover:bg-indigo-600 shadow-xl"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;