import React, { useState, useMemo } from 'react';
import { Calendar, TrendingUp } from 'lucide-react';

export default function RegistrationChart({ enrollments = [], isLoading = false }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Aggregate enrollments by calendar day (robust 7-day window based on actual enrollment activity)
  const chartData = useMemo(() => {
    if (!enrollments || enrollments.length === 0) {
      return [];
    }

    // Map counts by local date string (YYYY-MM-DD)
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
      <div className="admin-card animate-pulse flex flex-col justify-between h-[300px]">
        <div className="h-5 w-44 bg-gray-200 rounded mb-4" />
        <div className="h-44 w-full bg-gray-100 rounded-xl" />
        <div className="h-4 w-56 bg-gray-100 rounded mt-4" />
      </div>
    );
  }

  return (
    <div className="admin-card flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-1.5 mb-1 text-[11px] font-mono text-[#E31B23] uppercase font-bold tracking-wider">
            <TrendingUp size={13} />
            <span>Velocity · Activity</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight m-0">
            Registrations Over Time
          </h3>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-200 self-start sm:self-auto">
          <Calendar size={13} />
          <span>{chartData.length > 0 ? `${chartData.length}-Day Activity Window` : 'Awaiting Activity'}</span>
        </div>
      </div>

      {/* Chart Canvas Area */}
      {chartData.length === 0 ? (
        <div className="h-44 flex flex-col items-center justify-center text-center p-6 border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-2">
            <Calendar size={18} />
          </div>
          <p className="text-sm font-semibold text-gray-700 mb-0.5">
            No registration timeline data yet
          </p>
          <p className="text-xs text-gray-500 font-mono">
            Registration events will dynamically populate this chart as students enroll.
          </p>
        </div>
      ) : (
        <div>
          {/* Main Visual Bar Stage with Y-Axis and Gridlines */}
          <div className="relative h-44 w-full pt-6 pb-6 pl-8 pr-2 flex items-end">
            {/* Background Reference Gridlines */}
            <div className="absolute inset-x-8 top-6 bottom-6 flex flex-col justify-between pointer-events-none border-l border-gray-200">
              {/* Max level */}
              <div className="border-b border-dashed border-gray-200/80 w-full relative">
                <span className="absolute -left-7 -top-2 text-[10px] font-mono font-semibold text-gray-400">
                  {maxCount}
                </span>
              </div>
              {/* Mid level */}
              <div className="border-b border-dashed border-gray-200/80 w-full relative">
                <span className="absolute -left-7 -top-2 text-[10px] font-mono font-semibold text-gray-400">
                  {Math.round(maxCount / 2)}
                </span>
              </div>
              {/* Baseline */}
              <div className="border-b border-gray-300 w-full relative">
                <span className="absolute -left-7 -top-2 text-[10px] font-mono font-semibold text-gray-400">
                  0
                </span>
              </div>
            </div>

            {/* Bar Columns */}
            <div className="relative z-10 w-full h-full flex items-end justify-between gap-2 sm:gap-4">
              {chartData.map((item, idx) => {
                const heightPercent = maxCount > 0 
                  ? Math.max((item.count / maxCount) * 100, item.count > 0 ? 15 : 0)
                  : 0;
                const isHovered = hoveredIndex === idx;

                return (
                  <div
                    key={item.date}
                    className="flex-1 flex flex-col items-center h-full justify-end group relative cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    {/* Floating Value Pill */}
                    <div 
                      className={`mb-1.5 transition-all text-xs font-mono font-bold ${
                        item.count > 0 
                          ? (isHovered ? 'text-[#E31B23] scale-110' : 'text-gray-900') 
                          : 'text-gray-300'
                      }`}
                    >
                      {item.count}
                    </div>

                    {/* Bar Pill */}
                    <div className="w-full max-w-[36px] flex items-end justify-center" style={{ height: '78%' }}>
                      {item.count > 0 ? (
                        <div
                          className="w-full rounded-t-lg transition-all duration-300 relative shadow-xs"
                          style={{
                            height: `${heightPercent}%`,
                            backgroundColor: isHovered ? '#B90E1B' : '#E31B23',
                          }}
                        >
                          <div className="absolute inset-x-0 top-0 h-1 bg-white/30 rounded-t-lg" />
                        </div>
                      ) : (
                        <div className="w-full h-1 bg-gray-200 rounded-full" />
                      )}
                    </div>

                    {/* Bottom Date Label */}
                    <span 
                      className={`absolute -bottom-5 text-[11px] font-mono tracking-tight transition-colors whitespace-nowrap ${
                        isHovered ? 'text-[#111827] font-bold' : 'text-[#6B7280]'
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Metainfo */}
          <div className="mt-7 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-mono text-gray-500">
            <span>Aggregated by enrollment timestamp</span>
            <span>Total in window: <strong className="text-gray-900 font-bold">{totalInWindow}</strong></span>
          </div>
        </div>
      )}
    </div>
  );
}
