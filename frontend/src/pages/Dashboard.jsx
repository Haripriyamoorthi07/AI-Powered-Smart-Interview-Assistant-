import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Award, Brain, Target, AlertCircle, Play, FileText, ChevronRight, History } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const Dashboard = () => {
  const { user, authFetch } = useAuth();
  const [metrics, setMetrics] = useState({
    totalInterviews: 0,
    averageScore: 0,
    bestCategory: 'N/A',
    weakestCategory: 'N/A',
    categoryBreakdown: { communication: 0, technical: 0, general: 0 },
    performanceTrends: [],
    weeklyProgress: []
  });
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch analytics metrics
        const metricsRes = await authFetch('/api/analytics/dashboard');
        if (metricsRes.ok) {
          const metricsData = await metricsRes.json();
          setMetrics(metricsData);
        }

        // Fetch interview history
        const historyRes = await authFetch('/api/interview/history/all');
        if (historyRes.ok) {
          const historyData = await historyRes.json();
          setHistory(historyData.slice(0, 5)); // Show latest 5
        }
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center min-h-[500px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500" />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Interviews Completed',
      value: metrics.totalInterviews,
      icon: Award,
      color: 'from-blue-500 to-indigo-500',
    },
    {
      title: 'Average AI Score',
      value: `${metrics.averageScore}%`,
      icon: Brain,
      color: 'from-brand-500 to-accent-500',
    },
    {
      title: 'Best Performance',
      value: metrics.bestCategory,
      icon: Target,
      color: 'from-green-500 to-emerald-500',
      isText: true,
    },
    {
      title: 'Focus Area',
      value: metrics.weakestCategory,
      icon: AlertCircle,
      color: 'from-amber-500 to-orange-500',
      isText: true,
    },
  ];

  return (
    <div className="flex-1 p-6 md:p-8 flex flex-col gap-8 max-w-7xl mx-auto w-full">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Welcome, {user?.name}!</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Here is your interview preparedness dashboard.</p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/interview/setup"
            className="px-5 py-3 bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 text-white rounded-xl shadow-lg shadow-brand-500/10 font-bold transition-all flex items-center gap-2 text-sm"
          >
            <Play size={16} fill="currentColor" />
            Start Mock Interview
          </Link>
          <Link
            to="/resume"
            className="px-5 py-3 glass text-slate-800 dark:text-white border border-slate-200/20 hover:bg-slate-50/50 dark:hover:bg-brand-800/40 rounded-xl font-bold transition-all flex items-center gap-2 text-sm"
          >
            <FileText size={16} />
            Scan Resume
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="glass p-6 rounded-3xl border border-slate-200/15 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[140px]">
              <div className="flex justify-between items-start">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">{card.title}</span>
                <div className={`p-2.5 bg-gradient-to-tr ${card.color} rounded-xl text-white shadow-md shadow-brand-500/5`}>
                  <Icon size={18} />
                </div>
              </div>
              <div className={`text-2xl font-black mt-4 truncate ${card.isText && card.value.length > 15 ? 'text-lg md:text-xl' : ''}`}>
                {card.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* Graphs Panel */}
      {metrics.totalInterviews > 0 ? (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Performance Trends Graph */}
          <div className="glass p-6 rounded-3xl border border-slate-200/15 shadow-xl lg:col-span-2 flex flex-col gap-4">
            <div>
              <h2 className="text-lg font-bold">Performance Progression</h2>
              <p className="text-xs text-slate-400">Score trends across recent mock interview sessions</p>
            </div>
            <div className="h-72 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metrics.performanceTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
                  <YAxis domain={[0, 100]} stroke="#64748b" fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(15, 23, 42, 0.9)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      color: '#f8fafc',
                    }}
                  />
                  <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} dot={{ r: 5, strokeWidth: 2 }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category breakdown bar meters */}
          <div className="glass p-6 rounded-3xl border border-slate-200/15 shadow-xl flex flex-col gap-6">
            <div>
              <h2 className="text-lg font-bold">Skills Analysis</h2>
              <p className="text-xs text-slate-400">Skill level estimations across key vectors</p>
            </div>
            <div className="flex flex-col gap-5 justify-center flex-1">
              <div>
                <div className="flex justify-between items-center text-xs font-semibold mb-2">
                  <span>Technical Expertise</span>
                  <span>{metrics.categoryBreakdown.technical}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-brand-500 to-indigo-500 h-full rounded-full" style={{ width: `${metrics.categoryBreakdown.technical}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs font-semibold mb-2">
                  <span>Communication Skills</span>
                  <span>{metrics.categoryBreakdown.communication}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-accent-500 to-purple-500 h-full rounded-full" style={{ width: `${metrics.categoryBreakdown.communication}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs font-semibold mb-2">
                  <span>Confidence Level</span>
                  <span>{metrics.categoryBreakdown.general}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-full rounded-full" style={{ width: `${metrics.categoryBreakdown.general}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass p-8 rounded-3xl border border-slate-200/15 shadow-xl text-center flex flex-col items-center gap-3 py-12">
          <Brain size={42} className="text-brand-500 animate-bounce" />
          <h3 className="font-extrabold text-lg">No Analytical Data Yet</h3>
          <p className="text-slate-400 text-sm max-w-sm">
            Complete your first AI-graded mock interview to unlock progress tracking analytics.
          </p>
          <Link
            to="/interview/setup"
            className="mt-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-brand-500/10"
          >
            Start Preparing Now
          </Link>
        </div>
      )}

      {/* History table */}
      <div className="glass p-6 rounded-3xl border border-slate-200/15 shadow-xl flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <History size={18} className="text-slate-400" />
            <h2 className="text-lg font-bold">Recent History</h2>
          </div>
          {history.length > 0 && (
            <Link to="/history" className="text-xs text-brand-500 hover:underline font-bold flex items-center gap-0.5">
              View All History
              <ChevronRight size={14} />
            </Link>
          )}
        </div>

        {history.length > 0 ? (
          <div className="overflow-x-auto w-full mt-2">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200/10 text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="pb-3 pr-4">Date</th>
                  <th className="pb-3 pr-4">Job Role</th>
                  <th className="pb-3 pr-4">Format</th>
                  <th className="pb-3 pr-4">Difficulty</th>
                  <th className="pb-3 pr-4">Score</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {history.map((session) => (
                  <tr key={session._id} className="border-b border-slate-200/5 hover:bg-slate-50/50 dark:hover:bg-brand-800/10 transition-colors">
                    <td className="py-4 pr-4 text-slate-500 text-xs">
                      {new Date(session.startedAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 pr-4 font-bold">{session.role}</td>
                    <td className="py-4 pr-4">
                      <span className="px-2 py-0.5 bg-brand-500/10 text-brand-500 dark:text-brand-300 text-xs font-semibold rounded">
                        {session.type}
                      </span>
                    </td>
                    <td className="py-4 pr-4 text-slate-500 text-xs">{session.difficulty}</td>
                    <td className="py-4 pr-4 font-extrabold text-brand-500">
                      {session.status === 'completed' ? `${session.overallFeedback.overallScore}%` : 'In Progress'}
                    </td>
                    <td className="py-4 text-right">
                      {session.status === 'completed' ? (
                        <Link
                          to={`/interview/report/${session._id}`}
                          className="px-3 py-1.5 bg-brand-500/10 text-brand-500 hover:bg-brand-500 hover:text-white rounded-lg text-xs font-bold transition-all"
                        >
                          View Report
                        </Link>
                      ) : (
                        <Link
                          to={`/interview/session/${session._id}`}
                          className="px-3 py-1.5 bg-amber-500/10 text-amber-500 hover:bg-amber-50 hover:text-white rounded-lg text-xs font-bold transition-all"
                        >
                          Resume
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400 text-xs border border-dashed border-slate-200/20 rounded-2xl">
            You haven't completed any sessions yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
