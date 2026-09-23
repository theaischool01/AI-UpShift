import React, { useMemo } from 'react';
import { PROGRAM_PARTNERS, ECOSYSTEM_PARTNERS } from '../data/partnersData';
import './PartnersSection.css';

export default function PartnersSection() {
  // Distribute 21 ecosystem partners evenly across 3 columns (7 per column)
  const desktopColumns = useMemo(() => {
    const cols = [[], [], []];
    ECOSYSTEM_PARTNERS.forEach((partner, index) => {
      cols[index % 3].push(partner);
    });
    return cols;
  }, []);

  // Distribute across 2 columns for mobile
  const mobileColumns = useMemo(() => {
    const cols = [[], []];
    ECOSYSTEM_PARTNERS.forEach((partner, index) => {
      cols[index % 2].push(partner);
    });
    return cols;
  }, []);

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
        {/* 2. OUR ECOSYSTEM PARTNERS (Vertical Moving 3-Column System)  */}
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
            </div>

            {/* Right Zone: 3-Column Vertical Moving Logo Window (Clipped 3-Row Viewport) */}
            <div className="ecosystem-field-col">
              {/* Desktop & Tablet: 3 Vertical Moving Columns */}
              <div className="ecosystem-logo-window ecosystem-desktop-window">
                {desktopColumns.map((colPartners, colIndex) => {
                  // Duplicate the items once to create a seamless infinite CSS loop
                  const trackItems = [...colPartners, ...colPartners];
                  return (
                    <div
                      key={`col-${colIndex}`}
                      className={`ecosystem-column-lane ecosystem-lane--${colIndex + 1}`}
                    >
                      <div className={`ecosystem-column-track ecosystem-track--${colIndex + 1}`}>
                        {trackItems.map((partner, idx) => (
                          <div
                            key={`${partner.id}-${idx}`}
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
                  );
                })}
              </div>

              {/* Mobile: 2 Vertical Moving Columns */}
              <div className="ecosystem-logo-window ecosystem-mobile-window">
                {mobileColumns.map((colPartners, colIndex) => {
                  const trackItems = [...colPartners, ...colPartners];
                  return (
                    <div
                      key={`mob-col-${colIndex}`}
                      className={`ecosystem-column-lane ecosystem-mobile-lane--${colIndex + 1}`}
                    >
                      <div className={`ecosystem-column-track ecosystem-mobile-track--${colIndex + 1}`}>
                        {trackItems.map((partner, idx) => (
                          <div
                            key={`mob-${partner.id}-${idx}`}
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
                  );
                })}
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
