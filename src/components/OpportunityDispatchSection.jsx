import React, { useState } from 'react';
import { 
  ArrowRight,
  Film,
  Palette,
  Database,
  Terminal,
  TrendingUp,
  Cpu,
  MapPin,
  Clock,
  Sparkles,
  Building,
  Zap,
  Briefcase,
  Code
} from 'lucide-react';
import { CONCEPTUAL_CLASSIFIEDS } from '../data/opportunitiesData';

// Original Discipline Icon Map for Modules
const TRACK_ICONS = {
  'M1': Film,
  'M2': Palette,
  'M3': Database,
  'M4': Terminal,
  'M5': TrendingUp,
  'M6': Cpu,
};

// ==========================================================================
// ORIGINAL COLLAPSED COMPACT GRAPHIC SYSTEMS (Module Specific Visual Assets)
// ==========================================================================

function CollapsedReelRush({ accentColor }) {
  return (
    <svg viewBox="0 0 100 140" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxHeight: '120px' }} aria-hidden="true">
      <rect x="22" y="10" width="56" height="120" rx="9" stroke={accentColor} strokeWidth="1.8" fill="rgba(233, 59, 59, 0.12)" />
      <rect x="27" y="16" width="46" height="108" rx="6" stroke="rgba(255,255,255,0.18)" strokeWidth="1" strokeDasharray="3 3" />
      <circle cx="50" cy="62" r="17" stroke="rgba(255,255,255,0.2)" strokeWidth="1" fill="rgba(233, 59, 59, 0.2)" />
      <polygon points="47,54 58,62 47,70" fill={accentColor} />
      <circle cx="34" cy="24" r="2.5" fill={accentColor} />
      <text x="41" y="27" fill="#FFFFFF" fontSize="7" fontFamily="monospace" fontWeight="bold" opacity="0.85">REC</text>
      <text x="50" y="114" fill={accentColor} fontSize="7.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle" letterSpacing="0.08em">9:16</text>
    </svg>
  );
}

function CollapsedVisualForge({ accentColor }) {
  return (
    <svg viewBox="0 0 100 140" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxHeight: '120px' }} aria-hidden="true">
      <rect x="15" y="15" width="70" height="110" rx="6" stroke="#3B82F6" strokeWidth="1.4" fill="rgba(37, 99, 235, 0.1)" />
      <line x1="12" y1="70" x2="88" y2="70" stroke="#93C5FD" strokeWidth="0.8" strokeDasharray="3 2" />
      <line x1="50" y1="12" x2="50" y2="128" stroke="#93C5FD" strokeWidth="0.8" strokeDasharray="3 2" />
      <circle cx="44" cy="62" r="20" stroke={accentColor} strokeWidth="1.5" fill="rgba(37, 99, 235, 0.15)" />
      <rect x="40" y="58" width="28" height="28" rx="6" transform="rotate(22 40 58)" stroke="#A855F7" strokeWidth="1.5" fill="rgba(168, 85, 247, 0.15)" />
      <line x1="30" y1="62" x2="60" y2="62" stroke={accentColor} strokeWidth="1" />
      <circle cx="60" cy="62" r="2.5" fill={accentColor} />
      <text x="50" y="116" fill={accentColor} fontSize="7" fontFamily="monospace" fontWeight="bold" textAnchor="middle" letterSpacing="0.08em">300 DPI</text>
    </svg>
  );
}

