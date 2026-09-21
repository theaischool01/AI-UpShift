import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Layers, 
  Award,
  Zap
} from 'lucide-react';
import { PROGRAMS_DATA } from '../data/programsData';

export default function ProgramDetailModal({ program, onClose }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  
  // Find initial index from the provided program prop (fallback to 0)
  const initialIndex = useMemo(() => {
    if (!program) return 0;
    const foundIdx = PROGRAMS_DATA.findIndex(
      (p) => p.id === program.id || p.code === program.code || p.name.toLowerCase() === program.name?.toLowerCase()
    );
    return foundIdx !== -1 ? foundIdx : 0;
  }, [program]);

  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [isAnimatingTransition, setIsAnimatingTransition] = useState(false);

  // Sync activeIndex if program prop changes
  useEffect(() => {
    setActiveIndex(initialIndex);
  }, [initialIndex]);

  // Handle modal entrance animation
  useEffect(() => {
    const timer = requestAnimationFrame(() => setIsOpen(true));
    document.body.style.overflow = 'hidden';

    return () => {
      cancelAnimationFrame(timer);
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => {
      onClose();
    }, 200);
  }, [onClose]);

  // Navigate between modules
  const handleSelectModule = useCallback((newIndex) => {
    if (newIndex === activeIndex || isAnimatingTransition) return;
    setIsAnimatingTransition(true);
    setTimeout(() => {
      setActiveIndex(newIndex);
      setIsAnimatingTransition(false);
    }, 140);
  }, [activeIndex, isAnimatingTransition]);

  const handlePrev = useCallback(() => {
    const prevIdx = (activeIndex - 1 + PROGRAMS_DATA.length) % PROGRAMS_DATA.length;
    handleSelectModule(prevIdx);
  }, [activeIndex, handleSelectModule]);

  const handleNext = useCallback(() => {
    const nextIdx = (activeIndex + 1) % PROGRAMS_DATA.length;
    handleSelectModule(nextIdx);
  }, [activeIndex, handleSelectModule]);

  // Keyboard navigation: ESC to close, Arrow keys to navigate
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleClose, handlePrev, handleNext]);

  const currentProgram = PROGRAMS_DATA[activeIndex] || PROGRAMS_DATA[0];

  const handleEnrollClick = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    onClose();
    const trackParam = currentProgram.id || currentProgram.code?.toLowerCase();
    navigate(`/enroll?track=${trackParam}`);
  };

  if (!program && !currentProgram) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6"
      style={{
        backgroundColor: isOpen ? 'rgba(0, 0, 0, 0.35)' : 'rgba(0, 0, 0, 0)',
        backdropFilter: isOpen ? 'blur(6px)' : 'blur(0px)',
        transition: 'background-color 0.25s ease-out, backdrop-filter 0.25s ease-out',
      }}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${currentProgram.name} landing details`}
    >
      {/* ============================================================ */}
      {/* PURE WHITE THEME LANDING EXPERIENCE PANEL                   */}
      {/* ============================================================ */}
      <div 
        className="relative w-full max-w-[1380px] max-h-[90vh] bg-white text-[#111827] rounded-2xl sm:rounded-3xl border border-[#E5E7EB] shadow-2xl flex flex-col overflow-hidden"
        style={{
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.18), 0 0 35px -5px rgba(227, 27, 35, 0.08)',
          transform: isOpen ? 'scale(1) translateY(0)' : 'scale(0.97) translateY(16px)',
          opacity: isOpen ? 1 : 0,
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Row (White Editorial Bar) */}
        <div className="shrink-0 px-5 sm:px-8 py-3.5 sm:py-4 border-b border-[#E5E7EB] flex items-center justify-between bg-[#FFFFFF] z-20">
          {/* Left: Module Code & Track Identity */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <span 
              className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-extrabold uppercase tracking-wider"
              style={{ 
                backgroundColor: '#FFF1F1', 
                color: '#E31B23', 
                border: '1px solid #FECACA' 
              }}
            >
              {currentProgram.code}
            </span>
            <span className="font-heading text-sm sm:text-base font-extrabold tracking-tight uppercase text-[#111827]">
              {currentProgram.name}
            </span>
            <span className="hidden sm:inline-block text-[#9CA3AF] text-xs">·</span>
            <span className="hidden sm:inline-block font-mono text-xs text-[#6B7280] uppercase tracking-wider font-semibold">
              {currentProgram.category}
            </span>
          </div>

          {/* Right: Prominent White Close Button with Red Hover */}
          <button
            onClick={handleClose}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white hover:bg-[#FFF1F1] text-[#4B5563] hover:text-[#E31B23] flex items-center justify-center transition-all duration-200 border border-[#E5E7EB] hover:border-[#FECACA] cursor-pointer shadow-sm"
            aria-label="Close module details"
          >
            <X size={18} strokeWidth={2.2} />
          </button>
        </div>

        {/* Scrollable Mini Landing Page Content Area */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 lg:p-9 bg-white">
          <div 
            className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start transition-all duration-200"
            style={{
              opacity: isAnimatingTransition ? 0.35 : 1,
              transform: isAnimatingTransition ? 'translateY(6px)' : 'translateY(0)',
              minWidth: 0,
            }}
          >
            {/* ============================================================ */}
            {/* LEFT COLUMN: Dominant Cinematic Module Image (5 cols)       */}
            {/* ============================================================ */}
            <div className="lg:col-span-6 w-full flex flex-col items-center justify-start min-w-0">
              <div 
                className="relative w-full rounded-2xl overflow-hidden border border-[#E5E7EB] shadow-md group flex items-center justify-center bg-[#F9FAFB]"
                style={{
                  aspectRatio: '16 / 9.6',
                  maxHeight: '440px',
                  boxShadow: '0 8px 30px -4px rgba(0, 0, 0, 0.06), 0 0 20px -2px rgba(227, 27, 35, 0.05)',
                }}
              >
                {/* Subtle Ambient Behind Artwork Glow */}
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle at 50% 50%, rgba(227, 27, 35, 0.06) 0%, transparent 70%)',
                  }}
                  aria-hidden="true"
                />

                {/* Dominant High-Res Module Image */}
                <img
                  src={currentProgram.image}
                  alt={currentProgram.name}
                  className="w-full h-full object-contain relative z-10 block select-none pointer-events-none transition-transform duration-500 group-hover:scale-[1.01]"
                  loading="eager"
                  draggable={false}
                />

                {/* Corner Applied Track Badge */}
                <div 
                  className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.92)',
                    color: '#111827',
                    border: '1px solid #E5E7EB',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.06)',
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E31B23]" />
                  <span>4 WEEKS APPLIED TRACK</span>
                </div>
              </div>

              {/* Verified Proof Capstone Badge under Image */}
              {currentProgram.sampleArtifact && (
                <div 
                  className="w-full mt-3 px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#EAE7E1] flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2 text-[#4B5563] font-mono text-[11px] shrink-0">
                    <Award size={14} className="text-[#E31B23]" />
                    <span className="uppercase tracking-wider font-bold">Verified Capstone:</span>
                  </div>
                  <span className="text-[#111827] font-semibold truncate ml-2">
                    {currentProgram.sampleArtifact.title}
                  </span>
                </div>
              )}
            </div>

            {/* ============================================================ */}
            {/* RIGHT COLUMN: Editorial Module Content (7 cols)             */}
            {/* ============================================================ */}
            <div className="lg:col-span-6 w-full flex flex-col justify-start min-w-0">
              {/* Category & Badge */}
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[11px] font-mono font-extrabold tracking-widest text-[#E31B23] uppercase">
                  {currentProgram.code} · {currentProgram.category}
                </span>
              </div>

              {/* Big Module Title */}
              <h2 className="font-heading text-2xl sm:text-3xl lg:text-[32px] font-extrabold text-[#111827] tracking-tight leading-[1.15] mb-2">
                {currentProgram.name}
              </h2>

              {/* One-Line Value Statement / Tagline */}
              <p className="font-display text-sm sm:text-[15px] font-bold text-[#E31B23] tracking-wide mb-2.5">
                "{currentProgram.tagline}"
              </p>

              {/* Short Editorial Description */}
              <p className="text-xs sm:text-[13.5px] text-[#4B5563] font-sans leading-relaxed mb-5 max-w-[650px]">
                {currentProgram.overview || currentProgram.oneSentence}
              </p>

              {/* KEY CAPABILITIES: Unconstrained 2-Column Responsive Card Grid */}
              <div className="mb-5 w-full min-w-0">
                <div className="flex items-center gap-1.5 mb-2.5">
                  <Sparkles size={13} className="text-[#E31B23]" />
                  <span className="text-[11px] font-mono font-extrabold uppercase tracking-widest text-[#111827]">
                    KEY CAPABILITIES
                  </span>
                </div>
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2 min-w-0">
                  {currentProgram.skills.slice(0, 6).map((skill, i) => (
                    <div 
                      key={i}
                      className="w-full min-w-0 px-3 py-2 rounded-lg bg-[#FAF9F6] border border-[#E7E4DF] text-xs font-semibold text-[#1F2937] flex items-center gap-2.5 transition-colors hover:border-[#FECACA] hover:bg-[#FFF9F9]"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E31B23] shrink-0" />
                      <span className="truncate">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* COMMERCIAL DELIVERABLES: Clean Numbered Rows */}
              <div className="mb-6 w-full min-w-0">
                <div className="flex items-center gap-1.5 mb-2.5">
                  <Layers size={13} className="text-[#E31B23]" />
                  <span className="text-[11px] font-mono font-extrabold uppercase tracking-widest text-[#111827]">
                    COMMERCIAL DELIVERABLES
                  </span>
                </div>
                <div className="space-y-2 w-full min-w-0">
                  {currentProgram.whatYouBuild.slice(0, 3).map((item, i) => (
                    <div 
                      key={i}
                      className="w-full min-w-0 px-3.5 py-2 rounded-lg bg-[#FFFFFF] border border-[#E5E7EB] text-xs font-medium text-[#374151] flex items-center gap-3 shadow-2xs hover:border-[#FECACA]"
                    >
                      <span className="font-mono text-xs font-extrabold text-[#E31B23] shrink-0">
                        0{i + 1}
                      </span>
                      <span className="truncate font-semibold text-[#111827]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Area: Primary UPShift Red CTA */}
              <div className="flex items-center gap-4 flex-wrap pt-1">
                <button
                  type="button"
                  onClick={handleEnrollClick}
                  className="group cursor-pointer"
                  style={{
                    backgroundColor: '#E31B23',
                    color: '#FFFFFF',
                    fontWeight: '700',
                    fontSize: '13px',
                    fontFamily: 'var(--font-heading), sans-serif',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    padding: '12px 28px',
                    borderRadius: '9999px',
                    border: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 16px rgba(227, 27, 35, 0.35)',
                    transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#FF242D';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 22px rgba(227, 27, 35, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#E31B23';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(227, 27, 35, 0.35)';
                  }}
                >
                  <span>VIEW TRACK DETAILS</span>
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                </button>

                <div className="text-[11.5px] font-mono text-[#6B7280] font-semibold flex items-center gap-1.5">
                  <Zap size={13} className="text-[#E31B23]" />
                  <span>Verified Cohort Intake</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* BOTTOM MODULE-TO-MODULE NAVIGATION (Matching Testimonial)    */}
        {/* ============================================================ */}
        <div className="shrink-0 px-6 py-3.5 border-t border-[#E5E7EB] bg-[#FAF9F6] flex items-center justify-between z-20">
          {/* Previous Arrow Button */}
          <button
            type="button"
            onClick={handlePrev}
            className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#4B5563] hover:text-[#E31B23] transition-colors cursor-pointer px-3 py-1.5 rounded-lg border border-[#E5E7EB] bg-white hover:border-[#FECACA]"
            aria-label="Previous module"
          >
            <ChevronLeft size={16} />
            <span className="hidden sm:inline">PREV</span>
          </button>

          {/* 6 Interactive Pagination Dots matching Testimonial Style */}
          <div 
            className="flex items-center justify-center gap-2"
            role="tablist"
            aria-label="Module Selection Navigation"
          >
            {PROGRAMS_DATA.map((prog, idx) => {
              const isActive = activeIndex === idx;
              return (
                <button
                  key={`module-dot-${prog.id || idx}`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Go to ${prog.code} ${prog.name}`}
                  onClick={() => handleSelectModule(idx)}
                  style={{
                    width: isActive ? '20px' : '8px',
                    height: '8px',
                    borderRadius: '9999px',
                    backgroundColor: isActive ? '#E31B23' : '#CBD5E1',
                    border: isActive ? '1px solid #E31B23' : '1px solid #94A3B8',
                    boxShadow: isActive ? '0 1px 6px rgba(227, 27, 35, 0.45)' : 'none',
                    padding: 0,
                    cursor: 'pointer',
                    outline: 'none',
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = '#E31B23';
                      e.currentTarget.style.borderColor = '#E31B23';
                      e.currentTarget.style.transform = 'scale(1.2)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = '#CBD5E1';
                      e.currentTarget.style.borderColor = '#94A3B8';
                      e.currentTarget.style.transform = 'scale(1)';
                    }
                  }}
                />
              );
            })}
          </div>

          {/* Next Arrow Button */}
          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#4B5563] hover:text-[#E31B23] transition-colors cursor-pointer px-3 py-1.5 rounded-lg border border-[#E5E7EB] bg-white hover:border-[#FECACA]"
            aria-label="Next module"
          >
            <span className="hidden sm:inline">NEXT</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
