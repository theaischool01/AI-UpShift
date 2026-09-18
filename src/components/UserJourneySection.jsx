import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Award } from 'lucide-react';
import dianaAvatar from '../assets/diana_johnston.jpg';

const STORIES_DATA = [
  {
    id: 1,
    name: 'Edward Alexander',
    shortCode: 'EA',
    rating: '4.9',
    date: '29 Aug, 2026',
    role: 'Undergraduate Builder · ReelRush & Vibe Coder Track',
    quote: 'Overall pleasurable experience. Pay a little first and Pay a little during the development of the app as milestones are achieved, which made me feel very confident and comfortable. Seamless and Easy process.',
    story: 'After completing the ReelRush and Vibe Coder tracks, I delivered three automated video workflows for an e-commerce brand. Having real proof of work changed every client conversation.',
    badge: 'Verified Commercial Dispatch',
    avatar: null
  },
  {
    id: 2,
    name: 'Diana Johnston',
    shortCode: 'DJ',
    rating: '5.0',
    date: '02 Sep, 2026',
    role: 'Autonomous Agent Handler · AgentHandlers Track',
    quote: 'Zero prior coding background. Built client agents in 3 weeks with automated API workflows.',
    story: 'AgentHandlers taught me how to wire multi-agent workflows with real APIs. Building and shipping functional tools gave me the confidence to pitch and close local businesses on custom automation.',
    badge: 'Commercial Proof Verified',
    avatar: dianaAvatar
  },
  {
    id: 3,
    name: 'Lauren Contreras',
    shortCode: 'LC',
    rating: '4.9',
    date: '29 Aug, 2026',
    role: 'AI Annotation Specialist · DeepAnnotator Track',
    quote: 'Been working with UpShift for a number of years now with a variety of different apps. They have my recommendation. They are a great team.',
    story: 'DeepAnnotator gave me hands-on dataset evaluation skills that enterprise teams actually need. The portfolio project I published through UpShift became my proof of competence for a remote data curation contract.',
    badge: 'Sprint Retainer Completed',
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
      label: 'LEARN',
      title: 'Build the Skill',
      description: 'Master applied AI capabilities through intensive applied learning built around real-world tools.',
      artifactLabel: 'Applied AI Curriculum',
      artifactContent: 'ReelRush · VibeCoder · BrandBuzz'
    },
    {
      number: '02',
      label: 'PROOF OF WORK',
      title: 'Show the Work',
      description: 'Create and publish real deliverables that demonstrate what you can actually do.',
      artifactLabel: 'Verified Project Sheet',
      artifactContent: '100% Industry Fidelity Seal · Pinned Exhibit'
    },
    {
      number: '03',
      label: 'EARNING',
      title: 'Go After Opportunity',
      description: 'Connect your verified deliverables to client retainers, startup sprints, and paid opportunities.',
      artifactLabel: 'Opportunity Dispatch',
      artifactContent: 'Sprint Retainer · Freelance Brief'
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

                <div className="journey-card-artifact">
                  <span className="journey-artifact-label">★ {step.artifactLabel}</span>
                  <span className="journey-artifact-content">{step.artifactContent}</span>
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

                <p className="journey-card-desc" style={{ marginBottom: '14px' }}>
                  {step.description}
                </p>

                <div className="journey-card-artifact">
                  <span className="journey-artifact-label">★ {step.artifactLabel}</span>
                  <span className="journey-artifact-content">{step.artifactContent}</span>
                </div>
              </article>
            </div>
          ))}
        </div>

        {/* ============================================================ */}
        {/* EDITORIAL REAL UPSHIFT STORIES TESTIMONIAL SLIDER            */}
        {/* Automatic 2-Column Editorial Slider (No Orbit / No Controls) */}
        {/* ============================================================ */}
        <div
          className="journey-testimonial-slider-card"
          role="region"
          aria-label="Real UpShift Stories Testimonials"
        >
          {/* Top Editorial Card Header */}
          <div className="journey-testimonial-header">
            <div className="journey-testimonial-header-left">
              <div className="journey-testimonial-accent-bar" />
              <h3 className="journey-testimonial-title">
                <span className="journey-testimonial-title-red">REAL</span>{' '}
                <span className="journey-testimonial-title-dark">UPSHIFT STORIES</span>
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
                <div className="journey-testimonial-pfp-rating">
                  <span className="journey-testimonial-star-rating">★ {currentStory.rating}</span>
                  <span className="journey-testimonial-date">on {currentStory.date}</span>
                </div>
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

                {/* Clean Horizontal Divider & Attribution */}
                <div className="journey-testimonial-attribution-row">
                  <div className="journey-testimonial-attribution-info">
                    <div className="journey-testimonial-author-name">
                      {currentStory.name}
                    </div>
                    <div className="journey-testimonial-author-role">
                      {currentStory.role}
                    </div>
                  </div>

                  <div className="journey-testimonial-verify-badge">
                    <Award size={15} className="journey-testimonial-award-icon" />
                    <span>{currentStory.badge || 'Commercial Proof Verified'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* STEP 04 — ENROLLMENT CTA PANEL                               */}
        {/* Positioned below the Testimonial Section with proper spacing */}
        {/* ============================================================ */}
        <div className="journey-enrollment-panel journey-anim-cta">
          <div className="journey-enrollment-content">
            <span className="journey-enrollment-badge">STEP 04 · ENROLLMENT</span>
            <h3 className="journey-enrollment-title">
              Ready to Start Your UpShift Journey?
            </h3>
            <p className="journey-enrollment-desc">
              Select your applied track and build your first verified commercial proof of work.
            </p>
          </div>

          <Link
            to="/enroll"
            className="journey-enrollment-cta-btn"
            aria-label="Proceed to canonical UpShift enrollment"
          >
            <span>ENROLL NOW</span>
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

