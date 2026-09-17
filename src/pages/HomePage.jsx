import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowUpRight, 
  ArrowRight, 
  ArrowDown, 
  Play, 
  Palette, 
  Database, 
  Code, 
  Megaphone, 
  Bot, 
  Sparkles, 
  CheckCircle2, 
  ExternalLink,
  MapPin,
  Clock,
  Briefcase,
  Zap,
  Building
} from 'lucide-react';
import MascotBadge from '../components/MascotBadge';
import ExploringProgramsSection from '../components/ExploringProgramsSection';
import ProgramOrbitCarousel from '../components/ProgramOrbitCarousel';
import UserJourneySection from '../components/UserJourneySection';
import ProofWallSection from '../components/ProofWallSection';
import OpportunityDispatchSection from '../components/OpportunityDispatchSection';

import { PROGRAMS_DATA } from '../data/programsData';
import { PROOF_PROJECTS } from '../data/proofData';
import { CONCEPTUAL_CLASSIFIEDS } from '../data/opportunitiesData';

// Program Icon Map matching the 6 tracks
const PROGRAM_ICONS = {
  'reelrush-ai': Play,
  'visualforge-ai': Palette,
  'deepannotator': Database,
  'vibe-coder': Code,
  'brandbuzz-ai': Megaphone,
  'agenthandlers': Bot,
  'agent-handlers': Bot,
};

// Engagement Icon Map matching the listing types
const ENGAGEMENT_ICONS = {
  'Project Retainer (15 hrs/wk)': Briefcase,
  'Project Sprint (2-Week Milestone)': Zap,
  'Paid Internship / 3 Months': Building,
  'Freelance Contract': Sparkles,
  'Project Build + Monthly Maintenance': Code,
  'Part-Time Contributor': Clock,
};

// Category Icon Map for Proof Projects
const CATEGORY_ICONS = {
  'VIDEO': Play,
  'DESIGN': Palette,
  'DATA': Database,
  'CODE': Code,
  'MARKETING': Megaphone,
  'AGENTS': Bot,
};

