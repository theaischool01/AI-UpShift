import React, { useState } from 'react';
import { X, CheckCircle2, Sparkles, Send, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function MockApplicationModal({ isOpen, onClose, opportunity, opportunityType = 'local' }) {
  const { user, profile } = useAuth();

  const [fullName, setFullName] = useState(profile?.full_name || user?.user_metadata?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [whyFit, setWhyFit] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: 'rgba(8, 12, 20, 0.55)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        animation: 'fadeIn 0.18s ease-out'
      }}
      role="dialog" 
      aria-modal="true"
      onClick={handleClose}
    >
      <div 
        className="bg-white text-[#111827] overflow-hidden flex flex-col max-h-[92vh] w-full"
        style={{
          maxWidth: '580px',
          borderRadius: '20px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 20px 45px -10px rgba(0, 0, 0, 0.28), 0 0 0 1px rgba(0, 0, 0, 0.04)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          className="p-6 pb-5 flex items-start justify-between gap-4 bg-[#FFFFFF]"
          style={{ borderBottom: '1px solid #F1F3F5' }}
        >
          <div className="min-w-0 flex-1">
            <div 
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-mono font-bold tracking-wider uppercase mb-2"
              style={{
                backgroundColor: '#FFF1F1',
                color: '#E31B23',
                border: '1px solid #FEE2E2'
              }}
            >
              <Sparkles size={11} style={{ color: '#E31B23' }} />
              <span>{opportunityType === 'startup' ? 'Startup Opportunity' : 'Local Business Opportunity'}</span>
            </div>
            <h3 
              className="text-xl sm:text-2xl font-black text-[#111827] tracking-tight leading-tight m-0"
              style={{ fontFamily: 'var(--font-heading, -apple-system, BlinkMacSystemFont, sans-serif)' }}
            >
              Apply to {title}
            </h3>
            <p className="text-xs sm:text-sm text-[#6B7280] m-0 mt-1 truncate">
              {roleTitle}
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-[#111827] border border-gray-200 flex items-center justify-center transition-colors cursor-pointer flex-shrink-0"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-white">
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
                  <span className="font-semibold text-[#111827]">{fullName}</span>
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
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-[11px] font-mono font-bold text-[#374151] mb-1.5 uppercase tracking-wider">
                  FULL NAME <span className="text-[#E31B23]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-4 rounded-xl text-xs sm:text-sm text-[#111827] bg-[#FAFAFA] border border-[#D9DEE6] focus:bg-white focus:outline-none focus:border-[#E31B23] transition-all"
                  style={{ height: '48px' }}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-[11px] font-mono font-bold text-[#374151] mb-1.5 uppercase tracking-wider">
                  EMAIL ADDRESS <span className="text-[#E31B23]">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. rahul@example.com"
                  className="w-full px-4 rounded-xl text-xs sm:text-sm text-[#111827] bg-[#FAFAFA] border border-[#D9DEE6] focus:bg-white focus:outline-none focus:border-[#E31B23] transition-all"
                  style={{ height: '48px' }}
                />
              </div>

              {/* Portfolio / Work URL */}
              <div>
                <label className="block text-[11px] font-mono font-bold text-[#374151] mb-1.5 uppercase tracking-wider">
                  PORTFOLIO / WORK URL <span className="text-[#E31B23]">*</span>
                </label>
                <input
                  type="url"
                  required
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  placeholder="https://github.com/... or https://behance.net/..."
                  className="w-full px-4 rounded-xl text-xs sm:text-sm text-[#111827] bg-[#FAFAFA] border border-[#D9DEE6] focus:bg-white focus:outline-none focus:border-[#E31B23] transition-all"
                  style={{ height: '48px' }}
                />
              </div>

              {/* Short Introduction */}
              <div>
                <label className="block text-[11px] font-mono font-bold text-[#374151] mb-1.5 uppercase tracking-wider">
                  SHORT INTRODUCTION
                </label>
                <textarea
                  rows={2}
                  value={introduction}
                  onChange={(e) => setIntroduction(e.target.value)}
                  placeholder="Briefly introduce yourself and your UpShift track..."
                  className="w-full p-3.5 rounded-xl text-xs sm:text-sm text-[#111827] bg-[#FAFAFA] border border-[#D9DEE6] focus:bg-white focus:outline-none focus:border-[#E31B23] transition-all resize-none"
                />
              </div>

              {/* Why are you a good fit? */}
              <div>
                <label className="block text-[11px] font-mono font-bold text-[#374151] mb-1.5 uppercase tracking-wider">
                  WHY ARE YOU A GOOD FIT? <span className="text-[#E31B23]">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={whyFit}
                  onChange={(e) => setWhyFit(e.target.value)}
                  placeholder="Highlight relevant tools, projects, or workflow skills matching this scope..."
                  className="w-full p-3.5 rounded-xl text-xs sm:text-sm text-[#111827] bg-[#FAFAFA] border border-[#D9DEE6] focus:bg-white focus:outline-none focus:border-[#E31B23] transition-all resize-none"
                />
              </div>

              {/* Submit CTA */}
              <div 
                className="pt-3 flex items-center justify-end gap-3"
                style={{ borderTop: '1px solid #F1F3F5' }}
              >
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-5 py-2.5 rounded-xl border border-[#E5E7EB] text-xs font-semibold text-[#4B5563] bg-white hover:bg-gray-50 transition-colors cursor-pointer"
                  style={{ height: '44px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="learner-apply-button text-xs font-bold"
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
