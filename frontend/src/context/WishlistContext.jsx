import React, { createContext, useState, useContext, useEffect } from 'react';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('savedEvents');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to parse wishlist from localStorage", e);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('savedEvents', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (event) => {
    if (!event || !event._id) return; // Guard clause
    
    setWishlist((prev) => {
      const exists = prev.find((item) => item._id === event._id);
      if (exists) {
        // Remove item if it exists
        return prev.filter((item) => item._id !== event._id);
      }
      // Add item only if it doesn't exist
      return [...prev, event];
    });
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};