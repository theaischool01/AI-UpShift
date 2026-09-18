import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  Briefcase, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Loader2, 
  AlertCircle
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import OpportunityCard from '../../components/learner/OpportunityCard';
import OpportunityFilters from '../../components/learner/OpportunityFilters';

export default function LearnerDashboardPage() {
  const context = useOutletContext() || {};
  const assignedTrack = context.assignedTrack || context.enrolledCourses?.[0] || null;

  // Filter & Search states
  const [mode, setMode] = useState('recommended'); // 'recommended' | 'all'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrack, setSelectedTrack] = useState('ALL');

  // Pagination states
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(24);
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
      try {
        let { data: tracksData, error } = await supabase
          .from('tracks')
          .select('id, code, name')
          .order('code', { ascending: true });

        if (error) {
          const fallbackRes = await supabase
            .from('courses')
            .select('id, code, name')
            .order('code', { ascending: true });
          if (fallbackRes.error) throw error;
          tracksData = fallbackRes.data;
        }

        setTracks(tracksData || []);
      } catch (err) {
        console.warn('[LearnerDashboard] Error loading tracks:', err);
      }
    }
    loadTracks();
  }, []);

  // Primary server-side query with relational track join and resilient fallback
  const fetchGigs = useCallback(async () => {
    setLoadingGigs(true);
    setError(null);

    try {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      // 1. Primary Relational Query with tracks
      let query = supabase
        .from('gigs')
        .select(`
          id,
          external_gig_id,
          title,
          track_id,
          short_description,
          payment_amount,
          origin_url,
          created_at,
          track:tracks (
            id,
            code,
            name,
            category,
            color,
            bg_color
          )
        `, { count: 'exact' });

      // Track-Aware Filtering
      if (mode === 'recommended') {
        if (assignedTrack?.id) {
          const targetIds = [
            assignedTrack.id,
            assignedTrack.id?.toLowerCase(),
            assignedTrack.code,
            assignedTrack.code?.toLowerCase(),
            assignedTrack.code?.toUpperCase()
          ].filter(Boolean);
          query = query.in('track_id', Array.from(new Set(targetIds)));
        }
      } else {
        if (selectedTrack !== 'ALL') {
          const matchedTrackObj = tracks.find(t => t.id === selectedTrack || t.code === selectedTrack);
          const matchIds = [
            selectedTrack,
            selectedTrack.toLowerCase(),
            matchedTrackObj?.id,
            matchedTrackObj?.code,
            matchedTrackObj?.code?.toLowerCase(),
            matchedTrackObj?.code?.toUpperCase()
          ].filter(Boolean);
          query = query.in('track_id', Array.from(new Set(matchIds)));
        }
      }

      // Search filtering
      const trimmedSearch = searchQuery.trim();
      if (trimmedSearch) {
        query = query.or(`title.ilike.%${trimmedSearch}%,short_description.ilike.%${trimmedSearch}%`);
      }

      // Order & Paginate
      let { data, count, error: queryErr } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

      if (queryErr) {
        console.warn('[LearnerDashboard] Relational tracks query failed, trying legacy courses fallback:', queryErr.message || queryErr);
        
        let legacyRelQuery = supabase
          .from('gigs')
          .select(`
            id,
            external_gig_id,
            title,
            course_id,
            short_description,
            payment_amount,
            origin_url,
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

        if (mode === 'recommended') {
          if (assignedTrack?.id) {
            const targetIds = [
              assignedTrack.id,
              assignedTrack.id?.toLowerCase(),
              assignedTrack.code,
              assignedTrack.code?.toLowerCase(),
              assignedTrack.code?.toUpperCase()
            ].filter(Boolean);
            legacyRelQuery = legacyRelQuery.in('course_id', Array.from(new Set(targetIds)));
          }
        } else {
          if (selectedTrack !== 'ALL') {
            const matchedTrackObj = tracks.find(t => t.id === selectedTrack || t.code === selectedTrack);
            const matchIds = [
              selectedTrack,
              selectedTrack.toLowerCase(),
              matchedTrackObj?.id,
              matchedTrackObj?.code,
              matchedTrackObj?.code?.toLowerCase(),
              matchedTrackObj?.code?.toUpperCase()
            ].filter(Boolean);
            legacyRelQuery = legacyRelQuery.in('course_id', Array.from(new Set(matchIds)));
          }
        }

        if (trimmedSearch) {
          legacyRelQuery = legacyRelQuery.or(`title.ilike.%${trimmedSearch}%,short_description.ilike.%${trimmedSearch}%`);
        }

        const legacyRelRes = await legacyRelQuery
          .order('created_at', { ascending: false })
          .range(from, to);

        if (!legacyRelRes.error && legacyRelRes.data) {
          data = legacyRelRes.data.map(g => ({
            ...g,
            track_id: g.course_id,
            track: g.course
          }));
          count = legacyRelRes.count;
          queryErr = null;
        } else {
          console.warn('[LearnerDashboard] Relational legacy query failed, attempting flat query:', legacyRelRes.error?.message || legacyRelRes.error);
          
          let flatQuery = supabase
            .from('gigs')
            .select(`
              id,
              external_gig_id,
              title,
              short_description,
              payment_amount,
              origin_url,
              created_at
            `, { count: 'exact' });

          if (trimmedSearch) {
            flatQuery = flatQuery.or(`title.ilike.%${trimmedSearch}%,short_description.ilike.%${trimmedSearch}%`);
          }

          const flatRes = await flatQuery
            .order('created_at', { ascending: false })
            .range(from, to);

          if (flatRes.error) {
            console.error('[LearnerDashboard] Flat query error:', flatRes.error);
            throw flatRes.error;
          }

          data = (flatRes.data || []).map(g => {
            const trackMatch = tracks.find(t => t.id === g.track_id || t.id === g.course_id);
            return {
              ...g,
              track: trackMatch || null
            };
          });
          count = flatCount || data.length;
        }
      }

      setGigs(data || []);
      setTotalGigs(count || 0);
    } catch (err) {
      console.error('[LearnerDashboard] Error fetching gigs:', err);
      setError('Unable to load commercial opportunities. Please refresh the page.');
    } finally {
      setLoadingGigs(false);
    }
  }, [mode, searchQuery, selectedTrack, page, pageSize, assignedTrack]);

  useEffect(() => {
    fetchGigs();
  }, [fetchGigs]);

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
              {assignedTrack ? (
                <>
                  You are assigned to the <strong>{assignedTrack.code} · {assignedTrack.name}</strong> track. Build and apply for vetted freelance and contract briefs.
                </>
              ) : (
                'Explore and apply for vetted freelance and contract briefs across UpShift tracks.'
              )}
            </p>
          </div>

          {assignedTrack && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] self-start md:self-auto">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm"
                style={{
                  backgroundColor: assignedTrack.bg_color || 'rgba(227, 27, 35, 0.1)',
                  color: assignedTrack.color || '#E31B23',
                }}
              >
                {assignedTrack.code}
              </div>
              <div className="text-left">
                <span className="text-[11px] font-mono text-[#6B7280] uppercase tracking-wider block">
                  Assigned Track
                </span>
                <span className="text-sm font-bold text-[#111827]">
                  {assignedTrack.name}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 sm:p-6 shadow-xs">
        <OpportunityFilters
          mode={mode}
          setMode={(newMode) => {
            setMode(newMode);
            setPage(1);
          }}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedTrack={selectedTrack}
          setSelectedTrack={setSelectedTrack}
          tracks={tracks}
          assignedTrack={assignedTrack}
          onFilterChange={() => setPage(1)}
        />
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
            {mode === 'recommended' && assignedTrack
              ? `There are currently no active opportunities tagged specifically for your assigned track (${assignedTrack.code} · ${assignedTrack.name}). Switch to "All Opportunities" to view all available briefs.`
              : 'No opportunities match your search criteria. Try clearing your search or track filter.'}
          </p>
          {mode === 'recommended' && (
            <button
              onClick={() => {
                setMode('all');
                setPage(1);
              }}
              className="learner-btn-primary inline-flex items-center gap-1.5"
            >
              <span>Explore All Opportunities</span>
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

                <span className="text-xs font-mono font-semibold px-2">
                  {page} / {totalPages}
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
