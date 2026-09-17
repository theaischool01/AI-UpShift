import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Building, 
  MapPin, 
  Clock, 
  ExternalLink, 
  Globe, 
  Sparkles, 
  AlertCircle, 
  Loader2, 
  CheckCircle2,
  Share2,
  Banknote
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

// Strict URL protocol validator
function isValidExternalUrl(urlString) {
  if (!urlString || typeof urlString !== 'string') return false;
  try {
    const parsed = new URL(urlString);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export default function LearnerGigDetailPage() {
  const { gigId } = useParams();
  const navigate = useNavigate();

  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    async function loadGigDetail() {
      if (!gigId) return;
      setLoading(true);
      setError(null);

      try {
        let { data, error: fetchErr } = await supabase
          .from('gigs')
          .select(`
            id,
            external_gig_id,
            title,
            course_id,
            short_description,
            long_description,
            origin_site,
            origin_url,
            organization,
            payment_amount,
            location,
            engagement_type,
            created_at,
            course:courses (
              id,
              code,
              name,
              category,
              color,
              bg_color,
              tagline
            )
          `)
          .eq('id', gigId)
          .maybeSingle();

        if (fetchErr) throw fetchErr;

        if (!data) {
          setGig(null);
        } else {
          setGig(data);
        }
      } catch (err) {
        console.error('[LearnerGigDetailPage] Load error:', err);
        if (err.code === '42703' || err.code === 'PGRST204' || err.message?.toLowerCase().includes('payment_amount')) {
          setError('Database schema error: payment_amount field unavailable. Please apply the latest database migration.');
        } else {
          setError('Unable to load this opportunity. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    }

    loadGigDetail();
  }, [gigId]);

  // Safe external navigation handler
  const handleApplyClick = () => {
    if (!gig?.origin_url || !isValidExternalUrl(gig.origin_url)) return;
    window.open(gig.origin_url, '_blank', 'noopener,noreferrer');
  };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3 text-[#6B7280]">
        <Loader2 className="w-8 h-8 animate-spin text-[#E31B23]" />
        <span className="text-xs font-medium">Loading opportunity details...</span>
      </div>
    );
  }

  // 404 Not Found state
  if (!gig) {
    return (
      <div className="py-16 max-w-lg mx-auto text-center">
        <div className="learner-card p-12 space-y-4 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 text-[#E31B23] flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-[#111827] tracking-tight">
            OPPORTUNITY NOT FOUND
          </h2>
          <p className="text-xs text-[#4B5563] leading-relaxed">
            The requested opportunity could not be found or may have been retired.
          </p>
          <div className="pt-2">
            <Link to="/learner/dashboard" className="learner-btn-primary text-xs">
              Back to Opportunities
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const course = gig.course;
  const isApplyUrlValid = isValidExternalUrl(gig.origin_url);

  // Split long description into clean paragraphs while preserving single newlines
  const descriptionParagraphs = gig.long_description
    ? gig.long_description
        .split(/\n\n+/)
        .map(p => p.trim())
        .filter(Boolean)
    : [];

  const formattedDate = gig.created_at
    ? new Date(gig.created_at).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  return (
    <div className="learner-detail-container">
      {/* Top Action Row */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <Link
          to="/learner/dashboard"
          className="learner-back-link"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Opportunities</span>
        </Link>

        <button
          type="button"
          onClick={handleCopyShareLink}
          className="learner-share-btn"
          title="Copy link to opportunity"
          aria-label="Share opportunity"
        >
          {copiedLink ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-700 font-semibold">Link Copied</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4 text-[#4B5563]" />
              <span>Share</span>
            </>
          )}
        </button>
      </div>

      {/* Main Two-Column Layout */}
      <div className="learner-detail-layout">
        {/* Left Column: Role Details, Overview & Complete Scope */}
        <div className="min-w-0 space-y-6">
          {/* Track Badge & External ID Header */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              {course && (
                <span
                  className="learner-detail-badge-track"
                  style={{
                    backgroundColor: course.bg_color || '#FEF2F2',
                    color: course.color || '#DC2626',
                    borderColor: course.color ? `${course.color}40` : '#FECACA',
                  }}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{course.code} · {course.name}</span>
                </span>
              )}
              {gig.external_gig_id && (
                <span className="learner-detail-id">
                  ID: {gig.external_gig_id}
                </span>
              )}
            </div>

            {/* Gig Title */}
            <h1 className="learner-detail-title">
              {gig.title}
            </h1>

            {/* Organization */}
            {gig.organization && (
              <div className="learner-detail-org">
                <Building className="w-5 h-5 text-[#4B5563] flex-shrink-0" />
                <span>{gig.organization}</span>
              </div>
            )}

            {/* Metadata Chips */}
            <div className="learner-detail-chips">
              <span className="learner-detail-chip font-bold text-[#111827] bg-red-50/50 border-red-200">
                <Banknote className="w-4 h-4 text-[#E31B23]" />
                <span>{gig.payment_amount && gig.payment_amount.trim() !== '' ? gig.payment_amount : 'Payment not specified'}</span>
              </span>
              {gig.origin_site && (
                <span className="learner-detail-chip">
                  <Globe className="w-4 h-4 text-[#6B7280]" />
                  <span>Origin: {gig.origin_site}</span>
                </span>
              )}
              {gig.location && (
                <span className="learner-detail-chip">
                  <MapPin className="w-4 h-4 text-[#6B7280]" />
                  <span>{gig.location}</span>
                </span>
              )}
              {gig.engagement_type && (
                <span className="learner-detail-chip">
                  <Clock className="w-4 h-4 text-[#6B7280]" />
                  <span>{gig.engagement_type}</span>
                </span>
              )}
            </div>
          </div>

          {/* Short Summary Card */}
          {gig.short_description && (
            <div className="learner-detail-summary-card">
              <span className="text-[11px] font-mono font-bold tracking-wider text-[#6B7280] uppercase block mb-2">
                Overview Snippet
              </span>
              <p className="learner-detail-summary-text">
                {gig.short_description}
              </p>
            </div>
          )}

          {/* Section: About the Role */}
          <div>
            <h2 className="learner-detail-section-title">
              About the Role
            </h2>

            {/* Complete Scope Card with Preserved Formatting */}
            <div className="learner-detail-desc-card">
              {descriptionParagraphs.length > 0 ? (
                descriptionParagraphs.map((paragraph, idx) => (
                  <p key={idx} className="learner-detail-desc-p whitespace-pre-line">
                    {paragraph}
                  </p>
                ))
              ) : (
                <p className="learner-detail-desc-p whitespace-pre-line">
                  {gig.long_description}
                </p>
              )}
            </div>
          </div>

          {/* Source / Indexed Date Footnote */}
          {formattedDate && (
            <div className="learner-detail-indexed">
              Indexed into the UpShift board on {formattedDate}
            </div>
          )}
        </div>

        {/* Right Column: Opportunity Gateway Apply Panel */}
        <div className="learner-sticky-apply">
          <div className="learner-apply-panel space-y-6">
            <div>
              <span className="text-[11px] font-mono font-bold tracking-wider text-[#111827] uppercase block mb-1">
                Opportunity Gateway
              </span>
              <h3 className="text-xl font-bold text-[#111827] tracking-tight m-0">
                Ready to Apply?
              </h3>
              <p className="text-[14px] text-[#4B5563] mt-2 leading-relaxed">
                Review the complete opportunity and submit your application on the originating platform.
              </p>
            </div>

            {/* Platform Verification Card */}
            <div className="p-4 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] text-xs space-y-2.5">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-gray-100">
                <span className="text-[#6B7280]">Payment:</span>
                <span className="font-bold text-[#111827] text-sm">{gig.payment_amount && gig.payment_amount.trim() !== '' ? gig.payment_amount : 'Payment not specified'}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#6B7280]">Hosting Platform:</span>
                <span className="font-semibold text-[#111827]">{gig.origin_site || 'External'}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#6B7280]">Verification:</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Verified Link
                </span>
              </div>
            </div>

            {/* Primary Apply CTA */}
            {isApplyUrlValid ? (
              <a
                href={gig.origin_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleApplyClick}
                className="learner-apply-btn shadow-md hover:shadow-lg"
              >
                <span>Apply Now</span>
                <ExternalLink className="w-5 h-5" />
              </a>
            ) : (
              <div className="p-3.5 rounded-xl bg-[#F3F4F6] border border-[#E5E7EB] text-center text-xs font-medium text-[#6B7280]">
                Application link currently unavailable
              </div>
            )}

            {/* Disclaimer */}
            <p className="learner-apply-disclaimer">
              You will be directed to the third-party client site. No UpShift application account required.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
