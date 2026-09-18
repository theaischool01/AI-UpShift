import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import UpShiftWordmark from '../../components/common/UpShiftWordmark';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const { user, role, loading: authLoading, fetchProfile } = useAuth();
  const navigate = useNavigate();

  // Ensure body background is light #F9FAFB while on login page, then restore
  useEffect(() => {
    const prevBg = document.body.style.backgroundColor;
    document.body.style.backgroundColor = '#F9FAFB';
    return () => {
      document.body.style.backgroundColor = prevBg;
    };
  }, []);

  // If already authenticated and role is resolved, immediately redirect to appropriate dashboard
  useEffect(() => {
    if (!authLoading && user && role) {
      if (role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else if (role === 'learner') {
        navigate('/learner/dashboard', { replace: true });
      }
    }
  }, [user, role, authLoading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (signInError) {
        if (signInError.message?.toLowerCase().includes('invalid login credentials')) {
          setErrorMessage('Email or password is incorrect.');
        } else if (signInError.message?.toLowerCase().includes('email not confirmed')) {
          setErrorMessage('Please confirm your email address before signing in.');
        } else {
          setErrorMessage('Unable to sign in right now. Please try again.');
        }
        setIsSubmitting(false);
        return;
      }

      if (!authData?.user) {
        setErrorMessage('Unable to sign in. Please check your credentials.');
        setIsSubmitting(false);
        return;
      }

      // Resolve role from database profile
      const userProfile = await fetchProfile(authData.user.id);

      if (!userProfile || !userProfile.role) {
        setErrorMessage('Your account is not configured correctly. Please contact an administrator.');
        setIsSubmitting(false);
        return;
      }

      if (userProfile.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else if (userProfile.role === 'learner') {
        navigate('/learner/dashboard', { replace: true });
      } else {
        await supabase.auth.signOut();
        setErrorMessage('Your account is not configured correctly. Please contact an administrator.');
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error('[UpShift Login] Submit error:', err);
      setErrorMessage('Unable to sign in right now. Please check your connection and try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      style={{
        minHeight: '100svh',
        width: '100%',
        backgroundColor: '#F9FAFB',
        color: '#111827',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 16px',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
      }}
    >
      {/* Centered Authentication Card */}
      <div 
        style={{
          width: '100%',
          maxWidth: '420px',
          backgroundColor: '#FFFFFF',
          border: '1px solid #E5E7EB',
          borderRadius: '14px',
          padding: '36px 32px',
          boxShadow: '0 4px 24px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
          boxSizing: 'border-box'
        }}
      >
        {/* Brand Lockup */}
        <div style={{ textAlign: 'center', marginBottom: '4px' }}>
          <UpShiftWordmark theme="light" style={{ fontSize: '22px', fontWeight: '800' }} />
        </div>

        {/* Micro Eyebrow */}
        <div style={{ textAlign: 'center', fontSize: '11px', fontFamily: 'monospace', fontWeight: '700', letterSpacing: '0.08em', color: '#6B7280', textTransform: 'uppercase', marginBottom: '16px' }}>
          THE AI SCHOOL / WORKSPACE
        </div>

        {/* Heading */}
        <h1 style={{ textAlign: 'center', fontSize: '28px', fontWeight: '700', letterSpacing: '-0.02em', color: '#111827', margin: '0 0 8px 0', lineHeight: 1.2 }}>
          Sign In
        </h1>

        {/* Subtitle */}
        <p style={{ textAlign: 'center', fontSize: '14px', color: '#6B7280', margin: '0 auto 28px auto', maxWidth: '300px', lineHeight: 1.45 }}>
          Access your UpShift learner or administrative workspace.
        </p>

        {/* Accessible Error Alert Banner */}
        {errorMessage && (
          <div 
            role="alert" 
            style={{
              marginBottom: '20px',
              padding: '12px 14px',
              borderRadius: '10px',
              backgroundColor: '#FEF2F2',
              border: '1px solid #FECACA',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              textAlign: 'left'
            }}
          >
            <AlertCircle size={16} color="#B91C1C" style={{ flexShrink: 0, marginTop: '2px' }} />
            <p style={{ margin: 0, fontSize: '13px', color: '#B91C1C', fontWeight: '500', lineHeight: 1.4 }}>
              {errorMessage}
            </p>
          </div>
        )}

        {/* Vertical Form */}
        <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Email Field */}
          <div>
            <label 
              htmlFor="login-email" 
              style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '8px', textAlign: 'left' }}
            >
              Email Address
            </label>
            <input
              id="login-email"
              type="email"
              name="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@college.edu or name@company.com"
              disabled={isSubmitting}
              style={{
                width: '100%',
                height: '48px',
                padding: '0 14px',
                fontSize: '16px',
                color: '#111827',
                backgroundColor: '#FFFFFF',
                border: '1px solid #D1D5DB',
                borderRadius: '10px',
                caretColor: '#111827',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.15s, box-shadow 0.15s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#E31B23';
                e.target.style.boxShadow = '0 0 0 3px rgba(227, 27, 35, 0.12)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#D1D5DB';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Password Field with Eye Toggle */}
          <div>
            <label 
              htmlFor="login-password" 
              style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '8px', textAlign: 'left' }}
            >
              Password
            </label>
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  height: '48px',
                  paddingLeft: '14px',
                  paddingRight: '48px',
                  fontSize: '16px',
                  color: '#111827',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #D1D5DB',
                  borderRadius: '10px',
                  caretColor: '#111827',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.15s, box-shadow 0.15s'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#E31B23';
                  e.target.style.boxShadow = '0 0 0 3px rgba(227, 27, 35, 0.12)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#D1D5DB';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  top: '50%',
                  right: '12px',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  padding: '6px',
                  cursor: 'pointer',
                  color: '#6B7280',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '6px'
                }}
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div style={{ paddingTop: '6px' }}>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '100%',
                height: '48px',
                backgroundColor: isSubmitting ? '#E31B23B3' : '#E31B23',
                color: '#FFFFFF',
                fontSize: '15px',
                fontWeight: '600',
                borderRadius: '10px',
                border: 'none',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'background-color 0.15s'
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) e.currentTarget.style.backgroundColor = '#C9141B';
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting) e.currentTarget.style.backgroundColor = '#E31B23';
              }}
            >
              <span>{isSubmitting ? 'Signing in...' : 'Sign In →'}</span>
            </button>
          </div>
        </form>

        {/* Security Note Footer */}
        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #E5E7EB', textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '12px', color: '#6B7280', lineHeight: 1.5 }}>
            Accounts are provisioned by program administrators.
          </p>
        </div>
      </div>

      {/* Back to Home Link */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <Link 
          to="/"
          style={{
            fontSize: '13px',
            fontWeight: '500',
            color: '#6B7280',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'color 0.15s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#E31B23';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#6B7280';
          }}
        >
          <span>← Back to UpShift Home</span>
        </Link>
      </div>

      {/* Footer */}
      <footer style={{ marginTop: '32px', textAlign: 'center', fontSize: '11px', fontFamily: 'monospace', color: '#9CA3AF' }}>
        UPSHIFT · THE AI SCHOOL © 2026 · ALL RIGHTS RESERVED
      </footer>
    </div>
  );
}
