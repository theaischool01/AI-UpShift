import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import dianaAvatar from '../assets/diana_johnston.jpg';
import MascotBadge from './MascotBadge';

const STORIES_DATA = [
  {
    id: 1,
    name: 'B. Deepak',
    shortCode: 'BD',
    role: 'Applied AI Builder',
    quote: 'I started by helping with a few small projects. As I completed more work, I began receiving paid gigs regularly. I saved those earnings and bought my own laptop. That was the moment I felt I could genuinely build something for myself.',
    avatar: null
  },
  {
    id: 2,
    name: 'Likitha',
    shortCode: 'L',
    role: 'Autonomous Agent Handler · AgentHandlers Track',
    quote: 'Zero prior coding background. Built client agents in 3 weeks with automated API workflows.',
    avatar: dianaAvatar
  },
  {
    id: 3,
    name: 'Edward Alexander',
    shortCode: 'EA',
    role: 'Undergraduate Builder · ReelRush & Vibe Coder Track',
    quote: 'Overall pleasurable experience. Pay a little first and Pay a little during the development of the app as milestones are achieved, which made me feel very confident and comfortable. Seamless and Easy process.',
    avatar: null
  },
  {
    id: 4,
    name: 'Lauren Contreras',
    shortCode: 'LC',
    role: 'AI Annotation Specialist · DeepAnnotator Track',
    quote: 'Been working with UpShift for a number of years now with a variety of different apps. They have my recommendation. They are a great team.',
    avatar: null
  }
];

