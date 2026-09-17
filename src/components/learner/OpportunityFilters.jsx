import React, { useRef } from 'react';
import { 
  Search, 
  X, 
  Filter, 
  Sparkles, 
  Globe, 
  Layers 
} from 'lucide-react';

export default function OpportunityFilters({
  mode,
  setMode,
  searchQuery,
  setSearchQuery,
  selectedCourse,
  setSelectedCourse,
  selectedOrigin,
  setSelectedOrigin,
  selectedEngagement,
  setSelectedEngagement,
  courses = [],
  originSites = [],
  engagementTypes = [],
  enrolledCourses = [],
  onFilterChange = () => {},
}) {
  const debounceTimerRef = useRef(null);

  const handleSearchInput = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      onFilterChange();
    }, 300);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    onFilterChange();
  };

  return (
    <div className="space-y-4">
      {/* Top Mode Tabs: Recommended vs All */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E5E7EB]">
        <div className="flex items-center gap-1.5 p-1 bg-[#F3F4F6] rounded-xl border border-[#E5E7EB] w-fit">
          <button
            type="button"
            onClick={() => {
              setMode('recommended');
              onFilterChange();
            }}
            className={`learner-tab-btn ${mode === 'recommended' ? 'active' : ''}`}
          >
            <Sparkles className="w-4 h-4 text-[#E31B23]" />
            <span>Recommended for You</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMode('all');
              onFilterChange();
            }}
            className={`learner-tab-btn ${mode === 'all' ? 'active' : ''}`}
          >
            <Layers className="w-4 h-4 text-[#6B7280]" />
            <span>All Opportunities</span>
          </button>
        </div>

        {/* Informative track note when in recommended mode */}
        {mode === 'recommended' && enrolledCourses.length > 0 && (
          <div className="text-xs text-[#6B7280] flex items-center gap-1.5">
            <span>Filtered for:</span>
            <strong className="text-[#111827] font-semibold">
              {enrolledCourses.map(c => `${c.code} · ${c.name}`).join(', ')}
            </strong>
          </div>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search Input */}
        <div className="learner-search-wrap">
          <Search className="learner-search-icon" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchInput}
            placeholder="Search opportunities by title, origin site, or client..."
            className="learner-search-input"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#111827]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Track Filter */}
          {mode === 'all' && (
            <select
              value={selectedCourse}
              onChange={(e) => {
                setSelectedCourse(e.target.value);
                onFilterChange();
              }}
              className="learner-select-filter"
            >
              <option value="ALL">All Curriculum Tracks</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} — {c.name}
                </option>
              ))}
            </select>
          )}

          {/* Origin Platform Filter */}
          {originSites.length > 0 && (
            <select
              value={selectedOrigin}
              onChange={(e) => {
                setSelectedOrigin(e.target.value);
                onFilterChange();
              }}
              className="learner-select-filter"
            >
              <option value="ALL">All Platforms</option>
              {originSites.map((site) => (
                <option key={site} value={site}>
                  {site}
                </option>
              ))}
            </select>
          )}

          {/* Engagement Type Filter */}
          {engagementTypes.length > 0 && (
            <select
              value={selectedEngagement}
              onChange={(e) => {
                setSelectedEngagement(e.target.value);
                onFilterChange();
              }}
              className="learner-select-filter"
            >
              <option value="ALL">All Engagements</option>
              {engagementTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>
    </div>
  );
}
