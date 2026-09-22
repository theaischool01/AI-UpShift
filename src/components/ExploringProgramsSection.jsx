import React, { useState, useEffect, useRef } from 'react';

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
    name: 'VibeCoder',
    src: '/Page-2/VibeCoder.png',
    alt: 'VibeCoder',
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
// Each image is shown for 10 seconds total.
// Horizontal slide transition lasts ~800ms.
const INTERVAL_MS = 10000;
const TRANSITION_MS = 800;

export default function ExploringProgramsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(null);
  const [slideDirection, setSlideDirection] = useState('next');
  const [isSliding, setIsSliding] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

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

  // Single authoritative slideshow timer: advances every 10 seconds
  useEffect(() => {
    if (!isVisible) return;

    const delay = prefersReducedMotion ? INTERVAL_MS : INTERVAL_MS - TRANSITION_MS;
    const timer = setTimeout(() => {
      const upcoming = (currentIndex + 1) % SLIDES.length;
      setSlideDirection('next');

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

  const goToSlide = (idx, direction = 'next') => {
    if (idx === currentIndex || isSliding) return;
    setSlideDirection(direction);
    if (prefersReducedMotion) {
      setCurrentIndex(idx);
    } else {
      setNextIndex(idx);
      requestAnimationFrame(() => {
        setIsSliding(true);
      });
    }
  };

  const handleNext = () => {
    if (isSliding) return;
    const upcoming = (currentIndex + 1) % SLIDES.length;
    goToSlide(upcoming, 'next');
  };

  const handlePrev = () => {
    if (isSliding) return;
    const upcoming = (currentIndex - 1 + SLIDES.length) % SLIDES.length;
    goToSlide(upcoming, 'prev');
  };

  // Native horizontal touch swipe handling for mobile
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
        // Swipe Left -> Next Slide
        handleNext();
      } else {
        // Swipe Right -> Previous Slide
        handlePrev();
      }
    }
  };

  return (
    <div className="exploring-programs-section">
      {/* Multi-point Corner & Edge Atmospheric Soft Red Ambient Glows behind image */}
      <div
        className="absolute inset-0 pointer-events-none select-none overflow-hidden"
        style={{
          backgroundImage: `
            radial-gradient(circle at 12% 16%, rgba(227, 27, 35, 0.085) 0%, transparent 35%),
            radial-gradient(circle at 88% 16%, rgba(227, 27, 35, 0.085) 0%, transparent 35%),
            radial-gradient(circle at 12% 84%, rgba(227, 27, 35, 0.085) 0%, transparent 35%),
            radial-gradient(circle at 88% 84%, rgba(227, 27, 35, 0.085) 0%, transparent 35%),
            radial-gradient(ellipse 75% 65% at 50% 50%, rgba(227, 27, 35, 0.035) 0%, transparent 70%)
          `,
        }}
        aria-hidden="true"
      />

      {/* Centered Framing System: Framing Wrapper (Image + Left/Right Red Lines) + Dots */}
      <div className="relative z-20 flex flex-col items-center justify-center gap-4 sm:gap-5 max-w-full">
        {/* Relative Framing Wrapper for Image + Side Red Lines */}
        <div className="exploring-programs-framing-wrapper">
          {/* Left Decorative Vertical Editorial Red Line - Desktop / Tablet-large only */}
          <div
            className="exploring-programs-side-line exploring-programs-side-line--left"
            aria-hidden="true"
          />

          {/* Cinematic Slideshow Container with Touch Swipe */}
          <div
            className="relative overflow-hidden rounded-xl sm:rounded-2xl shrink-0 z-10"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            style={{
              width: 'min(1360px, calc(100vw - clamp(32px, 8vw, 120px)), calc((100svh - 90px) * (1672 / 941)))',
              aspectRatio: '1672 / 941',
              maxHeight: 'calc(100svh - 90px)',
              boxShadow: '0 14px 40px -12px rgba(227, 27, 35, 0.08), 0 4px 18px -4px rgba(0, 0, 0, 0.03)',
              touchAction: 'pan-y',
            }}
          >
            {/* Current Active Slide */}
            <div
              className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none"
              style={{
                transform: isSliding 
                  ? (slideDirection === 'next' ? 'translateX(-100%)' : 'translateX(100%)') 
                  : 'translateX(0%)',
                transition: isSliding
                  ? `transform ${TRANSITION_MS}ms cubic-bezier(0.25, 1, 0.5, 1)`
                  : 'none',
                willChange: isSliding ? 'transform' : 'auto',
              }}
            >
              <img
                src={currentSlide.src}
                alt={currentSlide.alt}
                className="w-full h-full object-contain block select-none pointer-events-none"
                loading="eager"
                draggable={false}
              />
            </div>

            {/* Incoming Slide */}
            {incomingSlide && (
              <div
                className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none"
                style={{
                  transform: isSliding 
                    ? 'translateX(0%)' 
                    : (slideDirection === 'next' ? 'translateX(100%)' : 'translateX(-100%)'),
                  transition: isSliding
                    ? `transform ${TRANSITION_MS}ms cubic-bezier(0.25, 1, 0.5, 1)`
                    : 'none',
                  willChange: isSliding ? 'transform' : 'auto',
                }}
              >
                <img
                  src={incomingSlide.src}
                  alt={incomingSlide.alt}
                  className="w-full h-full object-contain block select-none pointer-events-none"
                  loading="eager"
                  draggable={false}
                />
              </div>
            )}
          </div>

          {/* Right Decorative Vertical Editorial Red Line - Desktop / Tablet-large only */}
          <div
            className="exploring-programs-side-line exploring-programs-side-line--right"
            aria-hidden="true"
          />
        </div>

        {/* Reusable 6-Dot Pagination Navigation matching the Testimonial Style */}
        <div 
          className="flex items-center justify-center gap-2 pt-1 sm:pt-2 z-20"
          role="tablist"
          aria-label="Exploring Programs Slideshow Navigation"
        >
          {SLIDES.map((slide, idx) => {
            const isActive = currentIndex === idx;
            return (
              <button
                key={`slide-dot-${slide.code || idx}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Go to slide ${idx + 1}: ${slide.name}`}
                onClick={() => goToSlide(idx, idx > currentIndex ? 'next' : 'prev')}
                style={{
                  width: isActive ? '20px' : '8px',
                  height: '8px',
                  borderRadius: '9999px',
                  backgroundColor: isActive ? '#E31B23' : '#CBD5E1',
                  border: isActive ? '1px solid #E31B23' : '1px solid #94A3B8',
                  boxShadow: isActive ? '0 1px 6px rgba(227, 27, 35, 0.45)' : 'none',
                  padding: 0,
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  flexShrink: 0,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

