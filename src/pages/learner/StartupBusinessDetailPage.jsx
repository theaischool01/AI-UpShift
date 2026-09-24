import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight,
  Rocket, 
  MapPin, 
  CheckCircle2, 
  Share2, 
  ShieldCheck,
  Mail,
  Globe,
  Briefcase,
  Clock,
  Layers,
  UploadCloud,
  Building2
} from 'lucide-react';
import { startupOpportunities } from '../../data/startupOpportunities';
import MockApplicationModal from '../../components/learner/MockApplicationModal';

const LinkedinIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

const TwitterIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4l11.733 16h4.267l-11.733 -16z"/>
    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/>
  </svg>
);

export default function StartupBusinessDetailPage() {
  const { startupId } = useParams();
  const [copiedLink, setCopiedLink] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  // Work Showcase state
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [driveUrl, setDriveUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');

  const startup = startupOpportunities.find(s => s.id === startupId);

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (!startup) {
    return (
      <div className="learner-detail-container">
        <div className="learner-detail-top-nav">
          <Link to="/startup-businesses" className="learner-back-link">
            <ArrowLeft size={16} />
            <span>Back to Startup Businesses</span>
          </Link>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-50 text-[#E31B23] flex items-center justify-center mx-auto">
            <Rocket size={24} />
          </div>
          <h2 className="text-xl font-bold text-[#111827] m-0">
            Startup Opportunity Not Found
          </h2>
          <p className="text-xs text-[#6B7280] m-0">
            The requested startup project brief may have expired or the link is incorrect.
          </p>
          <Link to="/startup-businesses" className="learner-btn-primary inline-flex">
            <span>Explore All Startups</span>
          </Link>
        </div>
      </div>
    );
  }

  const avatarLetter = startup.avatar || startup.startupName.charAt(0).toUpperCase();

  return (
    <div className="learner-detail-container">
      {/* 1. TOP NAVIGATION */}
      <div className="learner-detail-top-nav">
        <Link to="/startup-businesses" className="learner-back-link">
          <ArrowLeft size={16} />
          <span>Back to Startup Businesses</span>
        </Link>

        <button
          type="button"
          onClick={handleCopyShareLink}
          className="learner-share-btn"
          title="Copy link to opportunity"
        >
          {copiedLink ? (
            <>
              <CheckCircle2 size={15} style={{ color: '#10B981' }} />
              <span style={{ color: '#10B981', fontWeight: 600 }}>Link Copied</span>
            </>
          ) : (
            <>
              <Share2 size={15} />
              <span>Share</span>
            </>
          )}
        </button>
      </div>

      {/* 2. HERO HEADER CARD */}
      <header className="learner-detail-header">
        <div className="learner-detail-header-badges">
          <span
            className="learner-detail-badge-track"
            style={{
              backgroundColor: 'rgba(37, 99, 235, 0.08)',
              color: '#2563EB',
              border: '1px solid rgba(37, 99, 235, 0.25)'
            }}
          >
            <Rocket size={13} />
            <span>Startup Venture · {startup.industry}</span>
          </span>

          {startup.stage && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
              <span>Stage: {startup.stage}</span>
            </span>
          )}

          <span className="learner-detail-id">
            ID: {startup.id.toUpperCase()}
          </span>
        </div>

        {/* Header Content with Startup Avatar */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 my-2">
          <div 
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black flex-shrink-0 shadow-2xs border select-none"
            style={{
              backgroundColor: startup.avatarBg || '#EFF6FF',
              color: startup.avatarColor || '#2563EB',
              borderColor: `${startup.avatarColor || '#2563EB'}22`
            }}
          >
            {avatarLetter}
          </div>

          <div>
            <h1 className="learner-detail-title mb-1">
              {startup.opportunityTitle}
            </h1>
            <div className="text-sm font-bold text-[#374151] flex items-center gap-2 flex-wrap">
              <span>{startup.startupName}</span>
              <span className="text-gray-300">·</span>
              <span className="text-xs text-[#6B7280] font-normal flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#9CA3AF]" />
                <span>{startup.location}</span>
              </span>
              <span className="text-gray-300">·</span>
              <span className="text-xs text-[#6B7280] font-normal">
                Founder: <strong className="text-[#374151]">{startup.founderName}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Metadata Pills */}
        <div className="learner-detail-chips mt-4">
          <span className="learner-detail-chip">
            <span className="learner-dot-green" />
            <span>{startup.workMode}</span>
          </span>

          <span className="learner-detail-chip">
            <span style={{ color: '#E31B23', fontWeight: 700 }}>₹</span>
            <span>Potential Earning: <strong style={{ color: '#111827' }}>{startup.earnings}</strong></span>
          </span>

          <span className="learner-detail-chip">
            <Clock size={13} className="text-gray-500" />
            <span>Duration: <strong style={{ color: '#111827' }}>{startup.duration}</strong></span>
          </span>

          <span className="learner-detail-chip learner-chip-verified">
            <ShieldCheck size={14} style={{ color: '#059669' }} />
            <span>Verified UpShift Startup Partner</span>
          </span>
        </div>
      </header>

      {/* 3. MAIN 2-COLUMN LAYOUT */}
      <div className="learner-detail-layout">
        {/* LEFT COLUMN: ABOUT, MISSION, FOUNDER, SCOPE & REQUIREMENTS */}
        <article className="learner-detail-main-card">
          {/* Section: About the Startup */}
          <div className="learner-card-section">
            <span className="learner-section-eyebrow">ABOUT THE COMPANY</span>
            <p className="learner-lead-paragraph mb-3">
              {startup.about}
            </p>
            {startup.mission && (
              <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-100 text-xs text-[#374151] space-y-1">
                <span className="font-bold text-blue-900 block uppercase tracking-wider text-[10px]">
                  Company Mission & Product Focus
                </span>
                <p className="m-0 leading-relaxed text-blue-950 font-medium">
                  {startup.mission}
                </p>
              </div>
            )}
          </div>

          {/* Section: Founder & Social Links */}
          <div className="learner-card-section">
            <span className="learner-section-eyebrow">FOUNDER & LEADERSHIP</span>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-[#E5E7EB] bg-[#FAFAFA]">
              <div>
                <h4 className="text-sm font-bold text-[#111827] m-0">
                  {startup.founderName}
                </h4>
                <p className="text-xs text-[#6B7280] m-0 mt-0.5">
                  {startup.founderRole}
                </p>
                {startup.founderBio && (
                  <p className="text-xs text-[#4B5563] mt-2 max-w-md leading-relaxed m-0">
                    {startup.founderBio}
                  </p>
                )}
              </div>

              {/* Startup Socials (Mock UI) */}
              <div className="flex items-center gap-2 self-start sm:self-center">
                {startup.socials?.website && (
                  <a
                    href={startup.socials.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-white border border-[#E5E7EB] text-[#4B5563] hover:text-[#2563EB] hover:border-blue-200 transition-all shadow-2xs"
                    title="Website"
                  >
                    <Globe className="w-4 h-4" />
                  </a>
                )}
                {startup.socials?.email && (
                  <a
                    href={`mailto:${startup.socials.email}`}
                    className="p-2 rounded-lg bg-white border border-[#E5E7EB] text-[#4B5563] hover:text-[#E31B23] hover:border-red-200 transition-all shadow-2xs"
                    title="Send Email"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                )}
                {startup.socials?.linkedin && (
                  <a
                    href={startup.socials.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-white border border-[#E5E7EB] text-[#4B5563] hover:text-[#0A66C2] hover:border-blue-200 transition-all shadow-2xs"
                    title="LinkedIn"
                  >
                    <LinkedinIcon />
                  </a>
                )}
                {startup.socials?.twitter && (
                  <a
                    href={startup.socials.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-white border border-[#E5E7EB] text-[#4B5563] hover:text-[#1DA1F2] hover:border-sky-200 transition-all shadow-2xs"
                    title="Twitter / X"
                  >
                    <TwitterIcon />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Section: Scope of Work */}
          <div className="learner-card-section">
            <h2 className="learner-section-heading">SCOPE OF WORK</h2>
            <p className="text-xs text-[#6B7280] mb-3">
              Core tasks, engineering sprints, and deliverables expected during this engagement:
            </p>
            <ul className="learner-bullet-list">
              {startup.scope.map((item, index) => (
                <li key={index} className="learner-bullet-item">
                  <span className="learner-bullet-dot" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section: What They Require */}
          <div className="learner-card-section learner-card-section-last">
            <h2 className="learner-section-heading">WHAT THEY REQUIRE</h2>
            <ul className="learner-bullet-list">
              {startup.requirements.map((item, index) => (
                <li key={index} className="learner-bullet-item">
                  <CheckCircle2 size={15} style={{ color: '#2563EB', flexShrink: 0, marginTop: '2px' }} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </article>

        {/* RIGHT COLUMN: EARNINGS, EXPECTED OUTPUT, SHOWCASE & APPLY */}
        <aside className="learner-detail-sidebar space-y-5">
          <div className="learner-sidebar-card">
            {/* Compensation Header */}
            <div className="learner-sidebar-compensation-block">
              <span className="learner-sidebar-eyebrow">OPPORTUNITY TO EARN</span>
              <div className="learner-sidebar-price text-[#111827]">
                {startup.earnings}
              </div>
              <div className="learner-sidebar-status-row">
                <CheckCircle2 size={15} className="learner-status-icon-green" />
                <span>{startup.engagementType || 'Fellowship / Project'} · Startup Engagement</span>
              </div>
            </div>

            <div className="learner-sidebar-divider" />

            {/* Opportunity Details */}
            <div className="learner-sidebar-metadata-group space-y-2.5 text-xs">
              <div className="flex justify-between items-center py-1">
                <span className="text-[#6B7280] font-medium">ENGAGEMENT TYPE</span>
                <span className="font-bold text-[#111827]">{startup.engagementType || 'Fellowship / Project'}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-[#6B7280] font-medium">EXPECTED DURATION</span>
                <span className="font-bold text-[#111827]">{startup.duration}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-[#6B7280] font-medium">LOCATION</span>
                <span className="font-bold text-[#111827]">{startup.location}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-[#6B7280] font-medium">WORK MODE</span>
                <span className="font-bold text-[#111827]">{startup.workMode}</span>
              </div>
            </div>

            <div className="learner-sidebar-divider" />

            {/* Expected Output / Deliverables */}
            <div className="space-y-2">
              <span className="learner-sidebar-eyebrow">EXPECTED OUTPUT</span>
              <ul className="space-y-1.5 text-xs text-[#374151]">
                {startup.deliverables.map((del, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>{del}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="learner-sidebar-divider" />

            {/* Showcase Your Work Form Fields */}
            <div className="learner-showcase-section">
              <div className="learner-showcase-header">
                <UploadCloud className="w-4 h-4 text-[#E31B23]" />
                <span className="learner-showcase-title">SHOWCASE YOUR WORK</span>
              </div>
              <p className="learner-showcase-desc">
                Share relevant project links or proof artifacts with the business.
              </p>

              <div className="learner-showcase-fields">
                <input
                  type="url"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  placeholder="Portfolio / GitHub / Behance"
                  className="learner-showcase-input"
                  aria-label="Portfolio / GitHub / Behance"
                />
                <input
                  type="url"
                  value={driveUrl}
                  onChange={(e) => setDriveUrl(e.target.value)}
                  placeholder="Google Drive / Sample Work"
                  className="learner-showcase-input"
                  aria-label="Google Drive / Sample Work"
                />
                <input
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="Live Website / Demo Link"
                  className="learner-showcase-input"
                  aria-label="Live Website / Demo Link"
                />
              </div>
            </div>

            <div className="learner-sidebar-divider" />

            {/* Apply CTA Button */}
            <div className="learner-sidebar-cta-block">
              <button
                type="button"
                onClick={() => setIsApplyModalOpen(true)}
                className="learner-apply-button w-full justify-center text-xs font-bold tracking-wider"
              >
                <span>APPLY FOR THIS OPPORTUNITY</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* Mock Application Modal */}
      <MockApplicationModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        opportunity={startup}
        opportunityType="startup"
        initialPortfolioUrl={portfolioUrl || driveUrl || websiteUrl}
      />
    </div>
  );
}
