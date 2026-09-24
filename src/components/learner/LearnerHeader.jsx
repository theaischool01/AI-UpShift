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
  const { signOut } = useAuth();
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
      {/* 1. TOP ROW ON MOBILE / LEFT & RIGHT ON DESKTOP */}
      <div className="learner-header-top-row">
        {/* LEFT: UpShift Brand & Space Identifier */}
        <div className="learner-header-left">
          <Link 
            to="/learner/dashboard" 
            className="flex items-center gap-2 sm:gap-3 no-underline select-none text-inherit hover:no-underline min-w-0"
          >
            {/* UpShift Mascot Avatar */}
            <div 
              className="rounded-[9px] overflow-hidden flex items-center justify-center bg-[#111111] border border-black/10 shadow-2xs flex-shrink-0 select-none p-[1.5px]"
              style={{ width: '32px', height: '32px', minWidth: '32px', minHeight: '32px' }}
            >
              <img 
                src="/assets/mascot/mascot_avatar.jpg" 
                alt="UpShift Mascot" 
                className="w-full h-full object-cover rounded-[7px] select-none"
              />
            </div>
            <div className="flex flex-col justify-center min-w-0">
              <span 
                className="text-[16px] sm:text-[18px] font-black tracking-[-0.03em] leading-none text-[#111111]"
                style={{ fontWeight: 900 }}
              >
                <UpShiftWordmark theme="light" style={{ fontWeight: 900 }} />
              </span>
              <span className="text-[8.5px] sm:text-[9.5px] font-mono font-bold tracking-[0.12em] text-[#6B7280] uppercase mt-0.5 leading-none">
                OPPORTUNITIES
              </span>
            </div>
          </Link>
        </div>

        {/* RIGHT: Home + Logout */}
        <div className="learner-header-right">
          {/* Home Button */}
          <Link
            to="/"
            className="learner-header-action-btn"
            title="Home"
            aria-label="Home"
          >
            <Globe className="w-4 h-4 text-[#4B5563]" />
            <span className="hidden sm:inline text-xs font-semibold text-[#374151]">Home</span>
          </Link>

          {/* Logout Button */}
          <button
            onClick={handleSignOut}
            className="learner-header-action-btn"
            title="Logout"
            aria-label="Logout"
          >
            <LogOut className="w-4 h-4 text-[#4B5563]" />
            <span className="hidden sm:inline text-xs font-semibold text-[#374151]">Logout</span>
          </button>
        </div>
      </div>

      {/* 2. CENTER ON DESKTOP / ROW 2 ON MOBILE: Segmented Opportunity Navigation Pill */}
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
    </header>
  );
}
