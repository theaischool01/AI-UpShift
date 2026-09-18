import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UpShiftWordmark from './common/UpShiftWordmark';

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
    { id: 'proof', label: 'Outcomes' },
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
        {/* LEFT: Brand Lockup (THE AI SCHOOL | UpShift) */}
        <div 
          onClick={() => handleNavigate('hero')}
          className="flex items-center gap-2 cursor-pointer shrink-0 select-none group"
          style={{ textDecoration: 'none' }}
        >
          <div 
            style={{
              width: '28px',
              height: '28px',
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
          <div className="flex items-center gap-1.5 leading-none">
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '11.5px', fontWeight: '800', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              <span style={{ color: isHero ? '#FFFFFF' : '#111111' }}>THE </span>
              <span style={{ color: '#E31B23' }}>AI SCHOOL</span>
            </span>
            <span style={{ color: isHero ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.25)', fontSize: '12px', fontWeight: '300' }}>|</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: '800', letterSpacing: '-0.01em' }}>
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
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`nav-toggle-mobile p-1.5 transition-colors ${isHero ? 'text-white hover:text-[#E31B23]' : 'text-[#111111] hover:text-[#E31B23]'}`}
          aria-label="Toggle Mobile Menu"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div 
          className="nav-mobile-dropdown mt-2 p-4 rounded-2xl border border-white/10 bg-[#111111]/95 backdrop-blur-xl shadow-2xl flex flex-col gap-3 animate-fadeIn select-none"
          style={{ animationDuration: '200ms' }}
        >
          <div className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = activeSection === item.id || (item.id === 'programs' && activeSection === 'courses');
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className="px-4 py-2.5 rounded-xl font-display text-sm font-semibold text-left transition-colors"
                  style={{
                    backgroundColor: isActive ? '#FFFFFF' : 'transparent',
                    color: isActive ? '#111111' : 'rgba(255, 255, 255, 0.90)'
                  }}
                >
                  {item.label}
                </button>
              );
            })}
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
              <span>GET STARTED</span>
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
