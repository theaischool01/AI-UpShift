import React, { useState, useEffect } from 'react';
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
  BookOpen,
  User
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
    courseId: '',
  });

  // Available courses loaded dynamically from database
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  // Form submission state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [createdStudent, setCreatedStudent] = useState(null);

  // Load active courses from Supabase
  useEffect(() => {
    async function loadCourses() {
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('id, code, name, category')
          .order('code', { ascending: true });

        if (error) throw error;
        setCourses(data || []);
      } catch (err) {
        console.warn('[AddStudentPage] Error loading courses:', err);
      } finally {
        setLoadingCourses(false);
      }
    }
    loadCourses();
  }, []);

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

    if (!formData.courseId) {
      newErrors.courseId = 'Please select a flagship curriculum track.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear inline error on edit
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
          course_id: formData.courseId,
        },
      };

      // Invoke the secure Edge Function using the authenticated session
      let resultData = null;

      // Method A: supabase.functions.invoke
      const { data, error } = await supabase.functions.invoke('admin-create-learner', {
        body: payload,
      });

      if (error) {
        // Fallback: direct HTTP fetch to functions endpoint if invoke encountered network error
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const token = session?.access_token;

        if (token && supabaseUrl) {
          const res = await fetch(`${supabaseUrl}/functions/v1/admin-create-learner`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          });

          const json = await res.json();
          if (!res.ok) {
            throw new Error(json.error || 'Failed to create student account.');
          }
          resultData = json;
        } else {
          throw new Error(error.message || 'Failed to communicate with student creation service.');
        }
      } else {
        resultData = data;
      }

      if (!resultData?.success) {
        throw new Error(resultData?.error || 'Unable to create student account. Please verify the input.');
      }

      // Success: store created details and reset form
      setCreatedStudent(resultData.learner);
      setFormData({
        fullName: '',
        email: '',
        collegeEmail: '',
        college: '',
        password: '',
        courseId: '',
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
    <div className="admin-page max-w-3xl space-y-6">
      {/* Normalized Page Header with Title and Back Action */}
      <div className="admin-page-header">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-extrabold text-[#111827] tracking-tight m-0">
            <UserPlus className="w-6 h-6 text-[#E31B23]" />
            Add Student
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
            Create a learner account and enroll them into an UpShift curriculum track.
          </p>
        </div>

        <div className="admin-page-actions">
          <Link
            to="/admin/students"
            className="admin-btn-secondary"
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
                The learner account, profile, and track enrollment have been provisioned in the database.
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
              <span className="text-gray-500">Enrolled Course:</span>
              <span className="font-bold text-gray-900">
                {createdStudent.course_code ? `${createdStudent.course_code} — ` : ''}{createdStudent.course_name || createdStudent.course_id}
              </span>
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
              className="admin-btn-primary"
            >
              <Users size={14} />
              <span>View Students Directory</span>
            </Link>

            <button
              onClick={handleResetForAnother}
              className="admin-btn-secondary"
            >
              <UserPlus size={14} />
              <span>Add Another Student</span>
            </button>
          </div>
        </div>
      ) : (
        /* Student Registration Form */
        <div className="admin-card p-6 sm:p-8">
          {submitError && (
            <div
              role="alert"
              className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3 text-left"
            >
              <AlertCircle size={17} className="text-[#E31B23] flex-shrink-0" />
              <p className="text-xs sm:text-sm text-red-800 font-medium">
                {submitError}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Full Name */}
            <div className="admin-form-group">
              <label htmlFor="fullName" className="admin-form-label">
                Full Name <span className="text-[#E31B23]">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 z-10">
                  <User size={15} />
                </div>
                <input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="e.g. Maya Lin"
                  className={`admin-input pl-9 ${errors.fullName ? 'border-red-400' : ''}`}
                  disabled={isSubmitting}
                />
              </div>
              {errors.fullName && (
                <p className="text-[11px] text-red-600 mt-1">{errors.fullName}</p>
              )}
            </div>

            {/* Account Email & College Email Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Account Email */}
              <div className="admin-form-group">
                <label htmlFor="email" className="admin-form-label">
                  Email <span className="text-[#E31B23]">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 z-10">
                    <Mail size={15} />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="learner@example.com"
                    className={`admin-input pl-9 ${errors.email ? 'border-red-400' : ''}`}
                    disabled={isSubmitting}
                  />
                </div>
                {errors.email && (
                  <p className="text-[11px] text-red-600 mt-1">{errors.email}</p>
                )}
              </div>

              {/* College Email */}
              <div className="admin-form-group">
                <label htmlFor="collegeEmail" className="admin-form-label">
                  College Email <span className="text-[#E31B23]">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 z-10">
                    <GraduationCap size={15} />
                  </div>
                  <input
                    id="collegeEmail"
                    type="email"
                    value={formData.collegeEmail}
                    onChange={(e) => handleInputChange('collegeEmail', e.target.value)}
                    placeholder="student@university.edu"
                    className={`admin-input pl-9 ${errors.collegeEmail ? 'border-red-400' : ''}`}
                    disabled={isSubmitting}
                  />
                </div>
                {errors.collegeEmail && (
                  <p className="text-[11px] text-red-600 mt-1">{errors.collegeEmail}</p>
                )}
              </div>
            </div>

            {/* College Name */}
            <div className="admin-form-group">
              <label htmlFor="college" className="admin-form-label">
                College / University <span className="text-[#E31B23]">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 z-10">
                  <GraduationCap size={15} />
                </div>
                <input
                  id="college"
                  type="text"
                  value={formData.college}
                  onChange={(e) => handleInputChange('college', e.target.value)}
                  placeholder="e.g. Stanford University"
                  className={`admin-input pl-9 ${errors.college ? 'border-red-400' : ''}`}
                  disabled={isSubmitting}
                />
              </div>
              {errors.college && (
                <p className="text-[11px] text-red-600 mt-1">{errors.college}</p>
              )}
            </div>

            {/* Password */}
            <div className="admin-form-group">
              <label htmlFor="password" className="admin-form-label">
                Initial Password <span className="text-[#E31B23]">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 z-10">
                  <Lock size={15} />
                </div>
                <input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Minimum 8 characters"
                  className={`admin-input pl-9 ${errors.password ? 'border-red-400' : ''}`}
                  disabled={isSubmitting}
                />
              </div>
              {errors.password ? (
                <p className="text-[11px] text-red-600 mt-1">{errors.password}</p>
              ) : (
                <p className="text-[11px] text-gray-400 mt-1">Must be at least 8 characters. Communicated securely to the learner.</p>
              )}
            </div>

            {/* Course Dropdown */}
            <div className="admin-form-group">
              <label htmlFor="courseId" className="admin-form-label">
                Flagship Curriculum Track <span className="text-[#E31B23]">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 z-10">
                  <BookOpen size={15} />
                </div>
                <select
                  id="courseId"
                  value={formData.courseId}
                  onChange={(e) => handleInputChange('courseId', e.target.value)}
                  disabled={loadingCourses || isSubmitting}
                  className={`admin-select pl-9 ${errors.courseId ? 'border-red-400' : ''}`}
                >
                  <option value="">Select a flagship track...</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.code} — {course.name} ({course.category})
                    </option>
                  ))}
                </select>
              </div>
              {errors.courseId && (
                <p className="text-[11px] text-red-600 mt-1">{errors.courseId}</p>
              )}
            </div>

            {/* Submit Action */}
            <div className="admin-form-actions">
              <Link
                to="/admin/students"
                className="admin-btn-secondary"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={isSubmitting || loadingCourses}
                className="admin-btn-primary"
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
