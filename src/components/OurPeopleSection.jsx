import React, { useState } from 'react';
import './OurPeopleSection.css';

function LinkedInIcon({ size = 15, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      style={{ flexShrink: 0 }}
      aria-hidden="true"
    >
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.25c-.9 0-1.63.73-1.63 1.63 0 .9.73 1.63 1.63 1.63.9 0 1.63-.73 1.63-1.63 0-.9-.73-1.63-1.63-1.63Z" />
    </svg>
  );
}

// Leadership team data
const LEADERSHIP_DATA = [
  {
    id: 'founder',
    name: 'GANTA SRINATH REDDY',
    role: 'FOUNDER / CEO',
    bio: 'Building the systems, curriculum, and industry direction behind The AI School and UpShift.',
    image: '/OurTeam/founder.jpg',
    fallbackImage: '/OurTeam/founder.png',
    initials: 'GSR',
    tag: 'FOUNDER',
    linkedin: 'https://www.linkedin.com/in/srinathreddy-g/',
    isReversed: false,
  },
  {
    id: 'cofounder',
    name: 'K. SPANDANA',
    role: 'CO-FOUNDER',
    bio: 'Driving learner experience, mentorship, and the operational foundation behind the UpShift journey.',
    image: '/OurTeam/cofounder.webp',
    fallbackImage: '/OurTeam/cofounder.png',
    initials: 'KS',
    tag: 'CO-FOUNDER',
    linkedin: 'https://www.linkedin.com/in/spandana-k-2b6a2713b/',
    isReversed: true,
  },
];

// Mentors team data (6 mentors)
const MENTORS_DATA = [
  {
    id: 'mentor-1',
    label: 'MENTOR 01',
    name: 'ARUN CHINNACHAMY',
    role: 'AI & CREATIVE',
    image: '/OurTeam/mentor1.webp',
    fallbackImage: '/OurTeam/mentor1.png',
    initials: 'AC',
    linkedin: 'https://www.linkedin.com/in/arun-chinnachamy/',
  },
  {
    id: 'mentor-2',
    label: 'MENTOR 02',
    name: 'GOPI KRISHNA',
    role: 'AGENTIC SYSTEMS',
    image: '/OurTeam/mentor2.webp',
    fallbackImage: '/OurTeam/mentor2.png',
    initials: 'GK',
    linkedin: 'https://www.linkedin.com/in/gopil/',
  },
  {
    id: 'mentor-3',
    label: 'MENTOR 03',
    name: 'KIRAN BABU',
    role: 'VISION & DATA',
    image: '/OurTeam/mentor3.webp',
    fallbackImage: '/OurTeam/mentor3.png',
    initials: 'YN',
    linkedin: 'https://www.linkedin.com/in/yerranagu/',
  },
  {
    id: 'mentor-4',
    label: 'MENTOR 04',
    name: 'RAJA MAMIDI',
    role: 'FULL-STACK AI',
    image: '/OurTeam/mentor4.webp',
    fallbackImage: '/OurTeam/mentor4.png',
    initials: 'TP',
    linkedin: 'https://www.linkedin.com/in/tmpraneethnaidu/',
  },
  {
    id: 'mentor-5',
    label: 'MENTOR 05',
    name: 'RANJAN RELAN',
    role: 'GROWTH & AUTOMATION',
    image: '/OurTeam/mentor5.webp',
    fallbackImage: '/OurTeam/mentor5.png',
    initials: 'RR',
    linkedin: 'https://www.linkedin.com/in/ranjan-relan/',
  },
  {
    id: 'mentor-6',
    label: 'MENTOR 06',
    name: 'VIJAY KUMAR JAKKULA',
    role: 'FOUNDER & CEO · VITA TECHNOLOGIES',
    image: '/OurTeam/vijay.png',
    fallbackImage: '/OurTeam/vijay.png',
    initials: 'VK',
    objectPosition: '35% 35%',
    linkedin: '',
  },
];

