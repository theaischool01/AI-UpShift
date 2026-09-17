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
      <div className="admin-card animate-pulse flex flex-col justify-between h-[150px] p-6">
        <div className="flex items-center justify-between">
          <div className="h-3.5 w-24 bg-gray-200 rounded" />
          <div className="w-9 h-9 rounded-xl bg-gray-100" />
        </div>
        <div className="my-1">
          <div className="h-8 w-24 bg-gray-200 rounded mb-2" />
          <div className="h-3 w-36 bg-gray-100 rounded" />
        </div>
      </div>
    );
  }

  // Determine font size based on value length (numbers get 32px, longer course/college strings get 22-24px with natural wrap)
  const isNumeric = typeof value === 'number' || (typeof value === 'string' && /^\d+$/.test(value));

  return (
    <div className="admin-card hover:border-gray-300 transition-all flex flex-col justify-between h-[150px] p-6 group relative overflow-hidden">
      {/* Top row: Label and Icon */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-mono font-bold tracking-wider text-gray-500 uppercase truncate">
          {title}
        </span>
        {Icon && (
          <div 
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 shrink-0"
            style={{ 
              backgroundColor: `${accentColor}12`, 
              color: accentColor,
              border: `1px solid ${accentColor}25` 
            }}
          >
            <Icon size={18} strokeWidth={2.2} />
          </div>
        )}
      </div>

      {/* Metric value and description with natural wrapping */}
      <div className="min-w-0">
        <div 
          className={`font-extrabold text-gray-900 tracking-tight leading-tight mb-1 ${
            isNumeric ? 'text-3xl sm:text-[32px]' : 'text-lg sm:text-[20px] line-clamp-2'
          }`}
          title={typeof value === 'string' ? value : undefined}
        >
          {value}
        </div>
        {subtitle && (
          <p className="text-xs text-gray-500 truncate m-0">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
