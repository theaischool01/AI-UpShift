import React from 'react';
import { RefreshCw, LayoutDashboard, AlertOctagon } from 'lucide-react';

export default class AdminErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[UpShift Admin Error Boundary] Caught exception:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  handleReturnToDashboard = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/admin/dashboard';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '32px 16px', maxWidth: '640px', margin: '48px auto' }}>
          <div className="admin-card" style={{ textAlign: 'center', padding: '36px 24px', borderColor: '#FECACA' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#FEF2F2', color: '#E31B23', border: '1px solid #FECACA', margin: '0 auto 16px auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertOctagon size={24} />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <span className="admin-card-eyebrow" style={{ color: '#DC2626', marginBottom: '8px' }}>
                Admin Workspace Error
              </span>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#111827', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
                Something went wrong loading this workspace
              </h2>
              <p style={{ fontSize: '13px', color: '#6B7280', margin: 0, maxWidth: '460px', marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.5 }}>
                An unexpected error occurred while rendering this section. You can retry loading the page or return to the main dashboard.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={this.handleRetry}
                className="admin-btn admin-btn-secondary"
              >
                <RefreshCw size={14} />
                <span>Retry Workspace</span>
              </button>

              <button
                type="button"
                onClick={this.handleReturnToDashboard}
                className="admin-btn admin-btn-primary"
              >
                <LayoutDashboard size={14} />
                <span>Return to Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
