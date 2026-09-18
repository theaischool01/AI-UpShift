import React from 'react';
import { 
  Play, 
  Palette, 
  Database, 
  Code, 
  Megaphone, 
  Bot, 
  Sparkles 
} from 'lucide-react';
import { PROOF_PROJECTS } from '../data/proofData';

// Category Icon Map for Proof Projects
const CATEGORY_ICONS = {
  VIDEO: Play,
  DESIGN: Palette,
  DATA: Database,
  CODE: Code,
  MARKETING: Megaphone,
  AGENTS: Bot,
};

/**
 * Visual Deliverable Element for each category
 */
function VisualDeliverable({ project, isSmall }) {
  if (project.category === 'VIDEO') {
    return (
      <div 
        style={{ 
          backgroundColor: '#0E1015', 
          borderRadius: '9px', 
          padding: isSmall ? '6px 10px' : '8px 12px', 
          marginBottom: isSmall ? '12px' : '15px', 
          border: '1px solid #262832', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div 
            style={{ 
              width: isSmall ? '18px' : '22px', 
              height: isSmall ? '18px' : '22px', 
              borderRadius: '50%', 
              backgroundColor: '#E93B3B', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: '#FFFFFF' 
            }}
          >
            <Play size={isSmall ? 8 : 10} fill="white" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            <span style={{ width: '2px', height: '10px', backgroundColor: '#E93B3B', borderRadius: '2px' }} />
            <span style={{ width: '2px', height: '16px', backgroundColor: '#E93B3B', borderRadius: '2px' }} />
            <span style={{ width: '2px', height: '8px', backgroundColor: '#E93B3B', borderRadius: '2px' }} />
            <span style={{ width: '2px', height: '14px', backgroundColor: '#E93B3B', borderRadius: '2px' }} />
          </div>
          <span style={{ fontFamily: 'monospace', fontSize: isSmall ? '9px' : '10px', color: '#E93B3B', fontWeight: 700, marginLeft: '4px' }}>
            00:41 // 4K AI UPSCALED
          </span>
        </div>
        <span style={{ fontSize: '9px', fontFamily: 'monospace', color: '#9E9B95', backgroundColor: '#1A1C24', padding: '2px 6px', borderRadius: '4px' }}>
          9:16 REEL
        </span>
      </div>
    );
  }

  if (project.category === 'DESIGN') {
    return (
      <div 
        style={{ 
          backgroundColor: '#0D1424', 
          borderRadius: '8px', 
          padding: isSmall ? '6px 10px' : '8px 12px', 
          marginBottom: isSmall ? '12px' : '15px', 
          border: '1px solid #1E293B', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#C86D51', border: '1px solid rgba(255,255,255,0.4)' }} title="Terracotta" />
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#2563EB', border: '1px solid rgba(255,255,255,0.4)' }} title="Electric Blue" />
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#E2E8F0', border: '1px solid rgba(255,255,255,0.4)' }} title="Silk White" />
          <span style={{ fontFamily: 'monospace', fontSize: '9.5px', color: '#60A5FA', fontWeight: 700, marginLeft: '4px' }}>
            3D PACKAGING · LoRA SEED
          </span>
        </div>
        <span style={{ fontSize: '9px', fontFamily: 'monospace', color: '#9E9B95', backgroundColor: '#1A2338', padding: '2px 5px', borderRadius: '4px' }}>
          300 DPI
        </span>
      </div>
    );
  }

  if (project.category === 'DATA') {
    return (
      <div 
        style={{ 
          backgroundColor: '#061A14', 
          borderRadius: '8px', 
          padding: isSmall ? '6px 10px' : '8px 12px', 
          marginBottom: isSmall ? '12px' : '15px', 
          border: '1px solid #064E3B', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }} />
          <span style={{ fontFamily: 'monospace', fontSize: '9.5px', color: '#34D399', fontWeight: 700 }}>
            [1,000 JSONL CASES]
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontFamily: 'monospace', fontSize: '9.5px', color: '#10B981', fontWeight: 700 }}>
            99.8% F1 SCORE
          </span>
          <span style={{ fontSize: '9px', fontFamily: 'monospace', color: '#9E9B95', backgroundColor: '#0E2E25', padding: '2px 5px', borderRadius: '4px' }}>
            RLHF
          </span>
        </div>
      </div>
    );
  }

  if (project.category === 'CODE') {
    return (
      <div 
        style={{ 
          backgroundColor: '#121024', 
          borderRadius: '7px', 
          padding: '6px 10px', 
          marginBottom: '12px', 
          border: '1px solid #312E81', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
          <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
          <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#10B981' }} />
          <span style={{ fontFamily: 'monospace', fontSize: '9px', color: '#A5B4FC', marginLeft: '3px' }}>
            kitedesk.upshift.work
          </span>
        </div>
        <span style={{ fontFamily: 'monospace', fontSize: '8.5px', color: '#818CF8', fontWeight: 700 }}>
          REACT / VITE
        </span>
      </div>
    );
  }

  if (project.category === 'MARKETING') {
    return (
      <div 
        style={{ 
          backgroundColor: '#1F130A', 
          borderRadius: '7px', 
          padding: '6px 10px', 
          marginBottom: '12px', 
          border: '1px solid #7C2D12', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
          <span style={{ fontSize: '8px', fontFamily: 'monospace', fontWeight: 700, backgroundColor: 'rgba(251,146,60,0.2)', color: '#FB923C', padding: '1px 3px', borderRadius: '3px' }}>LI</span>
          <span style={{ fontSize: '8px', fontFamily: 'monospace', fontWeight: 700, backgroundColor: 'rgba(251,146,60,0.2)', color: '#FB923C', padding: '1px 3px', borderRadius: '3px' }}>X</span>
          <span style={{ fontSize: '8px', fontFamily: 'monospace', fontWeight: 700, backgroundColor: 'rgba(251,146,60,0.2)', color: '#FB923C', padding: '1px 3px', borderRadius: '3px' }}>META</span>
        </div>
        <span style={{ fontFamily: 'monospace', fontSize: '8.5px', color: '#FB923C', fontWeight: 700 }}>
          32 ASSETS // 5 ANGLES
        </span>
      </div>
    );
  }

  if (project.category === 'AGENTS') {
    return (
      <div 
        style={{ 
          backgroundColor: '#081816', 
          borderRadius: '9px', 
          padding: isSmall ? '6px 10px' : '8px 12px', 
          marginBottom: isSmall ? '12px' : '15px', 
          border: '1px solid #115E59', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '9.5px', fontFamily: 'monospace', color: '#2DD4BF' }}>
          <span>Form</span>
          <span style={{ color: '#0D9488' }}>→</span>
          <span>Scrape</span>
          <span style={{ color: '#0D9488' }}>→</span>
          <span>LLM</span>
          <span style={{ color: '#0D9488' }}>→</span>
          <span>Slack</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontFamily: 'monospace', fontSize: '9.5px', color: '#2DD4BF', fontWeight: 700 }}>AUTONOMOUS</span>
          <span style={{ fontSize: '9px', fontFamily: 'monospace', color: '#9E9B95', backgroundColor: '#103430', padding: '2px 5px', borderRadius: '4px' }}>1.8s</span>
        </div>
      </div>
    );
  }

  return null;
}

/**
 * Editorial Proof Card (Large, Medium, or Small variant)
 */
function ProofCard({ project, variant = 'medium' }) {
  const CatIcon = CATEGORY_ICONS[project.category] || Sparkles;
  const isLarge = variant === 'large';
  const isSmall = variant === 'small';
  const isMedium = variant === 'medium';

  // Responsive padding: Large: 26px, Medium: 22px, Small: 18px
  const padding = isLarge ? '26px' : isMedium ? '22px' : '18px';

  return (
    <article
      className={`proof-card ${isLarge ? 'proof-card-featured' : ''}`}
      style={{
        padding,
        borderColor: isLarge ? `${project.accentColor}30` : '#E5E7EB',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${project.accentColor}55`;
        e.currentTarget.style.boxShadow = `0 14px 34px -4px rgba(17,24,39,0.08), 0 0 0 1px ${project.accentColor}25`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = isLarge ? `${project.accentColor}30` : '#E5E7EB';
        e.currentTarget.style.boxShadow = '0 8px 30px rgba(17,24,39,0.04)';
      }}
    >
      {/* Studio Pushpin on Top Center of Card */}
      <div 
        style={{
          position: 'absolute',
          top: '-7px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div 
          style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: project.accentColor || '#E91D2B',
            boxShadow: '0 2px 4px rgba(0,0,0,0.18)',
            border: '1.5px solid #FFFFFF',
            position: 'relative',
          }}
        >
          <div 
            style={{
              position: 'absolute',
              inset: '1px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, transparent 60%)',
            }}
          />
        </div>
      </div>

      {/* Category & Program Top Strip */}
      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          marginBottom: isLarge ? '16px' : isMedium ? '13px' : '11px', 
          paddingBottom: '10px', 
          borderBottom: '1px solid #F1EFEA' 
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span 
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: `${project.accentColor}14`,
              color: project.accentColor,
            }}
          >
            <CatIcon size={12} strokeWidth={2.4} />
          </span>
          <span 
            style={{ 
              fontSize: isSmall ? '10px' : '11px', 
              fontFamily: 'monospace', 
              fontWeight: 800, 
              textTransform: 'uppercase', 
              letterSpacing: '0.06em', 
              color: project.accentColor 
            }}
          >
            {project.category} · {project.format}
          </span>
        </div>

        <span 
          style={{
            fontSize: '9.5px',
            fontFamily: 'monospace',
            fontWeight: 700,
            color: '#374151',
            backgroundColor: `${project.accentColor}10`,
            padding: '2px 7px',
            borderRadius: '4px',
            border: `1px solid ${project.accentColor}25`,
          }}
        >
          {project.program}
        </span>
      </div>

      {/* Visual Deliverable Element */}
      <VisualDeliverable project={project} isSmall={isSmall} />

      {/* Card Title */}
      <h3 
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: isLarge ? '22px' : isMedium ? '19.5px' : '17.5px',
          fontWeight: 800,
          color: '#111827',
          lineHeight: 1.25,
          letterSpacing: '-0.015em',
          marginBottom: isSmall ? '8px' : '10px',
        }}
      >
        {project.title}
      </h3>

      {/* Description */}
      <p 
        style={{
          fontSize: isLarge ? '14px' : isMedium ? '13.5px' : '13px',
          lineHeight: 1.6,
          color: '#4B5563',
          fontFamily: 'var(--font-display)',
          marginBottom: isSmall ? '12px' : isMedium ? '14px' : '16px',
        }}
      >
        {project.briefSummary}
      </p>

      {/* Problem Solved Editorial Block */}
      <div 
        style={{
          padding: isLarge ? '13px 15px' : isMedium ? '11px 13px' : '9px 11px',
          borderRadius: '10px',
          backgroundColor: `${project.accentColor}08`,
          border: `1px solid ${project.accentColor}22`,
          borderLeft: `3px solid ${project.accentColor}`,
          marginBottom: isSmall ? '12px' : '16px',
        }}
      >
        <span 
          style={{
            fontSize: isSmall ? '9.5px' : '10px',
            fontFamily: 'monospace',
            textTransform: 'uppercase',
            letterSpacing: '0.07em',
            fontWeight: 800,
            color: project.accentColor,
            display: 'block',
            marginBottom: '3px',
          }}
        >
          PROBLEM SOLVED
        </span>
        <p 
          style={{
            fontSize: isSmall ? '12px' : '13px',
            color: '#111827',
            fontWeight: 600,
            lineHeight: 1.5,
            margin: 0,
          }}
        >
          {project.problemSolved}
        </p>
      </div>

      {/* Card Footer: Upshifter Author + Verified Result Badge */}
      <div 
        style={{
          paddingTop: '12px',
          borderTop: '1px solid #EAE7E1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          flexWrap: 'wrap',
          marginTop: 'auto',
        }}
      >
        <span 
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: isSmall ? '12px' : '13px',
            color: '#111111',
          }}
        >
          {project.author}
        </span>
        <span 
          style={{
            fontFamily: 'monospace',
            fontWeight: 700,
            fontSize: isSmall ? '10px' : '10.5px',
            padding: isSmall ? '2px 8px' : '3px 9px',
            borderRadius: '9999px',
            backgroundColor: '#ECFDF5',
            color: '#059669',
            border: '1px solid #A7F3D0',
            whiteSpace: 'nowrap',
          }}
        >
          {project.badge}
        </span>
      </div>
    </article>
  );
}

/**
 * Proof Wall Section Component
 * Inspired by 21st.dev Asymmetric 3-Column Editorial Grid
 */
export default function ProofWallSection() {
  // Find each project by ID to ensure exact deterministic placement
  const reelrush = PROOF_PROJECTS.find(p => p.id === 'project-1') || PROOF_PROJECTS[0];
  const visualforge = PROOF_PROJECTS.find(p => p.id === 'project-2') || PROOF_PROJECTS[1];
  const deepannotator = PROOF_PROJECTS.find(p => p.id === 'project-3') || PROOF_PROJECTS[2];
  const vibecoder = PROOF_PROJECTS.find(p => p.id === 'project-4') || PROOF_PROJECTS[3];
  const brandbuzz = PROOF_PROJECTS.find(p => p.id === 'project-5') || PROOF_PROJECTS[4];
  const agenthandlers = PROOF_PROJECTS.find(p => p.id === 'project-6') || PROOF_PROJECTS[5];

  return (
    <section 
      id="proof" 
      className="section bg-[#FAF8F5] text-[#111111] relative scroll-mt-28 md:scroll-mt-32 pt-5 pb-10 md:pt-6 md:pb-12"
    >
      {/* Subtle Drafting Grid on Studio Surface */}
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-[radial-gradient(rgba(0,0,0,0.15)_1px,transparent_1px)] [background-size:20px_20px]" />

      <div 
        className="container relative z-10" 
        style={{ 
          maxWidth: '1340px',
          margin: '0 auto',
          paddingLeft: 'clamp(16px, 3.5vw, 48px)',
          paddingRight: 'clamp(16px, 3.5vw, 48px)'
        }}
      >
        {/* Section Header with Supporting Builder Mascot */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 lg:mb-10 gap-8">
          <div className="max-w-2xl">
            <span className="eyebrow mb-3 inline-flex items-center gap-2 text-[#E31B23]">
              <span className="eyebrow-dot" style={{ backgroundColor: '#059669' }} />
              <span className="font-mono text-[11px] font-bold tracking-wider uppercase">
                The Receipt · Studio Exhibition
              </span>
            </span>
            <h2 className="font-heading text-[28px] sm:text-[38px] lg:text-[44px] font-bold text-[#111111] tracking-tight leading-[1.06] mb-3">
              DON'T TELL THEM YOU KNOW AI.<br />
              <span className="text-[#E31B23]">SHOW THEM.</span>
            </h2>
            <p className="text-base sm:text-[16.5px] text-[#5A5751] font-display leading-relaxed max-w-xl">
              “Certificates show passive attendance. Pinned work demonstrates verified capability.”
            </p>
          </div>

          {/* Supporting Mascot: Builder Reviewing Board */}
          <div className="hidden lg:flex items-center gap-4 bg-white border border-[#E7E4DF] rounded-2xl p-4 pr-6 shadow-xs max-w-sm">
            <div className="w-16 h-16 shrink-0 relative">
              <img
                src="/assets/mascot/mascot_builder_cutout.png"
                alt="Mascot Builder"
                className="w-full h-full object-contain object-center drop-shadow-sm"
              />
            </div>
            <div className="text-xs">
              <p className="font-bold text-[#111111] font-display text-[13px]">Proof-First Standard</p>
              <p className="text-[#666666] text-[11px] leading-snug mt-0.5 font-display">
                Peer-reviewed deliverables graded on industry fidelity and commercial utility.
              </p>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* DESKTOP ASYMMETRIC GRID (3 Columns of Equal-Height Cards)    */}
        {/* ============================================================ */}
        <div className="proof-grid-desktop">
          {/* Column 1 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
            <ProofCard project={reelrush} variant="medium" />
            <ProofCard project={vibecoder} variant="medium" />
          </div>

          {/* Column 2 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
            <ProofCard project={visualforge} variant="medium" />
            <ProofCard project={deepannotator} variant="medium" />
          </div>

          {/* Column 3 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
            <ProofCard project={brandbuzz} variant="medium" />
            <ProofCard project={agenthandlers} variant="medium" />
          </div>
        </div>

        {/* ============================================================ */}
        {/* TABLET VIEW (2 Columns of Equal-Height Cards)                 */}
        {/* ============================================================ */}
        <div className="proof-grid-tablet">
          {/* Column A */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
            <ProofCard project={reelrush} variant="medium" />
            <ProofCard project={visualforge} variant="medium" />
            <ProofCard project={vibecoder} variant="medium" />
          </div>

          {/* Column B */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
            <ProofCard project={deepannotator} variant="medium" />
            <ProofCard project={brandbuzz} variant="medium" />
            <ProofCard project={agenthandlers} variant="medium" />
          </div>
        </div>

        {/* ============================================================ */}
        {/* MOBILE VIEW (Single Sequential Column)                       */}
        {/* ============================================================ */}
        <div className="proof-grid-mobile">
          <ProofCard project={reelrush} variant="medium" />
          <ProofCard project={visualforge} variant="medium" />
          <ProofCard project={deepannotator} variant="medium" />
          <ProofCard project={vibecoder} variant="medium" />
          <ProofCard project={brandbuzz} variant="medium" />
          <ProofCard project={agenthandlers} variant="medium" />
        </div>
      </div>

      {/* Soft Organic Feathery Bleed into Opportunities */}
      <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none bg-gradient-to-b from-transparent via-[#FAF8F5]/50 to-[#FAF8F5]" />
    </section>
  );
}
