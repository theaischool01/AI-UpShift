import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Store, 
  Rocket
} from 'lucide-react';

export default function MockOpportunityCard({ item, type = 'local' }) {
  if (!item) return null;

  const isStartup = type === 'startup';
  const detailUrl = isStartup ? `/startup-businesses/${item.id}` : `/local-businesses/${item.id}`;
  const title = isStartup ? item.startupName : item.businessName;
  const avatarLetter = item.avatar || title.charAt(0).toUpperCase();

  return (
    <div className="local-opportunity-card group">
      <div className="local-opportunity-card__body">
        {/* Top Header: Avatar + Business Name / Location + Category Badge */}
        <div className="local-opportunity-card__header">
          <div className="local-opportunity-card__identity">
            {/* Business Logo or Fallback Initials Avatar */}
            {item.logo ? (
              <div className="opportunity-business-avatar">
                <img 
                  src={item.logo} 
                  alt={`${title} Logo`} 
                />
              </div>
            ) : (
              <div 
                className="opportunity-business-avatar text-sm sm:text-base font-black select-none"
                style={{
                  backgroundColor: item.avatarBg || (isStartup ? '#EFF6FF' : '#FEF2F2'),
                  color: item.avatarColor || (isStartup ? '#2563EB' : '#DC2626'),
                  borderColor: `${item.avatarColor || '#DC2626'}22`
                }}
              >
                {avatarLetter}
              </div>
            )}

            {/* Business / Startup Identity */}
            <div className="min-w-0">
              <h4 className="local-opportunity-card__business">
                <Link to={detailUrl}>
                  {title}
                </Link>
              </h4>

              {isStartup && item.founderName && (
                <div className="text-[11px] text-[#6B7280] truncate mt-0.5 flex items-center gap-1">
                  <span>Founder:</span>
                  <strong className="text-[#374151] font-semibold">{item.founderName}</strong>
                </div>
              )}

              <div className="local-opportunity-card__location">
                {item.location}
              </div>
            </div>
          </div>

          {/* Type Badge */}
          <div className="local-opportunity-card__badge">
            {isStartup ? (
              <>
                <Rocket className="w-3 h-3 text-blue-600" />
                <span className="text-blue-700">Startup</span>
              </>
            ) : (
              <>
                <Store className="w-3 h-3 text-emerald-600" />
                <span>Local Biz</span>
              </>
            )}
          </div>
        </div>

        {/* Opportunity Title */}
        <h3 className="local-opportunity-card__title">
          <Link to={detailUrl}>
            {item.opportunityTitle}
          </Link>
        </h3>

        {/* Short Description */}
        <p className="local-opportunity-card__description">
          {item.shortDescription}
        </p>

        {/* Metadata Row with Structured Chips */}
        <div className="local-opportunity-card__meta">
          {item.category && (
            <span className="local-opportunity-card__chip">
              {item.category}
            </span>
          )}
          {isStartup && item.stage && (
            <span className="local-opportunity-card__chip local-opportunity-card__chip--stage">
              {item.stage}
            </span>
          )}
          {item.workMode && (
            <span className="local-opportunity-card__chip">
              {item.workMode.split('(')[0].trim()}
            </span>
          )}
        </div>
      </div>

      {/* Card Footer: Earnings & View Details CTA */}
      <div className="local-opportunity-card__footer">
        {/* Earnings */}
        <div className="flex flex-col">
          <span className="local-opportunity-card__earning-label">
            {isStartup ? 'Potential Earning' : 'Expected Earning'}
          </span>
          <span className="local-opportunity-card__earning-amount">
            {item.earnings}
          </span>
        </div>

        {/* Action Link */}
        <Link
          to={detailUrl}
          className="local-opportunity-card__action"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
