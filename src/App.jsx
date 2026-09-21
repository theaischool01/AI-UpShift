import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import UpShiftRegistrationModal from './components/UpShiftRegistrationModal';
import HomePage from './pages/HomePage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

// Dynamic code splitting for routes
const ProgramDetailPage = lazy(() => import('./pages/ProgramDetailPage'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const EnrollmentPage = lazy(() => import('./pages/enroll/EnrollmentPage'));
const PaymentPage = lazy(() => import('./pages/enroll/PaymentPage'));
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'));
const StudentsPage = lazy(() => import('./pages/admin/StudentsPage'));
const AddStudentPage = lazy(() => import('./pages/admin/AddStudentPage'));
const BulkStudentImportPage = lazy(() => import('./pages/admin/BulkStudentImportPage'));
const GigsPage = lazy(() => import('./pages/admin/GigsPage'));
const AddGigPage = lazy(() => import('./pages/admin/AddGigPage'));
const BulkGigImportPage = lazy(() => import('./pages/admin/BulkGigImportPage'));
const CoursesPage = lazy(() => import('./pages/admin/CoursesPage'));
const AnalyticsPage = lazy(() => import('./pages/admin/AnalyticsPage'));
const AdminSettingsPage = lazy(() => import('./pages/admin/AdminSettingsPage'));
const LearnerLayout = lazy(() => import('./components/learner/LearnerLayout'));
const LearnerDashboardPage = lazy(() => import('./pages/learner/LearnerDashboardPage'));
const LearnerGigDetailPage = lazy(() => import('./pages/learner/LearnerGigDetailPage'));

// Route Suspense Fallback
function RouteLoadingFallback() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#111827] flex flex-col items-center justify-center p-6 select-none">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-10 h-10 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#E31B23]/20 border-t-[#E31B23] animate-spin" />
          <span className="absolute text-[#E31B23] font-bold text-xs">↑</span>
        </div>
        <div className="text-xs font-mono tracking-widest text-[#6B7280] uppercase">
          Loading UpShift Experience...
        </div>
      </div>
    </div>
  );
}

// Global Light-Themed Error Boundary
class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[UpShift App ErrorBoundary Caught]:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF8F5] text-[#111827] flex flex-col items-center justify-center p-6 select-none selection:bg-[#E31B23] selection:text-white">
          <div className="max-w-md w-full bg-white border border-[#E5E7EB] rounded-2xl p-8 text-center space-y-5 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-red-50 text-[#E31B23] flex items-center justify-center mx-auto border border-red-100">
              <span className="text-xl font-bold">!</span>
            </div>
            <h2 className="text-xl font-extrabold text-[#111827]">Configuration Notice</h2>
            <p className="text-xs text-[#4B5563] leading-relaxed">
              Payment setup is currently being configured. Please try again shortly or return to the overview.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.reload();
                }}
                className="btn btn-secondary flex-1 justify-center py-2.5 text-xs font-semibold"
                style={{ borderRadius: '9999px', border: '1px solid #E5E7EB' }}
              >
                Retry
              </button>
              <a
                href="/"
                className="btn btn-primary flex-1 justify-center py-2.5 text-xs font-bold text-white"
                style={{ backgroundColor: '#E31B23', borderRadius: '9999px', textDecoration: 'none' }}
              >
                Back to Home →
              </a>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function PublicHomePage() {
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);

  // Handle URL hash changes to smoothly scroll to sections
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    if (window.location.hash) {
      setTimeout(handleHash, 100);
    }

    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleNavigate = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      window.location.hash = sectionId;
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#111111] antialiased selection:bg-[#E91D2B] selection:text-white">
      {/* Lightly Sticky Editorial Floating Navbar */}
      <Navbar onOpenRegistration={() => setIsRegistrationOpen(true)} />

      {/* Consolidated 7-Section Experience */}
      <main className="flex-grow">
        <HomePage 
          onOpenRegistration={() => setIsRegistrationOpen(true)}
        />
      </main>

      {/* UpShift Cohort Registration Modal */}
      <UpShiftRegistrationModal 
        isOpen={isRegistrationOpen} 
        onClose={() => setIsRegistrationOpen(false)} 
      />

      {/* UpShift Minimal Interactive Brand Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}


function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (!window.location.hash) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'auto'
      });
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    }
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <AppErrorBoundary>
      <BrowserRouter>
        <ScrollToTop />
        <AuthProvider>
          <Suspense fallback={<RouteLoadingFallback />}>
            <Routes>
              {/* Public Marketing Landing Page */}
              <Route path="/" element={<PublicHomePage />} />

              {/* Dedicated Standalone Program Details Page */}
              <Route path="/programs/:trackId" element={<ProgramDetailPage />} />
              <Route path="/programs" element={<Navigate to="/#courses" replace />} />

              {/* Public Enrollment & Payment Flow */}
              <Route path="/enroll" element={<EnrollmentPage />} />
              <Route path="/enroll/payment" element={<PaymentPage />} />

              {/* Single Auth Entry Point */}
              <Route path="/login" element={<LoginPage />} />

              {/* Protected Administrative Area Shell & Subroutes */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboardPage />} />
                <Route path="students" element={<StudentsPage />} />
                <Route path="students/new" element={<AddStudentPage />} />
                <Route path="students/import" element={<BulkStudentImportPage />} />
                <Route path="courses" element={<CoursesPage />} />
                <Route path="gigs" element={<GigsPage />} />
                <Route path="gigs/new" element={<AddGigPage />} />
                <Route path="gigs/import" element={<BulkGigImportPage />} />
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="settings" element={<AdminSettingsPage />} />
                <Route path="*" element={<Navigate to="dashboard" replace />} />
              </Route>

              {/* Protected Learner Area Shell & Subroutes */}
              <Route 
                path="/learner" 
                element={
                  <ProtectedRoute requiredRole="learner">
                    <LearnerLayout />
                  </ProtectedRoute>
                } 
              >
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<LearnerDashboardPage />} />
                <Route path="gigs/:gigId" element={<LearnerGigDetailPage />} />
              </Route>

              {/* Fallback to Home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </AppErrorBoundary>
  );
}
