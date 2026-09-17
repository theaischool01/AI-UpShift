import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onOpenRegistration }) {
  const { user, role } = useAuth();
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
    const sectionIds = ['hero', 'programs', 'courses', 'how-it-works', 'proof', 'opportunities', 'upshifter'];

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
  }, []);

  const navItems = [
    { id: 'programs', label: 'Programs' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'proof', label: 'The Receipt' },
    { id: 'opportunities', label: 'Opportunities' },
  ];

  const handleNavigate = (sectionId) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isHero = activeSection === 'hero';

  return (
    <header className="nav-floating-wrapper">
      <nav 
        className={`nav-floating ${isScrolled ? 'nav-scrolled' : ''} ${isHero ? 'navbar--hero' : ''}`}
        aria-label="Main Navigation"
      >
        {/* LEFT: Brand Lockup */}
        <div 
          onClick={() => handleNavigate('hero')}
          className="flex items-center gap-2.5 cursor-pointer shrink-0"
          style={{ textDecoration: 'none' }}
        >
          <div 
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: isHero ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(0,0,0,0.15)',
              backgroundColor: '#111111',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
              flexShrink: 0
            }}
          >
            <img 
              src="/assets/mascot/mascot_avatar.jpg" 
              alt="Upshift Fox Mascot" 
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 leading-none">
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: '800', letterSpacing: '0.1em', color: '#E31B23', textTransform: 'uppercase' }}>
                THE AI SCHOOL
              </span>
              <span style={{ color: isHero ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)', fontSize: '12px' }}>/</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: '800', letterSpacing: '-0.02em', color: isHero ? '#FFFFFF' : '#111111', transition: 'color 300ms ease' }}>
                UpShift
              </span>
            </div>
            <span style={{ fontSize: '9px', fontWeight: '700', color: isHero ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)', letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: '2px', transition: 'color 300ms ease' }}>
              Proof-of-Work Platform
            </span>
          </div>
        </div>

        {/* CENTER/RIGHT: Desktop Nav Items (Programs, How It Works, The Receipt, Opportunities) */}
        <div 
          className="nav-links-desktop"
          style={{
            backgroundColor: isHero ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.05)',
            padding: '3px 6px',
            borderRadius: '9999px',
            border: isHero ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(0, 0, 0, 0.08)',
            whiteSpace: 'nowrap',
            transition: 'background-color 450ms ease, border-color 450ms ease'
          }}
        >
          {navItems.map((item) => {
            const isActive = activeSection === item.id || (item.id === 'programs' && activeSection === 'courses');
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                style={{
                  padding: '5px 14px',
                  fontSize: '13px',
                  fontFamily: 'var(--font-display)',
                  fontWeight: isActive ? '700' : '600',
                  color: isActive ? (isHero ? '#ff2d46' : '#E31B23') : (isHero ? 'rgba(255, 255, 255, 0.90)' : '#222222'),
                  backgroundColor: isActive ? (isHero ? 'rgba(255, 255, 255, 0.10)' : 'rgba(227, 27, 35, 0.18)') : 'transparent',
                  borderRadius: '9999px',
                  border: isActive ? (isHero ? '1px solid rgba(255, 255, 255, 0.14)' : '1px solid rgba(227, 27, 35, 0.35)') : '1px solid transparent',
                  boxShadow: isActive ? (isHero ? 'inset 0 1px 0 rgba(255,255,255,0.08), 0 4px 14px rgba(0,0,0,0.18)' : '0 1px 4px rgba(227, 27, 35, 0.15)') : 'none',
                  transition: 'all 0.22s ease',
                  cursor: 'pointer'
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* RIGHT: Desktop Action CTAs (Login, Enroll) */}
        <div className="nav-ctas-desktop">
          {user ? (
            <Link
              to={role === 'admin' ? '/admin/dashboard' : '/learner/dashboard'}
              style={{
                padding: '7px 15px',
                fontSize: '13px',
                fontFamily: 'var(--font-display)',
                fontWeight: '700',
                color: isHero ? 'rgba(255, 255, 255, 0.92)' : '#222222',
                backgroundColor: isHero ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                border: isHero ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.12)',
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
                padding: '7px 15px',
                fontSize: '13px',
                fontFamily: 'var(--font-display)',
                fontWeight: '700',
                color: isHero ? 'rgba(255, 255, 255, 0.90)' : '#111111',
                backgroundColor: isHero ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                border: isHero ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid rgba(0, 0, 0, 0.08)',
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
              fontWeight: '800',
              color: '#FFFFFF',
              fontSize: '13px',
              padding: '7px 18px',
              boxShadow: '0 4px 14px rgba(227, 27, 35, 0.35)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              letterSpacing: '0.02em',
              textDecoration: 'none'
            }}
          >
            <span>ENROLL</span>
            <ArrowUpRight size={15} className="btn-arrow" />
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`nav-toggle-mobile p-1.5 transition-colors ${isHero ? 'text-white hover:text-[#E31B23]' : 'text-[#111111] hover:text-[#E31B23]'}`}
          aria-label="Toggle Mobile Menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div 
          className="nav-mobile-dropdown mt-2 p-4 rounded-2xl border border-white/10 bg-[#111111]/95 backdrop-blur-xl shadow-2xl flex flex-col gap-3 animate-fadeIn select-none"
          style={{ animationDuration: '200ms' }}
        >
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className="px-4 py-2.5 rounded-xl font-display text-sm font-semibold text-white/90 hover:text-white hover:bg-white/10 text-left transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
            {user ? (
              <Link
                to={role === 'admin' ? '/admin/dashboard' : '/learner/dashboard'}
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-secondary btn-md w-full justify-center font-bold"
                style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#ffffff', borderRadius: '9999px', textDecoration: 'none' }}
              >
                <span>WORKSPACE</span>
              </Link>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-secondary btn-md w-full justify-center font-bold"
                style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#ffffff', borderRadius: '9999px', textDecoration: 'none' }}
              >
                <span>LOGIN</span>
              </Link>
            )}
            <Link
              to="/enroll"
              onClick={() => setMobileMenuOpen(false)}
              className="btn btn-primary btn-md w-full justify-center font-extrabold"
              style={{ backgroundColor: '#E31B23', borderRadius: '9999px', color: '#FFFFFF', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <span>ENROLL</span>
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
