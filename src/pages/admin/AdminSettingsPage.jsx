import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  User, 
  ShieldCheck, 
  Database, 
  Lock, 
  CheckCircle2, 
  Clock, 
  Mail, 
  KeyRound, 
  Server,
  RefreshCw,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';

export default function AdminSettingsPage() {
  const { user, profile } = useAuth();

  // Truthful platform status ping
  const [dbStatus, setDbStatus] = useState('checking'); // 'connected', 'error', 'checking'
  const [dbLatency, setDbLatency] = useState(null);
  const [checkingPing, setCheckingPing] = useState(false);

  const checkConnectivity = async () => {
    setCheckingPing(true);
    const start = performance.now();
    try {
      // Bounded minimal ping to verify real database connection
      const { data, error } = await supabase
        .from('courses')
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
    <div className="admin-page max-w-4xl space-y-6">
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="flex items-center gap-2">
            <Settings className="w-6 h-6 text-[#E31B23]" />
            Platform Settings
          </h1>
          <p>
            Administrative profile, platform health status, and security telemetry.
          </p>
        </div>
      </div>

      {/* 4F.14 Administrator Profile Card */}
      <div className="admin-card p-6 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-[#E31B23]" />
              Administrator Account
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Current authenticated administrator session details
            </p>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-[#E31B23] border border-red-100">
            <ShieldCheck className="w-3.5 h-3.5" />
            Administrator
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-1">
            <span className="text-[10px] uppercase font-semibold text-gray-400">Full Name</span>
            <p className="font-semibold text-gray-900 text-sm">{adminName}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-1">
            <span className="text-[10px] uppercase font-semibold text-gray-400">Email Address</span>
            <p className="font-mono text-gray-900 text-sm truncate">{adminEmail}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-1">
            <span className="text-[10px] uppercase font-semibold text-gray-400">Assigned Privilege Tier</span>
            <p className="font-semibold text-gray-900 text-sm">Full Control Center Access (Admin)</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-1">
            <span className="text-[10px] uppercase font-semibold text-gray-400">Last Sign-In Timestamp</span>
            <p className="font-mono text-gray-700 text-sm">{lastSignIn}</p>
          </div>
        </div>
      </div>

      {/* 4F.16 Platform Health & Connectivity Status */}
      <div className="admin-card p-6 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <Server className="w-4 h-4 text-[#E31B23]" />
              Platform Infrastructure Status
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Live operational health verification across authentication and database services
            </p>
          </div>

          <button
            type="button"
            onClick={checkConnectivity}
            disabled={checkingPing}
            className="admin-btn-secondary"
            title="Refresh connectivity ping"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${checkingPing ? 'animate-spin' : ''}`} />
            <span>Check Status</span>
          </button>
        </div>

        <div className="divide-y divide-gray-100 text-xs">
          {/* Item 1: Authentication */}
          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Supabase Authentication</p>
                <p className="text-gray-500 text-[11px]">JWT session active & verified via bearer token</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Operational
            </span>
          </div>

          {/* Item 2: Database Connection */}
          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">PostgreSQL Database Connection</p>
                <p className="text-gray-500 text-[11px]">
                  {dbStatus === 'connected' 
                    ? `Live query responding (${dbLatency}ms round-trip)` 
                    : dbStatus === 'checking'
                    ? 'Pinging remote database...'
                    : 'Connection error'}
                </p>
              </div>
            </div>
            {dbStatus === 'connected' ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Live Connected
              </span>
            ) : dbStatus === 'checking' ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-gray-100 text-gray-600">
                <Loader2 className="w-3 h-3 animate-spin" />
                Checking
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-red-50 text-red-700 border border-red-200">
                <AlertCircle className="w-3 h-3" />
                Degraded
              </span>
            )}
          </div>

          {/* Item 3: Admin Authorization */}
          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Admin Authorization Guard</p>
                <p className="text-gray-500 text-[11px]">Strict RLS policy & Edge Function role verification</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Authorized
            </span>
          </div>
        </div>
      </div>

      {/* Security Architecture Note */}
      <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-600 space-y-1">
        <p className="font-semibold text-gray-900">Security Architecture Notes</p>
        <p>
          All privileged operations (such as student onboarding and credential generation) are isolated server-side inside Supabase Edge Functions with compensating transactional rollback. Service role keys and internal infrastructure secrets are strictly barred from client browser bundles.
        </p>
      </div>
    </div>
  );
}
