import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { History, Search, Calendar, ChevronRight, FileText, Filter } from 'lucide-react';

const InterviewHistory = () => {
  const { authFetch } = useAuth();
  const [history, setHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await authFetch('/api/interview/history/all');
        if (res.ok) {
          const data = await res.json();
          setHistory(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.difficulty.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = filterType === 'All' || item.type === filterType;

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center min-h-[500px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500" />
      </div>
    );
  }

  const uniqueTypes = ['All', 'HR Interview', 'Technical Interview', 'Behavioral Interview', 'Coding Interview'];

  return (
    <div className="flex-1 p-6 md:p-8 flex flex-col gap-6 max-w-5xl mx-auto w-full">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Interview History</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Review all your previous preparation sessions and detailed AI evaluations.</p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by job role, category, or difficulty level..."
            className="w-full pl-11 pr-4 py-3 bg-white/40 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all font-semibold"
          />
        </div>

        <div className="flex gap-2 items-center w-full sm:w-auto shrink-0">
          <Filter size={16} className="text-slate-400" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-3 bg-white/40 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all font-bold select-none cursor-pointer flex-1 sm:flex-none"
          >
            {uniqueTypes.map((t) => (
              <option key={t} value={t} className="bg-white dark:bg-slate-950">{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* History log lists */}
      <div className="flex flex-col gap-3">
        {filteredHistory.length > 0 ? (
          filteredHistory.map((session) => (
            <div
              key={session._id}
              className="glass p-5 rounded-2xl border border-slate-200/15 hover:border-brand-500/30 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-brand-500/10 text-brand-500 rounded-xl mt-0.5">
                  <History size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-sm md:text-base leading-snug">{session.role}</h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-1">
                    <span className="px-2 py-0.5 bg-slate-200 dark:bg-slate-800 rounded font-semibold text-[10px]">
                      {session.type}
                    </span>
                    <span>•</span>
                    <span className="capitalize">{session.difficulty} level</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(session.startedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-0 border-slate-200/5 pt-3 sm:pt-0">
                <div className="text-left sm:text-right">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">SCORE</span>
                  <span className="font-extrabold text-brand-500">
                    {session.status === 'completed' ? `${session.overallFeedback.overallScore}%` : 'In Progress'}
                  </span>
                </div>
                {session.status === 'completed' ? (
                  <Link
                    to={`/interview/report/${session._id}`}
                    className="px-4 py-2 bg-brand-500/10 text-brand-500 hover:bg-brand-500 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                  >
                    View Report
                    <ChevronRight size={14} />
                  </Link>
                ) : (
                  <Link
                    to={`/interview/session/${session._id}`}
                    className="px-4 py-2 bg-amber-500/10 text-amber-500 hover:bg-amber-50 hover:text-white rounded-xl text-xs font-bold transition-all"
                  >
                    Resume
                  </Link>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="glass p-12 rounded-3xl border border-slate-200/15 shadow-xl text-center py-16 flex flex-col items-center gap-3">
            <Search size={36} className="text-slate-300 dark:text-slate-700" />
            <h3 className="font-extrabold text-base">No Matching Records Found</h3>
            <p className="text-slate-400 text-xs max-w-sm">
              Adjust your search keywords or filter terms to find previous reports.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewHistory;
