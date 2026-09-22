import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Briefcase, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Loader2, 
  AlertCircle
} from 'lucide-react';
import { fetchGigs as fetchGigsService, fetchTracks as fetchTracksService } from '../../services/gigService';
import OpportunityCard from '../../components/learner/OpportunityCard';
import OpportunityFilters from '../../components/learner/OpportunityFilters';
import OpportunityCategoryNav from '../../components/learner/OpportunityCategoryNav';

export default function LearnerDashboardPage() {
  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrack, setSelectedTrack] = useState('ALL');
  const [sortBy, setSortBy] = useState('priority');

  // Pagination states
  const [page, setPage] = useState(1);
  const [pageSize] = useState(24);
  const [totalGigs, setTotalGigs] = useState(0);

  // Data states
  const [gigs, setGigs] = useState([]);
  const [loadingGigs, setLoadingGigs] = useState(true);
  const [error, setError] = useState(null);

  // Tracks dropdown options
  const [tracks, setTracks] = useState([]);

  // Load tracks for filter dropdown
  useEffect(() => {
    async function loadTracks() {
      const { data, error } = await fetchTracksService();
      if (!error && data) {
        setTracks(data);
      }
    }
    loadTracks();
  }, []);

  // Primary server-side query with relational track join
  const fetchGigs = useCallback(async () => {
    setLoadingGigs(true);
    setError(null);

    const { data, count, error: queryErr } = await fetchGigsService({
      page,
      pageSize,
      search: searchQuery,
      trackId: selectedTrack,
      isActive: true,
      sortBy,
    });

    if (queryErr) {
      console.error('[LearnerDashboard] Error fetching gigs:', queryErr);
      setError('Unable to load commercial opportunities. Please refresh the page.');
    } else {
      setGigs(data || []);
      setTotalGigs(count || 0);
    }
    setLoadingGigs(false);
  }, [searchQuery, selectedTrack, sortBy, page, pageSize]);

  useEffect(() => {
    fetchGigs();
  }, [fetchGigs]);

  // Compute dynamic category counts from dataset
  const categoryCounts = useMemo(() => {
    if (!gigs || gigs.length === 0) {
      return { priority: 0, newest: 0, pay: 0, trending: 0 };
    }

    const getCompVal = (g) => {
      if (g.max_amount !== null && g.max_amount !== undefined && Number(g.max_amount) > 0) return Number(g.max_amount);
      if (g.min_amount !== null && g.min_amount !== undefined && Number(g.min_amount) > 0) return Number(g.min_amount);
      if (g.payment_amount && typeof g.payment_amount === 'string') {
        const match = g.payment_amount.replace(/,/g, '').match(/(\d+(?:\.\d+)?)/);
        if (match) return parseFloat(match[1]);
      }
      return 0;
    };

    // 1. Priority count
    const priorityGigs = gigs.filter(g => g.is_featured || (Number(g.priority) > 0));
    const priorityCount = priorityGigs.length > 0 ? priorityGigs.length : gigs.length;

    // 2. New posted count
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const recentGigs = gigs.filter(g => {
      const d = new Date(g.posted_at || g.created_at).getTime();
      return !isNaN(d) && d >= thirtyDaysAgo;
    });
    const newestCount = recentGigs.length > 0 ? recentGigs.length : gigs.length;

    // 3. Most Pay count
    const paidGigs = gigs.filter(g => getCompVal(g) > 0);
    const payCount = paidGigs.length > 0 ? paidGigs.length : gigs.length;

    // 4. Trending count
    const trendingGigs = gigs.filter(g => g.is_featured || (Number(g.priority) >= 1));
    const trendingCount = trendingGigs.length > 0 ? trendingGigs.length : Math.max(1, Math.ceil(gigs.length * 0.7));

    // 5. Local Businesses count
    const localBizGigs = gigs.filter(g => Boolean(g.is_local_business));
    const localBusinessCount = localBizGigs.length;

    return {
      priority: priorityCount,
      newest: newestCount,
      pay: payCount,
      trending: trendingCount,
      local_business: localBusinessCount,
    };
  }, [gigs]);

  const totalPages = Math.max(1, Math.ceil(totalGigs / pageSize));

  return (
    <div className="space-y-6">
      {/* Top Welcome Card */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-[#E31B23] text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>UpShift Applied Opportunities</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight m-0">
              Commercial Opportunity Board
            </h1>
            <p className="text-xs sm:text-sm text-[#6B7280] mt-1 max-w-2xl">
              Explore and apply for vetted freelance, contract, and commercial briefs across UpShift specialization modules.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] self-start md:self-auto text-xs font-mono text-[#4B5563]">
            <Briefcase className="w-4 h-4 text-[#E31B23]" />
            <span><strong>{totalGigs}</strong> Active {totalGigs === 1 ? 'Brief' : 'Briefs'}</span>
          </div>
        </div>
      </div>

      {/* Unified Opportunity Marketplace Control Bar */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 sm:p-5 shadow-xs space-y-3.5">
        <OpportunityFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedTrack={selectedTrack}
          setSelectedTrack={setSelectedTrack}
          sortBy={sortBy}
          setSortBy={setSortBy}
          tracks={tracks}
          onFilterChange={() => setPage(1)}
        />

        {/* Quick Discovery Chips / Tabs */}
        <div className="pt-2 border-t border-[#F3F4F6] space-y-2">
          <div className="text-[11px] font-mono font-bold tracking-wider text-[#6B7280] uppercase">
            QUICK DISCOVERY
          </div>
          <OpportunityCategoryNav
            sortBy={sortBy}
            onSelectSort={(newSort) => {
              setSortBy(newSort);
              setPage(1);
            }}
            counts={categoryCounts}
          />
        </div>

        {/* Result Counter Summary */}
        <div className="pt-1.5 border-t border-[#F3F4F6] flex items-center justify-between text-xs sm:text-[13px] text-[#6B7280] font-medium">
          <span>
            Showing <strong className="text-[#111827] font-bold">{gigs.length}</strong> of <strong className="text-[#111827] font-bold">{totalGigs}</strong> {totalGigs === 1 ? 'opportunity' : 'opportunities'}
          </span>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div role="alert" className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#E31B23] flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchGigs}
            className="px-3 py-1 rounded-md bg-white border border-red-200 text-xs font-semibold text-red-900 hover:bg-red-50"
          >
            Retry
          </button>
        </div>
      )}

      {/* Opportunity Grid */}
      {loadingGigs ? (
        <div className="p-16 flex flex-col items-center justify-center gap-3 text-gray-500">
          <Loader2 className="w-7 h-7 animate-spin text-[#E31B23]" />
          <span className="text-xs sm:text-sm font-medium">Loading opportunities...</span>
        </div>
      ) : gigs.length === 0 ? (
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mx-auto mb-3">
            <Briefcase className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-gray-900 mb-1">
            No Opportunities Found
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto mb-4">
            No opportunities match your search criteria. Try clearing your search query or module filter.
          </p>
          {(searchQuery || selectedTrack !== 'ALL') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedTrack('ALL');
                setPage(1);
              }}
              className="learner-btn-primary inline-flex items-center gap-1.5"
            >
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {gigs.map((gig) => (
              <OpportunityCard key={gig.id} gig={gig} />
            ))}
          </div>

          {/* Pagination Footer */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-[#E5E7EB]">
              <span className="text-xs font-mono text-gray-500">
                Showing {((page - 1) * pageSize) + 1}–{Math.min(page * pageSize, totalGigs)} of {totalGigs} opportunities
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg border border-[#E5E7EB] bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none"
                  aria-label="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <span className="text-xs font-medium text-gray-700 px-2">
                  Page {page} of {totalPages}
                </span>

                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-lg border border-[#E5E7EB] bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none"
                  aria-label="Next Page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
