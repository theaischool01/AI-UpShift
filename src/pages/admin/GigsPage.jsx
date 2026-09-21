import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  Plus, 
  Upload, 
  Search, 
  ExternalLink, 
  Eye, 
  Edit, 
  Trash2, 
  X, 
  Loader2, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight,
  ArrowUpDown,
  Sparkles
} from 'lucide-react';
import { fetchGigs as fetchGigsService, fetchTracks as fetchTracksService, deleteGig as deleteGigService } from '../../services/gigService';

export default function GigsPage() {
  const navigate = useNavigate();

  // Filter, Search & Sort states
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedTrack, setSelectedTrack] = useState('ALL');
  const [sortBy, setSortBy] = useState('priority');

  // Pagination states
  const [page, setPage] = useState(1);
  const [pageSize] = useState(25);
  const [totalGigs, setTotalGigs] = useState(0);

  // Data states
  const [gigs, setGigs] = useState([]);
  const [tracks, setTracks] = useState([]);
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

  // Load tracks
  useEffect(() => {
    async function loadMetadata() {
      const { data, error } = await fetchTracksService();
      if (!error && data) {
        setTracks(data);
      }
    }
    loadMetadata();
  }, []);

  // Primary server-side query with filters, sorting, and pagination
  const fetchGigs = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, count, error: queryError } = await fetchGigsService({
      page,
      pageSize,
      search: debouncedSearch,
      trackId: selectedTrack,
      sortBy,
    });

    if (queryError) {
      setError(`Unable to load commercial opportunities: ${queryError.message || 'Database connection error'}. Please refresh.`);
    } else {
      setGigs(data || []);
      setTotalGigs(count || 0);
    }
    setLoading(false);
  }, [page, pageSize, debouncedSearch, selectedTrack, sortBy]);

  useEffect(() => {
    fetchGigs();
  }, [fetchGigs]);

  // Handle Gig Deletion
  const confirmDeleteGig = async () => {
    if (!deletingGig || isDeleting) return;
    setIsDeleting(true);

    const { error: delError } = await deleteGigService(deletingGig.id);
    if (delError) {
      alert('Unable to delete opportunity record: ' + (delError.message || 'Unknown database error'));
    } else {
      setGigs(prev => prev.filter(g => g.id !== deletingGig.id));
      setTotalGigs(prev => Math.max(0, prev - 1));
      setDeletingGig(null);
    }
    setIsDeleting(false);
  };

  const totalPages = Math.max(1, Math.ceil(totalGigs / pageSize));

  const formatDate = (iso) => {
    if (!iso) return '—';
    try {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }).format(new Date(iso));
    } catch {
      return iso.slice(0, 10);
    }
  };

  return (
    <div className="admin-page">
      {/* Page Header */}
      <div className="admin-page-header">
        <div className="admin-page-title-group">
          <h1 className="admin-page-title">
            <Briefcase size={22} />
            <span>Opportunities Directory</span>
          </h1>
          <p className="admin-page-description">
            Manage commercial opportunities, marketplace ranking priority, and verify external apply gateways.
          </p>
        </div>

        <div className="admin-page-actions">
          <Link
            to="/admin/gigs/import"
            className="admin-btn admin-btn-secondary"
            title="Bulk import opportunities from CSV"
          >
            <Upload size={14} />
            <span>Bulk CSV Import</span>
          </Link>

          <Link
            to="/admin/gigs/new"
            className="admin-btn admin-btn-primary"
          >
            <Plus size={14} />
            <span>Add Gig</span>
          </Link>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div role="alert" className="admin-alert admin-alert-danger">
          <div className="admin-alert-content">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchGigs}
            className="admin-btn admin-btn-sm admin-btn-secondary"
          >
            Retry
          </button>
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div className="admin-card admin-card-compact">
        <div className="admin-filter-bar">
          <div className="admin-input-wrapper">
            <div className="admin-input-icon">
              <Search size={15} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by title, overview, short description..."
              className="admin-input admin-input-with-icon"
              aria-label="Search opportunities"
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {/* Track Filter */}
            <select
              value={selectedTrack}
              onChange={(e) => {
                setSelectedTrack(e.target.value);
                setPage(1);
              }}
              className="admin-select"
              aria-label="Filter by UpShift module"
            >
              <option value="ALL">All UpShift Modules</option>
              {tracks.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.code} — {t.name}
                </option>
              ))}
            </select>

            {/* Sort Order Selector */}
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="admin-select"
              aria-label="Sort opportunities by"
            >
              <option value="priority">Sort: Priority & Featured</option>
              <option value="newest">Sort: Newest Posted</option>
              <option value="pay">Sort: Highest Pay</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Gigs Table */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '36px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', color: '#6B7280' }}>
            <Loader2 size={24} className="animate-spin" style={{ color: '#E31B23' }} />
            <span style={{ fontSize: '13px', fontWeight: 500 }}>Loading opportunities...</span>
          </div>
        ) : gigs.length === 0 ? (
          <div style={{ padding: '48px 24px', textAlign: 'center' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#F3F4F6', margin: '0 auto 10px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF' }}>
              <Briefcase size={20} />
            </div>
            <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#111827', margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              No Opportunities Found
            </h4>
            <p style={{ fontSize: '12.5px', color: '#6B7280', maxWidth: '440px', margin: '0 auto 20px auto', lineHeight: 1.5 }}>
              {searchQuery || selectedTrack !== 'ALL'
                ? 'No gigs match your search filters. Try adjusting your query.'
                : 'Create your first opportunity record or upload a bulk CSV listing.'}
            </p>
            <Link
              to="/admin/gigs/new"
              className="admin-btn admin-btn-primary"
            >
              <Plus size={14} />
              <span>Add First Opportunity</span>
            </Link>
          </div>
        ) : (
          <div className="admin-table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Opportunity</th>
                  <th>Priority</th>
                  <th>Module</th>
                  <th>Compensation</th>
                  <th>Gateway</th>
                  <th>Posted / Created</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {gigs.map((gig) => {
                  const track = gig.track || tracks.find(t => t.id === gig.track_id);
                  const isFeatured = gig.is_featured;
                  const priorityVal = gig.priority || 0;

                  return (
                    <tr key={gig.id}>
                      {/* Title & Short Description */}
                      <td>
                        <div style={{ fontWeight: 700, color: '#111827', fontSize: '13.5px', marginBottom: '2px' }}>
                          {gig.title}
                        </div>
                        {gig.short_description && (
                          <p style={{ fontSize: '12px', color: '#6B7280', margin: 0, maxWidth: '360px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {gig.short_description}
                          </p>
                        )}
                      </td>

                      {/* Priority / Featured Badge */}
                      <td>
                        {isFeatured ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', padding: '2px 7px', borderRadius: '4px', fontSize: '10.5px', fontWeight: 800, backgroundColor: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}>
                            <Sparkles size={11} /> Featured
                          </span>
                        ) : priorityVal >= 20 ? (
                          <span style={{ padding: '2px 6px', borderRadius: '4px', fontSize: '10.5px', fontWeight: 700, backgroundColor: '#FEF3C7', color: '#B45309' }}>
                            High (P{priorityVal})
                          </span>
                        ) : priorityVal >= 10 ? (
                          <span style={{ padding: '2px 6px', borderRadius: '4px', fontSize: '10.5px', fontWeight: 700, backgroundColor: '#EFF6FF', color: '#1D4ED8' }}>
                            Elevated (P{priorityVal})
                          </span>
                        ) : (
                          <span style={{ color: '#9CA3AF', fontSize: '11px' }}>
                            Standard
                          </span>
                        )}
                      </td>

                      {/* Module Code / Badge */}
                      <td>
                        <span style={{ 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          gap: '5px',
                          padding: '3px 8px', 
                          borderRadius: '6px', 
                          fontSize: '11px', 
                          fontWeight: 700, 
                          fontFamily: 'monospace',
                          backgroundColor: '#F3F4F6',
                          color: '#1F2937'
                        }}>
                          {track ? `${track.code} · ${track.name}` : (gig.track_id || '—')}
                        </span>
                      </td>

                      {/* Compensation */}
                      <td>
                        <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#047857' }}>
                          {gig.payment_amount || (gig.max_amount ? `${gig.currency || 'INR'} ${gig.max_amount}` : '—')}
                        </span>
                        {gig.compensation_type && gig.compensation_type !== 'unspecified' && (
                          <span style={{ display: 'block', fontSize: '10px', color: '#6B7280', textTransform: 'capitalize' }}>
                            {gig.compensation_type}
                          </span>
                        )}
                      </td>

                      {/* Apply Gateway */}
                      <td>
                        {gig.origin_url ? (
                          <a
                            href={gig.origin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="admin-link"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#4F46E5', fontWeight: 500 }}
                            title="Open external apply gateway"
                          >
                            <span>Gateway</span>
                            <ExternalLink size={11} />
                          </a>
                        ) : (
                          <span style={{ color: '#9CA3AF', fontSize: '12px' }}>—</span>
                        )}
                      </td>

                      {/* Created / Posted Date */}
                      <td style={{ fontSize: '12px', color: '#6B7280', whiteSpace: 'nowrap' }}>
                        {formatDate(gig.posted_at || gig.created_at)}
                      </td>

                      {/* Action Buttons */}
                      <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <button
                            type="button"
                            onClick={() => setViewingGig(gig)}
                            className="admin-btn-icon"
                            title="Preview opportunity detail modal"
                          >
                            <Eye size={13} />
                          </button>

                          <Link
                            to={`/admin/gigs/new?id=${gig.id}`}
                            className="admin-btn-icon"
                            title="Edit opportunity details"
                          >
                            <Edit size={13} />
                          </Link>

                          <button
                            type="button"
                            onClick={() => setDeletingGig(gig)}
                            className="admin-btn-icon admin-btn-icon-danger"
                            title="Delete opportunity record"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div style={{ padding: '12px 20px', borderTop: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FAFAFA' }}>
            <span style={{ fontSize: '12px', color: '#6B7280', fontFamily: 'monospace' }}>
              Showing {((page - 1) * pageSize) + 1}–{Math.min(page * pageSize, totalGigs)} of {totalGigs} opportunities
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                type="button"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="admin-btn admin-btn-sm admin-btn-secondary"
                aria-label="Previous Page"
              >
                <ChevronLeft size={13} />
              </button>

              <span style={{ fontSize: '12px', fontWeight: 600, color: '#374151', padding: '0 4px' }}>
                Page {page} of {totalPages}
              </span>

              <button
                type="button"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="admin-btn admin-btn-sm admin-btn-secondary"
                aria-label="Next Page"
              >
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deletingGig && (
        <div className="admin-modal-overlay" onClick={() => !isDeleting && setDeletingGig(null)}>
          <div className="admin-modal-card" onClick={e => e.stopPropagation()}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#FEF2F2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <AlertCircle size={20} />
            </div>

            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#111827', margin: '0 0 6px 0' }}>
              Delete Commercial Opportunity?
            </h3>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 20px 0', lineHeight: 1.5 }}>
              Are you sure you want to delete <strong>{deletingGig.title}</strong>? This will remove the opportunity from learner boards.
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setDeletingGig(null)}
                disabled={isDeleting}
                className="admin-btn admin-btn-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteGig}
                disabled={isDeleting}
                className="admin-btn admin-btn-primary"
                style={{ backgroundColor: '#DC2626', borderColor: '#DC2626' }}
              >
                {isDeleting ? 'Deleting...' : 'Delete Opportunity'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Preview Modal */}
      {viewingGig && (
        <div className="admin-modal-overlay" onClick={() => setViewingGig(null)}>
          <div className="admin-modal-card admin-modal-card-wide" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid #E5E7EB', paddingBottom: '14px' }}>
              <div>
                <span style={{ fontSize: '11px', fontFamily: 'monospace', fontWeight: 700, color: '#E31B23', textTransform: 'uppercase' }}>
                  Opportunity Specification Preview
                </span>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#111827', margin: '2px 0 0 0' }}>
                  {viewingGig.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setViewingGig(null)}
                className="admin-btn-icon"
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '60vh', overflowY: 'auto' }}>
              {viewingGig.payment_amount && (
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#4B5563', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Compensation</label>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#047857' }}>{viewingGig.payment_amount}</span>
                </div>
              )}

              {viewingGig.short_description && (
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#4B5563', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Short Description</label>
                  <p style={{ fontSize: '13px', color: '#1F2937', margin: 0, lineHeight: 1.5 }}>{viewingGig.short_description}</p>
                </div>
              )}

              {viewingGig.overview && (
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#4B5563', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Role Overview</label>
                  <p style={{ fontSize: '13px', color: '#1F2937', margin: 0, lineHeight: 1.5, whiteSpace: 'pre-line' }}>{viewingGig.overview}</p>
                </div>
              )}

              {viewingGig.origin_url && (
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#4B5563', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Apply Gateway</label>
                  <a href={viewingGig.origin_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12.5px', color: '#4F46E5', wordBreak: 'break-all' }}>
                    {viewingGig.origin_url}
                  </a>
                </div>
              )}
            </div>

            <div style={{ marginTop: '20px', paddingTop: '14px', borderTop: '1px solid #E5E7EB', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setViewingGig(null)}
                className="admin-btn admin-btn-secondary"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
