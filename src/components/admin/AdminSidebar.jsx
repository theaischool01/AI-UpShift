import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  FileSpreadsheet, 
  BookOpen, 
  Briefcase, 
  PlusCircle, 
  FileText, 
  TrendingUp, 
  Settings, 
  Globe, 
  LogOut, 
  ShieldCheck,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import UpShiftWordmark from '../common/UpShiftWordmark';

export default function AdminSidebar({ isOpen = false, onClose = () => {} }) {
  const { user, profile, signOut, signingOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    if (signingOut) return;
    onClose();
    await signOut();
    navigate('/login', { replace: true });
  };

  const navSections = [
    {
      title: 'Overview',
      items: [
        { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'Learners',
      items: [
        { label: 'Students', to: '/admin/students', icon: Users, end: true },
        { label: 'Add Student', to: '/admin/students/new', icon: UserPlus },
        { label: 'Bulk Import', to: '/admin/students/import', icon: FileSpreadsheet },
      ],
    },
    {
      title: 'Program',
      items: [
        { label: 'Applied Tracks', to: '/admin/courses', icon: BookOpen },
      ],
    },
    {
      title: 'Opportunities',
      items: [
        { label: 'Gigs', to: '/admin/gigs', icon: Briefcase, end: true },
        { label: 'Add Gig', to: '/admin/gigs/new', icon: PlusCircle },
        { label: 'Bulk Import Gigs', to: '/admin/gigs/import', icon: FileText },
      ],
    },
    {
      title: 'Analytics',
      items: [
        { label: 'Registration Analytics', to: '/admin/analytics', icon: TrendingUp },
      ],
    },
    {
      title: 'System',
      items: [
        { label: 'Settings', to: '/admin/settings', icon: Settings },
        { label: 'Public Website', to: '/', icon: Globe, isExternal: true },
      ],
    },
  ];

  return (
    <aside 
      className={`admin-sidebar ${isOpen ? 'admin-sidebar-open' : ''}`}
      aria-label="Admin Navigation Sidebar"
    >
      {/* 1. Sidebar Header / Product Branding */}
      <div className="admin-sidebar-header">
        <Link 
          to="/admin/dashboard" 
          onClick={onClose}
          className="admin-sidebar-brand"
        >
          <div className="admin-sidebar-avatar">
            <img 
              src="/assets/mascot/mascot_avatar.jpg" 
              alt="UpShift" 
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                if (e.currentTarget.parentElement) {
                  e.currentTarget.parentElement.innerText = '↑';
                  e.currentTarget.parentElement.style.backgroundColor = '#E31B23';
                  e.currentTarget.parentElement.style.color = '#FFFFFF';
                  e.currentTarget.parentElement.style.fontWeight = 'bold';
                  e.currentTarget.parentElement.style.fontSize = '14px';
                }
              }}
            />
          </div>
          <div className="admin-sidebar-brand-text">
            <span className="admin-sidebar-brand-title">
              <UpShiftWordmark theme="light" />
            </span>
            <span className="admin-sidebar-brand-sub">Control Center</span>
          </div>
        </Link>

        {/* Close Button strictly for Mobile Drawer */}
        <button
          onClick={onClose}
          className="admin-btn-icon admin-mobile-only"
          aria-label="Close navigation drawer"
        >
          <X size={16} />
        </button>
      </div>

      {/* 2. Scrollable Navigation Section */}
      <nav className="admin-sidebar-nav-container">
        {navSections.map((section) => (
          <div key={section.title} className="admin-nav-group">
            <div className="admin-nav-section-title">
              {section.title}
            </div>
            <div>
              {section.items.map((item) => {
                const Icon = item.icon;
                if (item.isExternal) {
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={onClose}
                      className="admin-nav-item"
                    >
                      <Icon size={16} className="admin-nav-icon" />
                      <span>{item.label}</span>
                    </Link>
                  );
                }

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={onClose}
                    className={({ isActive }) => 
                      `admin-nav-item ${isActive ? 'active' : ''}`
                    }
                  >
                    <Icon size={16} className="admin-nav-icon" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* 3. Sidebar Footer / Administrator Profile Lockup */}
      <div className="admin-sidebar-footer">
        <div className="admin-profile-card">
          <div className="admin-profile-info">
            <div className="admin-profile-badge">
              <ShieldCheck size={16} />
            </div>
            <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column' }}>
              <span className="admin-profile-name">
                {profile?.full_name || user?.email?.split('@')[0] || 'Administrator'}
              </span>
              <span className="admin-profile-role">
                Administrator
              </span>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            disabled={signingOut}
            title={signingOut ? "Signing Out..." : "Sign Out"}
            className="admin-btn-icon admin-btn-icon-danger"
            aria-label="Sign out of administrator workspace"
          >
            <LogOut size={14} className={signingOut ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>
    </aside>
  );
}
