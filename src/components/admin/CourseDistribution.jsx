import React from 'react';
import { Layers } from 'lucide-react';

export default function CourseDistribution({ courses = [], enrollments = [], isLoading = false }) {
  // Compute enrollment counts per course truthfully from real database records
  const courseStats = courses.map((course) => {
    const count = enrollments.filter((e) => e.course_id === course.id).length;
    const percentage = enrollments.length > 0 
      ? Math.round((count / enrollments.length) * 100) 
      : 0;

    return {
      ...course,
      count,
      percentage
    };
  });

  if (isLoading) {
    return (
      <div className="admin-card animate-pulse flex flex-col justify-between h-[300px]">
        <div className="h-5 w-44 bg-gray-200 rounded mb-4" />
        <div className="space-y-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-9 w-full bg-gray-100 rounded-lg" />
          ))}
        </div>
        <div className="h-4 w-48 bg-gray-100 rounded mt-3" />
      </div>
    );
  }

  return (
    <div className="admin-card flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-1.5 mb-1 text-[11px] font-mono text-emerald-700 uppercase font-bold tracking-wider">
            <Layers size={13} />
            <span>Curriculum Tracks</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight m-0">
            Registrations by Course
          </h3>
        </div>

        <span className="text-xs font-mono text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-200 flex-shrink-0">
          6 Flagship Tracks
        </span>
      </div>

      {/* Courses Distribution List: Compact Analytical Row Layout */}
      <div className="space-y-1.5">
        {courseStats.map((course) => {
          const accentColor = course.color || '#E31B23';

          return (
            <div 
              key={course.id}
              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-50/70 border border-gray-200/70 hover:bg-gray-100/70 transition-all group"
              style={{ minHeight: '46px' }}
            >
              {/* Course Identity Left: Pill + Name */}
              <div className="flex items-center gap-2 w-48 sm:w-56 shrink-0 min-w-0">
                <span 
                  className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider shrink-0"
                  style={{ 
                    backgroundColor: `${accentColor}15`, 
                    color: accentColor,
                    border: `1px solid ${accentColor}30`
                  }}
                >
                  {course.code}
                </span>
                <span className="text-xs font-semibold text-gray-800 truncate group-hover:text-gray-900 transition-colors">
                  {course.name}
                </span>
              </div>

              {/* Progress Bar Center */}
              <div className="flex-1 min-w-[80px]">
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{ 
                      width: `${course.percentage}%`,
                      backgroundColor: accentColor,
                      minWidth: course.count > 0 ? '4px' : '0px'
                    }}
                  />
                </div>
              </div>

              {/* Percentage & Count Right */}
              <div className="w-20 text-right shrink-0 flex items-center justify-end gap-1.5 text-xs font-mono">
                <span className="font-bold text-gray-900">{course.count}</span>
                <span className="text-gray-400">({course.percentage}%)</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Footer */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-mono text-gray-500">
        <span>Total enrolled: {enrollments.length} seats</span>
        <span>Distribution across 6 flagship tracks</span>
      </div>
    </div>
  );
}
