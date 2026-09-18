import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight,
  Sparkles, 
  AlertCircle, 
  Loader2, 
  CheckCircle2, 
  Share2, 
  ShieldCheck 
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

function isValidExternalUrl(urlString) {
  if (!urlString || typeof urlString !== 'string') return false;
  try {
    const trimmed = urlString.trim();
    const formatted = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    const parsed = new URL(formatted);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

// Helper to normalize array or newline-delimited strings into clean arrays
function parseListItems(fieldData) {
  if (!fieldData) return [];
  if (Array.isArray(fieldData)) {
    return fieldData.map(item => String(item).trim()).filter(Boolean);
  }
  if (typeof fieldData === 'string') {
    return fieldData
      .split(/\n|\|\|/)
      .map(item => item.replace(/^[•\-\*\s]+/, '').trim())
      .filter(Boolean);
  }
  return [];
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default function LearnerGigDetailPage() {
  const { gigId } = useParams();

  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    async function loadGigDetail() {
      // Validate that gigId is a valid UUID
      if (!gigId || !UUID_REGEX.test(gigId)) {
        setGig(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const { data, error: fetchErr } = await supabase
          .from('gigs')
          .select(`
            id,
            external_gig_id,
            title,
            track_id,
            short_description,
            overview,
            responsibilities,
            deliverables,
            requirements,
            proof_spec,
            origin_url,
            payment_amount,
            created_at,
            track:tracks (
              id,
              code,
              name,
              category,
              color,
              bg_color
            )
          `)
          .eq('id', gigId)
          .maybeSingle();

        if (fetchErr) {
          console.warn('[LearnerGigDetailPage] Relational query error, trying flat query fallback:', fetchErr);
          const { data: flatData, error: flatErr } = await supabase
            .from('gigs')
            .select(`
              id,
              external_gig_id,
              title,
              track_id,
              short_description,
              overview,
              responsibilities,
              deliverables,
              requirements,
              proof_spec,
              origin_url,
              payment_amount,
              created_at
            `)
            .eq('id', gigId)
            .maybeSingle();

          if (flatErr) throw flatErr;

          if (flatData) {
            let trackData = null;
            const targetTrackId = flatData.track_id;
            if (targetTrackId) {
              const { data: tData } = await supabase
                .from('tracks')
                .select('id, code, name, category, color, bg_color')
                .eq('id', targetTrackId)
                .maybeSingle();
              trackData = tData;
            }

            setGig({ ...flatData, track: trackData || null });
          } else {
            setGig(null);
          }
          return;
        }

        if (!data) {
          setGig(null);
        } else {
          setGig(data);
        }
      } catch (err) {
        console.error('[LearnerGigDetailPage] Load error:', err);
        setError('Unable to load this opportunity. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    loadGigDetail();
  }, [gigId]);

  const handleApplyClick = () => {
    if (!gig?.origin_url) return;
    let url = gig.origin_url.trim();
    if (!/^https?:\/\//i.test(url)) {
      url = `https://${url}`;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (loading) {
    return (
      <div className="learner-detail-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '360px', gap: '12px', color: '#6B7280' }}>
        <Loader2 className="animate-spin" size={32} style={{ color: '#E31B23' }} />
        <span style={{ fontSize: '13px', fontWeight: 500 }}>Loading opportunity details...</span>
      </div>
    );
  }

  if (error || !gig) {
    return (
      <div className="learner-detail-container">
        <div className="learner-detail-top-nav">
          <Link to="/learner/dashboard" className="learner-back-link">
            <ArrowLeft size={16} />
            <span>Back to Opportunities</span>
          </Link>
        </div>

        <div className="learner-detail-error-card">
          <AlertCircle size={28} className="text-[#E31B23]" />
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#111827', margin: 0 }}>
            Opportunity Not Found
          </h2>
          <p style={{ fontSize: '13px', color: '#6B7280', margin: 0, maxWidth: '420px', lineHeight: 1.5 }}>
            {error || 'This commercial opportunity may have been removed, fulfilled, or the link is invalid.'}
          </p>
          <Link to="/learner/dashboard" className="learner-btn-primary" style={{ marginTop: '8px' }}>
            <span>Explore Active Opportunities</span>
          </Link>
        </div>
      </div>
    );
  }

  const track = gig.track || gig.course;

  // Overview / About the Role text
  const overviewText = gig.overview || gig.short_description || '';
  const overviewParagraphs = overviewText
    .split(/\n\n+/)
    .map(p => p.trim())
    .filter(Boolean);

  // Parse structured lists
  const responsibilitiesList = parseListItems(gig.responsibilities);
  const deliverablesList = parseListItems(gig.deliverables);
  const requirementsList = parseListItems(gig.requirements);
  const proofSpecText = gig.proof_spec || '';

  return (
    <div className="learner-detail-container">
      {/* 1. TOP NAVIGATION: BACK TO DASHBOARD + SHARE LINK */}
      <div className="learner-detail-top-nav">
        <Link to="/learner/dashboard" className="learner-back-link">
          <ArrowLeft size={16} />
          <span>Back to Opportunities</span>
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
        {/* Row of Badges: Track + Opportunity ID */}
        <div className="learner-detail-header-badges">
          {track ? (
            <span
              className="learner-detail-badge-track"
              style={{
                backgroundColor: track.bg_color || 'rgba(227, 27, 35, 0.08)',
                color: track.color || '#E31B23',
                border: `1px solid ${track.color ? `${track.color}33` : 'rgba(227, 27, 35, 0.2)'}`,
              }}
            >
              <Sparkles size={13} />
              <span>{track.code} · {track.name}</span>
            </span>
          ) : (
            <span
              className="learner-detail-badge-track"
              style={{
                backgroundColor: 'rgba(227, 27, 35, 0.08)',
                color: '#E31B23',
                border: '1px solid rgba(227, 27, 35, 0.2)'
              }}
            >
              <Sparkles size={13} />
              <span>UpShift Track</span>
            </span>
          )}

          {gig.external_gig_id && (
            <span className="learner-detail-id">
              ID: {gig.external_gig_id}
            </span>
          )}
        </div>

        {/* Large Crisp Opportunity Title */}
        <h1 className="learner-detail-title">
          {gig.title}
        </h1>

        {/* Relevant Metadata Pills (No company name, No platform leak) */}
        <div className="learner-detail-chips">
          <span className="learner-detail-chip">
            <span className="learner-dot-green" />
            <span>Remote</span>
          </span>

          {gig.payment_amount && gig.payment_amount.trim() !== '' && (
            <span className="learner-detail-chip">
              <span style={{ color: '#E31B23', fontWeight: 700 }}>$</span>
              <span>Rate: <strong style={{ color: '#111827' }}>{gig.payment_amount}</strong></span>
            </span>
          )}

          <span className="learner-detail-chip learner-chip-verified">
            <ShieldCheck size={14} style={{ color: '#059669' }} />
            <span>Verified by UpShift</span>
          </span>
        </div>
      </header>

      {/* 3. MAIN 2-COLUMN LAYOUT: LEFT JOB DETAILS + RIGHT APPLY CARD */}
      <div className="learner-detail-layout">
        {/* LEFT COLUMN: SINGLE UNIFIED JOB DETAILS CARD */}
        <article className="learner-detail-main-card">
          {/* Section: Overview */}
          {gig.short_description && gig.short_description.trim() !== '' && gig.short_description !== gig.overview && (
            <div className="learner-card-section">
              <span className="learner-section-eyebrow">Overview</span>
              <p className="learner-lead-paragraph">
                {gig.short_description}
              </p>
            </div>
          )}

          {/* Section: About the Role */}
          <div className="learner-card-section">
            <h2 className="learner-section-heading">About the Role</h2>
            <div className="learner-prose">
              {overviewParagraphs.length > 0 ? (
                overviewParagraphs.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))
              ) : (
                <p>{overviewText}</p>
              )}
            </div>
          </div>

          {/* Section: Responsibilities */}
          {responsibilitiesList.length > 0 && (
            <div className="learner-card-section">
              <h2 className="learner-section-heading">Key Responsibilities</h2>
              <ul className="learner-bullet-list">
                {responsibilitiesList.map((item, index) => (
                  <li key={index} className="learner-bullet-item">
                    <span className="learner-bullet-dot" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Section: Deliverables */}
          {deliverablesList.length > 0 && (
            <div className="learner-card-section">
              <h2 className="learner-section-heading">Project Deliverables</h2>
              <ul className="learner-bullet-list">
                {deliverablesList.map((item, index) => (
                  <li key={index} className="learner-bullet-item">
                    <CheckCircle2 size={15} style={{ color: '#059669', flexShrink: 0, marginTop: '2px' }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Section: Requirements */}
          {requirementsList.length > 0 && (
            <div className="learner-card-section">
              <h2 className="learner-section-heading">Requirements & Qualifications</h2>
              <ul className="learner-bullet-list">
                {requirementsList.map((item, index) => (
                  <li key={index} className="learner-bullet-item">
                    <span className="learner-bullet-dot" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Section: Required Proof-of-Work Spec */}
          {proofSpecText && (
            <div className="learner-card-section learner-proof-section">
              <div className="learner-proof-header">
                <ShieldCheck size={18} style={{ color: '#059669', flexShrink: 0 }} />
                <div>
                  <h3 className="learner-proof-title">
                    Required Proof-of-Work Artifact
                  </h3>
                  <p className="learner-proof-desc">
                    To be considered for this client engagement, prepare and submit your verified proof artifact:
                  </p>
                </div>
              </div>
              <div className="learner-proof-box">
                <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#111827', lineHeight: 1.5 }}>
                  {proofSpecText}
                </p>
              </div>
            </div>
          )}
        </article>

        {/* RIGHT COLUMN: STICKY OPPORTUNITY GATEWAY / APPLY CARD */}
        <aside className="learner-detail-sidebar">
          <div className="learner-sidebar-card">
            {/* Top Compensation Banner */}
            <div className="learner-sidebar-top">
              <span className="learner-sidebar-label">Estimated Compensation</span>
              <div className="learner-sidebar-price">
                {gig.payment_amount && gig.payment_amount.trim() !== '' ? (
                  gig.payment_amount
                ) : (
                  <span style={{ fontSize: '15px', color: '#6B7280', fontWeight: 600 }}>
                    Competitive / Negotiable
                  </span>
                )}
              </div>
              <span className="learner-sidebar-subtext">Verified applied brief</span>
            </div>

            <div className="learner-sidebar-divider" />

            {/* Quick Summary Highlights */}
            <div className="learner-sidebar-highlights">
              <div className="learner-highlight-row">
                <span className="learner-highlight-label">UpShift Track</span>
                <span className="learner-highlight-value">
                  {track ? `${track.code} · ${track.name}` : (gig.track_id || 'UpShift')}
                </span>
              </div>

              <div className="learner-highlight-row">
                <span className="learner-highlight-label">Location</span>
                <span className="learner-highlight-value">Remote (Global)</span>
              </div>

              <div className="learner-highlight-row">
                <span className="learner-highlight-label">Vetting</span>
                <span className="learner-highlight-value" style={{ color: '#059669' }}>
                  ✓ Direct Gateway
                </span>
              </div>
            </div>

            {/* Primary Action Button: Apply Now Gateway */}
            <div style={{ marginTop: '20px' }}>
              <button
                type="button"
                onClick={handleApplyClick}
                className="learner-btn-primary learner-btn-apply-lg"
              >
                <span>Apply Now</span>
                <ArrowRight size={16} />
              </button>
            </div>

            {/* Verification & Safety Pill */}
            <div className="learner-sidebar-trust">
              <ShieldCheck size={14} style={{ color: '#059669', flexShrink: 0 }} />
              <span>Direct application via UpShift Verified Gateway</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
