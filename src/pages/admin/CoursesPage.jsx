import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Users, 
  Briefcase, 
  Loader2, 
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

export default function CoursesPage() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [stats, setStats] = useState({ totalTracks: 0, totalEnrollments: 0, totalGigs: 0 });

  const loadTracksData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [tracksRes, enrollmentsRes, gigsRes] = await Promise.all([
        supabase
          .from('tracks')
          .select('id, code, name, category, tagline, color, bg_color, is_active, created_at')
          .order('code', { ascending: true }),
        supabase
          .from('enrollments')
          .select('track_id'),
        supabase
          .from('gigs')
          .select('track_id')
      ]);

      let activeTracks = tracksRes.data;
      if (tracksRes.error || !activeTracks) {
        const fallbackRes = await supabase
          .from('courses')
          .select('id, code, name, category, tagline, color, bg_color, is_active, created_at')
          .order('code', { ascending: true });
        activeTracks = fallbackRes.data || [];
      }

      let activeEnrollments = enrollmentsRes.data;
      if (enrollmentsRes.error || !activeEnrollments) {
        const fallbackRes = await supabase
          .from('enrollments')
          .select('course_id');
        activeEnrollments = (fallbackRes.data || []).map(e => ({
          track_id: e.course_id
        }));
      }

      let activeGigs = gigsRes.data;
      if (gigsRes.error || !activeGigs) {
        const fallbackRes = await supabase
          .from('gigs')
          .select('course_id');
        activeGigs = (fallbackRes.data || []).map(g => ({
          track_id: g.course_id
        }));
      }

      const enrollmentCounts = {};
      (activeEnrollments || []).forEach(e => {
        if (e.track_id) {
          enrollmentCounts[e.track_id] = (enrollmentCounts[e.track_id] || 0) + 1;
        }
      });

      const gigCounts = {};
      (activeGigs || []).forEach(g => {
        if (g.track_id) {
          gigCounts[g.track_id] = (gigCounts[g.track_id] || 0) + 1;
        }
      });

      const processedTracks = (activeTracks || []).map(track => ({
        ...track,
        studentCount: enrollmentCounts[track.id] || 0,
        gigCount: gigCounts[track.id] || 0,
      }));

      setTracks(processedTracks);
      setStats({
        totalTracks: processedTracks.length,
        totalEnrollments: (activeEnrollments || []).length,
        totalGigs: (activeGigs || []).length,
      });
    } catch (err) {
      console.error('[CoursesPage] Data load error:', err);
      setError('Unable to load tracks and metrics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTracksData();
  }, []);

  return (
    <div className="admin-page">
      {/* Page Header */}
      <div className="admin-page-header">
        <div className="admin-page-title-group">
          <h1 className="admin-page-title">
            <Sparkles size={22} />
            <span>UpShift Applied Tracks</span>
          </h1>
          <p className="admin-page-description">
            Manage and monitor the six applied UpShift specializations and learner distributions.
          </p>
        </div>

        <div className="admin-page-actions">
          <Link
            to="/admin/students"
            className="admin-btn admin-btn-secondary"
          >
            <Users size={14} />
            <span>Students Directory</span>
          </Link>
          <Link
            to="/admin/gigs"
            className="admin-btn admin-btn-secondary"
          >
            <Briefcase size={14} />
            <span>Gigs Directory</span>
          </Link>
        </div>
      </div>

      {/* Overview Stat Badges */}
      <div className="admin-grid-3">
        <div className="admin-card admin-card-compact">
          <span className="admin-stat-label">Active Applied Tracks</span>
          <p className="admin-stat-value" style={{ margin: '4px 0 0 0' }}>{stats.totalTracks}</p>
        </div>
        <div className="admin-card admin-card-compact">
          <span className="admin-stat-label">Total Program Learners</span>
          <p className="admin-stat-value" style={{ margin: '4px 0 0 0', color: '#E31B23' }}>{stats.totalEnrollments}</p>
        </div>
        <div className="admin-card admin-card-compact">
          <span className="admin-stat-label">Total Commercial Gigs</span>
          <p className="admin-stat-value" style={{ margin: '4px 0 0 0', color: '#059669' }}>{stats.totalGigs}</p>
        </div>
      </div>

      {/* Tracks Cards Grid */}
      {loading ? (
        <div className="admin-card" style={{ padding: '48px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', color: '#6B7280' }}>
          <Loader2 size={24} className="animate-spin" style={{ color: '#E31B23' }} />
          <span style={{ fontSize: '13px', fontWeight: 500 }}>Loading applied tracks and metrics...</span>
        </div>
      ) : error ? (
        <div className="admin-card" style={{ padding: '36px', textAlign: 'center' }}>
          <AlertCircle size={28} style={{ color: '#DC2626', margin: '0 auto 8px auto' }} />
          <p style={{ fontSize: '14px', fontWeight: 700, color: '#111827', margin: '0 0 10px 0' }}>{error}</p>
          <button
            onClick={loadTracksData}
            className="admin-btn admin-btn-sm admin-btn-secondary"
          >
            Retry Loading
          </button>
        </div>
      ) : (
        <div className="admin-courses-grid">
          {tracks.map((track) => {
            const trackColor = track.color || '#E31B23';

            return (
              <div key={track.id} className="admin-course-card">
                <div>
                  {/* Top Track Code + Category */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span 
                      style={{ 
                        backgroundColor: `${trackColor}18`, 
                        color: trackColor,
                        border: `1px solid ${trackColor}35`,
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontFamily: 'monospace',
                        fontWeight: 800,
                        textTransform: 'uppercase'
                      }}
                    >
                      {track.code}
                    </span>
                    <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#9CA3AF', textTransform: 'uppercase' }}>
                      {track.category}
                    </span>
                  </div>

                  {/* Track Title & Tagline */}
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#111827', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
                    {track.name}
                  </h3>
                  <p style={{ fontSize: '12.5px', color: '#6B7280', margin: 0, lineHeight: 1.5 }}>
                    {track.tagline || 'Specialized hands-on commercial proof of work track.'}
                  </p>
                </div>

                {/* Bottom Metric Badges */}
                <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #F3F4F6' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px', fontSize: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4B5563' }}>
                      <Users size={14} style={{ color: '#6B7280' }} />
                      <span>{track.studentCount} {track.studentCount === 1 ? 'Learner' : 'Learners'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4B5563' }}>
                      <Briefcase size={14} style={{ color: '#6B7280' }} />
                      <span>{track.gigCount} {track.gigCount === 1 ? 'Gig' : 'Gigs'}</span>
                    </div>
                  </div>

                  <Link
                    to={`/admin/students`}
                    className="admin-btn admin-btn-sm admin-btn-secondary"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    <span>View Track Students</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
