import React, { useState, useEffect } from 'react';

// Exact ordered array of 6 cinematic specialization track slides
const SLIDES = [
  {
    code: '01',
    name: 'ReelRush AI',
    src: '/Page-2/Reel Rush-AI.png',
    alt: 'ReelRush AI',
  },
  {
    code: '02',
    name: 'VisualForge AI',
    src: '/Page-2/Visual Forge-AI.png',
    alt: 'VisualForge AI',
  },
  {
    code: '03',
    name: 'DeepAnnotator',
    src: '/Page-2/DeepAnnotator.png',
    alt: 'DeepAnnotator',
  },
  {
    code: '04',
    name: 'Vibe Coder',
    src: '/Page-2/VibeCoder.png',
    alt: 'Vibe Coder',
  },
  {
    code: '05',
    name: 'BrandBuzz AI',
    src: '/Page-2/Brand Buzz-AI.png',
    alt: 'BrandBuzz AI',
  },
  {
    code: '06',
    name: 'AgentHandlers',
    src: '/Page-2/Agent Handlers-AI.png',
    alt: 'AgentHandlers',
  },
];

// Display timing:
// Each image is shown for 3.5 seconds total.
// Horizontal slide transition lasts ~750ms.
const INTERVAL_MS = 3500;
const TRANSITION_MS = 750;

export default function ExploringProgramsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(null);
  const [isSliding, setIsSliding] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Preload all 6 images immediately on mount so no slide flashes blank
  useEffect(() => {
    SLIDES.forEach((slide) => {
      const img = new Image();
      img.src = slide.src;
    });
  }, []);

  // Listen for user reduced motion accessibility preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e) => setPrefersReducedMotion(e.matches);
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  // Pause timer when browser tab is hidden to prevent desynchronization
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(document.visibilityState !== 'hidden');
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Single authoritative slideshow timer: advances every 3.5 seconds
  useEffect(() => {
    if (!isVisible) return;

    const delay = prefersReducedMotion ? INTERVAL_MS : INTERVAL_MS - TRANSITION_MS;
    const timer = setTimeout(() => {
      const upcoming = (currentIndex + 1) % SLIDES.length;

      if (prefersReducedMotion) {
        setCurrentIndex(upcoming);
      } else {
        setNextIndex(upcoming);
        requestAnimationFrame(() => {
          setIsSliding(true);
        });
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [currentIndex, prefersReducedMotion, isVisible]);

  // Complete slide transition and reset sliding state
  useEffect(() => {
    if (!isSliding || nextIndex === null) return;

    const transitionTimer = setTimeout(() => {
      setCurrentIndex(nextIndex);
      setNextIndex(null);
      setIsSliding(false);
    }, TRANSITION_MS);

    return () => clearTimeout(transitionTimer);
  }, [isSliding, nextIndex]);

  const currentSlide = SLIDES[currentIndex];
  const incomingSlide = nextIndex !== null ? SLIDES[nextIndex] : null;

  return (
    <div className="w-full relative overflow-hidden bg-[#FAF8F5] select-none flex items-center justify-center p-3 sm:p-5 md:p-6 lg:p-7">
      {/* Cinematic Slideshow Container with matching 4-side framing */}
      <div
        className="w-full mx-auto relative overflow-hidden rounded-xl sm:rounded-2xl shadow-sm"
        style={{
          maxWidth: '1540px',
          aspectRatio: '1672 / 941',
          border: '1.5px solid #000000',
        }}
      >
        {/* Current Active Slide (slides out to the left) */}
        <div
          className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none"
          style={{
            transform: isSliding ? 'translateX(-100%)' : 'translateX(0%)',
            transition: isSliding
              ? `transform ${TRANSITION_MS}ms cubic-bezier(0.25, 1, 0.5, 1)`
              : 'none',
            willChange: isSliding ? 'transform' : 'auto',
          }}
        >
          <img
            src={currentSlide.src}
            alt={currentSlide.alt}
            className="w-full h-full object-cover block select-none pointer-events-none"
            loading="eager"
            draggable={false}
          />
        </div>

        {/* Incoming Slide (slides in from the right to center) */}
        {incomingSlide && (
          <div
            className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none"
            style={{
              transform: isSliding ? 'translateX(0%)' : 'translateX(100%)',
              transition: isSliding
                ? `transform ${TRANSITION_MS}ms cubic-bezier(0.25, 1, 0.5, 1)`
                : 'none',
              willChange: isSliding ? 'transform' : 'auto',
            }}
          >
            <img
              src={incomingSlide.src}
              alt={incomingSlide.alt}
              className="w-full h-full object-cover block select-none pointer-events-none"
              loading="eager"
              draggable={false}
            />
          </div>
        )}
      </div>
    </div>
  );
}
