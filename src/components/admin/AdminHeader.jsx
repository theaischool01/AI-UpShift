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
    subtitle: 'Register a single learner account and enroll them into the UpShift Program.',
  },
  '/admin/students/import': {
    title: 'Bulk Student Import',
    subtitle: 'Upload CSV roster with automatic preview, validation, and batch creation.',
  },
  '/admin/courses': {
    title: 'Applied Tracks',
    subtitle: 'Manage the six applied specialization tracks inside the UpShift program.',
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
      <div className="admin-header-left">
        <button
          onClick={onToggleMobileMenu}
          className="admin-btn-icon admin-mobile-only"
          aria-label="Open navigation menu"
        >
          <Menu size={18} />
        </button>

        <div className="admin-header-title-block">
          <h1 className="admin-header-title">
            {currentMeta.title}
          </h1>
          <p className="admin-header-subtitle">
            {currentMeta.subtitle}
          </p>
        </div>
      </div>

      {/* Right: Status & Actions */}
      <div className="admin-header-actions">
        {/* Connection Status Badge */}
        <div 
          className="admin-status-pill admin-desktop-only"
          title="Supabase PostgreSQL Live Connection Active"
        >
          <span className="admin-status-dot" />
          <span>Live Connected</span>
        </div>

        {/* Manual Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="admin-btn admin-btn-secondary"
          title="Refresh current data"
        >
          <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
          <span className="admin-desktop-only">Refresh</span>
        </button>

        {/* Public Site Link */}
        <Link
          to="/"
          className="admin-btn admin-btn-secondary admin-desktop-only"
          title="Open Public UpShift Homepage"
        >
          <Globe size={14} />
          <span>Public Site</span>
        </Link>

        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          disabled={signingOut}
          className="admin-btn admin-btn-secondary"
          title="Sign Out of Administrator Account"
        >
          <LogOut size={14} className={signingOut ? 'animate-spin' : ''} />
          <span className="admin-desktop-only">{signingOut ? 'Signing Out...' : 'Sign Out'}</span>
        </button>
      </div>
    </header>
  );
}
