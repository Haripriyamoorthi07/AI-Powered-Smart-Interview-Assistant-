import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Mic, History, FileText, UserCog, ShieldCheck } from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();

  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/interview/setup', label: 'Mock Interview', icon: Mic },
    { to: '/resume', label: 'Resume Analyzer', icon: FileText },
    { to: '/profile', label: 'Profile Settings', icon: UserCog },
  ];

  if (user && user.role === 'admin') {
    links.push({ to: '/admin', label: 'Admin Panel', icon: ShieldCheck });
  }

  return (
    <aside className="w-full md:w-64 glass md:h-[calc(100vh-69px)] border-b md:border-r border-slate-200/20 p-4 flex md:flex-col gap-2 overflow-x-auto md:overflow-x-visible md:overflow-y-auto shrink-0 shadow-lg shadow-brand-900/5">
      <div className="hidden md:block px-3 py-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
        NAVIGATION
      </div>
      <div className="flex md:flex-col gap-1 w-full shrink-0">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-brand-500 to-accent-500 text-white shadow-lg shadow-brand-500/20'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-brand-800/60'
                }`
              }
            >
              <Icon size={18} />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;