// Safe Image Component with multi-stage fallback (Primary -> Secondary -> Placeholder)
function SafeImageAvatar({ src, fallbackSrc, alt, initials, tag, isMentor = false, objectPosition }) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (currentSrc === src && fallbackSrc && fallbackSrc !== src) {
      setCurrentSrc(fallbackSrc);
    } else {
      setHasError(true);
    }
  };

  if (hasError || !currentSrc) {
    if (isMentor) {
      return (
        <div className="our-people-mentor-avatar-placeholder" aria-label={alt}>
          <span className="our-people-mentor-avatar-initials">{initials}</span>
        </div>
      );
    }
    return (
      <div className="our-people-portrait-placeholder" aria-label={alt}>
        <span className="our-people-portrait-initials">{initials}</span>
        {tag && <span className="our-people-portrait-tag">{tag}</span>}
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      onError={handleError}
      loading="lazy"
      className={isMentor ? 'our-people-mentor-avatar-img' : 'our-people-portrait-img'}
      style={objectPosition ? { objectPosition } : undefined}
    />
  );
}

export default function OurPeopleSection() {
  return (
    <section id="our-people" className="our-people-section scroll-mt-20">
      <div className="our-people-container">
        {/* Section Header */}
        <div className="our-people-header">
          <div className="our-people-eyebrow">
            <span className="our-people-eyebrow-dot" />
            <span className="our-people-eyebrow-text">THE PEOPLE BEHIND UPSHIFT</span>
          </div>

          <h2 className="our-people-title">
            MEET THE PEOPLE<br />
            WHO BUILD Up<span className="our-people-title-accent">Shift.</span>
          </h2>

          <p className="our-people-subtitle">
            Built by practitioners, guided by mentors, and designed around real outcomes.
          </p>
        </div>

        {/* Leadership Profiles */}
        <div className="our-people-leadership">
          {LEADERSHIP_DATA.map((person) => {
            const portraitElement = (
              <div key="portrait" className="our-people-portrait-wrap">
                <div className="our-people-portrait">
                  <SafeImageAvatar
                    src={person.image}
                    fallbackSrc={person.fallbackImage}
                    alt={person.name}
                    initials={person.initials}
                    tag={person.tag}
                  />
                </div>
              </div>
            );

            const cardElement = (
              <div key="card" className="our-people-card">
                <div className="our-people-card-top-row">
                  <span className="our-people-card-role">{person.role}</span>
                  {person.linkedin && (
                    <a
                      href={person.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="our-people-linkedin-icon-btn"
                      aria-label={`Connect with ${person.name} on LinkedIn`}
                      title={`Connect with ${person.name} on LinkedIn`}
                    >
                      <LinkedInIcon size={15} />
                    </a>
                  )}
                </div>
                <h3 className="our-people-card-name">{person.name}</h3>
                <p className="our-people-card-bio">{person.bio}</p>
              </div>
            );

            return (
              <div
                key={person.id}
                className={`our-people-profile-row ${person.isReversed ? 'is-reversed' : ''}`}
              >
                <div className="our-people-portrait-col">
                  {portraitElement}
                </div>
                <div className="our-people-card-col">
                  {cardElement}
                </div>
              </div>
            );
          })}
        </div>

        {/* Mentors Sub-section */}
        <div className="our-people-mentors-section">
          <div className="our-people-mentors-header">
            <div className="our-people-eyebrow">
              <span className="our-people-eyebrow-dot" />
              <span className="our-people-eyebrow-text">OUR MENTORS</span>
            </div>

            <h3 className="our-people-mentors-title">
              THE PEOPLE YOU'LL LEARN FROM.
            </h3>

            <p className="our-people-mentors-subtitle">
              Experienced practitioners helping UpShift learners turn capability into real work.
            </p>
          </div>

          {/* Mentors Grid (3 cols on desktop: row 1 has 3 cards, row 2 has 2 cards) */}
          <div className="our-people-mentors-grid">
            {MENTORS_DATA.map((mentor) => (
              <div key={mentor.id} className="our-people-mentor-card">
                <div className="our-people-mentor-avatar">
                  <SafeImageAvatar
                    src={mentor.image}
                    fallbackSrc={mentor.fallbackImage}
                    alt={mentor.name}
                    initials={mentor.initials}
                    isMentor={true}
                    objectPosition={mentor.objectPosition}
                  />
                </div>
                <span className="our-people-mentor-code">{mentor.label}</span>
                <h4 className="our-people-mentor-name">{mentor.name}</h4>
                <p className="our-people-mentor-role">{mentor.role}</p>

                {mentor.linkedin && (
                  <a
                    href={mentor.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="our-people-mentor-linkedin-btn"
                    aria-label={`Connect with ${mentor.name} on LinkedIn`}
                    title={`Connect with ${mentor.name} on LinkedIn`}
                  >
                    <LinkedInIcon size={14} />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