function CollapsedDeepAnnotator({ accentColor }) {
  return (
    <svg viewBox="0 0 100 140" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxHeight: '120px' }} aria-hidden="true">
      <circle cx="50" cy="70" r="42" fill="rgba(16, 185, 129, 0.08)" />
      <line x1="30" y1="42" x2="50" y2="55" stroke={accentColor} strokeWidth="1.2" strokeOpacity="0.8" />
      <line x1="70" y1="42" x2="50" y2="55" stroke={accentColor} strokeWidth="1.2" strokeOpacity="0.8" />
      <line x1="50" y1="55" x2="32" y2="82" stroke={accentColor} strokeWidth="1.2" strokeOpacity="0.8" />
      <line x1="50" y1="55" x2="68" y2="82" stroke={accentColor} strokeWidth="1.2" strokeOpacity="0.8" />
      <line x1="32" y1="82" x2="50" y2="100" stroke={accentColor} strokeWidth="1.4" />
      <line x1="68" y1="82" x2="50" y2="100" stroke={accentColor} strokeWidth="1.4" />
      <circle cx="30" cy="42" r="3.5" fill="#071A15" stroke={accentColor} strokeWidth="1.4" />
      <circle cx="70" cy="42" r="3.5" fill="#071A15" stroke={accentColor} strokeWidth="1.4" />
      <circle cx="50" cy="55" r="5" fill={accentColor} />
      <circle cx="32" cy="82" r="4" fill="#071A15" stroke={accentColor} strokeWidth="1.4" />
      <circle cx="68" cy="82" r="4" fill="#071A15" stroke={accentColor} strokeWidth="1.4" />
      <circle cx="50" cy="100" r="5.5" fill={accentColor} />
      <rect x="25" y="112" width="50" height="15" rx="3.5" fill="rgba(16, 185, 129, 0.16)" stroke={accentColor} strokeWidth="1" />
      <text x="50" y="122.5" fill={accentColor} fontSize="7" fontFamily="monospace" fontWeight="bold" textAnchor="middle">RLHF 99%</text>
    </svg>
  );
}

function CollapsedVibeCoder({ accentColor }) {
  return (
    <svg viewBox="0 0 100 140" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxHeight: '120px' }} aria-hidden="true">
      <rect x="15" y="15" width="70" height="110" rx="7" stroke="#6366F1" strokeWidth="1.4" fill="#12122B" />
      <path d="M 15 30 L 85 30" stroke="#312E81" strokeWidth="1" />
      <circle cx="23" cy="22.5" r="2" fill="#EF4444" />
      <circle cx="29" cy="22.5" r="2" fill="#F59E0B" />
      <circle cx="35" cy="22.5" r="2" fill="#10B981" />
      <line x1="23" y1="42" x2="52" y2="42" stroke={accentColor} strokeWidth="2" strokeLinecap="round" />
      <line x1="56" y1="42" x2="72" y2="42" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
      <line x1="28" y1="54" x2="62" y2="54" stroke="#818CF8" strokeWidth="2" strokeLinecap="round" />
      <line x1="28" y1="66" x2="48" y2="66" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
      <line x1="28" y1="78" x2="68" y2="78" stroke={accentColor} strokeWidth="2" strokeLinecap="round" />
      <rect x="22" y="94" width="56" height="18" rx="4" fill="#0A0A18" />
      <text x="27" y="106" fill="#10B981" fontSize="7" fontFamily="monospace" fontWeight="bold">&gt;_ ready</text>
    </svg>
  );
}

function CollapsedBrandBuzz({ accentColor }) {
  return (
    <svg viewBox="0 0 100 140" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxHeight: '120px' }} aria-hidden="true">
      <circle cx="50" cy="65" r="32" stroke="rgba(249, 115, 22, 0.2)" strokeWidth="1" strokeDasharray="3 3" />
      <circle cx="50" cy="65" r="18" stroke="rgba(249, 115, 22, 0.4)" strokeWidth="1.2" />
      <circle cx="50" cy="65" r="4" fill={accentColor} />
      <path d="M 22 96 Q 38 90 50 65 T 78 36" stroke={accentColor} strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="22" cy="96" r="3" fill="#FFFFFF" />
      <circle cx="50" cy="65" r="3.5" fill={accentColor} stroke="#FFFFFF" strokeWidth="1.2" />
      <circle cx="78" cy="36" r="3" fill="#FFFFFF" />
      <rect x="23" y="112" width="54" height="16" rx="3.5" fill="rgba(249, 115, 22, 0.18)" stroke={accentColor} strokeWidth="1" />
      <text x="50" y="123" fill={accentColor} fontSize="7" fontFamily="monospace" fontWeight="bold" textAnchor="middle">CTR +340%</text>
    </svg>
  );
}

