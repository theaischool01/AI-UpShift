import React from 'react';
import { Layers, ArrowRight, ShieldCheck, Briefcase, Users, CheckCircle2, Award } from 'lucide-react';

export default function ProgramOverviewPanel({
  learnersCount = 0,
  enrollmentsCount = 0,
  activeEnrollmentsCount = 0,
  gigsCount = 0,
  isLoading = false,
}) {
  if (isLoading) {
    return (
      <div className="admin-card" style={{ minHeight: '340px', opacity: 0.6 }}>
        <div style={{ width: '160px', height: '18px', backgroundColor: '#E5E7EB', borderRadius: '4px', marginBottom: '16px' }} />
        <div style={{ height: '220px', backgroundColor: '#F9FAFB', borderRadius: '10px' }} />
      </div>
    );
  }

  return (
    <div className="admin-card admin-program-overview-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
      {/* Top Header */}
      <div>
        <div className="admin-card-header" style={{ marginBottom: '12px' }}>
          <div className="admin-card-header-left">
            <span className="admin-card-eyebrow" style={{ color: '#E31B23' }}>
              <Layers size={13} />
              <span>UPSHIFT PROGRAM</span>
            </span>
            <h3 className="admin-card-title">
              Program Overview
            </h3>
          </div>

          <span className="admin-card-badge" style={{ color: '#059669', backgroundColor: '#ECFDF5', borderColor: '#A7F3D0', fontWeight: 700 }}>
            1 Active Program
          </span>
        </div>

        <p style={{ fontSize: '12.5px', color: '#6B7280', margin: '0 0 16px 0', lineHeight: 1.45 }}>
          One applied AI program. Skills, proof of work, and commercial opportunities.
        </p>

        {/* Visual Pipeline Progression (REGISTERED -> ENROLLED -> ACTIVE LEARNERS) */}
        <div className="admin-pipeline-container">
          <div className="admin-pipeline-step">
            <span className="admin-pipeline-label">REGISTERED</span>
            <span className="admin-pipeline-val">{learnersCount}</span>
            <span className="admin-pipeline-sub">Profiles</span>
          </div>

          <div className="admin-pipeline-arrow" aria-hidden="true">
            <ArrowRight size={14} />
          </div>

          <div className="admin-pipeline-step">
            <span className="admin-pipeline-label">ENROLLED</span>
            <span className="admin-pipeline-val" style={{ color: '#059669' }}>{enrollmentsCount}</span>
            <span className="admin-pipeline-sub">Admitted</span>
          </div>

          <div className="admin-pipeline-arrow" aria-hidden="true">
            <ArrowRight size={14} />
          </div>

          <div className="admin-pipeline-step">
            <span className="admin-pipeline-label">ACTIVE</span>
            <span className="admin-pipeline-val" style={{ color: '#E31B23' }}>{activeEnrollmentsCount}</span>
            <span className="admin-pipeline-sub">In Cohort</span>
          </div>
        </div>

        {/* Program Snapshot Key Metrics List */}
        <div className="admin-snapshot-list">
          <div className="admin-snapshot-row">
            <span className="admin-snapshot-key">Program</span>
            <span className="admin-snapshot-value font-mono font-bold" style={{ color: '#111827' }}>
              UpShift
            </span>
          </div>

          <div className="admin-snapshot-row">
            <span className="admin-snapshot-key">Learner Base</span>
            <span className="admin-snapshot-value">
              <strong style={{ color: '#111827' }}>{learnersCount}</strong> registered learners
            </span>
          </div>

          <div className="admin-snapshot-row">
            <span className="admin-snapshot-key">Enrollment</span>
            <span className="admin-snapshot-value">
              <strong style={{ color: '#059669' }}>{enrollmentsCount}</strong> active enrollments
            </span>
          </div>

          <div className="admin-snapshot-row">
            <span className="admin-snapshot-key">Opportunities</span>
            <span className="admin-snapshot-value">
              <strong style={{ color: '#E31B23' }}>{gigsCount}</strong> live opportunities
            </span>
          </div>

          <div className="admin-snapshot-row">
            <span className="admin-snapshot-key">Program Model</span>
            <span className="admin-snapshot-value text-xs text-gray-500">
              One program · Six applied pathways
            </span>
          </div>
        </div>
      </div>

      {/* Footer Metainfo */}
      <div className="admin-chart-footer" style={{ marginTop: '16px', paddingTop: '10px' }}>
        <div className="admin-chart-legend" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ShieldCheck size={13} style={{ color: '#059669' }} />
          <span>Unified Program Architecture</span>
        </div>
        <span style={{ fontSize: '11px', color: '#9CA3AF' }}>Live Sync</span>
      </div>
    </div>
  );
}
