import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Users, Play, FileText, Brain, Trash2, AlertCircle } from 'lucide-react';

const AdminPanel = () => {
  const { user, authFetch } = useAuth();
  const [stats, setStats] = useState({
    usersCount: 0,
    interviewsCount: 0,
    resumesCount: 0,
    globalAvgScore: 0,
    categories: []
  });
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchAdminData();
    }
  }, [user]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const statsRes = await authFetch('/api/admin/stats');
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      const usersRes = await authFetch('/api/admin/users');
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsersList(usersData);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch administrative data. Verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (userId === user.id) {
      alert('You cannot delete your own admin account.');
      return;
    }

    if (!window.confirm('Are you sure you want to permanently delete this user?')) {
      return;
    }

    try {
      const res = await authFetch(`/api/admin/users/${userId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setUsersList(usersList.filter(u => u._id !== userId));
        fetchAdminData(); // Refresh counts
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to delete user.');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="flex-1 p-8 flex flex-col items-center justify-center min-h-[400px] gap-2">
        <AlertCircle size={40} className="text-red-500" />
        <h2 className="font-extrabold text-lg">Access Denied</h2>
        <p className="text-sm text-slate-400">This management dashboard is restricted to administrator profiles.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center min-h-[500px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500" />
      </div>
    );
  }

  const adminStatsCards = [
    { label: 'Registered Users', value: stats.usersCount, icon: Users, color: 'from-blue-500 to-indigo-500' },
    { label: 'Sessions Run', value: stats.interviewsCount, icon: Play, color: 'from-brand-500 to-accent-500' },
    { label: 'Resumes Analyzed', value: stats.resumesCount, icon: FileText, color: 'from-green-500 to-emerald-500' },
    { label: 'System Average Score', value: `${stats.globalAvgScore}%`, icon: Brain, color: 'from-amber-500 to-orange-500' }
  ];

  return (
    <div className="flex-1 p-6 md:p-8 flex flex-col gap-8 max-w-7xl mx-auto w-full">
      <div className="flex items-center gap-2.5">
        <ShieldCheck size={28} className="text-accent-500" />
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">System Admin Console</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Audit active registration lists and database metric statistics.</p>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xs flex gap-2">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminStatsCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="glass p-6 rounded-3xl border border-slate-200/15 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[120px]">
              <div className="flex justify-between items-start">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">{card.label}</span>
                <div className={`p-2 bg-gradient-to-tr ${card.color} rounded-xl text-white shadow-md`}>
                  <Icon size={16} />
                </div>
              </div>
              <div className="text-2xl font-black mt-3">{card.value}</div>
            </div>
          );
        })}
      </div>

      {/* User administration list */}
      <div className="glass p-6 rounded-3xl border border-slate-200/15 shadow-xl flex flex-col gap-4">
        <h2 className="text-lg font-bold">User Registrations</h2>
        
        {usersList.length > 0 ? (
          <div className="overflow-x-auto w-full mt-2">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200/10 text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="pb-3 pr-4">User Details</th>
                  <th className="pb-3 pr-4">Email</th>
                  <th className="pb-3 pr-4">Role</th>
                  <th className="pb-3 pr-4">Job Preference</th>
                  <th className="pb-3 text-right">Delete Action</th>
                </tr>
              </thead>
              <tbody>
                {usersList.map((usr) => (
                  <tr key={usr._id} className="border-b border-slate-200/5 hover:bg-slate-50/50 dark:hover:bg-brand-800/10 transition-colors">
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-2">
                        <img 
                          src={usr.profile.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${usr.name}`} 
                          alt={usr.name} 
                          className="w-8 h-8 rounded-full object-cover border border-slate-200/15" 
                        />
                        <span className="font-bold">{usr.name}</span>
                      </div>
                    </td>
                    <td className="py-4 pr-4 text-slate-500 font-mono text-xs">{usr.email}</td>
                    <td className="py-4 pr-4">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                        usr.role === 'admin' 
                          ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20' 
                          : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                      }`}>
                        {usr.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 pr-4 text-slate-500 text-xs">{usr.profile.targetRole}</td>
                    <td className="py-4 text-right">
                      <button
                        onClick={() => handleDeleteUser(usr._id)}
                        disabled={usr._id === user.id}
                        className="p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-all disabled:opacity-30"
                        title="Delete User Account"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-slate-400 text-center py-6">No registered users in system database.</p>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
