import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'; 
import './index.css';

// Context Providers
import { AuthProvider, useAuth } from './context/AuthContext'; 
import { WishlistProvider } from './context/WishlistContext'; // Ensure this is renamed to .jsx

import App from './App';

// Import all your pages
import Home from "./pages/Home";
import EventDetails from "./pages/EventDetails";
import Venues from "./pages/Venues";
import Organizers from "./pages/Organizers";
import OrganizerDashboard from './pages/Organizer/OrganizerDashboard';
import AddEvent from './pages/Organizer/AddEvent';
import EditEvent from './pages/Organizer/EditEvent';
import SavedEvents from './pages/SavedEvents';

import ProtectedRoute from './components/ProtectedRoute';

// Simple Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { authenticated } = useAuth();
  return authenticated ? children : <Navigate to="/" replace />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, 
    children: [
      { index: true, element: <Home /> },
      { path: "event/:id", element: <EventDetails /> },
      { path: "venues", element: <Venues /> },
      { path: "organizers", element: <Organizers /> },
      { path: "saved-events", element: <SavedEvents /> },
      { 
        path: "dashboard", 
        element: <ProtectedRoute><OrganizerDashboard /></ProtectedRoute> 
      },
      { 
        path: "add-event", 
        element: <ProtectedRoute><AddEvent /></ProtectedRoute> 
      },
      { 
        path: "edit-event/:id", 
        element: <ProtectedRoute><EditEvent /></ProtectedRoute> 
      }

      
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
       {/* Wrapping the router here is mandatory */}
        <RouterProvider router={router} />     
    </AuthProvider>
  </React.StrictMode>
);