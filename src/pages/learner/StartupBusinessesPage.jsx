import React, { useState, useMemo } from 'react';
import { 
  Rocket, 
  Search, 
  X,
  Building2
} from 'lucide-react';
import { startupOpportunities } from '../../data/startupOpportunities';
import MockOpportunityCard from '../../components/learner/MockOpportunityCard';

export default function StartupBusinessesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('ALL');
  const [selectedIndustry, setSelectedIndustry] = useState('ALL');
  const [selectedEngagement, setSelectedEngagement] = useState('ALL');
  const [selectedEarningRange, setSelectedEarningRange] = useState('ALL');

  // Extract unique filter options
  const locations = useMemo(() => {
    const locSet = new Set(startupOpportunities.map(s => s.location.split('/')[0].trim()));
    return ['ALL', ...Array.from(locSet).sort()];
  }, []);

  const industries = useMemo(() => {
    const indSet = new Set(startupOpportunities.map(s => s.category || s.industry));
    return ['ALL', ...Array.from(indSet).sort()];
  }, []);

  const engagementTypes = useMemo(() => {
    const engSet = new Set(startupOpportunities.map(s => s.engagementType));
    return ['ALL', ...Array.from(engSet).sort()];
  }, []);

  // Filtered dataset
  const filteredOpportunities = useMemo(() => {
    return startupOpportunities.filter(item => {
      // 1. Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchName = item.startupName.toLowerCase().includes(query);
        const matchLocation = item.location.toLowerCase().includes(query);
        const matchIndustry = item.industry.toLowerCase().includes(query);
        const matchCategory = item.category?.toLowerCase().includes(query);
        const matchTitle = item.opportunityTitle.toLowerCase().includes(query);
        const matchDesc = item.shortDescription.toLowerCase().includes(query);
        const matchFounder = item.founderName?.toLowerCase().includes(query);

        if (!matchName && !matchLocation && !matchIndustry && !matchCategory && !matchTitle && !matchDesc && !matchFounder) {
          return false;
        }
      }

      // 2. Location filter
      if (selectedLocation !== 'ALL' && !item.location.toLowerCase().includes(selectedLocation.toLowerCase())) {
        return false;
      }

      // 3. Industry filter
      if (selectedIndustry !== 'ALL' && (item.category !== selectedIndustry && item.industry !== selectedIndustry)) {
        return false;
      }

      // 4. Engagement filter
      if (selectedEngagement !== 'ALL' && item.engagementType !== selectedEngagement) {
        return false;
      }

      // 5. Earning range filter
      if (selectedEarningRange === 'UNDER_20K' && item.minEarning > 20000) {
        return false;
      }
      if (selectedEarningRange === '20K_TO_30K' && (item.maxEarning < 20000 || item.minEarning > 30000)) {
        return false;
      }
      if (selectedEarningRange === 'ABOVE_30K' && item.maxEarning < 30000) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedLocation, selectedIndustry, selectedEngagement, selectedEarningRange]);

  const hasActiveFilters = searchQuery !== '' || selectedLocation !== 'ALL' || selectedIndustry !== 'ALL' || selectedEngagement !== 'ALL' || selectedEarningRange !== 'ALL';

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedLocation('ALL');
    setSelectedIndustry('ALL');
    setSelectedEngagement('ALL');
    setSelectedEarningRange('ALL');
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome Card */}
      <div className="learner-page-intro">
        <div>
          <div className="learner-page-eyebrow" style={{ color: '#2563EB' }}>
            <Rocket className="w-3.5 h-3.5 text-blue-600" />
            <span>Venture-Backed & Early Stage Startups</span>
          </div>
          <h1 className="learner-page-title">
            Startup Businesses Opportunity Board
          </h1>
          <p className="learner-page-desc">
            Collaborate directly with high-growth Indian technology startups on AI workflows, frontend sandboxes, IoT pipelines, and product prototyping.
          </p>
        </div>

        <div className="learner-page-stat">
          <Building2 className="w-4 h-4 text-blue-600" />
          <span><strong>{startupOpportunities.length}</strong> Active {startupOpportunities.length === 1 ? 'Startup Project' : 'Startup Projects'}</span>
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
              placeholder="Search startup name, tech stack, or founder..."
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

          {/* Industry Dropdown */}
          <select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="learner-select-box"
          >
            <option value="ALL">All Categories</option>
            {industries.filter(ind => ind !== 'ALL').map(ind => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>

          {/* Engagement Type Dropdown */}
          <select
            value={selectedEngagement}
            onChange={(e) => setSelectedEngagement(e.target.value)}
            className="learner-select-box"
          >
            <option value="ALL">All Engagements</option>
            {engagementTypes.filter(eng => eng !== 'ALL').map(eng => (
              <option key={eng} value={eng}>{eng}</option>
            ))}
          </select>

          {/* Earning Range Dropdown */}
          <select
            value={selectedEarningRange}
            onChange={(e) => setSelectedEarningRange(e.target.value)}
            className="learner-select-box"
          >
            <option value="ALL">Any Compensation</option>
            <option value="UNDER_20K">Under ₹20,000</option>
            <option value="20K_TO_30K">₹20,000 – ₹30,000</option>
            <option value="ABOVE_30K">₹30,000+</option>
          </select>
        </div>

        {/* Results Counter & Active Filters Summary */}
        <div className="learner-results-strip">
          <div>
            Showing <strong className="text-[#111827] font-bold">{filteredOpportunities.length}</strong> of <strong className="text-[#111827] font-bold">{startupOpportunities.length}</strong> startup opportunities
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

      {/* Grid of Startup Opportunities */}
      {filteredOpportunities.length === 0 ? (
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mx-auto mb-3">
            <Rocket className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-gray-900 mb-1">
            No Startup Opportunities Found
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto mb-4">
            No startup briefs match your selected industry or compensation filters. Try resetting your search criteria.
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
          {filteredOpportunities.map((startup) => (
            <MockOpportunityCard
              key={startup.id}
              item={startup}
              type="startup"
            />
          ))}
        </div>
      )}
    </div>
  );
}
