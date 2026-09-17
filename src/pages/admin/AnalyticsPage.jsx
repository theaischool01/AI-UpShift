import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  Filter, 
  Loader2, 
  AlertCircle, 
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

export default function AnalyticsPage() {
  // Filters
  const [dateRange, setDateRange] = useState('ALL'); // '7D', '30D', '90D', 'ALL'
  const [selectedCourse, setSelectedCourse] = useState('ALL');

  // Raw fetched data
  const [enrollments, setEnrollments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      // 3 parallel bulk queries
      const [enrollmentsRes, coursesRes, profilesRes] = await Promise.all([
        supabase
          .from('enrollments')
          .select('id, user_id, course_id, enrolled_at, status'),
        supabase
          .from('courses')
          .select('id, code, name, color, bg_color')
          .order('code', { ascending: true }),
        supabase
          .from('profiles')
          .select('id, college, created_at')
          .eq('role', 'learner'),
      ]);

      if (enrollmentsRes.error) throw enrollmentsRes.error;
      if (coursesRes.error) throw coursesRes.error;
      if (profilesRes.error) throw profilesRes.error;

      setEnrollments(enrollmentsRes.data || []);
      setCourses(coursesRes.data || []);
      setProfiles(profilesRes.data || []);
    } catch (err) {
      console.error('[AnalyticsPage] Data load error:', err);
      setError('Unable to load registration analytics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered dataset calculation based on Date Range and Course Filter
  const filteredData = useMemo(() => {
    const now = new Date();
    let cutoff = null;
    if (dateRange === '7D') cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    else if (dateRange === '30D') cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    else if (dateRange === '90D') cutoff = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

    // Filter enrollments
    const activeEnrollments = enrollments.filter(e => {
      if (selectedCourse !== 'ALL' && e.course_id !== selectedCourse) return false;
      if (cutoff && new Date(e.enrolled_at) < cutoff) return false;
      return true;
    });

    // Profile map for college lookup
    const profileMap = new Map();
    profiles.forEach(p => profileMap.set(p.id, p));

    // Top colleges count
    const collegeCounts = {};
    activeEnrollments.forEach(e => {
      const p = profileMap.get(e.user_id);
      const collegeName = p?.college?.trim() || 'Unknown College';
      collegeCounts[collegeName] = (collegeCounts[collegeName] || 0) + 1;
    });

    const sortedColleges = Object.entries(collegeCounts)
      .map(([college, count]) => ({ college, count }))
      .sort((a, b) => b.count - a.count);

    // Course distribution count (include all 6 tracks even if 0)
    const courseCountMap = {};
    courses.forEach(c => { courseCountMap[c.id] = 0; });
    activeEnrollments.forEach(e => {
      if (courseCountMap[e.course_id] !== undefined) {
        courseCountMap[e.course_id]++;
      }
    });

    const courseDistribution = courses.map(c => ({
      ...c,
      count: courseCountMap[c.id] || 0,
      percentage: activeEnrollments.length > 0 
        ? Math.round(((courseCountMap[c.id] || 0) / activeEnrollments.length) * 100) 
        : 0,
    }));

    // Daily timeline aggregation
    const dailyMap = {};
    activeEnrollments.forEach(e => {
      const dateKey = new Date(e.enrolled_at).toISOString().split('T')[0];
      dailyMap[dateKey] = (dailyMap[dateKey] || 0) + 1;
    });

    // Sort dates
    const sortedDates = Object.keys(dailyMap).sort();
    const timeline = sortedDates.map(d => ({
      date: d,
      count: dailyMap[d],
      formattedDate: new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    }));

    return {
      totalRegistrations: activeEnrollments.length,
      colleges: sortedColleges,
      courseDistribution,
      timeline,
    };
  }, [enrollments, courses, profiles, dateRange, selectedCourse]);

  // SVG Chart rendering helper
  const renderTimelineChart = () => {
    const { timeline } = filteredData;
    if (timeline.length === 0) {
      return (
        <div className="h-48 flex items-center justify-center text-gray-400 text-xs">
          No registration activity recorded for the selected filter period.
        </div>
      );
    }

    const maxCount = Math.max(...timeline.map(t => t.count), 1);
    const height = 160;
    const width = 640;
    const padding = 24;

    const points = timeline.map((pt, idx) => {
      const x = padding + (idx / Math.max(timeline.length - 1, 1)) * (width - 2 * padding);
      const y = height - padding - (pt.count / maxCount) * (height - 2 * padding);
      return { x, y, ...pt };
    });

    const pathString = points.reduce((acc, p, idx) => {
      return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
    }, '');

    const areaString = `${pathString} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

    return (
      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-48 select-none">
          <defs>
            <linearGradient id="regGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E31B23" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#E31B23" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#F3F4F6" strokeDasharray="3 3" />
          <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="#F3F4F6" strokeDasharray="3 3" />
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#E5E7EB" />

          {/* Fill Area */}
          <path d={areaString} fill="url(#regGradient)" />

          {/* Stroke Line */}
          <path d={pathString} fill="none" stroke="#E31B23" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Dots */}
          {points.map((p, i) => (
            <g key={i} className="group">
              <circle cx={p.x} cy={p.y} r="3.5" fill="#FFFFFF" stroke="#E31B23" strokeWidth="2" />
              <title>{`${p.formattedDate}: ${p.count} registrations`}</title>
            </g>
          ))}

          {/* Axis Labels */}
          {points.length > 0 && (
            <>
              <text x={points[0].x} y={height - 6} fontSize="10" fill="#9CA3AF" textAnchor="start">
                {points[0].formattedDate}
              </text>
              {points.length > 1 && (
                <text x={points[points.length - 1].x} y={height - 6} fontSize="10" fill="#9CA3AF" textAnchor="end">
                  {points[points.length - 1].formattedDate}
                </text>
              )}
            </>
          )}
        </svg>
      </div>
    );
  };

  return (
    <div className="admin-page space-y-6">
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-[#E31B23]" />
            Registration Analytics
          </h1>
          <p>
            Detailed learner registration and enrollment intelligence.
          </p>
        </div>

        {/* Filters */}
        <div className="admin-page-actions">
          {/* Date range filter */}
          <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200 text-xs font-semibold">
            {['7D', '30D', '90D', 'ALL'].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setDateRange(r)}
                className={`px-3 py-1 rounded-md transition-all ${
                  dateRange === r 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {r === 'ALL' ? 'All Time' : r}
              </button>
            ))}
          </div>

          {/* Course filter */}
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="admin-select py-1.5 h-auto text-xs"
          >
            <option value="ALL">All Curriculum Tracks</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code} — {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="admin-card p-16 flex flex-col items-center justify-center gap-3 text-gray-500">
          <Loader2 className="w-7 h-7 animate-spin text-[#E31B23]" />
          <span className="text-xs font-medium">Loading analytics telemetry...</span>
        </div>
      ) : error ? (
        <div className="admin-card p-12 text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-sm font-semibold text-gray-900">{error}</p>
          <button
            onClick={loadData}
            className="mt-3 text-xs font-semibold text-[#E31B23] hover:underline"
          >
            Retry Loading
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary Metric Header */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="admin-card p-4">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Filtered Registrations</span>
              <p className="text-2xl font-bold text-gray-900 mt-1">{filteredData.totalRegistrations}</p>
            </div>
            <div className="admin-card p-4">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Active Partner Colleges</span>
              <p className="text-2xl font-bold text-[#E31B23] mt-1">{filteredData.colleges.length}</p>
            </div>
            <div className="admin-card p-4">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Top Enrolled Track</span>
              <p className="text-2xl font-bold text-emerald-600 mt-1">
                {filteredData.courseDistribution.reduce((max, c) => c.count > max.count ? c : max, { code: '—', count: 0 }).code}
              </p>
            </div>
          </div>

          {/* Registrations Over Time Chart */}
          <div className="admin-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900 tracking-tight flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#E31B23]" />
                  Registrations Over Time
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Daily learner enrollment velocity across the platform
                </p>
              </div>
            </div>
            {renderTimelineChart()}
          </div>

          {/* Bottom Row: Course Distribution + Top Colleges */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Registrations by Course (All 6 Tracks) */}
            <div className="admin-card p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-900 tracking-tight flex items-center gap-2 mb-1">
                  <BookOpen className="w-4 h-4 text-[#E31B23]" />
                  Registrations by Course
                </h3>
                <p className="text-xs text-gray-500 mb-4">
                  Learner breakdown across all 6 flagship tracks
                </p>

                <div className="space-y-3.5">
                  {filteredData.courseDistribution.map((course) => (
                    <div key={course.id} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-gray-700">{course.code}</span>
                          <span className="font-medium text-gray-900">{course.name}</span>
                        </div>
                        <div className="font-mono text-gray-600">
                          <strong>{course.count}</strong> ({course.percentage}%)
                        </div>
                      </div>

                      {/* Bar indicator */}
                      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${course.percentage}%`,
                            backgroundColor: course.color || '#E31B23',
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Registrations by College (Top 10) */}
            <div className="admin-card p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-bold text-gray-900 tracking-tight flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-[#E31B23]" />
                    Top Colleges
                  </h3>
                  <span className="text-[11px] font-mono text-gray-400">
                    {filteredData.colleges.length} Total
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-4">
                  Colleges ranked by enrolled learner volume (Top 10)
                </p>

                {filteredData.colleges.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 text-xs">
                    No college data recorded.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {filteredData.colleges.slice(0, 10).map((col, idx) => {
                      const share = filteredData.totalRegistrations > 0
                        ? Math.round((col.count / filteredData.totalRegistrations) * 100)
                        : 0;

                      return (
                        <div
                          key={col.college}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 text-xs"
                        >
                          <div className="flex items-center gap-2 min-w-0 pr-2">
                            <span className="w-4 font-mono text-[11px] text-gray-400 flex-shrink-0">
                              #{idx + 1}
                            </span>
                            <span className="font-medium text-gray-900 truncate" title={col.college}>
                              {col.college}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0 font-mono text-gray-600">
                            <strong>{col.count}</strong>
                            <span className="text-gray-400 text-[11px]">({share}%)</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {filteredData.colleges.length > 10 && (
                <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-400 text-center">
                  + {filteredData.colleges.length - 10} additional partner institutions registered
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
