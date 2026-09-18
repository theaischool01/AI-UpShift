import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import LearnerHeader from './LearnerHeader';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import './learner.css';

export default function LearnerLayout() {
  const { user } = useAuth();
  const [assignedTrack, setAssignedTrack] = useState(null);
  const [enrolledProgram, setEnrolledProgram] = useState(null);
  const [loadingEnrollments, setLoadingEnrollments] = useState(true);

  // Fetch learner's active program enrollment and assigned track
  useEffect(() => {
    async function loadLearnerTrack() {
      if (!user?.id) return;
      try {
        let { data: enrollmentData, error } = await supabase
          .from('enrollments')
          .select(`
            id,
            program_id,
            track_id,
            status,
            payment_status,
            program:programs (
              id,
              name,
              slug
            ),
            track:tracks (
              id,
              code,
              name,
              category,
              color,
              bg_color,
              tagline
            )
          `)
          .eq('user_id', user.id)
          .eq('status', 'active');

        // Fallback for transition phase if PostgREST cache has not reloaded
        if (error) {
          const fallbackRes = await supabase
            .from('enrollments')
            .select(`
              id,
              program_id,
              course_id,
              status,
              payment_status,
              course:courses (
                id,
                code,
                name,
                category,
                color,
                bg_color,
                tagline
              )
            `)
            .eq('user_id', user.id)
            .eq('status', 'active');

          if (fallbackRes.error) throw error;
          enrollmentData = fallbackRes.data?.map(e => ({
            ...e,
            track_id: e.course_id,
            track: e.course
          }));
        }

        const activeEnrollment = enrollmentData?.[0] || null;
        if (activeEnrollment) {
          setEnrolledProgram(activeEnrollment.program || {
            id: 'upshift-complete-program',
            name: 'UpShift Complete Applied AI Program'
          });
          setAssignedTrack(activeEnrollment.track || null);
        }
      } catch (err) {
        console.warn('[LearnerLayout] Failed to load enrollment track:', err);
      } finally {
        setLoadingEnrollments(false);
      }
    }
    loadLearnerTrack();
  }, [user?.id]);

  return (
    <div className="learner-shell">
      {/* Persistent Learner Header */}
      <LearnerHeader assignedTrack={assignedTrack} />

      {/* Main Content View */}
      <main className="learner-content">
        <Outlet context={{ 
          assignedTrack, 
          enrolledProgram, 
          loadingEnrollments,
          // Backward-compatibility alias
          enrolledCourses: assignedTrack ? [assignedTrack] : [] 
        }} />
      </main>
    </div>
  );
}
