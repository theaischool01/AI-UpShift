import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  LogOut, 
  Globe, 
  GraduationCap, 
  BookOpen, 
  User,
  Sparkles,
  Layers
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';

export default function LearnerHeader({ enrolledCourses = [] }) {
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
          className="flex items-center gap-3 no-underline group select-none text-inherit hover:no-underline"
        >
          {/* Clean UpShift Arrow Brand Mark */}
          <div 
            className="rounded-lg bg-[#E31B23] flex items-center justify-center text-white font-bold text-sm shadow-xs flex-shrink-0 select-none"
            style={{ width: '34px', height: '34px', minWidth: '34px', minHeight: '34px', backgroundColor: '#E31B23' }}
          >
            ↑
          </div>
          <div className="flex flex-col">
            <span className="text-[15px] font-extrabold tracking-tight text-[#111827] leading-none">
              UpShift
            </span>
            <span className="text-[10px] font-mono font-bold tracking-[0.14em] text-[#6B7280] uppercase mt-1">
              Opportunities
            </span>
          </div>
        </Link>

        {/* Learner Track Badges */}
        {enrolledCourses.length > 0 && (
          <div className="hidden md:flex items-center gap-2 pl-4 border-l border-[#E5E7EB]">
            {enrolledCourses.map((c) => (
              <span
                key={c.id}
                className="learner-badge-track"
                style={{
                  backgroundColor: c.bg_color || 'rgba(227, 27, 35, 0.1)',
                  color: c.color || '#E31B23',
                  border: `1px solid ${c.color ? `${c.color}33` : 'rgba(227, 27, 35, 0.25)'}`,
                }}
                title={`Enrolled Track: ${c.code} — ${c.name}`}
              >
                <Sparkles className="w-3 h-3" />
                <span>{c.code} · {c.name}</span>
              </span>
            ))}
          </div>
        )}
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
          <Globe className="w-4 h-4 text-[#4B5563]" />
          <span>Public Site</span>
        </Link>

        {/* Sign Out */}
        <button
          type="button"
          onClick={handleSignOut}
          className="learner-btn-secondary hover:text-[#E31B23] hover:border-[#FECACA]"
          title="Sign out of UpShift"
        >
          <LogOut className="w-4 h-4 text-[#4B5563]" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
}
