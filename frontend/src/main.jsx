import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom'; 
import './index.css';

// Context Providers
import { AuthProvider, useAuth } from './context/AuthContext'; 
import { WishlistProvider } from './context/WishlistContext';

// Components & Layouts
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import EventDetails from "./pages/EventDetails";
import About from './pages/About';
import Gallery from './pages/Gallery';
import Organizers from './pages/Organizers';
import Contact from './pages/Contact';
import Events from './sections/Events';
import Venues from './pages/Venues';
import VenueDetails from './pages/VenueDetails';
import Booking from './pages/Booking';
import SignUp from './pages/SignUp';
import EditProfile from './pages/EditProfile';
import Login from './pages/Login';
import SavedEvents from './pages/SavedEvents';
import OrganizersDetails from "./pages/OrganizersDetails";
import Emailer from './pages/Emailer';
import BookingSuccess from './pages/BookingSuccess';
import OrganizerDashboard from './pages/Organizer/OrganizerDashboard';
import AddEvent from './pages/Organizer/AddEvent';
import EditEvent from "./pages/Organizer/EditEvent";

const ProtectedRoute = ({ children, allowedRole }) => {
  const { authenticated, loading, user } = useAuth();
  
  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (!authenticated) return <Navigate to="/login" replace />;
  if (allowedRole && user?.role?.toLowerCase() !== allowedRole.toLowerCase()) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const RootLayout = () => (
  <div className="min-h-screen flex flex-col bg-white">
    <Navbar />
    <main className="flex-grow">
      <Outlet /> 
    </main>
    <Footer />
  </div>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "event/:id", element: <EventDetails /> },
      { path: "about", element: <About /> },
      { path: "gallery", element: <Gallery /> },
      { path: "organizers", element: <Organizers /> },
      { path: "contact", element: <Contact /> },
      { path: "events", element: <Events /> },
      { path: "venues", element: <Venues /> },
      { path: "venue/:id", element: <VenueDetails /> },
      { path: "booking/:id", element: <Booking /> },
      { path: "editprofile", element: <EditProfile /> },
      { path: "signup", element: <SignUp /> },
      { path: "login", element: <Login /> },
      { path: "saved-events", element: <SavedEvents /> },
      { path: "organizer/:id", element: <OrganizersDetails /> },
      { path: "emailer", element: <Emailer /> },
      { path: "booking-success", element: <BookingSuccess /> },
      { path: "dashboard", element: <ProtectedRoute allowedRole="organizer"><OrganizerDashboard /></ProtectedRoute> },
      { path: "add-event", element: <ProtectedRoute allowedRole="organizer"><AddEvent /></ProtectedRoute> },
      { path: "edit-event/:id", element: <ProtectedRoute allowedRole="organizer"><EditEvent /></ProtectedRoute> }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <WishlistProvider>
        <RouterProvider router={router} />
      </WishlistProvider>
    </AuthProvider>
  </React.StrictMode>
);