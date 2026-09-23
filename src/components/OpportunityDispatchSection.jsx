import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight,
  Film,
  Palette,
  Database,
  Terminal,
  TrendingUp,
  Cpu,
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

// ==========================================================================
// CENTRALIZED MODULE THEMES (M1–M6) — 6 DISTINCT COLOR FAMILIES
// ==========================================================================

const MODULE_THEMES = {
  'M1': {
    code: 'M1',
    name: 'ReelRush AI',
    accent: '#E31B23', // 1. Crimson Red
    cardBorder: 'rgba(227, 27, 35, 0.28)',
    cardBgTint: 'linear-gradient(135deg, #FFFFFF 65%, rgba(227, 27, 35, 0.05) 100%)',
    badgeBg: '#E31B23',
    badgeText: '#FFFFFF',
    badgeBorder: '#E31B23',
    iconBg: '#FFF1F1',
    iconBorder: '#FECACA',
    arrowBg: '#FFF1F1',
    arrowBorder: '#FECACA',
    arrowColor: '#E31B23',
    glow: 'rgba(227, 27, 35, 0.22)',
    icon: Film,
    watermark: 'wave',
  },
  'M2': {
    code: 'M2',
    name: 'VisualForge AI',
    accent: '#2563EB', // 2. Royal Blue
    cardBorder: 'rgba(37, 99, 235, 0.28)',
    cardBgTint: 'linear-gradient(135deg, #FFFFFF 65%, rgba(37, 99, 235, 0.06) 100%)',
    badgeBg: '#2563EB',
    badgeText: '#FFFFFF',
    badgeBorder: '#2563EB',
    iconBg: '#EFF6FF',
    iconBorder: '#BFDBFE',
    arrowBg: '#EFF6FF',
    arrowBorder: '#BFDBFE',
    arrowColor: '#2563EB',
    glow: 'rgba(37, 99, 235, 0.22)',
    icon: Palette,
    watermark: 'grid',
  },
  'M3': {
    code: 'M3',
    name: 'DeepAnnotator',
    accent: '#059669', // 3. Emerald Green
    cardBorder: 'rgba(5, 150, 105, 0.28)',
    cardBgTint: 'linear-gradient(135deg, #FFFFFF 65%, rgba(5, 150, 105, 0.06) 100%)',
    badgeBg: '#059669',
    badgeText: '#FFFFFF',
    badgeBorder: '#059669',
    iconBg: '#ECFDF5',
    iconBorder: '#A7F3D0',
    arrowBg: '#ECFDF5',
    arrowBorder: '#A7F3D0',
    arrowColor: '#059669',
    glow: 'rgba(5, 150, 105, 0.22)',
    icon: Database,
    watermark: 'matrix',
  },
  'M4': {
    code: 'M4',
    name: 'VibeCoder',
    accent: '#7C3AED', // 4. Electric Purple
    cardBorder: 'rgba(124, 58, 237, 0.28)',
    cardBgTint: 'linear-gradient(135deg, #FFFFFF 65%, rgba(124, 58, 237, 0.06) 100%)',
    badgeBg: '#7C3AED',
    badgeText: '#FFFFFF',
    badgeBorder: '#7C3AED',
    iconBg: '#F5F3FF',
    iconBorder: '#DDD6FE',
    arrowBg: '#F5F3FF',
    arrowBorder: '#DDD6FE',
    arrowColor: '#7C3AED',
    glow: 'rgba(124, 58, 237, 0.22)',
    icon: Terminal,
    watermark: 'terminal',
  },
  'M5': {
    code: 'M5',
    name: 'BrandBuzz AI',
    accent: '#EA580C', // 5. Vibrant Orange / Amber
    cardBorder: 'rgba(234, 88, 12, 0.28)',
    cardBgTint: 'linear-gradient(135deg, #FFFFFF 65%, rgba(234, 88, 12, 0.06) 100%)',
    badgeBg: '#EA580C',
    badgeText: '#FFFFFF',
    badgeBorder: '#EA580C',
    iconBg: '#FFF7ED',
    iconBorder: '#FED7AA',
    arrowBg: '#FFF7ED',
    arrowBorder: '#FED7AA',
    arrowColor: '#EA580C',
    glow: 'rgba(234, 88, 12, 0.22)',
    icon: TrendingUp,
    watermark: 'growth',
  },
  'M6': {
    code: 'M6',
    name: 'AgentHandlers',
    accent: '#0891B2', // 6. Cyan / Aqua
    cardBorder: 'rgba(8, 145, 178, 0.28)',
    cardBgTint: 'linear-gradient(135deg, #FFFFFF 65%, rgba(8, 145, 178, 0.06) 100%)',
    badgeBg: '#0891B2',
    badgeText: '#FFFFFF',
    badgeBorder: '#0891B2',
    iconBg: '#ECFEFF',
    iconBorder: '#A5F3FC',
    arrowBg: '#ECFEFF',
    arrowBorder: '#A5F3FC',
    arrowColor: '#0891B2',
    glow: 'rgba(8, 145, 178, 0.22)',
    icon: Cpu,
    watermark: 'workflow',
  },
};

