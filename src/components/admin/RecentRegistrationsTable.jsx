import React from 'react';
import { Users, GraduationCap, CheckCircle2, AlertCircle } from 'lucide-react';

export default function RecentRegistrationsTable({
  enrollments = [],
  learnersMap = {},
  coursesMap = {},
  isLoading = false,
}) {
  if (isLoading) {
    return (
      <div className="admin-card animate-pulse">
        <div className="h-5 w-48 bg-gray-200 rounded mb-4" />
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 w-full bg-gray-100 rounded-lg" />
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
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Active
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-blue-50 text-blue-700 border border-blue-200">
            <CheckCircle2 size={11} />
            Completed
          </span>
        );
      case 'dropped':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-red-50 text-red-700 border border-red-200">
            <AlertCircle size={11} />
            Dropped
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-gray-100 text-gray-700 border border-gray-200">
            {status || 'Active'}
          </span>
        );
    }
  };

  return (
    <div className="admin-card">
      {/* Table Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-1.5 mb-1 text-[11px] font-mono text-[#E31B23] uppercase font-bold tracking-wider">
            <GraduationCap size={13} />
            <span>Learner Roster</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight m-0">
            Recent Registrations
          </h3>
        </div>

        <span className="text-xs font-mono text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-200 self-start sm:self-auto">
          Showing {recentItems.length} most recent
        </span>
      </div>

      {recentItems.length === 0 ? (
        /* Empty State */
        <div className="py-12 text-center border border-dashed border-gray-200 rounded-xl bg-gray-50/50 px-4">
          <div className="w-10 h-10 rounded-full bg-gray-100 mx-auto flex items-center justify-center text-gray-400 mb-2">
            <Users size={18} />
          </div>
          <h4 className="text-sm font-bold text-gray-900 mb-0.5 uppercase tracking-wide">
            No Learner Registrations Yet
          </h4>
          <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
            Registered students and their enrolled flagship courses will appear here in chronological order once enrollments are created.
          </p>
        </div>
      ) : (
        /* Normalized Data Table */
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">College</th>
                <th className="py-3 px-4">College Email</th>
                <th className="py-3 px-4">Course</th>
                <th className="py-3 px-4">Registered</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentItems.map((item) => {
                const learner = learnersMap[item.user_id] || {};
                const course = coursesMap[item.course_id] || {};
                const studentName = learner.full_name || learner.email || 'Anonymous Student';
                const courseColor = course.color || '#E31B23';

                return (
                  <tr key={item.id}>
                    {/* Student Column */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-gray-900 text-xs">
                        {studentName}
                      </div>
                      <div className="text-[11px] font-mono text-gray-400 mt-0.5">
                        {learner.email}
                      </div>
                    </td>

                    {/* College Column */}
                    <td className="py-3 px-4 text-gray-700 text-xs">
                      {learner.college || '—'}
                    </td>

                    {/* College Email Column */}
                    <td className="py-3 px-4 font-mono text-gray-500 text-[11px]">
                      {learner.college_email || '—'}
                    </td>

                    {/* Course Column */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span 
                          className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase shrink-0"
                          style={{ 
                            backgroundColor: `${courseColor}15`, 
                            color: courseColor,
                            border: `1px solid ${courseColor}30`
                          }}
                        >
                          {course.code || 'M'}
                        </span>
                        <span className="font-medium text-gray-800 truncate max-w-[180px] text-xs">
                          {course.name || item.course_id}
                        </span>
                      </div>
                    </td>

                    {/* Registered Date Column */}
                    <td className="py-3 px-4 font-mono text-gray-500 text-xs whitespace-nowrap">
                      {formatDate(item.enrolled_at)}
                    </td>

                    {/* Status Column */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      {getStatusBadge(item.status)}
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
