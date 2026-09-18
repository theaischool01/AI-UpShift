import React, { useMemo } from 'react';
import { Calendar, TrendingUp } from 'lucide-react';

export default function RegistrationChart({ enrollments = [], isLoading = false }) {
  // Aggregate enrollments by calendar day (7-day window based on actual enrollment activity)
  const chartData = useMemo(() => {
    if (!enrollments || enrollments.length === 0) {
      return [];
    }

    const countsByDate = {};
    enrollments.forEach((e) => {
      if (!e.enrolled_at) return;
      const d = new Date(e.enrolled_at);
      if (isNaN(d.getTime())) return;
      const yr = d.getFullYear();
      const mo = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateKey = `${yr}-${mo}-${day}`;
      countsByDate[dateKey] = (countsByDate[dateKey] || 0) + 1;
    });

    const dates = Object.keys(countsByDate).sort();
    if (dates.length === 0) return [];

    // Anchor to the latest enrollment date, showing a 7-day window
    const [latestYr, latestMo, latestDay] = dates[dates.length - 1].split('-').map(Number);
    const end = new Date(latestYr, latestMo - 1, latestDay);
    const start = new Date(end);
    start.setDate(end.getDate() - 6);

    const result = [];
    const curr = new Date(start);

    while (curr <= end) {
      const yr = curr.getFullYear();
      const mo = String(curr.getMonth() + 1).padStart(2, '0');
      const day = String(curr.getDate()).padStart(2, '0');
      const key = `${yr}-${mo}-${day}`;
      const count = countsByDate[key] || 0;

      const label = curr.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });

      result.push({
        date: key,
        label,
        count,
      });

      curr.setDate(curr.getDate() + 1);
    }

    return result;
  }, [enrollments]);

  const maxCount = useMemo(() => {
    if (chartData.length === 0) return 4;
    const max = Math.max(...chartData.map((d) => d.count));
    return max > 0 ? max : 4;
  }, [chartData]);

  const totalInWindow = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0);
  }, [chartData]);

  if (isLoading) {
    return (
      <div className="admin-card" style={{ minHeight: '340px', opacity: 0.6 }}>
        <div style={{ width: '160px', height: '18px', backgroundColor: '#E5E7EB', borderRadius: '4px', marginBottom: '16px' }} />
        <div style={{ height: '220px', backgroundColor: '#F9FAFB', borderRadius: '10px' }} />
      </div>
    );
  }

  return (
    <div className="admin-card admin-activity-chart-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
      {/* Header */}
      <div>
        <div className="admin-card-header">
          <div className="admin-card-header-left">
            <span className="admin-card-eyebrow" style={{ color: '#E31B23' }}>
              <TrendingUp size={13} />
              <span>PROGRAM ACTIVITY</span>
            </span>
            <h3 className="admin-card-title">
              Registrations Over Time
            </h3>
          </div>

          <span className="admin-card-badge">
            <Calendar size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-1px' }} />
            {chartData.length > 0 ? '7-Day Window' : 'Awaiting Activity'}
          </span>
        </div>

        {/* Chart Canvas Area */}
        {chartData.length === 0 ? (
          <div style={{
            height: '210px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '24px',
            border: '1px dashed #E5E7EB',
            borderRadius: '10px',
            backgroundColor: '#FAFAFA'
          }}>
            <Calendar size={22} style={{ color: '#9CA3AF', marginBottom: '8px' }} />
            <p style={{ fontSize: '13.5px', fontWeight: 600, color: '#374151', margin: '0 0 4px 0' }}>
              No registration timeline data yet
            </p>
            <p style={{ fontSize: '11.5px', color: '#9CA3AF', fontFamily: 'monospace', margin: 0 }}>
              Registration events will dynamically populate this chart as students enroll.
            </p>
          </div>
        ) : (
          <div className="admin-chart-outer-box">
            {/* Main Visual Bar Stage with Y-Axis and Gridlines */}
            <div className="admin-chart-stage-container">
              {/* Background Reference Gridlines */}
              <div className="admin-chart-gridlines">
                {/* Max level */}
                <div className="admin-chart-gridline">
                  <span className="admin-chart-axis-label">
                    {maxCount}
                  </span>
                </div>
                {/* Mid level */}
                <div className="admin-chart-gridline">
                  <span className="admin-chart-axis-label">
                    {Math.round(maxCount / 2)}
                  </span>
                </div>
                {/* Baseline */}
                <div className="admin-chart-gridline admin-chart-gridline-solid">
                  <span className="admin-chart-axis-label">
                    0
                  </span>
                </div>
              </div>

              {/* Bar Columns */}
              <div className="admin-chart-columns-wrapper">
                {chartData.map((item) => {
                  const heightPercent = maxCount > 0 
                    ? Math.max((item.count / maxCount) * 100, item.count > 0 ? 16 : 0)
                    : 0;

                  return (
                    <div key={item.date} className="admin-chart-column">
                      {/* Floating Value Pill */}
                      <div className={`admin-chart-value-pill ${item.count > 0 ? 'is-active' : ''}`}>
                        {item.count > 0 ? item.count : '0'}
                      </div>

                      {/* Bar Pill */}
                      <div className="admin-chart-bar-slot">
                        {item.count > 0 ? (
                          <div
                            className="admin-chart-bar"
                            style={{ height: `${heightPercent}%` }}
                          >
                            <div className="admin-chart-bar-cap" />
                          </div>
                        ) : (
                          <div className="admin-chart-empty-bar" />
                        )}
                      </div>

                      {/* Bottom Date Label */}
                      <span className="admin-chart-date-label">
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Metainfo */}
      <div className="admin-chart-footer" style={{ marginTop: '16px', paddingTop: '10px' }}>
        <span>Aggregated by enrollment timestamp</span>
        <span>Total in window: <strong style={{ color: '#111827' }}>{totalInWindow}</strong></span>
      </div>
    </div>
  );
}
