import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import UpShiftWordmark from './common/UpShiftWordmark';

export default function Footer({ onNavigate }) {
  const footerRef = useRef(null);
  const svgRef = useRef(null);
  const gradientRef = useRef(null);

  const [isIntersecting, setIsIntersecting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleNavigate = (sectionId) => {
    if (onNavigate) {
      onNavigate(sectionId);
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // 1. Scroll-reveal trigger for the giant wordmark section
  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // 2. Cursor tracking for interactive SVG glow reveal
  const handleMouseMove = (e) => {
    if (!svgRef.current || !gradientRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    // Map cursor position to SVG viewBox space (1000 x 160)
    const x = Math.max(0, Math.min(1000, ((e.clientX - rect.left) / rect.width) * 1000));
    const y = Math.max(0, Math.min(160, ((e.clientY - rect.top) / rect.height) * 160));

    gradientRef.current.setAttribute('cx', x.toString());
    gradientRef.current.setAttribute('cy', y.toString());
  };

  return (
    <footer 
      ref={footerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="upshift-footer"
    >
      {/* Top Subtle Accent Line */}
      <div className="upshift-footer-accent-line" />

      {/* ============================================================ */}
      {/* SECTION 1: PRIMARY FOOTER CONTENT LAYER (3-COLUMN DESKTOP)   */}
      {/* ============================================================ */}
      <div className="upshift-footer-container upshift-footer-content-layer">
        <div className="upshift-footer-grid">
          
          {/* COLUMN 1 (LEFT): BRAND & DESCRIPTION */}
          <div className="upshift-footer-brand">
            <h2 className="upshift-footer-brand-title">
              <UpShiftWordmark theme="dark" />
            </h2>
            <p className="upshift-footer-brand-desc">
              Applied capability platform engineered around commercial proof of work.
            </p>
          </div>

          {/* COLUMN 2 (MIDDLE-LEFT): EXPLORE NAVIGATION */}
          <div className="upshift-footer-explore">
            <h4 className="upshift-footer-heading">
              EXPLORE
            </h4>
            <ul className="upshift-footer-list">
              <li>
                <button 
                  onClick={() => handleNavigate('programs')} 
                  className="upshift-footer-link"
                >
                  Programs
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigate('how-it-works')} 
                  className="upshift-footer-link"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigate('opportunities')} 
                  className="upshift-footer-link"
                >
                  Opportunities
                </button>
              </li>
            </ul>
          </div>

          {/* COLUMN 3 (MIDDLE-RIGHT): UPSHIFT NAVIGATION (BESIDE EXPLORE) */}
          <div className="upshift-footer-nav">
            <h4 className="upshift-footer-heading">
              UPSHIFT
            </h4>
            <ul className="upshift-footer-list">
              <li>
                <Link to="/enroll" className="upshift-footer-link">
                  Get Started
                </Link>
              </li>
              <li>
                <Link to="/login" className="upshift-footer-link">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/login" className="upshift-footer-link">
                  Workspace
                </Link>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* TOP THIN DIVIDER ABOVE GIANT WORDMARK */}
      <div className="upshift-footer-container">
        <hr className="upshift-footer-divider" />
      </div>

      {/* ============================================================ */}
      {/* SECTION 2: DEDICATED GIANT UPSHIFT WORDMARK LAYER (CENTERED) */}
      {/* ============================================================ */}
      <div aria-hidden="true" className="upshift-footer-wordmark-layer">
        <div
          className="upshift-footer-container upshift-footer-wordmark-inner"
          style={{
            transform: isIntersecting ? 'translateY(0)' : 'translateY(24px)',
            opacity: isIntersecting ? 1 : 0,
            transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease'
          }}
        >
          <svg
            ref={svgRef}
            viewBox="0 0 1000 160"
            className="upshift-footer-wordmark-svg"
            aria-hidden="true"
          >
            <defs>
              {/* Localized UpShift Red + White Glow following cursor */}
              <radialGradient
                id="upshiftHoverGlow"
                ref={gradientRef}
                gradientUnits="userSpaceOnUse"
                cx="500"
                cy="80"
                r="280"
              >
                <stop offset="0%" stopColor="#E31B23" stopOpacity="1" />
                <stop offset="35%" stopColor="#FFFFFF" stopOpacity="0.9" />
                <stop offset="70%" stopColor="#E31B23" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#E31B23" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Layer 1: Red stroke outline centered */}
            <text
              x="500"
              y="58%"
              dominantBaseline="middle"
              textAnchor="middle"
              fill="none"
              stroke="#E31B23"
              strokeOpacity="0.8"
              strokeWidth="1.8"
              fontSize="165"
              fontWeight="800"
              letterSpacing="-0.03em"
              fontFamily="Space Grotesk, var(--font-heading), sans-serif"
            >
              UPSHIFT
            </text>

            {/* Layer 2: Interactive Cursor Reveal Layer */}
            <text
              x="500"
              y="58%"
              dominantBaseline="middle"
              textAnchor="middle"
              fill="none"
              stroke="url(#upshiftHoverGlow)"
              strokeWidth="2.8"
              fontSize="165"
              fontWeight="800"
              letterSpacing="-0.03em"
              fontFamily="Space Grotesk, var(--font-heading), sans-serif"
              style={{
                opacity: isHovered ? 1 : 0,
                transition: 'opacity 0.3s ease'
              }}
            >
              UPSHIFT
            </text>
          </svg>
        </div>
      </div>

      {/* BOTTOM THIN DIVIDER BELOW GIANT WORDMARK */}
      <div className="upshift-footer-container">
        <hr className="upshift-footer-divider" />
      </div>

      {/* ============================================================ */}
      {/* SECTION 3: BOTTOM LEGAL BAR                                  */}
      {/* ============================================================ */}
      <div className="upshift-footer-container upshift-footer-legal-layer">
        <div className="upshift-footer-legal-flex">
          <p style={{ margin: 0 }}>© {new Date().getFullYear()} UpShift by The AI SCHOOL. All rights reserved.</p>
          <div className="upshift-footer-legal-links">
            <span className="upshift-footer-legal-link">Terms of Study</span>
            <span className="upshift-footer-legal-dot">·</span>
            <span className="upshift-footer-legal-link">Privacy Policy</span>
            <span className="upshift-footer-legal-dot">·</span>
            <span className="upshift-footer-legal-link">Honor Code</span>
            <span className="upshift-footer-legal-dot">·</span>
            <span className="upshift-footer-legal-link">Contact Studio</span>
          </div>
        </div>
      </div>

    </footer>
  );
}




