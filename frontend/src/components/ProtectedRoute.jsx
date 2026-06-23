import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { authenticated, loading, user } = useAuth();
  const location = useLocation();
  
  // Debugging log: Remains as requested
  console.log("ProtectedRoute Status:", { 
    authenticated, 
    loading, 
    userRole: user?.role, 
    expectedRole: allowedRole 
  });

  // 1. Still fetching user info: Show loader to prevent 'flicker' redirects
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg animate-pulse">Verifying authentication...</p>
      </div>
    );
  }

  // 2. Not logged in: Redirect to login and store the current path
  if (!authenticated) {
    console.warn("Unauthorized: Redirecting to login");
    // Prevent redirecting if we are already on the login page to avoid loops
    if (location.pathname === '/login') return children;
    
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // 3. Logged in, but wrong role: Redirect to home (or unauthorized page)
  if (allowedRole && user?.role?.toLowerCase() !== allowedRole.toLowerCase()) {
    console.error(`Access Denied: You are a '${user?.role}', but '${allowedRole}' is required.`);
    return <Navigate to="/" replace />;
  }
  
  // 4. Authorized: Render protected component
  return children;
};

export default ProtectedRoute;