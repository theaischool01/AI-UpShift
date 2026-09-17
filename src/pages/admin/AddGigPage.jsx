import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Briefcase, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Globe, 
  Building, 
  MapPin, 
  Clock, 
  FileText, 
  Hash, 
  ExternalLink 
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';

export default function AddGigPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editGigId = searchParams.get('id'); // If id exists, it's Edit mode

  const { session } = useAuth();

  // Form input state
  const [formData, setFormData] = useState({
    externalGigId: '',
    title: '',
    courseId: '',
    shortDescription: '',
    longDescription: '',
    originSite: '',
    originUrl: '',
    organization: '',
    paymentAmount: '',
    location: 'Remote',
    engagementType: 'Contract',
  });

  // Courses loaded from database
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  // Edit load state
  const [loadingInitial, setLoadingInitial] = useState(Boolean(editGigId));
  const [initialLoadError, setInitialLoadError] = useState(null);

  // Form state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [successGig, setSuccessGig] = useState(null);

  // Load courses
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
        console.warn('[AddGigPage] Failed to fetch courses:', err);
      } finally {
        setLoadingCourses(false);
      }
    }
    loadCourses();
  }, []);

  // If in edit mode, fetch existing gig
  useEffect(() => {
    if (!editGigId) return;

    async function loadGig() {
      try {
        setLoadingInitial(true);
        const { data, error } = await supabase
          .from('gigs')
          .select('*')
          .eq('id', editGigId)
          .single();

        if (error) throw error;
        if (data) {
          setFormData({
            externalGigId: data.external_gig_id || '',
            title: data.title || '',
            courseId: data.course_id || '',
            shortDescription: data.short_description || '',
            longDescription: data.long_description || '',
            originSite: data.origin_site || '',
            originUrl: data.origin_url || '',
            organization: data.organization || '',
            paymentAmount: data.payment_amount || '',
            location: data.location || 'Remote',
            engagementType: data.engagement_type || 'Contract',
          });
        }
      } catch (err) {
        setInitialLoadError('Unable to load gig for editing.');
      } finally {
        setLoadingInitial(false);
      }
    }
    loadGig();
  }, [editGigId]);

  // URL security validator: strictly accepts HTTP or HTTPS
  const isValidHttpUrl = (str) => {
    try {
      const parsed = new URL(str);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Gig title is required.';
    }

    if (!formData.courseId) {
      newErrors.courseId = 'Please assign a relevant learning track.';
    }

    if (!formData.paymentAmount.trim()) {
      newErrors.paymentAmount = 'Payment amount is required.';
    } else if (formData.paymentAmount.trim().length > 80) {
      newErrors.paymentAmount = 'Payment amount cannot exceed 80 characters.';
    }

    if (!formData.shortDescription.trim()) {
      newErrors.shortDescription = 'Short card description is required.';
    }

    if (!formData.longDescription.trim()) {
      newErrors.longDescription = 'Detailed description is required.';
    }

    if (!formData.originSite.trim()) {
      newErrors.originSite = 'Origin platform name is required (e.g. Upwork, Contra, Wellfound).';
    }

    if (!formData.originUrl.trim()) {
      newErrors.originUrl = 'External application URL is required.';
    } else if (!isValidHttpUrl(formData.originUrl.trim())) {
      newErrors.originUrl = 'Must be a valid HTTP or HTTPS web URL (e.g. https://...).';
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

    const payload = {
      external_gig_id: formData.externalGigId.trim() || null,
      title: formData.title.trim(),
      course_id: formData.courseId,
      payment_amount: formData.paymentAmount.trim(),
      short_description: formData.shortDescription.trim(),
      long_description: formData.longDescription.trim(),
      origin_site: formData.originSite.trim(),
      origin_url: formData.originUrl.trim(),
      organization: formData.organization.trim() || null,
      location: formData.location.trim() || 'Remote',
      engagement_type: formData.engagementType.trim() || null,
    };

    try {
      if (editGigId) {
        // UPDATE existing gig
        const { data, error } = await supabase
          .from('gigs')
          .update(payload)
          .eq('id', editGigId)
          .select()
          .single();

        if (error) {
          if (error.code === 'PGRST204' || error.code === '42703' || error.message?.toLowerCase().includes('payment_amount')) {
            throw new Error('Payment field is not available in the database. Apply the latest database migration before saving gigs.');
          }
          if (error.code === '23505' && error.message.includes('external_gig_id')) {
            throw new Error(`A gig with External ID "${payload.external_gig_id}" already exists.`);
          }
          throw error;
        }

        setSuccessGig(data);
      } else {
        // INSERT new gig
        const { data, error } = await supabase
          .from('gigs')
          .insert(payload)
          .select()
          .single();

        if (error) {
          if (error.code === 'PGRST204' || error.code === '42703' || error.message?.toLowerCase().includes('payment_amount')) {
            throw new Error('Payment field is not available in the database. Apply the latest database migration before saving gigs.');
          }
          if (error.code === '23505' && error.message.includes('external_gig_id')) {
            throw new Error(`A gig with External ID "${payload.external_gig_id}" already exists.`);
          }
          throw error;
        }

        setSuccessGig(data);
      }
    } catch (err) {
      setSubmitError(err.message || 'Failed to save opportunity. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setFormData({
      externalGigId: '',
      title: '',
      courseId: '',
      shortDescription: '',
      longDescription: '',
      originSite: '',
      originUrl: '',
      organization: '',
      paymentAmount: '',
      location: 'Remote',
      engagementType: 'Contract',
    });
    setErrors({});
    setSubmitError(null);
    setSuccessGig(null);
  };

  if (loadingInitial) {
    return (
      <div className="p-12 text-center text-gray-500 flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 text-[#E31B23] animate-spin" />
        <span className="text-sm">Loading opportunity details...</span>
      </div>
    );
  }

  if (initialLoadError) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <div className="admin-card p-6 border-red-200 bg-red-50 text-red-900 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold">Error Loading Opportunity</h3>
            <p className="text-xs text-red-700 mt-1">{initialLoadError}</p>
            <Link to="/admin/gigs" className="mt-3 inline-block text-xs font-semibold text-red-800 underline">
              Return to Gigs Directory
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page max-w-4xl space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
        <Link to="/admin/gigs" className="hover:text-gray-900 transition-colors">Gigs</Link>
        <span>/</span>
        <span className="text-gray-900 font-semibold">{editGigId ? 'Edit Gig' : 'Add Gig'}</span>
      </div>

      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-[#E31B23]" />
            {editGigId ? 'Edit Opportunity' : 'Add New Opportunity'}
          </h1>
          <p>
            Store external commercial projects and gigs for UpShift learners to explore and apply to on origin platforms.
          </p>
        </div>

        <div className="admin-page-actions">
          <Link to="/admin/gigs" className="admin-btn-secondary">
            <ArrowLeft className="w-4 h-4 text-gray-600" />
            <span>Back to Gigs</span>
          </Link>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successGig && (
        <div className="admin-card p-6 border-emerald-200 bg-emerald-50/40">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  {editGigId ? 'Opportunity Updated Successfully' : 'Opportunity Created Successfully'}
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  <strong>{successGig.title}</strong> is now live on the UpShift opportunity board.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {!editGigId && (
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="admin-btn-secondary"
                >
                  Add Another Gig
                </button>
              )}
              <button
                type="button"
                onClick={() => navigate('/admin/gigs')}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#111827] hover:bg-black rounded-lg transition-colors"
              >
                View Gigs Directory
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form Error Banner */}
      {submitError && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-800">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-semibold text-sm text-red-900">Unable to save opportunity</p>
            <p className="mt-0.5">{submitError}</p>
          </div>
        </div>
      )}

      {/* Form Card */}
      {/* Form Card */}
      <form onSubmit={handleSubmit} className="admin-card space-y-6">
        {/* Section 1: Core Identification */}
        <div>
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-[#E31B23]" />
            Opportunity Overview
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div className="admin-form-group md:col-span-2">
              <label htmlFor="gigTitle" className="admin-form-label">
                Opportunity Title <span className="text-[#E31B23]">*</span>
              </label>
              <input
                id="gigTitle"
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g. AI Video Editor for Short-Form Reel Campaign"
                className={`admin-input ${errors.title ? 'border-red-400' : ''}`}
              />
              {errors.title && <p className="text-[11px] text-red-600 mt-1">{errors.title}</p>}
            </div>

            {/* Curriculum Course Track */}
            <div className="admin-form-group">
              <label htmlFor="courseId" className="admin-form-label">
                Relevant Curriculum Track <span className="text-[#E31B23]">*</span>
              </label>
              <select
                id="courseId"
                value={formData.courseId}
                onChange={(e) => handleInputChange('courseId', e.target.value)}
                disabled={loadingCourses}
                className={`admin-select ${errors.courseId ? 'border-red-400' : ''}`}
              >
                <option value="">Select track...</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code} — {c.name} ({c.category})
                  </option>
                ))}
              </select>
              {errors.courseId && <p className="text-[11px] text-red-600 mt-1">{errors.courseId}</p>}
            </div>

            {/* External Gig ID */}
            <div className="admin-form-group">
              <label htmlFor="externalGigId" className="admin-form-label">
                External Gig ID <span className="admin-form-label-optional">(Optional)</span>
              </label>
              <input
                id="externalGigId"
                type="text"
                value={formData.externalGigId}
                onChange={(e) => handleInputChange('externalGigId', e.target.value)}
                placeholder="e.g. UPW-98231 or CONTRA-441"
                className="admin-input font-mono"
              />
              <span className="admin-form-helper">
                Optional — used as deduplication key.
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: External Origin & Application Gateway */}
        <div>
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#E31B23]" />
            Origin Platform & Apply Gateway
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Origin Site Name */}
            <div className="admin-form-group">
              <label htmlFor="originSite" className="admin-form-label">
                Origin Platform Name <span className="text-[#E31B23]">*</span>
              </label>
              <input
                id="originSite"
                type="text"
                value={formData.originSite}
                onChange={(e) => handleInputChange('originSite', e.target.value)}
                placeholder="e.g. Upwork, Contra, Wellfound, LinkedIn"
                className={`admin-input ${errors.originSite ? 'border-red-400' : ''}`}
              />
              {errors.originSite && <p className="text-[11px] text-red-600 mt-1">{errors.originSite}</p>}
            </div>

            {/* Origin URL */}
            <div className="admin-form-group">
              <label htmlFor="originUrl" className="admin-form-label">
                External Apply URL <span className="text-[#E31B23]">*</span>
              </label>
              <input
                id="originUrl"
                type="url"
                value={formData.originUrl}
                onChange={(e) => handleInputChange('originUrl', e.target.value)}
                placeholder="https://contra.com/opportunity/..."
                className={`admin-input ${errors.originUrl ? 'border-red-400' : ''}`}
              />
              {errors.originUrl && <p className="text-[11px] text-red-600 mt-1">{errors.originUrl}</p>}
            </div>

            {/* Organization / Client */}
            <div className="admin-form-group">
              <label htmlFor="organization" className="admin-form-label">
                Organization / Client Name <span className="admin-form-label-optional">(Optional)</span>
              </label>
              <input
                id="organization"
                type="text"
                value={formData.organization}
                onChange={(e) => handleInputChange('organization', e.target.value)}
                placeholder="e.g. Velocity Media Labs"
                className="admin-input"
              />
            </div>

            {/* Payment Amount */}
            <div className="admin-form-group">
              <label htmlFor="paymentAmount" className="admin-form-label">
                Payment Amount <span className="text-[#E31B23]">*</span>
              </label>
              <input
                id="paymentAmount"
                type="text"
                value={formData.paymentAmount}
                onChange={(e) => handleInputChange('paymentAmount', e.target.value)}
                placeholder="e.g. $25/hr or $500/project"
                maxLength={80}
                className={`admin-input ${errors.paymentAmount ? 'border-red-400' : ''}`}
              />
              <span className="admin-form-helper">
                Flexible compensation (e.g. $25/hr, $500/project, $20–35/hr). Max 80 chars.
              </span>
              {errors.paymentAmount && <p className="text-[11px] text-red-600 mt-1">{errors.paymentAmount}</p>}
            </div>

            {/* Location */}
            <div className="admin-form-group">
              <label htmlFor="location" className="admin-form-label">
                Location
              </label>
              <input
                id="location"
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Remote / Bangalore"
                className="admin-input"
              />
            </div>

            {/* Engagement Type */}
            <div className="admin-form-group">
              <label htmlFor="engagementType" className="admin-form-label">
                Engagement Type
              </label>
              <select
                id="engagementType"
                value={formData.engagementType}
                onChange={(e) => handleInputChange('engagementType', e.target.value)}
                className="admin-select"
              >
                <option value="Contract">Contract</option>
                <option value="Freelance">Freelance</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Full-Time">Full-Time</option>
                <option value="Bounty / Fixed">Bounty / Fixed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Descriptions */}
        <div>
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#E31B23]" />
            Opportunity Descriptions
          </h2>

          <div className="space-y-4">
            {/* Short Description */}
            <div className="admin-form-group">
              <label htmlFor="shortDescription" className="admin-form-label">
                Short Summary Snippet <span className="text-[#E31B23]">*</span>
              </label>
              <textarea
                id="shortDescription"
                rows={2}
                value={formData.shortDescription}
                onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                placeholder="Produce 15 viral AI reels for an upcoming tech launch using modern synthesis workflows."
                className={`admin-textarea ${errors.shortDescription ? 'border-red-400' : ''}`}
                style={{ minHeight: '80px' }}
              />
              <span className="admin-form-helper">
                Displayed on opportunity browse cards (1–2 concise sentences).
              </span>
              {errors.shortDescription && <p className="text-[11px] text-red-600 mt-1">{errors.shortDescription}</p>}
            </div>

            {/* Long Description */}
            <div className="admin-form-group">
              <label htmlFor="longDescription" className="admin-form-label">
                Detailed Opportunity Scope <span className="text-[#E31B23]">*</span>
              </label>
              <textarea
                id="longDescription"
                rows={5}
                value={formData.longDescription}
                onChange={(e) => handleInputChange('longDescription', e.target.value)}
                placeholder="Full deliverables, project timeline, tool prerequisites, and application instructions..."
                className={`admin-textarea ${errors.longDescription ? 'border-red-400' : ''}`}
                style={{ minHeight: '130px' }}
              />
              <span className="admin-form-helper">
                Complete role background, expectations, deliverables, and origin apply instructions.
              </span>
              {errors.longDescription && <p className="text-[11px] text-red-600 mt-1">{errors.longDescription}</p>}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="admin-form-actions">
          <Link to="/admin/gigs" className="admin-btn-secondary">
            Cancel
          </Link>

          <button
            type="submit"
            disabled={isSubmitting}
            className="admin-btn-primary"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Opportunity...</span>
              </>
            ) : (
              <>
                <Briefcase className="w-4 h-4" />
                <span>{editGigId ? 'Update Opportunity' : 'Publish Opportunity'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
