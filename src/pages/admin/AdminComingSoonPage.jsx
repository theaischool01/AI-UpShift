import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Clock, 
  ArrowLeft, 
  Sparkles,
  Users,
  UserPlus,
  FileSpreadsheet,
  BookOpen,
  Briefcase,
  PlusCircle,
  FileText,
  TrendingUp,
  Settings
} from 'lucide-react';

const iconMap = {
  Students: Users,
  'Add Student': UserPlus,
  'Bulk Student Import': FileSpreadsheet,
  Courses: BookOpen,
  Gigs: Briefcase,
  'Add Gig': PlusCircle,
  'Bulk Gig Import': FileText,
  'Registration Analytics': TrendingUp,
  Settings: Settings,
};

export default function AdminComingSoonPage({ title = 'Feature Workspace' }) {
  const IconComponent = iconMap[title] || Clock;

  return (
    <div className="admin-page space-y-6">
      {/* Back Link */}
      <div>
        <Link 
          to="/admin/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Dashboard Overview</span>
        </Link>
      </div>

      {/* Main Feature Status Card */}
      <div className="admin-card text-center py-16 px-6 max-w-2xl mx-auto border border-gray-200 shadow-xs">
        <div className="w-14 h-14 rounded-2xl bg-red-50 text-[#E31B23] border border-red-100 mx-auto flex items-center justify-center mb-5">
          <IconComponent size={26} strokeWidth={2.2} />
        </div>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider text-[#E31B23] bg-red-50 border border-red-100 uppercase mb-3">
          <Sparkles size={12} />
          <span>Coming in Next Phase</span>
        </div>

        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-2">
          {title}
        </h2>

        <p className="text-sm text-gray-500 font-normal max-w-md mx-auto leading-relaxed mb-8">
          This workspace is being prepared for the next UpShift admin phase. Functional workflows will be integrated in subsequent phases.
        </p>

        <div className="flex items-center justify-center gap-3">
          <Link
            to="/admin/dashboard"
            className="admin-btn-secondary"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
