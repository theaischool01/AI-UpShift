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
      title: 'Programs',
      items: [
        { label: 'Courses', to: '/admin/courses', icon: BookOpen },
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
      {/* 1. Sidebar Header / Product Branding (Strictly no browser-default link styling) */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0 bg-white">
        <Link 
          to="/admin/dashboard" 
          onClick={onClose}
          className="flex items-center gap-3 no-underline group select-none"
        >
          {/* Explicit 40x40 Mascot Logo Container */}
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#111111] border border-gray-200 flex items-center justify-center flex-shrink-0 shadow-xs">
            <img 
              src="/assets/mascot/mascot_avatar.jpg" 
              alt="UpShift Mascot" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                if (e.currentTarget.parentElement) {
                  e.currentTarget.parentElement.innerText = '↑';
                  e.currentTarget.parentElement.style.backgroundColor = '#E31B23';
                  e.currentTarget.parentElement.style.color = '#FFFFFF';
                  e.currentTarget.parentElement.style.fontWeight = 'bold';
                }
              }}
            />
          </div>
          <div className="flex flex-col">
            <span className="text-[15px] font-extrabold tracking-tight text-[#111827] leading-none">
              UPSHIFT
            </span>
            <span className="text-[10px] font-mono font-bold tracking-[0.14em] text-[#6B7280] uppercase mt-1">
              Control Center
            </span>
          </div>
        </Link>

        {/* Separate Close Button for Mobile Drawer */}
        <button
          onClick={onClose}
          className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          aria-label="Close navigation drawer"
        >
          <X size={18} />
        </button>
      </div>

      {/* 2. Scrollable Navigation Section (Takes all remaining vertical space) */}
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

      {/* 3. Sidebar Footer / Administrator Profile Lockup (Permanently fixed at bottom) */}
      <div className="p-3.5 border-t border-gray-200 bg-gray-50 flex-shrink-0">
        <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-white border border-gray-200/80 shadow-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-red-50 text-[#E31B23] border border-red-200 flex items-center justify-center font-bold text-xs flex-shrink-0">
              <ShieldCheck size={16} />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-gray-900 truncate">
                {profile?.full_name || user?.email?.split('@')[0] || 'Administrator'}
              </div>
              <div className="text-[10px] font-mono text-gray-500 truncate">
                Administrator
              </div>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            disabled={signingOut}
            title={signingOut ? "Signing Out..." : "Sign Out"}
            className="p-1.5 rounded-lg text-gray-400 hover:text-[#E31B23] hover:bg-red-50 disabled:opacity-50 transition-colors flex-shrink-0 cursor-pointer"
            aria-label="Sign out of administrator workspace"
          >
            <LogOut size={15} className={signingOut ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>
    </aside>
  );
}