// ==========================================================================
// SUBTLE CARD WATERMARK DECORATIONS (High-detail SVG, aria-hidden)
// ==========================================================================

function CardWatermark({ watermark, accentColor }) {
  if (watermark === 'wave') {
    // M1: Audio Waveform & Frame Marks (Red)
    return (
      <svg className="opp-card-watermark" viewBox="0 0 160 80" fill="none" aria-hidden="true">
        <path d="M10 40 L25 40 L30 15 L35 65 L40 20 L45 60 L50 30 L55 50 L60 40 L150 40" stroke={accentColor} strokeWidth="1.6" strokeLinecap="round" />
        <rect x="115" y="8" width="36" height="24" rx="4" stroke={accentColor} strokeWidth="1.4" strokeDasharray="3 2" />
        <line x1="133" y1="4" x2="133" y2="8" stroke={accentColor} strokeWidth="1.4" />
        <line x1="133" y1="32" x2="133" y2="36" stroke={accentColor} strokeWidth="1.4" />
      </svg>
    );
  }
  if (watermark === 'grid') {
    // M2: Vector / Grid / Design Geometry (Blue)
    return (
      <svg className="opp-card-watermark" viewBox="0 0 160 80" fill="none" aria-hidden="true">
        <circle cx="120" cy="40" r="28" stroke={accentColor} strokeWidth="1.4" strokeDasharray="4 3" />
        <rect x="92" y="12" width="56" height="56" rx="4" stroke={accentColor} strokeWidth="1.2" />
        <line x1="92" y1="40" x2="148" y2="40" stroke={accentColor} strokeWidth="1.2" />
        <line x1="120" y1="12" x2="120" y2="68" stroke={accentColor} strokeWidth="1.2" />
      </svg>
    );
  }
  if (watermark === 'matrix') {
    // M3: Data Node / Matrix Pattern (Green)
    return (
      <svg className="opp-card-watermark" viewBox="0 0 160 80" fill="none" aria-hidden="true">
        <circle cx="105" cy="22" r="3.5" fill={accentColor} />
        <circle cx="140" cy="22" r="3.5" fill={accentColor} />
        <circle cx="122" cy="50" r="4" fill={accentColor} />
        <circle cx="145" cy="65" r="3" fill={accentColor} />
        <line x1="105" y1="22" x2="140" y2="22" stroke={accentColor} strokeWidth="1.4" strokeDasharray="2 2" />
        <line x1="105" y1="22" x2="122" y2="50" stroke={accentColor} strokeWidth="1.4" />
        <line x1="140" y1="22" x2="122" y2="50" stroke={accentColor} strokeWidth="1.4" />
        <line x1="122" y1="50" x2="145" y2="65" stroke={accentColor} strokeWidth="1.4" strokeDasharray="2 2" />
      </svg>
    );
  }
  if (watermark === 'terminal') {
    // M4: Code Brackets & Terminal Lines (Purple)
    return (
      <svg className="opp-card-watermark" viewBox="0 0 160 80" fill="none" aria-hidden="true">
        <path d="M95 24 L82 40 L95 56" stroke={accentColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M142 24 L155 40 L142 56" stroke={accentColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="125" y1="20" x2="112" y2="60" stroke={accentColor} strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }
  if (watermark === 'growth') {
    // M5: Growth Graph / Signal Lines (Orange)
    return (
      <svg className="opp-card-watermark" viewBox="0 0 160 80" fill="none" aria-hidden="true">
        <path d="M85 65 Q 110 58 125 35 T 155 16" stroke={accentColor} strokeWidth="2" strokeLinecap="round" />
        <circle cx="155" cy="16" r="3.5" fill={accentColor} />
        <line x1="85" y1="65" x2="155" y2="65" stroke={accentColor} strokeWidth="1.2" strokeDasharray="3 2" />
      </svg>
    );
  }
  if (watermark === 'workflow') {
    // M6: Workflow Nodes / Connection Paths (Cyan)
    return (
      <svg className="opp-card-watermark" viewBox="0 0 160 80" fill="none" aria-hidden="true">
        <rect x="86" y="26" width="24" height="24" rx="4" stroke={accentColor} strokeWidth="1.4" />
        <line x1="110" y1="38" x2="128" y2="38" stroke={accentColor} strokeWidth="1.4" strokeDasharray="3 2" />
        <rect x="128" y="26" width="24" height="24" rx="4" stroke={accentColor} strokeWidth="1.4" fill={accentColor} fillOpacity="0.25" />
      </svg>
    );
  }
  return null;
}

// ==========================================================================
// TECHNICAL GRAPHIC SYSTEMS (Clean Dark Expanded Surface)
// ==========================================================================

function GraphicReelRush({ accentColor }) {
  return (
    <div className="opp-graphic-container">
      <svg viewBox="0 0 240 80" fill="none" style={{ width: '90%', height: '70px' }}>
        <rect x="15" y="10" width="40" height="60" rx="6" stroke="#E31B23" strokeWidth="1.5" fill="rgba(227,27,35,0.12)" />
        <circle cx="35" cy="40" r="10" stroke="#E31B23" strokeWidth="1" />
        <polygon points="32,35 41,40 32,45" fill="#E31B23" />
        <line x1="70" y1="20" x2="225" y2="20" stroke="#374151" strokeWidth="2" strokeLinecap="round" />
        <line x1="70" y1="35" x2="190" y2="35" stroke="#E31B23" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="70" y1="50" x2="215" y2="50" stroke="#374151" strokeWidth="2" strokeLinecap="round" />
        <line x1="70" y1="65" x2="160" y2="65" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
        <circle cx="190" cy="35" r="4" fill="#E31B23" />
        <text x="70" y="12" fill="#E31B23" fontSize="8" fontFamily="monospace" fontWeight="bold">AUDIO TIMELINE • 9:16 HOOK</text>
      </svg>
    </div>
  );
}

function GraphicVisualForge({ accentColor }) {
  return (
    <div className="opp-graphic-container">
      <svg viewBox="0 0 240 80" fill="none" style={{ width: '90%', height: '70px' }}>
        <rect x="20" y="12" width="55" height="56" rx="6" stroke="#2563EB" strokeWidth="1.4" fill="rgba(37,99,235,0.12)" />
        <circle cx="47" cy="40" r="14" stroke="#2563EB" strokeWidth="1.2" strokeDasharray="2 2" />
        <rect x="95" y="15" width="130" height="22" rx="4" fill="#18181B" stroke="#27272A" strokeWidth="1" />
        <text x="105" y="29" fill="#A1A1AA" fontSize="8.5" fontFamily="monospace" fontWeight="bold">BRAND SEED: <tspan fill="#3B82F6">#2563EB</tspan></text>
        <rect x="95" y="44" width="130" height="22" rx="4" fill="#18181B" stroke="#27272A" strokeWidth="1" />
        <text x="105" y="58" fill="#10B981" fontSize="8.5" fontFamily="monospace" fontWeight="bold">VECTOR LAYERS: 300 DPI</text>
      </svg>
    </div>
  );
}

function GraphicDeepAnnotator({ accentColor }) {
  return (
    <div className="opp-graphic-container">
      <svg viewBox="0 0 240 80" fill="none" style={{ width: '90%', height: '70px' }}>
        <circle cx="35" cy="40" r="22" stroke="#059669" strokeWidth="1.5" fill="rgba(5,150,105,0.15)" />
        <text x="35" y="44" fill="#34D399" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">RLHF</text>
        <line x1="75" y1="25" x2="225" y2="25" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" />
        <line x1="75" y1="25" x2="195" y2="25" stroke="#059669" strokeWidth="3" strokeLinecap="round" />
        <line x1="75" y1="52" x2="225" y2="52" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" />
        <line x1="75" y1="52" x2="210" y2="52" stroke="#059669" strokeWidth="3" strokeLinecap="round" />
        <text x="75" y="15" fill="#34D399" fontSize="7.5" fontFamily="monospace" fontWeight="bold">PRECISION: 99.4%</text>
        <text x="75" y="44" fill="#34D399" fontSize="7.5" fontFamily="monospace" fontWeight="bold">RED-TEAM RESILIENCE: 98.1%</text>
      </svg>
    </div>
  );
}

function GraphicVibeCoder({ accentColor }) {
  return (
    <div className="opp-graphic-container">
      <svg viewBox="0 0 240 80" fill="none" style={{ width: '90%', height: '70px' }}>
        <rect x="15" y="12" width="210" height="56" rx="6" fill="#141414" stroke="#262626" strokeWidth="1" />
        <circle cx="28" cy="22" r="2.5" fill="#E31B23" />
        <circle cx="36" cy="22" r="2.5" fill="#F59E0B" />
        <circle cx="44" cy="22" r="2.5" fill="#10B981" />
        <text x="24" y="38" fill="#A78BFA" fontSize="8" fontFamily="monospace">&gt; const app = await vibe.build(prompt);</text>
        <text x="24" y="50" fill="#10B981" fontSize="8" fontFamily="monospace">&gt; Ready on https://app.vercel.app [200 OK]</text>
        <text x="24" y="62" fill="#E5E7EB" fontSize="7.5" fontFamily="monospace">&gt; Lighthouse Performance: 100/100</text>
      </svg>
    </div>
  );
}

function GraphicBrandBuzz({ accentColor }) {
  return (
    <div className="opp-graphic-container">
      <svg viewBox="0 0 240 80" fill="none" style={{ width: '90%', height: '70px' }}>
        <circle cx="35" cy="40" r="18" stroke="#EA580C" strokeWidth="1.2" strokeDasharray="2 2" />
        <circle cx="35" cy="40" r="6" fill="#EA580C" />
        <path d="M 75 58 Q 110 50 145 28 T 215 15" stroke="#EA580C" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="215" cy="15" r="4" fill="#059669" />
        <text x="75" y="72" fill="#E5E7EB" fontSize="8.5" fontFamily="monospace" fontWeight="bold">CONVERSION MATRIX: +340% HOOK CTR</text>
      </svg>
    </div>
  );
}

function GraphicAgentHandlers({ accentColor }) {
  return (
    <div className="opp-graphic-container">
      <svg viewBox="0 0 240 80" fill="none" style={{ width: '90%', height: '70px' }}>
        <rect x="15" y="26" width="55" height="28" rx="4" fill="#0891B2" stroke="#0E7490" strokeWidth="1" />
        <text x="42" y="43" fill="#FFFFFF" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">TRIGGER</text>
        <line x1="70" y1="40" x2="95" y2="40" stroke="#0891B2" strokeWidth="1.5" strokeDasharray="3 2" />
        <rect x="95" y="20" width="58" height="40" rx="4" fill="#18181B" stroke="#27272A" strokeWidth="1.2" />
        <text x="124" y="38" fill="#FFFFFF" fontSize="7.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">AI AGENT</text>
        <text x="124" y="48" fill="#06B6D4" fontSize="6.5" fontFamily="monospace" textAnchor="middle">WEBHOOK/CRM</text>
        <line x1="153" y1="40" x2="178" y2="40" stroke="#0891B2" strokeWidth="1.5" strokeDasharray="3 2" />
        <rect x="178" y="26" width="50" height="28" rx="4" fill="#0891B2" stroke="#0E7490" strokeWidth="1" />
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
// OPPORTUNITY MODULE DATA (6 Distinct Showcase Tracks)
// ==========================================================================

const OPPORTUNITY_MODULES = [
  // LEFT COLUMN
  {
    id: 'c-1',
    code: 'M1',
    name: 'ReelRush AI',
    category: 'AI Video / Short-Form Content',
    compactDesc: 'Short-form video creation for real brands.',
    role: 'AI Short-Form Video Content Producer',
    organization: 'Modern Consumer Brand / Startup',
    location: 'Remote',
    engagement: 'Freelance Contract',
    focusDomain: 'Visual Editing & Audio Directing',
    payment_amount: '₹25,000–₹45,000 / month',
    originPlatform: 'Upwork / Startup Network',
    neededCapabilities: ['ReelRush AI', 'AI Video Editing', 'Short-Form Content'],
    briefSnippet: 'Create branded short-form AI videos for social media campaigns, including hooks, pacing, AI B-roll and final edits.',
    proofRequirement: 'Provide sample short-form videos demonstrating pacing, storytelling and AI B-roll integration.',
    statusBadge: 'Active Ecosystem Need',
    column: 'left',
  },
  {
    id: 'c-2',
    code: 'M2',
    name: 'VisualForge AI',
    category: 'AI Design / Visual Creation',
    compactDesc: 'Brand identities, 3D mockups & visual systems.',
    role: 'Generative Brand Asset Designer',
    organization: 'Creative / D2C Brand',
    location: 'Remote',
    engagement: 'Freelance Contract',
    focusDomain: 'Generative Design & Brand Assets',
    payment_amount: '₹30,000–₹55,000 / sprint',
    originPlatform: 'D2C Brand Ecosystem',
    neededCapabilities: ['VisualForge AI', 'Generative Design', 'Brand Assets'],
    briefSnippet: 'Create AI-generated visual assets for a commercial brand campaign, including social creatives, product visuals and campaign variations.',
    proofRequirement: 'Provide a small collection of AI-generated commercial visual assets with documented design direction.',
    statusBadge: 'Active Ecosystem Need',
    column: 'left',
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
  },

  // RIGHT COLUMN
  {
    id: 'c-4',
    code: 'M4',
    name: 'VibeCoder',
    category: 'AI-Assisted Development',
    compactDesc: 'Functional web experiences & interactive landing pages.',
    role: 'AI Web Experience Builder',
    organization: 'Creator Education Collective',
    location: 'Remote',
    engagement: 'Freelance Contract',
    focusDomain: 'Responsive Web Apps & Tooling',
    payment_amount: '₹40,000–₹80,000 / build',
    originPlatform: 'Upwork / Creator Collective',
    neededCapabilities: ['VibeCoder', 'React / Vite', 'API Integrations'],
    briefSnippet: 'We need a clean, responsive waitlist landing page with an interactive diagnostic quiz that suggests tailored learning tracks based on user answers.',
    proofRequirement: 'Share a live URL of a web tool or landing experience you shipped.',
    statusBadge: 'Active Ecosystem Need',
    column: 'right',
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
  }
];

export default function OpportunityDispatchSection({ onExploreClick }) {
  const navigate = useNavigate();
  // Single active card state for smooth vertical expansion
  const [activeCardId, setActiveCardId] = useState(null);
  const [realGigs, setRealGigs] = useState([]);

  useEffect(() => {
    async function loadPublicGigs() {
      try {
        const { data, error } = await supabase
          .from('gigs')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          setRealGigs(data);
        }
      } catch (err) {
        console.warn('[OpportunityDispatch] Error loading public gigs:', err);
      }
    }
    loadPublicGigs();
  }, []);

  const trackIdMap = {
    'M1': 'reelrush-ai',
    'M2': 'visualforge-ai',
    'M3': 'deepannotator',
    'M4': 'vibe-coder',
    'M5': 'brandbuzz-ai',
    'M6': 'agenthandlers',
  };

  const processedCards = OPPORTUNITY_MODULES.map(mod => {
    const targetTrackId = trackIdMap[mod.code];
    const matchingGigs = realGigs.filter(g => 
      g.track_id === targetTrackId || 
      (targetTrackId === 'agenthandlers' && g.track_id === 'agent-handlers')
    );
    const primaryGig = matchingGigs[0];

    if (primaryGig) {
      return {
        ...mod,
        id: primaryGig.id,
        role: primaryGig.title || mod.role,
        organization: primaryGig.organization || primaryGig.origin_site || mod.organization,
        location: primaryGig.location || mod.location,
        engagement: primaryGig.engagement_type || mod.engagement,
        payment_amount: primaryGig.payment_amount || mod.payment_amount,
        originPlatform: primaryGig.origin_site || mod.originPlatform,
        briefSnippet: primaryGig.short_description || mod.briefSnippet,
        statusBadge: 'Active Ecosystem Need',
        isRealGig: true,
        rawGig: primaryGig
      };
    } else {
      // Always fallback to the rich, distinct opportunity data for this track
      return {
        ...mod,
        statusBadge: 'Active Ecosystem Need',
        isRealGig: false,
        rawGig: null
      };
    }
  });

  const leftColumnCards = processedCards.filter(c => c.column === 'left');
  const rightColumnCards = processedCards.filter(c => c.column === 'right');

  const handleCardClick = (cardId) => {
    setActiveCardId(prev => (prev === cardId ? null : cardId));
  };

  const handleCardMouseEnter = (cardId) => {
    if (typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      setActiveCardId(cardId);
    }
  };

  const handleGridMouseLeave = () => {
    if (typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      setActiveCardId(null);
    }
  };

  const handleApplyClick = (card, e) => {
    if (e) e.stopPropagation();
    if (card.rawGig) {
      navigate(`/enroll?gig=${card.id}`, { state: { gig: card.rawGig } });
    } else {
      const courseIdMap = {
        'M1': 'reelrush-ai',
        'M2': 'visualforge-ai',
        'M3': 'deepannotator',
        'M4': 'vibe-coder',
        'M5': 'brandbuzz-ai',
        'M6': 'agenthandlers',
      };
      const trackId = courseIdMap[card.code] || 'reelrush-ai';
      navigate(`/enroll?track=${trackId}`);
    }
  };

  const renderCard = (card) => {
    const isActive = activeCardId === card.id;
    const theme = MODULE_THEMES[card.code] || MODULE_THEMES['M1'];
    const IconComponent = theme.icon || Sparkles;
    const GraphicComponent = COLLAPSED_GRAPHICS[card.code];

    return (
      <div
        key={card.id}
        className={`opp-wall-card opp-theme-${card.code.toLowerCase()} ${isActive ? 'is-active' : ''}`}
        onMouseEnter={() => handleCardMouseEnter(card.id)}
        onClick={() => handleCardClick(card.id)}
        style={{
          '--module-accent': theme.accent,
          '--module-card-border': theme.cardBorder,
          '--module-card-bg-tint': theme.cardBgTint,
          '--module-glow': theme.glow,
          '--module-badge-bg': theme.badgeBg,
          '--module-badge-text': theme.badgeText,
          '--module-badge-border': theme.badgeBorder,
          '--module-icon-bg': theme.iconBg,
          '--module-icon-border': theme.iconBorder,
          '--module-arrow-bg': theme.arrowBg,
          '--module-arrow-border': theme.arrowBorder,
          '--module-arrow-color': theme.arrowColor,
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
        {/* Subtle Module-Specific Graphic Watermark */}
        <CardWatermark watermark={theme.watermark} accentColor={theme.accent} />

        {/* Compact Default Card View */}
        <div className="opp-wall-card-compact">
          <div className="opp-wall-compact-left">
            <span className="opp-wall-badge-num">
              {card.code}
            </span>
            <div className="opp-wall-compact-title-wrap">
              <div className="opp-wall-compact-name-row">
                <div className="opp-wall-icon-box">
                  <IconComponent size={15} />
                </div>
                <h4 className="opp-wall-compact-name">
                  {card.name}
                </h4>
              </div>
              <p className="opp-wall-compact-desc">
                {card.compactDesc}
              </p>
            </div>
          </div>

          <div className="opp-wall-arrow-btn" aria-label={`Expand ${card.name} opportunity details`}>
            <ArrowRight size={16} />
          </div>
        </div>

        {/* Smooth Expandable Body (Accordion Mechanism) */}
        <div className="opp-wall-expand-wrapper">
          <div className="opp-wall-expand-inner">
            <div className="opp-wall-expand-content">

              {/* Graphic System Illustration */}
              {GraphicComponent && (
                <div style={{ marginTop: '14px', marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
                  <GraphicComponent accentColor={theme.accent} />
                </div>
              )}

              {/* Meta Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                <span style={{ fontFamily: 'monospace', fontSize: '11px', fontWeight: 800, color: theme.accent, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  {card.code} · {card.name.toUpperCase()}
                </span>
                <span style={{ fontSize: '10px', fontFamily: 'monospace', fontWeight: 700, padding: '2.5px 8px', borderRadius: '4px', backgroundColor: 'rgba(5, 150, 105, 0.15)', color: '#34D399', border: '1px solid rgba(5, 150, 105, 0.3)', whiteSpace: 'nowrap' }}>
                  ● {card.statusBadge.toUpperCase()}
                </span>
              </div>

              {/* Role Title */}
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em', margin: '0 0 10px 0', lineHeight: 1.28, wordBreak: 'break-word' }}>
                {card.role}
              </h3>

              {/* Brief Snippet */}
              <p style={{ fontSize: '13px', fontStyle: 'italic', color: 'rgba(255, 255, 255, 0.78)', lineHeight: 1.55, margin: '0 0 14px 0', paddingLeft: '12px', borderLeft: `2.5px solid ${theme.accent}`, wordBreak: 'break-word' }}>
                "{card.briefSnippet}"
              </p>

              {/* Needed Capabilities Chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                {card.neededCapabilities.map((cap, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: '10.5px',
                      fontFamily: 'monospace',
                      fontWeight: 600,
                      backgroundColor: 'rgba(255, 255, 255, 0.07)',
                      border: '1px solid rgba(255, 255, 255, 0.14)',
                      color: '#E5E7EB',
                      padding: '3px 8px',
                      borderRadius: '5px',
                    }}
                  >
                    {cap}
                  </span>
                ))}
              </div>

              {/* Snapshot Details Box */}
              <div 
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.09)',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  marginBottom: '14px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '10px',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxSizing: 'border-box',
                  width: '100%',
                  maxWidth: '100%'
                }}
              >
                <div style={{ minWidth: '120px', flex: '1 1 auto' }}>
                  <span style={{ display: 'block', fontSize: '9px', fontFamily: 'monospace', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em' }}>COMPENSATION</span>
                  <span style={{ fontSize: '14px', fontWeight: 800, color: theme.accent, wordBreak: 'break-word' }}>{card.payment_amount}</span>
                </div>
                <div style={{ flex: '0 0 auto' }}>
                  <span style={{ display: 'block', fontSize: '9px', fontFamily: 'monospace', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em' }}>VERIFICATION</span>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#10B981', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={12} style={{ color: '#10B981' }} />
                    <span>Verified by UpShift</span>
                  </span>
                </div>
              </div>

              {/* Required Proof Spec Box */}
              <div 
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.09)',
                  borderLeft: `3px solid ${theme.accent}`,
                  borderRadius: '10px',
                  padding: '10px 14px',
                  marginBottom: '16px',
                  boxSizing: 'border-box',
                  width: '100%',
                  maxWidth: '100%'
                }}
              >
                <span style={{ fontSize: '9.5px', fontFamily: 'monospace', fontWeight: 800, textTransform: 'uppercase', color: theme.accent, display: 'block', marginBottom: '3px', letterSpacing: '0.08em' }}>
                  ★ REQUIRED PROOF SPEC
                </span>
                <p style={{ fontSize: '12px', color: '#E5E7EB', margin: 0, lineHeight: 1.45, wordBreak: 'break-word' }}>
                  {card.proofRequirement}
                </p>
              </div>

              {/* Action Footer */}
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '10px', paddingTop: '4px', width: '100%', boxSizing: 'border-box' }}>
                <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#9CA3AF', flex: '1 1 auto', minWidth: '100px' }}>
                  {card.category}
                </span>
                <button
                  type="button"
                  onClick={(e) => handleApplyClick(card, e)}
                  style={{
                    backgroundColor: '#E31B23',
                    borderColor: '#E31B23',
                    color: '#FFFFFF',
                    borderRadius: '9999px',
                    padding: '8px 18px',
                    fontSize: '12px',
                    fontWeight: 700,
                    border: '1px solid transparent',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: '0 4px 14px rgba(227, 27, 35, 0.4)',
                    whiteSpace: 'nowrap',
                    flex: '0 0 auto',
                    maxWidth: '100%',
                    boxSizing: 'border-box'
                  }}
                  className="opp-cta-button"
                >
                  <span>APPLY FOR THIS GIG</span>
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
        <div style={{ maxWidth: '780px', marginBottom: '28px' }}>
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
          onMouseLeave={handleGridMouseLeave}
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
      </div>
    </section>
  );
}

