import React, { useState, useEffect, useCallback } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { 
  Users, 
  UserPlus, 
  Upload, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  X, 
  AlertCircle, 
  CheckCircle2, 
  GraduationCap,
  Sparkles,
  Mail
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

export default function StudentsPage() {
  const { refreshTrigger } = useOutletContext() || {};

  // Data states
  const [students, setStudents] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [tracks, setTracks] = useState([]);
  const [collegeList, setCollegeList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedTrack, setSelectedTrack] = useState('all');
  const [selectedCollege, setSelectedCollege] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(25);

  // Details Modal state
  const [viewingStudent, setViewingStudent] = useState(null);

  // 1. Debounce Search Term (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // 2. Fetch Filter Metadata (Tracks & Colleges)
  useEffect(() => {
    async function loadFilterMetadata() {
      try {
        let { data: tracksData, error } = await supabase
          .from('tracks')
          .select('id, code, name, color')
          .order('code', { ascending: true });

        if (error) {
          const fallbackRes = await supabase
            .from('courses')
            .select('id, code, name, color')
            .order('code', { ascending: true });
          tracksData = fallbackRes.data || [];
        }

        const collegesRes = await supabase
          .from('profiles')
          .select('college')
          .eq('role', 'learner')
          .not('college', 'is', null);

        if (tracksData) setTracks(tracksData);
        if (collegesRes.data) {
          const uniqueColleges = Array.from(
            new Set(collegesRes.data.map((c) => c.college?.trim()).filter(Boolean))
          ).sort();
          setCollegeList(uniqueColleges);
        }
      } catch (err) {
        console.warn('[StudentsPage] Failed to fetch filter metadata:', err);
      }
    }
    loadFilterMetadata();
  }, [refreshTrigger]);

  // 3. Main Server-Side Query
  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const needsInnerEnrollment = selectedTrack !== 'all' || selectedStatus !== 'all';
      const enrollmentSelect = needsInnerEnrollment
        ? 'enrollments!inner(id, enrolled_at, status, track_id, track:tracks(id, code, name, color))'
        : 'enrollments(id, enrolled_at, status, track_id, track:tracks(id, code, name, color))';

      let query = supabase
        .from('profiles')
        .select(`id, full_name, email, college, college_email, created_at, ${enrollmentSelect}`, { count: 'exact' })
        .eq('role', 'learner');

      // Server-side Search
      if (debouncedSearch) {
        const q = debouncedSearch.replace(/[,%]/g, '');
        query = query.or(`full_name.ilike.%${q}%,email.ilike.%${q}%,college_email.ilike.%${q}%,college.ilike.%${q}%`);
      }

      // College Filter
      if (selectedCollege !== 'all') {
        query = query.eq('college', selectedCollege);
      }

      // Track Filter
      if (selectedTrack !== 'all') {
        query = query.eq('enrollments.track_id', selectedTrack);
      }

      // Status Filter
      if (selectedStatus !== 'all') {
        query = query.eq('enrollments.status', selectedStatus);
      }

      // Server-side Pagination
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize - 1;

      query = query
        .order('created_at', { ascending: false })
        .range(startIndex, endIndex);

      const { data, count, error } = await query;

      if (error) {
        console.warn('[StudentsPage] Relational query error, trying fallback query:', error);
        // Fallback query for transitional schemas
        const fallbackSelect = needsInnerEnrollment
          ? 'enrollments!inner(id, enrolled_at, status, course_id, course:courses(id, code, name, color))'
          : 'enrollments(id, enrolled_at, status, course_id, course:courses(id, code, name, color))';

        let fbQuery = supabase
          .from('profiles')
          .select(`id, full_name, email, college, college_email, created_at, ${fallbackSelect}`, { count: 'exact' })
          .eq('role', 'learner');

        if (debouncedSearch) {
          const q = debouncedSearch.replace(/[,%]/g, '');
          fbQuery = fbQuery.or(`full_name.ilike.%${q}%,email.ilike.%${q}%,college_email.ilike.%${q}%,college.ilike.%${q}%`);
        }
        if (selectedCollege !== 'all') fbQuery = fbQuery.eq('college', selectedCollege);
        if (selectedTrack !== 'all') fbQuery = fbQuery.eq('enrollments.course_id', selectedTrack);
        if (selectedStatus !== 'all') fbQuery = fbQuery.eq('enrollments.status', selectedStatus);

        const { data: fbData, count: fbCount, error: fbError } = await fbQuery
          .order('created_at', { ascending: false })
          .range(startIndex, endIndex);

        if (fbError) throw fbError;

        const normalizedData = (fbData || []).map(student => ({
          ...student,
          enrollments: (student.enrollments || []).map(e => ({
            ...e,
            track_id: e.course_id,
            track: e.course
          }))
        }));

        setStudents(normalizedData);
        setTotalCount(fbCount || 0);
      } else {
        setStudents(data || []);
        setTotalCount(count || 0);
      }
    } catch (err) {
      console.error('[StudentsPage] Error fetching students:', err);
      setErrorMessage('Unable to load students. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, selectedTrack, selectedCollege, selectedStatus, currentPage, pageSize]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents, refreshTrigger]);

  const handleTrackFilterChange = (val) => {
    setSelectedTrack(val);
    setCurrentPage(1);
  };

  const handleCollegeFilterChange = (val) => {
    setSelectedCollege(val);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (val) => {
    setSelectedStatus(val);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  const formatDate = (isoString) => {
    if (!isoString) return '—';
    try {
      return new Intl.DateTimeFormat('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(new Date(isoString));
    } catch {
      return isoString.slice(0, 10);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '2px 8px',
            borderRadius: '9999px',
            fontSize: '10.5px',
            fontFamily: 'monospace',
            fontWeight: 700,
            textTransform: 'uppercase',
            backgroundColor: '#ECFDF5',
            color: '#047857',
            border: '1px solid #A7F3D0'
          }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#10B981' }} />
            Active
          </span>
        );
      case 'completed':
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '2px 8px',
            borderRadius: '9999px',
            fontSize: '10.5px',
            fontFamily: 'monospace',
            fontWeight: 700,
            textTransform: 'uppercase',
            backgroundColor: '#EFF6FF',
            color: '#1D4ED8',
            border: '1px solid #BFDBFE'
          }}>
            <CheckCircle2 size={11} />
            Completed
          </span>
        );
      case 'dropped':
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '2px 8px',
            borderRadius: '9999px',
            fontSize: '10.5px',
            fontFamily: 'monospace',
            fontWeight: 700,
            textTransform: 'uppercase',
            backgroundColor: '#FEF2F2',
            color: '#B91C1C',
            border: '1px solid #FECACA'
          }}>
            <AlertCircle size={11} />
            Dropped
          </span>
        );
      default:
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '2px 8px',
            borderRadius: '9999px',
            fontSize: '10.5px',
            fontFamily: 'monospace',
            fontWeight: 700,
            textTransform: 'uppercase',
            backgroundColor: '#F3F4F6',
            color: '#4B5563'
          }}>
            {status || 'Unknown'}
          </span>
        );
    }
  };

  return (
    <div className="admin-page">
      {/* Normalized Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">
            <Users size={22} />
            <span>Students Directory</span>
          </h1>
          <p className="admin-page-description">
            Manage enrolled learners, review UpShift track assignments, and institutional distribution.
          </p>
        </div>

        <div className="admin-page-actions">
          <Link
            to="/admin/students/import"
            className="admin-btn admin-btn-secondary"
            title="Bulk import learners via CSV"
          >
            <Upload size={14} />
            <span>Bulk CSV Import</span>
          </Link>

          <Link
            to="/admin/students/new"
            className="admin-btn admin-btn-primary"
          >
            <UserPlus size={14} />
            <span>Add Student</span>
          </Link>
        </div>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div role="alert" className="admin-alert admin-alert-danger">
          <div className="admin-alert-content">
            <AlertCircle size={16} />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={fetchStudents}
            className="admin-btn admin-btn-sm admin-btn-secondary"
          >
            Retry
          </button>
        </div>
      )}

      {/* Search & Filters Toolbar */}
      <div className="admin-card admin-card-compact">
        <div className="admin-filter-bar">
          {/* Search Box with Debounce */}
          <div className="admin-input-wrapper">
            <div className="admin-input-icon">
              <Search size={15} />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, college..."
              className="admin-input admin-input-with-icon"
              aria-label="Search students"
            />
          </div>

          {/* Track Filter */}
          <div>
            <select
              value={selectedTrack}
              onChange={(e) => handleTrackFilterChange(e.target.value)}
              className="admin-select"
              aria-label="Filter by UpShift track"
            >
              <option value="all">All UpShift Tracks</option>
              {tracks.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.code} — {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* College Filter */}
          <div>
            <select
              value={selectedCollege}
              onChange={(e) => handleCollegeFilterChange(e.target.value)}
              className="admin-select"
              aria-label="Filter by college"
            >
              <option value="all">All Colleges / Universities</option>
              {collegeList.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => handleStatusFilterChange(e.target.value)}
              className="admin-select"
              aria-label="Filter by enrollment status"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="dropped">Dropped</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Student Directory Table */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        {isLoading ? (
          <div style={{ padding: '24px', opacity: 0.6, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ width: '140px', height: '16px', backgroundColor: '#E5E7EB', borderRadius: '4px', marginBottom: '12px' }} />
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} style={{ height: '44px', backgroundColor: '#F9FAFB', borderRadius: '8px' }} />
            ))}
          </div>
        ) : students.length === 0 ? (
          /* Empty State */
          <div style={{ padding: '48px 24px', textAlign: 'center' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#F3F4F6', margin: '0 auto 10px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF' }}>
              <Users size={20} />
            </div>
            <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#111827', margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              No Learners Found
            </h4>
            <p style={{ fontSize: '12.5px', color: '#6B7280', maxWidth: '440px', margin: '0 auto 20px auto', lineHeight: 1.5 }}>
              {searchTerm || selectedTrack !== 'all' || selectedCollege !== 'all' || selectedStatus !== 'all'
                ? 'No learners match your search criteria. Try adjusting your filters.'
                : 'Get started by creating your first student account or uploading a bulk CSV roster.'}
            </p>
            <Link
              to="/admin/students/new"
              className="admin-btn admin-btn-primary"
            >
              <UserPlus size={14} />
              <span>Add First Student</span>
            </Link>
          </div>
        ) : (
          /* Normalized Table */
          <div className="admin-table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>College</th>
                  <th>College Email</th>
                  <th>Assigned Track</th>
                  <th>Registered</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => {
                  const enrollment = Array.isArray(student.enrollments) && student.enrollments.length > 0
                    ? student.enrollments[0]
                    : null;
                  const track = enrollment?.track;
                  const trackColor = track?.color || '#E31B23';

                  return (
                    <tr key={student.id}>
                      {/* Name & Email */}
                      <td>
                        <div style={{ fontWeight: 700, color: '#111827', fontSize: '13px' }}>
                          {student.full_name || 'Anonymous Student'}
                        </div>
                        <div style={{ fontSize: '11px', fontFamily: 'monospace', color: '#9CA3AF', marginTop: '2px' }}>
                          {student.email}
                        </div>
                      </td>

                      {/* College */}
                      <td style={{ color: '#4B5563', fontSize: '12.5px' }}>
                        {student.college || '—'}
                      </td>

                      {/* College Email */}
                      <td style={{ fontFamily: 'monospace', color: '#6B7280', fontSize: '11px' }}>
                        {student.college_email || '—'}
                      </td>

                      {/* Track */}
                      <td>
                        {track ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span 
                              style={{ 
                                backgroundColor: `${trackColor}18`, 
                                color: trackColor,
                                border: `1px solid ${trackColor}35`,
                                padding: '2px 5px',
                                borderRadius: '4px',
                                fontSize: '10px',
                                fontFamily: 'monospace',
                                fontWeight: 800,
                                textTransform: 'uppercase',
                                flexShrink: 0
                              }}
                            >
                              {track.code}
                            </span>
                            <span style={{ fontWeight: 500, color: '#1F2937', fontSize: '12.5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '170px' }}>
                              {track.name}
                            </span>
                          </div>
                        ) : (
                          <span style={{ color: '#9CA3AF', fontStyle: 'italic', fontSize: '12px' }}>Not Assigned</span>
                        )}
                      </td>

                      {/* Registered Date */}
                      <td style={{ fontFamily: 'monospace', color: '#6B7280', fontSize: '11.5px', whiteSpace: 'nowrap' }}>
                        {formatDate(student.created_at)}
                      </td>

                      {/* Status */}
                      <td style={{ whiteSpace: 'nowrap' }}>
                        {getStatusBadge(enrollment?.status || 'active')}
                      </td>

                      {/* Action */}
                      <td className="admin-table-actions">
                        <button
                          onClick={() => setViewingStudent(student)}
                          className="admin-btn-icon"
                          title="View student profile details"
                          aria-label={`View details for ${student.full_name}`}
                        >
                          <Eye size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {!isLoading && totalCount > pageSize && (
          <div className="admin-table-pagination">
            <span style={{ fontSize: '12px', color: '#6B7280', fontFamily: 'monospace' }}>
              Showing {((currentPage - 1) * pageSize) + 1}–{Math.min(currentPage * pageSize, totalCount)} of {totalCount} students
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="admin-btn admin-btn-sm admin-btn-secondary"
                aria-label="Previous page"
              >
                <ChevronLeft size={13} />
                <span>Prev</span>
              </button>

              <span style={{ fontSize: '12px', fontWeight: 600, padding: '0 8px', fontFamily: 'monospace' }}>
                {currentPage} / {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="admin-btn admin-btn-sm admin-btn-secondary"
                aria-label="Next page"
              >
                <span>Next</span>
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Student Details Slide-Over / Modal */}
      {viewingStudent && (
        <div className="admin-modal-overlay" onClick={() => setViewingStudent(null)}>
          <div className="admin-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={17} style={{ color: '#E31B23' }} />
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#111827' }}>
                  Student Profile Details
                </h3>
              </div>
              <button
                onClick={() => setViewingStudent(null)}
                className="admin-btn-icon"
              >
                <X size={15} />
              </button>
            </div>

            <div className="admin-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6B7280', fontWeight: 700 }}>
                  Full Name
                </span>
                <h4 style={{ margin: '2px 0 0 0', fontSize: '16px', fontWeight: 800, color: '#111827' }}>
                  {viewingStudent.full_name}
                </h4>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6B7280', fontWeight: 700 }}>
                    Account Email
                  </span>
                  <div style={{ marginTop: '2px', fontSize: '12.5px', fontFamily: 'monospace', color: '#1F2937' }}>
                    {viewingStudent.email}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6B7280', fontWeight: 700 }}>
                    College Email
                  </span>
                  <div style={{ marginTop: '2px', fontSize: '12.5px', fontFamily: 'monospace', color: '#1F2937' }}>
                    {viewingStudent.college_email || '—'}
                  </div>
                </div>
              </div>

              <div>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6B7280', fontWeight: 700 }}>
                  Institution / College
                </span>
                <div style={{ marginTop: '2px', fontSize: '13px', fontWeight: 600, color: '#111827' }}>
                  {viewingStudent.college || '—'}
                </div>
              </div>

              <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '12px' }}>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6B7280', fontWeight: 700 }}>
                  Program & Track Enrollment
                </span>
                {Array.isArray(viewingStudent.enrollments) && viewingStudent.enrollments.length > 0 ? (
                  <div style={{ marginTop: '8px', padding: '10px 12px', borderRadius: '8px', backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#111827' }}>
                      Program: UpShift Complete Applied AI Program
                    </div>
                    <div style={{ fontSize: '12px', color: '#4B5563' }}>
                      Assigned Track: <strong>{viewingStudent.enrollments[0]?.track?.code} — {viewingStudent.enrollments[0]?.track?.name}</strong>
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#6B7280', fontFamily: 'monospace' }}>
                      Enrolled: {formatDate(viewingStudent.enrollments[0]?.enrolled_at)} · Status: {viewingStudent.enrollments[0]?.status}
                    </div>
                  </div>
                ) : (
                  <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', color: '#9CA3AF', fontStyle: 'italic' }}>
                    No active track enrollment recorded.
                  </p>
                )}
              </div>
            </div>

            <div className="admin-modal-footer">
              <button
                onClick={() => setViewingStudent(null)}
                className="admin-btn admin-btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
