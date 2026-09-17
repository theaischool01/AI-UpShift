import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, CheckCircle2, AlertCircle, ArrowRight, Loader2, Sparkles } from 'lucide-react';

export default function UpShiftRegistrationModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || '';

  // Form State
  const initialForm = {
    fullName: '',
    dobChoice: 'dob', // 'dob' or 'age'
    dob: '',
    age: '',
    gender: '',
    mobileNumber: '',
    email: '',
    city: '',
    state: '',
    password: '',
    confirmPassword: '',
    currentStatus: '',
    collegeUniversity: '',
    courseDegree: '',
    branchSpecialization: '',
    currentYear: '',
    expectedGraduationYear: '',
    heardAboutUs: '',
    courseId: 'reelrush-ai',
    botcheck: false,
  };

  const [formData, setFormData] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fullNameRef = useRef(null);

  // Close on ESC key, lock body scroll, & focus management
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isSubmitting) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus first input
    const timer = setTimeout(() => {
      if (fullNameRef.current) {
        fullNameRef.current.focus();
      }
    }, 50);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
      clearTimeout(timer);
    };
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required.';
    }

    if (formData.dobChoice === 'dob') {
      if (!formData.dob) {
        newErrors.dob = 'Date of Birth is required.';
      }
    } else {
      if (!formData.age || isNaN(formData.age) || Number(formData.age) < 14 || Number(formData.age) > 99) {
        newErrors.age = 'Please enter a valid age (15–99).';
      }
    }

    const cleanPhone = formData.mobileNumber.replace(/\D/g, '');
    if (!cleanPhone) {
      newErrors.mobileNumber = 'Mobile Number is required.';
    } else if (cleanPhone.length < 10) {
      newErrors.mobileNumber = 'Please enter a valid 10-digit mobile number.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required.';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required.';
    }

    // Password validations
    if (!formData.password) {
      newErrors.password = 'Account password is required.';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters in length.';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (!formData.currentStatus) {
      newErrors.currentStatus = 'Please select your current status.';
    }

    if (!formData.collegeUniversity.trim()) {
      newErrors.collegeUniversity = 'College / University name is required.';
    }

    if (!formData.courseDegree.trim()) {
      newErrors.courseDegree = 'Course / Degree is required.';
    }

    if (!formData.branchSpecialization.trim()) {
      newErrors.branchSpecialization = 'Branch / Specialization is required.';
    }

    if (!formData.currentYear) {
      newErrors.currentYear = 'Please select your current year.';
    }

    if (!formData.expectedGraduationYear) {
      newErrors.expectedGraduationYear = 'Please select expected graduation year.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // 1. Web3Forms notification (Password strictly omitted)
      if (accessKey && !accessKey.includes('YOUR_')) {
        try {
          const payload = {
            access_key: accessKey,
            subject: `UpShift Registration — ${formData.fullName} (Complete Program)`,
            from_name: 'UpShift Admissions',
            program: 'UpShift Complete Applied AI Program',
            pricing: '₹4,999 (One-Time Enrollment · All 6 Tracks)',
            name: formData.fullName,
            date_of_birth: formData.dobChoice === 'dob' ? formData.dob : `Age: ${formData.age}`,
            age: formData.dobChoice === 'age' ? formData.age : undefined,
            gender: formData.gender || 'Not specified',
            mobile_number: `+91 ${formData.mobileNumber.trim()}`,
            email: formData.email.trim(),
            city: formData.city.trim(),
            state: formData.state.trim(),
            current_status: formData.currentStatus,
            college_university: formData.collegeUniversity.trim(),
            course_degree: formData.courseDegree.trim(),
            branch_specialization: formData.branchSpecialization.trim(),
            current_year: formData.currentYear,
            expected_graduation_year: formData.expectedGraduationYear,
            heard_about_us: formData.heardAboutUs || 'Not specified',
            botcheck: formData.botcheck ? 'true' : undefined
          };

          await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
          });
        } catch (w3Err) {
          console.warn('[RegistrationModal] Web3Forms notice:', w3Err);
        }
      }

      // 2. Prepare learner state for Payment Page
      const learnerState = {
        fullName: formData.fullName.trim(),
        dobAge: formData.dobChoice === 'dob' ? formData.dob : formData.age,
        gender: formData.gender,
        mobile: formData.mobileNumber.trim(),
        email: formData.email.trim().toLowerCase(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        currentStatus: formData.currentStatus,
        college: formData.collegeUniversity.trim(),
        courseDegree: formData.courseDegree.trim(),
        branch: formData.branchSpecialization.trim(),
        currentYear: formData.currentYear,
        graduationYear: formData.expectedGraduationYear,
        heardFrom: formData.heardAboutUs,
        courseId: formData.courseId || 'reelrush-ai',
        password: formData.password,
      };

      sessionStorage.setItem('upshift_pending_learner', JSON.stringify(learnerState));
      onClose();
      navigate('/enroll/payment', { state: { learner: learnerState } });
    } catch (err) {
      console.error('Registration submission error:', err);
      setErrorMessage('Unable to proceed to checkout. Please check your details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDone = () => {
    setSubmitStatus(null);
    setErrorMessage('');
    onClose();
  };

  return (
    <div 
      className="upshift-registration-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="registration-modal-title"
    >
      <div 
        className="upshift-registration-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="upshift-reg-header">
          <div>
            <div className="upshift-reg-eyebrow">
              <span className="upshift-reg-eyebrow-dot" />
              <span>UPSHIFT · REGISTRATION</span>
            </div>
            <h2 id="registration-modal-title" className="upshift-reg-title">
              START YOUR<br className="hidden sm:inline" /> UPSHIFT JOURNEY
            </h2>
            <p className="upshift-reg-subtitle">
              Tell us a little about yourself and we’ll use these details to understand your background and interests.
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="upshift-reg-close-btn"
            aria-label="Close Registration Modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="upshift-reg-body">
          <form onSubmit={handleSubmit} noValidate>
              {/* Configuration Notice if Key is Missing */}
              {!accessKey && (
                <div className="upshift-reg-alert-config">
                  <AlertCircle size={18} style={{ color: '#D97706', flexShrink: 0, marginTop: '1px' }} />
                  <div>
                    <strong style={{ display: 'block', fontWeight: 600 }}>FORM SERVICE NOT CONFIGURED</strong>
                    <span>Registration service is not configured yet. Please add your Web3Forms access key as <code>VITE_WEB3FORMS_ACCESS_KEY</code> in <code>.env.local</code>.</span>
                  </div>
                </div>
              )}

              {/* Submission Error Banner */}
              {submitStatus === 'error' && (
                <div className="upshift-reg-alert-error">
                  <AlertCircle size={18} style={{ color: '#DC2626', flexShrink: 0, marginTop: '1px' }} />
                  <div>
                    <strong style={{ display: 'block', fontWeight: 600 }}>REGISTRATION COULD NOT BE SUBMITTED</strong>
                    <span>{errorMessage || 'Please check your connection and try again.'}</span>
                  </div>
                </div>
              )}

              {/* Anti-spam Honeypot */}
              <input 
                type="checkbox" 
                name="botcheck" 
                checked={formData.botcheck} 
                onChange={handleChange} 
                tabIndex={-1} 
                autoComplete="off" 
                style={{ display: 'none' }} 
              />

              {/* ======================================================== */}
              {/* COMMERCIAL PRODUCT CALLOUT BANNER                        */}
              {/* ======================================================== */}
              <div 
                style={{
                  background: 'linear-gradient(135deg, rgba(227, 27, 35, 0.05) 0%, rgba(250, 248, 245, 0.8) 100%)',
                  border: '1px solid rgba(227, 27, 35, 0.18)',
                  borderRadius: '12px',
                  padding: '14px 18px',
                  marginBottom: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#E31B23', display: 'inline-block' }} />
                    <span style={{ fontFamily: 'var(--font-display, "Space Grotesk", sans-serif)', fontSize: '13px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#111111' }}>
                      UPSHIFT COMPLETE PROGRAM
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                    <span style={{ fontFamily: 'var(--font-display, "Space Grotesk", sans-serif)', fontSize: '20px', fontWeight: '800', color: '#E31B23' }}>
                      ₹4,999
                    </span>
                    <span style={{ fontSize: '11px', fontWeight: '600', color: '#666666', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      One-time
                    </span>
                  </div>
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: '#555555', lineHeight: '1.45' }}>
                  Complete access to all 6 applied AI tracks: <strong>M1 ReelRush</strong> · <strong>M2 VisualForge</strong> · <strong>M3 DeepAnnotator</strong> · <strong>M4 Vibe Coder</strong> · <strong>M5 BrandBuzz</strong> · <strong>M6 AgentHandlers</strong>.
                </p>
              </div>

              {/* ======================================================== */}
              {/* GROUP 1: PERSONAL DETAILS                                */}
              {/* ======================================================== */}
              <div className="upshift-reg-section-heading">
                PERSONAL DETAILS
              </div>

              <div className="upshift-reg-grid">
                {/* 1. Full Name (Span 2) */}
                <div className="upshift-reg-field upshift-reg-col-span-2">
                  <label htmlFor="reg-fullName" className="upshift-reg-label">
                    Full Name <span className="upshift-reg-required">*</span>
                  </label>
                  <input
                    ref={fullNameRef}
                    id="reg-fullName"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Rahul Sharma"
                    aria-invalid={!!errors.fullName}
                    aria-describedby={errors.fullName ? "reg-fullName-err" : undefined}
                    className={`upshift-reg-input ${errors.fullName ? 'is-error' : ''}`}
                  />
                  {errors.fullName && <p id="reg-fullName-err" className="upshift-reg-error-msg">{errors.fullName}</p>}
                </div>

                {/* 2. Date of Birth / Age Toggle */}
                <div className="upshift-reg-field">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '7px' }}>
                    <label htmlFor={formData.dobChoice === 'dob' ? 'reg-dob' : 'reg-age'} className="upshift-reg-label" style={{ marginBottom: 0 }}>
                      {formData.dobChoice === 'dob' ? 'Date of Birth' : 'Age'} <span className="upshift-reg-required">*</span>
                    </label>
                    <div className="upshift-reg-segmented">
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, dobChoice: 'dob' }))}
                        className={`upshift-reg-segment-btn ${formData.dobChoice === 'dob' ? 'active' : ''}`}
                      >
                        Date of Birth
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, dobChoice: 'age' }))}
                        className={`upshift-reg-segment-btn ${formData.dobChoice === 'age' ? 'active' : ''}`}
                      >
                        Age
                      </button>
                    </div>
                  </div>

                  {formData.dobChoice === 'dob' ? (
                    <input
                      id="reg-dob"
                      name="dob"
                      type="date"
                      required
                      value={formData.dob}
                      onChange={handleChange}
                      aria-invalid={!!errors.dob}
                      aria-describedby={errors.dob ? "reg-dob-err" : undefined}
                      className={`upshift-reg-input ${errors.dob ? 'is-error' : ''}`}
                    />
                  ) : (
                    <input
                      id="reg-age"
                      name="age"
                      type="number"
                      min="14"
                      max="99"
                      required
                      value={formData.age}
                      onChange={handleChange}
                      placeholder="e.g. 21"
                      aria-invalid={!!errors.age}
                      aria-describedby={errors.age ? "reg-age-err" : undefined}
                      className={`upshift-reg-input ${errors.age ? 'is-error' : ''}`}
                    />
                  )}
                  {(errors.dob || errors.age) && (
                    <p id="reg-dob-err" className="upshift-reg-error-msg">{errors.dob || errors.age}</p>
                  )}
                </div>

                {/* 3. Gender (Optional) */}
                <div className="upshift-reg-field">
                  <label htmlFor="reg-gender" className="upshift-reg-label">
                    Gender <span className="upshift-reg-optional">(Optional)</span>
                  </label>
                  <select
                    id="reg-gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="upshift-reg-select"
                  >
                    <option value="">Select gender</option>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Non-Binary">Non-Binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* 4. Mobile Number */}
                <div className="upshift-reg-field">
                  <label htmlFor="reg-mobile" className="upshift-reg-label">
                    Mobile Number <span className="upshift-reg-required">*</span>
                  </label>
                  <div className={`upshift-reg-phone-wrapper ${errors.mobileNumber ? 'is-error' : ''}`}>
                    <span className="upshift-reg-phone-prefix">+91</span>
                    <input
                      id="reg-mobile"
                      name="mobileNumber"
                      type="tel"
                      autoComplete="tel"
                      required
                      value={formData.mobileNumber}
                      onChange={handleChange}
                      placeholder="98765 43210"
                      aria-invalid={!!errors.mobileNumber}
                      aria-describedby={errors.mobileNumber ? "reg-mobile-err" : undefined}
                      className="upshift-reg-phone-input"
                    />
                  </div>
                  {errors.mobileNumber && <p id="reg-mobile-err" className="upshift-reg-error-msg">{errors.mobileNumber}</p>}
                </div>

                {/* 5. Email */}
                <div className="upshift-reg-field">
                  <label htmlFor="reg-email" className="upshift-reg-label">
                    Email Address <span className="upshift-reg-required">*</span>
                  </label>
                  <input
                    id="reg-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "reg-email-err" : undefined}
                    className={`upshift-reg-input ${errors.email ? 'is-error' : ''}`}
                  />
                  {errors.email && <p id="reg-email-err" className="upshift-reg-error-msg">{errors.email}</p>}
                </div>

                {/* 6. City */}
                <div className="upshift-reg-field">
                  <label htmlFor="reg-city" className="upshift-reg-label">
                    City <span className="upshift-reg-required">*</span>
                  </label>
                  <input
                    id="reg-city"
                    name="city"
                    type="text"
                    autoComplete="address-level2"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Bengaluru / Mumbai"
                    aria-invalid={!!errors.city}
                    aria-describedby={errors.city ? "reg-city-err" : undefined}
                    className={`upshift-reg-input ${errors.city ? 'is-error' : ''}`}
                  />
                  {errors.city && <p id="reg-city-err" className="upshift-reg-error-msg">{errors.city}</p>}
                </div>

                {/* 7. State */}
                <div className="upshift-reg-field">
                  <label htmlFor="reg-state" className="upshift-reg-label">
                    State <span className="upshift-reg-required">*</span>
                  </label>
                  <input
                    id="reg-state"
                    name="state"
                    type="text"
                    autoComplete="address-level1"
                    required
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="e.g. Karnataka / Maharashtra"
                    aria-invalid={!!errors.state}
                    aria-describedby={errors.state ? "reg-state-err" : undefined}
                    className={`upshift-reg-input ${errors.state ? 'is-error' : ''}`}
                  />
                  {errors.state && <p id="reg-state-err" className="upshift-reg-error-msg">{errors.state}</p>}
                </div>
              </div>

              {/* ======================================================== */}
              {/* GROUP 2: ACCOUNT SECURITY                                */}
              {/* ======================================================== */}
              <div className="upshift-reg-section-heading">
                ACCOUNT SECURITY
              </div>

              <div className="upshift-reg-grid">
                {/* Password */}
                <div className="upshift-reg-field">
                  <label htmlFor="reg-password" className="upshift-reg-label">
                    Create Password <span className="upshift-reg-required">*</span>
                  </label>
                  <input
                    id="reg-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min 8 characters"
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? "reg-password-err" : undefined}
                    className={`upshift-reg-input ${errors.password ? 'is-error' : ''}`}
                  />
                  {errors.password && <p id="reg-password-err" className="upshift-reg-error-msg">{errors.password}</p>}
                </div>

                {/* Confirm Password */}
                <div className="upshift-reg-field">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '7px' }}>
                    <label htmlFor="reg-confirmPassword" className="upshift-reg-label" style={{ marginBottom: 0 }}>
                      Confirm Password <span className="upshift-reg-required">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(prev => !prev)}
                      style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '11px',
                        color: '#666666',
                        cursor: 'pointer',
                        textDecoration: 'underline'
                      }}
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  <input
                    id="reg-confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter password"
                    aria-invalid={!!errors.confirmPassword}
                    aria-describedby={errors.confirmPassword ? "reg-confirmPassword-err" : undefined}
                    className={`upshift-reg-input ${errors.confirmPassword ? 'is-error' : ''}`}
                  />
                  {errors.confirmPassword && <p id="reg-confirmPassword-err" className="upshift-reg-error-msg">{errors.confirmPassword}</p>}
                </div>
              </div>

              {/* ======================================================== */}
              {/* GROUP 3: ACADEMIC DETAILS                                */}
              {/* ======================================================== */}
              <div className="upshift-reg-section-heading">
                ACADEMIC DETAILS
              </div>

              <div className="upshift-reg-grid">
                {/* 8. Current Status */}
                <div className="upshift-reg-field upshift-reg-col-span-2">
                  <label htmlFor="reg-currentStatus" className="upshift-reg-label">
                    Current Status <span className="upshift-reg-required">*</span>
                  </label>
                  <select
                    id="reg-currentStatus"
                    name="currentStatus"
                    required
                    value={formData.currentStatus}
                    onChange={handleChange}
                    aria-invalid={!!errors.currentStatus}
                    aria-describedby={errors.currentStatus ? "reg-status-err" : undefined}
                    className={`upshift-reg-select ${errors.currentStatus ? 'is-error' : ''}`}
                  >
                    <option value="">Select your status</option>
                    <option value="Undergraduate">Undergraduate</option>
                    <option value="Graduate">Graduate</option>
                    <option value="Fresher">Fresher</option>
                    <option value="Working Professional">Working Professional</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.currentStatus && <p id="reg-status-err" className="upshift-reg-error-msg">{errors.currentStatus}</p>}
                </div>

                {/* 9. College / University Name (Span 2) */}
                <div className="upshift-reg-field upshift-reg-col-span-2">
                  <label htmlFor="reg-college" className="upshift-reg-label">
                    College / University Name <span className="upshift-reg-required">*</span>
                  </label>
                  <input
                    id="reg-college"
                    name="collegeUniversity"
                    type="text"
                    autoComplete="organization"
                    required
                    value={formData.collegeUniversity}
                    onChange={handleChange}
                    placeholder="e.g. NIT / Delhi University / BITS"
                    aria-invalid={!!errors.collegeUniversity}
                    aria-describedby={errors.collegeUniversity ? "reg-college-err" : undefined}
                    className={`upshift-reg-input ${errors.collegeUniversity ? 'is-error' : ''}`}
                  />
                  {errors.collegeUniversity && <p id="reg-college-err" className="upshift-reg-error-msg">{errors.collegeUniversity}</p>}
                </div>

                {/* 10. Course / Degree */}
                <div className="upshift-reg-field">
                  <label htmlFor="reg-courseDegree" className="upshift-reg-label">
                    Course / Degree <span className="upshift-reg-required">*</span>
                  </label>
                  <input
                    id="reg-courseDegree"
                    name="courseDegree"
                    type="text"
                    required
                    value={formData.courseDegree}
                    onChange={handleChange}
                    placeholder="e.g. B.Tech / BCA / B.Sc / MBA"
                    aria-invalid={!!errors.courseDegree}
                    aria-describedby={errors.courseDegree ? "reg-course-err" : undefined}
                    className={`upshift-reg-input ${errors.courseDegree ? 'is-error' : ''}`}
                  />
                  {errors.courseDegree && <p id="reg-course-err" className="upshift-reg-error-msg">{errors.courseDegree}</p>}
                </div>

                {/* 11. Branch / Specialization */}
                <div className="upshift-reg-field">
                  <label htmlFor="reg-branchSpecialization" className="upshift-reg-label">
                    Branch / Specialization <span className="upshift-reg-required">*</span>
                  </label>
                  <input
                    id="reg-branchSpecialization"
                    name="branchSpecialization"
                    type="text"
                    required
                    value={formData.branchSpecialization}
                    onChange={handleChange}
                    placeholder="e.g. Computer Science / AI / Design"
                    aria-invalid={!!errors.branchSpecialization}
                    aria-describedby={errors.branchSpecialization ? "reg-branch-err" : undefined}
                    className={`upshift-reg-input ${errors.branchSpecialization ? 'is-error' : ''}`}
                  />
                  {errors.branchSpecialization && <p id="reg-branch-err" className="upshift-reg-error-msg">{errors.branchSpecialization}</p>}
                </div>

                {/* 12. Current Year */}
                <div className="upshift-reg-field">
                  <label htmlFor="reg-currentYear" className="upshift-reg-label">
                    Current Year <span className="upshift-reg-required">*</span>
                  </label>
                  <select
                    id="reg-currentYear"
                    name="currentYear"
                    required
                    value={formData.currentYear}
                    onChange={handleChange}
                    aria-invalid={!!errors.currentYear}
                    aria-describedby={errors.currentYear ? "reg-currYear-err" : undefined}
                    className={`upshift-reg-select ${errors.currentYear ? 'is-error' : ''}`}
                  >
                    <option value="">Select current year</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="5th Year">5th Year</option>
                    <option value="Not Applicable">Not Applicable</option>
                  </select>
                  {errors.currentYear && <p id="reg-currYear-err" className="upshift-reg-error-msg">{errors.currentYear}</p>}
                </div>

                {/* 13. Expected Graduation Year */}
                <div className="upshift-reg-field">
                  <label htmlFor="reg-expectedGradYear" className="upshift-reg-label">
                    Expected Graduation Year <span className="upshift-reg-required">*</span>
                  </label>
                  <select
                    id="reg-expectedGradYear"
                    name="expectedGraduationYear"
                    required
                    value={formData.expectedGraduationYear}
                    onChange={handleChange}
                    aria-invalid={!!errors.expectedGraduationYear}
                    aria-describedby={errors.expectedGraduationYear ? "reg-gradYear-err" : undefined}
                    className={`upshift-reg-select ${errors.expectedGraduationYear ? 'is-error' : ''}`}
                  >
                    <option value="">Select graduation year</option>
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                    <option value="2027">2027</option>
                    <option value="2028">2028</option>
                    <option value="2029">2029</option>
                    <option value="2030">2030</option>
                    <option value="Not Applicable">Not Applicable</option>
                  </select>
                  {errors.expectedGraduationYear && <p id="reg-gradYear-err" className="upshift-reg-error-msg">{errors.expectedGraduationYear}</p>}
                </div>
              </div>

              {/* ======================================================== */}
              {/* GROUP 4: DISCOVERY                                       */}
              {/* ======================================================== */}
              <div className="upshift-reg-section-heading">
                DISCOVERY
              </div>

              <div className="upshift-reg-grid">
                {/* 14. Where did you hear about us? (Span 2) */}
                <div className="upshift-reg-field upshift-reg-col-span-2">
                  <label htmlFor="reg-heardAboutUs" className="upshift-reg-label">
                    Where did you hear about us? <span className="upshift-reg-optional">(Optional)</span>
                  </label>
                  <select
                    id="reg-heardAboutUs"
                    name="heardAboutUs"
                    value={formData.heardAboutUs}
                    onChange={handleChange}
                    className="upshift-reg-select"
                  >
                    <option value="">Select option</option>
                    <option value="Instagram">Instagram</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="YouTube">YouTube</option>
                    <option value="Google Search">Google Search</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Friend / Referral">Friend / Referral</option>
                    <option value="College / University">College / University</option>
                    <option value="Event / Workshop">Event / Workshop</option>
                    <option value="The AI School">The AI School</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Form Action Footer */}
              <div className="upshift-reg-footer">
                <span className="upshift-reg-footer-note">
                  Next Step: Secure Razorpay Checkout · ₹4,999 One-Time
                </span>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="upshift-reg-btn-cancel"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="upshift-reg-btn-submit"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Proceeding...</span>
                    </>
                  ) : (
                    <>
                      <span>Proceed to Payment (₹4,999)</span>
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </div>
            </form>
        </div>
      </div>
    </div>
  );
}
