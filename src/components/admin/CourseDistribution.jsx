import React from 'react';
import { Layers } from 'lucide-react';

export default function CourseDistribution({ courses = [], tracks = [], enrollments = [], isLoading = false }) {
  const activeTracks = tracks.length > 0 ? tracks : courses;

  // Compute enrollment counts per track truthfully from real database records
  const trackStats = activeTracks.map((track) => {
    const count = enrollments.filter((e) => (e.track_id || e.course_id) === track.id).length;
    const percentage = enrollments.length > 0 
      ? Math.round((count / enrollments.length) * 100) 
      : 0;

    return {
      ...track,
      count,
      percentage
    };
  });

  if (isLoading) {
    return (
      <div className="admin-card" style={{ minHeight: '320px', opacity: 0.6 }}>
        <div style={{ width: '160px', height: '18px', backgroundColor: '#E5E7EB', borderRadius: '4px', marginBottom: '16px' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} style={{ height: '42px', backgroundColor: '#F9FAFB', borderRadius: '8px' }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      {/* Header */}
      <div className="admin-card-header">
        <div className="admin-card-header-left">
          <span className="admin-card-eyebrow" style={{ color: '#059669' }}>
            <Layers size={13} />
            <span>UpShift Tracks</span>
          </span>
          <h3 className="admin-card-title">
            Track Distribution
          </h3>
        </div>

        <span className="admin-card-badge">
          6 Applied Tracks
        </span>
      </div>

      {/* Tracks Distribution List */}
      <div className="admin-track-list">
        {trackStats.map((track) => {
          const accentColor = track.color || '#E31B23';

          return (
            <div key={track.id} className="admin-track-row">
              {/* Track Identity Left */}
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

              {/* Progress Bar Center */}
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

              {/* Percentage & Count Right */}
              <div className="admin-track-meta">
                <span className="admin-track-count">{track.count}</span>
                <span className="admin-track-pct">({track.percentage}%)</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Footer */}
      <div className="admin-chart-footer" style={{ marginTop: '16px' }}>
        <div className="admin-chart-legend">
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#059669' }} />
          <span>Active track assignments</span>
        </div>
      </div>
    </div>
  );
}
