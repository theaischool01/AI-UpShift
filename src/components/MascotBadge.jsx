import React from 'react';

export default function MascotBadge({ 
  pose = "builder", 
  size = "md", 
  caption = "", 
  className = "",
  showBadge = true 
}) {
  const poses = {
    pointing: {
      src: "/assets/mascot/mascot_pointing_cutout.png",
      alt: "Upshift Fox Mascot pointing forward with confident builder energy",
      title: "The Upshifter"
    },
    builder: {
      src: "/assets/mascot/mascot_builder_cutout.png",
      alt: "Upshift Fox Mascot sitting on project briefs and working with tablet",
      title: "Creator & Builder"
    },
    arrow: {
      src: "/assets/mascot/mascot_pointing_cutout1.png",
      alt: "Upshift Fox Mascot leaning on giant red UPSHIFT upward arrow",
      title: "Move Forward"
    },
    inspecting: {
      src: "/assets/mascot/mascot_inspecting_cutout.png",
      alt: "Upshift Fox Mascot inspecting design with magnifying loupe",
      title: "Quality & Judgment"
    }
  };

  const selected = poses[pose] || poses.builder;

  const heights = {
    sm: "160px",
    md: "280px",
    lg: "360px",
    xl: "440px"
  };

  const currentHeight = heights[size] || heights.md;

  return (
    <div className={`mascot-container ${className}`}>
      <div 
        style={{ 
          height: currentHeight, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          maxWidth: '100%' 
        }}
      >
        <img
          src={selected.src}
          alt={selected.alt}
          style={{ 
            maxHeight: '100%', 
            maxWidth: '100%', 
            objectFit: 'contain',
            filter: 'drop-shadow(0 14px 28px rgba(0,0,0,0.08))'
          }}
          loading="lazy"
        />
      </div>
      {showBadge && (
        <div 
          style={{
            marginTop: '12px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 12px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E7E4DF',
            borderRadius: '9999px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
          }}
        >
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#E91D2B' }}></span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: '700', letterSpacing: '0.06em', color: '#111111', textTransform: 'uppercase' }}>
            {caption || selected.title}
          </span>
        </div>
      )}
    </div>
  );
}
