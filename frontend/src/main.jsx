import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'; 
import './index.css';

// Context Providers
import { AuthProvider } from './context/AuthContext'; 
import { WishlistProvider } from './context/WishlistContext';

// Components & Layouts
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from "./pages/Home";
import EventDetails from "./pages/eventDetails";
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

// Organizer Pages
import OrganizerDashboard from './pages/Organizer/OrganizerDashboard';
import AddEvent from './pages/Organizer/AddEvent';
import EditEvent from "./pages/Organizer/EditEvent";

// Admin Pages
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminOrganizers from './pages/Admin/AdminOrganizers';

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
      
      // Protected Booking Route
      { 
        path: "booking/:id", 
        element: <ProtectedRoute><Booking /></ProtectedRoute> 
      },
      
      { path: "editprofile", element: <EditProfile /> },
      { path: "signup", element: <SignUp /> },
      { path: "login", element: <Login /> },
      { path: "saved-events", element: <SavedEvents /> },
      { path: "organizer/:id", element: <OrganizersDetails /> },
      { path: "emailer", element: <Emailer /> },
      { path: "booking-success", element: <BookingSuccess /> },
      
      // Organizer Routes
      { path: "dashboard", element: <ProtectedRoute allowedRole="organizer"><OrganizerDashboard /></ProtectedRoute> },
      { path: "add-event", element: <ProtectedRoute allowedRole="organizer"><AddEvent /></ProtectedRoute> },
      { path: "edit-event/:id", element: <ProtectedRoute allowedRole="organizer"><EditEvent /></ProtectedRoute> },

      // Admin Routes
      { 
        path: "admin/dashboard", 
        element: <ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute> 
      },
      { 
        path: "admin/organizers", 
        element: <ProtectedRoute allowedRole="admin"><AdminOrganizers /></ProtectedRoute> 
      }
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

