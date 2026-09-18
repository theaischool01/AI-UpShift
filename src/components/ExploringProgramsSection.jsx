import React, { useState, useEffect, useRef } from 'react';

const PROGRAMS = [
  {
    name: 'ReelRush AI',
    color: '#E93B3B',
    oneLiner: 'Turn ideas into motion with AI-powered short video creation.',
    fox: '/Page-2/Fox Reel Rush.png',
    card: '/Page-2/reel-rush-card.png',
    desktopPos: {
      left: '4.5%',
      top: '20%',
      rotation: '-7deg'
    }
  },
  {
    name: 'VisualForge AI',
    color: '#2563EB',
    oneLiner: 'Create striking visual identities, assets, and design concepts with AI.',
    fox: '/Page-2/Fox Visual Forge.png',
    card: '/Page-2/visual-forge-ai-card-dark.png',
    desktopPos: {
      left: '17.5%',
      top: '11%',
      rotation: '-4deg'
    }
  },
  {
    name: 'DeepAnnotator',
    color: '#059669',
    oneLiner: 'Train better AI through annotation, evaluation, and structured data work.',
    fox: '/Page-2/Fox Deep Annotator.png',
    card: '/Page-2/deep-annotator-card.png',
    desktopPos: {
      left: '31%',
      top: '5%',
      rotation: '-1.5deg'
    }
  },
  {
    name: 'Vibe Coder',
    color: '#7C3AED',
    oneLiner: 'Build websites, prototypes and micro-apps faster with AI-assisted coding.',
    fox: '/Page-2/Fox Vibe Code.png',
    card: '/Page-2/vibe-coder-card.png',
    desktopPos: {
      right: '31%',
      top: '5%',
      rotation: '1.5deg'
    }
  },
  {
    name: 'BrandBuzz AI',
    color: '#EA580C',
    oneLiner: 'Create smarter brand content, campaigns and growth assets.',
    fox: '/Page-2/Fox Brand Buzz.png',
    card: '/Page-2/brand-buzz-card.png',
    desktopPos: {
      right: '17.5%',
      top: '11%',
      rotation: '4deg'
    }
  },
  {
    name: 'AgentHandlers',
    color: '#0D9488',
    oneLiner: 'Build AI workflows and automations that do real work.',
    fox: '/Page-2/Fox Agent Handler.png',
    card: '/Page-2/agent-handlers-card.png',
    desktopPos: {
      right: '4.5%',
      top: '20%',
      rotation: '7deg'
    }
  }
];

const DEFAULT_FOX = '/Page-2/Main.png';
const DEFAULT_CAPTION = '6 Tracks. 1 Upshift.';

