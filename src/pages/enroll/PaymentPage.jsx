import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  CheckCircle2, 
  ShieldCheck, 
  Lock, 
  ArrowRight, 
  AlertCircle, 
  Loader2, 
  Sparkles, 
  Layers, 
  Check, 
  ArrowLeft,
  Play,
  Palette,
  Database,
  Code,
  Megaphone,
  Bot
} from 'lucide-react';
import { loadRazorpayScript, createRazorpayOrder, verifyRazorpayPayment } from '../../services/paymentService';
import './enroll.css';

const INCLUDED_PROGRAMS = [
  { code: 'M1', name: 'ReelRush AI', domain: 'AI Video & Dynamic Reels', icon: Play, color: '#E91D2B', bg: '#FFF1F1' },
  { code: 'M2', name: 'VisualForge AI', domain: 'Visual Assets & Generative Art', icon: Palette, color: '#8B5CF6', bg: '#F5F3FF' },
  { code: 'M3', name: 'DeepAnnotator', domain: 'Data Quality & AI Evaluation', icon: Database, color: '#059669', bg: '#ECFDF5' },
  { code: 'M4', name: 'Vibe Coder', domain: 'Full-Stack Apps with AI Coding', icon: Code, color: '#2563EB', bg: '#EFF6FF' },
  { code: 'M5', name: 'BrandBuzz AI', domain: 'Growth Campaigns & Viral Copy', icon: Megaphone, color: '#D97706', bg: '#FFFBEB' },
  { code: 'M6', name: 'AgentHandlers', domain: 'Autonomous Multi-Agent Systems', icon: Bot, color: '#0D9488', bg: '#F0FDFA' },
];

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve pending registration state from location state or session storage
  const [learnerData, setLearnerData] = useState(() => {
    if (location.state?.learner) {
      sessionStorage.setItem('upshift_pending_learner', JSON.stringify(location.state.learner));
      return location.state.learner;
    }
    const saved = sessionStorage.getItem('upshift_pending_learner');
    return saved ? JSON.parse(saved) : null;
  });

  const [paymentState, setPaymentState] = useState('idle'); // 'idle' | 'creating_order' | 'checkout_open' | 'verifying' | 'success' | 'failed'
  const [errorMessage, setErrorMessage] = useState(null);
  const [verifiedResult, setVerifiedResult] = useState(null);

  // If no registration data is present, prompt user to fill out enrollment form
  if (!learnerData) {
    return (
      <div className="payment-page" style={{ alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ maxWidth: '440px', width: '100%', backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '18px', padding: '32px', textAlign: 'center', boxShadow: '0 4px 20px -4px rgba(0,0,0,0.06)' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#FEF2F2', color: '#E31B23', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', border: '1px solid #FEE2E2' }}>
            <AlertCircle size={24} />
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#111827', marginBottom: '8px' }}>No Active Enrollment Session</h2>
          <p style={{ fontSize: '13px', color: '#4B5563', lineHeight: 1.5, marginBottom: '24px' }}>
            Please complete the UpShift enrollment form first to initiate your registration and proceed to checkout.
          </p>
          <Link
            to="/enroll"
            className="enroll-submit-btn"
            style={{ textDecoration: 'none' }}
          >
            <span>Start Enrollment Form</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  const handleInitiatePayment = async () => {
    if (paymentState === 'creating_order' || paymentState === 'verifying') return;
    setPaymentState('creating_order');
    setErrorMessage(null);

    try {
      // 1. Load Razorpay SDK
      const sdkLoaded = await loadRazorpayScript();
      if (!sdkLoaded) {
        throw new Error('Payment gateway checkout SDK could not be loaded. Please check your internet connection and try again.');
      }

      // 2. Create Order via Supabase Edge Function
      const orderResponse = await createRazorpayOrder(learnerData);
      if (!orderResponse?.success || !orderResponse?.order) {
        throw new Error(orderResponse?.error || 'Payment setup is currently being configured. Please try again shortly.');
      }

      const { order } = orderResponse;
      const razorpayKey = order.key_id || import.meta.env.VITE_RAZORPAY_KEY_ID || 'YOUR_RAZORPAY_KEY_ID_HERE';

      // 3. Configure and Open Razorpay Modal
      const options = {
        key: razorpayKey,
        amount: order.amount,
        currency: order.currency || 'INR',
        name: 'UpShift | By The AI School',
        description: 'UpShift Complete Applied AI Program (All 6 Tracks Included)',
        image: '/assets/mascot/mascot_avatar.jpg',
        order_id: order.id,
        prefill: {
          name: learnerData.fullName,
          email: learnerData.email,
          contact: learnerData.mobile || '',
        },
        theme: {
          color: '#E31B23',
        },
        handler: async function (response) {
          setPaymentState('verifying');
          try {
            // 4. Server-Side Cryptographic Signature & Payment Verification
            const verifyResponse = await verifyRazorpayPayment({
              razorpay_order_id: response.razorpay_order_id || order.id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              learnerData,
            });

            if (verifyResponse?.success) {
              setVerifiedResult(verifyResponse);
              setPaymentState('success');
              // Clear stored pending registration after verified account activation
              sessionStorage.removeItem('upshift_pending_learner');
            } else {
              throw new Error(verifyResponse?.error || 'Payment verification failed server-side.');
            }
          } catch (verifyErr) {
            console.error('[PaymentPage] Verification error:', verifyErr);
            setErrorMessage(verifyErr.message || 'Payment confirmation failed. Please contact support if debited.');
            setPaymentState('failed');
          }
        },
        modal: {
          ondismiss: function () {
            if (paymentState !== 'success' && paymentState !== 'verifying') {
              setPaymentState('idle');
            }
          },
        },
      };

      if (!window.Razorpay) {
        throw new Error('Razorpay SDK not available on page.');
      }

      const rzpInstance = new window.Razorpay(options);
      rzpInstance.on('payment.failed', function (resp) {
        console.warn('[Razorpay] Payment failed event:', resp.error);
        setErrorMessage(resp.error?.description || 'Payment was declined or cancelled.');
        setPaymentState('failed');
      });

      setPaymentState('checkout_open');
      rzpInstance.open();
    } catch (err) {
      console.error('[PaymentPage] Payment initiation error:', err);
      setErrorMessage(err.message || 'Payment setup is currently being configured. Please try again shortly.');
      setPaymentState('failed');
    }
  };

  // SUCCESS STATE VIEW
  if (paymentState === 'success') {
    return (
      <div className="payment-page" style={{ alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ maxWidth: '540px', width: '100%', backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '24px', padding: '40px', textAlign: 'center', boxShadow: '0 4px 20px -4px rgba(0,0,0,0.06)' }}>
          {/* Success Badge Icon */}
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <CheckCircle2 size={36} />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <span style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#065F46', backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', padding: '4px 12px', borderRadius: '9999px', display: 'inline-block', marginBottom: '12px' }}>
              PAYMENT CONFIRMED · ENROLLMENT ACTIVE
            </span>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#111827', margin: '0 0 8px' }}>
              WELCOME TO UPSHIFT
            </h1>
            <p style={{ fontSize: '14px', color: '#4B5563', lineHeight: 1.5, margin: 0 }}>
              Your enrollment has been verified. Your learner account is now active with full access to all 6 applied AI programs.
            </p>
          </div>

          {/* Account Details Box */}
          <div style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '14px', padding: '18px', textAlign: 'left', fontSize: '13px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #E5E7EB', marginBottom: '8px' }}>
              <span style={{ color: '#6B7280', fontFamily: 'var(--font-mono), monospace', fontSize: '11px' }}>LEARNER ACCOUNT</span>
              <span style={{ fontWeight: 700, color: '#111827', fontFamily: 'var(--font-mono), monospace' }}>{learnerData.email}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #E5E7EB', marginBottom: '8px' }}>
              <span style={{ color: '#6B7280', fontFamily: 'var(--font-mono), monospace', fontSize: '11px' }}>ENROLLED PROGRAM</span>
              <span style={{ fontWeight: 700, color: '#E31B23' }}>UpShift Complete (6 Tracks)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6B7280', fontFamily: 'var(--font-mono), monospace', fontSize: '11px' }}>ACCESS STATUS</span>
              <span style={{ fontWeight: 700, color: '#059669' }}>● Lifetime Active</span>
            </div>
          </div>

          {/* Action CTA */}
          <div>
            <Link
              to="/login"
              className="enroll-submit-btn"
              style={{ textDecoration: 'none' }}
            >
              <span>SIGN IN TO YOUR WORKSPACE →</span>
            </Link>
            <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '12px' }}>
              Use your registered email and the password you set during enrollment.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page">
      {/* Header Bar */}
      <header className="enroll-header">
        <div className="enroll-header-inner" style={{ maxWidth: '1080px' }}>
          <Link to="/" className="enroll-brand-link">
            <div className="enroll-brand-avatar">
              <img src="/assets/mascot/mascot_avatar.jpg" alt="UpShift Mascot" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
            </div>
            <div className="enroll-brand-text">
              <span className="enroll-brand-school">THE AI SCHOOL</span>
              <span className="enroll-brand-divider">/</span>
              <span className="enroll-brand-name">UpShift</span>
            </div>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontFamily: 'var(--font-mono), monospace', color: '#6B7280' }}>
            <ShieldCheck size={16} style={{ color: '#059669' }} />
            <span>256-Bit Encrypted Checkout</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="enroll-main" style={{ maxWidth: '1080px' }}>
        {/* Error Alert if Payment Failed */}
        {errorMessage && (
          <div className="enroll-alert">
            <AlertCircle size={18} style={{ flexShrink: 0, color: '#DC2626' }} />
            <div>
              <p style={{ fontWeight: 700, margin: '0 0 2px', color: '#991B1B' }}>Checkout Notification</p>
              <p style={{ margin: 0, fontSize: '12px' }}>{errorMessage}</p>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', alignItems: 'start' }}>
          
          {/* Left Column: Program Breakdown & Inclusions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <div className="enroll-eyebrow">
                <Sparkles size={12} style={{ color: '#E31B23' }} />
                <span className="enroll-eyebrow-text">FLAGSHIP APPLIED AI PROGRAM</span>
              </div>
              <h1 className="enroll-title" style={{ fontSize: '32px' }}>
                UPSHIFT COMPLETE APPLIED AI PROGRAM
              </h1>
              <p className="enroll-subtitle" style={{ marginBottom: 0 }}>
                One enrollment. All six applied AI tracks included. Turn hands-on AI execution into commercial proof-of-work.
              </p>
            </div>

            {/* 6 Included Programs Grid */}
            <div>
              <div className="enroll-tracks-title">
                All 6 Curriculum Tracks Included:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                {INCLUDED_PROGRAMS.map((prog) => {
                  const Icon = prog.icon;
                  return (
                    <div 
                      key={prog.code}
                      style={{ padding: '12px 14px', borderRadius: '12px', backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}
                    >
                      <div 
                        style={{ width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, backgroundColor: prog.bg, color: prog.color }}
                      >
                        <Icon size={16} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono), monospace', fontWeight: 800, color: prog.color }}>
                            {prog.code}
                          </span>
                          <span style={{ fontSize: '13px', fontWeight: 700, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {prog.name}
                          </span>
                        </div>
                        <p style={{ fontSize: '11px', color: '#6B7280', margin: '2px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {prog.domain}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Inclusions List */}
            <div style={{ padding: '20px', borderRadius: '16px', backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column', gap: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
              <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono), monospace', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#374151' }}>
                What's Included in Your UpShift Enrollment:
              </span>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#4B5563' }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <Check size={16} style={{ color: '#059669', flexShrink: 0, marginTop: '2px' }} />
                  <span>Full access to all 6 applied AI curriculum tracks & milestones</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <Check size={16} style={{ color: '#059669', flexShrink: 0, marginTop: '2px' }} />
                  <span>Verified Proof-of-Work Portfolio hosted on the UpShift network</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <Check size={16} style={{ color: '#059669', flexShrink: 0, marginTop: '2px' }} />
                  <span>Access to live client gigs, bounties & opportunities dispatch</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <Check size={16} style={{ color: '#059669', flexShrink: 0, marginTop: '2px' }} />
                  <span>Human-in-the-loop quality reviews & Certificate of Competence</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Checkout Summary & Pay Action */}
          <div>
            <div className="enroll-form-card" style={{ position: 'sticky', top: '90px' }}>
              {/* Pricing Header */}
              <div style={{ paddingBottom: '20px', borderBottom: '1px solid #E5E7EB', marginBottom: '20px' }}>
                <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono), monospace', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '6px' }}>
                  Program Enrollment
                </span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                  <span style={{ fontSize: '24px', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em' }}>
                    UpShift Complete
                  </span>
                  <span className="enroll-price-label">
                    All 6 Tracks Included
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: '#6B7280', margin: '6px 0 0' }}>
                  Complete program enrollment. Full access to all 6 capability tracks.
                </p>
              </div>

              {/* Verified Learner Details */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', fontFamily: 'var(--font-mono), monospace', color: '#6B7280', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 700 }}>LEARNER DETAILS</span>
                  <Link to="/enroll" style={{ color: '#E31B23', fontWeight: 700, textDecoration: 'none' }}>
                    Edit Details
                  </Link>
                </div>
                <div style={{ backgroundColor: '#F9FAFB', borderRadius: '12px', padding: '14px', border: '1px solid #E5E7EB', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <p style={{ fontWeight: 700, color: '#111827', margin: 0 }}>{learnerData.fullName}</p>
                  <p style={{ fontFamily: 'var(--font-mono), monospace', color: '#4B5563', margin: 0, fontSize: '12px' }}>{learnerData.email}</p>
                  {learnerData.mobile && <p style={{ fontFamily: 'var(--font-mono), monospace', color: '#6B7280', margin: 0, fontSize: '12px' }}>{learnerData.mobile}</p>}
                  {learnerData.college && <p style={{ color: '#6B7280', margin: 0, fontSize: '12px' }}>{learnerData.college}</p>}
                </div>
              </div>

              {/* Checkout Action Button */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button
                  type="button"
                  onClick={handleInitiatePayment}
                  disabled={paymentState === 'creating_order' || paymentState === 'verifying'}
                  className="enroll-submit-btn"
                >
                  {paymentState === 'creating_order' ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Connecting to Razorpay...</span>
                    </>
                  ) : paymentState === 'verifying' ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Verifying Payment...</span>
                    </>
                  ) : (
                    <>
                      <Lock size={15} />
                      <span>PROCEED TO PAYMENT →</span>
                    </>
                  )}
                </button>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '11px', color: '#6B7280', textAlign: 'center', fontFamily: 'var(--font-mono), monospace' }}>
                  <ShieldCheck size={14} style={{ color: '#059669' }} />
                  <span>Official Razorpay Checkout · UPI, Cards, NetBanking</span>
                </div>
              </div>

              {/* Back Link */}
              <div style={{ textAlign: 'center', paddingTop: '16px' }}>
                <Link to="/" style={{ fontSize: '12px', color: '#6B7280', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
                  <ArrowLeft size={13} />
                  <span>Back to UpShift Overview</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer style={{ padding: '24px', borderTop: '1px solid #E5E7EB', textAlign: 'center', fontSize: '12px', color: '#6B7280', fontFamily: 'var(--font-mono), monospace' }}>
        <p>© {new Date().getFullYear()} THE AI SCHOOL · UPSHIFT APPLIED AI PROGRAM · ALL RIGHTS RESERVED</p>
      </footer>
    </div>
  );
}
