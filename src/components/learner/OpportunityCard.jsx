import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Store } from 'lucide-react';

export default function OpportunityCard({ gig }) {
  if (!gig) return null;

  const track = gig.track;

  return (
    <div className="learner-card group flex flex-col justify-between p-6 bg-white border border-[#E5E7EB] rounded-2xl shadow-xs hover:shadow-md transition-all duration-200">
      <div>
        {/* Top: Track Code & Name Badge + Local Biz & Featured Indicators */}
        <div className="flex items-center justify-between gap-2 mb-3.5 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            {track ? (
              <span
                className="learner-badge-track inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-md"
                style={{
                  backgroundColor: track.bg_color || 'rgba(227, 27, 35, 0.08)',
                  color: track.color || '#E31B23',
                  border: `1px solid ${track.color ? `${track.color}33` : 'rgba(227, 27, 35, 0.25)'}`,
                }}
              >
                {track.code} · {track.name}
              </span>
            ) : (
              <span className="learner-badge-chip text-xs">UpShift Track</span>
            )}

            {gig.is_local_business && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10.5px] font-bold tracking-tight bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Store className="w-3 h-3 text-emerald-600" />
                <span>Local Business</span>
              </span>
            )}
          </div>

          {gig.is_featured && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide bg-amber-50 text-amber-700 border border-amber-200">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Featured</span>
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-[#111827] tracking-tight leading-snug mb-2 group-hover:text-[#E31B23] transition-colors">
          <Link to={`/learner/gigs/${gig.id}`}>
            {gig.title}
          </Link>
        </h3>

        {/* Short Description */}
        <p className="text-xs text-[#4B5563] leading-relaxed line-clamp-3">
          {gig.short_description}
        </p>
      </div>

      {/* Footer Divider & Bottom Payment + Read More */}
      <div>
        <div className="border-t border-[#E5E7EB] my-3.5" />

        <div className="flex items-center justify-between gap-2">
          {/* Payment Amount */}
          {gig.payment_amount && gig.payment_amount.trim() !== '' ? (
            <span className="text-[15px] font-bold text-[#111827] whitespace-nowrap tracking-tight">
              {gig.payment_amount}
            </span>
          ) : (
            <span className="text-xs text-[#9CA3AF] whitespace-nowrap">
              Payment not specified
            </span>
          )}

          {/* Read More Link */}
          <Link
            to={`/learner/gigs/${gig.id}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#111827] hover:text-[#E31B23] transition-colors"
          >
            <span>Read More</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