export default function ExploringProgramsSection() {
  const sectionRef = useRef(null);
  const [isInView, setIsInView] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null); // null = default Main.png

  // Timer references for uninterrupted continuous autoplay
  const loopTimerRef = useRef(null);
  const initialDelayRef = useRef(null);
  const clickResumeTimerRef = useRef(null);

  // Preload all 7 fox images and 6 card images for instantaneous transitions
  useEffect(() => {
    const assets = [
      DEFAULT_FOX,
      ...PROGRAMS.map(p => p.fox),
      ...PROGRAMS.map(p => p.card)
    ];
    assets.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Viewport IntersectionObserver
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        } else {
          // Reset when user scrolls away
          setIsInView(false);
          setActiveIndex(null);
          clearTimeout(initialDelayRef.current);
          clearTimeout(loopTimerRef.current);
          clearTimeout(clickResumeTimerRef.current);
        }
      },
      { threshold: 0.15, rootMargin: '60px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Initial sequence on viewport entry
  useEffect(() => {
    if (!isInView) return;

    // 0.0s: default Main.png, all 6 cards visible, default caption
    setActiveIndex(null);

    // Hold default state for exactly 2.5s, then start sequence with ReelRush AI (index 0)
    initialDelayRef.current = setTimeout(() => {
      setActiveIndex(0);
    }, 2500);

    return () => {
      clearTimeout(initialDelayRef.current);
      clearTimeout(loopTimerRef.current);
      clearTimeout(clickResumeTimerRef.current);
    };
  }, [isInView]);

  // Autoplay loop: 3.0s per program, continuous uninterrupted (cursor movement does NOT pause)
  useEffect(() => {
    if (!isInView || activeIndex === null) return;

    loopTimerRef.current = setTimeout(() => {
      setActiveIndex(prev => (prev === null ? 0 : (prev + 1) % PROGRAMS.length));
    }, 3000);

    return () => clearTimeout(loopTimerRef.current);
  }, [isInView, activeIndex]);

  // Intentional click on a card manually activates that card, then resumes autoplay smoothly after 3.5s
  const handleCardClick = (index) => {
    clearTimeout(loopTimerRef.current);
    clearTimeout(clickResumeTimerRef.current);
    setActiveIndex(index);

    clickResumeTimerRef.current = setTimeout(() => {
      setActiveIndex((index + 1) % PROGRAMS.length);
    }, 3500);
  };

  const currentProgram = activeIndex !== null ? PROGRAMS[activeIndex] : null;

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[clamp(840px,96vh,1080px)] flex flex-col justify-start pt-6 sm:pt-8 md:pt-10 pb-16 md:pb-20 lg:pb-24 bg-[#FAF8F5] text-[#111111] overflow-hidden select-none scroll-mt-20 md:scroll-mt-24"
      id="exploring-programs"
    >
      {/* Subtle Dot Matrix */}
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(rgba(0,0,0,0.15)_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Soft Center Radial Glow */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(233, 29, 43, 0.08) 0%, rgba(250, 248, 245, 0.8) 65%, transparent 90%)'
        }}
      />

      {/* Faint landscape / bridge illustration near bottom edges */}
      <svg
        className="absolute bottom-0 left-0 right-0 w-full h-28 pointer-events-none opacity-10"
        viewBox="0 0 1440 120"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M -20 120 L -20 50 Q 80 15, 180 55 T 380 90 L 420 120 Z"
          fill="rgba(230, 224, 216, 0.2)"
        />
        <path
          d="M 50 120 L 50 70 Q 140 45, 230 75 T 440 100 L 480 120 Z"
          fill="rgba(222, 215, 206, 0.15)"
        />
        <path
          d="M 720 115 C 880 75, 1140 85, 1440 70"
          stroke="rgba(0,0,0,0.15)"
          strokeWidth="1.5"
        />
        <path
          d="M 850 120 C 1000 90, 1220 100, 1440 90"
          stroke="rgba(0,0,0,0.1)"
          strokeWidth="1.5"
        />
        <line x1="920" y1="92" x2="920" y2="120" stroke="rgba(0,0,0,0.1)" strokeWidth="1.2" />
        <line x1="980" y1="84" x2="980" y2="120" stroke="rgba(0,0,0,0.1)" strokeWidth="1.2" />
        <line x1="1050" y1="82" x2="1050" y2="120" stroke="rgba(0,0,0,0.1)" strokeWidth="1.2" />
        <line x1="1130" y1="81" x2="1130" y2="120" stroke="rgba(0,0,0,0.1)" strokeWidth="1.2" />
        <line x1="1220" y1="80" x2="1220" y2="120" stroke="rgba(0,0,0,0.1)" strokeWidth="1.2" />
      </svg>

      {/* ============================================================ */}
      {/* MAIN CONTENT AREA WITH INTEGRATED FLANKING SIDEBAR TEXTS    */}
      {/* ============================================================ */}
      <div className="w-full max-w-[1380px] mx-auto px-4 sm:px-6 relative z-10">
        {/* Flanking Sidebar Elements — Aligned to the Section Container Grid */}
        {/* Top Left Vertical Steps: LEARN (black), PRACTICE (red), BUILD (black), EARN (red), GROW (black) */}
        <div className="editorial-top-left">
          <span className="font-bold" style={{ color: '#111111' }}>LEARN</span>
          <span className="font-bold" style={{ color: '#E31B23' }}>PRACTICE</span>
          <span className="font-bold" style={{ color: '#111111' }}>BUILD</span>
          <span className="font-bold" style={{ color: '#E31B23' }}>EARN</span>
          <span className="font-bold" style={{ color: '#111111' }}>GROW</span>
          <div className="mt-2 pt-2 border-t border-black/10 text-[9px] tracking-wider leading-relaxed font-sans font-bold">
            <span className="block" style={{ color: '#71757A' }}>SAME</span>
            <span className="block" style={{ color: '#111111' }}>PEOPLE.</span>
            <span className="block" style={{ color: '#71757A' }}>A BRIGHTER</span>
            <span className="block" style={{ color: '#111111' }}>TOMORROW.</span>
          </div>
        </div>

        {/* Top Right Expressive Script Text: BUILD (black), PROVE (black), EARN (red) */}
        <div className="editorial-top-right">
          <span 
            className="text-3xl sm:text-4xl font-bold leading-tight tracking-normal text-right"
            style={{ fontFamily: 'Caveat, cursive', transform: 'rotate(-5deg)' }}
          >
            <span className="block" style={{ color: '#111111' }}>BUILD.</span>
            <span className="block" style={{ color: '#111111' }}>PROVE.</span>
            <span className="block" style={{ color: '#E31B23' }}>EARN.</span>
          </span>
          <svg className="w-16 sm:w-20 h-3.5 mt-1" viewBox="0 0 80 16" fill="none">
            <path d="M 5 8 Q 40 14, 75 4" stroke="#E31B23" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>

        {/* Bottom Left Expressive Script Text: "Higher Skills Bigger Opportunities" */}
        <div className="editorial-bottom-left">
          <span 
            className="text-3xl sm:text-4xl font-bold leading-tight tracking-normal"
            style={{ fontFamily: 'Caveat, cursive', transform: 'rotate(-4deg)', color: '#71757A' }}
          >
            Higher<br /><span style={{ color: '#111111' }}>Skills</span>
          </span>
          <span 
            className="text-4xl sm:text-5xl font-bold leading-tight tracking-normal -mt-1"
            style={{ fontFamily: 'Caveat, cursive', transform: 'rotate(-4deg)', color: '#111111' }}
          >
            Bigger<br /><span style={{ color: '#E31B23' }}>Opportunities</span>
          </span>
          <svg className="w-24 sm:w-28 h-3.5 mt-1" viewBox="0 0 110 16" fill="none">
            <path d="M 6 8 Q 55 14, 105 4" stroke="#E31B23" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>

        {/* Main Heading Area */}
        <div className="max-w-3xl mx-auto text-center mb-6 md:mb-8 lg:mb-10">
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-[40px] font-bold text-[#111111] tracking-tight leading-tight mb-2.5">
            Exploring the <span style={{ color: '#E31B23' }}>UpShift</span> Programs
          </h2>

          <p className="font-display text-xs sm:text-sm text-[#222222] max-w-2xl mx-auto leading-relaxed font-medium">
            Six applied AI tracks. One <span className="text-[#71757A]">proof-first learning system</span>. Explore how each path turns AI knowledge into something real you can build and show.
          </p>
        </div>

        {/* ============================================================ */}
        {/* DESKTOP PROGRAM STAGE (MATCHING EXACT REFERENCE IMAGE)        */}
        {/* ============================================================ */}
        <div className="program-stage">
          {/* Six Course Badges Arranged in Reference Arc */}
          {PROGRAMS.map((program, idx) => {
            const isActive = activeIndex === idx;
            const isSubdued = activeIndex !== null && !isActive;

            const posStyle = {
              top: program.desktopPos.top,
              ...(program.desktopPos.left ? { left: program.desktopPos.left } : {}),
              ...(program.desktopPos.right ? { right: program.desktopPos.right } : {}),
            };

            return (
              <div
                key={program.name}
                className="program-card group"
                style={posStyle}
                onClick={() => handleCardClick(idx)}
              >
                <div
                  className="w-full h-full rounded-full overflow-hidden transition-all"
                  style={{
                    borderRadius: '50%',
                    transform: isActive 
                      ? `translateY(-6px) scale(1.08) rotate(${program.desktopPos.rotation})` 
                      : `translateY(0) scale(1) rotate(${program.desktopPos.rotation})`,
                    opacity: isActive ? 1 : isSubdued ? 0.82 : 1,
                    filter: isSubdued ? 'saturate(0.92)' : isActive ? 'brightness(1.06)' : 'none',
                    boxShadow: isActive
                      ? `0 0 0 3.5px ${program.color}, 0 12px 28px ${program.color}65`
                      : '0 4px 14px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.15)',
                    transition: `
                      transform 0.35s cubic-bezier(.22, .8, .32, 1),
                      opacity 0.35s ease,
                      filter 0.35s ease,
                      box-shadow 0.35s ease
                    `
                  }}
                >
                  <img
                    src={program.card}
                    alt={program.name}
                    loading="eager"
                    className="w-full h-full object-cover rounded-full select-none pointer-events-none"
                  />
                </div>
              </div>
            );
          })}

          {/* Central Hero Fox Mascot Stage (Elevated Closer to Cards) */}
          <div className="fox-stage">
            {/* Visual Anchor Container for Mascot */}
            <div className="fox-frame">
              {/* Default Fox: Main.png */}
              <img
                src={DEFAULT_FOX}
                alt="Upshift Mascot Main"
                style={{
                  opacity: activeIndex === null ? 1 : 0,
                  transform: activeIndex === null ? 'scale(1)' : 'scale(0.98)',
                  transition: 'opacity 0.38s ease, transform 0.45s cubic-bezier(.22,.8,.32,1)'
                }}
              />

              {/* Six Program-Specific Foxes Crossfading on Active State */}
              {PROGRAMS.map((program, idx) => (
                <img
                  key={program.name}
                  src={program.fox}
                  alt={program.name}
                  style={{
                    opacity: activeIndex === idx ? 1 : 0,
                    transform: activeIndex === idx ? 'scale(1)' : 'scale(0.98)',
                    transition: 'opacity 0.38s ease, transform 0.45s cubic-bezier(.22,.8,.32,1)'
                  }}
                />
              ))}
            </div>

            {/* Large Editorial Quote Treatment Below the Mascot (Matching Reference Image) */}
            <div className="program-editorial-quote">
              <div className="program-editorial-quote-bg" aria-hidden="true" />

              {/* Program Track Eyebrow */}
              <div className="program-quote-eyebrow">
                <span
                  className="program-quote-dot"
                  style={{ backgroundColor: currentProgram ? currentProgram.color : '#E31B23' }}
                />
                <span className="program-quote-track">
                  {currentProgram ? currentProgram.name : '6 Tracks · 1 Upshift'}
                </span>
              </div>

              {/* Flanked Editorial Quote Line */}
              <div className="program-quote-content">
                <span className="program-quote-mark program-quote-mark-open" aria-hidden="true">
                  &ldquo;
                </span>

                <p key={activeIndex ?? 'default'} className="program-quote-text">
                  {currentProgram
                    ? currentProgram.oneLiner
                    : 'Six applied AI tracks. One proof-first learning system to build and show.'}
                </p>

                <span className="program-quote-mark program-quote-mark-close" aria-hidden="true">
                  &rdquo;
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* MOBILE LIGHTWEIGHT FALLBACK (< 768px)                         */}
        {/* ============================================================ */}
        <div className="mobile-program-stage">
          {/* Mobile Mascot */}
          <div className="flex flex-col items-center justify-center mb-5">
            <div className="relative w-56 sm:w-64 h-72 sm:h-80 flex items-end justify-center">
              <img
                src={DEFAULT_FOX}
                alt="Upshift Mascot Main"
                className="absolute bottom-0 w-full h-full object-contain object-bottom"
                style={{
                  opacity: activeIndex === null ? 1 : 0,
                  transform: activeIndex === null ? 'scale(1)' : 'scale(0.97)',
                  transition: 'opacity 0.3s ease'
                }}
              />
              {PROGRAMS.map((program, idx) => (
                <img
                  key={program.name}
                  src={program.fox}
                  alt={program.name}
                  className="absolute bottom-0 w-full h-full object-contain object-bottom"
                  style={{
                    opacity: activeIndex === idx ? 1 : 0,
                    transform: activeIndex === idx ? 'scale(1)' : 'scale(0.97)',
                    transition: 'opacity 0.3s ease'
                  }}
                />
              ))}
            </div>

            {/* Mobile Dynamic Editorial Quote */}
            <div className="program-editorial-quote">
              <div className="program-quote-eyebrow">
                <span
                  className="program-quote-dot"
                  style={{ backgroundColor: currentProgram ? currentProgram.color : '#E31B23' }}
                />
                <span className="program-quote-track">
                  {currentProgram ? currentProgram.name : '6 Tracks · 1 Upshift'}
                </span>
              </div>

              <div className="program-quote-content">
                <span className="program-quote-mark program-quote-mark-open" aria-hidden="true">
                  &ldquo;
                </span>

                <p key={activeIndex ?? 'default'} className="program-quote-text">
                  {currentProgram
                    ? currentProgram.oneLiner
                    : 'Six applied AI tracks. One proof-first learning system to build and show.'}
                </p>

                <span className="program-quote-mark program-quote-mark-close" aria-hidden="true">
                  &rdquo;
                </span>
              </div>
            </div>
          </div>

          {/* Mobile Horizontal Scrollable Cards */}
          <div className="flex gap-4 overflow-x-auto pb-3 pt-2 px-3 snap-x snap-mandatory scrollbar-none items-center">
            {PROGRAMS.map((program, idx) => {
              const isActive = activeIndex === idx;
              return (
                <div
                  key={program.name}
                  onClick={() => handleCardClick(idx)}
                  className="flex-shrink-0 w-24 h-24 snap-center cursor-pointer transition-all duration-300 rounded-full overflow-hidden"
                  style={{
                    borderRadius: '50%',
                    transform: isActive ? 'scale(1.08)' : 'scale(0.96)',
                    opacity: activeIndex !== null && !isActive ? 0.75 : 1,
                    boxShadow: isActive
                      ? `0 0 0 3px ${program.color}, 0 8px 20px ${program.color}35`
                      : '0 2px 8px rgba(0,0,0,0.08), 0 0 0 1px #E7E4DF'
                  }}
                >
                  <img
                    src={program.card}
                    alt={program.name}
                    className="w-full h-full object-cover rounded-full select-none pointer-events-none"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
