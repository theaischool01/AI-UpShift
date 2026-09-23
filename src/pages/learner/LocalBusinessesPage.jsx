import React, { useState, useMemo } from 'react';
import { 
  Store, 
  Search, 
  X,
  Building
} from 'lucide-react';
import { localBusinessOpportunities } from '../../data/localBusinessOpportunities';
import MockOpportunityCard from '../../components/learner/MockOpportunityCard';

export default function LocalBusinessesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedEarningRange, setSelectedEarningRange] = useState('ALL');

  // Extract unique filter options
  const locations = useMemo(() => {
    const locSet = new Set(localBusinessOpportunities.map(b => b.location));
    return ['ALL', ...Array.from(locSet).sort()];
  }, []);

  const categories = useMemo(() => {
    const catSet = new Set(localBusinessOpportunities.map(b => b.category));
    return ['ALL', ...Array.from(catSet).sort()];
  }, []);

  // Filtered dataset
  const filteredOpportunities = useMemo(() => {
    return localBusinessOpportunities.filter(item => {
      // 1. Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchName = item.businessName.toLowerCase().includes(query);
        const matchLocation = item.location.toLowerCase().includes(query);
        const matchCategory = item.category.toLowerCase().includes(query);
        const matchTitle = item.opportunityTitle.toLowerCase().includes(query);
        const matchDesc = item.shortDescription.toLowerCase().includes(query);
        const matchOwner = item.ownerName?.toLowerCase().includes(query);

        if (!matchName && !matchLocation && !matchCategory && !matchTitle && !matchDesc && !matchOwner) {
          return false;
        }
      }

      // 2. Location filter
      if (selectedLocation !== 'ALL' && item.location !== selectedLocation) {
        return false;
      }

      // 3. Category filter
      if (selectedCategory !== 'ALL' && item.category !== selectedCategory) {
        return false;
      }

      // 4. Earning range filter
      if (selectedEarningRange === 'UNDER_10K' && item.minEarning > 10000) {
        return false;
      }
      if (selectedEarningRange === '10K_TO_18K' && (item.maxEarning < 10000 || item.minEarning > 18000)) {
        return false;
      }
      if (selectedEarningRange === 'ABOVE_18K' && item.maxEarning < 18000) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedLocation, selectedCategory, selectedEarningRange]);

  const hasActiveFilters = searchQuery !== '' || selectedLocation !== 'ALL' || selectedCategory !== 'ALL' || selectedEarningRange !== 'ALL';

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedLocation('ALL');
    setSelectedCategory('ALL');
    setSelectedEarningRange('ALL');
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome Card */}
      <div className="learner-page-intro">
        <div>
          <div className="learner-page-eyebrow">
            <Store className="w-3.5 h-3.5" />
            <span>Hyperlocal Commercial Opportunities</span>
          </div>
          <h1 className="learner-page-title">
            Local Businesses Opportunity Board
          </h1>
          <p className="learner-page-desc">
            Help regional Indian merchants, boutique studios, and family enterprises digitize workflows, launch marketing assets, and optimize local customer discovery.
          </p>
        </div>

        <div className="learner-page-stat">
          <Building className="w-4 h-4 text-emerald-600" />
          <span><strong>{localBusinessOpportunities.length}</strong> Available {localBusinessOpportunities.length === 1 ? 'Opportunity' : 'Opportunities'}</span>
        </div>
      </div>

      {/* Unified Compact Toolbar: Search & Filters */}
      <div className="learner-toolbar">
        <div className="learner-toolbar-controls">
          {/* Search Input */}
          <div className="learner-search-wrap">
            <Search className="learner-search-icon" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by business name, skill, or location..."
              className="learner-search-input"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 bg-transparent border-0 cursor-pointer flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Location Dropdown */}
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="learner-select-box"
          >
            <option value="ALL">All Locations</option>
            {locations.filter(loc => loc !== 'ALL').map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="learner-select-box"
          >
            <option value="ALL">All Categories</option>
            {categories.filter(cat => cat !== 'ALL').map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Earning Range Dropdown */}
          <select
            value={selectedEarningRange}
            onChange={(e) => setSelectedEarningRange(e.target.value)}
            className="learner-select-box"
          >
            <option value="ALL">Any Compensation</option>
            <option value="UNDER_10K">Under ₹10,000</option>
            <option value="10K_TO_18K">₹10,000 – ₹18,000</option>
            <option value="ABOVE_18K">₹18,000+</option>
          </select>
        </div>

        {/* Results Counter & Active Filters Summary */}
        <div className="learner-results-strip">
          <div>
            Showing <strong className="text-[#111827] font-bold">{filteredOpportunities.length}</strong> of <strong className="text-[#111827] font-bold">{localBusinessOpportunities.length}</strong> local opportunities
          </div>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#E31B23] hover:underline cursor-pointer bg-transparent border-0 p-0"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear all filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid of Local Business Opportunities */}
      {filteredOpportunities.length === 0 ? (
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mx-auto mb-3">
            <Store className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-gray-900 mb-1">
            No Local Business Opportunities Found
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto mb-4">
            No opportunities match your selected location, category, or search criteria. Try broadening your filter selection.
          </p>
          <button
            onClick={resetFilters}
            className="learner-btn-primary inline-flex items-center gap-1.5 text-xs"
          >
            <span>Reset Filters</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredOpportunities.map((business) => (
            <MockOpportunityCard
              key={business.id}
              item={business}
              type="local"
            />
          ))}
        </div>
      )}
    </div>
  );
}
