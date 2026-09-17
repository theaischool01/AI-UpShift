import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  Plus, 
  Upload, 
  Search, 
  Filter, 
  ExternalLink, 
  Eye, 
  Edit, 
  Trash2, 
  X, 
  Loader2, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight,
  Building,
  MapPin,
  Clock,
  Calendar,
  Globe
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

export default function GigsPage() {
  const navigate = useNavigate();

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('ALL');
  const [selectedOriginSite, setSelectedOriginSite] = useState('ALL');

  // Pagination states
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [totalGigs, setTotalGigs] = useState(0);

  // Data states
  const [gigs, setGigs] = useState([]);
  const [courses, setCourses] = useState([]);
  const [originSites, setOriginSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [viewingGig, setViewingGig] = useState(null);
  const [deletingGig, setDeletingGig] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 300ms native debounce
  const debounceTimerRef = useRef(null);
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearch(val.trim());
      setPage(1);
    }, 300);
  };

  // Load courses & distinct origin sites once
  useEffect(() => {
    async function loadMetadata() {
      try {
        const { data: coursesData } = await supabase
          .from('courses')
          .select('id, code, name')
          .order('code', { ascending: true });
        setCourses(coursesData || []);

        const { data: sitesData } = await supabase
          .from('gigs')
          .select('origin_site');
        
        if (sitesData) {
          const uniqueSites = Array.from(new Set(sitesData.map(s => s.origin_site).filter(Boolean))).sort();
          setOriginSites(uniqueSites);
        }
      } catch (err) {
        console.warn('[GigsPage] Error loading filter metadata:', err);
      }
    }
    loadMetadata();
  }, []);

  // Primary server-side query with filters and pagination
  const fetchGigs = useCallback(async () => {
    setLoading(true);
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
          long_description,
          origin_site,
          origin_url,
          organization,
          payment_amount,
          location,
          engagement_type,
          created_at,
          course:courses (
            id,
            code,
            name
          )
        `, { count: 'exact' });

      // Apply Search
      if (debouncedSearch) {
        query = query.or(`title.ilike.%${debouncedSearch}%,origin_site.ilike.%${debouncedSearch}%,organization.ilike.%${debouncedSearch}%`);
      }

      // Apply Course Filter
      if (selectedCourse !== 'ALL') {
        query = query.eq('course_id', selectedCourse);
      }

      // Apply Origin Site Filter
      if (selectedOriginSite !== 'ALL') {
        query = query.eq('origin_site', selectedOriginSite);
      }

      // Order & Paginate
      const { data, count, error: queryError } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

      if (queryError) throw queryError;

      setGigs(data || []);
      setTotalGigs(count || 0);
    } catch (err) {
      console.error('[GigsPage] Fetch failed:', err);
      setError('Unable to load gigs. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, debouncedSearch, selectedCourse, selectedOriginSite]);

  useEffect(() => {
    fetchGigs();
  }, [fetchGigs]);

  // Delete gig confirmation
  const handleConfirmDelete = async () => {
    if (!deletingGig || isDeleting) return;

    setIsDeleting(true);
    try {
      const { error: delErr } = await supabase
        .from('gigs')
        .delete()
        .eq('id', deletingGig.id);

      if (delErr) throw delErr;

      setDeletingGig(null);
      // Refresh current page or go back a page if this was the only item
      if (gigs.length === 1 && page > 1) {
        setPage(prev => prev - 1);
      } else {
        fetchGigs();
      }
    } catch (err) {
      alert(`Failed to delete gig: ${err.message || 'Server error'}`);
    } finally {
      setIsDeleting(false);
    }
  };

  // Safe external URL open helper
  const handleOpenExternal = (url) => {
    if (!url) return;
    try {
      const parsed = new URL(url);
      if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
        window.open(url, '_blank', 'noopener,noreferrer');
      } else {
        alert('Invalid or unsupported web address.');
      }
    } catch {
      alert('Invalid URL format.');
    }
  };

  const totalPages = Math.ceil(totalGigs / pageSize) || 1;
  const startRow = totalGigs === 0 ? 0 : (page - 1) * pageSize + 1;
  const endRow = Math.min(page * pageSize, totalGigs);

  return (
    <div className="admin-page space-y-6">
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-[#E31B23]" />
            Gigs
          </h1>
          <p>Manage aggregated opportunities available to UpShift learners.</p>
        </div>

        <div className="admin-page-actions">
          <Link
            to="/admin/gigs/import"
            className="admin-btn-secondary"
          >
            <Upload className="w-4 h-4 text-gray-600" />
            <span>Bulk Import</span>
          </Link>

          <Link
            to="/admin/gigs/new"
            className="admin-btn-primary"
          >
            <Plus className="w-4 h-4" />
            <span>Add Gig</span>
          </Link>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="admin-card p-4">
        <div className="admin-filter-bar">
          {/* Search Input */}
          <div className="relative min-w-0">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search gigs by title, origin site, or client..."
              className="admin-input pl-9 pr-9"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setDebouncedSearch('');
                  setPage(1);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Course Filter */}
          <div>
            <select
              value={selectedCourse}
              onChange={(e) => {
                setSelectedCourse(e.target.value);
                setPage(1);
              }}
              className="admin-select"
            >
              <option value="ALL">All Curriculum Tracks</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} — {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Origin Site Filter */}
          <div>
            <select
              value={selectedOriginSite}
              onChange={(e) => {
                setSelectedOriginSite(e.target.value);
                setPage(1);
              }}
              className="admin-select"
            >
              <option value="ALL">All Origin Sites</option>
              {originSites.map((site) => (
                <option key={site} value={site}>
                  {site}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Gigs Table Container */}
      <div className="admin-card overflow-hidden p-0">
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3 text-gray-500">
            <Loader2 className="w-7 h-7 animate-spin text-[#E31B23]" />
            <span className="text-xs font-medium">Loading opportunities...</span>
          </div>
        ) : error ? (
          <div className="p-12 text-center">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-900">{error}</p>
            <button
              onClick={fetchGigs}
              className="mt-3 text-xs font-semibold text-[#E31B23] hover:underline"
            >
              Try Again
            </button>
          </div>
        ) : gigs.length === 0 ? (
          /* Empty State */
          <div className="p-16 text-center max-w-md mx-auto">
            <div className="w-14 h-14 rounded-full bg-red-50 text-[#E31B23] flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-gray-900 tracking-tight">NO GIGS YET</h3>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              Add your first opportunity or import a gig dataset to begin building the UpShift opportunity board.
            </p>
            <div className="flex items-center justify-center gap-3 mt-6">
              <Link
                to="/admin/gigs/new"
                className="admin-btn-primary"
              >
                Add Gig
              </Link>
              <Link
                to="/admin/gigs/import"
                className="admin-btn-secondary"
              >
                Bulk Import
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <div className="admin-table-wrapper border-0 rounded-none">
              <table className="admin-table">
                <thead className="bg-gray-50 border-b border-gray-200 font-semibold text-gray-700">
                  <tr>
                    <th className="py-3 px-4 w-32">Gig ID</th>
                    <th className="py-3 px-4">Title & Client</th>
                    <th className="py-3 px-4">Course</th>
                    <th className="py-3 px-4">Payment</th>
                    <th className="py-3 px-4">Origin Site</th>
                    <th className="py-3 px-4">Created</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {gigs.map((gig) => (
                    <tr key={gig.id} className="hover:bg-gray-50/60 transition-colors">
                      {/* Gig ID */}
                      <td className="py-3 px-4 font-mono text-gray-500 text-[11px]">
                        {gig.external_gig_id || gig.id.slice(0, 8)}
                      </td>

                      {/* Title & Organization */}
                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-medium text-gray-900 truncate" title={gig.title}>
                          {gig.title}
                        </div>
                        {gig.organization && (
                           <div className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                            <Building className="w-3 h-3" />
                            <span className="truncate">{gig.organization}</span>
                          </div>
                        )}
                      </td>

                      {/* Course */}
                      <td className="py-3 px-4">
                        {gig.course ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 text-gray-800">
                            {gig.course.code} &bull; {gig.course.name}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>

                      {/* Payment */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {gig.payment_amount ? (
                          <span className="font-semibold text-gray-900 text-xs">
                            {gig.payment_amount}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs">—</span>
                        )}
                      </td>

                      {/* Origin Site */}
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-100">
                          <Globe className="w-3 h-3 text-blue-500" />
                          {gig.origin_site}
                        </span>
                      </td>

                      {/* Created */}
                      <td className="py-3 px-4 text-gray-400 font-mono text-[11px]">
                        {new Date(gig.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Modal */}
                          <button
                            type="button"
                            onClick={() => setViewingGig(gig)}
                            className="admin-btn-icon"
                            title="View details"
                            aria-label="View details"
                          >
                            <Eye className="w-4 h-4 text-gray-500" />
                          </button>

                          {/* Edit */}
                          <button
                            type="button"
                            onClick={() => navigate(`/admin/gigs/new?id=${gig.id}`)}
                            className="admin-btn-icon"
                            title="Edit opportunity"
                            aria-label="Edit opportunity"
                          >
                            <Edit className="w-4 h-4 text-gray-500" />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => setDeletingGig(gig)}
                            className="admin-btn-icon text-gray-400 hover:text-red-600 hover:bg-red-50 hover:border-red-200"
                            title="Delete opportunity"
                            aria-label="Delete opportunity"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="p-4 border-t border-gray-200 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
              <div>
                Showing <strong>{startRow}</strong>–<strong>{endRow}</strong> of <strong>{totalGigs}</strong> gigs
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span>Rows per page:</span>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setPage(1);
                    }}
                    className="px-2 py-1 text-xs border border-gray-200 rounded bg-white text-gray-700"
                  >
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="p-1 rounded border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                    title="Previous page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <span className="px-2 font-medium text-gray-700">
                    Page {page} of {totalPages}
                  </span>

                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="p-1 rounded border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
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

      {/* 4D.10 View Gig Details Modal */}
      {viewingGig && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal-card max-w-2xl">
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-100 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-[11px] text-gray-400">
                    {viewingGig.external_gig_id || viewingGig.id}
                  </span>
                  {viewingGig.course && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-700">
                      {viewingGig.course.code} &bull; {viewingGig.course.name}
                    </span>
                  )}
                </div>
                <h2 className="text-lg font-bold text-gray-900">{viewingGig.title}</h2>
              </div>
              <button
                type="button"
                onClick={() => setViewingGig(null)}
                className="admin-btn-icon"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-gray-700">
              {/* Meta Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-gray-400">Origin Platform</span>
                  <p className="font-semibold text-gray-900 mt-0.5">{viewingGig.origin_site}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-gray-400">Organization</span>
                  <p className="font-semibold text-gray-900 mt-0.5">{viewingGig.organization || 'Undisclosed'}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-gray-400">Payment</span>
                  <p className="font-semibold text-gray-900 mt-0.5">{viewingGig.payment_amount && viewingGig.payment_amount.trim() !== '' ? viewingGig.payment_amount : 'Payment not specified'}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-gray-400">Location</span>
                  <p className="font-semibold text-gray-900 mt-0.5">{viewingGig.location || 'Remote'}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-gray-400">Engagement</span>
                  <p className="font-semibold text-gray-900 mt-0.5">{viewingGig.engagement_type || 'Contract'}</p>
                </div>
              </div>

              {/* Short Description */}
              <div>
                <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Overview</h4>
                <p className="text-gray-800 leading-relaxed font-medium bg-gray-50/70 p-3 rounded-lg border border-gray-100">
                  {viewingGig.short_description}
                </p>
              </div>

              {/* Long Description */}
              <div>
                <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Complete Scope & Deliverables</h4>
                <div className="text-gray-600 whitespace-pre-line leading-relaxed bg-white p-4 rounded-lg border border-gray-200">
                  {viewingGig.long_description}
                </div>
              </div>

              <div className="text-[11px] text-gray-400 font-mono">
                Opportunity indexed on {new Date(viewingGig.created_at).toLocaleString()}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setViewingGig(null)}
                className="admin-btn-secondary"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => handleOpenExternal(viewingGig.origin_url)}
                className="admin-btn-primary"
              >
                <span>Apply on Origin Site</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4D.18 Delete Confirmation Modal */}
      {deletingGig && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal-card max-w-md p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-gray-900">Delete this gig?</h3>
              <p className="text-xs text-gray-500 mt-1">
                Are you sure you want to remove <strong>"{deletingGig.title}"</strong>? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingGig(null)}
                disabled={isDeleting}
                className="admin-btn-secondary"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="admin-btn-primary bg-red-600 hover:bg-red-700"
              >
                {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Delete Gig</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
