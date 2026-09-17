export const PROOF_PROJECTS = [
  {
    id: "project-1",
    title: "Apex Athletics — 5-Part Kinetic Launch Series",
    category: "VIDEO",
    format: "Phone Frame (9:16)",
    program: "ReelRush AI",
    accentColor: "#E93B3B",
    author: "Upshifter Alex R.",
    role: "AI Video Specialist",
    briefSummary: "Direct and edit a high-retention launch reel series for a running brand, synchronizing AI-generated B-roll with real runner audio.",
    problemSolved: "Client needed commercial-quality social video on a $0 studio budget to test paid ads before hiring an expensive production crew.",
    skillsUsed: ["Generative B-Roll", "Audio Synthesis", "Pacing & Retime", "Dynamic Subtitles"],
    deliverables: "5 vertical 4K reels, hook analysis report, prompt logbook",
    previewAspect: "aspect-9-16",
    badge: "92% Hook Retention Rate",
    timelineSteps: [
      { time: "00:00", label: "Cold Hook: AI Macro Shoe Drop" },
      { time: "00:08", label: "Voiceover Sync: Runner Monologue" },
      { time: "00:22", label: "Kinetic Cut: Urban Night Running" },
      { time: "00:41", label: "CTA Lockup: Pre-order Callout" }
    ]
  },
  {
    id: "project-2",
    title: "Aura Botanica — Spatial Brand Identity & 3D Packaging",
    category: "DESIGN",
    format: "Editorial Spread",
    program: "VisualForge AI",
    accentColor: "#2563EB",
    author: "Upshifter Maya K.",
    role: "AI Visual Designer",
    briefSummary: "Develop a complete organic skincare visual identity package, featuring 3D packaging renders, social art direction, and typography tokens.",
    problemSolved: "Startup founder had product formulas ready but lacked retail-grade brand assets needed to pitch Sephora and Credo.",
    skillsUsed: ["Diffusion Directing", "LoRA Style Training", "Packaging Mockups", "Print Prep"],
    deliverables: "42-page Brand Guidelines, 18 high-res 3D product renders, vector logos",
    previewAspect: "aspect-16-10",
    badge: "Pitch-Ready Brand Identity",
    designTokens: ["Pantone 7527 C", "Earthy Terracotta #C86D51", "Space Grotesk Bold", "Silk Matte Foil"]
  },
  {
    id: "project-3",
    title: "FinAudit 1000 — LLM Hallucination Benchmark Matrix",
    category: "DATA",
    format: "Structured Data View",
    program: "DeepAnnotator",
    accentColor: "#059669",
    author: "Upshifter Dev P.",
    role: "AI Data Evaluator",
    briefSummary: "Structure and evaluate 1,000 financial disclosures across multi-model outputs to detect numerical calculation errors and hallucinations.",
    problemSolved: "Fintech startup required ground-truth verification to calibrate their risk-scoring AI before onboarding institutional clients.",
    skillsUsed: ["Taxonomy Design", "RLHF Evaluation", "Red-Teaming", "Precision Auditing"],
    deliverables: "Validated JSONL dataset, error classification ontology, quality report",
    previewAspect: "aspect-4-3",
    badge: "99.8% Ground Truth Precision",
    auditStats: { testCases: "1,000", detectedFlaws: "142", precisionGain: "+34%" }
  },
  {
    id: "project-4",
    title: "KiteDesk — AI-Powered Client Intake & Proposal Engine",
    category: "CODE",
    format: "Browser Window",
    program: "Vibe Coder",
    accentColor: "#4F46E5",
    author: "Upshifter Leo T.",
    role: "AI Web Builder",
    briefSummary: "Design, code, and deploy an interactive intake questionnaire that dynamically generates customized client proposals in real-time.",
    problemSolved: "Agency spent 4 hours drafting each custom proposal; this micro-app cut client turnaround time to under 5 minutes.",
    skillsUsed: ["React / Vite", "Tailored Prompts", "Dynamic PDF Generation", "Live Vercel Deployment"],
    deliverables: "Production web application, GitHub repository, documentation",
    previewAspect: "aspect-16-9",
    badge: "Live Production App",
    urlPreview: "https://kitedesk.upshift.work"
  },
  {
    id: "project-5",
    title: "PulseStack — Omnichannel 30-Day B2B SaaS Growth Engine",
    category: "MARKETING",
    format: "Campaign Deck (16:9)",
    program: "BrandBuzz AI",
    accentColor: "#EA580C",
    author: "Upshifter Sarah L.",
    role: "AI Marketing Strategist",
    briefSummary: "Architect an integrated 30-day Go-To-Market content engine across LinkedIn, founder newsletters, and paid creative variants.",
    problemSolved: "Developer tool startup struggled to explain technical features in language that resonated with VP of Engineering buyers.",
    skillsUsed: ["Persona Prompting", "Ad Angle Testing", "Email Copywriting", "Content Architecture"],
    deliverables: "30-day copy calendar, 15 ad copy variants, 4 lead magnet landing copies",
    previewAspect: "aspect-16-9",
    badge: "Full GTM Content System",
    marketingHooks: ["Angle A: Developer Hours Saved", "Angle B: Architecture Reliability", "Angle C: Team Efficiency"]
  },
  {
    id: "project-6",
    title: "NexusFlow — Autonomous Inbound Lead Enrichment Agent",
    category: "AGENTS",
    format: "System Architecture Flow",
    program: "AgentHandlers",
    accentColor: "#0D9488",
    author: "Upshifter Jordan M.",
    role: "AI Systems Builder",
    briefSummary: "Construct an autonomous agent pipeline that receives inbound submissions, researches prospect financials via scrapers, and routes sales tiers.",
    problemSolved: "Sales reps wasted 15 hours weekly manually researching prospects before introductory qualification calls.",
    skillsUsed: ["Agent Loops", "Tool Calling", "Webhook Orchestration", "Notion & Slack Integration"],
    deliverables: "Live webhook endpoints, fail-safe guardrail script, video demo of autonomous loop",
    previewAspect: "aspect-16-10",
    badge: "Autonomous Multi-Tool Agent",
    nodes: ["Form Submission", "Clearbit / Web Research", "LLM Scoring Agent", "CRM Enriched & Slack Ping"]
  }
];

