import React from 'react';
import { PROGRAM_PARTNERS, ECOSYSTEM_PARTNERS } from '../data/partnersData';
import './PartnersSection.css';

export default function PartnersSection() {
  // Distribute 24 ecosystem partners across 4 staggered columns for desktop/tablet layout
  const numColumns = 4;
  const columns = Array.from({ length: numColumns }, () => []);
  ECOSYSTEM_PARTNERS.forEach((partner, index) => {
    columns[index % numColumns].push(partner);
  });

  return (
    <section id="partners" className="partners-section scroll-mt-20">
      <div className="partners-container">
        
        {/* ============================================================ */}
        {/* 1. PROGRAM PARTNERS (Top Featured Group)                     */}
        {/* ============================================================ */}
        <div className="program-partners-block">
          {/* Left Column: Heading & Narrative */}
          <div className="program-partners-info">
            <div className="partners-eyebrow">
              <span className="partners-eyebrow-dot" />
              <span className="partners-eyebrow-text">PROGRAM PARTNERS</span>
            </div>

            <h2 className="program-partners-heading">
              PROGRAM<br />
              <span className="partners-accent-text">PARTNERS</span>
            </h2>

            <p className="program-partners-desc">
              Strategic organizations driving innovation, AI education and research initiatives across India.
            </p>
          </div>

          {/* Right Column: 3 Featured Partner Logo Cards */}
          <div className="program-partners-grid">
            {PROGRAM_PARTNERS.map((partner) => (
              <div key={partner.id} className="program-partner-card">
                <div className="program-partner-logo-frame">
                  <img
                    src={partner.logo}
                    alt={partner.alt}
                    className="program-partner-logo-img"
                    loading="eager"
                  />
                </div>
                <span className="program-partner-category">{partner.category}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ============================================================ */}
        {/* 2. OUR ECOSYSTEM PARTNERS (Main Installation Block)          */}
        {/* ============================================================ */}
        <div className="ecosystem-partners-panel">
          {/* Atmospheric Soft Red Ambient Background Glow */}
          <div className="ecosystem-ambient-glow" aria-hidden="true" />

          <div className="ecosystem-layout">
            {/* Left Zone: Large Editorial Heading */}
            <div className="ecosystem-info-col">
              <div className="partners-eyebrow">
                <span className="partners-eyebrow-dot" />
                <span className="partners-eyebrow-text">NATIONWIDE NETWORK</span>
              </div>

              <h2 className="ecosystem-heading">
                OUR ECOSYSTEM<br />
                <span className="partners-accent-text">PARTNERS</span>
              </h2>

              <p className="ecosystem-desc">
                A collaborative network of premier academic institutions, government bodies, technology enterprises, and venture accelerators powering real-world AI deployment.
              </p>

              {/* Trust Metric Badge */}
              <div className="ecosystem-trust-badge">
                <span className="ecosystem-badge-num">24+</span>
                <span className="ecosystem-badge-label">
                  Institutional & Industry<br />Partners Connected
                </span>
              </div>
            </div>

            {/* Right Zone: Multi-Column Staggered Logo Field */}
            <div className="ecosystem-field-col">
              {/* Desktop / Tablet: 4 Staggered Columns */}
              <div className="ecosystem-staggered-columns">
                {columns.map((colPartners, colIndex) => (
                  <div
                    key={`col-${colIndex}`}
                    className={`ecosystem-col ecosystem-col--${colIndex + 1}`}
                  >
                    {colPartners.map((partner) => (
                      <div
                        key={partner.id}
                        className="ecosystem-logo-tile"
                        title={partner.name}
                      >
                        <img
                          src={partner.logo}
                          alt={partner.alt}
                          className="ecosystem-logo-img"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Mobile Fallback: 2-Column Responsive Flow */}
              <div className="ecosystem-mobile-grid">
                {ECOSYSTEM_PARTNERS.map((partner) => (
                  <div
                    key={`mob-${partner.id}`}
                    className="ecosystem-logo-tile"
                    title={partner.name}
                  >
                    <img
                      src={partner.logo}
                      alt={partner.alt}
                      className="ecosystem-logo-img"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
