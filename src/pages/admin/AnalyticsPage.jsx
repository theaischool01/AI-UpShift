import React, { useState, useEffect, useMemo } from 'react';
import { 
  TrendingUp, 
  Users, 
  GraduationCap, 
  Calendar, 
  Loader2, 
  AlertCircle,
  Layers,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('ALL'); // '7D', '30D', '90D', 'ALL'

  const [enrollments, setEnrollments] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [enrollmentsRes, profilesRes] = await Promise.all([
        supabase
          .from('enrollments')
          .select('id, user_id, enrolled_at, status'),
        supabase
          .from('profiles')
          .select('id, college, created_at')
          .eq('role', 'learner'),
      ]);

      if (profilesRes.error) throw profilesRes.error;

      setEnrollments(enrollmentsRes.data || []);
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

  const filteredData = useMemo(() => {
    const now = new Date();
    let cutoff = null;
    if (dateRange === '7D') cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    else if (dateRange === '30D') cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    else if (dateRange === '90D') cutoff = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

    const activeEnrollments = enrollments.filter(e => {
      if (cutoff && new Date(e.enrolled_at) < cutoff) return false;
      return true;
    });

    const profileMap = new Map();
    profiles.forEach(p => profileMap.set(p.id, p));

    // College distribution
    const collegeCounts = {};
    activeEnrollments.forEach(e => {
      const p = profileMap.get(e.user_id);
      const collegeName = p?.college?.trim() || 'Unknown College';
      collegeCounts[collegeName] = (collegeCounts[collegeName] || 0) + 1;
    });

    const sortedColleges = Object.entries(collegeCounts)
      .map(([college, count]) => ({ college, count }))
      .sort((a, b) => b.count - a.count);

    // Status breakdown
    const statusCounts = { active: 0, completed: 0, dropped: 0, pending: 0 };
    activeEnrollments.forEach(e => {
      const st = (e.status || 'active').toLowerCase();
      if (statusCounts[st] !== undefined) {
        statusCounts[st]++;
      } else {
        statusCounts.active++;
      }
    });

    // Timeline
    const dailyMap = {};
    activeEnrollments.forEach(e => {
      const dateKey = new Date(e.enrolled_at || Date.now()).toISOString().split('T')[0];
      dailyMap[dateKey] = (dailyMap[dateKey] || 0) + 1;
    });

    const sortedDates = Object.keys(dailyMap).sort();
    const timeline = sortedDates.map(d => ({
      date: d,
      count: dailyMap[d],
      formattedDate: new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    }));

    return {
      totalRegistrations: activeEnrollments.length,
      colleges: sortedColleges,
      statusCounts,
      timeline,
    };
  }, [enrollments, profiles, dateRange]);

  return (
    <div className="admin-page">
      {/* Page Header */}
      <div className="admin-page-header">
        <div className="admin-page-title-group">
          <h1 className="admin-page-title">
            <TrendingUp size={22} />
            <span>UpShift Enrollment & Growth Analytics</span>
          </h1>
          <p className="admin-page-description">
            Program-wide learner velocity, cohort progression, and institutional enrollment breakdown.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="admin-page-actions">
          {/* Date Range Selector */}
          <div style={{ display: 'inline-flex', backgroundColor: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: '8px', padding: '2px' }}>
            {['7D', '30D', '90D', 'ALL'].map(range => (
              <button
                key={range}
                type="button"
                onClick={() => setDateRange(range)}
                style={{
                  padding: '5px 10px',
                  borderRadius: '6px',
                  fontSize: '11.5px',
                  fontFamily: 'monospace',
                  fontWeight: dateRange === range ? 700 : 500,
                  backgroundColor: dateRange === range ? '#111827' : 'transparent',
                  color: dateRange === range ? '#FFFFFF' : '#4B5563',
                  transition: 'all 0.15s ease'
                }}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div role="alert" className="admin-alert admin-alert-danger">
          <div className="admin-alert-content">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
          <button
            onClick={loadData}
            className="admin-btn admin-btn-sm admin-btn-secondary"
          >
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="admin-card" style={{ padding: '48px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', color: '#6B7280' }}>
          <Loader2 size={24} className="animate-spin" style={{ color: '#E31B23' }} />
          <span style={{ fontSize: '13px', fontWeight: 500 }}>Aggregating program analytics...</span>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Key KPI Row */}
          <div className="admin-grid-3">
            <div className="admin-card admin-card-compact">
              <span className="admin-stat-label">UpShift Enrollments</span>
              <p className="admin-stat-value" style={{ margin: '4px 0 0 0', color: '#E31B23' }}>
                {filteredData.totalRegistrations}
              </p>
              <span style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px', display: 'block' }}>
                Selected period admissions
              </span>
            </div>

            <div className="admin-card admin-card-compact">
              <span className="admin-stat-label">Represented Colleges</span>
              <p className="admin-stat-value" style={{ margin: '4px 0 0 0', color: '#2563EB' }}>
                {filteredData.colleges.length}
              </p>
              <span style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px', display: 'block' }}>
                Active partner universities
              </span>
            </div>

            <div className="admin-card admin-card-compact">
              <span className="admin-stat-label">Program Architecture</span>
              <p className="admin-stat-value" style={{ margin: '4px 0 0 0', color: '#059669' }}>
                1 Program
              </p>
              <span style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px', display: 'block' }}>
                Unified UpShift experience
              </span>
            </div>
          </div>

          {/* Split View: Program Enrollment Status & College Distribution */}
          <div className="admin-dashboard-split">
            {/* Program Enrollment Status */}
            <div className="admin-card">
              <div className="admin-card-header">
                <div className="admin-card-header-left">
                  <span className="admin-card-eyebrow" style={{ color: '#059669' }}>
                    <Layers size={13} />
                    <span>Progression</span>
                  </span>
                  <h3 className="admin-card-title">Program Enrollment Status</h3>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '8px' }}>
                {/* Active Row */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 600, color: '#111827', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                      Active Learners
                    </span>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#111827' }}>
                      {filteredData.statusCounts.active} ({filteredData.totalRegistrations > 0 ? Math.round((filteredData.statusCounts.active / filteredData.totalRegistrations) * 100) : 0}%)
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: '#F3F4F6', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${filteredData.totalRegistrations > 0 ? (filteredData.statusCounts.active / filteredData.totalRegistrations) * 100 : 0}%`,
                      height: '100%',
                      backgroundColor: '#10B981',
                      borderRadius: '9999px'
                    }} />
                  </div>
                </div>

                {/* Completed Row */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 600, color: '#111827', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3B82F6' }} />
                      Completed
                    </span>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#111827' }}>
                      {filteredData.statusCounts.completed} ({filteredData.totalRegistrations > 0 ? Math.round((filteredData.statusCounts.completed / filteredData.totalRegistrations) * 100) : 0}%)
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: '#F3F4F6', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${filteredData.totalRegistrations > 0 ? (filteredData.statusCounts.completed / filteredData.totalRegistrations) * 100 : 0}%`,
                      height: '100%',
                      backgroundColor: '#3B82F6',
                      borderRadius: '9999px'
                    }} />
                  </div>
                </div>

                {/* Dropped Row */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 600, color: '#111827', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
                      Dropped / Inactive
                    </span>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#111827' }}>
                      {filteredData.statusCounts.dropped} ({filteredData.totalRegistrations > 0 ? Math.round((filteredData.statusCounts.dropped / filteredData.totalRegistrations) * 100) : 0}%)
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: '#F3F4F6', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${filteredData.totalRegistrations > 0 ? (filteredData.statusCounts.dropped / filteredData.totalRegistrations) * 100 : 0}%`,
                      height: '100%',
                      backgroundColor: '#EF4444',
                      borderRadius: '9999px'
                    }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Top Colleges Roster */}
            <div className="admin-card">
              <div className="admin-card-header">
                <div className="admin-card-header-left">
                  <span className="admin-card-eyebrow" style={{ color: '#2563EB' }}>
                    <GraduationCap size={13} />
                    <span>Institutions</span>
                  </span>
                  <h3 className="admin-card-title">College Distribution</h3>
                </div>
              </div>

              {filteredData.colleges.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: '#9CA3AF', fontSize: '13px' }}>
                  No college data recorded in this period.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto' }}>
                  {filteredData.colleges.slice(0, 8).map((col, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderRadius: '8px', backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', fontSize: '12.5px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                        <span style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#E5E7EB', color: '#4B5563', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10.5px', fontFamily: 'monospace', fontWeight: 700, flexShrink: 0 }}>
                          {idx + 1}
                        </span>
                        <span style={{ fontWeight: 600, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {col.college}
                        </span>
                      </div>
                      <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#4B5563', flexShrink: 0 }}>
                        {col.count} {col.count === 1 ? 'student' : 'students'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
