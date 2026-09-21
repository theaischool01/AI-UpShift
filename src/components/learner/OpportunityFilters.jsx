import React, { useRef } from 'react';
import { 
  Search, 
  X, 
  Layers,
  ArrowUpDown,
  Sparkles
} from 'lucide-react';

export default function OpportunityFilters({
  searchQuery,
  setSearchQuery,
  selectedTrack,
  setSelectedTrack,
  sortBy = 'priority',
  setSortBy = () => {},
  tracks = [],
  onFilterChange = () => {},
}) {
  const debounceTimerRef = useRef(null);
  const activeSelectedTrack = selectedTrack || 'ALL';
  const handleSelectTrack = setSelectedTrack || (() => {});
  const availableTracks = tracks;

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
    <div className="space-y-3">
      {/* Filter, Search & Sort Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search Input */}
        <div className="learner-search-wrap flex-1">
          <Search className="learner-search-icon" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchInput}
            placeholder="Search opportunities by title or description..."
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

        {/* Controls Group: Track Module Filter + Marketplace Sort */}
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          {/* Module / Capability Area Filter */}
          <div className="flex-1 sm:flex-none sm:min-w-[210px]">
            <select
              value={activeSelectedTrack}
              onChange={(e) => {
                handleSelectTrack(e.target.value);
                onFilterChange();
              }}
              className="learner-select-filter w-full"
              aria-label="Filter by UpShift Module"
            >
              <option value="ALL">All Modules (M1–M6)</option>
              {availableTracks.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.code} — {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Marketplace Sort Selector */}
          <div className="flex-1 sm:flex-none sm:min-w-[190px]">
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                onFilterChange();
              }}
              className="learner-select-filter w-full font-medium"
              aria-label="Sort marketplace opportunities"
            >
              <option value="priority">Priority (Featured)</option>
              <option value="newest">Newest Posted</option>
              <option value="pay">Most Pay</option>
              <option value="trending">Trending</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
