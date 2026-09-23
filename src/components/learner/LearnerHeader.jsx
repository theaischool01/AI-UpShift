import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LogOut, 
  Globe, 
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import UpShiftWordmark from '../common/UpShiftWordmark';

export default function LearnerHeader() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  const learnerName = profile?.full_name || user?.user_metadata?.full_name || 'Learner';
  const college = profile?.college || user?.user_metadata?.college || '';

  return (
    <header className="learner-header" aria-label="Learner Marketplace Header">
      {/* Left: Branding & Role */}
      <div className="flex items-center gap-4">
        <Link 
          to="/learner/dashboard" 
          className="flex items-center gap-2.5 sm:gap-3 no-underline group select-none text-inherit hover:no-underline min-w-0"
        >
          {/* UpShift Fox Mascot Avatar */}
          <div 
            className="rounded-[9px] overflow-hidden flex items-center justify-center bg-[#111111] border border-black/10 shadow-xs flex-shrink-0 select-none p-[1.5px]"
            style={{ width: '36px', height: '36px', minWidth: '36px', minHeight: '36px' }}
          >
            <img 
              src="/assets/mascot/mascot_avatar.jpg" 
              alt="UpShift Mascot" 
              className="w-full h-full object-cover rounded-[8px] select-none"
            />
          </div>
          <div className="flex flex-col justify-center min-w-0">
            <span 
              className="text-[18px] sm:text-[19px] font-black tracking-[-0.03em] leading-none text-[#111111]"
              style={{ 
                fontFamily: 'var(--font-heading, var(--font-display, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif))',
                fontWeight: 900 
              }}
            >
              <UpShiftWordmark theme="light" style={{ fontWeight: 900 }} />
            </span>
            <span className="text-[9.5px] sm:text-[10px] font-mono font-semibold tracking-[0.14em] text-[#6B7280] uppercase mt-1 leading-none">
              OPPORTUNITIES
            </span>
          </div>
        </Link>

        {/* UpShift Program Badge */}
        <div className="hidden md:flex items-center gap-2 pl-4 border-l border-[#E5E7EB]">
          <span
            className="learner-badge-track"
            style={{
              backgroundColor: 'rgba(227, 27, 35, 0.08)',
              color: '#E31B23',
              border: '1px solid rgba(227, 27, 35, 0.2)',
            }}
            title="Enrolled in UpShift Program"
          >
            <Sparkles className="w-3 h-3" />
            <span>UpShift Program</span>
          </span>
        </div>
      </div>

      {/* Right: Learner Identity & Actions */}
      <div className="flex items-center gap-3">
        {/* Learner Identity pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F3F4F6] border border-[#E5E7EB] text-xs">
          <div className="w-6 h-6 rounded-full bg-[#E5E7EB] text-[#374151] flex items-center justify-center text-xs font-bold">
            {learnerName.charAt(0).toUpperCase()}
          </div>
          <div className="text-left">
            <div className="font-semibold text-[#111827] leading-tight truncate max-w-[130px]">
              {learnerName}
            </div>
            {college && (
              <div className="text-[10px] text-[#6B7280] truncate max-w-[130px]" title={college}>
                {college}
              </div>
            )}
          </div>
        </div>

        {/* Public Marketing Site Link */}
        <Link
          to="/"
          className="learner-btn-secondary hidden lg:inline-flex"
          title="Visit public website"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>

        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          className="learner-btn-secondary"
          title="Sign out of UpShift"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
}
