import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { 
  Users, 
  UserPlus, 
  FileSpreadsheet, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  X, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  GraduationCap,
  BookOpen,
  Mail
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

export default function StudentsPage() {
  const { refreshTrigger } = useOutletContext() || {};

  // Data states
  const [students, setStudents] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [courses, setCourses] = useState([]);
  const [collegeList, setCollegeList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [selectedCollege, setSelectedCollege] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Details Modal state
  const [viewingStudent, setViewingStudent] = useState(null);

  // 1. Debounce Search Term (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
      setCurrentPage(1); // Reset page on new search
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // 2. Fetch Filter Metadata (Courses & Colleges)
  useEffect(() => {
    async function loadFilterMetadata() {
      try {
        const [coursesRes, collegesRes] = await Promise.all([
          supabase.from('courses').select('id, code, name, color').order('code', { ascending: true }),
          supabase.from('profiles').select('college').eq('role', 'learner').not('college', 'is', null)
        ]);

        if (coursesRes.data) setCourses(coursesRes.data);
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
      // Determine if inner join on enrollments is needed for course/status filter
      const needsInnerEnrollment = selectedCourse !== 'all' || selectedStatus !== 'all';
      const enrollmentSelect = needsInnerEnrollment
        ? 'enrollments!inner(id, enrolled_at, status, course_id, course:courses(id, code, name, color))'
        : 'enrollments(id, enrolled_at, status, course_id, course:courses(id, code, name, color))';

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

      // Course Filter
      if (selectedCourse !== 'all') {
        query = query.eq('enrollments.course_id', selectedCourse);
      }

      // Status Filter
      if (selectedStatus !== 'all') {
        query = query.eq('enrollments.status', selectedStatus);
      }

      // Server-side Pagination with .range()
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize - 1;

      query = query
        .order('created_at', { ascending: false })
        .range(startIndex, endIndex);

      const { data, count, error } = await query;

      if (error) throw error;

      setStudents(data || []);
      setTotalCount(count || 0);
    } catch (err) {
      console.error('[StudentsPage] Error fetching students:', err);
      setErrorMessage('Unable to load students. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, selectedCourse, selectedCollege, selectedStatus, currentPage, pageSize]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents, refreshTrigger]);

  // Reset page when filters change
  const handleCourseFilterChange = (val) => {
    setSelectedCourse(val);
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

  const handlePageSizeChange = (val) => {
    setPageSize(Number(val));
    setCurrentPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  // Date Formatter
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

  // Status Badge Helper
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Active
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-blue-50 text-blue-700 border border-blue-200">
            <CheckCircle2 size={11} />
            Completed
          </span>
        );
      case 'dropped':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-red-50 text-red-700 border border-red-200">
            <AlertCircle size={11} />
            Dropped
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-gray-100 text-gray-700 border border-gray-200">
            {status || 'Active'}
          </span>
        );
    }
  };

  return (
    <div className="admin-page space-y-6">
      {/* Top Action Bar */}
      <div className="admin-page-header">
        <div>
          <h2>Learner Directory</h2>
          <p>Manage registered students, academic institutions, and course enrollments.</p>
        </div>

        <div className="admin-page-actions">
          <Link
            to="/admin/students/import"
            className="admin-btn-secondary"
            title="Import students via CSV file"
          >
            <FileSpreadsheet size={15} />
            <span>Import CSV</span>
          </Link>

          <Link
            to="/admin/students/new"
            className="admin-btn-primary"
          >
            <UserPlus size={15} />
            <span>Add Student</span>
          </Link>
        </div>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div 
          role="alert" 
          className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-center justify-between gap-4 text-left"
        >
          <div className="flex items-center gap-2.5">
            <AlertCircle size={17} className="text-[#E31B23] flex-shrink-0" />
            <p className="text-xs sm:text-sm text-red-800 font-medium">
              {errorMessage}
            </p>
          </div>
          <button
            onClick={fetchStudents}
            className="admin-btn-secondary text-xs"
          >
            Retry
          </button>
        </div>
      )}

      {/* Search & Filters Toolbar */}
      <div className="admin-card p-4">
        <div className="admin-filter-bar">
          {/* Search Box with Debounce */}
          <div className="relative min-w-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Search size={15} />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, college..."
              className="admin-input pl-9"
              aria-label="Search students"
            />
          </div>

          {/* Course Filter */}
          <div>
            <select
              value={selectedCourse}
              onChange={(e) => handleCourseFilterChange(e.target.value)}
              className="admin-select"
              aria-label="Filter by course"
            >
              <option value="all">All Courses (Tracks)</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} — {c.name}
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
      <div className="admin-card p-0 overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3 animate-pulse">
            <div className="h-4 w-44 bg-gray-200 rounded mb-4" />
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 w-full bg-gray-100 rounded-lg" />
            ))}
          </div>
        ) : students.length === 0 ? (
          /* Empty State */
          <div className="py-16 text-center px-4">
            <div className="w-12 h-12 rounded-full bg-gray-100 mx-auto flex items-center justify-center text-gray-400 mb-3">
              <Users size={22} />
            </div>
            <h4 className="text-base font-bold text-gray-900 mb-1 uppercase tracking-wide">
              No Learners Yet
            </h4>
            <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto leading-relaxed mb-5">
              Create the first learner account to begin building your UpShift roster, or adjust your active search and filter criteria.
            </p>
            <Link
              to="/admin/students/new"
              className="admin-btn-primary"
            >
              <UserPlus size={15} />
              <span>Add Student</span>
            </Link>
          </div>
        ) : (
          /* Data Table */
          <div className="admin-table-wrapper border-0 rounded-none">
            <table className="admin-table">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200 text-[11px] font-mono font-bold text-gray-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">College</th>
                  <th className="py-3 px-4">College Email</th>
                  <th className="py-3 px-4">Course</th>
                  <th className="py-3 px-4">Registered</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {students.map((student) => {
                  const enrollment = student.enrollments?.[0] || {};
                  const course = enrollment.course || {};
                  const courseColor = course.color || '#E31B23';

                  return (
                    <tr key={student.id} className="hover:bg-gray-50/80 transition-colors">
                      {/* Student Column */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-gray-900">
                          {student.full_name}
                        </div>
                        <div className="text-[11px] font-mono text-gray-400">
                          {student.email}
                        </div>
                      </td>

                      {/* College Column */}
                      <td className="py-3 px-4 text-gray-700">
                        {student.college || '—'}
                      </td>

                      {/* College Email Column */}
                      <td className="py-3 px-4 font-mono text-gray-500 text-[11px]">
                        {student.college_email || '—'}
                      </td>

                      {/* Course Column */}
                      <td className="py-3 px-4">
                        {course.name ? (
                          <div className="flex items-center gap-1.5">
                            <span 
                              className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase flex-shrink-0"
                              style={{ 
                                backgroundColor: `${courseColor}15`, 
                                color: courseColor,
                                border: `1px solid ${courseColor}30`
                              }}
                            >
                              {course.code || 'M'}
                            </span>
                            <span className="font-medium text-gray-800 truncate max-w-[160px]">
                              {course.name}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">Not Enrolled</span>
                        )}
                      </td>

                      {/* Registered Date Column */}
                      <td className="py-3 px-4 font-mono text-gray-500 whitespace-nowrap">
                        {formatDate(enrollment.enrolled_at || student.created_at)}
                      </td>

                      {/* Status Column */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {renderStatusBadge(enrollment.status || 'active')}
                      </td>

                      {/* Actions Column */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => setViewingStudent(student)}
                          className="admin-btn-secondary py-1 px-2.5 text-[11px]"
                          title="View student profile and enrollment details"
                        >
                          <Eye size={12} />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Toolbar */}
        {!isLoading && totalCount > 0 && (
          <div className="p-4 bg-gray-50/50 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-gray-600">
            {/* Range Text */}
            <div className="font-mono">
              Showing <span className="font-bold text-gray-900">{Math.min((currentPage - 1) * pageSize + 1, totalCount)}</span>–
              <span className="font-bold text-gray-900">{Math.min(currentPage * pageSize, totalCount)}</span> of{' '}
              <span className="font-bold text-gray-900">{totalCount}</span> students
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3 self-end sm:self-auto">
              <div className="flex items-center gap-1.5 font-mono">
                <span>Per page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => handlePageSizeChange(e.target.value)}
                  className="px-2 py-1 text-xs rounded border border-gray-200 bg-white text-gray-800"
                >
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className="admin-btn-secondary p-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Previous Page"
                >
                  <ChevronLeft size={14} />
                </button>
                <span className="px-2 font-mono text-gray-500">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  className="admin-btn-secondary p-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Next Page"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Student Details Modal (Normalized Footprint max 680px, compact rows) */}
      {viewingStudent && (
        <div 
          className="admin-modal-backdrop"
          onClick={() => setViewingStudent(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="student-details-title"
        >
          <div 
            className="admin-modal-card space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-red-50 text-[#E31B23] border border-red-100 flex items-center justify-center font-bold">
                  <GraduationCap size={16} />
                </div>
                <div>
                  <h3 id="student-details-title" className="text-base font-extrabold text-[#111827] tracking-tight m-0">
                    Student Details
                  </h3>
                  <p className="text-xs text-[#6B7280] m-0">Verified learner registration and enrollment record</p>
                </div>
              </div>

              <button
                onClick={() => setViewingStudent(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            {/* Section 1: Personal & Academic Profile */}
            <div className="space-y-2.5">
              <div className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-wider">
                Personal & Academic Profile
              </div>

              <div className="bg-gray-50/80 rounded-xl p-3.5 space-y-2 text-xs border border-gray-100">
                <div className="flex items-center justify-between py-1 border-b border-gray-200/60">
                  <span className="text-gray-500 font-medium">Full Name</span>
                  <span className="font-bold text-gray-900">{viewingStudent.full_name}</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-gray-200/60">
                  <span className="text-gray-500 font-medium">Account Email</span>
                  <span className="font-mono text-gray-900 font-semibold">{viewingStudent.email}</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-gray-200/60">
                  <span className="text-gray-500 font-medium">College Email</span>
                  <span className="font-mono text-gray-900">{viewingStudent.college_email || '—'}</span>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="text-gray-500 font-medium">College / Institution</span>
                  <span className="font-semibold text-gray-900">{viewingStudent.college || '—'}</span>
                </div>
              </div>
            </div>

            {/* Section 2: Enrollment Information */}
            <div className="space-y-2.5">
              <div className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-wider">
                Course Enrollment
              </div>

              {viewingStudent.enrollments?.[0] ? (
                <div className="bg-gray-50/80 rounded-xl p-3.5 space-y-2 text-xs border border-gray-100">
                  <div className="flex items-center justify-between py-1 border-b border-gray-200/60">
                    <span className="text-gray-500 font-medium">Flagship Track</span>
                    <span className="font-bold text-gray-900">
                      {viewingStudent.enrollments[0].course?.code} — {viewingStudent.enrollments[0].course?.name}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-gray-200/60">
                    <span className="text-gray-500 font-medium">Enrollment Status</span>
                    <span>{renderStatusBadge(viewingStudent.enrollments[0].status)}</span>
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <span className="text-gray-500 font-medium">Enrolled Date</span>
                    <span className="font-mono text-gray-800">
                      {formatDate(viewingStudent.enrollments[0].enrolled_at)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-4 text-xs text-gray-400 bg-gray-50 rounded-xl italic text-center border border-dashed border-gray-200">
                  No active course enrollment found.
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-2 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setViewingStudent(null)}
                className="admin-btn-secondary"
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