// Distinct Engagement Badge Color Map for Opportunities
const ENGAGEMENT_BADGES = {
  'Project Retainer (15 hrs/wk)': { label: 'PROJECT RETAINER', text: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE' },
  'Project Sprint (2-Week Milestone)': { label: 'PROJECT SPRINT', text: '#059669', bg: '#ECFDF5', border: '#A7F3D0' },
  'Paid Internship / 3 Months': { label: 'PAID INTERNSHIP', text: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' },
  'Freelance Contract': { label: 'FREELANCE CONTRACT', text: '#EA580C', bg: '#FFF7ED', border: '#FED7AA' },
  'Project Build + Monthly Maintenance': { label: 'PROJECT BUILD', text: '#0D9488', bg: '#F0FDFA', border: '#99F6E4' },
  'Part-Time Contributor': { label: 'PART-TIME', text: '#E91D2B', bg: '#FFF1F1', border: '#FECACA' },
};

// Dark-Theme Adapted Identity Badges
const DARK_IDENTITY_BADGES = [
  { label: 'CREATOR', color: '#FF6B75', bg: 'rgba(233, 29, 43, 0.16)', border: 'rgba(233, 29, 43, 0.35)' },
  { label: 'BUILDER', color: '#60A5FA', bg: 'rgba(37, 99, 235, 0.16)', border: 'rgba(37, 99, 235, 0.35)' },
  { label: 'RESEARCHER', color: '#34D399', bg: 'rgba(5, 150, 105, 0.16)', border: 'rgba(5, 150, 105, 0.35)' },
  { label: 'OPERATOR', color: '#FB923C', bg: 'rgba(234, 88, 12, 0.16)', border: 'rgba(234, 88, 12, 0.35)' },
  { label: 'AUTOMATOR', color: '#2DD4BF', bg: 'rgba(13, 148, 136, 0.16)', border: 'rgba(13, 148, 136, 0.35)' },
  { label: 'GENERALIST', color: '#A78BFA', bg: 'rgba(124, 58, 237, 0.16)', border: 'rgba(124, 58, 237, 0.35)' },
];

// Staggered rotation angles for Pinned Exhibit cards
const PINNED_ROTATIONS = [-1.8, 1.5, -1.2, 1.8, -1.5, 1.2];

export default function HomePage({ onSelectProgram, onOpenRegistration }) {
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-[#0a0a0a] text-white">
      {/* ============================================================ */}
      {/* 1. HERO SECTION                                              */}
      {/* ============================================================ */}
      <section id="hero" className="hero-section bg-[#0a0a0a] text-white relative scroll-mt-28 md:scroll-mt-32">
        {/* Subtle Ambient Brand Atmosphere */}
        <div className="hero-ambient-glow hero-glow-1" />
        {/* Dark Crimson / Red Radial Atmospheric Glow (from prompt) */}
        <div className="hero-glow-2" />
        <div className="hero-grid-pattern" />

        {/* Decorative Element 1 (Top Right of Hero): A Bigger You with Red Squiggle */}
        <div 
          style={{
            position: 'absolute',
            top: '110px',
            right: 'clamp(20px, 5vw, 60px)',
            zIndex: 20,
            pointerEvents: 'none',
            userSelect: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            textAlign: 'right'
          }}
        >
          <span 
            style={{
              fontFamily: 'Caveat, cursive',
              fontSize: 'clamp(36px, 4.5vw, 56px)',
              fontWeight: 700,
              color: '#FFFFFF',
              lineHeight: 1,
              transform: 'rotate(-7deg)',
              display: 'block'
            }}
          >
            A Bigger<br />You
          </span>
          <svg style={{ width: '90px', height: '16px', marginTop: '4px' }} viewBox="0 0 80 16" fill="none">
            <path d="M 5 8 Q 40 14, 75 4" stroke="#E31B23" strokeWidth="2.8" strokeLinecap="round" />
          </svg>
        </div>

        {/* Decorative Element 3 (Right Side Vertical Labels): CAREERS / VENTURES / BUSINESSES / IMPACT */}
        <div 
          style={{
            position: 'absolute',
            bottom: '50px',
            right: 'clamp(20px, 4vw, 50px)',
            zIndex: 20,
            pointerEvents: 'none',
            userSelect: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            textAlign: 'right',
            fontFamily: 'monospace',
            fontSize: '11px',
            letterSpacing: '0.18em',
            color: 'rgba(255, 255, 255, 0.45)',
            textTransform: 'uppercase'
          }}
        >
          <span style={{ marginBottom: '4px' }}>CAREERS</span>
          <span style={{ marginBottom: '4px' }}>VENTURES</span>
          <span style={{ marginBottom: '4px' }}>BUSINESSES</span>
          <span style={{ color: '#E31B23', fontWeight: 700 }}>IMPACT</span>
          <div style={{ width: '22px', height: '2px', backgroundColor: '#E31B23', marginTop: '4px' }} />
        </div>

        <div className="container relative z-10">
          <div className="hero-layout">
            {/* Left Content Column (54%) */}
            <div className="hero-left-content">

              {/* Editorial Headline with Forced Line Breaks */}
              <h1 className="hero-title text-white font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.1] mb-4">
                YOU KNOW AI.<br />
                NOW SHOW WHAT YOU<br />
                <span className="text-[#E31B23]">CAN DO WITH IT.</span>
              </h1>

              {/* Supporting Paragraph */}
              <p className="hero-desc text-white/70">
                Upshift helps ambitious learners build applied AI capabilities and turn them
                <span className="hero-desc-line2">
                  into <strong className="text-white font-bold">work they can actually show</strong>.
                </span>
              </p>

              {/* Action CTAs (Exactly 2 Buttons) */}
              <div className="hero-cta-group flex items-center gap-3.5 flex-wrap">
                <button
                  onClick={() => scrollToSection('programs')}
                  className="btn btn-primary group"
                  style={{
                    backgroundColor: '#E31B23',
                    borderRadius: '9999px',
                    color: '#FFFFFF',
                    fontWeight: '700',
                    fontSize: '15px',
                    padding: '0 26px',
                    height: '48px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(227, 27, 35, 0.4)'
                  }}
                >
                  <span>Explore the Programs</span>
                  <ArrowRight size={17} className="btn-arrow" />
                </button>
                <button
                  onClick={() => scrollToSection('how-it-works')}
                  className="btn btn-secondary"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    color: '#FFFFFF',
                    borderRadius: '9999px',
                    fontWeight: '600',
                    fontSize: '15px',
                    padding: '0 24px',
                    height: '48px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span>See How Upshift Works</span>
                  <ArrowDown size={15} />
                </button>
              </div>

              {/* Supporting Anchor Micro-Line */}
              <div className="mt-6 flex items-center gap-2 text-[11px] font-mono text-white/50 tracking-wider uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E31B23]" />
                <span>FOR UNDERGRADUATES, GRADUATES & FRESHERS</span>
              </div>

              {/* Decorative Element 2 (Bottom Left of Hero): SAME PEOPLE. A BRIGHTER TOMORROW. */}
              <div className="mt-8 text-[11px] font-mono text-white/40 tracking-[0.2em] leading-relaxed uppercase select-none">
                SAME PEOPLE.<br />A BRIGHTER TOMORROW.
              </div>
            </div>

            {/* Right Mascot Column (46% - Anchored to Bottom & Scaled ~1.5x) */}
            <div className="hero-right-mascot">
              <div className="hero-mascot-frame">
                {/* Stage Conic Spotlight Beam from Prompt */}
                <div className="hero-spotlight-cone" />
                <div className="hero-spotlight-core" />
                <div className="hero-mascot-glow" />
                <img
                  src="/assets/mascot/mascot_pointing_cutout.png"
                  alt="Upshift Mascot Pointing"
                  className="hero-mascot-img"
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Soft Organic Bleed into Programs Section */}
        <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none bg-gradient-to-b from-transparent to-[#FAF8F5]" />
      </section>

      {/* ============================================================ */}
      {/* 2. PROGRAMS CIRCLE SECTION (Fox + Circular Badges)          */}
      {/* ============================================================ */}
      <div id="programs" className="relative scroll-mt-28 md:scroll-mt-32 bg-[#FAF8F5]">
        <ExploringProgramsSection />
      </div>

      {/* ============================================================ */}
      {/* 3. PROGRAM EXPLORATION — FOX + ROTATING CARDS (DARK CINEMATIC) */}
      {/* ============================================================ */}
      <section id="courses" className="courses-orbit-section relative scroll-mt-20">
        {/* Subtle Atmospheric Burgundy/Crimson Glow behind central stage */}
        <div className="courses-orbit-ambient-glow" aria-hidden="true" />

        <div className="container relative z-10">
          {/* Section Header */}
          <div className="max-w-3xl mb-5 sm:mb-7 lg:mb-8">
            <span className="eyebrow mb-1 inline-flex items-center gap-2 text-[#E31B23]">
              <span className="eyebrow-dot" style={{ backgroundColor: '#E31B23' }} />
              <span className="text-[#E31B23] font-mono text-[10px] sm:text-[11px] font-bold tracking-wider uppercase">
                Flagship Tracks · Curriculum & Deliverables
              </span>
            </span>
            <h2 className="font-heading text-xl sm:text-3xl lg:text-[34px] font-bold text-white tracking-tight leading-[1.08] mb-1 sm:mb-1.5">
              WHAT DO YOU WANT TO<br />
              <span className="text-[#E31B23]">BUILD WITH AI?</span>
            </h2>
            <p className="text-xs sm:text-sm text-white/75 font-display leading-relaxed">
              Six applied tracks engineered around real commercial deliverables. Select a track to explore its curriculum and verified deliverables.
            </p>
          </div>

          {/* Circular Orbit Carousel with Central Mascot */}
          <ProgramOrbitCarousel 
            programs={PROGRAMS_DATA} 
            onSelectProgram={onSelectProgram} 
          />

          {/* Editorial Micro-Copy Lower Anchor */}
          <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/10 select-none">
            <div className="flex items-center gap-2 text-white/50 font-mono text-[10px] sm:text-[11px] tracking-[0.18em] uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E31B23]" />
              <span>KNOW AI. THEN SHOW WHAT YOU CAN DO WITH IT.</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/[0.04] text-white/80 font-mono text-[10px] sm:text-[11px] font-semibold tracking-wider">
              <span>SKILL</span>
              <span className="text-[#E31B23]">→</span>
              <span>PROOF</span>
              <span className="text-[#E31B23]">→</span>
              <span className="text-white font-bold">OPPORTUNITY</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. CAREER JOURNEY TIMELINE (How It Works — Light Editorial)  */}
      {/* ============================================================ */}
      <UserJourneySection />

      {/* ============================================================ */}
      {/* 4. THE RECEIPT — 21ST.DEV ASYMMETRIC STUDIO EXHIBITION GRID */}
      {/* ============================================================ */}
      <ProofWallSection />

      {/* ============================================================ */}
      {/* 5. OPPORTUNITIES — HORIZONTAL EXPANDING PANEL WALL           */}
      {/* ============================================================ */}
      <OpportunityDispatchSection onExploreClick={() => scrollToSection('courses')} />

      {/* ============================================================ */}
      {/* 6. WHAT IS AN UPSHIFTER? — EDITORIAL PHILOSOPHY CLOSER       */}
      {/* ============================================================ */}
      <section id="upshifter" className="section bg-[#111111] text-white relative scroll-mt-28 md:scroll-mt-32 pt-24 pb-20 md:pt-28 md:pb-24 overflow-hidden">
        {/* Subtle Ambient Red Glow on Dark Canvas */}
        <div 
          className="absolute -top-32 right-0 w-[500px] h-[500px] pointer-events-none opacity-20"
          style={{
            background: 'radial-gradient(circle at 60% 40%, rgba(233, 29, 43, 0.4) 0%, transparent 70%)'
          }}
        />

        <div className="container relative z-10" style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Brand Narrative */}
            <div className="lg:col-span-7">
              <span className="eyebrow mb-3 inline-flex items-center gap-2 border border-white/10 bg-white/5 text-white">
                <span className="eyebrow-dot" style={{ backgroundColor: '#E91D2B' }} />
                <span>The Upshifter Standard</span>
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight mb-5">
                WHAT IS AN UPSHIFTER?
              </h2>

              <p className="font-display text-xl sm:text-2xl lg:text-3xl text-white font-medium leading-snug mb-6">
                “An Upshifter doesn't just know AI.<br />
                <span className="text-[#FF4D5A] font-semibold">They know what to do with it.”</span>
              </p>

              {/* Compact Editorial Discipline Line */}
              <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs text-white/60 tracking-widest uppercase mb-6 select-none">
                <span>CREATOR</span>
                <span className="text-[#E91D2B] font-bold">·</span>
                <span>BUILDER</span>
                <span className="text-[#E91D2B] font-bold">·</span>
                <span>RESEARCHER</span>
                <span className="text-[#E91D2B] font-bold">·</span>
                <span>OPERATOR</span>
                <span className="text-[#E91D2B] font-bold">·</span>
                <span>AUTOMATOR</span>
                <span className="text-[#E91D2B] font-bold">·</span>
                <span>GENERALIST</span>
              </div>

              <p className="text-sm sm:text-base text-[#A5A29A] font-display leading-relaxed max-w-xl">
                The modern economy doesn't reward passive prompt typing. It rewards versatile operators who can translate messy real-world challenges into concrete digital assets, automated workflows, and verified commercial results.
              </p>
            </div>

            {/* Right Mascot Presence: Balanced Upward Arrow */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <MascotBadge 
                pose="arrow" 
                size="lg" 
                caption="UPSHIFT ↑ CONFIDENT BUILDER"
                showBadge={true}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 7. FINAL REGISTRATION CALL-TO-ACTION AREA                    */}
      {/* ============================================================ */}
      <section id="join-upshift" className="section bg-[#FAF8F5] text-[#111111] relative py-20 md:py-28 border-t border-[#E5E7EB]">
        <div className="container relative z-10" style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <span className="eyebrow mb-4 inline-flex items-center gap-2">
            <span className="eyebrow-dot" style={{ backgroundColor: '#E31B23' }} />
            <span className="font-mono text-xs font-bold text-[#E31B23] uppercase tracking-wider">
              Admissions Open · Next Cohort Sprint
            </span>
          </span>

          <h2 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#111111] tracking-tight leading-[1.08] mb-5">
            READY TO START YOUR<br />
            <span className="text-[#E31B23]">UPSHIFT JOURNEY?</span>
          </h2>

          <p className="text-base sm:text-lg text-[#4B5563] font-display max-w-2xl mx-auto leading-relaxed mb-8">
            Build applied AI capability. Create proof of work. Turn that capability into real opportunity.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <Link
              to="/enroll"
              className="btn btn-primary btn-lg group"
              style={{
                backgroundColor: '#E31B23',
                borderRadius: '9999px',
                color: '#FFFFFF',
                fontWeight: '700',
                fontSize: '15px',
                padding: '14px 34px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 8px 24px rgba(227, 27, 35, 0.35)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textDecoration: 'none'
              }}
            >
              <span>ENROLL NOW</span>
              <ArrowRight size={18} className="btn-arrow" />
            </Link>
          </div>

          {/* Supporting Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-[#6B7280] uppercase tracking-wider pt-6 border-t border-[#E5E7EB]">
            <span className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
              Verified Capstone Deliverables
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
              Live Commercial Dispatch
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
              Zero Prior Coding Prerequisite
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}

