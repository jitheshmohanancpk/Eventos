import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Calendar, Users, LogOut } from 'lucide-react';

const Sidebar = () => {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const navItems = [
    { path: '/admin/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/admin/events', icon: <Calendar size={20} />, label: 'Events' },
    { path: '/admin/organizers', icon: <Users size={20} />, label: 'Organizers' },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen p-6 flex flex-col">
      <h2 className="text-xl font-bold mb-8 text-blue-400">Admin Portal</h2>
      
      <nav className="space-y-2 flex-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded transition ${
                isActive ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-gray-300'
              }`
            }
          >
            {item.icon} {item.label}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 p-3 text-red-400 hover:bg-slate-800 rounded transition mt-auto"
      >
        <LogOut size={20} /> Logout
      </button>
    </aside>
  );
};

export default Sidebar;