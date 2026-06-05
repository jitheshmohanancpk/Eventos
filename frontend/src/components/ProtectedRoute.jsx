import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, authenticated, loading } = useAuth();

  if (loading) return null; // Wait for auth to initialize

  // 1. If not logged in, send to home or login
  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  // 2. If a specific role is required, check if user has it
  if (allowedRole && user?.role?.toLowerCase() !== allowedRole.toLowerCase()) {
    return <Navigate to="/" replace />; // Deny access to unauthorized
  }

  return children;
};

export default ProtectedRoute;