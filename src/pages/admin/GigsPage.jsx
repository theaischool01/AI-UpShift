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
  ChevronRight
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

export default function GigsPage() {
  const navigate = useNavigate();

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedTrack, setSelectedTrack] = useState('ALL');

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

      // Primary query: Attempt relational join with tracks
      let query = supabase
        .from('gigs')
        .select(`
          id,
          external_gig_id,
          title,
          track_id,
          short_description,
          overview,
          responsibilities,
          deliverables,
          requirements,
          proof_spec,
          origin_url,
          payment_amount,
          created_at,
          track:tracks (
            id,
            code,
            name,
            color
          )
        `, { count: 'exact' });

      // Apply Search
      if (debouncedSearch) {
        query = query.or(`title.ilike.%${debouncedSearch}%,short_description.ilike.%${debouncedSearch}%`);
      }

      // Apply Track Filter
      if (selectedTrack !== 'ALL') {
        query = query.eq('track_id', selectedTrack);
      }

      // Order & Paginate
      let { data, count, error: queryError } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

      if (queryError) {
        console.warn('[GigsPage] Relational tracks query not available, trying courses relation fallback:', queryError.message || queryError);
        
        let legacyRelQuery = supabase
          .from('gigs')
          .select(`
            id,
            external_gig_id,
            title,
            course_id,
            short_description,
            overview,
            responsibilities,
            deliverables,
            requirements,
            proof_spec,
            origin_url,
            payment_amount,
            created_at,
            course:courses (
              id,
              code,
              name,
              color
            )
          `, { count: 'exact' });

        if (debouncedSearch) {
          legacyRelQuery = legacyRelQuery.or(`title.ilike.%${debouncedSearch}%,short_description.ilike.%${debouncedSearch}%`);
        }
        if (selectedTrack !== 'ALL') {
          legacyRelQuery = legacyRelQuery.eq('course_id', selectedTrack);
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
          queryError = null;
        } else {
          console.warn('[GigsPage] Courses relation failed, attempting flat query:', legacyRelRes.error?.message || legacyRelRes.error);
          
          let flatQuery = supabase
            .from('gigs')
            .select(`
              id,
              external_gig_id,
              title,
              short_description,
              overview,
              responsibilities,
              deliverables,
              requirements,
              proof_spec,
              origin_url,
              payment_amount,
              created_at
            `, { count: 'exact' });

          if (debouncedSearch) {
            flatQuery = flatQuery.or(`title.ilike.%${debouncedSearch}%,short_description.ilike.%${debouncedSearch}%`);
          }

          const flatRes = await flatQuery
            .order('created_at', { ascending: false })
            .range(from, to);

          if (flatRes.error) {
            console.error('[GigsPage] Diagnostic DB error details:', {
              code: flatRes.error.code,
              message: flatRes.error.message,
              details: flatRes.error.details,
              hint: flatRes.error.hint
            });
            throw flatRes.error;
          }

          data = (flatRes.data || []).map(g => {
            const trackMatch = tracks.find(t => t.id === g.track_id || t.id === g.course_id);
            return {
              ...g,
              track_id: g.track_id || g.course_id,
              track: trackMatch || null
            };
          });
          count = flatRes.count || data.length;
        }
      }

      setGigs(data || []);
      setTotalGigs(count || 0);
    } catch (err) {
      console.error('[GigsPage] Fetch gigs error:', err);
      setError(`Unable to load commercial opportunities: ${err.message || 'Database connection error'}. Please refresh.`);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, debouncedSearch, selectedTrack]);

  useEffect(() => {
    fetchGigs();
  }, [fetchGigs]);

  // Handle Gig Deletion
  const confirmDeleteGig = async () => {
    if (!deletingGig || isDeleting) return;
    setIsDeleting(true);

    try {
      const { error: delError } = await supabase
        .from('gigs')
        .delete()
        .eq('id', deletingGig.id);

      if (delError) throw delError;

      setGigs(prev => prev.filter(g => g.id !== deletingGig.id));
      setTotalGigs(prev => Math.max(0, prev - 1));
      setDeletingGig(null);
    } catch (err) {
      console.error('[GigsPage] Delete error:', err);
      alert('Unable to delete opportunity record: ' + (err.message || 'Unknown database error'));
    } finally {
      setIsDeleting(false);
    }
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
            Manage commercial gigs, verify external apply gateways, and associate with UpShift tracks.
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

          <div>
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
                  <th>Gig ID</th>
                  <th>Module</th>
                  <th>Compensation</th>
                  <th>Gateway</th>
                  <th>Created</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {gigs.map((gig) => {
                  const track = gig.track || tracks.find(t => t.id === gig.track_id);

                  return (
                    <tr key={gig.id}>
                      {/* Title & Short Description */}
                      <td>
                        <div style={{ fontWeight: 700, color: '#111827', fontSize: '13.5px', marginBottom: '2px' }}>
                          {gig.title}
                        </div>
                        {gig.short_description && (
                          <p style={{ fontSize: '12px', color: '#6B7280', margin: 0, maxWidth: '380px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {gig.short_description}
                          </p>
                        )}
                      </td>

                      {/* Gig ID */}
                      <td>
                        <span style={{ 
                          display: 'inline-flex', 
                          padding: '2px 6px', 
                          borderRadius: '4px', 
                          fontSize: '11px', 
                          fontWeight: 700, 
                          fontFamily: 'monospace',
                          backgroundColor: '#F3F4F6',
                          color: '#4B5563'
                        }}>
                          {gig.external_gig_id || '—'}
                        </span>
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
                          {gig.payment_amount || '—'}
                        </span>
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

                      {/* Created Date */}
                      <td style={{ fontSize: '12px', color: '#6B7280', whiteSpace: 'nowrap' }}>
                        {formatDate(gig.created_at)}
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
                            title="Edit opportunity"
                          >
                            <Edit size={13} />
                          </Link>

                          <button
                            type="button"
                            onClick={() => setDeletingGig(gig)}
                            className="admin-btn-icon admin-btn-icon-danger"
                            title="Delete opportunity"
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

        {/* Pagination Bar */}
        {!loading && totalPages > 1 && (
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
              >
                <ChevronLeft size={13} />
                <span>Prev</span>
              </button>

              <span style={{ fontSize: '12px', fontWeight: 600, padding: '0 8px', fontFamily: 'monospace' }}>
                {page} / {totalPages}
              </span>

              <button
                type="button"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="admin-btn admin-btn-sm admin-btn-secondary"
              >
                <span>Next</span>
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Preview Modal */}
      {viewingGig && (
        <div className="admin-modal-overlay" onClick={() => setViewingGig(null)}>
          <div className="admin-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Briefcase size={17} style={{ color: '#E31B23' }} />
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#111827' }}>
                  Opportunity Details
                </h3>
              </div>
              <button
                onClick={() => setViewingGig(null)}
                className="admin-btn-icon"
              >
                <X size={15} />
              </button>
            </div>

            <div className="admin-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6B7280', fontWeight: 700 }}>
                  Title
                </span>
                <h4 style={{ margin: '2px 0 0 0', fontSize: '16px', fontWeight: 800, color: '#111827' }}>
                  {viewingGig.title}
                </h4>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6B7280', fontWeight: 700 }}>
                    UpShift Track
                  </span>
                  <div style={{ marginTop: '2px', fontSize: '13px', fontWeight: 700, fontFamily: 'monospace' }}>
                    {viewingGig.track?.name ? `${viewingGig.track.code} · ${viewingGig.track.name}` : (viewingGig.track_id || '—')}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6B7280', fontWeight: 700 }}>
                    Compensation
                  </span>
                  <div style={{ marginTop: '2px', fontSize: '13px', fontWeight: 700, color: '#047857' }}>
                    {viewingGig.payment_amount || '—'}
                  </div>
                </div>
              </div>

              {viewingGig.origin_url && (
                <div>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6B7280', fontWeight: 700 }}>
                    Apply Gateway Origin URL
                  </span>
                  <div style={{ marginTop: '2px' }}>
                    <a
                      href={viewingGig.origin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: '12px', color: '#4F46E5', wordBreak: 'break-all' }}
                    >
                      {viewingGig.origin_url}
                    </a>
                  </div>
                </div>
              )}

              {viewingGig.overview && (
                <div>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6B7280', fontWeight: 700 }}>
                    About the Role
                  </span>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', color: '#374151', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                    {viewingGig.overview}
                  </p>
                </div>
              )}

              {Array.isArray(viewingGig.responsibilities) && viewingGig.responsibilities.length > 0 && (
                <div>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6B7280', fontWeight: 700 }}>
                    Responsibilities
                  </span>
                  <ul style={{ margin: '6px 0 0 0', paddingLeft: '18px', fontSize: '12.5px', color: '#374151', lineHeight: 1.6 }}>
                    {viewingGig.responsibilities.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}

              {Array.isArray(viewingGig.deliverables) && viewingGig.deliverables.length > 0 && (
                <div>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6B7280', fontWeight: 700 }}>
                    Deliverables
                  </span>
                  <ul style={{ margin: '6px 0 0 0', paddingLeft: '18px', fontSize: '12.5px', color: '#374151', lineHeight: 1.6 }}>
                    {viewingGig.deliverables.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>
              )}

              {Array.isArray(viewingGig.requirements) && viewingGig.requirements.length > 0 && (
                <div>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6B7280', fontWeight: 700 }}>
                    Requirements
                  </span>
                  <ul style={{ margin: '6px 0 0 0', paddingLeft: '18px', fontSize: '12.5px', color: '#374151', lineHeight: 1.6 }}>
                    {viewingGig.requirements.map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}

              {viewingGig.proof_spec && (
                <div style={{ backgroundColor: '#F9FAFB', padding: '10px 12px', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#4B5563', fontWeight: 700 }}>
                    Required Proof Specification
                  </span>
                  <p style={{ margin: '3px 0 0 0', fontSize: '12px', color: '#111827', fontWeight: 500 }}>
                    {viewingGig.proof_spec}
                  </p>
                </div>
              )}
            </div>

            <div className="admin-modal-footer">
              <Link
                to={`/admin/gigs/new?id=${viewingGig.id}`}
                className="admin-btn admin-btn-primary"
              >
                <Edit size={13} />
                <span>Edit Opportunity</span>
              </Link>

              <button
                onClick={() => setViewingGig(null)}
                className="admin-btn admin-btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingGig && (
        <div className="admin-modal-overlay" onClick={() => setDeletingGig(null)}>
          <div className="admin-modal-container admin-modal-compact" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#DC2626' }}>
                <Trash2 size={17} />
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#111827' }}>
                  Delete Opportunity?
                </h3>
              </div>
              <button
                onClick={() => setDeletingGig(null)}
                className="admin-btn-icon"
              >
                <X size={15} />
              </button>
            </div>

            <div className="admin-modal-body">
              <p style={{ fontSize: '13px', color: '#4B5563', lineHeight: 1.5, margin: 0 }}>
                Are you sure you want to delete <strong>{deletingGig.title}</strong>? This will permanently remove the commercial opportunity from learner feeds.
              </p>
            </div>

            <div className="admin-modal-footer">
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
                className="admin-btn admin-btn-danger"
              >
                {isDeleting ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Yes, Delete</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
