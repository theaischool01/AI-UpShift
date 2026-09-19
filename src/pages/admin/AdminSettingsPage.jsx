import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  User, 
  ShieldCheck, 
  Server,
  RefreshCw,
  Clock,
  Mail,
  KeyRound
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';

export default function AdminSettingsPage() {
  const { user, profile } = useAuth();

  const [dbStatus, setDbStatus] = useState('checking'); // 'connected', 'error', 'checking'
  const [dbLatency, setDbLatency] = useState(null);
  const [checkingPing, setCheckingPing] = useState(false);

  const checkConnectivity = async () => {
    setCheckingPing(true);
    const start = performance.now();
    try {
      const { data, error } = await supabase
        .from('tracks')
        .select('id')
        .limit(1);

      const elapsed = Math.round(performance.now() - start);
      if (error) throw error;

      setDbStatus('connected');
      setDbLatency(elapsed);
    } catch (err) {
      console.warn('[AdminSettingsPage] Health check ping failed:', err);
      setDbStatus('error');
    } finally {
      setCheckingPing(false);
    }
  };

  useEffect(() => {
    checkConnectivity();
  }, []);

  const adminName = profile?.full_name || user?.user_metadata?.full_name || 'Administrator';
  const adminEmail = user?.email || profile?.email || '—';
  const lastSignIn = user?.last_sign_in_at 
    ? new Date(user.last_sign_in_at).toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : 'Active Session';

  return (
    <div className="admin-page admin-page-compact">
      {/* Page Header */}
      <div className="admin-page-header">
        <div className="admin-page-title-group">
          <h1 className="admin-page-title">
            <Settings size={22} />
            <span>Platform Settings</span>
          </h1>
          <p className="admin-page-description">
            Administrative profile, platform health status, and security telemetry.
          </p>
        </div>
      </div>

      {/* Administrator Profile Card */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-card-header-left">
            <span className="admin-card-eyebrow">
              <User size={13} />
              <span>Admin Profile</span>
            </span>
            <h3 className="admin-card-title">Administrator Account</h3>
          </div>

          <span className="admin-status-pill" style={{ color: '#E31B23', backgroundColor: '#FEF2F2', borderColor: '#FECACA' }}>
            <ShieldCheck size={13} />
            <span>Administrator</span>
          </span>
        </div>

        <div className="admin-grid-2">
          <div style={{ backgroundColor: '#F9FAFB', padding: '14px', borderRadius: '10px', border: '1px solid #E5E7EB' }}>
            <span style={{ fontSize: '10.5px', fontFamily: 'monospace', textTransform: 'uppercase', color: '#9CA3AF', fontWeight: 700, display: 'block', marginBottom: '2px' }}>Full Name</span>
            <p style={{ fontSize: '14px', fontWeight: 700, color: '#111827', margin: 0 }}>{adminName}</p>
          </div>

          <div style={{ backgroundColor: '#F9FAFB', padding: '14px', borderRadius: '10px', border: '1px solid #E5E7EB' }}>
            <span style={{ fontSize: '10.5px', fontFamily: 'monospace', textTransform: 'uppercase', color: '#9CA3AF', fontWeight: 700, display: 'block', marginBottom: '2px' }}>Email Address</span>
            <p style={{ fontSize: '13px', fontFamily: 'monospace', color: '#111827', margin: 0 }}>{adminEmail}</p>
          </div>

          <div style={{ backgroundColor: '#F9FAFB', padding: '14px', borderRadius: '10px', border: '1px solid #E5E7EB' }}>
            <span style={{ fontSize: '10.5px', fontFamily: 'monospace', textTransform: 'uppercase', color: '#9CA3AF', fontWeight: 700, display: 'block', marginBottom: '2px' }}>Privilege Tier</span>
            <p style={{ fontSize: '13.5px', fontWeight: 600, color: '#111827', margin: 0 }}>Full Control Center Access</p>
          </div>

          <div style={{ backgroundColor: '#F9FAFB', padding: '14px', borderRadius: '10px', border: '1px solid #E5E7EB' }}>
            <span style={{ fontSize: '10.5px', fontFamily: 'monospace', textTransform: 'uppercase', color: '#9CA3AF', fontWeight: 700, display: 'block', marginBottom: '2px' }}>Last Sign-In Timestamp</span>
            <p style={{ fontSize: '12px', fontFamily: 'monospace', color: '#6B7280', margin: 0 }}>{lastSignIn}</p>
          </div>
        </div>
      </div>

      {/* Platform Health & Connectivity Status */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-card-header-left">
            <span className="admin-card-eyebrow" style={{ color: '#059669' }}>
              <Server size={13} />
              <span>Infrastructure</span>
            </span>
            <h3 className="admin-card-title">Live Service Telemetry</h3>
          </div>

          <button
            type="button"
            onClick={checkConnectivity}
            disabled={checkingPing}
            className="admin-btn admin-btn-sm admin-btn-secondary"
            title="Refresh connectivity ping"
          >
            <RefreshCw size={13} className={checkingPing ? 'animate-spin' : ''} />
            <span>Ping Status</span>
          </button>
        </div>

        <div className="admin-grid-2">
          <div style={{ backgroundColor: '#F9FAFB', padding: '14px', borderRadius: '10px', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '10.5px', fontFamily: 'monospace', textTransform: 'uppercase', color: '#9CA3AF', fontWeight: 700, display: 'block', marginBottom: '2px' }}>PostgreSQL Database</span>
              <p style={{ fontSize: '13.5px', fontWeight: 700, color: '#111827', margin: 0 }}>
                {dbStatus === 'connected' ? 'Connected & Operational' : (dbStatus === 'error' ? 'Connection Warning' : 'Checking...')}
              </p>
            </div>
            <span style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: dbStatus === 'connected' ? '#10B981' : (dbStatus === 'error' ? '#EF4444' : '#F59E0B')
            }} />
          </div>

          <div style={{ backgroundColor: '#F9FAFB', padding: '14px', borderRadius: '10px', border: '1px solid #E5E7EB' }}>
            <span style={{ fontSize: '10.5px', fontFamily: 'monospace', textTransform: 'uppercase', color: '#9CA3AF', fontWeight: 700, display: 'block', marginBottom: '2px' }}>Round-Trip Ping Latency</span>
            <p style={{ fontSize: '13.5px', fontFamily: 'monospace', fontWeight: 700, color: dbLatency && dbLatency < 300 ? '#059669' : '#111827', margin: 0 }}>
              {dbLatency ? `${dbLatency} ms` : 'Measuring...'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
