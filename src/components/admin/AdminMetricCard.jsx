import React from 'react';

export default function AdminMetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  accentColor = '#E31B23',
  isLoading = false,
}) {
  if (isLoading) {
    return (
      <div className="admin-metric-card" style={{ opacity: 0.6 }}>
        <div className="admin-metric-card-top">
          <div style={{ width: '80px', height: '14px', backgroundColor: '#E5E7EB', borderRadius: '4px' }} />
          <div style={{ width: '32px', height: '32px', backgroundColor: '#F3F4F6', borderRadius: '8px' }} />
        </div>
        <div>
          <div style={{ width: '60px', height: '28px', backgroundColor: '#E5E7EB', borderRadius: '6px', marginBottom: '8px' }} />
          <div style={{ width: '120px', height: '12px', backgroundColor: '#F3F4F6', borderRadius: '4px' }} />
        </div>
      </div>
    );
  }

  const isNumeric = typeof value === 'number' || (typeof value === 'string' && /^\d+$/.test(value));

  return (
    <div className="admin-metric-card">
      {/* Top row: Label and Icon */}
      <div className="admin-metric-card-top">
        <span className="admin-metric-card-label">
          {title}
        </span>
        {Icon && (
          <div 
            className="admin-metric-card-icon"
            style={{ 
              backgroundColor: `${accentColor}12`, 
              color: accentColor,
              border: `1px solid ${accentColor}25` 
            }}
          >
            <Icon size={16} strokeWidth={2.2} />
          </div>
        )}
      </div>

      {/* Metric value and description */}
      <div>
        <div 
          className={`admin-metric-card-value ${!isNumeric ? 'admin-metric-card-value-text' : ''}`}
          title={typeof value === 'string' ? value : undefined}
        >
          {value}
        </div>
        {subtitle && (
          <p className="admin-metric-card-sub">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
