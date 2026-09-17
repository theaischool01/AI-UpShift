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
      className="relative py-12 border-t border-white/10 select-none"
      style={{ backgroundColor: '#0A0A0A', color: '#FFFFFF' }}
    >
      <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* Main Content Grid (Compact 2-Column Desktop Layout) */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-10 pb-10 border-b border-white/10">
          
          {/* LEFT: Brand Block */}
          <div className="max-w-md">
            <div className="flex items-center gap-2 mb-3">
              <span className="font-display text-xs font-bold tracking-widest text-white uppercase">
                THE AI SCHOOL
              </span>
              <span className="text-[#6B7280]">/</span>
              <span className="font-heading text-lg font-bold tracking-tight text-[#E31B23]">
                UpShift
              </span>
            </div>

            <p className="text-xs font-bold text-white mb-1">
              Proof-of-work platform.
            </p>
            <p className="text-xs text-[#9CA3AF] leading-relaxed">
              Applied capability platform engineered around commercial proof of work.
            </p>
            <p className="text-xs text-[#9CA3AF] leading-relaxed mt-0.5">
              Global presence across India, Philippines, and USA.
            </p>
          </div>

          {/* RIGHT: Clean Navigation Columns */}
          <div className="flex gap-16 sm:gap-24">
            
            {/* EXPLORE */}
            <div>
              <h4 className="font-mono text-[11px] font-bold tracking-widest text-[#9CA3AF] uppercase mb-3">
                EXPLORE
              </h4>
              <ul className="space-y-2 text-xs font-display text-[#D1D5DB]">
                <li>
                  <button 
                    onClick={() => handleNavigate('programs')} 
                    className="hover:text-[#E31B23] transition-colors cursor-pointer text-left"
                  >
                    Programs
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleNavigate('how-it-works')} 
                    className="hover:text-[#E31B23] transition-colors cursor-pointer text-left"
                  >
                    How It Works
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleNavigate('proof')} 
                    className="hover:text-[#E31B23] transition-colors cursor-pointer text-left"
                  >
                    The Receipt
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleNavigate('opportunities')} 
                    className="hover:text-[#E31B23] transition-colors cursor-pointer text-left"
                  >
                    Opportunities
                  </button>
                </li>
              </ul>
            </div>

            {/* UPSHIFT */}
            <div>
              <h4 className="font-mono text-[11px] font-bold tracking-widest text-[#9CA3AF] uppercase mb-3">
                UPSHIFT
              </h4>
              <ul className="space-y-2 text-xs font-display text-[#D1D5DB]">
                <li>
                  <Link 
                    to="/enroll" 
                    className="hover:text-[#E31B23] transition-colors"
                  >
                    Enroll
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/login" 
                    className="hover:text-[#E31B23] transition-colors"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/login" 
                    className="hover:text-[#E31B23] transition-colors"
                  >
                    Workspace
                  </Link>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] font-display text-[#9CA3AF]">
          <p>© {new Date().getFullYear()} UpShift by The AI School. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
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
