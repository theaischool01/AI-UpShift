import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  RefreshCw, 
  Globe, 
  LogOut 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const routeMetadata = {
  '/admin/dashboard': {
    title: 'Dashboard',
    subtitle: 'Registration overview and platform activity across UpShift.',
  },
  '/admin/students': {
    title: 'Students',
    subtitle: 'Manage registered learners, colleges, and enrollment records.',
  },
  '/admin/students/new': {
    title: 'Add Student',
    subtitle: 'Register a single learner account and assign initial course track.',
  },
  '/admin/students/import': {
    title: 'Bulk Student Import',
    subtitle: 'Upload CSV roster with automatic preview, validation, and batch creation.',
  },
  '/admin/courses': {
    title: 'Courses',
    subtitle: 'Flagship curriculum tracks overview and seat distributions.',
  },
  '/admin/gigs': {
    title: 'Gigs',
    subtitle: 'Aggregated commercial opportunities and external apply links.',
  },
  '/admin/gigs/new': {
    title: 'Add Gig',
    subtitle: 'Create a single commercial opportunity record.',
  },
  '/admin/gigs/import': {
    title: 'Bulk Gig Import',
    subtitle: 'Upload bulk gig listings via CSV with automatic duplicate prevention.',
  },
  '/admin/analytics': {
    title: 'Registration Analytics',
    subtitle: 'Detailed timeline metrics and curriculum breakdown across tracks.',
  },
  '/admin/settings': {
    title: 'Settings',
    subtitle: 'System connectivity, administrator profile, and platform configuration.',
  },
};

export default function AdminHeader({
  onToggleMobileMenu = () => {},
  onRefresh = () => {},
  isRefreshing = false,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, signingOut } = useAuth();

  const currentMeta = routeMetadata[location.pathname] || {
    title: 'Admin Control Center',
    subtitle: 'Platform administration and oversight.',
  };

  const handleSignOut = async () => {
    if (signingOut) return;
    await signOut();
    navigate('/login', { replace: true });
  };

  return (
    <header className="admin-header" aria-label="Admin Page Header">
      {/* Left: Mobile Trigger & Dynamic Page Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 -ml-1 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors flex-shrink-0"
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>

        <div className="min-w-0">
          <h1 className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight leading-tight truncate">
            {currentMeta.title}
          </h1>
          <p className="hidden sm:block text-xs text-gray-500 truncate mt-0.5">
            {currentMeta.subtitle}
          </p>
        </div>
      </div>

      {/* Right: Status & Actions */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        {/* Connection Status Badge */}
        <div 
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium text-emerald-700 bg-emerald-50 border border-emerald-200"
          title="Supabase PostgreSQL Live Connection Active"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Live Connected</span>
        </div>

        {/* Manual Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="admin-btn-secondary"
          title="Refresh current data"
        >
          <RefreshCw size={13} className={isRefreshing ? 'animate-spin' : ''} />
          <span className="hidden sm:inline">Refresh</span>
        </button>

        {/* Public Site Link */}
        <Link
          to="/"
          className="admin-btn-secondary hidden sm:inline-flex"
          title="Open Public UpShift Homepage"
        >
          <Globe size={13} />
          <span>Public Site</span>
        </Link>

        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          disabled={signingOut}
          className="admin-btn-secondary hover:text-[#E31B23] hover:border-red-200 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Sign Out of Administrator Account"
        >
          <LogOut size={13} className={signingOut ? 'animate-spin' : ''} />
          <span className="hidden sm:inline">{signingOut ? 'Signing Out...' : 'Sign Out'}</span>
        </button>
      </div>
    </header>
  );
}
