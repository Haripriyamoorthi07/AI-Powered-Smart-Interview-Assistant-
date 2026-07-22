import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Brain, AlertCircle, ArrowRight } from 'lucide-react';

export const LoginPage = () => {
  const { login, error } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setLoading(true);

    const success = await login(email, password);
    setLoading(false);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-[calc(100vh-69px)] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute top-20 right-20 w-80 h-80 bg-brand-500/10 blur-[100px] rounded-full -z-10" />
      <div className="absolute bottom-10 left-10 w-60 h-60 bg-accent-500/10 blur-[90px] rounded-full -z-10" />

      <div className="glass w-full max-w-md p-8 rounded-3xl border border-slate-200/15 shadow-2xl">
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="p-3 bg-gradient-to-tr from-brand-500 to-accent-500 rounded-2xl w-fit text-white shadow-lg shadow-brand-500/20 mb-3">
            <Brain size={28} />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight">Welcome Back</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Log in to continue your interview preparation</p>
        </div>

        {(error || localError) && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{localError || error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full pl-11 pr-4 py-3 bg-white/50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Password</label>
              <Link to="/forgot-password" className="text-xs text-brand-500 hover:underline font-semibold">Forgot Password?</Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 bg-white/50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 text-white rounded-xl font-bold shadow-lg shadow-brand-500/10 flex items-center justify-center gap-2 mt-2 transition-all disabled:opacity-50"
          >
            {loading ? 'Logging In...' : 'Log In'}
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="text-center mt-6 text-xs text-slate-500">
          Don't have an account?{' '}
          <Link to="/signup" className="text-brand-500 hover:underline font-bold">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export const SignupPage = () => {
  const { signup, error } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    const success = await signup(name, email, password);
    setLoading(false);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-[calc(100vh-69px)] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute top-20 left-20 w-80 h-80 bg-brand-500/10 blur-[100px] rounded-full -z-10" />
      <div className="absolute bottom-10 right-10 w-60 h-60 bg-accent-500/10 blur-[90px] rounded-full -z-10" />

      <div className="glass w-full max-w-md p-8 rounded-3xl border border-slate-200/15 shadow-2xl">
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="p-3 bg-gradient-to-tr from-brand-500 to-accent-500 rounded-2xl w-fit text-white shadow-lg shadow-brand-500/20 mb-3">
            <Brain size={28} />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight">Create Account</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Join to start optimizing your interview success</p>
        </div>

        {(error || localError) && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{localError || error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full pl-11 pr-4 py-3 bg-white/50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full pl-11 pr-4 py-3 bg-white/50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full pl-11 pr-4 py-3 bg-white/50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 text-white rounded-xl font-bold shadow-lg shadow-brand-500/10 flex items-center justify-center gap-2 mt-2 transition-all disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="text-center mt-6 text-xs text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-500 hover:underline font-bold">Log In</Link>
        </div>
      </div>
    </div>
  );
};

export const ForgotPasswordPage = () => {
  const { forgotPassword, error } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    const success = await forgotPassword(email);
    setLoading(false);
    if (success) {
      setMessage('A reset link has been sent to your email address.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-69px)] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute top-20 right-20 w-80 h-80 bg-brand-500/10 blur-[100px] rounded-full -z-10" />

      <div className="glass w-full max-w-md p-8 rounded-3xl border border-slate-200/15 shadow-2xl">
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="p-3 bg-gradient-to-tr from-brand-500 to-accent-500 rounded-2xl w-fit text-white shadow-lg shadow-brand-500/20 mb-3">
            <Brain size={28} />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight">Reset Password</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Enter your email and we'll send you a simulation link</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 rounded-xl text-xs">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full pl-11 pr-4 py-3 bg-white/50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 text-white rounded-xl font-bold shadow-lg shadow-brand-500/10 flex items-center justify-center gap-2 mt-2 transition-all disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="text-center mt-6 text-xs text-slate-500">
          Back to{' '}
          <Link to="/login" className="text-brand-500 hover:underline font-bold">Log In</Link>
        </div>
      </div>
    </div>
  );
};
