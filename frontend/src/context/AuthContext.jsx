import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setToken(storedToken.replace(/['"]+/g, ''));
        setAuthenticated(true);
      } catch (e) { localStorage.clear(); }
    }
    setLoading(false);
  }, []);

  const login = (userData, userToken) => {
    // DEBUG: See if the role is actually arriving from your backend
    console.log("Logging in with user data:", userData); 
    
    const cleanToken = userToken?.replace(/['"]+/g, '');
    const newUser = { ...userData };
    
    localStorage.setItem('user', JSON.stringify(newUser));
    localStorage.setItem('token', cleanToken);
    
    setUser(newUser);
    setToken(cleanToken);
    setAuthenticated(true);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setToken(null);
    setAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, token, authenticated, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);