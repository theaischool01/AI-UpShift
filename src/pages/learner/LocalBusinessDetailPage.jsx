import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight,
  Store, 
  MapPin, 
  CheckCircle2, 
  Share2, 
  ShieldCheck,
  Mail,
  MessageCircle,
  ExternalLink,
  Briefcase,
  Clock,
  Globe,
  UploadCloud
} from 'lucide-react';
import { localBusinessOpportunities } from '../../data/localBusinessOpportunities';
import MockApplicationModal from '../../components/learner/MockApplicationModal';

const InstagramIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const LinkedinIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

export default function LocalBusinessDetailPage() {
  const { businessId } = useParams();
  const [copiedLink, setCopiedLink] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  // Work Showcase state
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [driveUrl, setDriveUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [socialProfileUrl, setSocialProfileUrl] = useState('');

  const business = localBusinessOpportunities.find(b => b.id === businessId);

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (!business) {
    return (
      <div className="learner-detail-container">
        <div className="learner-detail-top-nav">
          <Link to="/local-businesses" className="learner-back-link">
            <ArrowLeft size={16} />
            <span>Back to Local Businesses</span>
          </Link>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-50 text-[#E31B23] flex items-center justify-center mx-auto">
            <Store size={24} />
          </div>
          <h2 className="text-xl font-bold text-[#111827] m-0">
            Local Business Opportunity Not Found
          </h2>
          <p className="text-xs text-[#6B7280] m-0">
            The requested local business brief may have been archived or the link is incorrect.
          </p>
          <Link to="/local-businesses" className="learner-btn-primary inline-flex">
            <span>Explore All Local Businesses</span>
          </Link>
        </div>
      </div>
    );
  }

  const avatarLetter = business.avatar || business.businessName.charAt(0).toUpperCase();

  return (
    <div className="learner-detail-container">
      {/* 1. TOP NAVIGATION */}
      <div className="learner-detail-top-nav">
        <Link to="/local-businesses" className="learner-back-link">
          <ArrowLeft size={16} />
          <span>Back to Local Businesses</span>
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
              backgroundColor: 'rgba(5, 150, 105, 0.08)',
              color: '#059669',
              border: '1px solid rgba(5, 150, 105, 0.25)'
            }}
          >
            <Store size={13} />
            <span>Local Business · {business.category}</span>
          </span>

          <span className="learner-detail-id">
            ID: {business.id.toUpperCase()}
          </span>
        </div>

        {/* Header Content with Business Avatar */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 my-2">
          <div 
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black flex-shrink-0 shadow-2xs border select-none"
            style={{
              backgroundColor: business.avatarBg || '#FEF2F2',
              color: business.avatarColor || '#DC2626',
              borderColor: `${business.avatarColor || '#DC2626'}22`
            }}
          >
            {avatarLetter}
          </div>

          <div>
            <h1 className="learner-detail-title mb-1">
              {business.opportunityTitle}
            </h1>
            <div className="text-sm font-bold text-[#374151] flex items-center gap-2 flex-wrap">
              <span>{business.businessName}</span>
              <span className="text-gray-300">·</span>
              <span className="text-xs text-[#6B7280] font-normal flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#9CA3AF]" />
                <span>{business.location}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Metadata Pills */}
        <div className="learner-detail-chips mt-4">
          <span className="learner-detail-chip">
            <span className="learner-dot-green" />
            <span>{business.workMode}</span>
          </span>

          <span className="learner-detail-chip">
            <span style={{ color: '#E31B23', fontWeight: 700 }}>₹</span>
            <span>Earning: <strong style={{ color: '#111827' }}>{business.earnings}</strong></span>
          </span>

          <span className="learner-detail-chip">
            <Clock size={13} className="text-gray-500" />
            <span>Duration: <strong style={{ color: '#111827' }}>{business.duration}</strong></span>
          </span>

          <span className="learner-detail-chip learner-chip-verified">
            <ShieldCheck size={14} style={{ color: '#059669' }} />
            <span>Verified UpShift Partner Opportunity</span>
          </span>
        </div>
      </header>

      {/* 3. MAIN 2-COLUMN LAYOUT */}
      <div className="learner-detail-layout">
        {/* LEFT COLUMN: ABOUT, FOUNDER, SCOPE & REQUIREMENTS */}
        <article className="learner-detail-main-card">
          {/* Section: Business Overview */}
          <div className="learner-card-section">
            <span className="learner-section-eyebrow">ABOUT THE BUSINESS</span>
            <p className="learner-lead-paragraph mb-3">
              {business.about}
            </p>
            {business.currentDigitalPresence && (
              <div className="p-3.5 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] text-xs text-[#4B5563] space-y-1">
                <span className="font-bold text-[#111827] block uppercase tracking-wider text-[10px]">
                  Current Digital State
                </span>
                <p className="m-0 leading-relaxed">
                  {business.currentDigitalPresence}
                </p>
              </div>
            )}
          </div>

          {/* Section: Founder / Owner Information */}
          <div className="learner-card-section">
            <span className="learner-section-eyebrow">BUSINESS OWNER & CONTACT</span>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-[#E5E7EB] bg-[#FAFAFA]">
              <div>
                <h4 className="text-sm font-bold text-[#111827] m-0">
                  {business.ownerName}
                </h4>
                <p className="text-xs text-[#6B7280] m-0 mt-0.5">
                  {business.ownerRole}
                </p>
                {business.founderBio && (
                  <p className="text-xs text-[#4B5563] mt-2 max-w-md leading-relaxed m-0">
                    {business.founderBio}
                  </p>
                )}
              </div>

              {/* Founder Social Links (Mock UI) */}
              <div className="flex items-center gap-2 self-start sm:self-center">
                {business.founderSocials?.email && (
                  <a
                    href={`mailto:${business.founderSocials.email}`}
                    className="p-2 rounded-lg bg-white border border-[#E5E7EB] text-[#4B5563] hover:text-[#E31B23] hover:border-red-200 transition-all shadow-2xs"
                    title="Send Email"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                )}
                {business.founderSocials?.instagram && (
                  <a
                    href={business.founderSocials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-white border border-[#E5E7EB] text-[#4B5563] hover:text-[#E1306C] hover:border-pink-200 transition-all shadow-2xs"
                    title="Instagram"
                  >
                    <InstagramIcon />
                  </a>
                )}
                {business.founderSocials?.linkedin && (
                  <a
                    href={business.founderSocials.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-white border border-[#E5E7EB] text-[#4B5563] hover:text-[#0A66C2] hover:border-blue-200 transition-all shadow-2xs"
                    title="LinkedIn"
                  >
                    <LinkedinIcon />
                  </a>
                )}
                {business.founderSocials?.whatsapp && (
                  <a
                    href={`https://wa.me/${business.founderSocials.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-white border border-[#E5E7EB] text-[#4B5563] hover:text-[#25D366] hover:border-emerald-200 transition-all shadow-2xs"
                    title="WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Section: Scope of Work */}
          <div className="learner-card-section">
            <h2 className="learner-section-heading">SCOPE OF WORK</h2>
            <p className="text-xs text-[#6B7280] mb-3">
              Key objectives and operational milestones expected for this commercial engagement:
            </p>
            <ul className="learner-bullet-list">
              {business.scope.map((item, index) => (
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
              {business.requirements.map((item, index) => (
                <li key={index} className="learner-bullet-item">
                  <CheckCircle2 size={15} style={{ color: '#059669', flexShrink: 0, marginTop: '2px' }} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </article>

        {/* RIGHT COLUMN: EARNINGS, DELIVERABLES, SHOWCASE & APPLY */}
        <aside className="learner-detail-sidebar space-y-5">
          <div className="learner-sidebar-card">
            {/* Compensation Header */}
            <div className="learner-sidebar-compensation-block">
              <span className="learner-sidebar-eyebrow">OPPORTUNITY TO EARN</span>
              <div className="learner-sidebar-price text-[#111827]">
                {business.earnings}
              </div>
              <div className="learner-sidebar-status-row">
                <CheckCircle2 size={15} className="learner-status-icon-green" />
                <span>{business.projectType || 'Project-based'} · Direct Commercial Brief</span>
              </div>
            </div>

            <div className="learner-sidebar-divider" />

            {/* Opportunity Details */}
            <div className="learner-sidebar-metadata-group space-y-2.5 text-xs">
              <div className="flex justify-between items-center py-1">
                <span className="text-[#6B7280] font-medium">ENGAGEMENT TYPE</span>
                <span className="font-bold text-[#111827]">{business.projectType || 'Project-based'}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-[#6B7280] font-medium">EXPECTED DURATION</span>
                <span className="font-bold text-[#111827]">{business.duration}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-[#6B7280] font-medium">LOCATION</span>
                <span className="font-bold text-[#111827]">{business.location}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-[#6B7280] font-medium">WORK MODE</span>
                <span className="font-bold text-[#111827]">{business.workMode}</span>
              </div>
            </div>

            <div className="learner-sidebar-divider" />

            {/* Deliverables */}
            <div className="space-y-2">
              <span className="learner-sidebar-eyebrow">WHAT YOU'LL DELIVER</span>
              <ul className="space-y-1.5 text-xs text-[#374151]">
                {business.deliverables.map((del, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{del}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="learner-sidebar-divider" />

            {/* Showcase Your Work Form Fields */}
            <div className="space-y-3">
              <div className="flex items-center gap-1.5">
                <UploadCloud className="w-4 h-4 text-[#E31B23]" />
                <span className="learner-sidebar-eyebrow mb-0">SHOWCASE YOUR WORK</span>
              </div>
              <p className="text-[11px] text-[#6B7280] m-0">
                Share relevant project links or proof artifacts with the business:
              </p>

              <div className="space-y-2 text-xs">
                <input
                  type="url"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  placeholder="Portfolio URL (e.g. GitHub / Behance)"
                  className="w-full px-3 py-2 rounded-lg border border-[#D1D5DB] text-xs text-[#111827] bg-[#FAFAFA] focus:bg-white focus:outline-hidden focus:border-[#E31B23]"
                />
                <input
                  type="url"
                  value={driveUrl}
                  onChange={(e) => setDriveUrl(e.target.value)}
                  placeholder="Google Drive Link (Sample Work)"
                  className="w-full px-3 py-2 rounded-lg border border-[#D1D5DB] text-xs text-[#111827] bg-[#FAFAFA] focus:bg-white focus:outline-hidden focus:border-[#E31B23]"
                />
                <input
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="Live Website / Demo Link"
                  className="w-full px-3 py-2 rounded-lg border border-[#D1D5DB] text-xs text-[#111827] bg-[#FAFAFA] focus:bg-white focus:outline-hidden focus:border-[#E31B23]"
                />
              </div>
            </div>

            <div className="learner-sidebar-divider" />

            {/* Apply CTA Button */}
            <div className="learner-sidebar-cta-block pt-1">
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
        opportunity={business}
        opportunityType="local"
      />
    </div>
  );
}
