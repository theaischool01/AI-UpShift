import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Briefcase, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Plus, 
  Trash2, 
  ListChecks, 
  Target, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { 
  fetchTracks as fetchTracksService, 
  fetchGigById as fetchGigByIdService, 
  createGig as createGigService, 
  updateGig as updateGigService 
} from '../../services/gigService';

export default function AddGigPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editGigId = searchParams.get('id');

  // Form input state
  const [formData, setFormData] = useState({
    externalGigId: '',
    title: '',
    trackId: '',
    paymentAmount: '',
    compensationType: 'fixed',
    minAmount: '',
    maxAmount: '',
    currency: 'INR',
    priority: '0',
    isFeatured: false,
    postedAt: '',
    shortDescription: '',
    overview: '',
    responsibilities: [''],
    deliverables: [''],
    requirements: [''],
    proofSpec: '',
    originUrl: '',
  });

  // Tracks loaded from database
  const [tracks, setTracks] = useState([]);
  const [loadingTracks, setLoadingTracks] = useState(true);

  // Edit load state
  const [loadingInitial, setLoadingInitial] = useState(Boolean(editGigId));
  const [initialLoadError, setInitialLoadError] = useState(null);

  // Form state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [successGig, setSuccessGig] = useState(null);

  // Load tracks
  useEffect(() => {
    async function loadTracks() {
      setLoadingTracks(true);
      const { data, error } = await fetchTracksService();
      if (!error && data) {
        setTracks(data);
      } else {
        console.warn('[AddGigPage] Failed to fetch tracks:', error);
      }
      setLoadingTracks(false);
    }
    loadTracks();
  }, []);

  // If in edit mode, fetch existing gig
  useEffect(() => {
    if (!editGigId) return;

    async function loadGig() {
      setLoadingInitial(true);
      const { data, error } = await fetchGigByIdService(editGigId);

      if (error || !data) {
        setInitialLoadError(error?.message || 'Unable to load opportunity for editing.');
      } else {
        const respList = Array.isArray(data.responsibilities) && data.responsibilities.length > 0
          ? data.responsibilities
          : (typeof data.responsibilities === 'string' ? data.responsibilities.split('\n').filter(Boolean) : ['']);

        const delivList = Array.isArray(data.deliverables) && data.deliverables.length > 0
          ? data.deliverables
          : (typeof data.deliverables === 'string' ? data.deliverables.split('\n').filter(Boolean) : ['']);

        const reqList = Array.isArray(data.requirements) && data.requirements.length > 0
          ? data.requirements
          : (typeof data.requirements === 'string' ? data.requirements.split('\n').filter(Boolean) : ['']);

        setFormData({
          externalGigId: data.external_gig_id || '',
          title: data.title || '',
          trackId: data.track_id || '',
          paymentAmount: data.payment_amount || '',
          compensationType: data.compensation_type || 'fixed',
          minAmount: data.min_amount != null ? String(data.min_amount) : '',
          maxAmount: data.max_amount != null ? String(data.max_amount) : '',
          currency: data.currency || 'INR',
          priority: String(data.priority || 0),
          isFeatured: Boolean(data.is_featured),
          postedAt: data.posted_at ? new Date(data.posted_at).toISOString().split('T')[0] : '',
          shortDescription: data.short_description || '',
          overview: data.overview || '',
          responsibilities: respList.length > 0 ? respList : [''],
          deliverables: delivList.length > 0 ? delivList : [''],
          requirements: reqList.length > 0 ? reqList : [''],
          proofSpec: data.proof_spec || '',
          originUrl: data.origin_url || '',
        });
      }
      setLoadingInitial(false);
    }

    loadGig();
  }, [editGigId]);

  // Handle single field change
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  // Dynamic list manipulation
  const handleListChange = (field, index, value) => {
    const list = [...formData[field]];
    list[index] = value;
    setFormData(prev => ({ ...prev, [field]: list }));
  };

  const handleAddListItem = (field) => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const handleRemoveListItem = (field, index) => {
    const list = formData[field].filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, [field]: list.length > 0 ? list : [''] }));
  };

  // Form Validation
  const validateForm = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Opportunity title is required.';
    if (!formData.trackId) errs.trackId = 'Please select an associated UpShift track.';
    if (!formData.originUrl.trim()) {
      errs.originUrl = 'External apply origin URL is required.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm() || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const cleanResponsibilities = formData.responsibilities.map(r => r.trim()).filter(Boolean);
      const cleanDeliverables = formData.deliverables.map(d => d.trim()).filter(Boolean);
      const cleanRequirements = formData.requirements.map(r => r.trim()).filter(Boolean);

      const parsedMin = formData.minAmount.trim() !== '' && !isNaN(formData.minAmount) ? parseFloat(formData.minAmount) : null;
      const parsedMax = formData.maxAmount.trim() !== '' && !isNaN(formData.maxAmount) ? parseFloat(formData.maxAmount) : (parsedMin || null);
      const parsedPriority = formData.priority.trim() !== '' && !isNaN(formData.priority) ? parseInt(formData.priority, 10) : 0;

      const payload = {
        external_gig_id: formData.externalGigId.trim() || null,
        title: formData.title.trim(),
        track_id: formData.trackId,
        payment_amount: formData.paymentAmount.trim() || null,
        compensation_type: formData.compensationType || 'fixed',
        min_amount: parsedMin,
        max_amount: parsedMax,
        currency: formData.currency.trim() || 'INR',
        priority: parsedPriority,
        is_featured: formData.isFeatured,
        posted_at: formData.postedAt.trim() || null,
        short_description: formData.shortDescription.trim() || null,
        overview: formData.overview.trim() || null,
        responsibilities: cleanResponsibilities,
        deliverables: cleanDeliverables,
        requirements: cleanRequirements,
        proof_spec: formData.proofSpec.trim() || null,
        origin_url: formData.originUrl.trim(),
      };

      if (editGigId) {
        const { error } = await updateGigService(editGigId, payload);
        if (error) throw error;
        navigate('/admin/gigs');
      } else {
        const { data, error } = await createGigService(payload);
        if (error) throw error;
        setSuccessGig(data);
      }
    } catch (err) {
      console.error('[AddGigPage] Submit error:', err);
      setSubmitError(err.message || 'Unable to save opportunity record.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingInitial) {
    return (
      <div className="admin-page admin-page-compact" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
        <Loader2 size={24} className="animate-spin" style={{ color: '#E31B23' }} />
      </div>
    );
  }

  return (
    <div className="admin-page admin-page-compact">
      {/* Page Header */}
      <div className="admin-page-header">
        <div className="admin-page-title-group">
          <h1 className="admin-page-title">
            <Briefcase size={22} />
            <span>{editGigId ? 'Edit Opportunity' : 'Add Opportunity'}</span>
          </h1>
          <p className="admin-page-description">
            Create or modify an applied opportunity record with marketplace priority and structured compensation.
          </p>
        </div>

        <div className="admin-page-actions">
          <Link
            to="/admin/gigs"
            className="admin-btn admin-btn-secondary"
          >
            <ArrowLeft size={14} />
            <span>Back to Opportunities</span>
          </Link>
        </div>
      </div>

      {initialLoadError && (
        <div role="alert" className="admin-alert admin-alert-danger">
          <div className="admin-alert-content">
            <AlertCircle size={16} />
            <span>{initialLoadError}</span>
          </div>
        </div>
      )}

      {/* Success Banner (when creating new) */}
      {successGig && !editGigId ? (
        <div className="admin-card" style={{ backgroundColor: '#F0FDF4', borderColor: '#BBF7D0', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '16px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#DCFCE7', color: '#15803D', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <CheckCircle2 size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#111827', margin: '0 0 4px 0' }}>
                Opportunity Created Successfully
              </h3>
              <p style={{ fontSize: '12.5px', color: '#4B5563', margin: 0, lineHeight: 1.5 }}>
                <strong>{successGig.title}</strong> is now live for learners enrolled in the assigned track.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <Link
              to="/admin/gigs"
              className="admin-btn admin-btn-primary"
            >
              <Briefcase size={14} />
              <span>View All Opportunities</span>
            </Link>

            <button
              type="button"
              onClick={() => {
                setSuccessGig(null);
                setFormData({
                  externalGigId: '',
                  title: '',
                  trackId: '',
                  paymentAmount: '',
                  compensationType: 'fixed',
                  minAmount: '',
                  maxAmount: '',
                  currency: 'INR',
                  priority: '0',
                  isFeatured: false,
                  postedAt: '',
                  shortDescription: '',
                  overview: '',
                  responsibilities: [''],
                  deliverables: [''],
                  requirements: [''],
                  proofSpec: '',
                  originUrl: '',
                });
              }}
              className="admin-btn admin-btn-secondary"
            >
              <span>Add Another Opportunity</span>
            </button>
          </div>
        </div>
      ) : (
        /* Form Card */
        <div className="admin-card">
          {submitError && (
            <div role="alert" className="admin-alert admin-alert-danger" style={{ marginBottom: '20px' }}>
              <div className="admin-alert-content">
                <AlertCircle size={16} />
                <span>{submitError}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Opportunity Title */}
            <div className="admin-form-group">
              <label htmlFor="title" className="admin-form-label">
                Opportunity Title <span className="admin-form-req">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="e.g. AI Video Editor & Reel Producer"
                className={`admin-input ${errors.title ? 'has-error' : ''}`}
                disabled={isSubmitting}
              />
              {errors.title && (
                <p className="admin-form-error">{errors.title}</p>
              )}
            </div>

            {/* Track & Priority Grid */}
            <div className="admin-form-grid">
              <div className="admin-form-group" style={{ marginBottom: 0 }}>
                <label htmlFor="trackId" className="admin-form-label">
                  UpShift Track <span className="admin-form-req">*</span>
                </label>
                <select
                  id="trackId"
                  value={formData.trackId}
                  onChange={(e) => handleChange('trackId', e.target.value)}
                  className={`admin-select ${errors.trackId ? 'has-error' : ''}`}
                  disabled={loadingTracks || isSubmitting}
                >
                  <option value="">Select track...</option>
                  {tracks.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.code} — {t.name}
                    </option>
                  ))}
                </select>
                {errors.trackId && (
                  <p className="admin-form-error">{errors.trackId}</p>
                )}
              </div>

              <div className="admin-form-group" style={{ marginBottom: 0 }}>
                <label htmlFor="priority" className="admin-form-label">
                  Marketplace Priority
                </label>
                <select
                  id="priority"
                  value={formData.priority}
                  onChange={(e) => handleChange('priority', e.target.value)}
                  className="admin-select"
                  disabled={isSubmitting}
                >
                  <option value="0">Standard (P0)</option>
                  <option value="10">Elevated (P10)</option>
                  <option value="20">High Priority (P20)</option>
                  <option value="30">Urgent / Top Pick (P30)</option>
                </select>
              </div>
            </div>

            {/* Featured Checkbox & External ID */}
            <div className="admin-form-grid" style={{ marginTop: '14px', alignItems: 'center' }}>
              <div className="admin-form-group" style={{ marginBottom: 0 }}>
                <label htmlFor="externalGigId" className="admin-form-label">
                  External Reference ID <span className="admin-form-optional">(Optional)</span>
                </label>
                <input
                  id="externalGigId"
                  type="text"
                  value={formData.externalGigId}
                  onChange={(e) => handleChange('externalGigId', e.target.value)}
                  placeholder="e.g. GIG-RR-101"
                  className="admin-input"
                  disabled={isSubmitting}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '18px' }}>
                <input
                  id="isFeatured"
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => handleChange('isFeatured', e.target.checked)}
                  disabled={isSubmitting}
                  style={{ width: '16px', height: '16px', accentColor: '#E31B23', cursor: 'pointer' }}
                />
                <label htmlFor="isFeatured" style={{ fontSize: '13px', fontWeight: 600, color: '#111827', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Sparkles size={13} style={{ color: '#E31B23' }} />
                  <span>Highlight as Featured Opportunity</span>
                </label>
              </div>
            </div>

            {/* Compensation Section */}
            <div style={{ marginTop: '20px', padding: '16px', backgroundColor: '#F9FAFB', borderRadius: '10px', border: '1px solid #E5E7EB' }}>
              <h4 style={{ fontSize: '12px', fontWeight: 800, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 12px 0' }}>
                Compensation Details
              </h4>

              <div className="admin-form-group">
                <label htmlFor="paymentAmount" className="admin-form-label">
                  Display Rate / Compensation String <span className="admin-form-optional">(Visible on card)</span>
                </label>
                <input
                  id="paymentAmount"
                  type="text"
                  value={formData.paymentAmount}
                  onChange={(e) => handleChange('paymentAmount', e.target.value)}
                  placeholder="e.g. ₹35,000 / month or $45 / hr"
                  className="admin-input"
                  disabled={isSubmitting}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
                <div className="admin-form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="compensationType" className="admin-form-label">Type</label>
                  <select
                    id="compensationType"
                    value={formData.compensationType}
                    onChange={(e) => handleChange('compensationType', e.target.value)}
                    className="admin-select"
                    disabled={isSubmitting}
                  >
                    <option value="fixed">Fixed Project</option>
                    <option value="hourly">Hourly Rate</option>
                    <option value="monthly">Monthly Retainer</option>
                    <option value="milestone">Milestone</option>
                    <option value="unspecified">Unspecified</option>
                  </select>
                </div>

                <div className="admin-form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="minAmount" className="admin-form-label">Min Amount</label>
                  <input
                    id="minAmount"
                    type="number"
                    value={formData.minAmount}
                    onChange={(e) => handleChange('minAmount', e.target.value)}
                    placeholder="e.g. 35000"
                    className="admin-input"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="admin-form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="maxAmount" className="admin-form-label">Max Amount</label>
                  <input
                    id="maxAmount"
                    type="number"
                    value={formData.maxAmount}
                    onChange={(e) => handleChange('maxAmount', e.target.value)}
                    placeholder="e.g. 50000"
                    className="admin-input"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="admin-form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="currency" className="admin-form-label">Currency</label>
                  <input
                    id="currency"
                    type="text"
                    value={formData.currency}
                    onChange={(e) => handleChange('currency', e.target.value)}
                    placeholder="INR / USD"
                    className="admin-input"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>

            {/* Apply Gateway Origin URL & Date */}
            <div className="admin-form-grid" style={{ marginTop: '16px' }}>
              <div className="admin-form-group" style={{ marginBottom: 0 }}>
                <label htmlFor="originUrl" className="admin-form-label">
                  Apply Gateway Origin URL <span className="admin-form-req">*</span>
                </label>
                <input
                  id="originUrl"
                  type="text"
                  value={formData.originUrl}
                  onChange={(e) => handleChange('originUrl', e.target.value)}
                  placeholder="e.g. https://www.upwork.com/jobs/~0123456"
                  className={`admin-input ${errors.originUrl ? 'has-error' : ''}`}
                  disabled={isSubmitting}
                />
                {errors.originUrl && (
                  <p className="admin-form-error">{errors.originUrl}</p>
                )}
              </div>

              <div className="admin-form-group" style={{ marginBottom: 0 }}>
                <label htmlFor="postedAt" className="admin-form-label">
                  Original Posted Date <span className="admin-form-optional">(Optional)</span>
                </label>
                <input
                  id="postedAt"
                  type="date"
                  value={formData.postedAt}
                  onChange={(e) => handleChange('postedAt', e.target.value)}
                  className="admin-input"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Short Description */}
            <div className="admin-form-group" style={{ marginTop: '16px' }}>
              <label htmlFor="shortDescription" className="admin-form-label">
                Short Summary / Overview <span className="admin-form-optional">(Snippet)</span>
              </label>
              <input
                id="shortDescription"
                type="text"
                value={formData.shortDescription}
                onChange={(e) => handleChange('shortDescription', e.target.value)}
                placeholder="Produce scroll-stopping reels using AI video workflows."
                className="admin-input"
                disabled={isSubmitting}
              />
            </div>

            {/* Full Role Overview / Description */}
            <div className="admin-form-group">
              <label htmlFor="overview" className="admin-form-label">
                About the Role <span className="admin-form-optional">(Full Description)</span>
              </label>
              <textarea
                id="overview"
                value={formData.overview}
                onChange={(e) => handleChange('overview', e.target.value)}
                placeholder="Detailed description of the opportunity scope, project objectives, and creative workflow."
                className="admin-textarea"
                rows={4}
                disabled={isSubmitting}
              />
            </div>

            {/* Dynamic Responsibilities */}
            <div className="admin-form-group">
              <label className="admin-form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ListChecks size={15} style={{ color: '#E31B23' }} />
                <span>Responsibilities</span>
              </label>
              <div className="admin-dynamic-list">
                {formData.responsibilities.map((item, idx) => (
                  <div key={idx} className="admin-dynamic-list-row">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleListChange('responsibilities', idx, e.target.value)}
                      placeholder={`Responsibility item #${idx + 1}`}
                      className="admin-input"
                      disabled={isSubmitting}
                    />
                    {formData.responsibilities.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveListItem('responsibilities', idx)}
                        className="admin-btn-icon admin-btn-icon-danger"
                        title="Remove item"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => handleAddListItem('responsibilities')}
                className="admin-btn admin-btn-sm admin-btn-secondary"
                style={{ marginTop: '8px' }}
              >
                <Plus size={12} />
                <span>Add Responsibility</span>
              </button>
            </div>

            {/* Dynamic Deliverables */}
            <div className="admin-form-group">
              <label className="admin-form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Target size={15} style={{ color: '#E31B23' }} />
                <span>Key Deliverables</span>
              </label>
              <div className="admin-dynamic-list">
                {formData.deliverables.map((item, idx) => (
                  <div key={idx} className="admin-dynamic-list-row">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleListChange('deliverables', idx, e.target.value)}
                      placeholder={`Deliverable item #${idx + 1}`}
                      className="admin-input"
                      disabled={isSubmitting}
                    />
                    {formData.deliverables.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveListItem('deliverables', idx)}
                        className="admin-btn-icon admin-btn-icon-danger"
                        title="Remove item"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => handleAddListItem('deliverables')}
                className="admin-btn admin-btn-sm admin-btn-secondary"
                style={{ marginTop: '8px' }}
              >
                <Plus size={12} />
                <span>Add Deliverable</span>
              </button>
            </div>

            {/* Dynamic Requirements */}
            <div className="admin-form-group">
              <label className="admin-form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={15} style={{ color: '#E31B23' }} />
                <span>Requirements</span>
              </label>
              <div className="admin-dynamic-list">
                {formData.requirements.map((item, idx) => (
                  <div key={idx} className="admin-dynamic-list-row">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleListChange('requirements', idx, e.target.value)}
                      placeholder={`Requirement item #${idx + 1}`}
                      className="admin-input"
                      disabled={isSubmitting}
                    />
                    {formData.requirements.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveListItem('requirements', idx)}
                        className="admin-btn-icon admin-btn-icon-danger"
                        title="Remove item"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => handleAddListItem('requirements')}
                className="admin-btn admin-btn-sm admin-btn-secondary"
                style={{ marginTop: '8px' }}
              >
                <Plus size={12} />
                <span>Add Requirement</span>
              </button>
            </div>

            {/* Proof Specification */}
            <div className="admin-form-group">
              <label htmlFor="proofSpec" className="admin-form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={15} style={{ color: '#E31B23' }} />
                <span>Required Proof-of-Work Artifact <span className="admin-form-optional">(Verification Link)</span></span>
              </label>
              <input
                id="proofSpec"
                type="text"
                value={formData.proofSpec}
                onChange={(e) => handleChange('proofSpec', e.target.value)}
                placeholder="e.g. Public Google Drive link with 3 sample video reels"
                className="admin-input"
                disabled={isSubmitting}
              />
            </div>

            {/* Form Actions */}
            <div className="admin-form-actions">
              <Link
                to="/admin/gigs"
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
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Briefcase size={14} />
                    <span>{editGigId ? 'Save Opportunity' : 'Publish Opportunity'}</span>
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
