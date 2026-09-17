import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ArrowUpRight, 
  Play, 
  Palette, 
  Database, 
  Code, 
  Megaphone, 
  Bot, 
  Sparkles 
} from 'lucide-react';

const PROGRAM_ICONS = {
  'reelrush-ai': Play,
  'visualforge-ai': Palette,
  'deepannotator': Database,
  'vibe-coder': Code,
  'brandbuzz-ai': Megaphone,
  'agenthandlers': Bot,
  'agent-handlers': Bot,
};

export default function ProgramOrbitCarousel({ programs, onSelectProgram }) {
  // Check if desktop viewport (1024px+)
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
  );

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const numCards = programs.length;
  const angleStep = 360 / numCards; // 60 deg

  // Brand Buzz (id: 'brandbuzz-ai') starts in the front position
  const brandBuzzIdx = programs.findIndex(p => p.id === 'brandbuzz-ai');
  const initialAngle = brandBuzzIdx !== -1 ? -brandBuzzIdx * angleStep : 0;

  // Carousel rotation angle in degrees
  const [currentAngle, setCurrentAngle] = useState(initialAngle);
  const [targetAngle, setTargetAngle] = useState(initialAngle);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const dragStartX = useRef(0);
  const dragStartAngle = useRef(0);
  const animFrameRef = useRef(null);
  const lastTimeRef = useRef(performance.now());
  const stageRef = useRef(null);
  const wheelTimeoutRef = useRef(null);

  // Animation loop: smooth lerp + idle auto-rotation
  useEffect(() => {
    if (!isDesktop) return;
    let active = true;

    // Tab visibility handling: pause when hidden
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      } else {
        lastTimeRef.current = performance.now();
        animFrameRef.current = requestAnimationFrame(tick);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const prefersReducedMotion = typeof window !== 'undefined' && 
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const tick = (time) => {
      if (!active) return;
      const dt = Math.min((time - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = time;

      if (!isDragging) {
        if (isHovered || prefersReducedMotion) {
          // Smoothly interpolate currentAngle toward targetAngle
          setCurrentAngle((prev) => {
            const diff = targetAngle - prev;
            if (Math.abs(diff) < 0.05) return targetAngle;
            return prev + diff * 0.12;
          });
        } else {
          // Idle auto-rotation: very slow (~4 deg/s)
          const step = 4 * dt;
          setTargetAngle((prev) => prev + step);
          setCurrentAngle((prev) => prev + step);
        }
      }

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);
    return () => {
      active = false;
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isDesktop, isHovered, isDragging, targetAngle]);

  // Navigate forward / backward
  const handlePrev = useCallback(() => {
    setTargetAngle((prev) => Math.round((prev - angleStep) / angleStep) * angleStep);
  }, [angleStep]);

  const handleNext = useCallback(() => {
    setTargetAngle((prev) => Math.round((prev + angleStep) / angleStep) * angleStep);
  }, [angleStep]);

  // Bring specific card index to front
  const handleSelectIndex = useCallback((index) => {
    const target = -index * angleStep;
    setTargetAngle((prev) => {
      const currentMod = prev % 360;
      let diff = (target - currentMod) % 360;
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;
      return prev + diff;
    });
  }, [angleStep]);

  // Mouse / Touch drag handlers
  const handlePointerDown = (e) => {
    setIsDragging(true);
    const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    dragStartX.current = clientX;
    dragStartAngle.current = currentAngle;
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    const deltaX = clientX - dragStartX.current;
    const newAngle = dragStartAngle.current + deltaX * 0.32;
    setCurrentAngle(newAngle);
    setTargetAngle(newAngle);
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    // Snap to nearest 60-degree card
    const snapped = Math.round(currentAngle / angleStep) * angleStep;
    setTargetAngle(snapped);
  };

  // Mouse wheel / trackpad rotation
  const handleWheel = (e) => {
    const delta = e.deltaX !== 0 ? e.deltaX : e.deltaY;
    if (Math.abs(delta) < 8) return;
    setIsHovered(true);
    setTargetAngle((prev) => prev + (delta > 0 ? 15 : -15));
    if (wheelTimeoutRef.current) clearTimeout(wheelTimeoutRef.current);
    wheelTimeoutRef.current = setTimeout(() => {
      setTargetAngle((prev) => Math.round(prev / angleStep) * angleStep);
    }, 200);
  };

  // Find index of card currently closest to front
  const normalizedAngle = ((currentAngle % 360) + 360) % 360;
  const activeIndex = Math.round((360 - (normalizedAngle % 360)) / angleStep) % numCards;

  // Geometry: Shallow Orbit Radii around the Fox (Calibrated with ample vertical breathing room)
  const radiusX = 396; // Horizontal distance from center (expanded to comfortably clear enlarged fox)
  const radiusY = 86;  // Vertical perspective depth (calibrated so front card sits comfortably below fox)
  const orbitCenterY = 18; // Subtle downward offset so front card sits comfortably below fox
  const cardWidth = 222;  // Proportional card width (balanced content density)
  const cardHeight = 256; // Proportional card height (eliminates internal void while preventing clipping)

  return (
    <div className="w-full" style={{ position: 'relative' }}>
      {isDesktop ? (
        /* ============================================================ */
        /* DESKTOP VIEW: Orbit Around Central Fox                       */
        /* ============================================================ */
        <div 
          style={{ position: 'relative', width: '100%', userSelect: 'none' }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
            if (isDragging) handlePointerUp();
          }}
          ref={stageRef}
        >
          {/* Orbital Stage Container */}
          <div 
            style={{
              position: 'relative',
              width: '100%',
              height: 'clamp(520px, 62vh, 580px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'visible',
              cursor: isDragging ? 'grabbing' : 'grab',
            }}
            onMouseDown={handlePointerDown}
            onMouseMove={handlePointerMove}
            onMouseUp={handlePointerUp}
            onTouchStart={handlePointerDown}
            onTouchMove={handlePointerMove}
            onTouchEnd={handlePointerUp}
            onWheel={handleWheel}
          >
            {/* Editorial Brand Text — Left Flank (Purposefully fills composition whitespace) */}
            <div 
              style={{
                position: 'absolute',
                top: '20px',
                left: 'max(16px, 2%)',
                maxWidth: '220px',
                pointerEvents: 'none',
                userSelect: 'none',
                zIndex: 3,
              }}
              className="hidden lg:flex flex-col gap-1.5"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#E31B23' }} />
                <span style={{ fontFamily: 'monospace', fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', color: '#E31B23', textTransform: 'uppercase' }}>
                  UPSHIFT PRINCIPLE
                </span>
              </div>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '14px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '0.04em', textTransform: 'uppercase', lineHeight: 1.25 }}>
                BUILD WITH PURPOSE.
              </span>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)', lineHeight: 1.5, margin: 0 }}>
                Applied AI skills become valuable when they produce verified commercial work.
              </p>
            </div>

            {/* Editorial Brand Text — Right Flank (Receipts / Proof Standard) */}
            <div 
              style={{
                position: 'absolute',
                top: '20px',
                right: 'max(16px, 2%)',
                maxWidth: '220px',
                textAlign: 'right',
                pointerEvents: 'none',
                userSelect: 'none',
                zIndex: 3,
              }}
              className="hidden lg:flex flex-col items-end gap-1.5"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontFamily: 'monospace', fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', color: '#E31B23', textTransform: 'uppercase' }}>
                  THE PROOF STANDARD
                </span>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#E31B23' }} />
              </div>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '14px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '0.04em', textTransform: 'uppercase', lineHeight: 1.25 }}>
                YOUR SKILL SHOULD<br />HAVE RECEIPTS.
              </span>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)', lineHeight: 1.5, margin: 0 }}>
                From theoretical prompts to verifiable portfolio deliverables.
              </p>
            </div>

            {/* Ambient Orbital Ring Guide */}
            <div 
              style={{
                position: 'absolute',
                top: `calc(50% + ${orbitCenterY}px)`,
                left: '50%',
                width: `${radiusX * 2}px`,
                height: `${radiusY * 2}px`,
                transform: 'translate(-50%, -50%)',
                borderRadius: '50%',
                border: '1.5px dashed rgba(255, 255, 255, 0.18)',
                pointerEvents: 'none',
                opacity: 0.5,
                zIndex: 2,
              }}
            />

            {/* Central Fox Mascot (Enlarged +14% to 224x248, firmly anchored and fully visible) */}
            <div 
              style={{
                position: 'absolute',
                top: '46%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '224px',
                height: '248px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
                zIndex: 20, // Sits in front of back cards, behind front card
              }}
            >
              {/* Soft warm aura behind mascot */}
              <div 
                style={{
                  position: 'absolute',
                  width: '230px',
                  height: '230px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(233,29,43,0.20) 0%, rgba(255,167,38,0.09) 50%, transparent 75%)',
                  filter: 'blur(30px)',
                  zIndex: -1,
                }}
              />

              <img 
                src="/assets/mascot/mascot_builder_cutout.png" 
                alt="UPSHIFT Fox Mascot"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  transform: 'scale(1.10)',
                  filter: 'drop-shadow(0 14px 26px rgba(0,0,0,0.18))',
                }}
                draggable={false}
              />

              {/* Base Contact Shadow */}
              <div 
                style={{
                  width: '180px',
                  height: '14px',
                  background: 'radial-gradient(ellipse, rgba(0,0,0,0.22) 0%, transparent 70%)',
                  borderRadius: '50%',
                  marginTop: '-8px',
                }}
              />
            </div>

            {/* Orbiting Cards Revolving Around the Central Fox */}
            {programs.map((prog, i) => {
              const ProgIcon = PROGRAM_ICONS[prog.id] || Sparkles;

              // Card angle along the orbit
              const cardAngleDeg = currentAngle + i * angleStep;
              const rad = (cardAngleDeg * Math.PI) / 180;

              // Elliptical coordinate calculation (0 deg is front-facing / bottom)
              const x = Math.sin(rad) * radiusX;
              const y = Math.cos(rad) * radiusY + orbitCenterY;

              // Depth factor: 1 at front (bottom), 0 at back (top)
              const depth = (Math.cos(rad) + 1) / 2;
              
              // Scale & Opacity curves
              const scale = 0.76 + depth * 0.24; // 0.76 (back) to 1.0 (front)
              const opacity = 0.52 + depth * 0.48; // 0.52 (back) to 1.0 (front)

              // Cards behind fox have z-index 10-18, front cards have z-index 22-30
              const zIndex = Math.round(10 + depth * 22);
              const isFront = depth > 0.88;

              // Subtle rotation curve: left cards curve left (-5deg), right cards curve right (+5deg)
              const rotationDeg = -Math.sin(rad) * 7.5;

              return (
                <div
                  key={prog.id}
                  onClick={(e) => {
                    if (!isFront) {
                      e.stopPropagation();
                      handleSelectIndex(i);
                    }
                  }}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${scale}) rotate(${rotationDeg}deg)`,
                    opacity,
                    zIndex,
                    width: `${cardWidth}px`,
                    height: `${cardHeight}px`,
                    transition: isDragging ? 'none' : 'transform 0.14s ease-out, opacity 0.14s ease-out',
                    willChange: 'transform, opacity',
                    cursor: isFront ? 'default' : 'pointer',
                    backfaceVisibility: 'hidden',
                  }}
                >
                  {/* Compact, Clean Card Container */}
                  <div 
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '16px',
                      border: isFront ? '1.5px solid #111111' : '1px solid #E7E4DF',
                      padding: '14px 14px 12px 14px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      height: '100%',
                      boxShadow: isFront 
                        ? '0 16px 36px -6px rgba(17,17,17,0.14), 0 0 0 1px rgba(17,17,17,0.06)' 
                        : '0 4px 14px -2px rgba(17,17,17,0.06)',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'border-color 0.2s, box-shadow 0.2s',
                    }}
                  >
                    {/* Subtle Top Accent Line */}
                    <div 
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '3px',
                        backgroundColor: prog.color,
                      }}
                    />

                    <div>
                      {/* Header Row: Icon + Module Code & Category */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px', paddingTop: '2px' }}>
                        <div 
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            backgroundColor: prog.bgColor,
                            color: prog.color,
                            border: `1px solid ${prog.color}35`,
                          }}
                        >
                          <ProgIcon size={15} strokeWidth={2.2} />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <span 
                            style={{
                              padding: '2px 5px',
                              borderRadius: '4px',
                              fontSize: '9px',
                              fontFamily: 'monospace',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                              backgroundColor: `${prog.color}15`,
                              color: prog.color,
                              border: `1px solid ${prog.color}30`,
                            }}
                          >
                            {prog.code}
                          </span>
                          <span style={{ fontSize: '9px', fontFamily: 'monospace', color: '#8A8780', fontWeight: 600 }}>
                            4 WEEKS
                          </span>
                        </div>
                      </div>

                      {/* Track Title & Category */}
                      <div style={{ marginBottom: '3px' }}>
                        <span style={{ fontSize: '9px', fontFamily: 'monospace', color: '#77746E', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '1px' }}>
                          {prog.category}
                        </span>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.02rem', fontWeight: 700, color: '#111111', lineHeight: 1.15 }}>
                          {prog.name}
                        </h3>
                      </div>

                      {/* Tagline */}
                      <p style={{ fontSize: '10.5px', fontWeight: 600, color: '#4B5563', marginBottom: '7px', fontFamily: 'var(--font-display)' }}>
                        "{prog.tagline}"
                      </p>

                      {/* Signature Deliverable Box */}
                      <div style={{ backgroundColor: '#FAF8F5', border: '1px solid #EAE7E1', borderRadius: '8px', padding: '5px 8px', marginBottom: '7px' }}>
                        <span style={{ fontSize: '8px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#8A8780', fontWeight: 700, display: 'block', marginBottom: '1px' }}>
                          ★ Signature Deliverable
                        </span>
                        <p style={{ fontSize: '10px', fontWeight: 600, color: '#111111', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>
                          {prog.sampleArtifact.title}
                        </p>
                      </div>

                      {/* Compact Supporting Content: FOCUS (Existing Skills Data) */}
                      {prog.skills && prog.skills.length >= 2 && (
                        <div style={{ padding: '0 1px', marginBottom: '2px' }}>
                          <span style={{ fontSize: '8.5px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#8A8780', fontWeight: 700, display: 'block', marginBottom: '1px' }}>
                            FOCUS
                          </span>
                          <p style={{ fontSize: '10px', color: '#374151', lineHeight: 1.35, margin: 0, fontWeight: 600, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {prog.skills[0]} · {prog.skills[1]}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Card Action Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onSelectProgram) onSelectProgram(prog);
                      }}
                      style={{
                        width: '100%',
                        marginTop: 'auto',
                        padding: '6px 8px',
                        borderRadius: '7px',
                        border: '1px solid #E0DDD7',
                        backgroundColor: '#FFFFFF',
                        color: '#111111',
                        fontSize: '10.5px',
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '5px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#111111';
                        e.currentTarget.style.borderColor = '#111111';
                        e.currentTarget.style.color = '#FFFFFF';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#FFFFFF';
                        e.currentTarget.style.borderColor = '#E0DDD7';
                        e.currentTarget.style.color = '#111111';
                      }}
                    >
                      <span>View Track Details</span>
                      <ArrowUpRight size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* ============================================================ */
        /* MOBILE / TABLET VIEW: Clean Responsive Stack                 */
        /* ============================================================ */
        <div>
          {/* Responsive Mobile Editorial Micro-Copy (Normal Flow, Centered, Small) */}
          <div style={{ textAlign: 'center', marginBottom: '16px', padding: '0 8px' }}>
            <span style={{ fontFamily: 'monospace', fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', color: '#E31B23', textTransform: 'uppercase', display: 'block', marginBottom: '3px' }}>
              UPSHIFT PRINCIPLE
            </span>
            <p style={{ fontFamily: 'var(--font-heading)', fontSize: '12.5px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '0.03em', textTransform: 'uppercase', margin: 0, lineHeight: 1.4 }}>
              BUILD WITH PURPOSE. YOUR SKILL SHOULD HAVE RECEIPTS.
            </p>
          </div>

          {/* Mobile Mascot Callout */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', marginBottom: '20px', padding: '14px', borderRadius: '16px', backgroundColor: '#FAF8F5', border: '1px solid #EAE7E1' }}>
            <img 
              src="/assets/mascot/mascot_builder_cutout.png" 
              alt="UPSHIFT Mascot"
              style={{ width: '56px', height: '56px', objectFit: 'contain' }}
            />
            <div>
              <span style={{ fontSize: '11px', fontFamily: 'monospace', fontWeight: 700, color: '#E91D2B', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block' }}>
                Flagship Curriculum
              </span>
              <span style={{ fontSize: '13px', fontFamily: 'var(--font-display)', fontWeight: 700, color: '#111111' }}>
                Explore all 6 verified career tracks
              </span>
            </div>
          </div>

          {/* Clean Mobile Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            {programs.map((prog) => {
              const ProgIcon = PROGRAM_ICONS[prog.id] || Sparkles;

              return (
                <div
                  key={prog.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid #E7E4DF',
                    padding: '18px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div 
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '3.5px',
                      backgroundColor: prog.color,
                    }}
                  />

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', paddingTop: '2px' }}>
                      <div 
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: prog.bgColor,
                          color: prog.color,
                          border: `1px solid ${prog.color}35`,
                        }}
                      >
                        <ProgIcon size={18} strokeWidth={2.2} />
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span 
                          style={{
                            padding: '2px 7px',
                            borderRadius: '4px',
                            fontSize: '10px',
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            backgroundColor: `${prog.color}15`,
                            color: prog.color,
                            border: `1px solid ${prog.color}30`,
                          }}
                        >
                          {prog.code}
                        </span>
                        <span style={{ fontSize: '10px', fontFamily: 'monospace', color: '#8A8780', fontWeight: 600 }}>
                          4 WEEKS
                        </span>
                      </div>
                    </div>

                    <div style={{ marginBottom: '6px' }}>
                      <span style={{ fontSize: '10px', fontFamily: 'monospace', color: '#77746E', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
                        {prog.category}
                      </span>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700, color: '#111111' }}>
                        {prog.name}
                      </h3>
                    </div>

                    <p style={{ fontSize: '11.5px', fontWeight: 600, color: '#111111', marginBottom: '10px', fontFamily: 'var(--font-display)' }}>
                      "{prog.tagline}"
                    </p>

                    <div style={{ backgroundColor: '#FAF8F5', border: '1px solid #EAE7E1', borderRadius: '10px', padding: '9px 11px', marginBottom: '10px' }}>
                      <span style={{ fontSize: '9px', fontFamily: 'monospace', textTransform: 'uppercase', color: '#8A8780', fontWeight: 700, display: 'block', marginBottom: '2px' }}>
                        ★ Signature Deliverable
                      </span>
                      <p style={{ fontSize: '11.5px', fontWeight: 600, color: '#111111', margin: 0 }}>
                        {prog.sampleArtifact.title}
                      </p>
                    </div>

                    {/* Compact Supporting Content: FOCUS (Mobile) */}
                    {prog.skills && prog.skills.length >= 2 && (
                      <div style={{ padding: '0 2px', marginBottom: '16px' }}>
                        <span style={{ fontSize: '9px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#8A8780', fontWeight: 700, display: 'block', marginBottom: '3px' }}>
                          FOCUS
                        </span>
                        <p style={{ fontSize: '11.5px', color: '#374151', lineHeight: 1.4, margin: 0, fontWeight: 600 }}>
                          {prog.skills[0]} · {prog.skills[1]}
                        </p>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => onSelectProgram && onSelectProgram(prog)}
                    style={{
                      width: '100%',
                      marginTop: 'auto',
                      padding: '8px 12px',
                      borderRadius: '9px',
                      border: '1px solid #E0DDD7',
                      backgroundColor: '#FFFFFF',
                      color: '#111111',
                      fontSize: '11.5px',
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                    }}
                  >
                    <span>View Track Details</span>
                    <ArrowUpRight size={13} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
