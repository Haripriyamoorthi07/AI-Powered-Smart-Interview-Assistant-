import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, LogOut, User, Menu, X, Brain } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <nav className="glass sticky top-0 z-50 px-4 py-3 md:px-8 flex items-center justify-between transition-colors duration-200 border-b border-slate-200/20 shadow-lg shadow-brand-900/5">
      <Link to="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
        <div className="p-2 bg-gradient-to-tr from-brand-500 to-accent-500 rounded-xl shadow-md text-white shadow-brand-500/20">
          <Brain size={24} />
        </div>
        <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-accent-600 dark:from-brand-300 dark:to-accent-300">
          Smart Interview
        </span>
      </Link>

      {/* Desktop menu */}
      <div className="hidden md:flex items-center gap-6">
        <Link to="/" className="hover:text-brand-500 transition-colors font-medium">Home</Link>
        {user ? (
          <>
            <Link to="/dashboard" className="hover:text-brand-500 transition-colors font-medium">Dashboard</Link>
            <Link to="/interview/setup" className="hover:text-brand-500 transition-colors font-medium">Mock Interview</Link>
            <Link to="/resume" className="hover:text-brand-500 transition-colors font-medium">Resume Analyzer</Link>
            {user.role === 'admin' && (
              <Link to="/admin" className="text-accent-500 dark:text-accent-400 hover:text-accent-600 font-bold transition-colors">Admin Panel</Link>
            )}
          </>
        ) : (
          <>
            <a href="#features" className="hover:text-brand-500 transition-colors font-medium">Features</a>
            <a href="#how-it-works" className="hover:text-brand-500 transition-colors font-medium">How it works</a>
          </>
        )}

        <div className="h-5 w-[1px] bg-slate-200 dark:bg-slate-700/60" />

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-slate-100 dark:bg-brand-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-brand-700 transition-all border border-slate-200/20"
          title="Toggle Light/Dark Theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Auth status */}
        {user ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <img
                src={user.profile.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                alt={user.name}
                className="w-8 h-8 rounded-full border border-brand-500/35 object-cover"
              />
              <span className="text-sm font-semibold max-w-[100px] truncate">{user.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/20 text-red-500 hover:bg-red-500/10 text-sm font-semibold transition-all"
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/login" className="px-4 py-2 hover:text-brand-500 transition-colors font-semibold text-sm">
              Login
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 bg-gradient-to-r from-brand-600 to-accent-600 text-white rounded-xl shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30 hover:opacity-95 font-semibold text-sm transition-all"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>

      {/* Mobile menu button */}
      <div className="flex md:hidden items-center gap-3">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-slate-100 dark:bg-brand-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-brand-700 border border-slate-200/20"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-brand-800"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 glass shadow-2xl border-t border-slate-200/20 flex flex-col p-4 gap-4 animate-fade-in-down">
          <Link to="/" className="py-2 border-b border-slate-200/10 font-medium" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="py-2 border-b border-slate-200/10 font-medium" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
              <Link to="/interview/setup" className="py-2 border-b border-slate-200/10 font-medium" onClick={() => setMobileMenuOpen(false)}>Mock Interview</Link>
              <Link to="/resume" className="py-2 border-b border-slate-200/10 font-medium" onClick={() => setMobileMenuOpen(false)}>Resume Analyzer</Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="py-2 border-b border-slate-200/10 text-accent-500 font-bold" onClick={() => setMobileMenuOpen(false)}>Admin Panel</Link>
              )}
              <div className="flex items-center gap-2 py-2">
                <img
                  src={user.profile.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                  alt={user.name}
                  className="w-8 h-8 rounded-full border border-brand-500/35 object-cover"
                />
                <span className="text-sm font-semibold truncate">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 font-semibold transition-all w-full"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2 pt-2">
              <Link
                to="/login"
                className="px-4 py-2 border border-brand-500/30 text-brand-600 dark:text-brand-300 rounded-xl text-center font-semibold"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 bg-gradient-to-r from-brand-600 to-accent-600 text-white rounded-xl text-center font-semibold shadow-lg shadow-brand-500/10"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
