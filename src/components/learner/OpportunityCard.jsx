import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function OpportunityCard({ gig }) {
  if (!gig) return null;

  const track = gig.track;

  return (
    <div className="gig-card group">
      <div className="gig-card__body">
        {/* Top: Module Badge + Featured Indicator */}
        <div className="gig-card__top">
          {track ? (
            <span
              className="gig-card__module"
              style={{
                backgroundColor: track.bg_color || 'rgba(227, 27, 35, 0.08)',
                color: track.color || '#E31B23',
                border: `1px solid ${track.color ? `${track.color}33` : 'rgba(227, 27, 35, 0.25)'}`,
              }}
            >
              {track.code} · {track.name}
            </span>
          ) : (
            <span className="gig-card__module bg-gray-100 text-gray-700 border border-gray-200">
              UpShift Track
            </span>
          )}

          {gig.is_featured && (
            <span className="gig-card__featured">
              <Sparkles />
              <span>Featured</span>
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="gig-card__title">
          <Link to={`/learner/gigs/${gig.id}`}>
            {gig.title}
          </Link>
        </h3>

        {/* Short Description */}
        <p className="gig-card__description">
          {gig.short_description}
        </p>
      </div>

      {/* Footer: Pay & Read More CTA */}
      <div className="gig-card__footer">
        {gig.payment_amount && gig.payment_amount.trim() !== '' ? (
          <span className="gig-card__pay">
            {gig.payment_amount}
          </span>
        ) : (
          <span className="gig-card__pay--empty">
            Payment not specified
          </span>
        )}

        <Link
          to={`/learner/gigs/${gig.id}`}
          className="gig-card__read-more"
        >
          <span>Read More</span>
          <ArrowRight />
        </Link>
      </div>
    </div>
  );
}
