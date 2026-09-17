import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  AlertCircle, 
  Loader2, 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  MapPin, 
  GraduationCap, 
  Layers,
  CheckCircle2, 
  ArrowLeft,
  ShieldCheck
} from 'lucide-react';
import { PROGRAMS_DATA } from '../../data/programsData';
import './enroll.css';

const STATUS_OPTIONS = [
  'Undergraduate Student',
  'Graduate / Post-Graduate Student',
  'Fresher (Looking for Opportunities)',
  'Working Professional',
  'Founder / Freelancer / Creator',
  'Other',
];

const YEAR_OPTIONS = [
  '1st Year',
  '2nd Year',
  '3rd Year',
  '4th Year',
  'Final Year',
  'Graduated / Working',
];

const HEARD_FROM_OPTIONS = [
  'Instagram',
  'LinkedIn',
  'YouTube',
  'Google Search',
  'WhatsApp Community',
  'Friend / Peer Referral',
  'College / University Workshop',
  'The AI School Network',
  'Other',
];

const GENDER_OPTIONS = [
  'Male',
  'Female',
  'Non-Binary',
  'Prefer not to say',
];

export default function EnrollmentPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    dobAge: '',
    gender: '',
    mobile: '',
    email: '',
    city: '',
    state: '',
    currentStatus: '',
    college: '',
    courseDegree: '',
    branch: '',
    currentYear: '',
    graduationYear: '',
    heardFrom: '',
    courseId: 'reelrush-ai',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const validate = () => {
    const errs = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9+ -]{8,15}$/;

    if (!formData.fullName.trim()) errs.fullName = 'Full Name is required.';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
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
    if (!formData.currentYear) errs.currentYear = 'Please select your current year.';
    if (!formData.graduationYear.trim()) errs.graduationYear = 'Graduation year is required.';

    if (!formData.password) {
      errs.password = 'Password is required to create your learner portal account.';
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
          subject: `New UpShift Complete Program Enrollment: ${formData.fullName.trim()}`,
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
          current_year: formData.currentYear,
          graduation_year: formData.graduationYear.trim(),
          heard_from: formData.heardFrom || 'Not specified',
          primary_track: formData.courseId,
          program_enrolled: 'UpShift Complete Applied AI Program',
          price: '₹4,999 (One-Time Enrollment · 6 Tracks)',
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
        currentYear: formData.currentYear,
        graduationYear: formData.graduationYear.trim(),
        heardFrom: formData.heardFrom || null,
        courseId: formData.courseId || 'reelrush-ai',
        password: formData.password,
        programId: 'upshift-complete-program',
        programName: 'UpShift Complete Applied AI Program',
        price: 4999,
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
      {/* Editorial Sticky Top Navigation */}
      <header className="enroll-header">
        <div className="enroll-header-inner">
          <Link to="/" className="enroll-brand-link">
            <div className="enroll-brand-avatar">
              <img src="/assets/mascot/mascot_avatar.jpg" alt="UpShift Mascot" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
            </div>
            <div className="enroll-brand-text">
              <span className="enroll-brand-school">THE AI SCHOOL</span>
              <span className="enroll-brand-divider">/</span>
              <span className="enroll-brand-name">UPSHIFT<span className="enroll-brand-arrow">↑</span></span>
            </div>
          </Link>

          <Link to="/login" className="enroll-signin-link">
            <span>Already registered?</span> <span className="enroll-signin-accent">SIGN IN →</span>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="enroll-main">
        
        {/* Back Link */}
        <div style={{ marginBottom: '16px' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '600', color: '#6B7280' }}>
            <ArrowLeft size={14} />
            <span>Back to UpShift Overview</span>
          </Link>
        </div>

        {/* Eyebrow & Main Headings */}
        <div style={{ marginBottom: '24px' }}>
          <div className="enroll-eyebrow">
            <span className="enroll-eyebrow-dot" />
            <span className="enroll-eyebrow-text">UPSHIFT · REGISTRATION</span>
          </div>
          <h1 className="enroll-title">
            START YOUR UPSHIFT JOURNEY
          </h1>
          <p className="enroll-subtitle">
            Tell us a little about yourself and we'll use these details to understand your background, tailor your cohort experience, and activate your learner workspace.
          </p>
        </div>

        {/* Pricing / Program Summary Box */}
        <div className="enroll-summary-card">
          <div className="enroll-summary-top">
            <div>
              <div className="enroll-summary-tag">
                COMPREHENSIVE ALL-IN-ONE ENROLLMENT
              </div>
              <h2 className="enroll-summary-title">
                UPSHIFT COMPLETE APPLIED AI PROGRAM
              </h2>
              <p className="enroll-summary-desc">
                All 6 applied AI capability tracks included with real client gigs & proof-of-work portfolio.
              </p>
            </div>
            
            <div className="enroll-price-badge">
              <div className="enroll-price-amount">₹4,999</div>
              <span className="enroll-price-label">ONE-TIME ENROLLMENT</span>
            </div>
          </div>

          {/* Included 6 Programs Grid */}
          <div>
            <div className="enroll-tracks-title">
              <Layers size={13} style={{ color: '#E31B23' }} />
              <span>All 6 Flagship Tracks Included with Your Enrollment:</span>
            </div>
            <div className="enroll-tracks-grid">
              {PROGRAMS_DATA.map((prog) => (
                <div key={prog.id} className="enroll-track-item">
                  <span 
                    className="enroll-track-code"
                    style={{ backgroundColor: prog.themeColor || '#E31B23' }}
                  >
                    {prog.code}
                  </span>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <span className="enroll-track-name">{prog.name}</span>
                    <span className="enroll-track-focus">{prog.focus}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Error Alert if any */}
        {submitError && (
          <div className="enroll-alert">
            <AlertCircle size={18} style={{ flexShrink: 0, color: '#DC2626' }} />
            <span>{submitError}</span>
          </div>
        )}

        {/* Main Form Card */}
        <div className="enroll-form-card">
          <form onSubmit={handleSubmit} noValidate>
            
            {/* ======================================================== */}
            {/* Section 1: Personal Information                          */}
            {/* ======================================================== */}
            <div className="enroll-form-section">
              <div className="enroll-section-header">
                <User size={16} style={{ color: '#E31B23' }} />
                <h3 className="enroll-section-header-title">
                  1. Personal Information
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

                {/* Account Email */}
                <div className="enroll-field">
                  <label htmlFor="email" className="enroll-label">
                    Account Email <span className="enroll-req">*</span>
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
                    Gender
                  </label>
                  <select
                    id="gender"
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="enroll-select"
                  >
                    <option value="">Select Gender (Optional)</option>
                    {GENDER_OPTIONS.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                {/* City & State in 2 cols */}
                <div className="enroll-field">
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
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
                    <div>
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
              </div>
            </div>

            {/* ======================================================== */}
            {/* Section 2: Academic Background                           */}
            {/* ======================================================== */}
            <div className="enroll-form-section">
              <div className="enroll-section-header">
                <GraduationCap size={16} style={{ color: '#E31B23' }} />
                <h3 className="enroll-section-header-title">
                  2. Academic & Background
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
                    <option value="">Select your status</option>
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
                    placeholder="e.g. RV College of Engineering / Delhi University / Working"
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
                    placeholder="e.g. B.Tech / B.E. / BCA / B.Com"
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
                    placeholder="e.g. Computer Science / AI / Electronics"
                    className={`enroll-input ${errors.branch ? 'enroll-input-error' : ''}`}
                  />
                  {errors.branch && <p className="enroll-error-msg">{errors.branch}</p>}
                </div>

                {/* Current Year */}
                <div className="enroll-field">
                  <label htmlFor="currentYear" className="enroll-label">
                    Current Year <span className="enroll-req">*</span>
                  </label>
                  <select
                    id="currentYear"
                    value={formData.currentYear}
                    onChange={(e) => handleInputChange('currentYear', e.target.value)}
                    className={`enroll-select ${errors.currentYear ? 'enroll-input-error' : ''}`}
                  >
                    <option value="">Select current year</option>
                    {YEAR_OPTIONS.map((yr) => (
                      <option key={yr} value={yr}>{yr}</option>
                    ))}
                  </select>
                  {errors.currentYear && <p className="enroll-error-msg">{errors.currentYear}</p>}
                </div>

                {/* Expected Graduation Year */}
                <div className="enroll-field">
                  <label htmlFor="graduationYear" className="enroll-label">
                    Expected Graduation Year <span className="enroll-req">*</span>
                  </label>
                  <input
                    id="graduationYear"
                    type="text"
                    value={formData.graduationYear}
                    onChange={(e) => handleInputChange('graduationYear', e.target.value)}
                    placeholder="e.g. 2026 or Graduated"
                    className={`enroll-input enroll-input-mono ${errors.graduationYear ? 'enroll-input-error' : ''}`}
                  />
                  {errors.graduationYear && <p className="enroll-error-msg">{errors.graduationYear}</p>}
                </div>
              </div>
            </div>

            {/* ======================================================== */}
            {/* Section 3: Primary Track Interest & Referral             */}
            {/* ======================================================== */}
            <div className="enroll-form-section">
              <div className="enroll-section-header">
                <Sparkles size={16} style={{ color: '#E31B23' }} />
                <h3 className="enroll-section-header-title">
                  3. Primary Track Interest & Referral
                </h3>
              </div>

              <div className="enroll-field-group enroll-field-group-2">
                {/* Primary Focus Track */}
                <div className="enroll-field">
                  <label htmlFor="courseId" className="enroll-label">
                    Primary Track to Start With
                  </label>
                  <select
                    id="courseId"
                    value={formData.courseId}
                    onChange={(e) => handleInputChange('courseId', e.target.value)}
                    className="enroll-select"
                  >
                    {PROGRAMS_DATA.map((prog) => (
                      <option key={prog.id} value={prog.id}>
                        {prog.code} — {prog.name} ({prog.focus})
                      </option>
                    ))}
                  </select>
                  <p className="enroll-note">
                    Note: Your ₹4,999 enrollment includes full access to all 6 tracks.
                  </p>
                </div>

                {/* Where did you hear about UpShift */}
                <div className="enroll-field">
                  <label htmlFor="heardFrom" className="enroll-label">
                    Where did you hear about UpShift?
                  </label>
                  <select
                    id="heardFrom"
                    value={formData.heardFrom}
                    onChange={(e) => handleInputChange('heardFrom', e.target.value)}
                    className="enroll-select"
                  >
                    <option value="">Select source (Optional)</option>
                    {HEARD_FROM_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* ======================================================== */}
            {/* Section 4: Create Your Learner Password                  */}
            {/* ======================================================== */}
            <div className="enroll-form-section">
              <div className="enroll-section-header">
                <Lock size={16} style={{ color: '#E31B23' }} />
                <h3 className="enroll-section-header-title">
                  4. Create Your Learner Password
                </h3>
              </div>

              <p style={{ fontSize: '13px', color: '#4B5563', marginBottom: '16px', lineHeight: 1.5 }}>
                Set a secure password for your UpShift learner portal. You will use this password together with your registered email to log in after checkout.
              </p>

              <div className="enroll-field-group enroll-field-group-2">
                {/* Password */}
                <div className="enroll-field">
                  <label htmlFor="password" className="enroll-label">
                    Portal Password <span className="enroll-req">*</span>
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
                      placeholder="Re-enter your password"
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

            {/* ======================================================== */}
            {/* Submit Action Area                                       */}
            {/* ======================================================== */}
            <div style={{ paddingTop: '8px' }}>
              <button
                type="submit"
                disabled={isSubmitting}
                className="enroll-submit-btn"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Preparing Your Secure Checkout...</span>
                  </>
                ) : (
                  <>
                    <span>PROCEED TO PAYMENT (₹4,999)</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <div className="enroll-trust-bar">
                <span className="enroll-trust-item">
                  <ShieldCheck size={14} style={{ color: '#059669' }} />
                  256-Bit SSL Encrypted
                </span>
                <span className="enroll-trust-item">
                  <CheckCircle2 size={14} style={{ color: '#059669' }} />
                  Razorpay Verified Gateway
                </span>
                <span className="enroll-trust-item">
                  <Sparkles size={14} style={{ color: '#E31B23' }} />
                  Instant Workspace Activation
                </span>
              </div>
            </div>
          </form>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer style={{ padding: '24px', borderTop: '1px solid #E5E7EB', textAlign: 'center', fontSize: '12px', color: '#6B7280', fontFamily: 'var(--font-mono), monospace' }}>
        <p>© {new Date().getFullYear()} THE AI SCHOOL · UPSHIFT APPLIED AI PROGRAM · ALL RIGHTS RESERVED</p>
      </footer>
    </div>
  );
}
