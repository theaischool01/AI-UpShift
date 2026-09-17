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
        <div className="p-8 max-w-2xl mx-auto my-12">
          <div className="admin-card border-red-200 bg-white text-center p-8 space-y-5 shadow-lg">
            <div className="w-14 h-14 rounded-2xl bg-red-50 text-[#E31B23] border border-red-100 mx-auto flex items-center justify-center">
              <AlertOctagon size={28} />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider text-red-700 bg-red-50 border border-red-200 mb-2">
                ADMIN WORKSPACE ERROR
              </div>
              <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
                Something went wrong loading this workspace
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1.5 max-w-md mx-auto leading-relaxed">
                An unexpected error occurred while rendering this section. You can retry loading the page or return to the main dashboard.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleRetry}
                className="admin-btn-secondary"
              >
                <RefreshCw size={14} />
                <span>Retry Workspace</span>
              </button>

              <button
                type="button"
                onClick={this.handleReturnToDashboard}
                className="admin-btn-primary"
                style={{ backgroundColor: '#E31B23', color: '#FFFFFF' }}
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
