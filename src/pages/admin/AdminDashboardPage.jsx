import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  Users, 
  Sparkles, 
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
  const [tracks, setTracks] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  // Fetch all dashboard datasets concurrently without N+1 query overhead
  const fetchDashboardData = useCallback(async () => {
    setErrorMessage(null);

    try {
      const [profilesRes, tracksRes, enrollmentsRes] = await Promise.all([
        // 1. Fetch only learner profiles (strictly exclude admins)
        supabase
          .from('profiles')
          .select('id, full_name, email, college, college_email, role, created_at')
          .eq('role', 'learner'),

        // 2. Fetch all 6 seeded tracks
        supabase
          .from('tracks')
          .select('id, code, name, category, color, bg_color')
          .order('code', { ascending: true }),

        // 3. Fetch all enrollments sorted by enrolled_at desc
        supabase
          .from('enrollments')
          .select('id, user_id, track_id, enrolled_at, status')
          .order('enrolled_at', { ascending: false }),
      ]);

      // Fallback if tracks table rename is in progress
      let activeTracks = tracksRes.data;
      if (tracksRes.error || !activeTracks) {
        const fallbackRes = await supabase
          .from('courses')
          .select('id, code, name, category, color, bg_color')
          .order('code', { ascending: true });
        activeTracks = fallbackRes.data || [];
      }

      let activeEnrollments = enrollmentsRes.data;
      if (enrollmentsRes.error || !activeEnrollments) {
        const fallbackRes = await supabase
          .from('enrollments')
          .select('id, user_id, course_id, enrolled_at, status')
          .order('enrolled_at', { ascending: false });
        activeEnrollments = (fallbackRes.data || []).map(e => ({
          ...e,
          track_id: e.course_id
        }));
      }

      if (profilesRes.error) throw profilesRes.error;

      setLearners(profilesRes.data || []);
      setTracks(activeTracks || []);
      setEnrollments(activeEnrollments || []);
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

  const tracksMap = useMemo(() => {
    const map = {};
    tracks.forEach((t) => {
      map[t.id] = t;
    });
    return map;
  }, [tracks]);

  // Metric 1: Total Students (only role = 'learner')
  const totalStudents = learners.length;

  // Metric 2: Total Program Registrations
  const totalRegistrations = enrollments.length;

  // Metric 3: Most Popular Track
  const topTrackInfo = useMemo(() => {
    if (enrollments.length === 0 || tracks.length === 0) {
      return { name: 'None yet', subtitle: 'Awaiting first enrollment' };
    }

    const counts = {};
    enrollments.forEach((e) => {
      const tid = e.track_id || e.course_id;
      if (tid) {
        counts[tid] = (counts[tid] || 0) + 1;
      }
    });

    let maxId = null;
    let maxCount = 0;

    Object.entries(counts).forEach(([trackId, count]) => {
      if (count > maxCount) {
        maxCount = count;
        maxId = trackId;
      }
    });

    if (!maxId || maxCount === 0) {
      return { name: 'None yet', subtitle: 'Awaiting track assignments' };
    }

    const foundTrack = tracks.find((t) => t.id === maxId || t.code === maxId);
    const trackCode = foundTrack?.code ? `${foundTrack.code} · ` : '';
    const trackName = foundTrack?.name || maxId;

    const percentage = Math.round((maxCount / enrollments.length) * 100);
    return {
      name: `${trackCode}${trackName}`,
      subtitle: `${maxCount} ${maxCount === 1 ? 'enrollment' : 'enrollments'} (${percentage}%)`
    };
  }, [enrollments, tracks]);

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
      subtitle: `${topCount} ${topCount === 1 ? 'student' : 'students'} (${Math.round((topCount / learners.length) * 100)}%)`
    };
  }, [learners]);

  return (
    <div className="admin-page">
      {/* Normalized Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">
            <span>Program Overview</span>
          </h1>
          <p className="admin-page-description">
            Live cohort analytics, track distributions, and institutional enrollment metrics.
          </p>
        </div>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div
          role="alert"
          className="admin-alert admin-alert-danger"
        >
          <div className="admin-alert-content">
            <AlertCircle size={16} />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={fetchDashboardData}
            className="admin-btn admin-btn-sm admin-btn-secondary"
          >
            Retry
          </button>
        </div>
      )}

      {/* Four KPI Metrics Grid */}
      <div className="admin-metrics-grid">
        <AdminMetricCard
          title="Total Students"
          value={isLoading ? '—' : totalStudents}
          subtitle="Unique learner profiles"
          icon={Users}
          color="#E31B23"
          isLoading={isLoading}
        />

        <AdminMetricCard
          title="Program Registrations"
          value={isLoading ? '—' : totalRegistrations}
          subtitle="UpShift admissions"
          icon={Award}
          color="#059669"
          isLoading={isLoading}
        />

        <AdminMetricCard
          title="Top Track"
          value={isLoading ? '—' : topTrackInfo.name}
          subtitle={isLoading ? '' : topTrackInfo.subtitle}
          icon={Sparkles}
          color="#4F46E5"
          isLoading={isLoading}
        />

        <AdminMetricCard
          title="Top College"
          value={isLoading ? '—' : topCollegeInfo.name}
          subtitle={isLoading ? '' : topCollegeInfo.subtitle}
          icon={GraduationCap}
          color="#D97706"
          isLoading={isLoading}
        />
      </div>

      {/* Middle Analytics Grid: Registration Velocity & Track Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 2 Cols: Registration Velocity Chart */}
        <div className="lg:col-span-2">
          <RegistrationChart 
            enrollments={enrollments} 
            isLoading={isLoading} 
          />
        </div>

        {/* 1 Col: Track Distribution Breakdown */}
        <div className="lg:col-span-1">
          <CourseDistribution 
            courses={tracks} 
            enrollments={enrollments} 
            isLoading={isLoading} 
          />
        </div>
      </div>

      {/* Bottom Table: Recent Registrations Roster */}
      <RecentRegistrationsTable
        enrollments={enrollments}
        learnersMap={learnersMap}
        coursesMap={tracksMap}
        isLoading={isLoading}
      />
    </div>
  );
}
