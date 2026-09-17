import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, role, loading, authError } = useAuth();
  const location = useLocation();

  // Controlled loading state: prevent flashing before auth & role resolution
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-6 select-none">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full border-2 border-[#E31B23]/20 border-t-[#E31B23] animate-spin" />
            <span className="absolute text-[#E31B23] font-bold text-xs">↑</span>
          </div>
          <div className="text-xs font-mono tracking-widest text-white/60 uppercase">
            Verifying Workspace Session...
          </div>
        </div>
      </div>
    );
  }

  // Not authenticated -> redirect to /login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Account misconfiguration check
  if (authError || !role) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#141414] border border-red-500/30 rounded-2xl p-8 text-center space-y-4 shadow-xl">
          <div className="w-12 h-12 mx-auto rounded-full bg-red-500/10 text-[#E31B23] flex items-center justify-center text-xl font-bold">
            !
          </div>
          <h2 className="font-heading text-xl text-white font-bold">Account Configuration Required</h2>
          <p className="text-sm text-white/70 font-display">
            {authError || 'Your account is not configured with an active role in the database. Please contact an administrator.'}
          </p>
          <div className="pt-2">
            <a
              href="/login"
              className="btn btn-secondary btn-sm"
              style={{ backgroundColor: '#1f1f1f', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              Back to Login
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Role validation: strict enforcement
  if (requiredRole && role !== requiredRole) {
    // If learner tries to access admin area -> redirect to learner dashboard
    if (requiredRole === 'admin' && role === 'learner') {
      return <Navigate to="/learner/dashboard" replace />;
    }
    // If admin tries to access learner area -> redirect to admin dashboard
    if (requiredRole === 'learner' && role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    // Fallback safe redirect to home
    return <Navigate to="/" replace />;
  }

  return children;
}
