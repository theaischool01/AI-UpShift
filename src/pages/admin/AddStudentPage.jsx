import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  UserPlus,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Users,
  Lock,
  Mail,
  GraduationCap,
  User,
  Eye,
  EyeOff
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';

export default function AddStudentPage() {
  const navigate = useNavigate();
  const { session } = useAuth();

  // Form inputs
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    collegeEmail: '',
    college: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  // Form submission state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [createdStudent, setCreatedStudent] = useState(null);

  // Validate form inputs
  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Account email is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.collegeEmail.trim()) {
      newErrors.collegeEmail = 'College email is required.';
    } else if (!emailRegex.test(formData.collegeEmail.trim())) {
      newErrors.collegeEmail = 'Please enter a valid college email address.';
    }

    if (!formData.college.trim()) {
      newErrors.college = 'College or University name is required.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters in length.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
    if (submitError) setSubmitError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const payload = {
        learner: {
          full_name: formData.fullName.trim(),
          email: formData.email.trim().toLowerCase(),
          college_email: formData.collegeEmail.trim().toLowerCase(),
          college: formData.college.trim(),
          password: formData.password,
          program_id: 'upshift-complete-program',
        },
      };

      // Invoke the secure Edge Function using the authenticated session
      const { data, error } = await supabase.functions.invoke('admin-create-learner', {
        body: payload,
      });

      if (error) {
        let errorMsg = error.message;
        // In @supabase/supabase-js, when an edge function returns a non-2xx status,
        // the response body can be extracted from error.context if it's a Response object
        if (error.context && typeof error.context.json === 'function') {
          try {
            const errBody = await error.context.json();
            if (errBody?.error) errorMsg = errBody.error;
          } catch (_) {}
        }
        throw new Error(errorMsg || 'Failed to create student account.');
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Unable to create student account. Please verify the input.');
      }

      const resultData = data;

      // Success: store created details and reset form
      setCreatedStudent(resultData.learner);
      setFormData({
        fullName: '',
        email: '',
        collegeEmail: '',
        college: '',
        password: '',
      });
    } catch (err) {
      console.error('[AddStudentPage] Error creating student:', err);
      setSubmitError(err.message || 'Unable to create student. Please verify the information and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForAnother = () => {
    setCreatedStudent(null);
    setSubmitError(null);
    setErrors({});
  };

  return (
    <div className="admin-page max-w-3xl">
      {/* Normalized Page Header with Title and Back Action */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">
            <UserPlus size={22} />
            <span>Add Student</span>
          </h1>
          <p className="admin-page-description">
            Create a learner account and enroll them into the UpShift Program.
          </p>
        </div>

        <div className="admin-page-actions">
          <Link
            to="/admin/students"
            className="admin-btn admin-btn-secondary"
          >
            <ArrowLeft size={14} />
            <span>Back to Students</span>
          </Link>
        </div>
      </div>

      {/* Success State View */}
      {createdStudent ? (
        <div className="admin-card border-emerald-200 bg-emerald-50/40 p-6 sm:p-8 space-y-6">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 size={22} />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">
                Student Created Successfully
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                The learner account, profile, and UpShift program enrollment have been provisioned in the database.
              </p>
            </div>
          </div>

          {/* Details Summary */}
          <div className="bg-white rounded-xl border border-emerald-100 p-4 space-y-2.5 text-xs">
            <div className="flex justify-between py-1 border-b border-gray-100">
              <span className="text-gray-500">Student Name:</span>
              <span className="font-bold text-gray-900">{createdStudent.full_name}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-100">
              <span className="text-gray-500">Account Email:</span>
              <span className="font-mono text-gray-900">{createdStudent.email}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-100">
              <span className="text-gray-500">College Email:</span>
              <span className="font-mono text-gray-900">{createdStudent.college_email || '—'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-100">
              <span className="text-gray-500">College / University:</span>
              <span className="font-bold text-gray-900">{createdStudent.college || '—'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-100">
              <span className="text-gray-500">Program:</span>
              <span className="font-semibold text-gray-900">UpShift Complete Applied AI Program</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-500">Status:</span>
              <span className="font-semibold text-emerald-700">● Active Enrollment</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/admin/students"
              className="admin-btn admin-btn-primary"
            >
              <Users size={14} />
              <span>View Students Directory</span>
            </Link>

            <button
              onClick={handleResetForAnother}
              className="admin-btn admin-btn-secondary"
            >
              <UserPlus size={14} />
              <span>Add Another Student</span>
            </button>
          </div>
        </div>
      ) : (
        /* Student Registration Form */
        <div className="admin-card">
          {submitError && (
            <div
              role="alert"
              className="admin-alert admin-alert-danger"
              style={{ marginBottom: '20px' }}
            >
              <div className="admin-alert-content">
                <AlertCircle size={16} />
                <span>{submitError}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Full Name */}
            <div className="admin-form-group">
              <label htmlFor="fullName" className="admin-form-label">
                Full Name <span className="admin-form-req">*</span>
              </label>
              <div className="admin-input-wrapper">
                <div className="admin-input-icon">
                  <User size={18} />
                </div>
                <input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="e.g. Maya Lin"
                  className={`admin-input admin-input-with-icon ${errors.fullName ? 'has-error' : ''}`}
                  disabled={isSubmitting}
                />
              </div>
              {errors.fullName && (
                <p className="admin-form-error">{errors.fullName}</p>
              )}
            </div>

            {/* Account Email & College Email Grid */}
            <div className="admin-grid-2" style={{ marginBottom: '18px' }}>
              {/* Account Email */}
              <div className="admin-form-group" style={{ marginBottom: 0 }}>
                <label htmlFor="email" className="admin-form-label">
                  Account Email <span className="admin-form-req">*</span>
                </label>
                <div className="admin-input-wrapper">
                  <div className="admin-input-icon">
                    <Mail size={18} />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="learner@example.com"
                    className={`admin-input admin-input-with-icon ${errors.email ? 'has-error' : ''}`}
                    disabled={isSubmitting}
                  />
                </div>
                {errors.email && (
                  <p className="admin-form-error">{errors.email}</p>
                )}
              </div>

              {/* College Email */}
              <div className="admin-form-group" style={{ marginBottom: 0 }}>
                <label htmlFor="collegeEmail" className="admin-form-label">
                  College Email <span className="admin-form-req">*</span>
                </label>
                <div className="admin-input-wrapper">
                  <div className="admin-input-icon">
                    <GraduationCap size={18} />
                  </div>
                  <input
                    id="collegeEmail"
                    type="email"
                    value={formData.collegeEmail}
                    onChange={(e) => handleInputChange('collegeEmail', e.target.value)}
                    placeholder="student@university.edu"
                    className={`admin-input admin-input-with-icon ${errors.collegeEmail ? 'has-error' : ''}`}
                    disabled={isSubmitting}
                  />
                </div>
                {errors.collegeEmail && (
                  <p className="admin-form-error">{errors.collegeEmail}</p>
                )}
              </div>
            </div>

            {/* College Name */}
            <div className="admin-form-group">
              <label htmlFor="college" className="admin-form-label">
                College / University <span className="admin-form-req">*</span>
              </label>
              <div className="admin-input-wrapper">
                <div className="admin-input-icon">
                  <GraduationCap size={18} />
                </div>
                <input
                  id="college"
                  type="text"
                  value={formData.college}
                  onChange={(e) => handleInputChange('college', e.target.value)}
                  placeholder="e.g. Stanford University"
                  className={`admin-input admin-input-with-icon ${errors.college ? 'has-error' : ''}`}
                  disabled={isSubmitting}
                />
              </div>
              {errors.college && (
                <p className="admin-form-error">{errors.college}</p>
              )}
            </div>

            {/* Password */}
            <div className="admin-form-group">
              <label htmlFor="password" className="admin-form-label">
                Initial Password <span className="admin-form-req">*</span>
              </label>
              <div className="admin-input-wrapper">
                <div className="admin-input-icon">
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Minimum 8 characters"
                  className={`admin-input admin-input-with-icon ${errors.password ? 'has-error' : ''}`}
                  style={{ paddingRight: '42px' }}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="admin-input-right-action"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: '4px' }}
                  title={showPassword ? 'Hide password' : 'Show password'}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password ? (
                <p className="admin-form-error">{errors.password}</p>
              ) : (
                <p className="admin-form-helper">Must be at least 8 characters. Communicated securely to the learner.</p>
              )}
            </div>

            {/* Submit Action */}
            <div className="admin-form-actions">
              <Link
                to="/admin/students"
                className="admin-btn admin-btn-secondary"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={isSubmitting}
                className="admin-btn admin-btn-primary"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Creating learner...</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={14} />
                    <span>Create Learner Account</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
