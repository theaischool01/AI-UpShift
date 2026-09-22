import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  Award, 
  Briefcase, 
  Users, 
  Target, 
  ShieldCheck,
  Zap,
  ChevronRight
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { PROGRAMS_DATA } from '../data/programsData';

export default function ProgramDetailPage() {
  const { trackId } = useParams();
  const navigate = useNavigate();

  // Scroll to top on page load or trackId change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [trackId]);

  // Look up authoritative program by ID or code slug
  const programIndex = PROGRAMS_DATA.findIndex(
    (p) => p.id === trackId || p.code.toLowerCase() === trackId?.toLowerCase()
  );

  const program = programIndex !== -1 ? PROGRAMS_DATA[programIndex] : null;

  // Next and previous programs for bottom navigation
  const prevProgram = programIndex !== -1 
    ? PROGRAMS_DATA[(programIndex - 1 + PROGRAMS_DATA.length) % PROGRAMS_DATA.length] 
    : null;
  const nextProgram = programIndex !== -1 
    ? PROGRAMS_DATA[(programIndex + 1) % PROGRAMS_DATA.length] 
    : null;

  // Handle 404 state if unknown track is requested
  if (!program) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#111111]">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-6 pt-24 pb-20">
          <div className="max-w-md w-full bg-white border border-[#E5E7EB] rounded-3xl p-8 text-center space-y-5 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-[#FFF1F1] text-[#E31B23] flex items-center justify-center mx-auto border border-[#FECACA]">
              <span className="text-xl font-bold font-mono">!</span>
            </div>
            <div>
              <h1 className="text-xl font-extrabold font-heading text-[#111827] mb-2">
                Track Not Found
              </h1>
              <p className="text-sm text-[#4B5563] leading-relaxed">
                The specialization track you requested does not exist or has been relocated.
              </p>
            </div>
            <Link
              to="/#courses"
              className="btn btn-primary w-full justify-center py-2.5 text-xs font-bold text-white"
              style={{ backgroundColor: '#E31B23', borderRadius: '9999px', textDecoration: 'none' }}
            >
              ← Back to All Programs
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="program-detail-root selection:bg-[#E31B23] selection:text-white">
      {/* Editorial Floating Navbar */}
      <Navbar />

      <main className="program-detail-main">
        {/* ============================================================ */}
        {/* 1. HERO SECTION WITH CONTEXTUAL BREADCRUMB                   */}
        {/* ============================================================ */}
        <section className="program-detail-container">
          {/* Subtle Contextual Back Navigation */}
          <div className="program-back-nav">
            <Link
              to="/#courses"
              className="program-back-btn"
            >
              <ArrowLeft size={13} />
              <span>Back to Exploring Programs</span>
            </Link>
          </div>

          {/* Hero Card */}
          <div className="program-hero-card">
            {/* Top Accent Color Line */}
            <div className="program-hero-accent-bar" />

            <div className="program-hero-grid">
              {/* Left Hero Column: Identity, Title, Tagline & CTAs */}
              <div className="flex flex-col items-start min-w-0">
                {/* Track Code & Category Badges */}
                <div className="program-badge-row">
                  <span className="program-badge-track">
                    {program.code}
                  </span>
                  <span className="program-badge-duration">
                    4 WEEKS INTENSIVE
                  </span>
                  <span className="program-badge-category">
                    {program.category}
                  </span>
                </div>

                {/* Big Track Title */}
                <h1 className="program-hero-title">
                  {program.name}
                </h1>

                {/* Positioning Tagline with selective Red emphasis */}
                {(() => {
                  const parts = program.tagline.split('.');
                  if (parts.length > 1 && parts[1].trim()) {
                    return (
                      <p className="program-hero-tagline">
                        <span>"{parts[0].trim()}. </span>
                        <span className="highlight-red">{parts.slice(1).join('.').trim()}"</span>
                      </p>
                    );
                  }
                  return (
                    <p className="program-hero-tagline">
                      "{program.tagline}"
                    </p>
                  );
                })()}

                {/* Short Course Overview */}
                <p className="program-hero-desc">
                  {program.overview || program.oneSentence}
                </p>

                {/* Action CTAs: GET STARTED (Primary Red) + View Proofs */}
                <div className="program-hero-actions">
                  <Link
                    to={`/enroll?track=${program.id}`}
                    className="program-btn-primary"
                  >
                    <span>GET STARTED</span>
                    <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                  </Link>

                  <a
                    href="#curriculum"
                    className="program-btn-secondary"
                  >
                    <span>Explore Curriculum</span>
                    <span style={{ color: '#E31B23', fontWeight: 800 }}>↓</span>
                  </a>
                </div>
              </div>

              {/* Right Hero Column: Dominant Course Artwork */}
              <div className="flex flex-col items-center justify-center min-w-0">
                <div className="program-hero-artwork w-full">
                  <img
                    src={program.image}
                    alt={program.name}
                    loading="eager"
                  />
                  <div className="program-hero-artwork-badge">
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#E31B23', display: 'inline-block' }} />
                    <span>FLAGSHIP CURRICULUM</span>
                  </div>
                </div>

                {/* Verified Proof Capstone Badge under Image */}
                {program.sampleArtifact && (
                  <div className="program-capstone-banner">
                    <div className="program-capstone-label">
                      <Award size={14} style={{ color: '#E31B23', flexShrink: 0 }} />
                      <span>Signature Capstone:</span>
                    </div>
                    <span className="program-capstone-value">
                      {program.sampleArtifact.title}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 2. PRACTICAL OUTCOME & TARGET AUDIENCE BANNER                */}
        {/* ============================================================ */}
        <section className="program-detail-container">
          <div className="program-outcome-grid">
            {/* The Practical Outcome Card */}
            <div className="program-outcome-card">
              <div className="program-outcome-eyebrow">
                <Target size={15} />
                <span>THE PRACTICAL OUTCOME</span>
              </div>
              <h3 className="program-outcome-heading">
                Ship <span style={{ color: '#E31B23' }}>verified commercial work</span>, not just prompts.
              </h3>
              <p className="program-outcome-desc">
                {program.oneSentence}
              </p>
            </div>

            {/* Who It's For Card */}
            <div className="program-audience-card">
              <div>
                <div className="program-audience-eyebrow">
                  <Users size={15} />
                  <span>WHO IT'S FOR</span>
                </div>
                <h3 className="program-audience-heading">
                  Designed for High-Output Builders
                </h3>
                <p className="program-audience-desc">
                  {program.whoItsFor}
                </p>
              </div>
              <div className="program-audience-badge">
                <ShieldCheck size={15} style={{ color: '#E31B23', flexShrink: 0 }} />
                <span>Zero Prior AI Coding Required</span>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 3. WHAT YOU WILL BUILD / COMMERCIAL DELIVERABLES             */}
        {/* ============================================================ */}
        <section className="program-detail-container">
          <div className="program-section-header">
            <span className="program-section-eyebrow">
              THE PROOF STANDARD
            </span>
            <h2 className="program-section-title">
              Commercial Deliverables <span style={{ color: '#E31B23' }}>You Will Ship</span>
            </h2>
            <p className="program-section-desc">
              By the end of the 4-week cohort, your portfolio will include verified production deliverables ready for client gigs or venture launches.
            </p>
          </div>

          <div className="program-deliverables-grid">
            {program.whatYouBuild.map((item, idx) => (
              <div 
                key={idx}
                className="program-deliverable-card"
              >
                <div className="program-deliverable-idx">
                  0{idx + 1}
                </div>
                <div className="min-w-0">
                  <h3 className="program-deliverable-title">
                    {item}
                  </h3>
                  <p className="program-deliverable-desc">
                    Verified cohort milestone deliverable with complete asset breakdown and documentation.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================ */}
        {/* 4. WHAT YOU WILL LEARN / CURRICULUM MATRIX                  */}
        {/* ============================================================ */}
        <section id="curriculum" className="program-detail-container scroll-mt-24">
          <div className="program-curriculum-card">
            <div className="program-section-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#E31B23', marginBottom: '6px' }}>
                <Sparkles size={15} />
                <span className="program-section-eyebrow" style={{ margin: 0 }}>
                  APPLIED CAPABILITY MATRIX
                </span>
              </div>
              <h2 className="program-section-title">
                Curriculum & Key Capabilities
              </h2>
              <p className="program-section-desc">
                Master modern AI tools through rigorous, practical execution rather than theoretical lectures.
              </p>
            </div>

            <div className="program-capabilities-grid">
              {program.skills.map((skill, idx) => (
                <div 
                  key={idx}
                  className="program-capability-item"
                >
                  <span className="program-capability-dot" />
                  <span className="program-capability-name">
                    {skill}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 5. DARK FEATURE: REAL-WORLD CHALLENGES & USE CASES           */}
        {/* ============================================================ */}
        <section className="program-detail-container">
          <div className="program-feature-grid">
            {/* DARK FEATURE BLOCK: Real-World Sprint Challenges */}
            <div className="program-challenges-dark-card">
              <div className="program-challenges-eyebrow">
                <Briefcase size={16} />
                <span>REAL-WORLD SPRINT CHALLENGES</span>
              </div>
              <div className="program-challenges-list">
                {program.exampleChallenges.map((challenge, idx) => (
                  <div 
                    key={idx}
                    className="program-challenge-item"
                  >
                    <span className="program-challenge-idx">CHALLENGE #{idx + 1}:</span>
                    <span>{challenge}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* LIGHT CARD: Target Industry Use Cases */}
            <div className="program-usecases-card">
              <div>
                <div className="program-usecases-eyebrow">
                  <Layers size={16} />
                  <span>TARGET INDUSTRY USE CASES</span>
                </div>
                <div className="program-usecases-list">
                  {program.useCases.map((useCase, idx) => (
                    <div 
                      key={idx}
                      className="program-usecase-item"
                    >
                      <CheckCircle2 size={14} />
                      <span>{useCase}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="program-commercial-readiness">
                <div>
                  <span className="program-readiness-label">
                    COMMERCIAL READINESS
                  </span>
                  <span className="program-readiness-title">
                    Eligible for UpShift Digital Gig Dispatch
                  </span>
                </div>
                <span className="program-verified-badge">
                  VERIFIED
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 6. PREV / NEXT TRACK SWITCHER                                */}
        {/* ============================================================ */}
        <section className="program-detail-container">
          <div className="program-track-switcher-grid">
            {prevProgram && (
              <Link
                to={`/programs/${prevProgram.id}`}
                className="program-track-switch-card"
              >
                <div>
                  <span className="program-switch-eyebrow">
                    ← PREVIOUS TRACK
                  </span>
                  <span className="program-switch-title">
                    {prevProgram.code} · {prevProgram.name}
                  </span>
                </div>
                <div className="program-switch-arrow">
                  <ArrowLeft size={13} />
                </div>
              </Link>
            )}

            {nextProgram && (
              <Link
                to={`/programs/${nextProgram.id}`}
                className="program-track-switch-card"
                style={{ textAlign: 'right' }}
              >
                <div className="program-switch-arrow" style={{ order: 1 }}>
                  <ArrowRight size={13} />
                </div>
                <div style={{ order: 2 }}>
                  <span className="program-switch-eyebrow">
                    NEXT TRACK →
                  </span>
                  <span className="program-switch-title">
                    {nextProgram.code} · {nextProgram.name}
                  </span>
                </div>
              </Link>
            )}
          </div>
        </section>

        {/* ============================================================ */}
        {/* 7. HIGH-IMPACT FINAL ENROLLMENT CTA                         */}
        {/* ============================================================ */}
        <section className="program-detail-container">
          <div className="program-final-cta-card">
            {/* Ambient Red Glow */}
            <div className="program-final-cta-glow" aria-hidden="true" />

            <div className="program-final-cta-content">
              <span className="program-final-cta-badge">
                READY TO BUILD WITH AI?
              </span>
              <h2 className="program-final-cta-title">
                Enroll in Up<span>Shift Program</span>
              </h2>
              <p className="program-final-cta-desc">
                Master applied AI capabilities in 4 weeks. Build verifiable deliverables and start accessing digital gigs.
              </p>
              <Link
                to={`/enroll?track=${program.id}`}
                className="program-btn-primary"
                style={{ display: 'inline-flex' }}
              >
                <span>GET STARTED NOW</span>
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* UpShift Minimal Brand Footer */}
      <Footer />
    </div>
  );
}
