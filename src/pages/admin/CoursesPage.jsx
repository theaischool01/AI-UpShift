import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Users, 
  Briefcase, 
  Loader2, 
  AlertCircle, 
  ArrowRight,
  Layers
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

export default function CoursesPage() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [stats, setStats] = useState({ totalModules: 6, totalGigs: 0 });

  const loadTracksData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [tracksRes, gigsRes] = await Promise.all([
        supabase
          .from('tracks')
          .select('id, code, name, category, tagline, color, bg_color, is_active, created_at')
          .order('code', { ascending: true }),
        supabase
          .from('gigs')
          .select('id, track_id')
      ]);

      let activeTracks = tracksRes.data;
      if (tracksRes.error || !activeTracks) {
        const fallbackRes = await supabase
          .from('courses')
          .select('id, code, name, category, tagline, color, bg_color, is_active, created_at')
          .order('code', { ascending: true });
        activeTracks = fallbackRes.data || [];
      }

      let activeGigs = gigsRes.data;
      if (gigsRes.error || !activeGigs) {
        const fallbackRes = await supabase
          .from('gigs')
          .select('id, course_id');
        activeGigs = (fallbackRes.data || []).map(g => ({
          ...g,
          track_id: g.course_id
        }));
      }

      const gigCounts = {};
      (activeGigs || []).forEach(g => {
        const tid = g.track_id || g.course_id;
        if (tid) {
          gigCounts[tid] = (gigCounts[tid] || 0) + 1;
        }
      });

      const processedTracks = (activeTracks || []).map(track => ({
        ...track,
        gigCount: gigCounts[track.id] || gigCounts[track.code?.toLowerCase()] || 0,
      }));

      setTracks(processedTracks);
      setStats({
        totalModules: processedTracks.length || 6,
        totalGigs: (activeGigs || []).length,
      });
    } catch (err) {
      console.error('[CoursesPage] Data load error:', err);
      setError('Unable to load modules and metrics. Please try again.');
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
            <Layers size={22} />
            <span>UpShift Modules</span>
          </h1>
          <p className="admin-page-description">
            Six applied modules inside the UpShift program.
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
          <span className="admin-stat-label">Program Structure</span>
          <p className="admin-stat-value" style={{ margin: '4px 0 0 0', color: '#111827' }}>
            1 Program
          </p>
          <span style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px', display: 'block' }}>
            UpShift Complete AI Program
          </span>
        </div>
        <div className="admin-card admin-card-compact">
          <span className="admin-stat-label">Applied Modules</span>
          <p className="admin-stat-value" style={{ margin: '4px 0 0 0', color: '#E31B23' }}>
            {stats.totalModules} Modules
          </p>
          <span style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px', display: 'block' }}>
            M1 through M6 curriculum
          </span>
        </div>
        <div className="admin-card admin-card-compact">
          <span className="admin-stat-label">Module Opportunities</span>
          <p className="admin-stat-value" style={{ margin: '4px 0 0 0', color: '#059669' }}>
            {stats.totalGigs} Live Briefs
          </p>
          <span style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px', display: 'block' }}>
            Commercial tasks mapped to modules
          </span>
        </div>
      </div>

      {/* Modules Cards Grid */}
      {loading ? (
        <div className="admin-card" style={{ padding: '48px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', color: '#6B7280' }}>
          <Loader2 size={24} className="animate-spin" style={{ color: '#E31B23' }} />
          <span style={{ fontSize: '13px', fontWeight: 500 }}>Loading UpShift modules...</span>
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
                  {/* Top Module Code + Category */}
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

                  {/* Module Title & Tagline */}
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#111827', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
                    {track.name}
                  </h3>
                  <p style={{ fontSize: '12.5px', color: '#6B7280', margin: 0, lineHeight: 1.5 }}>
                    {track.tagline || 'Specialized hands-on commercial proof of work module.'}
                  </p>
                </div>

                {/* Bottom Metric & Gigs Link */}
                <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #F3F4F6' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', fontSize: '12px' }}>
                    <span style={{ color: '#6B7280' }}>Relevant Opportunities:</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#111827', fontWeight: 700 }}>
                      <Briefcase size={14} style={{ color: '#059669' }} />
                      <span>{track.gigCount} {track.gigCount === 1 ? 'Opportunity' : 'Opportunities'}</span>
                    </div>
                  </div>

                  <Link
                    to={`/admin/gigs`}
                    className="admin-btn admin-btn-sm admin-btn-secondary"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    <span>View Module Opportunities</span>
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
