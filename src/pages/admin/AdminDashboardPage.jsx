import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  Users, 
  BookOpen, 
  Award, 
  GraduationCap, 
  AlertCircle 
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import AdminMetricCard from '../../components/admin/AdminMetricCard';
import RegistrationChart from '../../components/admin/RegistrationChart';
import CourseDistribution from '../../components/admin/CourseDistribution';
import RecentRegistrationsTable from '../../components/admin/RecentRegistrationsTable';

export default function AdminDashboardPage() {
  const { refreshTrigger, setIsRefreshing } = useOutletContext() || {};

  const [learners, setLearners] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  // Fetch all dashboard datasets concurrently without N+1 query overhead
  const fetchDashboardData = useCallback(async () => {
    setErrorMessage(null);

    try {
      const [profilesRes, coursesRes, enrollmentsRes] = await Promise.all([
        // 1. Fetch only learner profiles (strictly exclude admins)
        supabase
          .from('profiles')
          .select('id, full_name, email, college, college_email, role, created_at')
          .eq('role', 'learner'),

        // 2. Fetch all 6 seeded courses
        supabase
          .from('courses')
          .select('id, code, name, category, color, bg_color')
          .order('code', { ascending: true }),

        // 3. Fetch all enrollments sorted by enrolled_at desc
        supabase
          .from('enrollments')
          .select('id, user_id, course_id, enrolled_at, status')
          .order('enrolled_at', { ascending: false }),
      ]);

      if (profilesRes.error) throw profilesRes.error;
      if (coursesRes.error) throw coursesRes.error;
      if (enrollmentsRes.error) throw enrollmentsRes.error;

      setLearners(profilesRes.data || []);
      setCourses(coursesRes.data || []);
      setEnrollments(enrollmentsRes.data || []);
    } catch (err) {
      console.error('[UpShift Admin Dashboard] Data fetch error:', err);
      setErrorMessage('Unable to load dashboard data. Please refresh and try again.');
    } finally {
      setIsLoading(false);
      if (setIsRefreshing) setIsRefreshing(false);
    }
  }, [setIsRefreshing]);

  // Initial load
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // External refresh triggered via AdminHeader
  useEffect(() => {
    if (refreshTrigger && refreshTrigger > 0) {
      fetchDashboardData();
    }
  }, [refreshTrigger, fetchDashboardData]);

  // In-memory relational lookup maps
  const learnersMap = useMemo(() => {
    const map = {};
    learners.forEach((l) => {
      map[l.id] = l;
    });
    return map;
  }, [learners]);

  const coursesMap = useMemo(() => {
    const map = {};
    courses.forEach((c) => {
      map[c.id] = c;
    });
    return map;
  }, [courses]);

  // Metric 1: Total Students (only role = 'learner')
  const totalStudents = learners.length;

  // Metric 2: Total Registrations (enrollments count)
  const totalRegistrations = enrollments.length;

  // Metric 3: Most Popular Course
  const topCourseInfo = useMemo(() => {
    if (enrollments.length === 0 || courses.length === 0) {
      return { name: 'None yet', subtitle: 'Awaiting first enrollment' };
    }

    const counts = {};
    enrollments.forEach((e) => {
      counts[e.course_id] = (counts[e.course_id] || 0) + 1;
    });

    let maxId = null;
    let maxCount = 0;

    Object.entries(counts).forEach(([courseId, count]) => {
      if (count > maxCount) {
        maxCount = count;
        maxId = courseId;
      }
    });

    if (!maxId || maxCount === 0) {
      return { name: 'None yet', subtitle: 'Awaiting enrollments' };
    }

    const foundCourse = courses.find((c) => c.id === maxId);
    const courseCode = foundCourse?.code ? `${foundCourse.code} · ` : '';
    const courseName = foundCourse?.name || maxId;

    const percentage = Math.round((maxCount / enrollments.length) * 100);
    return {
      name: `${courseCode}${courseName}`,
      subtitle: `${maxCount} ${maxCount === 1 ? 'enrollment' : 'enrollments'} (${percentage}%)`
    };
  }, [enrollments, courses]);

  // Metric 4: Top College
  const topCollegeInfo = useMemo(() => {
    if (learners.length === 0) {
      return { name: 'None yet', subtitle: 'Awaiting student registrations' };
    }

    const collegeCounts = {};
    learners.forEach((l) => {
      const collegeName = l.college?.trim();
      if (collegeName) {
        collegeCounts[collegeName] = (collegeCounts[collegeName] || 0) + 1;
      }
    });

    const entries = Object.entries(collegeCounts);
    if (entries.length === 0) {
      return { name: 'None specified', subtitle: 'No college info recorded' };
    }

    entries.sort((a, b) => b[1] - a[1]);
    const [topName, topCount] = entries[0];

    return {
      name: topName,
      subtitle: `${topCount} registered ${topCount === 1 ? 'student' : 'students'}`
    };
  }, [learners]);

  return (
    <div className="admin-page space-y-7">
      {/* Error State Banner */}
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
            onClick={fetchDashboardData}
            className="admin-btn-secondary text-xs"
          >
            Retry
          </button>
        </div>
      )}

      {/* ============================================================ */}
      {/* 1. REQUIRED METRIC CARDS (4 Required Metrics)                */}
      {/* ============================================================ */}
      <section aria-label="Key Registration Metrics">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Metric 1: Total Students (role = 'learner') */}
          <AdminMetricCard
            title="Total Students"
            value={totalStudents}
            subtitle="Registered learner accounts"
            icon={Users}
            accentColor="#E31B23"
            isLoading={isLoading}
          />

          {/* Metric 2: Total Registrations (enrollments) */}
          <AdminMetricCard
            title="Total Registrations"
            value={totalRegistrations}
            subtitle="Track course enrollments"
            icon={BookOpen}
            accentColor="#2563EB"
            isLoading={isLoading}
          />

          {/* Metric 3: Most Popular Course */}
          <AdminMetricCard
            title="Top Course"
            value={topCourseInfo.name}
            subtitle={topCourseInfo.subtitle}
            icon={Award}
            accentColor="#059669"
            isLoading={isLoading}
          />

          {/* Metric 4: Top College */}
          <AdminMetricCard
            title="Top College"
            value={topCollegeInfo.name}
            subtitle={topCollegeInfo.subtitle}
            icon={GraduationCap}
            accentColor="#EA580C"
            isLoading={isLoading}
          />
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. REGISTRATION ACTIVITY & COURSE DISTRIBUTION               */}
      {/* ============================================================ */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-7">
        {/* Registrations Over Time */}
        <RegistrationChart
          enrollments={enrollments}
          isLoading={isLoading}
        />

        {/* Registrations by Course (All 6 Flagship Tracks) */}
        <CourseDistribution
          courses={courses}
          enrollments={enrollments}
          isLoading={isLoading}
        />
      </section>

      {/* ============================================================ */}
      {/* 3. RECENT STUDENT REGISTRATIONS TABLE                        */}
      {/* ============================================================ */}
      <section>
        <RecentRegistrationsTable
          enrollments={enrollments}
          learnersMap={learnersMap}
          coursesMap={coursesMap}
          isLoading={isLoading}
        />
      </section>
    </div>
  );
}
