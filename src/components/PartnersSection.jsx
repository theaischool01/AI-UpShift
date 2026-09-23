import React, { useMemo } from 'react';
import { GOVERNMENT_PARTNERS, CORPORATE_PARTNERS, UNIVERSITY_PARTNERS, NAIVA_PARTNERS } from '../data/partnersData';
import './PartnersSection.css';

function GovernmentSection({ partners }) {
  // Pad grid to 15 slots (3 rows x 5 columns) on desktop for 5 items per row
  const totalSlots = Math.ceil(partners.length / 5) * 5;
  const paddedSlots = [...partners];
  while (paddedSlots.length < totalSlots) {
    paddedSlots.push({ id: `govt-empty-${paddedSlots.length}`, isEmpty: true });
  }

  return (
    <div className="govt-section-stacked">
      {/* Centered Editorial Header */}
      <div className="govt-section-header">
        <h2 className="govt-showcase-title">
          GOVERNMENT <span className="partners-accent-text">PARTNERS</span>
        </h2>
        <p className="govt-showcase-desc">
          Government initiatives, technology departments, and national innovation hubs accelerating AI capability across India.
        </p>
      </div>

      {/* Clean 5-Column Divider Grid Matrix */}
      <div className="govt-matrix-grid">
        {paddedSlots.map((partner) => {
          if (partner.isEmpty) {
            return (
              <div key={partner.id} className="govt-matrix-cell govt-matrix-cell--empty" />
            );
          }
          return (
            <div
              key={partner.id}
              className="govt-matrix-cell"
              title={partner.fullName || partner.name}
            >
              <div className="govt-matrix-logo-wrap">
                <img
                  src={partner.logo}
                  alt={partner.alt || partner.name}
                  className="govt-matrix-logo-img"
                  loading="lazy"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CorporateSection({ partners }) {
  return (
    <div className="corp-showcase-split">
      {/* Editorial Text Block */}
      <div className="corp-showcase-sidebar">
        <h2 className="corp-showcase-title">
          CORPORATE<br /><span className="partners-accent-text">PARTNERS</span>
        </h2>
        <p className="corp-showcase-desc">
          Forward-looking enterprises, scale-ups, and technology platforms deploying AI solutions and sourcing trained UpShift talent.
        </p>
      </div>

      {/* 4x3 Standing Portrait Cards Matrix */}
      <div className="corp-showcase-matrix">
        {partners.map((partner) => (
          <div key={partner.id} className="corp-portrait-card" title={partner.fullName || partner.name}>
            <div className="corp-portrait-logo-wrap">
              <img
                src={partner.logo}
                alt={partner.alt || partner.name}
                className={`corp-portrait-logo-img ${partner.id === 'centific' ? 'corp-logo--invert' : ''} ${partner.id === 'area51' ? 'corp-logo--scale-area51' : ''}`}
                loading="lazy"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StaticPartnerCard({ partner }) {
  if (partner.isPlaceholder) {
    return (
      <div className="partner-card-clean partner-card-clean--placeholder" title="Reserved Slot">
        <div className="partner-placeholder-content" />
      </div>
    );
  }

  return (
    <div className="partner-card-clean" title={partner.fullName || partner.name}>
      <div className="partner-card-logo-wrap">
        <img
          src={partner.logo}
          alt={partner.alt || partner.name}
          className="partner-card-logo-img"
          loading="lazy"
        />
      </div>
    </div>
  );
}

function StaticPartnersGrid({ partners }) {
  return (
    <div className="partner-static-grid">
      {partners.map((partner) => (
        <StaticPartnerCard key={partner.id} partner={partner} />
      ))}
    </div>
  );
}

function UniversityPartnersGrid({ partners }) {
  return (
    <div className="univ-static-grid">
      {partners.map((partner) => (
        <StaticPartnerCard key={partner.id} partner={partner} />
      ))}
    </div>
  );
}

function AnimatedPartnerCard({ partner }) {
  if (partner.isPlaceholder) {
    return (
      <div className="partner-logo-card partner-logo-card--placeholder" title="Reserved Slot">
        <div className="partner-placeholder-content" />
      </div>
    );
  }

  return (
    <div className="partner-logo-card" title={partner.fullName || partner.name}>
      <img
        src={partner.logo}
        alt={partner.alt || partner.name}
        className="partner-logo-img"
        loading="lazy"
      />
    </div>
  );
}

function AnimatedPartnerWall({ partners, categoryId }) {
  const desktopColumns = useMemo(() => {
    const cols = [[], [], [], [], []];
    const pool = partners.length < 15 
      ? [...partners, ...partners, ...partners, ...partners] 
      : [...partners, ...partners];

    pool.forEach((partner, index) => {
      cols[index % 5].push(partner);
    });
    return cols;
  }, [partners]);

  const tabletColumns = useMemo(() => {
    const cols = [[], [], []];
    const pool = partners.length < 12 
      ? [...partners, ...partners, ...partners] 
      : [...partners, ...partners];

    pool.forEach((partner, index) => {
      cols[index % 3].push(partner);
    });
    return cols;
  }, [partners]);

  const mobileColumns = useMemo(() => {
    const cols = [[], []];
    const pool = partners.length < 10 
      ? [...partners, ...partners, ...partners] 
      : [...partners, ...partners];

    pool.forEach((partner, index) => {
      cols[index % 2].push(partner);
    });
    return cols;
  }, [partners]);

  return (
    <div className="partner-wall-viewport">
      {/* Desktop Wall (5 Columns) */}
      <div className="partner-wall-grid partner-wall-grid--desktop">
        {desktopColumns.map((colPartners, colIdx) => {
          const trackItems = [...colPartners, ...colPartners];
          const isDown = colIdx % 2 === 1;
          const duration = 75 + colIdx * 12;

          return (
            <div
              key={`desk-${categoryId}-${colIdx}`}
              className="partner-wall-column"
            >
              <div
                className={`partner-wall-track ${isDown ? 'partner-track--down' : 'partner-track--up'}`}
                style={{ '--animation-duration': `${duration}s` }}
              >
                {trackItems.map((partner, pIdx) => (
                  <AnimatedPartnerCard key={`desk-${partner.id}-${colIdx}-${pIdx}`} partner={partner} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Tablet Wall (3 Columns) */}
      <div className="partner-wall-grid partner-wall-grid--tablet">
        {tabletColumns.map((colPartners, colIdx) => {
          const trackItems = [...colPartners, ...colPartners];
          const isDown = colIdx % 2 === 1;
          const duration = 70 + colIdx * 12;

          return (
            <div
              key={`tab-${categoryId}-${colIdx}`}
              className="partner-wall-column"
            >
              <div
                className={`partner-wall-track ${isDown ? 'partner-track--down' : 'partner-track--up'}`}
                style={{ '--animation-duration': `${duration}s` }}
              >
                {trackItems.map((partner, pIdx) => (
                  <AnimatedPartnerCard key={`tab-${partner.id}-${colIdx}-${pIdx}`} partner={partner} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile Wall (2 Columns) */}
      <div className="partner-wall-grid partner-wall-grid--mobile">
        {mobileColumns.map((colPartners, colIdx) => {
          const trackItems = [...colPartners, ...colPartners];
          const isDown = colIdx % 2 === 1;
          const duration = 65 + colIdx * 15;

          return (
            <div
              key={`mob-${categoryId}-${colIdx}`}
              className="partner-wall-column"
            >
              <div
                className={`partner-wall-track ${isDown ? 'partner-track--down' : 'partner-track--up'}`}
                style={{ '--animation-duration': `${duration}s` }}
              >
                {trackItems.map((partner, pIdx) => (
                  <AnimatedPartnerCard key={`mob-${partner.id}-${colIdx}-${pIdx}`} partner={partner} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function PartnersSection() {
  return (
    <section id="partners" className="partners-section scroll-mt-20">
      <div className="partners-container">

        {/* Hero Header */}
        <div className="partners-page-hero">
          <div className="partners-eyebrow">
            <span className="partners-eyebrow-dot" />
            <span className="partners-eyebrow-text">UPSHIFT PARTNERS</span>
          </div>

          <h1 className="partners-page-title">
            OUR <span className="partners-accent-text">PARTNERS</span>
          </h1>

          <p className="partners-page-subtitle">
            Organizations, institutions and companies building the ecosystem around UpShift.
          </p>
        </div>

        {/* 1. GOVERNMENT PARTNERS (Red Header Banner + Clean 5-Column White Logo Matrix) */}
        <div className="partner-category-section" style={{ marginTop: '0' }}>
          <GovernmentSection partners={GOVERNMENT_PARTNERS} />
        </div>

        {/* Section Divider */}
        <div className="partner-section-divider" aria-hidden="true" />

        {/* 2. CORPORATE PARTNERS (Editorial Sidebar + 4x3 Standing Portrait Cards) */}
        <div className="partner-category-section partner-category-section--corporate" style={{ marginTop: '0' }}>
          <CorporateSection partners={CORPORATE_PARTNERS} />
        </div>

        {/* Section Divider */}
        <div className="partner-section-divider" aria-hidden="true" />

        {/* 3. UNIVERSITY PARTNERS (5 Logos in Same Line) */}
        <div className="partner-category-section" style={{ marginTop: '0' }}>
          <div className="partner-section-header">
            <h2 className="partner-section-title">
              UNIVERSITY <span className="partners-accent-text">PARTNERS</span>
            </h2>
            <p className="partner-section-desc">
              Leading universities and academic institutions integrating hands-on applied AI programs into their technical student pathways.
            </p>
          </div>

          <UniversityPartnersGrid partners={UNIVERSITY_PARTNERS} />
        </div>

        {/* Section Divider */}
        <div className="partner-section-divider" aria-hidden="true" />

        {/* 4. ACADEMIC PARTNERS */}
        <div className="partner-category-section" style={{ marginTop: '0' }}>
          <div className="partner-section-header">
            <h2 className="partner-section-title">
              ACADEMIC <span className="partners-accent-text">PARTNERS</span>
            </h2>
            <p className="partner-section-desc">
              A vibrant nationwide consortium of AI startups, digital product agencies, and growth ventures actively building with AI.
            </p>
          </div>
          <AnimatedPartnerWall partners={NAIVA_PARTNERS} categoryId="ACADEMIC" />
        </div>

      </div>
    </section>
  );
}