function CollapsedAgentHandlers({ accentColor }) {
  return (
    <svg viewBox="0 0 100 140" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxHeight: '120px' }} aria-hidden="true">
      <rect x="30" y="18" width="40" height="14" rx="4" stroke={accentColor} strokeWidth="1.2" fill="#0A2222" />
      <text x="50" y="28" fill={accentColor} fontSize="6" fontFamily="monospace" fontWeight="bold" textAnchor="middle">TRIGGER</text>
      <line x1="50" y1="32" x2="50" y2="46" stroke={accentColor} strokeWidth="1.2" strokeDasharray="2 2" />
      <polygon points="50,49 47,45 53,45" fill={accentColor} />
      <polygon points="50,51 68,66 50,81 32,66" stroke={accentColor} strokeWidth="1.4" fill="#071817" />
      <circle cx="50" cy="66" r="3" fill={accentColor} />
      <path d="M 32 66 L 22 66 L 22 88 L 30 88" stroke={accentColor} strokeWidth="1" />
      <path d="M 68 66 L 78 66 L 78 88 L 70 88" stroke={accentColor} strokeWidth="1" />
      <rect x="30" y="102" width="40" height="14" rx="4" stroke={accentColor} strokeWidth="1.2" fill="#0A2222" />
      <text x="50" y="112" fill={accentColor} fontSize="6" fontFamily="monospace" fontWeight="bold" textAnchor="middle">CRM_SYNC</text>
      <line x1="50" y1="94" x2="50" y2="102" stroke={accentColor} strokeWidth="1" />
    </svg>
  );
}

const COLLAPSED_GRAPHICS = {
  'M1': CollapsedReelRush,
  'M2': CollapsedVisualForge,
  'M3': CollapsedDeepAnnotator,
  'M4': CollapsedVibeCoder,
  'M5': CollapsedBrandBuzz,
  'M6': CollapsedAgentHandlers,
};

// ==========================================================================
// ORIGINAL DARK MODULE VISUAL IDENTITIES & DATA (Restored Exact Colors)
// ==========================================================================

