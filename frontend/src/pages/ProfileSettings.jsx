import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Briefcase, Star, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

const ProfileSettings = () => {
  const { user, updateProfile, error } = useAuth();
  
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.profile?.bio || '');
  const [targetRole, setTargetRole] = useState(user?.profile?.targetRole || 'Software Engineer');
  const [targetDifficulty, setTargetDifficulty] = useState(user?.profile?.targetDifficulty || 'Intermediate');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const roles = [
    'Software Engineer',
    'Data Analyst',
    'AI/ML Engineer',
    'Web Developer',
    'Java Developer',
    'Python Developer',
    'Full Stack Developer'
  ];

  const difficulties = ['Beginner', 'Intermediate', 'Advanced'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setLoading(true);

    const updated = await updateProfile({
      name,
      bio,
      targetRole,
      targetDifficulty
    });

    setLoading(false);
    if (updated) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  return (
    <div className="flex-1 p-6 md:p-8 flex items-center justify-center max-w-3xl mx-auto w-full">
      <div className="glass w-full p-8 rounded-3xl border border-slate-200/15 shadow-2xl flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-black">Profile Settings</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Configure your default preparation details.</p>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xs flex gap-2 items-center">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 rounded-xl text-xs flex gap-2 items-center">
            <CheckCircle2 size={16} />
            <span>Profile successfully updated!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Avatar details */}
          <div className="flex items-center gap-4 bg-slate-500/5 p-4 rounded-2xl border border-slate-200/5">
            <img
              src={user?.profile?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${name}`}
              alt={name}
              className="w-14 h-14 rounded-full border border-brand-500/40 object-cover"
            />
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">PREPARATION AVATAR</span>
              <p className="text-sm font-semibold truncate max-w-xs">{user?.email}</p>
            </div>
          </div>

          {/* Name Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <User size={14} />
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-white/40 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Bio Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <FileText size={14} />
              Short Bio / Background
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about your background, career goals, or current preparation objectives..."
              className="w-full h-24 px-4 py-3 bg-white/40 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* Target Role Select */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Briefcase size={14} />
                Target Job Role
              </label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full px-4 py-3 bg-white/40 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all font-semibold"
              >
                {roles.map(r => <option key={r} value={r} className="bg-white dark:bg-slate-950">{r}</option>)}
              </select>
            </div>

            {/* Target Difficulty Select */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Star size={14} />
                Target Difficulty
              </label>
              <select
                value={targetDifficulty}
                onChange={(e) => setTargetDifficulty(e.target.value)}
                className="w-full px-4 py-3 bg-white/40 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all font-semibold"
              >
                {difficulties.map(d => <option key={d} value={d} className="bg-white dark:bg-slate-950">{d}</option>)}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 text-white rounded-xl font-bold shadow-lg shadow-brand-500/10 flex items-center justify-center gap-2 mt-2 transition-all"
          >
            {loading ? 'Saving Settings...' : 'Save Profile Settings'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSettings;
