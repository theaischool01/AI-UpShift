import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building, 
  MapPin, 
  Clock, 
  ArrowRight, 
  Globe, 
  Sparkles 
} from 'lucide-react';

export default function OpportunityCard({ gig }) {
  if (!gig) return null;

  const course = gig.course;

  return (
    <div className="learner-card group">
      <div>
        {/* Top: Track Code & Origin Platform */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          {course ? (
            <span
              className="learner-badge-track"
              style={{
                backgroundColor: course.bg_color || 'rgba(227, 27, 35, 0.1)',
                color: course.color || '#E31B23',
                border: `1px solid ${course.color ? `${course.color}33` : 'rgba(227, 27, 35, 0.25)'}`,
              }}
            >
              {course.code} · {course.name}
            </span>
          ) : (
            <span className="learner-badge-chip">General Track</span>
          )}

          {gig.origin_site && (
            <span className="learner-badge-chip text-[10px] text-[#6B7280]">
              <Globe className="w-3 h-3 text-[#6B7280]" />
              <span>{gig.origin_site}</span>
            </span>
          )}
        </div>

        {/* Title: Dark charcoal #111827, no browser-default blue/purple */}
        <h3 className="learner-card-title">
          <Link to={`/learner/gigs/${gig.id}`}>
            {gig.title}
          </Link>
        </h3>

        {/* Organization / Client */}
        {gig.organization && (
          <div className="learner-card-org">
            <Building className="w-3.5 h-3.5 text-[#9CA3AF] flex-shrink-0" />
            <span className="truncate">{gig.organization}</span>
          </div>
        )}

        {/* Short Description: #4B5563 */}
        <p className="learner-card-desc learner-line-clamp-3">
          {gig.short_description}
        </p>
      </div>

      {/* Footer: Metadata Chips, Payment & Read More CTA */}
      <div className="learner-card-meta">
        {/* Chips & Payment Row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
            {gig.location && (
              <span className="learner-badge-chip">
                <MapPin className="w-3 h-3 text-[#6B7280]" />
                <span>{gig.location}</span>
              </span>
            )}
            {gig.engagement_type && (
              <span className="learner-badge-chip">
                <Clock className="w-3 h-3 text-[#6B7280]" />
                <span>{gig.engagement_type}</span>
              </span>
            )}
          </div>

          {/* Payment Amount */}
          {gig.payment_amount && gig.payment_amount.trim() !== '' ? (
            <span className="text-[14px] font-semibold text-[#111827] whitespace-nowrap tracking-tight">
              {gig.payment_amount}
            </span>
          ) : (
            <span className="text-[11px] text-[#9CA3AF] whitespace-nowrap">
              Payment not specified
            </span>
          )}
        </div>

        {/* Read More Link */}
        <Link
          to={`/learner/gigs/${gig.id}`}
          className="learner-card-readmore"
        >
          <span>Read More</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