export const BRIEF_TO_PROOF_CASE = {
  title: "Case Study: From Cold Brief to Production Proof",
  clientType: "Direct-to-Consumer Wellness Startup (San Francisco / London)",
  challengeTitle: "Launch Campaign for 'Lumina Rest' Sleep Tonic",
  stages: [
    {
      step: "01",
      name: "The Real Brief",
      tagline: "Client Need Defined",
      detail: "Client has formulation and packaging, but zero video content or social ad assets. Needs a 3-part campaign highlighting botanical ingredients and clinical trial metrics within 72 hours."
    },
    {
      step: "02",
      name: "Strategic Thinking",
      tagline: "Human Direction & Taste",
      detail: "Instead of generic AI sleep art, the Upshifter outlines a calm, meditative visual narrative using macro liquid droplets, serene sunrise light, and soothing vocal cadences."
    },
    {
      step: "03",
      name: "Applied AI Workflow",
      tagline: "Generative Acceleration",
      detail: "Synthesizing 40 micro-video variations using prompt seeds, training a custom LoRA on the physical bottle geometry, and orchestrating ambient acoustic sound beds."
    },
    {
      step: "04",
      name: "Human Refinement",
      tagline: "Quality Control & Judgment",
      detail: "Selecting the top 3 outputs, color-grading in DaVinci, timing transitions to natural speech pauses, and ensuring medical claims comply with consumer advertising standards."
    },
    {
      step: "05",
      name: "Final Proof of Work",
      tagline: "Tangible Asset Delivered",
      detail: "A commercial-grade launch suite ready for deployment, complete with client handoff documentation, prompt architecture, and performance tracking hooks."
    }
  ]
};
