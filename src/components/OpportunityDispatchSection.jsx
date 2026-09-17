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

// Discipline Icon Map for Modules (Unified Red/Black/Green Theme)
const TRACK_ICONS = {
  'M1': Film,
  'M2': Palette,
  'M3': Database,
  'M4': Terminal,
  'M5': TrendingUp,
  'M6': Cpu,
};

// Custom Graphic Systems (Enforcing UpShift Palette: Red, Black, White, Green)
function GraphicReelRush({ accentColor }) {
  return (
    <div style={{ width: '100%', height: '110px', background: '#FFF5F5', border: '1px solid #FEE2E2', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      <svg viewBox="0 0 240 80" fill="none" style={{ width: '90%', height: '70px' }}>
        <rect x="15" y="10" width="40" height="60" rx="6" stroke="#E31B23" strokeWidth="1.5" fill="rgba(227,27,35,0.08)" />
        <circle cx="35" cy="40" r="10" stroke="#E31B23" strokeWidth="1" />
        <polygon points="32,35 41,40 32,45" fill="#E31B23" />
        <line x1="70" y1="20" x2="225" y2="20" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" />
        <line x1="70" y1="35" x2="190" y2="35" stroke="#E31B23" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="70" y1="50" x2="215" y2="50" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" />
        <line x1="70" y1="65" x2="160" y2="65" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
        <circle cx="190" cy="35" r="4" fill="#E31B23" />
        <text x="70" y="12" fill="#E31B23" fontSize="8" fontFamily="monospace" fontWeight="bold">AUDIO TIMELINE • 9:16 HOOK</text>
      </svg>
    </div>
  );
}

function GraphicVisualForge({ accentColor }) {
  return (
    <div style={{ width: '100%', height: '110px', background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      <svg viewBox="0 0 240 80" fill="none" style={{ width: '90%', height: '70px' }}>
        <rect x="20" y="12" width="55" height="56" rx="6" stroke="#111111" strokeWidth="1.4" fill="rgba(17,17,17,0.05)" />
        <circle cx="47" cy="40" r="14" stroke="#E31B23" strokeWidth="1.2" strokeDasharray="2 2" />
        <rect x="95" y="15" width="130" height="22" rx="4" fill="#111111" stroke="#333333" strokeWidth="1" />
        <text x="105" y="29" fill="#FFFFFF" fontSize="8.5" fontFamily="monospace" fontWeight="bold">BRAND SEED: #E31B23</text>
        <rect x="95" y="44" width="130" height="22" rx="4" fill="#111111" stroke="#333333" strokeWidth="1" />
        <text x="105" y="58" fill="#10B981" fontSize="8.5" fontFamily="monospace" fontWeight="bold">VECTOR LAYERS: 300 DPI</text>
      </svg>
    </div>
  );
}

function GraphicDeepAnnotator({ accentColor }) {
  return (
    <div style={{ width: '100%', height: '110px', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      <svg viewBox="0 0 240 80" fill="none" style={{ width: '90%', height: '70px' }}>
        <circle cx="35" cy="40" r="22" stroke="#059669" strokeWidth="1.5" fill="rgba(5,150,105,0.12)" />
        <text x="35" y="44" fill="#059669" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">RLHF</text>
        <line x1="75" y1="25" x2="225" y2="25" stroke="#A7F3D0" strokeWidth="3" strokeLinecap="round" />
        <line x1="75" y1="25" x2="195" y2="25" stroke="#059669" strokeWidth="3" strokeLinecap="round" />
        <line x1="75" y1="52" x2="225" y2="52" stroke="#A7F3D0" strokeWidth="3" strokeLinecap="round" />
        <line x1="75" y1="52" x2="210" y2="52" stroke="#059669" strokeWidth="3" strokeLinecap="round" />
        <text x="75" y="15" fill="#065F46" fontSize="7.5" fontFamily="monospace" fontWeight="bold">PRECISION: 99.4%</text>
        <text x="75" y="44" fill="#065F46" fontSize="7.5" fontFamily="monospace" fontWeight="bold">RED-TEAM RESILIENCE: 98.1%</text>
      </svg>
    </div>
  );
}

function GraphicVibeCoder({ accentColor }) {
  return (
    <div style={{ width: '100%', height: '110px', background: '#0A0A0A', border: '1px solid #222222', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      <svg viewBox="0 0 240 80" fill="none" style={{ width: '90%', height: '70px' }}>
        <rect x="15" y="12" width="210" height="56" rx="6" fill="#141414" stroke="#333333" strokeWidth="1" />
        <circle cx="28" cy="22" r="2.5" fill="#E31B23" />
        <circle cx="36" cy="22" r="2.5" fill="#F59E0B" />
        <circle cx="44" cy="22" r="2.5" fill="#10B981" />
        <text x="24" y="38" fill="#E31B23" fontSize="8" fontFamily="monospace">&gt; const app = await vibe.build(prompt);</text>
        <text x="24" y="50" fill="#10B981" fontSize="8" fontFamily="monospace">&gt; Ready on https://app.vercel.app [200 OK]</text>
        <text x="24" y="62" fill="#FFFFFF" fontSize="7.5" fontFamily="monospace">&gt; Lighthouse Performance: 100/100</text>
      </svg>
    </div>
  );
}

function GraphicBrandBuzz({ accentColor }) {
  return (
    <div style={{ width: '100%', height: '110px', background: '#FFF5F5', border: '1px solid #FEE2E2', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      <svg viewBox="0 0 240 80" fill="none" style={{ width: '90%', height: '70px' }}>
        <circle cx="35" cy="40" r="18" stroke="#E31B23" strokeWidth="1.2" strokeDasharray="2 2" />
        <circle cx="35" cy="40" r="6" fill="#E31B23" />
        <path d="M 75 58 Q 110 50 145 28 T 215 15" stroke="#E31B23" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="215" cy="15" r="4" fill="#059669" />
        <text x="75" y="72" fill="#111111" fontSize="8.5" fontFamily="monospace" fontWeight="bold">CONVERSION MATRIX: +340% HOOK CTR</text>
      </svg>
    </div>
  );
}

function GraphicAgentHandlers({ accentColor }) {
  return (
    <div style={{ width: '100%', height: '110px', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      <svg viewBox="0 0 240 80" fill="none" style={{ width: '90%', height: '70px' }}>
        <rect x="15" y="26" width="55" height="28" rx="4" fill="#059669" stroke="#047857" strokeWidth="1" />
        <text x="42" y="43" fill="#FFFFFF" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">TRIGGER</text>
        <line x1="70" y1="40" x2="95" y2="40" stroke="#059669" strokeWidth="1.5" strokeDasharray="3 2" />
        <rect x="95" y="20" width="58" height="40" rx="4" fill="#111111" stroke="#333333" strokeWidth="1.2" />
        <text x="124" y="38" fill="#FFFFFF" fontSize="7.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">AI AGENT</text>
        <text x="124" y="48" fill="#10B981" fontSize="6.5" fontFamily="monospace" textAnchor="middle">WEBHOOK/CRM</text>
        <line x1="153" y1="40" x2="178" y2="40" stroke="#059669" strokeWidth="1.5" strokeDasharray="3 2" />
        <rect x="178" y="26" width="50" height="28" rx="4" fill="#059669" stroke="#047857" strokeWidth="1" />
        <text x="203" y="43" fill="#FFFFFF" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">EXECUTE</text>
      </svg>
    </div>
  );
}

const COLLAPSED_GRAPHICS = {
  'M1': GraphicReelRush,
  'M2': GraphicVisualForge,
  'M3': GraphicDeepAnnotator,
  'M4': GraphicVibeCoder,
  'M5': GraphicBrandBuzz,
  'M6': GraphicAgentHandlers,
};

// ==========================================================================
// UNIFIED UPSHIFT PALETTE: RED + BLACK + WHITE + TECH GREEN
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
    // White Base + UpShift Red Accent
    isWhiteBase: true,
    accentColor: '#E31B23',
    cardBg: '#FFFFFF',
    cardBgHover: '#FFFFFF',
    cardBorder: '#E7E4DF',
    cardBorderHover: '#E31B23',
    badgeBg: '#E31B23',
    badgeText: '#FFFFFF',
    chipBg: '#FFF1F1',
    chipBorder: '#FEE2E2',
    chipText: '#991B1B',
    boxBg: '#FFF8F8',
    boxBorder: '#FEE2E2',
    boxText: '#111111',
    textPrimary: '#111111',
    textSecondary: '#4B5563',
    textMuted: '#6B7280',
    shadow: '0 12px 32px -4px rgba(227, 27, 35, 0.12)'
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
    // White Base + Black/Red Accent
    isWhiteBase: true,
    accentColor: '#111111',
    cardBg: '#FFFFFF',
    cardBgHover: '#FFFFFF',
    cardBorder: '#E7E4DF',
    cardBorderHover: '#111111',
    badgeBg: '#111111',
    badgeText: '#FFFFFF',
    chipBg: '#F4F1EA',
    chipBorder: '#E5E0D6',
    chipText: '#111111',
    boxBg: '#FAF8F5',
    boxBorder: '#EAE6DF',
    boxText: '#111111',
    textPrimary: '#111111',
    textSecondary: '#4B5563',
    textMuted: '#6B7280',
    shadow: '0 12px 32px -4px rgba(17, 17, 17, 0.12)'
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
    // White Base + Tech Green Accent
    isWhiteBase: true,
    accentColor: '#059669',
    cardBg: '#FFFFFF',
    cardBgHover: '#FFFFFF',
    cardBorder: '#E7E4DF',
    cardBorderHover: '#059669',
    badgeBg: '#059669',
    badgeText: '#FFFFFF',
    chipBg: '#ECFDF5',
    chipBorder: '#A7F3D0',
    chipText: '#065F46',
    boxBg: '#F0FDF4',
    boxBorder: '#BBF7D0',
    boxText: '#111111',
    textPrimary: '#111111',
    textSecondary: '#4B5563',
    textMuted: '#6B7280',
    shadow: '0 12px 32px -4px rgba(5, 150, 105, 0.12)'
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
    // Intentional Black Contrast Card (Dark Mode Contrast Accent)
    isWhiteBase: false,
    accentColor: '#E31B23',
    cardBg: '#111111',
    cardBgHover: '#181818',
    cardBorder: '#262626',
    cardBorderHover: '#E31B23',
    badgeBg: '#E31B23',
    badgeText: '#FFFFFF',
    chipBg: 'rgba(255, 255, 255, 0.08)',
    chipBorder: 'rgba(255, 255, 255, 0.18)',
    chipText: '#F3F4F6',
    boxBg: 'rgba(255, 255, 255, 0.05)',
    boxBorder: 'rgba(255, 255, 255, 0.15)',
    boxText: '#F9FAFB',
    textPrimary: '#FFFFFF',
    textSecondary: '#D1D5DB',
    textMuted: '#9CA3AF',
    shadow: '0 12px 32px -4px rgba(0, 0, 0, 0.4)'
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
    // White Base + UpShift Red Accent
    isWhiteBase: true,
    accentColor: '#E31B23',
    cardBg: '#FFFFFF',
    cardBgHover: '#FFFFFF',
    cardBorder: '#E7E4DF',
    cardBorderHover: '#E31B23',
    badgeBg: '#E31B23',
    badgeText: '#FFFFFF',
    chipBg: '#FFF1F1',
    chipBorder: '#FEE2E2',
    chipText: '#991B1B',
    boxBg: '#FFF8F8',
    boxBorder: '#FEE2E2',
    boxText: '#111111',
    textPrimary: '#111111',
    textSecondary: '#4B5563',
    textMuted: '#6B7280',
    shadow: '0 12px 32px -4px rgba(227, 27, 35, 0.12)'
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
    // White Base + Tech Green Accent
    isWhiteBase: true,
    accentColor: '#059669',
    cardBg: '#FFFFFF',
    cardBgHover: '#FFFFFF',
    cardBorder: '#E7E4DF',
    cardBorderHover: '#059669',
    badgeBg: '#059669',
    badgeText: '#FFFFFF',
    chipBg: '#ECFDF5',
    chipBorder: '#A7F3D0',
    chipText: '#065F46',
    boxBg: '#F0FDF4',
    boxBorder: '#BBF7D0',
    boxText: '#111111',
    textPrimary: '#111111',
    textSecondary: '#4B5563',
    textMuted: '#6B7280',
    shadow: '0 12px 32px -4px rgba(5, 150, 105, 0.12)'
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
          boxShadow: isActive ? card.shadow : '0 2px 8px rgba(0, 0, 0, 0.04)',
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
        {/* Compact Default Card View */}
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
              backgroundColor: isActive ? card.accentColor : (card.isWhiteBase ? '#FAF8F5' : 'rgba(255, 255, 255, 0.08)'),
              border: `1px solid ${isActive ? card.accentColor : (card.isWhiteBase ? '#E7E4DF' : 'rgba(255, 255, 255, 0.15)')}`,
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

              {/* Graphic System Illustration */}
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
                <span style={{ fontSize: '10px', fontFamily: 'monospace', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', backgroundColor: 'rgba(5, 150, 105, 0.12)', color: '#059669', border: '1px solid rgba(5, 150, 105, 0.25)' }}>
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

              {/* Snapshot Details Grid */}
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

              {/* Required Proof Spec Box */}
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
                    boxShadow: `0 4px 14px ${card.accentColor}35`
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
