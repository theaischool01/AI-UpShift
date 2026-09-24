import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LogOut, 
  Globe, 
  Briefcase,
  Store,
  Rocket
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import UpShiftWordmark from '../common/UpShiftWordmark';

export default function LearnerHeader() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  const pathname = location.pathname;
  const isGigsActive = pathname === '/learner/dashboard' || pathname.startsWith('/learner/gigs') || pathname === '/learner';
  const isLocalActive = pathname.startsWith('/local-businesses') || pathname.startsWith('/learner/local-businesses');
  const isStartupActive = pathname.startsWith('/startup-businesses') || pathname.startsWith('/learner/startup-businesses');

  const fullName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Saheel Yadav';
  const collegeName = profile?.college || user?.user_metadata?.college || 'DRK Institute Of Science And Technology';
  const avatarLetter = (fullName.charAt(0) || 'S').toUpperCase();

  const navItems = [
    {
      id: 'gigs',
      label: 'Gigs',
      to: '/learner/dashboard',
      icon: Briefcase,
      isActive: isGigsActive
    },
    {
      id: 'local',
      label: 'Local Businesses',
      to: '/local-businesses',
      icon: Store,
      isActive: isLocalActive
    },
    {
      id: 'startup',
      label: 'Startup Businesses',
      to: '/startup-businesses',
      icon: Rocket,
      isActive: isStartupActive
    }
  ];

  return (
    <header className="learner-header" aria-label="Learner Opportunity Workspace Header">
      <div className="learner-header-inner">
        {/* 1. LEFT: UpShift Brand Card */}
        <div className="learner-header-left">
          <Link 
            to="/learner/dashboard" 
            className="flex items-center gap-2.5 px-2.5 py-1 rounded-lg border border-[#E5E7EB] bg-white shadow-2xs hover:border-gray-300 transition-all no-underline select-none text-inherit min-w-0"
          >
            {/* UpShift Mascot Avatar */}
            <div 
              className="rounded-[6px] overflow-hidden flex items-center justify-center bg-[#111111] border border-black/10 flex-shrink-0 select-none p-[1px]"
              style={{ width: '28px', height: '28px', minWidth: '28px', minHeight: '28px' }}
            >
              <img 
                src="/assets/mascot/mascot_avatar.jpg" 
                alt="UpShift Mascot" 
                className="w-full h-full object-cover rounded-[5px] select-none"
              />
            </div>
            <div className="flex flex-col justify-center min-w-0 pr-1">
              <span 
                className="text-[15px] sm:text-[16px] font-black tracking-[-0.03em] leading-none text-[#111111]"
                style={{ fontWeight: 900 }}
              >
                <UpShiftWordmark theme="light" style={{ fontWeight: 900 }} />
              </span>
              <span className="text-[8px] sm:text-[8.5px] font-mono font-bold tracking-[0.12em] text-[#6B7280] uppercase mt-0.5 leading-none">
                OPPORTUNITIES
              </span>
            </div>
          </Link>
        </div>

        {/* 2. CENTER: Segmented Opportunity Navigation Pill */}
        <div className="learner-header-center">
          <nav className="learner-header-nav" aria-label="Opportunity Workspace Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  to={item.to}
                  className={`learner-header-tab ${item.isActive ? 'is-active' : ''}`}
                >
                  <Icon className="learner-header-tab-icon" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* 3. RIGHT: User Pill + Globe + Logout */}
        <div className="learner-header-right">
          {/* User Profile Pill */}
          <div className="learner-user-pill hidden lg:flex items-center gap-2.5 pl-1.5 pr-3.5 py-1 rounded-full bg-[#F9FAFB] border border-[#E5E7EB] shadow-2xs select-none">
            <div className="w-7 h-7 rounded-full bg-[#111827] text-white flex items-center justify-center text-xs font-black flex-shrink-0">
              {avatarLetter}
            </div>
            <div className="flex flex-col text-left justify-center min-w-0">
              <span className="text-[12.5px] font-bold text-[#111827] leading-tight truncate">
                {fullName}
              </span>
              <span className="text-[9.5px] font-medium text-[#6B7280] leading-tight truncate mt-0.5 max-w-[210px]">
                {collegeName}
              </span>
            </div>
          </div>

          {/* Public Website / Home Link */}
          <Link
            to="/"
            className="learner-header-action-btn"
            title="Open Public UpShift Homepage"
            aria-label="Public UpShift Homepage"
          >
            <Globe className="w-4 h-4 text-[#374151]" />
          </Link>

          {/* Logout Button */}
          <button
            onClick={handleSignOut}
            className="learner-header-action-btn"
            title="Logout"
            aria-label="Logout"
          >
            <LogOut className="w-4 h-4 text-[#374151]" />
          </button>
        </div>
      </div>
    </header>
  );
}
