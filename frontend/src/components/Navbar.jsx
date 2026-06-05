import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const { user, logout, authenticated } = useAuth();
  const { wishlist } = useWishlist(); 

  // Direct reference for the wish count
  const wishCount = wishlist.length;
  
  const [displayName, setDisplayName] = useState('User');
  const [isOrganizer, setIsOrganizer] = useState(false);

  // Sync User Data & Role
  useEffect(() => {
    setDisplayName(user?.name ? user.name.split(' ')[0] : 'User');
    setIsOrganizer(user?.role?.toLowerCase() === 'organizer');
  }, [user]);

  const getInitials = (name, email) => {
    if (name) return name.charAt(0).toUpperCase();
    if (email) return email.charAt(0).toUpperCase();
    return 'U';
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: 'EVENTS', path: '/events' },
    { name: 'VENUES', path: '/venues' },
    { name: 'ORGANIZERS', path: '/organizers' },
    { name: 'ABOUT', path: '/about' },
    { name: 'GALLERY', path: '/gallery' },
    { name: 'CONTACT', path: '/contact' },
  ];

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-[100] backdrop-blur-md bg-white/90">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        <Link to="/" className="text-3xl font-black text-slate-800 tracking-tighter italic">EVENTO.</Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8 font-bold text-[13px]">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path} 
              className={isActive(link.path) ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'}
            >
              {link.name}
            </Link>
          ))}
          
          <Link to="/saved-events" className="text-slate-600 hover:text-indigo-600 flex items-center gap-1">
            <Heart size={18} className={wishCount > 0 ? "fill-red-500 text-red-500" : ""} />
            SAVED {wishCount > 0 ? `(${wishCount})` : ""}
          </Link>
          
          <div className="border-l pl-8 border-gray-100 flex items-center gap-4">
            {authenticated && user ? (
              <div className="flex items-center gap-4">
                <span className="text-slate-800 font-bold hidden xl:block">Hi, {displayName}</span>

                {isOrganizer && (
                  <Link 
                    to="/dashboard" 
                    className={isActive('/dashboard') ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'}
                  >
                    DASHBOARD
                  </Link>
                )}

                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-black text-xs shadow-md">
                  {getInitials(user?.name, user?.email)}
                </div>
                <button onClick={logout} className="text-slate-600 hover:text-red-600">LOGOUT</button>
              </div>
            ) : (
              <>
                <button onClick={() => navigate('/login')} className="text-slate-600 hover:text-indigo-600">LOGIN</button>
                <Link to="/signup" className="bg-slate-900 text-white px-6 py-2.5 rounded-full hover:bg-indigo-600">SIGN-UP</Link>
              </>
            )}
          </div>
        </div>

        <button className="lg:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;