import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import LearnerHeader from './LearnerHeader';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import './learner.css';

export default function LearnerLayout() {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loadingEnrollments, setLoadingEnrollments] = useState(true);

  // Fetch active enrolled course(s) from database
  useEffect(() => {
    async function loadLearnerTracks() {
      if (!user?.id) return;
      try {
        const { data: enrollmentData, error } = await supabase
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

        if (error) throw error;

        // If enrolled in UpShift Complete Program (or any active enrollment), load all 6 flagship courses
        const hasCompleteProgram = (enrollmentData || []).some(
          e => e.program_id === 'upshift-complete-program' || !e.course_id || e.status === 'active'
        );

        if (hasCompleteProgram) {
          const { data: allCourses, error: coursesErr } = await supabase
            .from('courses')
            .select('id, code, name, category, color, bg_color, tagline')
            .eq('is_active', true)
            .order('code', { ascending: true });

          if (!coursesErr && allCourses && allCourses.length > 0) {
            setEnrolledCourses(allCourses);
            return;
          }
        }

        // Fallback: extract specific enrolled course(s)
        const courses = (enrollmentData || [])
          .map(e => e.course)
          .filter(Boolean);

        setEnrolledCourses(courses);
      } catch (err) {
        console.warn('[LearnerLayout] Failed to load enrollment tracks:', err);
      } finally {
        setLoadingEnrollments(false);
      }
    }
    loadLearnerTracks();
  }, [user?.id]);

  return (
    <div className="learner-shell">
      {/* Persistent Learner Header */}
      <LearnerHeader enrolledCourses={enrolledCourses} />

      {/* Main Content View */}
      <main className="learner-content">
        <Outlet context={{ enrolledCourses, loadingEnrollments }} />
      </main>
    </div>
  );
}
