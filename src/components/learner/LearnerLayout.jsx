import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import LearnerHeader from './LearnerHeader';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import './learner.css';

export default function LearnerLayout() {
  const { user } = useAuth();
  const [enrolledProgram, setEnrolledProgram] = useState(null);
  const [loadingEnrollments, setLoadingEnrollments] = useState(true);

  // Fetch learner's active UpShift program enrollment
  useEffect(() => {
    async function loadLearnerProgram() {
      if (!user?.id) return;
      try {
        const { data: enrollmentData, error } = await supabase
          .from('enrollments')
          .select(`
            id,
            program_id,
            status,
            payment_status,
            program:programs (
              id,
              name,
              slug
            )
          `)
          .eq('user_id', user.id)
          .eq('status', 'active');

        if (error) {
          console.warn('[LearnerLayout] Program enrollment query notice:', error.message);
        }

        const activeEnrollment = enrollmentData?.[0] || null;
        if (activeEnrollment) {
          setEnrolledProgram(activeEnrollment.program || {
            id: 'upshift-complete-program',
            name: 'UpShift Complete Applied AI Program'
          });
        }
      } catch (err) {
        console.warn('[LearnerLayout] Failed to load program enrollment:', err);
      } finally {
        setLoadingEnrollments(false);
      }
    }
    loadLearnerProgram();
  }, [user?.id]);

  return (
    <div className="learner-shell">
      {/* Persistent Learner Header */}
      <LearnerHeader />

      {/* Main Content View */}
      <main className="learner-content">
        <Outlet context={{ 
          enrolledProgram, 
          loadingEnrollments
        }} />
      </main>
    </div>
  );
}