const OPPORTUNITY_MODULES = [
  // LEFT COLUMN
  {
    id: 'c-1',
    code: 'M1',
    name: 'ReelRush AI',
    category: 'AI Video / Short-Form Content',
    compactDesc: 'Short-form video creation for real brands.',
    role: 'AI Short-Form Video Creator',
    organization: 'Seed-Stage FinTech Startup',
    location: 'Remote (Global)',
    engagement: 'Project Retainer (15 hrs/wk)',
    focusDomain: 'Visual Editing & Audio Directing',
    payment_amount: '₹25,000–₹45,000 / month',
    originPlatform: 'Upwork / Startup Network',
    neededCapabilities: ['ReelRush AI', 'Hook Engineering', 'AI B-Roll Directing'],
    briefSnippet: 'Need a sharp creator to turn our bi-weekly founder audio discussions into 8 polished vertical reels per week. We have the thoughts; we need someone who can direct visuals and ship proof.',
    proofRequirement: 'Provide 3 sample video reels demonstrating pacing and AI B-roll sync.',
    statusBadge: 'Active Ecosystem Need',
    column: 'left',
    // Original Red Visual Identity
    accentColor: '#E93B3B',
    cardBg: '#0F0606',
    cardBgHover: '#180A0A',
    cardBorder: 'rgba(233, 59, 59, 0.3)',
    cardBorderHover: '#E93B3B',
    badgeBg: '#E93B3B',
    badgeText: '#FFFFFF',
    chipBg: 'rgba(233, 59, 59, 0.15)',
    chipBorder: 'rgba(233, 59, 59, 0.35)',
    chipText: '#FFA4A4',
    boxBg: '#1A0B0B',
    boxBorder: '#3D1414',
    boxText: '#E5E7EB',
    textPrimary: '#FFFFFF',
    textSecondary: '#D1D5DB',
    textMuted: '#9CA3AF',
    shadow: '0 8px 30px rgba(233, 59, 59, 0.2)'
  },
  {
    id: 'c-2',
    code: 'M2',
    name: 'VisualForge AI',
    category: 'AI Design / Visual Creation',
    compactDesc: 'Brand identities, 3D mockups & visual systems.',
    role: 'Visual Identity & Social Asset Designer',
    organization: 'Boutique D2C Coffee Roaster',
    location: 'Remote (India / US East)',
    engagement: 'Project Sprint (2-Week Milestone)',
    focusDomain: 'Brand Identity & Product Renders',
    payment_amount: '₹30,000–₹60,000 / sprint',
    originPlatform: 'D2C Brand Ecosystem',
    neededCapabilities: ['VisualForge AI', '3D Mockup Generation', 'Brand Styling'],
    briefSnippet: 'Launching a cold brew line. Looking for a visual builder to generate 12 photorealistic product environment renders and 24 social launch graphics.',
    proofRequirement: 'Show portfolio of consistent product mockups with lighting control.',
    statusBadge: 'Active Ecosystem Need',
    column: 'left',
    // Original Blue/Purple Visual Identity
    accentColor: '#2563EB',
    cardBg: '#060B18',
    cardBgHover: '#0B1328',
    cardBorder: 'rgba(37, 99, 235, 0.3)',
    cardBorderHover: '#2563EB',
    badgeBg: '#2563EB',
    badgeText: '#FFFFFF',
    chipBg: 'rgba(37, 99, 235, 0.15)',
    chipBorder: 'rgba(37, 99, 235, 0.35)',
    chipText: '#93C5FD',
    boxBg: '#0D1730',
    boxBorder: '#1E3A8A',
    boxText: '#E5E7EB',
    textPrimary: '#FFFFFF',
    textSecondary: '#D1D5DB',
    textMuted: '#9CA3AF',
    shadow: '0 8px 30px rgba(37, 99, 235, 0.2)'
  },
  {
    id: 'c-3',
    code: 'M3',
    name: 'DeepAnnotator',
    category: 'AI Data / Evaluation',
    compactDesc: 'Dataset structuring, RLHF evaluation & accuracy benchmarking.',
    role: 'AI Evaluation & Benchmark Assistant',
    organization: 'HealthTech AI Research Lab',
    location: 'Remote (Global)',
    engagement: 'Paid Internship / 3 Months',
    focusDomain: 'Clinical Data & RLHF Evaluation',
    payment_amount: '₹20,000–₹35,000 / month',
    originPlatform: 'AI Lab Direct Sourcing',
    neededCapabilities: ['DeepAnnotator', 'RLHF Evaluation', 'Red-Teaming'],
    briefSnippet: 'Seeking an analytical thinker to audit clinical summary outputs generated by our fine-tuned LLM against a ground-truth medical rubric. Attention to detail is paramount.',
    proofRequirement: 'Submit an annotated dataset sample or evaluation breakdown report.',
    statusBadge: 'Active Ecosystem Need',
    column: 'left',
    // Original Green Visual Identity
    accentColor: '#059669',
    cardBg: '#04140E',
    cardBgHover: '#072418',
    cardBorder: 'rgba(5, 150, 105, 0.3)',
    cardBorderHover: '#059669',
    badgeBg: '#059669',
    badgeText: '#FFFFFF',
    chipBg: 'rgba(5, 150, 105, 0.15)',
    chipBorder: 'rgba(5, 150, 105, 0.35)',
    chipText: '#6EE7B7',
    boxBg: '#08291E',
    boxBorder: '#065F46',
    boxText: '#E5E7EB',
    textPrimary: '#FFFFFF',
    textSecondary: '#D1D5DB',
    textMuted: '#9CA3AF',
    shadow: '0 8px 30px rgba(5, 150, 105, 0.2)'
  },

  // RIGHT COLUMN
  {
    id: 'c-4',
    code: 'M4',
    name: 'Vibe Coder',
    category: 'AI-Assisted Development',
    compactDesc: 'Functional web experiences & interactive landing pages.',
    role: 'AI Web Experience Builder',
    organization: 'Creator Education Collective',
    location: 'Remote',
    engagement: 'Freelance Contract',
    focusDomain: 'Responsive Web Apps & Tooling',
    payment_amount: '₹40,000–₹80,000 / build',
    originPlatform: 'Upwork / Creator Collective',
    neededCapabilities: ['Vibe Coder', 'React / Vite', 'API Integrations'],
    briefSnippet: 'We need a clean, responsive waitlist landing page with an interactive diagnostic quiz that suggests tailored learning tracks based on user answers.',
    proofRequirement: 'Share a live URL of a web tool or landing experience you shipped.',
    statusBadge: 'Active Ecosystem Need',
    column: 'right',
    // Original Indigo/Blue Visual Identity
    accentColor: '#4F46E5',
    cardBg: '#09091A',
    cardBgHover: '#111130',
    cardBorder: 'rgba(79, 70, 229, 0.3)',
    cardBorderHover: '#4F46E5',
    badgeBg: '#4F46E5',
    badgeText: '#FFFFFF',
    chipBg: 'rgba(79, 70, 229, 0.15)',
    chipBorder: 'rgba(79, 70, 229, 0.35)',
    chipText: '#A5B4FC',
    boxBg: '#131338',
    boxBorder: '#3730A3',
    boxText: '#E5E7EB',
    textPrimary: '#FFFFFF',
    textSecondary: '#D1D5DB',
    textMuted: '#9CA3AF',
    shadow: '0 8px 30px rgba(79, 70, 229, 0.2)'
  },
  {
    id: 'c-6',
    code: 'M5',
    name: 'BrandBuzz AI',
    category: 'AI Marketing / Growth',
    compactDesc: 'Multichannel growth engines & performance copy.',
    role: 'Growth Campaign & Content Operator',
    organization: 'SaaS Analytics Platform',
    location: 'Remote (APAC / EMEA)',
    engagement: 'Part-Time Contributor',
    focusDomain: 'Multichannel Ad Copy & Growth',
    payment_amount: '₹25,000–₹50,000 / month',
    originPlatform: 'Growth Community Inbound',
    neededCapabilities: ['BrandBuzz AI', 'Audience Prompting', 'Ad Matrix Testing'],
    briefSnippet: 'Help our 2-person marketing team test 15 distinct ad angles and build an automated weekly newsletter research pipeline highlighting data trends.',
    proofRequirement: 'Show a campaign deck or multichannel copy matrix you designed.',
    statusBadge: 'Active Ecosystem Need',
    column: 'right',
    // Original Orange Visual Identity
    accentColor: '#EA580C',
    cardBg: '#160B04',
    cardBgHover: '#261307',
    cardBorder: 'rgba(234, 88, 12, 0.3)',
    cardBorderHover: '#EA580C',
    badgeBg: '#EA580C',
    badgeText: '#FFFFFF',
    chipBg: 'rgba(234, 88, 12, 0.15)',
    chipBorder: 'rgba(234, 88, 12, 0.35)',
    chipText: '#FDBA74',
    boxBg: '#2C1609',
    boxBorder: '#7C2D12',
    boxText: '#E5E7EB',
    textPrimary: '#FFFFFF',
    textSecondary: '#D1D5DB',
    textMuted: '#9CA3AF',
    shadow: '0 8px 30px rgba(234, 88, 12, 0.2)'
  },
  {
    id: 'c-5',
    code: 'M6',
    name: 'AgentHandlers',
    category: 'AI Agents / Automation',
    compactDesc: 'Autonomous agent workflows & CRM automations.',
    role: 'Workflow Automation Architect',
    organization: 'Commercial Real Estate Brokerage',
    location: 'Remote / Hybrid',
    engagement: 'Project Build + Monthly Maintenance',
    focusDomain: 'Autonomous Agents & CRM Sync',
    payment_amount: '₹35,000–₹75,000 / project',
    originPlatform: 'Upwork Enterprise Dispatch',
    neededCapabilities: ['AgentHandlers', 'n8n / Make', 'CRM Webhooks'],
    briefSnippet: 'Automate our new property lead intake: parse incoming email inquiries, enrich with municipal tax data, draft a custom agent email, and notify broker in Slack.',
    proofRequirement: 'Provide an agent architecture flowchart or webhook execution log.',
    statusBadge: 'Active Ecosystem Need',
    column: 'right',
    // Original Teal Visual Identity
    accentColor: '#0D9488',
    cardBg: '#041412',
    cardBgHover: '#072420',
    cardBorder: 'rgba(13, 148, 136, 0.3)',
    cardBorderHover: '#0D9488',
    badgeBg: '#0D9488',
    badgeText: '#FFFFFF',
    chipBg: 'rgba(13, 148, 136, 0.15)',
    chipBorder: 'rgba(13, 148, 136, 0.35)',
    chipText: '#5EEAD4',
    boxBg: '#082924',
    boxBorder: '#115E59',
    boxText: '#E5E7EB',
    textPrimary: '#FFFFFF',
    textSecondary: '#D1D5DB',
    textMuted: '#9CA3AF',
    shadow: '0 8px 30px rgba(13, 148, 136, 0.2)'
  }
];

