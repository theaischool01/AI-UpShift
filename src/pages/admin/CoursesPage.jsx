import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Users, 
  Briefcase, 
  CheckCircle2, 
  Loader2, 
  AlertCircle, 
  ExternalLink,
  Layers,
  Sparkles
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Aggregated totals
  const [stats, setStats] = useState({ totalCourses: 0, totalEnrollments: 0, totalGigs: 0 });

  const loadCoursesData = async () => {
    setLoading(true);
    setError(null);

    try {
      // 4F.4 Avoid N+1 queries: Execute 3 bulk queries in parallel
      const [coursesRes, enrollmentsRes, gigsRes] = await Promise.all([
        supabase
          .from('courses')
          .select('id, code, name, category, tagline, color, bg_color, is_active, created_at')
          .order('code', { ascending: true }),
        supabase
          .from('enrollments')
          .select('course_id'),
        supabase
          .from('gigs')
          .select('course_id')
      ]);

      if (coursesRes.error) throw coursesRes.error;
      if (enrollmentsRes.error) throw enrollmentsRes.error;
      if (gigsRes.error) throw gigsRes.error;

      // In-memory aggregation
      const enrollmentCounts = {};
      (enrollmentsRes.data || []).forEach(e => {
        if (e.course_id) {
          enrollmentCounts[e.course_id] = (enrollmentCounts[e.course_id] || 0) + 1;
        }
      });

      const gigCounts = {};
      (gigsRes.data || []).forEach(g => {
        if (g.course_id) {
          gigCounts[g.course_id] = (gigCounts[g.course_id] || 0) + 1;
        }
      });

      const processedCourses = (coursesRes.data || []).map(course => ({
        ...course,
        studentCount: enrollmentCounts[course.id] || 0,
        gigCount: gigCounts[course.id] || 0,
      }));

      setCourses(processedCourses);
      setStats({
        totalCourses: processedCourses.length,
        totalEnrollments: (enrollmentsRes.data || []).length,
        totalGigs: (gigsRes.data || []).length,
      });
    } catch (err) {
      console.error('[CoursesPage] Data load error:', err);
      setError('Unable to load courses and metrics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoursesData();
  }, []);

  return (
    <div className="admin-page space-y-6">
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-[#E31B23]" />
            Courses
          </h1>
          <p>
            Manage and monitor the six flagship UpShift learning tracks.
          </p>
        </div>

        <div className="admin-page-actions">
          <Link
            to="/admin/students"
            className="admin-btn-secondary"
          >
            <Users className="w-4 h-4 text-gray-600" />
            <span>Students Directory</span>
          </Link>
          <Link
            to="/admin/gigs"
            className="admin-btn-secondary"
          >
            <Briefcase className="w-4 h-4 text-gray-600" />
            <span>Gigs Directory</span>
          </Link>
        </div>
      </div>

      {/* Overview Stat Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="admin-card p-4">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Active Curriculum Tracks</span>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalCourses}</p>
        </div>
        <div className="admin-card p-4">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Enrolled Learners</span>
          <p className="text-2xl font-bold text-[#E31B23] mt-1">{stats.totalEnrollments}</p>
        </div>
        <div className="admin-card p-4">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Aggregated Gigs</span>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.totalGigs}</p>
        </div>
      </div>

      {/* Courses Cards Grid */}
      {loading ? (
        <div className="admin-card p-16 flex flex-col items-center justify-center gap-3 text-gray-500">
          <Loader2 className="w-7 h-7 animate-spin text-[#E31B23]" />
          <span className="text-xs font-medium">Loading flagship courses and metrics...</span>
        </div>
      ) : error ? (
        <div className="admin-card p-12 text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-sm font-semibold text-gray-900">{error}</p>
          <button
            onClick={loadCoursesData}
            className="mt-3 text-xs font-semibold text-[#E31B23] hover:underline"
          >
            Retry Loading
          </button>
        </div>
      ) : courses.length === 0 ? (
        <div className="admin-card p-12 text-center text-gray-500">
          <p className="text-sm font-semibold">No courses configured in the database.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((course) => (
            <div
              key={course.id}
              className="admin-card p-6 flex flex-col justify-between hover:border-gray-300 transition-all group"
            >
              <div>
                {/* Track Code & Status Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span 
                    className="px-2.5 py-1 rounded-md text-xs font-mono font-bold tracking-wide"
                    style={{
                      backgroundColor: course.bg_color || '#FEF2F2',
                      color: course.color || '#E31B23',
                    }}
                  >
                    {course.code}
                  </span>

                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
                    course.is_active 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : 'bg-gray-100 text-gray-500 border border-gray-200'
                  }`}>
                    {course.is_active ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        Active
                      </>
                    ) : (
                      'Inactive'
                    )}
                  </span>
                </div>

                {/* Course Name & Category */}
                <h3 className="text-base font-bold text-gray-900 group-hover:text-[#E31B23] transition-colors">
                  {course.name}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5 font-medium">
                  {course.category}
                </p>

                {/* Tagline */}
                {course.tagline && (
                  <p className="text-xs text-gray-600 mt-2.5 italic bg-gray-50 p-2 rounded-lg border border-gray-100">
                    "{course.tagline}"
                  </p>
                )}
              </div>

              {/* Metrics & Quick Nav */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-gray-50 p-2.5 rounded-lg">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 block">
                      Enrolled Learners
                    </span>
                    <span className="text-lg font-bold text-gray-900 flex items-center gap-1.5 mt-0.5">
                      <Users className="w-4 h-4 text-gray-400" />
                      {course.studentCount}
                    </span>
                  </div>

                  <div className="bg-gray-50 p-2.5 rounded-lg">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 block">
                      Available Gigs
                    </span>
                    <span className="text-lg font-bold text-gray-900 flex items-center gap-1.5 mt-0.5">
                      <Briefcase className="w-4 h-4 text-gray-400" />
                      {course.gigCount}
                    </span>
                  </div>
                </div>

                {/* Filter quick links */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <Link
                    to={`/admin/students?course=${course.id}`}
                    className="hover:text-gray-900 font-medium flex items-center gap-1"
                  >
                    <span>View Learners</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>

                  <Link
                    to={`/admin/gigs?course=${course.id}`}
                    className="hover:text-gray-900 font-medium flex items-center gap-1"
                  >
                    <span>View Gigs</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
