import React, { useState, useEffect, useMemo } from 'react';
import { 
  TrendingUp, 
  Users, 
  GraduationCap, 
  Sparkles, 
  Calendar, 
  Loader2, 
  AlertCircle 
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('ALL'); // '7D', '30D', '90D', 'ALL'
  const [selectedTrack, setSelectedTrack] = useState('ALL');

  const [enrollments, setEnrollments] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [enrollmentsRes, tracksRes, profilesRes] = await Promise.all([
        supabase
          .from('enrollments')
          .select('id, user_id, track_id, enrolled_at, status'),
        supabase
          .from('tracks')
          .select('id, code, name, color, bg_color')
          .order('code', { ascending: true }),
        supabase
          .from('profiles')
          .select('id, college, created_at')
          .eq('role', 'learner'),
      ]);

      let activeTracks = tracksRes.data;
      if (tracksRes.error || !activeTracks) {
        const fallbackRes = await supabase
          .from('courses')
          .select('id, code, name, color, bg_color')
          .order('code', { ascending: true });
        activeTracks = fallbackRes.data || [];
      }

      let activeEnrollments = enrollmentsRes.data;
      if (enrollmentsRes.error || !activeEnrollments) {
        const fallbackRes = await supabase
          .from('enrollments')
          .select('id, user_id, course_id, enrolled_at, status');
        activeEnrollments = (fallbackRes.data || []).map(e => ({
          ...e,
          track_id: e.course_id
        }));
      }

      if (profilesRes.error) throw profilesRes.error;

      setEnrollments(activeEnrollments || []);
      setTracks(activeTracks || []);
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
      const tid = e.track_id || e.course_id;
      if (selectedTrack !== 'ALL' && tid !== selectedTrack) return false;
      if (cutoff && new Date(e.enrolled_at) < cutoff) return false;
      return true;
    });

    const profileMap = new Map();
    profiles.forEach(p => profileMap.set(p.id, p));

    const collegeCounts = {};
    activeEnrollments.forEach(e => {
      const p = profileMap.get(e.user_id);
      const collegeName = p?.college?.trim() || 'Unknown College';
      collegeCounts[collegeName] = (collegeCounts[collegeName] || 0) + 1;
    });

    const sortedColleges = Object.entries(collegeCounts)
      .map(([college, count]) => ({ college, count }))
      .sort((a, b) => b.count - a.count);

    const trackCountMap = {};
    tracks.forEach(t => { trackCountMap[t.id] = 0; });
    activeEnrollments.forEach(e => {
      const tid = e.track_id || e.course_id;
      if (trackCountMap[tid] !== undefined) {
        trackCountMap[tid]++;
      }
    });

    const trackDistribution = tracks.map(t => ({
      ...t,
      count: trackCountMap[t.id] || 0,
      percentage: activeEnrollments.length > 0 
        ? Math.round(((trackCountMap[t.id] || 0) / activeEnrollments.length) * 100) 
        : 0,
    }));

    const dailyMap = {};
    activeEnrollments.forEach(e => {
      const dateKey = new Date(e.enrolled_at).toISOString().split('T')[0];
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
      trackDistribution,
      timeline,
    };
  }, [enrollments, tracks, profiles, dateRange, selectedTrack]);

  return (
    <div className="admin-page">
      {/* Page Header */}
      <div className="admin-page-header">
        <div className="admin-page-title-group">
          <h1 className="admin-page-title">
            <TrendingUp size={22} />
            <span>Registration & Growth Analytics</span>
          </h1>
          <p className="admin-page-description">
            Explore enrollment velocity, track demand distribution, and institutional breakdown.
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

          {/* Track Selector */}
          <select
            value={selectedTrack}
            onChange={(e) => setSelectedTrack(e.target.value)}
            className="admin-select"
            style={{ width: 'auto', minWidth: '160px', height: '36px', fontSize: '12px' }}
          >
            <option value="ALL">All UpShift Tracks</option>
            {tracks.map(t => (
              <option key={t.id} value={t.id}>{t.code} — {t.name}</option>
            ))}
          </select>
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
          <span style={{ fontSize: '13px', fontWeight: 500 }}>Aggregating analytics data...</span>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Key KPI Row */}
          <div className="admin-grid-3">
            <div className="admin-card admin-card-compact">
              <span className="admin-stat-label">Active Period Registrations</span>
              <p className="admin-stat-value" style={{ margin: '4px 0 0 0', color: '#E31B23' }}>
                {filteredData.totalRegistrations}
              </p>
            </div>

            <div className="admin-card admin-card-compact">
              <span className="admin-stat-label">Unique Colleges / Universities</span>
              <p className="admin-stat-value" style={{ margin: '4px 0 0 0' }}>
                {filteredData.colleges.length}
              </p>
            </div>

            <div className="admin-card admin-card-compact">
              <span className="admin-stat-label">Track Diversity</span>
              <p className="admin-stat-value" style={{ margin: '4px 0 0 0', color: '#059669' }}>
                {tracks.length} Applied Tracks
              </p>
            </div>
          </div>

          {/* Split View: Track Distribution & College Leaderboard */}
          <div className="admin-dashboard-split">
            {/* Track Enrollment Distribution */}
            <div className="admin-card">
              <div className="admin-card-header">
                <div className="admin-card-header-left">
                  <span className="admin-card-eyebrow" style={{ color: '#059669' }}>
                    <Sparkles size={13} />
                    <span>Track Demand</span>
                  </span>
                  <h3 className="admin-card-title">Track Distribution</h3>
                </div>
              </div>

              <div className="admin-track-list">
                {filteredData.trackDistribution.map(track => {
                  const accentColor = track.color || '#E31B23';

                  return (
                    <div key={track.id} className="admin-track-row">
                      <div className="admin-track-identity">
                        <span 
                          className="admin-track-code"
                          style={{ 
                            backgroundColor: `${accentColor}18`, 
                            color: accentColor,
                            border: `1px solid ${accentColor}35`
                          }}
                        >
                          {track.code}
                        </span>
                        <span className="admin-track-name" title={track.name}>
                          {track.name}
                        </span>
                      </div>

                      <div className="admin-track-bar-container">
                        <div className="admin-track-bar-bg">
                          <div 
                            className="admin-track-bar-fill"
                            style={{ 
                              width: `${track.percentage}%`,
                              backgroundColor: accentColor,
                              minWidth: track.count > 0 ? '4px' : '0px'
                            }}
                          />
                        </div>
                      </div>

                      <div className="admin-track-meta">
                        <span className="admin-track-count">{track.count}</span>
                        <span className="admin-track-pct">({track.percentage}%)</span>
                      </div>
                    </div>
                  );
                })}
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
                  <h3 className="admin-card-title">Top Registered Colleges</h3>
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
