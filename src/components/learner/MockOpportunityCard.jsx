import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  MapPin, 
  Store, 
  Rocket, 
  UserCheck, 
  Building2,
  Sparkles
} from 'lucide-react';

export default function MockOpportunityCard({ item, type = 'local' }) {
  if (!item) return null;

  const isStartup = type === 'startup';
  const detailUrl = isStartup ? `/startup-businesses/${item.id}` : `/local-businesses/${item.id}`;
  const title = isStartup ? item.startupName : item.businessName;
  const avatarLetter = item.avatar || title.charAt(0).toUpperCase();

  return (
    <div className="learner-card group flex flex-col justify-between p-4 sm:p-6 bg-white border border-[#E5E7EB] rounded-xl sm:rounded-2xl shadow-xs hover:shadow-md transition-all duration-200">
      <div>
        {/* Top Header: Avatar + Business Name / Location + Category Badge */}
        <div className="flex items-start justify-between gap-2.5 mb-3.5">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            {/* Elegant Initials Avatar */}
            <div 
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center text-sm sm:text-base font-black flex-shrink-0 shadow-2xs select-none border"
              style={{
                backgroundColor: item.avatarBg || (isStartup ? '#EFF6FF' : '#FEF2F2'),
                color: item.avatarColor || (isStartup ? '#2563EB' : '#DC2626'),
                borderColor: `${item.avatarColor || '#DC2626'}22`
              }}
            >
              {avatarLetter}
            </div>

            {/* Business / Startup Identity */}
            <div className="min-w-0">
              <h4 className="text-[13.5px] sm:text-sm font-bold text-[#111827] truncate leading-tight group-hover:text-[#E31B23] transition-colors">
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

              <div className="flex items-center gap-1 text-[11px] text-[#6B7280] mt-0.5">
                <MapPin className="w-3 h-3 text-[#9CA3AF] flex-shrink-0" />
                <span className="truncate">{item.location}</span>
              </div>
            </div>
          </div>

          {/* Type Badge */}
          <div className="flex-shrink-0">
            {isStartup ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold tracking-tight bg-blue-50 text-blue-700 border border-blue-200">
                <Rocket className="w-3 h-3 text-blue-600" />
                <span>Startup</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold tracking-tight bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Store className="w-3 h-3 text-emerald-600" />
                <span>Local Biz</span>
              </span>
            )}
          </div>
        </div>

        {/* Opportunity Title */}
        <h3 className="text-base sm:text-[17px] font-extrabold text-[#111827] tracking-tight leading-snug mb-2 group-hover:text-[#E31B23] transition-colors line-clamp-2">
          <Link to={detailUrl}>
            {item.opportunityTitle}
          </Link>
        </h3>

        {/* Short Description */}
        <p className="text-xs text-[#4B5563] leading-relaxed line-clamp-3 mb-3">
          {item.shortDescription}
        </p>

        {/* Tags / Badges */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          {item.category && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10.5px] font-medium bg-[#F3F4F6] text-[#374151] border border-[#E5E7EB]">
              {item.category}
            </span>
          )}
          {isStartup && item.stage && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10.5px] font-medium bg-purple-50 text-purple-700 border border-purple-200">
              {item.stage}
            </span>
          )}
          {item.workMode && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10.5px] font-medium bg-[#F9FAFB] text-[#6B7280] border border-[#E5E7EB]">
              {item.workMode.split('(')[0].trim()}
            </span>
          )}
        </div>
      </div>

      {/* Card Footer: Earnings & Read More Link */}
      <div>
        <div className="border-t border-[#E5E7EB] my-3.5" />

        <div className="flex items-center justify-between gap-2">
          {/* Earnings */}
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#9CA3AF]">
              {isStartup ? 'Potential Earning' : 'Expected Earning'}
            </span>
            <span className="text-[15px] font-extrabold text-[#111827] tracking-tight whitespace-nowrap">
              {item.earnings}
            </span>
          </div>

          {/* Action Link */}
          <Link
            to={detailUrl}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#111827] group-hover:text-[#E31B23] transition-colors py-1.5 px-2.5 rounded-lg hover:bg-red-50"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
