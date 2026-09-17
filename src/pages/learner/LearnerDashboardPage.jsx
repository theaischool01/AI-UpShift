import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { 
  Briefcase, 
  Sparkles, 
  Layers, 
  ChevronLeft, 
  ChevronRight, 
  Loader2, 
  AlertCircle,
  BookOpen
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import OpportunityCard from '../../components/learner/OpportunityCard';
import OpportunityFilters from '../../components/learner/OpportunityFilters';

export default function LearnerDashboardPage() {
  const { enrolledCourses = [], loadingEnrollments } = useOutletContext() || {};

  // Filter & Search states
  const [mode, setMode] = useState('recommended'); // 'recommended' | 'all'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('ALL');
  const [selectedOrigin, setSelectedOrigin] = useState('ALL');
  const [selectedEngagement, setSelectedEngagement] = useState('ALL');

  // Pagination states
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(24);
  const [totalGigs, setTotalGigs] = useState(0);

  // Data states
  const [gigs, setGigs] = useState([]);
  const [loadingGigs, setLoadingGigs] = useState(true);
  const [error, setError] = useState(null);

  // Metadata dropdown options
  const [courses, setCourses] = useState([]);
  const [originSites, setOriginSites] = useState([]);
  const [engagementTypes, setEngagementTypes] = useState([]);

  // Load courses & distinct filters once
  useEffect(() => {
    async function loadMetadata() {
      try {
        const { data: coursesData } = await supabase
          .from('courses')
          .select('id, code, name')
          .order('code', { ascending: true });
        setCourses(coursesData || []);

        const { data: gigsMeta } = await supabase
          .from('gigs')
          .select('origin_site, engagement_type');
        
        if (gigsMeta) {
          const uniqueOrigins = Array.from(new Set(gigsMeta.map(g => g.origin_site).filter(Boolean))).sort();
          setOriginSites(uniqueOrigins);

          const uniqueEngagements = Array.from(new Set(gigsMeta.map(g => g.engagement_type).filter(Boolean))).sort();
          setEngagementTypes(uniqueEngagements);
        }
      } catch (err) {
        console.warn('[LearnerDashboard] Error loading filter metadata:', err);
      }
    }
    loadMetadata();
  }, []);

  // Primary server-side query with relational course join
  const fetchGigs = useCallback(async () => {
    setLoadingGigs(true);
    setError(null);

    try {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = supabase
        .from('gigs')
        .select(`
          id,
          external_gig_id,
          title,
          course_id,
          short_description,
          origin_site,
          organization,
          payment_amount,
          location,
          engagement_type,
          created_at,
          course:courses (
            id,
            code,
            name,
            category,
            color,
            bg_color
          )
        `, { count: 'exact' });

      // 1. Course-Aware Filtering
      if (mode === 'recommended') {
        if (enrolledCourses.length > 0) {
          const enrolledIds = enrolledCourses.map(c => c.id);
          query = query.in('course_id', enrolledIds);
        }
      } else {
        if (selectedCourse !== 'ALL') {
          query = query.eq('course_id', selectedCourse);
        }
      }

      // 2. Search filtering
      const trimmedSearch = searchQuery.trim();
      if (trimmedSearch) {
        query = query.or(`title.ilike.%${trimmedSearch}%,origin_site.ilike.%${trimmedSearch}%,organization.ilike.%${trimmedSearch}%`);
      }

      // 3. Platform & Engagement filters
      if (selectedOrigin !== 'ALL') {
        query = query.eq('origin_site', selectedOrigin);
      }
      if (selectedEngagement !== 'ALL') {
        query = query.eq('engagement_type', selectedEngagement);
      }

      // Order & Paginate
      const { data, count, error: queryErr } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

      if (queryErr) throw queryErr;

      setGigs(data || []);
      setTotalGigs(count || 0);
    } catch (err) {
      console.error('[LearnerDashboard] Fetch opportunities error:', err);
      if (err.code === '42703' || err.code === 'PGRST204' || err.message?.toLowerCase().includes('payment_amount')) {
        setError('Database schema error: payment_amount field unavailable. Please apply the latest database migration.');
      } else {
        setError('Unable to load opportunities. Please try again.');
      }
    } finally {
      setLoadingGigs(false);
    }
  }, [page, pageSize, mode, searchQuery, selectedCourse, selectedOrigin, selectedEngagement, enrolledCourses]);

  useEffect(() => {
    fetchGigs();
  }, [fetchGigs]);

  const handleFilterChange = () => {
    setPage(1);
  };

  const totalPages = Math.ceil(totalGigs / pageSize) || 1;
  const startRow = totalGigs === 0 ? 0 : (page - 1) * pageSize + 1;
  const endRow = Math.min(page * pageSize, totalGigs);

  return (
    <div className="space-y-6">
      {/* Compact Editorial Visual Band with Point-Out Fox Mascot */}
      <div className="learner-editorial-band">
        <div className="learner-editorial-content">
          <div className="flex items-center gap-2 mb-2">
            <span className="learner-badge-track bg-[#FFF1F1] text-[#E31B23] border border-[#FECACA]">
              <Sparkles className="w-3 h-3" />
              <span>Opportunity Board</span>
            </span>
          </div>

          <h1 className="learner-editorial-title">
            Opportunities
          </h1>

          <p className="learner-editorial-desc">
            Discover real AI work aligned with your UpShift track. Apply directly on external originating platforms.
          </p>

          <div className="flex flex-wrap items-center gap-2.5 pt-0.5">
            <div className="learner-editorial-highlight">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E31B23]" />
              <span>Real Work · Real Proof · Real Opportunities</span>
            </div>

            {enrolledCourses.length > 0 && (
              <div className="flex items-center gap-2 text-xs font-semibold text-[#374151] bg-[#F3F4F6] border border-[#E5E7EB] px-3 py-1 rounded-md">
                <span className="text-[#6B7280]">Your Track:</span>
                <span>{enrolledCourses.map(c => `${c.code} · ${c.name}`).join(', ')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Point-Out Fox Visual */}
        <div className="learner-editorial-fox-wrap">
          <img
            src="/assets/mascot/mascot_pointing_cutout.png"
            alt="UpShift fox mascot"
            className="learner-editorial-fox-img"
          />
        </div>
      </div>

      {/* Filter Controls (Tabs, Search, Dropdowns) */}
      <OpportunityFilters
        mode={mode}
        setMode={setMode}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCourse={selectedCourse}
        setSelectedCourse={setSelectedCourse}
        selectedOrigin={selectedOrigin}
        setSelectedOrigin={setSelectedOrigin}
        selectedEngagement={selectedEngagement}
        setSelectedEngagement={setSelectedEngagement}
        courses={courses}
        originSites={originSites}
        engagementTypes={engagementTypes}
        enrolledCourses={enrolledCourses}
        onFilterChange={handleFilterChange}
      />

      {/* Opportunity Grid / Loading / Empty / Error */}
      {loadingGigs ? (
        /* Skeleton Grid Loading State */
        <div className="learner-grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="learner-card p-6 h-64 animate-pulse flex flex-col justify-between bg-white border border-[#E5E7EB]">
              <div className="space-y-3">
                <div className="w-24 h-4 bg-gray-200 rounded" />
                <div className="w-3/4 h-6 bg-gray-200 rounded" />
                <div className="w-1/2 h-3 bg-gray-100 rounded" />
                <div className="space-y-1.5 pt-2">
                  <div className="w-full h-3 bg-gray-100 rounded" />
                  <div className="w-5/6 h-3 bg-gray-100 rounded" />
                </div>
              </div>
              <div className="w-20 h-4 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      ) : error ? (
        /* Error State */
        <div className="learner-card p-12 text-center max-w-md mx-auto bg-white border border-[#E5E7EB]">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#111827]">Unable to load opportunities</h3>
          <p className="text-xs text-[#6B7280] mt-1 mb-4">{error}</p>
          <button
            type="button"
            onClick={fetchGigs}
            className="learner-btn-secondary text-xs"
          >
            Retry Loading
          </button>
        </div>
      ) : gigs.length === 0 ? (
        /* Empty State */
        <div className="learner-card p-16 text-center max-w-lg mx-auto bg-white border border-[#E5E7EB]">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF1F1] border border-[#FECACA] text-[#E31B23] flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-6 h-6" />
          </div>

          {mode === 'recommended' ? (
            <div>
              <h3 className="text-base font-bold text-[#111827]">
                NO OPPORTUNITIES FOR YOUR TRACK YET
              </h3>
              <p className="text-xs text-[#4B5563] mt-2 leading-relaxed max-w-md mx-auto">
                There are currently no opportunities mapped to your enrolled track. Switch to browse opportunities across all flagship tracks.
              </p>
              <button
                type="button"
                onClick={() => {
                  setMode('all');
                  setPage(1);
                }}
                className="learner-btn-primary mt-6"
              >
                Browse All Opportunities
              </button>
            </div>
          ) : (
            <div>
              <h3 className="text-base font-bold text-[#111827]">
                NO OPPORTUNITIES YET
              </h3>
              <p className="text-xs text-[#4B5563] mt-2 leading-relaxed max-w-md mx-auto">
                New opportunities will appear here as the UpShift opportunity board is updated.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {/* Opportunities Cards Grid */}
          <div className="learner-grid">
            {gigs.map((gig) => (
              <OpportunityCard key={gig.id} gig={gig} />
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#4B5563]">
            <div>
              Showing <strong className="text-[#111827]">{startRow}</strong>–<strong className="text-[#111827]">{endRow}</strong> of <strong className="text-[#111827]">{totalGigs}</strong> opportunities
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span>Per page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(1);
                  }}
                  className="px-2.5 py-1 text-xs border border-[#D1D5DB] rounded-lg bg-white text-[#111827] focus:outline-none focus:border-[#E31B23]"
                >
                  <option value={24}>24</option>
                  <option value={48}>48</option>
                  <option value={72}>72</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="p-1.5 rounded-lg border border-[#D1D5DB] bg-white text-[#374151] hover:bg-gray-50 hover:text-[#111827] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  title="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <span className="px-2 font-mono font-semibold text-[#111827]">
                  {page} / {totalPages}
                </span>

                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="p-1.5 rounded-lg border border-[#D1D5DB] bg-white text-[#374151] hover:bg-gray-50 hover:text-[#111827] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  title="Next page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
