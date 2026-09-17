import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer({ onNavigate }) {
  const handleNavigate = (sectionId) => {
    if (onNavigate) {
      onNavigate(sectionId);
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer 
      className="relative pt-10 pb-8 border-t border-white/10 select-none overflow-hidden"
      style={{ backgroundColor: '#0A0A0A', color: '#FFFFFF' }}
    >
      {/* Subtle Atmospheric Red Radial Glow */}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[260px] pointer-events-none opacity-20"
        style={{
          background: 'radial-gradient(ellipse at 50% 100%, rgba(227, 27, 35, 0.4) 0%, transparent 70%)'
        }}
      />
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />

      <div className="container relative z-10" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* ============================================================ */}
        {/* 1. TOP FOOTER STATEMENT                                      */}
        {/* ============================================================ */}
        <div className="pb-8 mb-8 border-b border-white/10 flex flex-col items-start sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span 
              className="text-2xl sm:text-3xl font-extrabold tracking-tight"
              style={{ fontFamily: 'Caveat, cursive, sans-serif' }}
            >
              <span className="text-white">BUILD.</span>{' '}
              <span className="text-white">PROVE.</span>{' '}
              <span className="text-[#E31B23]">EARN.</span>
            </span>
            <svg className="w-16 h-3 mt-1 hidden sm:block" viewBox="0 0 80 16" fill="none">
              <path d="M 5 8 Q 40 14, 75 4" stroke="#E31B23" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#E31B23] animate-pulse" />
            <span className="text-[11px] font-mono tracking-widest text-[#9CA3AF] uppercase">
              PROOF-OF-WORK ENGINE ACTIVE
            </span>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 2. MAIN BRAND & NAVIGATION GRID                               */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-10 border-b border-white/10">
          
          {/* LEFT / PRIMARY BRAND BLOCK */}
          <div className="md:col-span-6 lg:col-span-6">
            {/* Brand Title */}
            <div className="flex items-center gap-2 mb-3">
              <span className="font-display text-xs font-extrabold tracking-widest text-white uppercase">
                THE AI SCHOOL
              </span>
              <span className="text-[#6B7280] font-medium">/</span>
              <span className="font-heading text-2xl font-black tracking-tight text-[#E31B23]">
                UpShift
              </span>
            </div>

            {/* Subtitle Eyebrow */}
            <div className="inline-block text-[10.5px] font-mono font-bold tracking-widest text-[#E31B23] uppercase mb-2 px-2.5 py-0.5 rounded bg-[#E31B23]/10 border border-[#E31B23]/20">
              PROOF-OF-WORK PLATFORM.
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-[#9CA3AF] font-display leading-relaxed max-w-md mt-1">
              Applied capability platform engineered around commercial proof of work.
              <span className="block mt-1 text-[#6B7280] text-xs">
                Global presence across India, Philippines, and USA.
              </span>
            </p>
          </div>

          {/* RIGHT / NAVIGATION COLUMNS */}
          <div className="md:col-span-6 lg:col-span-6 grid grid-cols-2 gap-8">
            
            {/* COLUMN 1: EXPLORE */}
            <div>
              <h4 className="font-mono text-[11px] font-extrabold tracking-widest text-[#E31B23] uppercase mb-4">
                EXPLORE
              </h4>
              <ul className="space-y-2.5 text-xs font-mono uppercase tracking-wider text-[#D1D5DB]">
                <li>
                  <button 
                    onClick={() => handleNavigate('programs')} 
                    className="hover:text-[#E31B23] hover:translate-x-1 transition-all duration-200 cursor-pointer inline-block text-left"
                  >
                    Programs
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleNavigate('how-it-works')} 
                    className="hover:text-[#E31B23] hover:translate-x-1 transition-all duration-200 cursor-pointer inline-block text-left"
                  >
                    How It Works
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleNavigate('proof')} 
                    className="hover:text-[#E31B23] hover:translate-x-1 transition-all duration-200 cursor-pointer inline-block text-left"
                  >
                    The Receipt
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleNavigate('opportunities')} 
                    className="hover:text-[#E31B23] hover:translate-x-1 transition-all duration-200 cursor-pointer inline-block text-left"
                  >
                    Opportunities
                  </button>
                </li>
              </ul>
            </div>

            {/* COLUMN 2: UPSHIFT */}
            <div>
              <h4 className="font-mono text-[11px] font-extrabold tracking-widest text-[#E31B23] uppercase mb-4">
                UPSHIFT
              </h4>
              <ul className="space-y-2.5 text-xs font-mono uppercase tracking-wider text-[#D1D5DB]">
                <li>
                  <Link 
                    to="/enroll" 
                    className="hover:text-[#E31B23] hover:translate-x-1 transition-all duration-200 cursor-pointer inline-block"
                  >
                    Enroll
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/login" 
                    className="hover:text-[#E31B23] hover:translate-x-1 transition-all duration-200 cursor-pointer inline-block"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/login" 
                    className="hover:text-[#E31B23] hover:translate-x-1 transition-all duration-200 cursor-pointer inline-block"
                  >
                    Workspace
                  </Link>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* ============================================================ */}
        {/* 3. BOTTOM LEGAL BAR                                           */}
        {/* ============================================================ */}
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] font-mono text-[#9CA3AF]">
          <p>© {new Date().getFullYear()} UpShift by The AI School. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <span className="hover:text-white transition-colors cursor-pointer">Terms of Study</span>
            <span className="text-[#4B5563]">•</span>
            <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
            <span className="text-[#4B5563]">•</span>
            <span className="hover:text-white transition-colors cursor-pointer">Honor Code</span>
            <span className="text-[#4B5563]">•</span>
            <span className="hover:text-white transition-colors cursor-pointer">Contact Studio</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
