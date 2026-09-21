import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UpShiftWordmark from './common/UpShiftWordmark';

export default function Navbar({ onOpenRegistration }) {
  const { user, role } = useAuth();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  // Track scroll position for navbar background blur
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track active section as user scrolls through sections
  useEffect(() => {
    if (location.pathname !== '/') {
      setActiveSection('');
      return;
    }

    const sectionIds = ['hero', 'programs', 'courses', 'how-it-works', 'opportunities', 'upshifter'];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0px -40% 0px',
        threshold: 0.15
      }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [location.pathname]);

  const navItems = [
    { id: 'programs', label: 'Programs' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'outcomes', label: 'Outcomes' },
    { id: 'opportunities', label: 'Opportunities' },
  ];

  const handleNavigate = (sectionId) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = `/#${sectionId}`;
    }
  };

  const isHero = location.pathname === '/' && activeSection === 'hero';

  return (
    <header className="nav-floating-wrapper">
      <nav 
        className={`nav-floating ${isScrolled ? 'nav-scrolled' : ''} ${isHero ? 'navbar--hero' : ''}`}
        aria-label="Main Navigation"
      >
        {/* LEFT: Brand Lockup (THE AI SCHOOL | UpShift) */}
        <div 
          onClick={() => handleNavigate('hero')}
          className="flex items-center gap-1.5 sm:gap-2 cursor-pointer shrink-0 select-none group min-w-0"
          style={{ textDecoration: 'none' }}
        >
          <div 
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: isHero ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(0,0,0,0.15)',
              backgroundColor: '#111111',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5px',
              flexShrink: 0
            }}
          >
            <img 
              src="/assets/mascot/mascot_avatar.jpg" 
              alt="Upshift Mascot" 
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
            />
          </div>
          <div className="flex items-center gap-1 sm:gap-1.5 leading-none whitespace-nowrap">
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: '800', letterSpacing: '0.03em', textTransform: 'uppercase' }}>
              <span style={{ color: isHero ? '#FFFFFF' : '#111111' }}>THE </span>
              <span style={{ color: '#E31B23' }}>AI SCHOOL</span>
            </span>
            <span style={{ color: isHero ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.25)', fontSize: '11px', fontWeight: '300' }}>|</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '12.5px', fontWeight: '800', letterSpacing: '-0.01em' }}>
              <UpShiftWordmark theme={isHero ? 'dark' : 'light'} />
            </span>
          </div>
        </div>

        {/* CENTER: Desktop Nav Items (Programs, How It Works, Outcomes, Opportunities) */}
        <div 
          className="nav-links-desktop"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            whiteSpace: 'nowrap'
          }}
        >
          {navItems.map((item) => {
            const isActive = activeSection === item.id || (item.id === 'programs' && activeSection === 'courses');
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`nav-item-link ${isActive ? 'is-active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* RIGHT: Desktop Action CTAs (LOGIN, HOW UPSHIFT WORKS ↗) */}
        <div className="nav-ctas-desktop" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {user ? (
            <Link
              to={role === 'admin' ? '/admin/dashboard' : '/learner/dashboard'}
              style={{
                padding: '6px 14px',
                fontSize: '12.5px',
                fontFamily: 'var(--font-display)',
                fontWeight: '700',
                color: isHero ? '#FFFFFF' : '#111111',
                backgroundColor: isHero ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                border: isHero ? '1px solid rgba(255, 255, 255, 0.18)' : '1px solid rgba(0, 0, 0, 0.12)',
                borderRadius: '9999px',
                textDecoration: 'none',
                transition: 'all 200ms ease'
              }}
            >
              WORKSPACE
            </Link>
          ) : (
            <Link
              to="/login"
              style={{
                padding: '6px 14px',
                fontSize: '12.5px',
                fontFamily: 'var(--font-display)',
                fontWeight: '700',
                color: isHero ? 'rgba(255, 255, 255, 0.90)' : '#111111',
                backgroundColor: isHero ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)',
                border: isHero ? '1px solid rgba(255, 255, 255, 0.18)' : '1px solid rgba(0, 0, 0, 0.1)',
                borderRadius: '9999px',
                cursor: 'pointer',
                transition: 'all 200ms ease',
                textDecoration: 'none'
              }}
            >
              LOGIN
            </Link>
          )}

          <Link
            to="/enroll"
            className="btn btn-primary group"
            style={{
              backgroundColor: '#E31B23',
              borderRadius: '9999px',
              fontWeight: '700',
              color: '#FFFFFF',
              fontSize: '12.5px',
              padding: '6px 15px',
              boxShadow: '0 2px 10px rgba(227, 27, 35, 0.35)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              letterSpacing: '0.02em',
              textDecoration: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <span>GET STARTED</span>
            <ArrowUpRight size={14} className="btn-arrow" />
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`nav-toggle-mobile p-2 transition-colors cursor-pointer ${isHero ? 'text-white hover:text-[#E31B23]' : 'text-[#111111] hover:text-[#E31B23]'}`}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          style={{
            minWidth: '44px',
            minHeight: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'auto',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          {mobileMenuOpen ? (
            <X size={24} strokeWidth={2.4} style={{ color: isHero ? '#FFFFFF' : '#111111' }} />
          ) : (
            <Menu size={24} strokeWidth={2.4} style={{ color: isHero ? '#FFFFFF' : '#111111' }} />
          )}
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div 
          className="nav-mobile-dropdown mt-2.5 p-4 rounded-2xl flex flex-col gap-3 animate-fadeIn select-none"
          style={{ 
            animationDuration: '180ms', 
            pointerEvents: 'auto',
            position: 'relative',
            zIndex: 1002,
            width: '100%',
            maxWidth: 'min(980px, calc(100vw - 32px))',
            backgroundColor: '#080808',
            background: '#080808',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(255, 255, 255, 0.08)',
            boxSizing: 'border-box'
          }}
        >
          <div className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const isActive = activeSection === item.id || (item.id === 'programs' && activeSection === 'courses');
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavigate(item.id)}
                  className="px-4 py-3 rounded-xl font-display text-sm font-semibold text-left transition-colors flex items-center"
                  style={{
                    minHeight: '44px',
                    backgroundColor: isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.06)',
                    color: isActive ? '#080808' : '#FFFFFF',
                    border: isActive ? '1px solid #FFFFFF' : '1px solid rgba(255, 255, 255, 0.05)',
                    cursor: 'pointer',
                    pointerEvents: 'auto',
                    width: '100%',
                    fontWeight: isActive ? '700' : '600'
                  }}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div 
            className="pt-3 flex flex-col gap-2.5"
            style={{ borderTop: '1px solid rgba(255, 255, 255, 0.12)' }}
          >
            {user ? (
              <Link
                to={role === 'admin' ? '/admin/dashboard' : '/learner/dashboard'}
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-secondary btn-md w-full justify-center font-bold"
                style={{ 
                  minHeight: '44px', 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                  color: '#FFFFFF', 
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  borderRadius: '9999px', 
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'auto',
                  fontSize: '13px'
                }}
              >
                <span>WORKSPACE</span>
              </Link>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-secondary btn-md w-full justify-center font-bold"
                style={{ 
                  minHeight: '44px', 
                  backgroundColor: 'rgba(255, 255, 255, 0.08)', 
                  color: '#FFFFFF', 
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  borderRadius: '9999px', 
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'auto',
                  fontSize: '13px'
                }}
              >
                <span>LOGIN</span>
              </Link>
            )}
            <Link
              to="/enroll"
              onClick={() => setMobileMenuOpen(false)}
              className="btn btn-primary btn-md w-full justify-center font-extrabold"
              style={{ 
                minHeight: '44px', 
                backgroundColor: '#E31B23', 
                borderRadius: '9999px', 
                color: '#FFFFFF', 
                textDecoration: 'none', 
                display: 'inline-flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: '6px',
                pointerEvents: 'auto',
                fontSize: '13px',
                boxShadow: '0 4px 16px rgba(227, 27, 35, 0.45)'
              }}
            >
              <span>GET STARTED</span>
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
