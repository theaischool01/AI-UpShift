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
      className="relative select-none text-white overflow-hidden"
      style={{ backgroundColor: '#080808', color: '#FFFFFF' }}
    >
      {/* Top Subtle Red Gradient Line Accent */}
      <div 
        className="w-full h-[1px]" 
        style={{
          background: 'linear-gradient(90deg, rgba(227, 27, 35, 0.9) 0%, rgba(227, 27, 35, 0.3) 25%, rgba(255, 255, 255, 0.1) 70%, transparent 100%)'
        }}
      />

      <div className="w-full max-w-[1280px] mx-auto px-6 py-12 md:py-14">
        
        {/* Main Content Row */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-10 md:gap-16 pb-10 border-b border-white/10">
          
          {/* LEFT: Brand Identity & Description */}
          <div className="max-w-md">
            <div className="flex items-center gap-2 mb-3">
              <span className="font-mono text-xs font-extrabold tracking-widest text-white uppercase">
                THE AI SCHOOL
              </span>
              <span className="text-[#6B7280] font-medium">/</span>
              <span className="font-heading text-2xl font-black tracking-tight text-[#E31B23]">
                UpShift
              </span>
            </div>

            <p className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-1.5">
              Proof-of-work platform.
            </p>
            <p className="text-xs text-[#9CA3AF] font-sans leading-relaxed">
              Applied capability platform engineered around commercial proof of work.
            </p>
            <p className="text-xs text-[#6B7280] font-sans leading-relaxed mt-1">
              Global presence across India, Philippines, and USA.
            </p>

            <div className="mt-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#E31B23]" />
              <span className="text-[10.5px] font-mono text-[#9CA3AF] uppercase tracking-wider">
                Proof Engine Operational
              </span>
            </div>
          </div>

          {/* RIGHT: Clean Navigation Columns */}
          <div className="flex gap-16 sm:gap-24">
            
            {/* COLUMN 1: EXPLORE */}
            <div>
              <h4 className="font-mono text-[11px] font-bold tracking-widest text-[#E31B23] uppercase mb-4">
                EXPLORE
              </h4>
              <ul className="list-none p-0 m-0 space-y-2.5 text-xs font-mono uppercase tracking-wider">
                <li>
                  <button 
                    onClick={() => handleNavigate('programs')} 
                    className="cursor-pointer text-left transition-colors duration-200"
                    style={{ color: '#E5E7EB' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#E31B23'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#E5E7EB'}
                  >
                    Programs
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleNavigate('how-it-works')} 
                    className="cursor-pointer text-left transition-colors duration-200"
                    style={{ color: '#E5E7EB' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#E31B23'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#E5E7EB'}
                  >
                    How It Works
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleNavigate('proof')} 
                    className="cursor-pointer text-left transition-colors duration-200"
                    style={{ color: '#E5E7EB' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#E31B23'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#E5E7EB'}
                  >
                    The Receipt
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleNavigate('opportunities')} 
                    className="cursor-pointer text-left transition-colors duration-200"
                    style={{ color: '#E5E7EB' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#E31B23'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#E5E7EB'}
                  >
                    Opportunities
                  </button>
                </li>
              </ul>
            </div>

            {/* COLUMN 2: UPSHIFT */}
            <div>
              <h4 className="font-mono text-[11px] font-bold tracking-widest text-[#E31B23] uppercase mb-4">
                UPSHIFT
              </h4>
              <ul className="list-none p-0 m-0 space-y-2.5 text-xs font-mono uppercase tracking-wider">
                <li>
                  <Link 
                    to="/enroll" 
                    className="transition-colors duration-200 inline-block"
                    style={{ color: '#E5E7EB', textDecoration: 'none' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#E31B23'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#E5E7EB'}
                  >
                    Enroll
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/login" 
                    className="transition-colors duration-200 inline-block"
                    style={{ color: '#E5E7EB', textDecoration: 'none' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#E31B23'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#E5E7EB'}
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/login" 
                    className="transition-colors duration-200 inline-block"
                    style={{ color: '#E5E7EB', textDecoration: 'none' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#E31B23'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#E5E7EB'}
                  >
                    Workspace
                  </Link>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* Bottom Legal Row */}
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11.5px] font-mono text-[#9CA3AF]">
          <p className="m-0">© {new Date().getFullYear()} UpShift by The AI School. All rights reserved.</p>
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
