import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { 
  ArrowRight, 
  AlertCircle, 
  Loader2, 
  Eye, 
  EyeOff, 
  Lock, 
  User, 
  GraduationCap, 
  ArrowLeft,
  Briefcase
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import UpShiftWordmark from '../../components/common/UpShiftWordmark';
import './enroll.css';

const STATUS_OPTIONS = [
  'Currently Studying',
  'Graduated',
  'Freelance',
  'Others',
];

const GENDER_OPTIONS = [
  'Male',
  'Female',
  'Non-Binary',
  'Prefer not to say',
];

export default function EnrollmentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const gigParam = searchParams.get('gig');
  const courseParam = searchParams.get('course') || searchParams.get('track');

  const [selectedGig, setSelectedGig] = useState(location.state?.gig || null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    dobAge: '',
    gender: '',
    city: '',
    state: '',
    currentStatus: '',
    college: '',
    courseDegree: '',
    branch: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    if (location.state?.gig) {
      setSelectedGig(location.state.gig);
    } else if (gigParam) {
      const fetchSelectedGig = async () => {
        try {
          const { data, error } = await supabase
            .from('gigs')
            .select('*')
            .eq('id', gigParam)
            .single();
          if (data && !error) {
            setSelectedGig(data);
          }
        } catch (err) {
          console.warn('[EnrollmentPage] Error loading selected gig:', err);
        }
      };
      fetchSelectedGig();
    }
  }, [gigParam, location.state]);

  const validate = () => {
    const errs = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9+ -]{8,15}$/;

    if (!formData.fullName.trim()) errs.fullName = 'Full Name is required.';
    if (!formData.email.trim()) {
      errs.email = 'Email is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }

    if (!formData.mobile.trim()) {
      errs.mobile = 'Mobile number is required.';
    } else if (!phoneRegex.test(formData.mobile.trim())) {
      errs.mobile = 'Please enter a valid mobile number.';
    }

    if (!formData.dobAge.trim()) errs.dobAge = 'Date of birth / age is required.';
    if (!formData.city.trim()) errs.city = 'City is required.';
    if (!formData.state.trim()) errs.state = 'State is required.';

    if (!formData.currentStatus) errs.currentStatus = 'Please select your current status.';
    if (!formData.college.trim()) errs.college = 'College / University name is required.';
    if (!formData.courseDegree.trim()) errs.courseDegree = 'Course / Degree is required.';
    if (!formData.branch.trim()) errs.branch = 'Branch / Specialization is required.';

    if (!formData.password) {
      errs.password = 'Password is required to create your UpShift account.';
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }

    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    return errs;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    if (submitError) setSubmitError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const firstErrorKey = Object.keys(validationErrors)[0];
      const element = document.getElementById(firstErrorKey);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // 1. Submit lead notification to Web3Forms (excluding password)
      const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
      if (accessKey && accessKey !== 'YOUR_ACCESS_KEY_HERE') {
        const payload = {
          access_key: accessKey,
          subject: `New UpShift Enrollment: ${formData.fullName.trim()}`,
          from_name: 'UpShift Enrollment Engine',
          full_name: formData.fullName.trim(),
          email: formData.email.trim().toLowerCase(),
          mobile: formData.mobile.trim(),
          dob_age: formData.dobAge.trim(),
          gender: formData.gender || 'Not specified',
          city: formData.city.trim(),
          state: formData.state.trim(),
          current_status: formData.currentStatus,
          college: formData.college.trim(),
          course_degree: formData.courseDegree.trim(),
          branch: formData.branch.trim(),
          primary_track: selectedGig?.track_id || selectedGig?.course_id || courseParam || 'reelrush-ai',
          program_enrolled: 'UpShift Complete Applied AI Program',
          price: 'UpShift Enrollment',
          submitted_at: new Date().toISOString(),
        };

        try {
          await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify(payload),
          });
        } catch (w3Err) {
          console.warn('[EnrollmentPage] Web3Forms notification note:', w3Err);
        }
      }

      // 2. Prepare learner session state
      const learnerState = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        mobile: formData.mobile.trim(),
        dobAge: formData.dobAge.trim(),
        gender: formData.gender || null,
        city: formData.city.trim(),
        state: formData.state.trim(),
        currentStatus: formData.currentStatus,
        college: formData.college.trim(),
        courseDegree: formData.courseDegree.trim(),
        branch: formData.branch.trim(),
        trackId: selectedGig?.track_id || selectedGig?.course_id || courseParam || 'reelrush-ai',
        courseId: selectedGig?.track_id || selectedGig?.course_id || courseParam || 'reelrush-ai', // backward compatibility fallback
        password: formData.password,
        programId: 'upshift-complete-program',
        programName: 'UpShift Complete Applied AI Program',
        price: 4999,
        gigId: selectedGig?.id || null,
        gigTitle: selectedGig?.title || null
      };

      // 3. Persist session and route directly to /enroll/payment
      sessionStorage.setItem('upshift_pending_learner', JSON.stringify(learnerState));
      navigate('/enroll/payment', { state: { learner: learnerState } });
    } catch (err) {
      console.error('[EnrollmentPage] Submission error:', err);
      setSubmitError(err.message || 'Unable to proceed to payment. Please verify your details.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="enroll-page">
      {/* Header */}
      <header className="enroll-header">
        <div className="enroll-header-inner">
          <Link to="/" className="enroll-brand-link">
            <div className="enroll-brand-avatar">
              <img src="/assets/mascot/mascot_avatar.jpg" alt="UpShift Mascot" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
            </div>
            <div className="enroll-brand-text">
              <span className="enroll-brand-school">THE AI SCHOOL</span>
              <span className="enroll-brand-divider">/</span>
              <UpShiftWordmark theme="light" className="enroll-brand-name" />
            </div>
          </Link>

          <Link to="/login" className="enroll-signin-link">
            <span>Already registered?</span> <span className="enroll-signin-accent">SIGN IN →</span>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="enroll-main">
        {/* Back Link */}
        <div style={{ marginBottom: '14px' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '600', color: '#6B7280' }}>
            <ArrowLeft size={14} />
            <span>Back to UpShift</span>
          </Link>
        </div>

        {/* Compact Introduction */}
        <div style={{ marginBottom: '20px' }}>
          <div className="enroll-eyebrow">
            <span className="enroll-eyebrow-dot" />
            <span className="enroll-eyebrow-text">UpShift · REGISTRATION</span>
          </div>
          <h1 className="enroll-title">
            START YOUR UpShift JOURNEY
          </h1>
          <p className="enroll-subtitle">
            Tell us a little about yourself to activate your UpShift learner portal.
          </p>
        </div>

        {/* Selected Gig Compact Indicator */}
        {selectedGig && (
          <div className="enroll-gig-banner">
            <div className="enroll-gig-banner-label">
              <Briefcase size={13} />
              <span>APPLYING FOR</span>
            </div>
            <div className="enroll-gig-banner-title">
              {selectedGig.title}
            </div>
            <div className="enroll-gig-banner-meta">
              {selectedGig.organization || selectedGig.origin_site || 'UpShift Partner'} • {selectedGig.location || 'Remote'} • <span className="enroll-gig-banner-pay">{selectedGig.payment_amount || selectedGig.engagement_type || 'Paid Gig'}</span>
            </div>
          </div>
        )}

        {/* Error Alert if any */}
        {submitError && (
          <div className="enroll-alert">
            <AlertCircle size={18} style={{ flexShrink: 0, color: '#DC2626' }} />
            <span>{submitError}</span>
          </div>
        )}

        {/* Form Container */}
        <div className="enroll-form-card">
          <form onSubmit={handleSubmit} noValidate>
            
            {/* SECTION 1: PERSONAL INFORMATION */}
            <div className="enroll-form-section">
              <div className="enroll-section-header">
                <User size={15} style={{ color: '#E31B23' }} />
                <h3 className="enroll-section-header-title">
                  01  PERSONAL INFORMATION
                </h3>
              </div>

              <div className="enroll-field-group enroll-field-group-2">
                {/* Full Name */}
                <div className="enroll-field">
                  <label htmlFor="fullName" className="enroll-label">
                    Full Name <span className="enroll-req">*</span>
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="e.g. Maya Lin"
                    className={`enroll-input ${errors.fullName ? 'enroll-input-error' : ''}`}
                  />
                  {errors.fullName && <p className="enroll-error-msg">{errors.fullName}</p>}
                </div>

                {/* Email */}
                <div className="enroll-field">
                  <label htmlFor="email" className="enroll-label">
                    Email <span className="enroll-req">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="learner@example.com"
                    className={`enroll-input enroll-input-mono ${errors.email ? 'enroll-input-error' : ''}`}
                  />
                  {errors.email && <p className="enroll-error-msg">{errors.email}</p>}
                </div>

                {/* Mobile Number */}
                <div className="enroll-field">
                  <label htmlFor="mobile" className="enroll-label">
                    Mobile Number <span className="enroll-req">*</span>
                  </label>
                  <input
                    id="mobile"
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) => handleInputChange('mobile', e.target.value)}
                    placeholder="+91 98765 43210"
                    className={`enroll-input enroll-input-mono ${errors.mobile ? 'enroll-input-error' : ''}`}
                  />
                  {errors.mobile && <p className="enroll-error-msg">{errors.mobile}</p>}
                </div>

                {/* Date of Birth / Age */}
                <div className="enroll-field">
                  <label htmlFor="dobAge" className="enroll-label">
                    Date of Birth / Age <span className="enroll-req">*</span>
                  </label>
                  <input
                    id="dobAge"
                    type="text"
                    value={formData.dobAge}
                    onChange={(e) => handleInputChange('dobAge', e.target.value)}
                    placeholder="e.g. 21 or 15/08/2003"
                    className={`enroll-input ${errors.dobAge ? 'enroll-input-error' : ''}`}
                  />
                  {errors.dobAge && <p className="enroll-error-msg">{errors.dobAge}</p>}
                </div>

                {/* Gender */}
                <div className="enroll-field">
                  <label htmlFor="gender" className="enroll-label">
                    Gender <span className="enroll-optional">Optional</span>
                  </label>
                  <select
                    id="gender"
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="enroll-select"
                  >
                    <option value="">Select Gender</option>
                    {GENDER_OPTIONS.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                {/* City */}
                <div className="enroll-field">
                  <label htmlFor="city" className="enroll-label">
                    City <span className="enroll-req">*</span>
                  </label>
                  <input
                    id="city"
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="e.g. Bengaluru"
                    className={`enroll-input ${errors.city ? 'enroll-input-error' : ''}`}
                  />
                  {errors.city && <p className="enroll-error-msg">{errors.city}</p>}
                </div>

                {/* State */}
                <div className="enroll-field enroll-field-span-2">
                  <label htmlFor="state" className="enroll-label">
                    State <span className="enroll-req">*</span>
                  </label>
                  <input
                    id="state"
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    placeholder="e.g. Karnataka"
                    className={`enroll-input ${errors.state ? 'enroll-input-error' : ''}`}
                  />
                  {errors.state && <p className="enroll-error-msg">{errors.state}</p>}
                </div>
              </div>
            </div>

            {/* SECTION 2: ACADEMIC & BACKGROUND */}
            <div className="enroll-form-section">
              <div className="enroll-section-header">
                <GraduationCap size={15} style={{ color: '#E31B23' }} />
                <h3 className="enroll-section-header-title">
                  02  ACADEMIC & BACKGROUND
                </h3>
              </div>

              <div className="enroll-field-group enroll-field-group-2">
                {/* Current Status */}
                <div className="enroll-field enroll-field-span-2">
                  <label htmlFor="currentStatus" className="enroll-label">
                    Current Status <span className="enroll-req">*</span>
                  </label>
                  <select
                    id="currentStatus"
                    value={formData.currentStatus}
                    onChange={(e) => handleInputChange('currentStatus', e.target.value)}
                    className={`enroll-select ${errors.currentStatus ? 'enroll-input-error' : ''}`}
                  >
                    <option value="">Select current status</option>
                    {STATUS_OPTIONS.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                  {errors.currentStatus && <p className="enroll-error-msg">{errors.currentStatus}</p>}
                </div>

                {/* College / Institution */}
                <div className="enroll-field enroll-field-span-2">
                  <label htmlFor="college" className="enroll-label">
                    College / University / Institution <span className="enroll-req">*</span>
                  </label>
                  <input
                    id="college"
                    type="text"
                    value={formData.college}
                    onChange={(e) => handleInputChange('college', e.target.value)}
                    placeholder="e.g. RV College of Engineering / Delhi University"
                    className={`enroll-input ${errors.college ? 'enroll-input-error' : ''}`}
                  />
                  {errors.college && <p className="enroll-error-msg">{errors.college}</p>}
                </div>

                {/* Course / Degree */}
                <div className="enroll-field">
                  <label htmlFor="courseDegree" className="enroll-label">
                    Course / Degree <span className="enroll-req">*</span>
                  </label>
                  <input
                    id="courseDegree"
                    type="text"
                    value={formData.courseDegree}
                    onChange={(e) => handleInputChange('courseDegree', e.target.value)}
                    placeholder="e.g. B.Tech / BCA / B.Com"
                    className={`enroll-input ${errors.courseDegree ? 'enroll-input-error' : ''}`}
                  />
                  {errors.courseDegree && <p className="enroll-error-msg">{errors.courseDegree}</p>}
                </div>

                {/* Branch / Specialization */}
                <div className="enroll-field">
                  <label htmlFor="branch" className="enroll-label">
                    Branch / Specialization <span className="enroll-req">*</span>
                  </label>
                  <input
                    id="branch"
                    type="text"
                    value={formData.branch}
                    onChange={(e) => handleInputChange('branch', e.target.value)}
                    placeholder="e.g. Computer Science / AI"
                    className={`enroll-input ${errors.branch ? 'enroll-input-error' : ''}`}
                  />
                  {errors.branch && <p className="enroll-error-msg">{errors.branch}</p>}
                </div>
              </div>
            </div>

            {/* SECTION 3: UPSHIFT PASSWORD */}
            <div className="enroll-form-section">
              <div className="enroll-section-header">
                <Lock size={15} style={{ color: '#E31B23' }} />
                <h3 className="enroll-section-header-title">
                  03  UPSHIFT PASSWORD
                </h3>
              </div>

              <p className="enroll-section-desc">
                Set a password for your UpShift account. You’ll use it with your email to sign in.
              </p>

              <div className="enroll-field-group enroll-field-group-2">
                {/* Password */}
                <div className="enroll-field">
                  <label htmlFor="password" className="enroll-label">
                    UpShift Password <span className="enroll-req">*</span>
                  </label>
                  <div className="enroll-pw-wrapper">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="Minimum 6 characters"
                      className={`enroll-input enroll-input-mono ${errors.password ? 'enroll-input-error' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="enroll-pw-toggle"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {errors.password && <p className="enroll-error-msg">{errors.password}</p>}
                </div>

                {/* Confirm Password */}
                <div className="enroll-field">
                  <label htmlFor="confirmPassword" className="enroll-label">
                    Confirm Password <span className="enroll-req">*</span>
                  </label>
                  <div className="enroll-pw-wrapper">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      placeholder="Re-enter password"
                      className={`enroll-input enroll-input-mono ${errors.confirmPassword ? 'enroll-input-error' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="enroll-pw-toggle"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="enroll-error-msg">{errors.confirmPassword}</p>}
                </div>
              </div>
            </div>

            {/* Price Indicator & Final CTA */}
            <div className="enroll-footer-cta">
              <div className="enroll-price-info">
                <span>UpShift Enrollment</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="enroll-submit-btn"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Preparing Secure Checkout...</span>
                  </>
                ) : (
                  <>
                    <span>CONTINUE TO PAYMENT →</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
}

