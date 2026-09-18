import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, CheckCircle2, ArrowUpRight, Target, Sparkles, Layers, Briefcase, Users } from 'lucide-react';

export default function ProgramDetailModal({ program, onClose }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Trigger entrance animation smoothly on next frame
    const timer = requestAnimationFrame(() => setIsOpen(true));
    
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleClose();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      cancelAnimationFrame(timer);
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      onClose();
    }, 240);
  };

  const handleEnrollClick = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    onClose();
    const trackParam = program.id || program.code?.toLowerCase();
    navigate(`/enroll?track=${trackParam}`);
  };

  if (!program) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      style={{
        backgroundColor: isOpen ? 'rgba(0, 0, 0, 0.45)' : 'rgba(0, 0, 0, 0)',
        backdropFilter: isOpen ? 'blur(6px)' : 'blur(0px)',
        transition: 'background-color 0.25s ease-out, backdrop-filter 0.25s ease-out',
      }}
      onClick={handleClose}
    >
      {/* Modal Container */}
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] bg-[#141414] text-white rounded-2xl border border-white/10 shadow-2xl overflow-y-auto flex flex-col"
        style={{
          transform: isOpen ? 'scale(1) translateY(0)' : 'scale(0.96) translateY(20px)',
          opacity: isOpen ? 1 : 0,
          transition: 'transform 0.32s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.26s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 z-10 bg-[#141414]/95 backdrop-blur-md px-6 sm:px-8 py-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span 
              className="px-2.5 py-1 rounded text-xs font-mono font-bold uppercase tracking-wider"
              style={{ backgroundColor: `${program.color}25`, color: program.color, border: `1px solid ${program.color}40` }}
            >
              {program.code}
            </span>
            <span className="font-display text-sm font-semibold text-white/70">
              {program.category}
            </span>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Title & Tagline */}
          <div 
            style={{
              opacity: isOpen ? 1 : 0,
              transform: isOpen ? 'translateY(0)' : 'translateY(12px)',
              transition: 'all 0.35s ease-out 0.05s',
            }}
          >
            <span className="text-xs font-bold uppercase tracking-wider text-[#E31B23] mb-2 block">
              Flagship Capability Track
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-white mb-3">
              {program.name}
            </h2>
            <p className="font-display text-xl text-white/80 font-medium">
              "{program.tagline}"
            </p>
            <p className="mt-4 text-base text-white/70 leading-relaxed max-w-3xl">
              {program.overview}
            </p>
          </div>

          {/* Value Prop Banner */}
          <div 
            className="p-5 rounded-xl border flex items-start gap-4"
            style={{ 
              backgroundColor: `${program.color}15`, 
              borderColor: `${program.color}40`,
              opacity: isOpen ? 1 : 0,
              transform: isOpen ? 'translateY(0)' : 'translateY(12px)',
              transition: 'all 0.35s ease-out 0.1s',
            }}
          >
            <Target size={24} style={{ color: program.color, flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h4 className="font-display text-sm font-bold uppercase tracking-wide text-white mb-1">
                The Practical Outcome
              </h4>
              <p className="text-sm text-white/90 leading-relaxed">
                {program.oneSentence}
              </p>
            </div>
          </div>

          {/* Grid: What You Learn vs What You Build */}
          <div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            style={{
              opacity: isOpen ? 1 : 0,
              transform: isOpen ? 'translateY(0)' : 'translateY(12px)',
              transition: 'all 0.35s ease-out 0.15s',
            }}
          >
            {/* Skills Developed */}
            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={18} className="text-[#E31B23]" />
                <h3 className="font-display text-base font-bold text-white">
                  Skills Developed
                </h3>
              </div>
              <ul className="space-y-2.5">
                {program.skills.map((skill, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-white/70">
                    <CheckCircle2 size={16} className="text-[#059669] shrink-0 mt-0.5" />
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* What You Build */}
            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <Layers size={18} className="text-[#2563EB]" />
                <h3 className="font-display text-base font-bold text-white">
                  Commercial Deliverables
                </h3>
              </div>
              <ul className="space-y-2.5">
                {program.whatYouBuild.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-white/70">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] shrink-0 mt-2" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Real-World Challenges */}
          <div 
            className="p-6 rounded-xl border border-white/10 bg-white/5"
            style={{
              opacity: isOpen ? 1 : 0,
              transform: isOpen ? 'translateY(0)' : 'translateY(12px)',
              transition: 'all 0.35s ease-out 0.2s',
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Briefcase size={18} className="text-[#059669]" />
              <h3 className="font-display text-base font-bold text-white">
                Applied Cohort Challenges
              </h3>
            </div>
            <div className="space-y-3">
              {program.exampleChallenges.map((challenge, i) => (
                <div key={i} className="p-3.5 rounded-lg bg-black/40 text-sm text-white/75 font-mono leading-relaxed border border-white/5">
                  <span className="text-white font-bold mr-2">CHALLENGE #{i + 1}:</span>
                  {challenge}
                </div>
              ))}
            </div>
          </div>

          {/* Modal Footer / CTA */}
          <div 
            className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4"
            style={{
              opacity: isOpen ? 1 : 0,
              transform: isOpen ? 'translateY(0)' : 'translateY(12px)',
              transition: 'all 0.35s ease-out 0.25s',
            }}
          >
            <div className="flex items-center gap-2 text-xs font-mono text-white/50">
              <Users size={16} />
              <span>{program.whoItsFor}</span>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleClose}
                className="btn btn-secondary btn-md w-full sm:w-auto cursor-pointer"
                style={{ backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#FFFFFF', cursor: 'pointer' }}
              >
                Close Preview
              </button>
              <button
                type="button"
                onClick={handleEnrollClick}
                className="btn btn-primary btn-md w-full sm:w-auto text-center cursor-pointer"
                style={{ 
                  backgroundColor: '#E31B23', 
                  borderRadius: '9999px', 
                  color: '#FFFFFF', 
                  fontWeight: '700',
                  border: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '10px 22px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(227, 27, 35, 0.4)'
                }}
              >
                <span>Enroll in This Track</span>
                <ArrowUpRight size={16} className="btn-arrow" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
