import React from 'react';
import { Users, GraduationCap, CheckCircle2, AlertCircle } from 'lucide-react';

export default function RecentRegistrationsTable({
  enrollments = [],
  learnersMap = {},
  coursesMap = {},
  tracksMap = {},
  isLoading = false,
}) {
  const activeTracksMap = Object.keys(tracksMap).length > 0 ? tracksMap : coursesMap;

  if (isLoading) {
    return (
      <div className="admin-card" style={{ opacity: 0.6 }}>
        <div style={{ width: '160px', height: '18px', backgroundColor: '#E5E7EB', borderRadius: '4px', marginBottom: '16px' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} style={{ height: '42px', backgroundColor: '#F9FAFB', borderRadius: '8px' }} />
          ))}
        </div>
      </div>
    );
  }

  // Take the most recent 10 enrollments
  const recentItems = enrollments.slice(0, 10);

  const formatDate = (isoString) => {
    if (!isoString) return '—';
    try {
      return new Intl.DateTimeFormat('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(new Date(isoString));
    } catch {
      return isoString.slice(0, 10);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '2px 8px',
            borderRadius: '9999px',
            fontSize: '10.5px',
            fontFamily: 'ui-monospace, monospace',
            fontWeight: 700,
            textTransform: 'uppercase',
            backgroundColor: '#ECFDF5',
            color: '#047857',
            border: '1px solid #A7F3D0'
          }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#10B981' }} />
            Active
          </span>
        );
      case 'completed':
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '2px 8px',
            borderRadius: '9999px',
            fontSize: '10.5px',
            fontFamily: 'ui-monospace, monospace',
            fontWeight: 700,
            textTransform: 'uppercase',
            backgroundColor: '#EFF6FF',
            color: '#1D4ED8',
            border: '1px solid #BFDBFE'
          }}>
            <CheckCircle2 size={11} />
            Completed
          </span>
        );
      case 'dropped':
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '2px 8px',
            borderRadius: '9999px',
            fontSize: '10.5px',
            fontFamily: 'ui-monospace, monospace',
            fontWeight: 700,
            textTransform: 'uppercase',
            backgroundColor: '#FEF2F2',
            color: '#B91C1C',
            border: '1px solid #FECACA'
          }}>
            <AlertCircle size={11} />
            Dropped
          </span>
        );
      default:
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '2px 8px',
            borderRadius: '9999px',
            fontSize: '10.5px',
            fontFamily: 'ui-monospace, monospace',
            fontWeight: 700,
            textTransform: 'uppercase',
            backgroundColor: '#F3F4F6',
            color: '#4B5563'
          }}>
            {status || 'Unknown'}
          </span>
        );
    }
  };

  return (
    <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FAFAFA' }}>
        <div>
          <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#111827', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Recent UpShift Registrations
          </h4>
          <p style={{ fontSize: '11.5px', color: '#6B7280', margin: '2px 0 0 0' }}>
            Latest learners provisioned into the UpShift Program
          </p>
        </div>
      </div>

      {recentItems.length === 0 ? (
        <div style={{ padding: '36px 20px', textAlign: 'center', color: '#6B7280' }}>
          <Users size={24} style={{ margin: '0 auto 8px auto', opacity: 0.4 }} />
          <p style={{ fontSize: '13px', fontWeight: 600, color: '#374151', margin: '0 0 2px 0' }}>
            No registrations recorded yet
          </p>
          <p style={{ fontSize: '12px', margin: 0 }}>
            New student enrollments will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="admin-table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>College / University</th>
                <th>Assigned Track</th>
                <th>Enrolled Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentItems.map((enrollment) => {
                const learner = learnersMap[enrollment.user_id] || {};
                const trackId = enrollment.track_id || enrollment.course_id;
                const track = activeTracksMap[trackId] || {};
                const accentColor = track.color || '#E31B23';

                return (
                  <tr key={enrollment.id}>
                    {/* Student Info */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ 
                          width: '26px', 
                          height: '26px', 
                          borderRadius: '50%', 
                          backgroundColor: '#F3F4F6', 
                          color: '#374151',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '11px',
                          fontWeight: 700,
                          flexShrink: 0
                        }}>
                          {(learner.full_name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span style={{ fontWeight: 700, color: '#111827', fontSize: '13px', display: 'block' }}>
                            {learner.full_name || 'Unknown Learner'}
                          </span>
                          <span style={{ fontSize: '11px', color: '#6B7280', fontFamily: 'monospace' }}>
                            {learner.email || '—'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* College */}
                    <td>
                      <span style={{ fontSize: '12.5px', color: '#374151' }}>
                        {learner.college || '—'}
                      </span>
                    </td>

                    {/* Assigned Track */}
                    <td>
                      <span style={{ 
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '2px 7px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 700,
                        backgroundColor: `${accentColor}15`,
                        color: accentColor,
                        border: `1px solid ${accentColor}30`,
                        fontFamily: 'monospace'
                      }}>
                        {track.code ? `${track.code} · ` : ''}{track.name || trackId || '—'}
                      </span>
                    </td>

                    {/* Enrolled Date */}
                    <td>
                      <span style={{ fontSize: '12px', color: '#6B7280', fontFamily: 'monospace' }}>
                        {formatDate(enrollment.enrolled_at)}
                      </span>
                    </td>

                    {/* Status */}
                    <td>
                      {getStatusBadge(enrollment.status)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
