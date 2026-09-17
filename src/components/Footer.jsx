import React from 'react';

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
    <footer className="bg-[#FAF8F5] text-[#111111] relative py-12 border-t border-[#E5E7EB]">
      <div className="container" style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Main Footer Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 pb-10 border-b border-[#E5E7EB]">
          {/* Brand Identity */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-display text-xs font-extrabold tracking-wider text-[#E31B23] uppercase">
                THE AI SCHOOL
              </span>
              <span className="text-[#9CA3AF]">/</span>
              <span className="font-heading text-xl font-black tracking-tight text-[#111111]">
                UPSHIFT<span className="text-[#E31B23]">↑</span>
              </span>
            </div>
            <p className="text-xs text-[#6B7280] font-display max-w-md leading-relaxed">
              Applied capability platform engineered around commercial proof of work. Global presence across India, Philippines, and USA.
            </p>
          </div>

          {/* Quick Navigation Anchors */}
          <div className="flex flex-wrap items-center gap-6 text-xs font-mono uppercase tracking-wider text-[#4B5563]">
            <button 
              onClick={() => handleNavigate('programs')} 
              className="hover:text-[#E31B23] transition-colors cursor-pointer"
            >
              Programs
            </button>
            <button 
              onClick={() => handleNavigate('how-it-works')} 
              className="hover:text-[#E31B23] transition-colors cursor-pointer"
            >
              How It Works
            </button>
            <button 
              onClick={() => handleNavigate('proof')} 
              className="hover:text-[#E31B23] transition-colors cursor-pointer"
            >
              The Receipt
            </button>
            <button 
              onClick={() => handleNavigate('opportunities')} 
              className="hover:text-[#E31B23] transition-colors cursor-pointer"
            >
              Opportunities
            </button>
          </div>
        </div>

        {/* Bottom Legal Row */}
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11.5px] font-mono text-[#9CA3AF]">
          <p>© {new Date().getFullYear()} UPSHIFT by The AI School. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-5">
            <span className="hover:text-[#111111] transition-colors cursor-pointer">Terms of Study</span>
            <span>•</span>
            <span className="hover:text-[#111111] transition-colors cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-[#111111] transition-colors cursor-pointer">Honor Code</span>
            <span>•</span>
            <span className="hover:text-[#111111] transition-colors cursor-pointer">Contact Studio</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
