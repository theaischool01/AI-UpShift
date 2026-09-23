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

  const learnerName = profile?.full_name || user?.user_metadata?.full_name || 'Learner';
  const college = profile?.college || user?.user_metadata?.college || '';

  const pathname = location.pathname;
  const isGigsActive = pathname === '/learner/dashboard' || pathname.startsWith('/learner/gigs') || pathname === '/learner';
  const isLocalActive = pathname.startsWith('/local-businesses') || pathname.startsWith('/learner/local-businesses');
  const isStartupActive = pathname.startsWith('/startup-businesses') || pathname.startsWith('/learner/startup-businesses');

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
      {/* 1. LEFT: UpShift Brand & Space Identifier */}
      <div className="learner-header-left">
        <Link 
          to="/learner/dashboard" 
          className="flex items-center gap-2.5 sm:gap-3 no-underline select-none text-inherit hover:no-underline min-w-0"
        >
          {/* UpShift Mascot Avatar */}
          <div 
            className="rounded-[9px] overflow-hidden flex items-center justify-center bg-[#111111] border border-black/10 shadow-2xs flex-shrink-0 select-none p-[1.5px]"
            style={{ width: '34px', height: '34px', minWidth: '34px', minHeight: '34px' }}
          >
            <img 
              src="/assets/mascot/mascot_avatar.jpg" 
              alt="UpShift Mascot" 
              className="w-full h-full object-cover rounded-[7px] select-none"
            />
          </div>
          <div className="flex flex-col justify-center min-w-0">
            <span 
              className="text-[17px] sm:text-[18px] font-black tracking-[-0.03em] leading-none text-[#111111]"
              style={{ fontWeight: 900 }}
            >
              <UpShiftWordmark theme="light" style={{ fontWeight: 900 }} />
            </span>
            <span className="text-[9px] sm:text-[9.5px] font-mono font-bold tracking-[0.12em] text-[#6B7280] uppercase mt-0.5 leading-none">
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

      {/* 3. RIGHT: Learner Profile, Home & Sign Out */}
      <div className="learner-header-right">
        {/* Learner Identity pill */}
        <div className="learner-user-pill hidden sm:flex">
          <div className="learner-user-avatar">
            {learnerName.charAt(0).toUpperCase()}
          </div>
          <div className="learner-user-info">
            <span className="learner-user-name">
              {learnerName}
            </span>
            {college && (
              <span className="text-[9.5px] text-[#6B7280] truncate max-w-[110px]" title={college}>
                {college}
              </span>
            )}
          </div>
        </div>

        {/* Home Button */}
        <Link
          to="/"
          className="learner-btn-secondary"
          title="Visit UpShift Public Home"
        >
          <Globe className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Home</span>
        </Link>

        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          className="learner-btn-secondary"
          title="Sign out of UpShift"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
}
