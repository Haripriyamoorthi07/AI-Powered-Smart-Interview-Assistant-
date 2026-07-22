import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Pages
import LandingPage from './pages/LandingPage';
import { LoginPage, SignupPage, ForgotPasswordPage } from './pages/AuthPages';
import Dashboard from './pages/Dashboard';
import InterviewSetup from './pages/InterviewSetup';
import InterviewSession from './pages/InterviewSession';
import InterviewReport from './pages/InterviewReport';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import ProfileSettings from './pages/ProfileSettings';
import InterviewHistory from './pages/InterviewHistory';
import AdminPanel from './pages/AdminPanel';

// Guard for protected routes
const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-50 dark:bg-brand-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

// Sidebar Layout wrapper
const SidebarLayout = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-69px)] w-full">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-50 dark:bg-brand-900 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          {/* Dashboard nested sidebar routing */}
          <Route element={<SidebarLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/interview/setup" element={<InterviewSetup />} />
            <Route path="/resume" element={<ResumeAnalyzer />} />
            <Route path="/profile" element={<ProfileSettings />} />
            <Route path="/history" element={<InterviewHistory />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Route>
          
          {/* Distraction-free (No Sidebar) full-width screens */}
          <Route path="/interview/session/:id" element={<InterviewSession />} />
          <Route path="/interview/report/:id" element={<InterviewReport />} />
        </Route>

        {/* Fallback Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
