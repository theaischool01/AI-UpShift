import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

const STORIES_DATA = [
  {
    id: 1,
    quote: '"I could buy a Laptop with my earnings, AI did the Magic for me."',
    story: 'After completing the ReelRush and Vibe Coder tracks, I delivered three automated video workflows for an e-commerce brand. Having real proof of work rather than just a certificate changed every client conversation.',
    name: 'Aman Verma',
    role: 'Undergraduate Builder · ReelRush & Vibe Coder Track',
    image: '/assets/mascot/mascot_builder.jpg',
    badge: 'Verified Commercial Dispatch'
  },
  {
    id: 2,
    quote: '"Turned two weeks of deep work into a live client retainer."',
    story: 'DeepAnnotator gave me hands-on dataset evaluation skills that enterprise teams actually need. The portfolio project I published through UpShift became my proof of competence for a remote data curation contract.',
    name: 'Rhea Sen',
    role: 'AI Annotation Specialist · DeepAnnotator Track',
    image: '/assets/mascot/mascot_inspecting.jpg',
    badge: 'Sprint Retainer Completed'
  },
  {
    id: 3,
    quote: '"Zero prior coding background. Built client agents in 3 weeks."',
    story: 'AgentHandlers taught me how to wire multi-agent workflows with real APIs. Building and shipping functional tools gave me the confidence to pitch and close local businesses on custom automation.',
    name: 'Devika Nair',
    role: 'Autonomous Agent Handler · AgentHandlers Track',
    image: '/assets/mascot/mascot_upshift_arrow.jpg',
    badge: 'Commercial Proof of Work'
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

  // Auto-rotate every 3 seconds (3000ms) continuously
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const timer = setInterval(() => {
      setActiveStory((prev) => (prev + 1) % STORIES_DATA.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [activeStory]); // Reset interval cleanly when activeStory changes (via timer or manual clicks)

  const handlePrevStory = () => {
    setActiveStory((prev) => (prev - 1 + STORIES_DATA.length) % STORIES_DATA.length);
  };

  const handleNextStory = () => {
    setActiveStory((prev) => (prev + 1) % STORIES_DATA.length);
  };

  const currentStory = STORIES_DATA[activeStory];

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
            DON'T JUST LEARN AI.<br />
            <span className="journey-heading-accent">BUILD A CAREER WITH IT.</span>
          </h2>

          <p className="journey-description journey-anim-desc">
            From acquiring applied capabilities to publishing verified deliverables and reaching real commercial opportunities.
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
        {/* COMPACT AI UPSHIFTER STORIES TESTIMONIAL SECTION             */}
        {/* Auto-rotates every 3 seconds with smooth transition          */}
        {/* ============================================================ */}
        <div className="journey-stories-wrapper journey-anim-cta">
          <div className="journey-stories-card">
            <div className="journey-stories-layout">
              {/* Left Column: Compact Circular Portrait */}
              <div className="journey-stories-portrait-col">
                <div className="journey-stories-portrait-frame">
                  <img
                    key={`portrait-${currentStory.id}`}
                    src={currentStory.image}
                    alt={currentStory.name}
                    className="journey-stories-img"
                  />
                  <div className="journey-stories-badge-pill">
                    <Sparkles size={10} style={{ color: '#059669' }} />
                    <span>{currentStory.badge}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Quote, Story, Author & Brand Label */}
              <div className="journey-stories-content-col">
                <div>
                  <h3 key={`quote-${currentStory.id}`} className="journey-stories-quote">
                    {currentStory.quote}
                  </h3>

                  <p key={`story-${currentStory.id}`} className="journey-stories-body">
                    {currentStory.story}
                  </p>

                  <div key={`author-${currentStory.id}`} className="journey-stories-author-block">
                    <span className="journey-stories-author-name">{currentStory.name}</span>
                    <span className="journey-stories-author-role">{currentStory.role}</span>
                  </div>
                </div>

                {/* Footer Bar: Editorial Label & Navigation Controls */}
                <div className="journey-stories-footer">
                  <div className="journey-stories-controls">
                    <button
                      type="button"
                      onClick={handlePrevStory}
                      className="journey-stories-btn"
                      aria-label="Previous UpShifter story"
                    >
                      <ChevronLeft size={15} />
                    </button>
                    <span className="journey-stories-indicator">
                      0{activeStory + 1} / 0{STORIES_DATA.length}
                    </span>
                    <button
                      type="button"
                      onClick={handleNextStory}
                      className="journey-stories-btn"
                      aria-label="Next UpShifter story"
                    >
                      <ChevronRight size={15} />
                    </button>
                  </div>

                  <div className="journey-stories-brand-label">
                    <span>AI UpShifter Stories</span>
                    <span className="journey-stories-brand-accent">...</span>
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
