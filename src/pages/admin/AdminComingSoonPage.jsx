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
    <div className="admin-page admin-page-compact">
      {/* Back Link */}
      <div>
        <Link 
          to="/admin/dashboard" 
          className="admin-btn admin-btn-sm admin-btn-secondary"
        >
          <ArrowLeft size={13} />
          <span>Back to Dashboard Overview</span>
        </Link>
      </div>

      {/* Main Feature Status Card */}
      <div className="admin-card" style={{ textAlign: 'center', padding: '48px 24px' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#FEF2F2', color: '#E31B23', border: '1px solid #FECACA', margin: '0 auto 16px auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <IconComponent size={24} strokeWidth={2.2} />
        </div>

        <span className="admin-card-eyebrow" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
          <Sparkles size={12} />
          <span>Coming in Next Phase</span>
        </span>

        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#111827', margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>
          {title}
        </h2>

        <p style={{ fontSize: '13px', color: '#6B7280', maxWidth: '420px', margin: '0 auto 24px auto', lineHeight: 1.5 }}>
          This workspace is being prepared for the next UpShift administrative phase.
        </p>

        <div>
          <Link
            to="/admin/dashboard"
            className="admin-btn admin-btn-primary"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