export default function UserJourneySection() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeStory, setActiveStory] = useState(0);

  useEffect(() => {
    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Trigger once only
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Auto-rotate every exactly 3 seconds (3000ms) continuously
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStory((prev) => (prev + 1) % STORIES_DATA.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const currentStory = STORIES_DATA[activeStory];

  // Extract drop-cap first letter and remaining quote
  const rawQuote = currentStory.quote.replace(/^["“]/, '');
  const firstLetter = rawQuote.charAt(0);
  const restOfQuote = rawQuote.slice(1);

  const steps = [
    {
      number: '01',
      label: 'BUILD THE SKILL',
      title: 'Learn',
      description: 'Master applied AI capabilities through intensive applied learning built around real-world tools.'
    },
    {
      number: '02',
      label: 'SHOW THE WORK',
      title: 'Proof of Work',
      description: 'Create and publish real deliverables that demonstrate what you can actually do.'
    },
    {
      number: '03',
      label: 'GO AFTER OPPORTUNITY',
      title: 'Earning',
      description: 'Connect your verified deliverables to client retainers, startup sprints, and paid opportunities.'
    }
  ];

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className={`journey-section ${isVisible ? 'is-visible' : ''}`}
      aria-label="The UpShift Progression Career Pathway"
    >
      {/* Subtle Background Pattern */}
      <div className="journey-bg-pattern" aria-hidden="true" />

      <div className="journey-container">
        {/* ============================================================ */}
        {/* SECTION EDITORIAL HEADER                                     */}
        {/* ============================================================ */}
        <header className="journey-header">
          <div className="journey-anim-eyebrow">
            <span className="journey-eyebrow">
              <span className="journey-eyebrow-dot" aria-hidden="true" />
              <span>THE UPSHIFT PROGRESSION · CAREER PATHWAY</span>
            </span>
          </div>

          <h2 className="journey-heading journey-anim-heading">
            TURN AI INTO CAPABILITY.<br />
            <span className="journey-heading-accent">TURN CAPABILITY INTO EARNINGS.</span>
          </h2>

          <p className="journey-description journey-anim-desc">
            Create real projects, showcase what you can do, and open new paths to career, freelance and business opportunities.
          </p>
        </header>

        {/* ============================================================ */}
        {/* DESKTOP TIMELINE (1024px+)                                   */}
        {/* ============================================================ */}
        <div className="journey-desktop-timeline">
          {/* Continuous SVG Connecting Path sitting behind the 3 Markers */}
          <div className="journey-path-container" aria-hidden="true">
            <svg
              className="journey-svg-path"
              viewBox="0 0 1000 60"
              preserveAspectRatio="none"
              fill="none"
            >
              <path
                d="M 80 20 C 130 20, 150 20, 167 20 C 270 10, 390 30, 500 20 C 610 10, 730 30, 833 20 C 850 20, 870 20, 920 20"
                className="journey-bezier-path journey-anim-path"
              />
            </svg>
          </div>

          {/* 3 Step Markers directly aligned with the 3 columns */}
          <div className="journey-markers-grid" aria-hidden="true">
            {steps.map((step, idx) => (
              <div key={`marker-${step.number}`} className={`journey-marker-column journey-anim-step-${idx + 1}`}>
                <div className="journey-marker-node">
                  <span className="journey-marker-num">{step.number}</span>
                </div>
                <div className="journey-marker-stem" />
              </div>
            ))}
          </div>

          {/* 3 Journey Cards */}
          <div className="journey-cards-grid">
            {steps.map((step, idx) => (
              <article
                key={step.number}
                className={`journey-card journey-anim-step-${idx + 1}`}
              >
                <div className="journey-card-top">
                  <div className="journey-card-badge">
                    <span className="journey-badge-num">{step.number}</span>
                    <span className="journey-badge-dot">·</span>
                    <span className="journey-badge-label">{step.label}</span>
                  </div>

                  <h3 className="journey-card-title">{step.title}</h3>

                  <p className="journey-card-desc">{step.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* ============================================================ */}
        {/* MOBILE & TABLET VERTICAL TIMELINE (< 1024px)                 */}
        {/* ============================================================ */}
        <div className="journey-mobile-timeline">
          <div className="journey-mobile-spine" aria-hidden="true" />

          {steps.map((step, idx) => (
            <div
              key={`mobile-${step.number}`}
              className={`journey-mobile-step journey-anim-step-${idx + 1}`}
            >
              <div className="journey-mobile-node" aria-hidden="true">
                <span>{step.number}</span>
              </div>

              <article className="journey-mobile-card">
                <div className="journey-card-badge" style={{ marginBottom: '12px' }}>
                  <span className="journey-badge-num">{step.number}</span>
                  <span className="journey-badge-dot">·</span>
                  <span className="journey-badge-label">{step.label}</span>
                </div>

                <h3 className="journey-card-title" style={{ marginTop: '0', fontSize: '1.2rem' }}>
                  {step.title}
                </h3>

                <p className="journey-card-desc">
                  {step.description}
                </p>
              </article>
            </div>
          ))}
        </div>

        {/* ============================================================ */}
        {/* WHAT IS AN UPSHIFTER? — CINEMATIC BLACK + RED EDITORIAL CARD */}
        {/* ============================================================ */}
        <div id="upshifter" className="upshifter-editorial-card scroll-mt-28 md:scroll-mt-32">
          {/* Matrix Pattern Overlay */}
          <div className="upshifter-grid-mesh" aria-hidden="true" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            {/* Left Brand Narrative */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#E31B23]/15 border border-[#E31B23]/35 mb-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E31B23]" />
                <span className="font-mono text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#FF5A65]">
                  The UpShifter Standard
                </span>
              </div>

              <h2 className="upshifter-title mb-2.5 sm:mb-3">
                <span className="text-white">WHAT IS AN</span><br />
                <span style={{ color: '#E31B23' }}>UPSHIFTER?</span>
              </h2>

              <p className="upshifter-quote mb-3 sm:mb-3.5">
                <span className="text-white">“An UpShifter doesn't just know AI.</span><br />
                <span style={{ color: '#E31B23', fontWeight: 800 }}>They know what to do with it.”</span>
              </p>

              {/* Compact Editorial Discipline Line with Red Separators */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 font-mono text-[11px] sm:text-xs text-[#E5E7EB] tracking-wider uppercase mb-3 sm:mb-3.5 select-none font-bold">
                <span>CREATOR</span>
                <span style={{ color: '#E31B23', fontWeight: 900 }}>·</span>
                <span>BUILDER</span>
                <span style={{ color: '#E31B23', fontWeight: 900 }}>·</span>
                <span>RESEARCHER</span>
                <span style={{ color: '#E31B23', fontWeight: 900 }}>·</span>
                <span>OPERATOR</span>
                <span style={{ color: '#E31B23', fontWeight: 900 }}>·</span>
                <span>AUTOMATOR</span>
                <span style={{ color: '#E31B23', fontWeight: 900 }}>·</span>
                <span>GENERALIST</span>
              </div>

              <p className="upshifter-body max-w-[580px]">
                The modern economy doesn't reward passive prompt typing. It rewards versatile operators who can translate messy real-world challenges into concrete digital assets, automated workflows, and verified commercial results.
              </p>
            </div>

            {/* Right Mascot Presence */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center relative py-1 lg:py-0">
              <div className="upshifter-mascot-wrapper">
                <div className="upshifter-mascot-glow" aria-hidden="true" />
                <MascotBadge 
                  pose="arrow" 
                  size="lg" 
                  showBadge={false}
                  className="relative z-10"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* EDITORIAL OUR UPSHIFT STORIES TESTIMONIAL SLIDER             */}
        {/* Automatic 2-Column Editorial Slider (No Orbit / No Controls) */}
        {/* ============================================================ */}
        <div
          id="outcomes"
          className="journey-testimonial-slider-card scroll-mt-28 md:scroll-mt-32"
          role="region"
          aria-label="Our UpShifter Stories Testimonials"
        >
          {/* Top Editorial Card Header */}
          <div className="journey-testimonial-header">
            <div className="journey-testimonial-header-left">
              <div className="journey-testimonial-accent-bar" />
              <h3 className="journey-testimonial-title">
                <span className="journey-testimonial-title-red">OUR</span>{' '}
                <span className="journey-testimonial-title-dark">UPSHIFTER STORIES</span>
              </h3>
              <p className="journey-testimonial-desc">
                See how people are turning AI capabilities into projects, opportunities and new career paths.
              </p>
            </div>

            <div className="journey-testimonial-badge-kicker">
              BUILD. PROVE. <span className="journey-testimonial-kicker-red">EARN.</span>
            </div>
          </div>

          {/* 2-Column Editorial Body */}
          <div className="journey-testimonial-grid">
            {/* Left Column: Dominant Circular Profile Photo + Person Identity */}
            <div className="journey-testimonial-profile-col">
              <div
                key={`pfp-${activeStory}`}
                className="journey-testimonial-pfp-frame"
              >
                {currentStory.avatar ? (
                  <img
                    src={currentStory.avatar}
                    alt={currentStory.name}
                    className="journey-testimonial-pfp-img"
                  />
                ) : (
                  <div className="journey-testimonial-pfp-initials">
                    <span className="journey-testimonial-initials-text">{currentStory.shortCode}</span>
                  </div>
                )}
              </div>

              <div key={`meta-${activeStory}`} className="journey-testimonial-profile-meta">
                <div className="journey-testimonial-pfp-name">{currentStory.name}</div>
              </div>
            </div>

            {/* Right Column: Editorial Quote & Verification Attribution */}
            <div className="journey-testimonial-content-col">
              <div
                key={`quote-${activeStory}`}
                className="journey-testimonial-quote-wrapper"
              >
                {/* Large Editorial Quotation Mark */}
                <div className="journey-testimonial-quote-mark" aria-hidden="true">
                  “
                </div>

                <blockquote className="journey-testimonial-quote-text">
                  <span className="journey-testimonial-dropcap" aria-hidden="true">
                    {firstLetter}
                  </span>
                  <span>{restOfQuote}</span>
                </blockquote>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* ENROLLMENT CTA PANEL                                         */}
        {/* Positioned below the Testimonial Section with proper spacing */}
        {/* ============================================================ */}
        <div className="journey-enrollment-panel journey-anim-cta">
          <div className="journey-enrollment-content">
            <h3 className="journey-enrollment-title">
              Ready to Start Your UpShift Journey?
            </h3>
            <p className="journey-enrollment-desc">
              One Journey that helps anyone turn AI capabilities into real projects, credible proof of work and new earning pathways.
            </p>
          </div>

          <Link
            to="/enroll"
            className="journey-enrollment-cta-btn"
            aria-label="Proceed to canonical UpShift enrollment"
          >
            <span>GET STARTED</span>
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

