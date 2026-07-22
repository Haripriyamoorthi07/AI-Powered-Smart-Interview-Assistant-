import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Brain, Star, Briefcase, HelpCircle, ArrowRight } from 'lucide-react';

const InterviewSetup = () => {
  const { authFetch } = useAuth();
  const navigate = useNavigate();
  const [type, setType] = useState('Technical Interview');
  const [role, setRole] = useState('Software Engineer');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const types = ['HR Interview', 'Technical Interview', 'Behavioral Interview', 'Coding Interview'];
  
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

  const handleStart = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await authFetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, role, difficulty }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to start interview session');
      }
      navigate(`/interview/session/${data._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 p-6 md:p-8 flex items-center justify-center max-w-4xl mx-auto w-full">
      <div className="glass w-full p-8 rounded-3xl border border-slate-200/15 shadow-2xl flex flex-col md:flex-row gap-8">
        
        {/* Left Side Info Panel */}
        <div className="flex-1 flex flex-col justify-between gap-6 border-b md:border-b-0 md:border-r border-slate-200/15 pb-6 md:pb-0 md:pr-8">
          <div>
            <span className="text-xs text-brand-500 font-bold uppercase tracking-wider">Configure Session</span>
            <h1 className="text-2xl font-black mt-1 leading-snug">Prepare for Greatness</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Our simulator generates 5 unique questions tailored to your inputs. Respond using voice inputs or typed texts.
            </p>
          </div>

          <div className="flex flex-col gap-4 text-xs text-slate-400">
            <div className="flex gap-2 items-start">
              <Brain size={16} className="text-brand-500 shrink-0 mt-0.5" />
              <span>Smart evaluation scans core conceptual terminology and technical correctness.</span>
            </div>
            <div className="flex gap-2 items-start">
              <Star size={16} className="text-accent-500 shrink-0 mt-0.5" />
              <span>Timers are configured based on difficulty settings to simulate live pressure.</span>
            </div>
          </div>
        </div>

        {/* Right Side Settings Form */}
        <form onSubmit={handleStart} className="flex-1 flex flex-col gap-5">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xs">
              {error}
            </div>
          )}

          {/* Type Select */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <HelpCircle size={14} />
              Interview Category
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-3 bg-white/40 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all font-semibold"
            >
              {types.map(t => <option key={t} value={t} className="bg-white dark:bg-slate-950">{t}</option>)}
            </select>
          </div>

          {/* Role Select */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Briefcase size={14} />
              Target Job Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 bg-white/40 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all font-semibold"
            >
              {roles.map(r => <option key={r} value={r} className="bg-white dark:bg-slate-950">{r}</option>)}
            </select>
          </div>

          {/* Difficulty Select */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Star size={14} />
              Skill Difficulty
            </label>
            <div className="grid grid-cols-3 gap-2">
              {difficulties.map(d => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDifficulty(d)}
                  className={`py-2.5 rounded-xl border text-xs font-bold transition-all ${
                    difficulty === d
                      ? 'bg-gradient-to-r from-brand-600 to-accent-600 text-white border-transparent shadow-md'
                      : 'border-slate-300 dark:border-slate-800 hover:bg-slate-100/50 dark:hover:bg-brand-800/40 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 text-white rounded-xl font-bold shadow-lg shadow-brand-500/10 flex items-center justify-center gap-2 mt-3 transition-all disabled:opacity-50"
          >
            {loading ? 'Generating AI Simulator...' : 'Initialize Mock Interview'}
            <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default InterviewSetup;
