import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

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
      className="relative select-none text-white pt-12 pb-8 overflow-hidden"
      style={{ 
        backgroundColor: '#080808', 
        backgroundImage: 'radial-gradient(ellipse at 85% 90%, rgba(227, 27, 35, 0.14) 0%, rgba(8, 8, 8, 0.95) 60%, #080808 100%)',
        color: '#FFFFFF' 
      }}
    >
      {/* Top Subtle Red Accent Gradient Line */}
      <div 
        className="absolute top-0 left-0 right-0 h-[1px] pointer-events-none" 
        style={{
          background: 'linear-gradient(90deg, rgba(227, 27, 35, 0.9) 0%, rgba(227, 27, 35, 0.35) 30%, rgba(255, 255, 255, 0.1) 70%, transparent 100%)'
        }}
      />

      <div className="w-full max-w-[1280px] mx-auto px-6 relative z-10">
        
        {/* ============================================================ */}
        {/* 1. TOP HIGH-CONVERSION CTA BAND (NO WATERMARK OVERLAP EVER)  */}
        {/* ============================================================ */}
        <div className="relative z-10 pb-10 mb-10 border-b border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 bg-transparent overflow-hidden">
          <div className="max-w-xl">
            <h3 className="text-xl sm:text-2xl font-heading font-extrabold tracking-tight text-white mb-1">
              Ready to UpShift?
            </h3>
            <p className="text-xs sm:text-sm text-[#9CA3AF] font-display">
              Turn your AI knowledge into commercial proof of work.
            </p>
          </div>

          <Link 
            to="/enroll"
            className="inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-full font-mono text-xs font-extrabold uppercase tracking-wider text-white bg-[#E31B23] hover:bg-[#CC141C] transition-all duration-200 shadow-[0_4px_16px_rgba(227,27,35,0.45)] hover:shadow-[0_6px_22px_rgba(227,27,35,0.65)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            style={{ textDecoration: 'none' }}
          >
            <span>Enroll Now</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* ============================================================ */}
        {/* 2. BALANCED FOUR-COLUMN LAYOUT (WATERMARK SCOPED HERE ONLY) */}
        {/* ============================================================ */}
        <div className="relative pb-12 border-b border-white/10 overflow-hidden">
          
          {/* Barely-visible Oversized Background Watermark (Strictly scoped to 4-column section) */}
          <div 
            aria-hidden="true"
            style={{
              position: 'absolute',
              bottom: '-10px',
              right: '-10px',
              pointerEvents: 'none',
              userSelect: 'none',
              fontSize: '130px',
              fontWeight: 900,
              letterSpacing: '-0.05em',
              color: 'rgba(255, 255, 255, 0.025)',
              lineHeight: 1,
              zIndex: 0,
              fontFamily: 'var(--font-heading), sans-serif'
            }}
          >
            UPSHIFT
          </div>

          {/* 4 COLUMNS GRID (Elevated above watermark with z-10) */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            
            {/* COLUMN 1: BRAND IDENTITY */}
            <div className="flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-mono text-xs font-extrabold tracking-widest text-white uppercase">
                    THE AI SCHOOL
                  </span>
                  <span className="text-[#6B7280] font-medium">/</span>
                  <span className="font-heading text-xl font-black tracking-tight text-[#E31B23]">
                    UpShift
                  </span>
                </div>

                <p className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-1.5">
                  Proof-of-work platform.
                </p>
                <p className="text-xs text-[#9CA3AF] font-sans leading-relaxed">
                  Applied capability platform engineered around commercial proof of work.
                </p>
                <p className="text-xs text-[#6B7280] font-sans leading-relaxed mt-2 font-mono">
                  India · Philippines · USA
                </p>
              </div>

              {/* STATUS BADGE */}
              <div className="mt-5 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-[#E31B23]/25 w-fit">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" style={{ boxShadow: '0 0 8px #10B981' }} />
                <span className="text-[10px] font-mono text-[#D1D5DB] uppercase tracking-wider font-semibold">
                  Proof Engine Operational
                </span>
              </div>
            </div>

            {/* COLUMN 2: EXPLORE */}
            <div>
              <h4 className="font-mono text-[11px] font-bold tracking-widest text-[#E31B23] uppercase mb-4 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E31B23]" />
                <span>EXPLORE</span>
              </h4>
              <ul className="list-none p-0 m-0 space-y-2.5 text-xs font-mono uppercase tracking-wider">
                <li>
                  <button 
                    onClick={() => handleNavigate('programs')} 
                    className="cursor-pointer text-left transition-colors duration-200 block"
                    style={{ color: '#D1D5DB', background: 'none', border: 'none', padding: 0 }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#E31B23'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#D1D5DB'}
                  >
                    Programs
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleNavigate('how-it-works')} 
                    className="cursor-pointer text-left transition-colors duration-200 block"
                    style={{ color: '#D1D5DB', background: 'none', border: 'none', padding: 0 }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#E31B23'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#D1D5DB'}
                  >
                    How It Works
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleNavigate('proof')} 
                    className="cursor-pointer text-left transition-colors duration-200 block"
                    style={{ color: '#D1D5DB', background: 'none', border: 'none', padding: 0 }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#E31B23'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#D1D5DB'}
                  >
                    The Receipt
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleNavigate('opportunities')} 
                    className="cursor-pointer text-left transition-colors duration-200 block"
                    style={{ color: '#D1D5DB', background: 'none', border: 'none', padding: 0 }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#E31B23'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#D1D5DB'}
                  >
                    Opportunities
                  </button>
                </li>
              </ul>
            </div>

            {/* COLUMN 3: UPSHIFT */}
            <div>
              <h4 className="font-mono text-[11px] font-bold tracking-widest text-[#E31B23] uppercase mb-4 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E31B23]" />
                <span>UPSHIFT</span>
              </h4>
              <ul className="list-none p-0 m-0 space-y-2.5 text-xs font-mono uppercase tracking-wider">
                <li>
                  <Link 
                    to="/enroll" 
                    className="transition-colors duration-200 inline-block"
                    style={{ color: '#D1D5DB', textDecoration: 'none' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#E31B23'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#D1D5DB'}
                  >
                    Enroll
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/login" 
                    className="transition-colors duration-200 inline-block"
                    style={{ color: '#D1D5DB', textDecoration: 'none' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#E31B23'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#D1D5DB'}
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/login" 
                    className="transition-colors duration-200 inline-block"
                    style={{ color: '#D1D5DB', textDecoration: 'none' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#E31B23'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#D1D5DB'}
                  >
                    Workspace
                  </Link>
                </li>
              </ul>
            </div>

            {/* COLUMN 4: STUDIO */}
            <div>
              <h4 className="font-mono text-[11px] font-bold tracking-widest text-[#E31B23] uppercase mb-4 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E31B23]" />
                <span>STUDIO</span>
              </h4>
              <ul className="list-none p-0 m-0 space-y-2.5 text-xs font-mono uppercase tracking-wider">
                <li>
                  <span 
                    className="transition-colors duration-200 cursor-pointer inline-block"
                    style={{ color: '#D1D5DB' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#E31B23'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#D1D5DB'}
                  >
                    Terms of Study
                  </span>
                </li>
                <li>
                  <span 
                    className="transition-colors duration-200 cursor-pointer inline-block"
                    style={{ color: '#D1D5DB' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#E31B23'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#D1D5DB'}
                  >
                    Privacy Policy
                  </span>
                </li>
                <li>
                  <span 
                    className="transition-colors duration-200 cursor-pointer inline-block"
                    style={{ color: '#D1D5DB' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#E31B23'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#D1D5DB'}
                  >
                    Honor Code
                  </span>
                </li>
                <li>
                  <span 
                    className="transition-colors duration-200 cursor-pointer inline-block"
                    style={{ color: '#D1D5DB' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#E31B23'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#D1D5DB'}
                  >
                    Contact Studio
                  </span>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* ============================================================ */}
        {/* 3. MINIMAL BOTTOM LEGAL BAR                                  */}
        {/* ============================================================ */}
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11.5px] font-mono text-[#9CA3AF]">
          <p className="m-0">© {new Date().getFullYear()} UpShift by The AI School. All rights reserved.</p>
          <div className="flex items-center gap-3 text-[#9CA3AF]">
            <span className="hover:text-[#E31B23] transition-colors cursor-pointer">Terms</span>
            <span className="text-[#4B5563]">·</span>
            <span className="hover:text-[#E31B23] transition-colors cursor-pointer">Privacy</span>
            <span className="text-[#4B5563]">·</span>
            <span className="hover:text-[#E31B23] transition-colors cursor-pointer">Honor Code</span>
            <span className="text-[#4B5563]">·</span>
            <span className="hover:text-[#E31B23] transition-colors cursor-pointer">Contact</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
