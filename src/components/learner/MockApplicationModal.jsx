import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function MockApplicationModal({ 
  isOpen, 
  onClose, 
  opportunity, 
  opportunityType = 'local',
  initialPortfolioUrl = '' 
}) {
  const { user, profile } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [whyFit, setWhyFit] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync pre-filled user info and initial URLs on modal open
  useEffect(() => {
    if (isOpen) {
      setFullName(profile?.full_name || user?.user_metadata?.full_name || '');
      setEmail(user?.email || '');
      if (initialPortfolioUrl) {
        setPortfolioUrl(initialPortfolioUrl);
      }
      setIsSubmitted(false);
      setIsSubmitting(false);
    }
  }, [isOpen, profile, user, initialPortfolioUrl]);

  if (!isOpen || !opportunity) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate brief network latency for realism
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setIsSubmitting(false);
    onClose();
  };

  const title = opportunity.businessName || opportunity.startupName || 'Opportunity';
  const roleTitle = opportunity.opportunityTitle;

  return (
    <div 
      className="learner-modal-overlay"
      role="dialog" 
      aria-modal="true"
      onClick={handleClose}
    >
      <div 
        className="learner-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="learner-modal-header">
          <div className="min-w-0 flex-1">
            <div className="learner-modal-badge">
              <Sparkles size={11} style={{ color: '#E31B23' }} />
              <span>{opportunityType === 'startup' ? 'Startup Business Opportunity' : 'Local Business Opportunity'}</span>
            </div>
            <h3 className="learner-modal-title">
              Apply to {title}
            </h3>
            <p className="learner-modal-subtitle truncate">
              {roleTitle}
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="learner-modal-close-btn"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Body */}
        <div className="learner-modal-body">
          {isSubmitted ? (
            <div className="text-center py-6 space-y-4">
              <div 
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto border"
                style={{
                  backgroundColor: '#ECFDF5',
                  borderColor: '#A7F3D0',
                  color: '#059669'
                }}
              >
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <div>
                <span 
                  className="text-[10.5px] font-mono font-bold tracking-widest uppercase px-2.5 py-1 rounded-md border"
                  style={{
                    backgroundColor: '#ECFDF5',
                    borderColor: '#A7F3D0',
                    color: '#065F46'
                  }}
                >
                  APPLICATION READY
                </span>
                <h4 className="text-xl font-black text-[#111827] mt-3 mb-2">
                  Application Details Captured
                </h4>
                <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed max-w-md mx-auto">
                  Your application has been captured for this UI prototype. Email delivery and direct business contact flow will be connected in the backend phase.
                </p>
              </div>

              {/* Summary Card */}
              <div 
                className="rounded-xl p-4 text-left text-xs space-y-2 mt-4 text-[#374151]"
                style={{
                  backgroundColor: '#FAF8F5',
                  border: '1px solid #EFECE6'
                }}
              >
                <div className="flex justify-between">
                  <span className="text-[#6B7280] font-mono uppercase text-[10.5px]">Applicant</span>
                  <span className="font-semibold text-[#111827]">{fullName || 'Learner'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280] font-mono uppercase text-[10.5px]">Email</span>
                  <span className="font-semibold text-[#111827]">{email}</span>
                </div>
                {portfolioUrl && (
                  <div className="flex justify-between">
                    <span className="text-[#6B7280] font-mono uppercase text-[10.5px]">Work Link</span>
                    <span className="font-semibold text-[#111827] truncate max-w-[200px]">{portfolioUrl}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[#6B7280] font-mono uppercase text-[10.5px]">Target</span>
                  <span className="font-semibold text-[#111827]">{title}</span>
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="learner-apply-button w-full justify-center text-xs font-bold"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Full Name */}
              <div className="learner-form-group">
                <label className="learner-form-label">
                  <span>FULL NAME</span> <span className="learner-form-required">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="learner-form-input"
                />
              </div>

              {/* Email */}
              <div className="learner-form-group">
                <label className="learner-form-label">
                  <span>EMAIL ADDRESS</span> <span className="learner-form-required">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="learner-form-input"
                />
              </div>

              {/* Portfolio / Work URL */}
              <div className="learner-form-group">
                <label className="learner-form-label">
                  <span>PORTFOLIO / WORK URL</span> <span className="learner-form-required">*</span>
                </label>
                <input
                  type="url"
                  required
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  placeholder="https://github.com/... or https://behance.net/..."
                  className="learner-form-input"
                />
              </div>

              {/* Short Introduction */}
              <div className="learner-form-group">
                <label className="learner-form-label">
                  <span>SHORT INTRODUCTION</span>
                </label>
                <textarea
                  rows={3}
                  value={introduction}
                  onChange={(e) => setIntroduction(e.target.value)}
                  placeholder="Briefly introduce yourself and your relevant experience..."
                  className="learner-form-textarea"
                />
              </div>

              {/* Why are you a good fit? */}
              <div className="learner-form-group">
                <label className="learner-form-label">
                  <span>WHY ARE YOU A GOOD FIT?</span> <span className="learner-form-required">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={whyFit}
                  onChange={(e) => setWhyFit(e.target.value)}
                  placeholder="Highlight the tools, projects, skills, or experience relevant to this opportunity..."
                  className="learner-form-textarea"
                />
              </div>

              {/* Footer CTA */}
              <div className="learner-modal-footer mt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="learner-btn-secondary"
                  style={{ height: '44px', padding: '0 18px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="learner-apply-button"
                  style={{
                    height: '44px',
                    padding: '0 22px',
                    width: 'auto',
                    opacity: isSubmitting ? 0.7 : 1
                  }}
                >
                  {isSubmitting ? (
                    <span>Preparing Application...</span>
                  ) : (
                    <>
                      <span>SEND APPLICATION</span>
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
