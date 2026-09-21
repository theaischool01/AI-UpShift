import React from 'react';
import { RefreshCw, LayoutDashboard, AlertOctagon, Terminal } from 'lucide-react';

export default class AdminErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[UpShift Admin Error Boundary] Caught exception:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleReturnToDashboard = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/admin/dashboard';
  };

  render() {
    if (this.state.hasError) {
      const isDev = Boolean(import.meta.env?.DEV);

      return (
        <div style={{ padding: '32px 16px', maxWidth: '720px', margin: '36px auto' }}>
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
              <p style={{ fontSize: '13px', color: '#6B7280', margin: 0, maxWidth: '480px', marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.5 }}>
                An unexpected error occurred while rendering this section. You can retry loading the page or return to the main dashboard.
              </p>
            </div>

            {/* Development Diagnostics */}
            {isDev && this.state.error && (
              <details style={{ margin: '0 0 24px 0', textAlign: 'left', backgroundColor: '#111827', color: '#F9FAFB', borderRadius: '8px', padding: '12px 16px', fontSize: '12px', fontFamily: 'monospace' }}>
                <summary style={{ cursor: 'pointer', fontWeight: 700, color: '#F87171', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Terminal size={14} />
                  <span>Developer Diagnostics: {this.state.error.name}: {this.state.error.message}</span>
                </summary>
                <div style={{ marginTop: '10px', maxHeight: '200px', overflowY: 'auto', whiteSpace: 'pre-wrap', color: '#D1D5DB', fontSize: '11px', lineHeight: 1.4 }}>
                  {this.state.error.stack}
                  {this.state.errorInfo?.componentStack && (
                    <>
                      {'\n\nComponent Stack:'}
                      {this.state.errorInfo.componentStack}
                    </>
                  )}
                </div>
              </details>
            )}

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