export default function OpportunityDispatchSection({ onExploreClick }) {
  // Single active card state for smooth vertical expansion
  const [activeCardId, setActiveCardId] = useState(null);

  const leftColumnCards = OPPORTUNITY_MODULES.filter(c => c.column === 'left');
  const rightColumnCards = OPPORTUNITY_MODULES.filter(c => c.column === 'right');

  const handleCardClick = (cardId) => {
    setActiveCardId(prev => prev === cardId ? null : cardId);
  };

  const renderCard = (card) => {
    const isActive = activeCardId === card.id;
    const IconComponent = TRACK_ICONS[card.code] || Sparkles;
    const GraphicComponent = COLLAPSED_GRAPHICS[card.code];

    return (
      <div
        key={card.id}
        className={`opp-wall-card ${isActive ? 'is-active' : ''}`}
        onMouseEnter={() => setActiveCardId(card.id)}
        onClick={() => handleCardClick(card.id)}
        style={{
          backgroundColor: isActive ? card.cardBgHover : card.cardBg,
          border: `1px solid ${isActive ? card.cardBorderHover : card.cardBorder}`,
          boxShadow: isActive ? card.shadow : '0 4px 14px rgba(0, 0, 0, 0.25)',
        }}
        role="button"
        tabIndex={0}
        aria-expanded={isActive}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCardClick(card.id);
          }
        }}
      >
        {/* Compact Default Card View (Restoring Original Colors & Styling) */}
        <div className="opp-wall-card-compact">
          <div className="opp-wall-compact-left">
            <span 
              className="opp-wall-badge-num"
              style={{
                backgroundColor: card.badgeBg,
                color: card.badgeText
              }}
            >
              {card.code}
            </span>
            <div className="opp-wall-compact-title-wrap">
              <div className="opp-wall-compact-name-row">
                <IconComponent size={16} color={card.accentColor} />
                <h4 className="opp-wall-compact-name" style={{ color: card.textPrimary }}>
                  {card.name}
                </h4>
              </div>
              <p className="opp-wall-compact-desc" style={{ color: card.textMuted }}>
                {card.compactDesc}
              </p>
            </div>
          </div>

          <div 
            className="opp-wall-arrow-btn"
            style={{
              backgroundColor: isActive ? card.accentColor : 'rgba(255, 255, 255, 0.06)',
              border: `1px solid ${isActive ? card.accentColor : 'rgba(255, 255, 255, 0.15)'}`,
              color: isActive ? '#FFFFFF' : card.textMuted
            }}
          >
            <ArrowRight size={16} />
          </div>
        </div>

        {/* Smooth Expandable Body (Accordion Mechanism) */}
        <div className="opp-wall-expand-wrapper">
          <div className="opp-wall-expand-inner">
            <div className="opp-wall-expand-content">

              {/* Original Graphic System Illustration */}
              {GraphicComponent && (
                <div style={{ marginTop: '12px', marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
                  <GraphicComponent accentColor={card.accentColor} />
                </div>
              )}

              {/* Meta Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '10px' }}>
                <span style={{ fontFamily: 'monospace', fontSize: '11px', fontWeight: 800, color: card.accentColor, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  {card.code} · {card.name.toUpperCase()}
                </span>
                <span style={{ fontSize: '10px', fontFamily: 'monospace', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', backgroundColor: 'rgba(16, 185, 129, 0.16)', color: '#34D399', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                  ● {card.statusBadge.toUpperCase()}
                </span>
              </div>

              {/* Role Title */}
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: 800, color: card.textPrimary, letterSpacing: '-0.02em', margin: '0 0 6px 0', lineHeight: 1.25 }}>
                {card.role}
              </h3>

              {/* Organization & Location */}
              <p style={{ fontSize: '13px', color: card.textMuted, margin: '0 0 14px 0', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px' }}>
                <span>Client:</span>
                <strong style={{ color: card.textPrimary, fontWeight: 700 }}>{card.organization}</strong>
                <span>•</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                  <MapPin size={12} color={card.accentColor} /> {card.location}
                </span>
              </p>

              {/* Brief Snippet */}
              <p style={{ fontSize: '13px', fontStyle: 'italic', color: card.textSecondary, lineHeight: 1.5, margin: '0 0 14px 0', paddingLeft: '12px', borderLeft: `2.5px solid ${card.accentColor}` }}>
                "{card.briefSnippet}"
              </p>

              {/* Needed Capabilities Chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                {card.neededCapabilities.map((cap, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: '10px',
                      fontFamily: 'monospace',
                      fontWeight: 600,
                      backgroundColor: card.chipBg,
                      border: `1px solid ${card.chipBorder}`,
                      color: card.chipText,
                      padding: '3px 8px',
                      borderRadius: '5px',
                    }}
                  >
                    {cap}
                  </span>
                ))}
              </div>

              {/* Original Snapshot Details Grid */}
              <div 
                style={{
                  backgroundColor: card.boxBg,
                  border: `1px solid ${card.boxBorder}`,
                  borderRadius: '10px',
                  padding: '10px 14px',
                  marginBottom: '14px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                  gap: '10px',
                }}
              >
                <div>
                  <span style={{ display: 'block', fontSize: '9px', fontFamily: 'monospace', color: card.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>COMPENSATION</span>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: card.accentColor }}>{card.payment_amount}</span>
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '9px', fontFamily: 'monospace', color: card.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>ENGAGEMENT</span>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: card.textPrimary }}>{card.engagement}</span>
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '9px', fontFamily: 'monospace', color: card.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>ORIGIN</span>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: card.textSecondary }}>{card.originPlatform}</span>
                </div>
              </div>

              {/* Original Required Proof Spec Box */}
              <div 
                style={{
                  backgroundColor: card.boxBg,
                  border: `1px solid ${card.boxBorder}`,
                  borderLeft: `3px solid ${card.accentColor}`,
                  borderRadius: '10px',
                  padding: '10px 14px',
                  marginBottom: '16px',
                }}
              >
                <span style={{ fontSize: '9.5px', fontFamily: 'monospace', fontWeight: 800, textTransform: 'uppercase', color: card.accentColor, display: 'block', marginBottom: '3px', letterSpacing: '0.08em' }}>
                  ★ REQUIRED PROOF SPEC
                </span>
                <p style={{ fontSize: '12px', color: card.boxText, margin: 0, lineHeight: 1.4 }}>
                  {card.proofRequirement}
                </p>
              </div>

              {/* Action Footer */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', paddingTop: '4px' }}>
                <span style={{ fontFamily: 'monospace', fontSize: '11px', color: card.textMuted }}>
                  {card.category}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onExploreClick) onExploreClick();
                  }}
                  style={{
                    backgroundColor: card.accentColor,
                    borderColor: card.accentColor,
                    color: '#FFFFFF',
                    borderRadius: '9999px',
                    padding: '8px 18px',
                    fontSize: '13px',
                    fontWeight: 700,
                    border: '1px solid transparent',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease',
                    boxShadow: `0 4px 14px ${card.accentColor}40`
                  }}
                >
                  <span>View Opportunities</span>
                  <ArrowRight size={14} />
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="opportunities" className="opp-wall-section scroll-mt-24 md:scroll-mt-28">
      <div className="opp-wall-container">
        {/* Section Header */}
        <div style={{ maxWidth: '780px', marginBottom: '44px' }}>
          <span className="eyebrow mb-3 inline-flex items-center gap-2">
            <span className="eyebrow-dot" style={{ backgroundColor: '#E31B23' }} />
            <span className="font-mono text-xs font-bold text-[#E31B23] uppercase tracking-wider">
              OPPORTUNITY DISPATCH · LIVE ECOSYSTEM DEMANDS
            </span>
          </span>

          <h2 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#111111] tracking-tight leading-[1.08] mb-4">
            GOOD WORK NEEDS<br />
            <span className="text-[#E31B23]">SOMEWHERE TO GO.</span>
          </h2>

          <p className="text-base sm:text-lg text-[#555555] font-display leading-relaxed">
            We track real, unfulfilled demands across startups, venture studios, and growth agencies looking for applied AI operators. When you build proof, this is where it lands.
          </p>
        </div>

        {/* 2-Column Asymmetric Interactive Card Wall */}
        <div 
          className="opp-wall-grid"
          onMouseLeave={() => setActiveCardId(null)}
        >
          {/* Left Column (M1, M2, M3) */}
          <div className="opp-wall-column">
            {leftColumnCards.map(renderCard)}
          </div>

          {/* Right Column (M4, M5, M6) */}
          <div className="opp-wall-column">
            {rightColumnCards.map(renderCard)}
          </div>
        </div>

        {/* Supporting Capability Promise Footer Banner */}
        <div 
          className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-white rounded-2xl border border-[#E7E4DF] shadow-xs text-[#111111] mt-10"
        >
          <div>
            <h4 className="font-display text-sm sm:text-base font-bold text-[#111111]">
              No Guaranteed Jobs. Just Guaranteed Real Capability.
            </h4>
            <p className="text-xs text-[#6B7280] mt-0.5">
              We equip you with verifiable proof so you can pitch freelance clients, apply for high-velocity startup sprints, and earn trust.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onExploreClick && onExploreClick()}
            className="btn btn-secondary btn-sm shrink-0 flex items-center gap-1.5"
            style={{
              borderRadius: '9999px',
              border: '1px solid #D1D5DB',
              backgroundColor: '#FFFFFF',
              color: '#111827',
              fontWeight: '600',
              padding: '8px 16px',
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#111111';
              e.currentTarget.style.color = '#FFFFFF';
              e.currentTarget.style.borderColor = '#111111';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FFFFFF';
              e.currentTarget.style.color = '#111827';
              e.currentTarget.style.borderColor = '#D1D5DB';
            }}
          >
            <span>Explore Tracks</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </section>
  );
}
