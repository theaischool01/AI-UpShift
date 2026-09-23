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
import OpportunityDispatchSection from '../components/OpportunityDispatchSection';

import { PROGRAMS_DATA } from '../data/programsData';
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
        {/* Dark Crimson / Red Radial Atmospheric Glow */}
        <div className="hero-glow-2" />
        <div className="hero-grid-pattern" />

        <div className="container relative z-10">
          <div className="hero-layout">
            {/* Left Content Column */}
            <div className="hero-left-content">

              {/* Editorial Headline with EXACTLY 3 lines */}
              <h1 className="hero-title font-extrabold text-3xl sm:text-5xl lg:text-[52px] xl:text-[58px] tracking-tight leading-[1.1] mb-5">
                <span className="block" style={{ color: '#FFFFFF' }}>
                  YOU KNOW <span className="hero-headline-emphasis hero-emphasis-ai">AI.</span>
                </span>
                <span className="block" style={{ color: '#FFFFFF' }}>
                  NOW MAKE IT
                </span>
                <span className="block" style={{ color: '#FFFFFF' }}>
                  EARN FOR <span className="hero-headline-emphasis hero-emphasis-you">YOU.</span>
                </span>
              </h1>

              {/* Supporting Paragraph */}
              <p className="hero-desc text-white/85 text-base sm:text-lg max-w-[560px] leading-relaxed mb-8">
                Build practical AI skills. Create real outcomes and Start earning through digital gigs, transforming local businesses into AI-native businesses, and building AI-powered ventures.
              </p>

              {/* Action CTAs: How UpShift Works (Red Primary) + Explore Programs (Secondary) */}
              <div className="hero-cta-group flex items-center gap-3.5 flex-wrap">
                <button
                  onClick={() => scrollToSection('how-it-works')}
                  className="btn btn-primary group"
                  style={{
                    backgroundColor: '#E31B23',
                    borderRadius: '9999px',
                    color: '#FFFFFF',
                    fontWeight: '700',
                    fontSize: '14px',
                    padding: '0 24px',
                    height: '46px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(227, 27, 35, 0.4)',
                    textDecoration: 'none',
                    letterSpacing: '0.02em',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <span>HOW UPSHIFT WORKS</span>
                  <ArrowRight size={16} className="btn-arrow" />
                </button>
                <button
                  onClick={() => scrollToSection('programs')}
                  className="btn btn-secondary"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.22)',
                    color: '#FFFFFF',
                    borderRadius: '9999px',
                    fontWeight: '600',
                    fontSize: '14px',
                    padding: '0 24px',
                    height: '46px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span>EXPLORE PROGRAMS</span>
                  <ArrowDown size={15} />
                </button>
              </div>

              {/* Statistics Strip: 3 Metrics with White Circular Badges & Subtle Separators */}
              <div className="hero-stats-strip" aria-label="UpShift Key Statistics">
                {/* Stat 1: 5K+ UpShifters */}
                <div className="hero-stat-item">
                  <div className="hero-stat-circle">
                    <span className="hero-stat-value">5K+</span>
                  </div>
                  <span className="hero-stat-label">UpShifters</span>
                </div>

                {/* Separator 1 */}
                <div className="hero-stat-divider" aria-hidden="true" />

                {/* Stat 2: 1.5K+ Earners */}
                <div className="hero-stat-item">
                  <div className="hero-stat-circle">
                    <span className="hero-stat-value">1.5K+</span>
                  </div>
                  <span className="hero-stat-label">Earners</span>
                </div>

                {/* Separator 2 */}
                <div className="hero-stat-divider" aria-hidden="true" />

                {/* Stat 3: ₹2.1Cr+ Total UpShifters Earned */}
                <div className="hero-stat-item">
                  <div className="hero-stat-circle">
                    <span className="hero-stat-value hero-stat-value-sm">₹2.1Cr+</span>
                  </div>
                  <span className="hero-stat-label">
                    Total UpShifters<br className="hidden sm:inline" /> Earned
                  </span>
                </div>
              </div>
            </div>

            {/* Right Mascot Column (Dominant on Right, Anchored to bottom) */}
            <div className="hero-right-mascot">
              {/* Handwritten "A Bigger You" Badge */}
              <div className="hero-tagline-script" aria-hidden="true">
                <div className="hero-tagline-text">
                  <span className="block">A Bigger</span>
                  <span className="block">You</span>
                </div>
                <svg className="hero-tagline-curve" viewBox="0 0 56 10" fill="none">
                  <path d="M2 4C18 9 38 9 54 2.5" stroke="#E31B23" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </div>

              <div className="hero-mascot-frame">
                {/* Stage Conic Spotlight Beam */}
                <div className="hero-spotlight-cone" />
                <div className="hero-spotlight-core" />
                <div className="hero-mascot-glow" />
                <img
                  src="/assets/mascot/mascot_pointing_cutout.png"
                  alt="Upshift Mascot"
                  className="hero-mascot-img"
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* ============================================================ */}
      {/* 2. PROGRAM SHOWCASE SLIDESHOW (Cinematic 16:9 Full-Width)     */}
      {/* ============================================================ */}
      <section id="programs" className="relative scroll-mt-20 md:scroll-mt-24 bg-white">
        <ExploringProgramsSection />
      </section>

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
                COMPLETE AI CAPABILITY JOURNEY
              </span>
            </span>
            <h2 className="font-heading text-xl sm:text-3xl lg:text-[34px] font-bold text-white tracking-tight leading-[1.12] mb-1 sm:mb-1.5">
              <span className="block text-white">BUILD WITH AI</span>
              <span className="block text-white">
                CREATE YOUR PATH TO <span className="hero-headline-emphasis hero-emphasis-earning">EARNING</span>
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-white/75 font-body leading-relaxed">
              One Journey that helps anyone turn AI capabilities into real projects, credible proof of work and new earning pathways.
            </p>
          </div>

          {/* Circular Orbit Carousel with Central Mascot */}
          <ProgramOrbitCarousel
            programs={PROGRAMS_DATA}
            onSelectProgram={onSelectProgram}
          />
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. CAREER JOURNEY TIMELINE (How It Works — Light Editorial)  */}
      {/* ============================================================ */}
      <UserJourneySection />

      {/* ============================================================ */}
      {/* 5. OPPORTUNITIES — HORIZONTAL EXPANDING PANEL WALL           */}
      {/* ============================================================ */}
      <OpportunityDispatchSection onExploreClick={() => scrollToSection('courses')} />

      {/* ============================================================ */}
      {/* 6. FINAL REGISTRATION CALL-TO-ACTION AREA                    */}
      {/* ============================================================ */}
      <section 
        id="join-upshift" 
        className="section bg-[#FAF8F5] text-[#111111] relative pt-10 pb-14 md:pt-14 md:pb-16"
        style={{ borderTop: '1px solid #EAE6DF' }}
      >
        <div className="container relative z-10" style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <span className="eyebrow mb-4 inline-flex items-center gap-2">
            <span className="eyebrow-dot" style={{ backgroundColor: '#E31B23' }} />
            <span className="font-mono text-xs font-bold text-[#E31B23] uppercase tracking-wider">
              Admissions Open · Next Cohort Sprint
            </span>
          </span>

          <h2 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#111111] tracking-tight leading-[1.08] mb-3.5">
            READY TO START YOUR<br />
            <span className="text-[#E31B23]">UPSHIFT JOURNEY?</span>
          </h2>

          <p className="text-base sm:text-lg text-[#4B5563] font-display max-w-2xl mx-auto leading-relaxed mb-6">
            Build applied AI capability. Create proof of work. Turn that capability into real opportunity.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
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
              <span>GET STARTED</span>
              <ArrowRight size={18} className="btn-arrow" />
            </Link>
          </div>

          {/* Supporting Trust Indicators */}
          <div 
            className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-[#6B7280] uppercase tracking-wider pt-6"
            style={{ borderTop: '1px solid #EAE6DF' }}
          >
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

