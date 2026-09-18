import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  Users, 
  Award, 
  Briefcase,
  GraduationCap, 
  AlertCircle 
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import AdminMetricCard from '../../components/admin/AdminMetricCard';
import RegistrationChart from '../../components/admin/RegistrationChart';
import ProgramOverviewPanel from '../../components/admin/ProgramOverviewPanel';
import RecentRegistrationsTable from '../../components/admin/RecentRegistrationsTable';

export default function AdminDashboardPage() {
  const { refreshTrigger, setIsRefreshing } = useOutletContext() || {};

  const [learners, setLearners] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [gigsCount, setGigsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  // Fetch all dashboard datasets concurrently without N+1 query overhead
  const fetchDashboardData = useCallback(async () => {
    setErrorMessage(null);

    try {
      const [profilesRes, tracksRes, enrollmentsRes, gigsRes] = await Promise.all([
        // 1. Fetch only learner profiles (strictly exclude admins)
        supabase
          .from('profiles')
          .select('id, full_name, email, college, college_email, role, created_at')
          .eq('role', 'learner'),

        // 2. Fetch all seeded tracks for relational mapping
        supabase
          .from('tracks')
          .select('id, code, name, category, color, bg_color')
          .order('code', { ascending: true }),

        // 3. Fetch all enrollments sorted by enrolled_at desc
        supabase
          .from('enrollments')
          .select('id, user_id, track_id, enrolled_at, status')
          .order('enrolled_at', { ascending: false }),

        // 4. Fetch live opportunities count
        supabase
          .from('gigs')
          .select('id, is_active')
          .eq('is_active', true),
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
      setGigsCount(gigsRes.data?.length || 0);
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

  // Metric 1: Total Learners
  const totalStudents = learners.length;

  // Metric 2: Active Enrollments
  const totalRegistrations = enrollments.length;
  const activeEnrollmentsCount = useMemo(() => {
    return enrollments.filter(e => e.status === 'active').length || totalRegistrations;
  }, [enrollments, totalRegistrations]);

  // Metric 4: Top Institution
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
            Cohort analytics, program activity, and verified enrollment pipeline.
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
          title="TOTAL LEARNERS"
          value={isLoading ? '—' : totalStudents}
          subtitle="Registered student profiles"
          icon={Users}
          color="#E31B23"
          isLoading={isLoading}
        />

        <AdminMetricCard
          title="ACTIVE ENROLLMENTS"
          value={isLoading ? '—' : totalRegistrations}
          subtitle="Admitted into UpShift"
          icon={Award}
          color="#059669"
          isLoading={isLoading}
        />

        <AdminMetricCard
          title="LIVE OPPORTUNITIES"
          value={isLoading ? '—' : gigsCount}
          subtitle="Commercial gigs & bounties"
          icon={Briefcase}
          color="#2563EB"
          isLoading={isLoading}
        />

        <AdminMetricCard
          title="TOP INSTITUTION"
          value={isLoading ? '—' : topCollegeInfo.name}
          subtitle={isLoading ? '' : topCollegeInfo.subtitle}
          icon={GraduationCap}
          color="#D97706"
          isLoading={isLoading}
        />
      </div>

      {/* Middle Analytics Grid: Program Activity & Program Overview Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Program Activity Timeline Chart */}
        <div className="lg:col-span-7 flex flex-col">
          <RegistrationChart 
            enrollments={enrollments} 
            isLoading={isLoading} 
          />
        </div>

        {/* Right: Program Overview / Snapshot Panel */}
        <div className="lg:col-span-5 flex flex-col">
          <ProgramOverviewPanel 
            learnersCount={totalStudents} 
            enrollmentsCount={totalRegistrations} 
            activeEnrollmentsCount={activeEnrollmentsCount}
            gigsCount={gigsCount}
            isLoading={isLoading} 
          />
        </div>
      </div>

      {/* Bottom Table: Recent Registrations Roster */}
      <RecentRegistrationsTable
        enrollments={enrollments}
        learnersMap={learnersMap}
        tracksMap={tracksMap}
        isLoading={isLoading}
      />
    </div>
  );
}
