// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'; 
// import './index.css';

// Context Providers
// import { AuthProvider } from './context/AuthContext'; 
// import { WishlistProvider } from './context/WishlistContext'; 

// import App from './App';

// Import all your pages
// import Home from "./pages/Home";
// import EventDetails from "./pages/EventDetails";
// import Venues from "./pages/Venues";
// import Organizers from "./pages/Organizers";
// import OrganizerDashboard from './pages/Organizer/OrganizerDashboard';
// import AddEvent from './pages/Organizer/AddEvent';
// import EditEvent from './pages/Organizer/EditEvent';
// import SavedEvents from './pages/SavedEvents';


// import ProtectedRoute from './components/ProtectedRoute';

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <App />, 
//     children: [
//       { index: true, element: <Home /> },
//       { path: "event/:id", element: <EventDetails /> },
//       { path: "venues", element: <Venues /> },
//       { path: "organizers", element: <Organizers /> },
//       { path: "saved-events", element: <SavedEvents /> },
//       { 
//         path: "dashboard", 
//         element: <ProtectedRoute><OrganizerDashboard /></ProtectedRoute> 
//       },
//       { 
//         path: "add-event", 
//         element: <ProtectedRoute><AddEvent /></ProtectedRoute> 
//       },
//       { 
//         path: "edit-event/:id", 
//         element: <ProtectedRoute><EditEvent /></ProtectedRoute> 
//       }
//     ],
//   },
// ]);

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <AuthProvider>
//       {}
//       <WishlistProvider>
//         <RouterProvider router={router} />    
//       </WishlistProvider>
//     </AuthProvider>
//   </React.StrictMode>
// );

// App.jsx
export default function App() {
  return (
    <div style={{ padding: '50px', fontSize: '24px', color: 'red' }}>
      <h1>If you see this, your App.jsx is working!</h1>
    </div>
  );
}