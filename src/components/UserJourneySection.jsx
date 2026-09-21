import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import dianaAvatar from '../assets/diana_johnston.jpg';
import MascotBadge from './MascotBadge';

const STORIES_DATA = [
  {
    id: 1,
    name: 'P Likhitha',
    shortCode: 'L',
    avatar: dianaAvatar,
    quote: 'I didn’t expect much when I first started. I just wanted to make some extra money in my free time. Slowly, I got interested in the work and started learning new things. Now I feel much more confident than when I started.'
  },
  {
    id: 2,
    name: 'Shaik Irshad',
    shortCode: 'SI',
    avatar: '/assets/testimonial-01.webp',
    quote: 'I was looking for something flexible that I could do in my free time. I liked that I could work whenever I was available. The work helped me learn new skills, and the extra income has been useful for my daily expenses.'
  },
  {
    id: 3,
    name: 'P Prathyusha',
    shortCode: 'PP',
    avatar: '/assets/testimonial-02.webp',
    quote: 'I started working with The AISCHOOL as a freelancer because I wanted to earn something in my free time. At first, I was a little unsure, but once I started working, I got comfortable with it. I learned new things and also earned some money for my personal expenses.'
  },
  {
    id: 4,
    name: 'G Ruthwik',
    shortCode: 'GR',
    avatar: '/assets/testimonial-04.webp',
    quote: 'I joined because I wanted to learn something new and earn at the same time. Working on different tasks helped me understand things better. I also started earning from my work, which felt really good because I could use some of it for myself.'
  },
  {
    id: 5,
    name: 'K Anvitha',
    shortCode: 'KA',
    avatar: '/assets/testimonial-03.webp',
    quote: 'I wanted something I could do along with my regular studies, and this worked well for me. I could manage my own time and work when I was free. The money I earned helped me pay for a few things I wanted without always asking my parents.'
  },
  {
    id: 6,
    name: 'M Sufian',
    shortCode: 'MS',
    avatar: '/assets/testimonial-06.webp',
    quote: 'AISCHOOL has been a good experience for me. I don’t have to follow a fixed schedule, so I can work whenever I have time. I have learned a lot through the tasks, and the extra money has helped me with some of my monthly expenses.'
  },
  {
    id: 7,
    name: 'M Nandini',
    shortCode: 'MN',
    avatar: '/assets/testimonial-07.webp',
    quote: 'I started because I wanted to use my free time in a better way. I learned new things while working on real tasks, and slowly started earning as well. I have used some of my earnings for shopping, travel, and other things I wanted.'
  },
  {
    id: 8,
    name: 'O Srinath',
    shortCode: 'OS',
    avatar: '/assets/testimonial-05.webp',
    quote: 'When I first heard about the opportunity, I wasn’t sure if I could do the work. I decided to try it anyway. After completing a few tasks, I became more comfortable. Now I enjoy learning through the work and earning a little extra in my free time.'
  },


  {
    id: 9,
    name: 'K Preethi',
    shortCode: 'KP',
    avatar: '/assets/testimonial-08.png',
    quote: 'For me, it is not only about earning. I have learned how to manage my time, complete work properly, and be responsible for what I do. At the same time, having my own small income feels really nice because I can spend it on things I need or want.'
  },

  {
    id: 10,
    name: 'P Harish',
    shortCode: 'PH',
    avatar: '/assets/testimonial-10.png',
    quote: 'I started by helping with a few small projects. As I completed more work, I began receiving paid gigs regularly. I saved those earnings and bought my own laptop. That was the moment I felt I could genuinely build something for myself.'
  }
];

export default function UserJourneySection() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeStory, setActiveStory] = useState(0);

  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

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

  // Auto-rotate every 10 seconds continuously; reset timer on activeStory change
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStory((prev) => (prev + 1) % STORIES_DATA.length);
    }, 10000);

    return () => clearInterval(timer);
  }, [activeStory]);

  // Native horizontal touch swipe navigation for testimonials on mobile
  const handleTouchStart = (e) => {
    if (e.touches && e.touches.length > 0) {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    }
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    if (!e.changedTouches || e.changedTouches.length === 0) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const dx = touchEndX - touchStartX.current;
    const dy = touchEndY - touchStartY.current;

    touchStartX.current = null;
    touchStartY.current = null;

    // Detect if gesture is predominantly horizontal and exceeds threshold ~45px
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) >= 45) {
      if (dx < 0) {
        // Swipe Left -> Next Testimonial (wrap-around)
        setActiveStory((prev) => (prev + 1) % STORIES_DATA.length);
      } else {
        // Swipe Right -> Previous Testimonial (wrap-around)
        setActiveStory((prev) => (prev - 1 + STORIES_DATA.length) % STORIES_DATA.length);
      }
    }
  };

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
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* Left Brand Narrative */}
            <div className="lg:col-span-7 flex flex-col items-start justify-start pt-1 pb-6 sm:pb-8 max-w-[580px]">
              <div className="inline-flex items-center gap-2 mb-3.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E31B23]" />
                <span className="font-mono text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#FF5A65]">
                  THE UPSHIFTER STANDARD
                </span>
              </div>

              <h2 className="upshifter-title mb-4 sm:mb-5">
                <span className="text-white">WHAT IS AN</span><br />
                <span style={{ color: '#E31B23' }}>UPSHIFTER?</span>
              </h2>

              <p className="upshifter-quote mb-4 sm:mb-5">
                <span className="text-white">“An UpShifter doesn't just know AI.</span><br />
                <span style={{ color: '#E31B23', fontWeight: 700 }}>They know what to do with it.”</span>
              </p>

              <p className="upshifter-body max-w-[520px]">
                Build practical AI skills, create real proof of work, and turn those skills into opportunities.
              </p>
            </div>

            {/* Right Mascot Presence (Fox + Rock anchored to bottom of card) */}
            <div className="lg:col-span-5 flex flex-col items-center lg:items-end justify-end relative self-end">
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
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          style={{ touchAction: 'pan-y' }}
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

          {/* Bottom Pagination Dots Area (Bottom-Right) */}
          <div className="journey-testimonial-dots-row" role="tablist" aria-label="Testimonial Navigation">
            {STORIES_DATA.map((story, idx) => {
              const isActive = activeStory === idx;
              return (
                <button
                  key={`dot-${story.id || idx}`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-current={isActive ? 'true' : undefined}
                  aria-label={`Go to testimonial ${idx + 1}: ${story.name}`}
                  className={`journey-testimonial-dot ${isActive ? 'is-active' : ''}`}
                  onClick={() => setActiveStory(idx)}
                />
              );
            })}
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

