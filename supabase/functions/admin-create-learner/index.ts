// Supabase Edge Function: admin-create-learner
// Secure server-side single and batch learner creation with compensating transactional rollback

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req: Request) => {
  // 1. Handle CORS Preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');

    if (!supabaseUrl || !supabaseServiceKey || !supabaseAnonKey) {
      console.error('[admin-create-learner] Missing environment configuration.');
      return new Response(
        JSON.stringify({ error: 'Server configuration error.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 2. Authenticate Caller using the incoming Bearer Token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Missing authentication token.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '').trim();

    // Verify token with anon client
    const authClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth: { persistSession: false },
    });

    const { data: { user: callerUser }, error: authError } = await authClient.auth.getUser();
    if (authError || !callerUser) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Invalid or expired session.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Privileged Admin Client (server-side only)
    const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });

    // 3. Verify Caller Role in public.profiles (Strict Admin Check)
    const { data: callerProfile, error: profileCheckError } = await adminClient
      .from('profiles')
      .select('id, role')
      .eq('id', callerUser.id)
      .maybeSingle();

    if (profileCheckError || !callerProfile || callerProfile.role !== 'admin') {
      console.warn(`[admin-create-learner] Access denied for user ${callerUser.id}. Role is not admin.`);
      return new Response(
        JSON.stringify({ error: 'Forbidden: Administrator privileges required.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 4. Parse Payload: Supports both single ({ learner: ... }) and batch ({ learners: [...] })
    const body = await req.json();
    const isBatch = Array.isArray(body?.learners);
    const learnerList = isBatch ? body.learners : (body?.learner ? [body.learner] : null);

    if (!learnerList || learnerList.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid payload: "learner" object or "learners" array is required.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Pre-fetch all active tracks/courses for fallback association if schema requires non-null
    let { data: activeTracks } = await adminClient
      .from('tracks')
      .select('id, code, name');

    if (!activeTracks || activeTracks.length === 0) {
      const { data: fallbackCourses } = await adminClient
        .from('courses')
        .select('id, code, name');
      activeTracks = fallbackCourses || [];
    }

    const defaultTrackId = activeTracks?.[0]?.id || 'reelrush-ai';

    const trackMap = new Map();
    (activeTracks || []).forEach((t: any) => {
      trackMap.set(t.id, t);
      trackMap.set(t.code.toLowerCase(), t);
      trackMap.set(t.id.toLowerCase(), t);
      trackMap.set(t.code, t);
    });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Helper: Process a single learner with full validation and compensating rollback
    const processLearner = async (rawLearner: any, index: number) => {
      const fullName = rawLearner.full_name?.trim();
      const email = rawLearner.email?.trim().toLowerCase();
      const collegeEmail = rawLearner.college_email?.trim().toLowerCase();
      const college = rawLearner.college?.trim();
      const password = rawLearner.password;
      const trackIdInput = rawLearner.track_id?.trim() || rawLearner.track?.trim() || rawLearner.course_id?.trim() || rawLearner.course?.trim();

      if (!fullName || !email || !collegeEmail || !college || !password) {
        return {
          success: false,
          row: index + 1,
          email: email || 'unknown',
          full_name: fullName || 'unknown',
          college: college || 'unknown',
          error: 'All fields (full_name, email, college_email, college, password) are required.',
        };
      }

      if (!emailRegex.test(email) || !emailRegex.test(collegeEmail)) {
        return {
          success: false,
          row: index + 1,
          email,
          full_name: fullName,
          college,
          error: 'Please enter valid email formats for account and college email.',
        };
      }

      if (typeof password !== 'string' || password.length < 8) {
        return {
          success: false,
          row: index + 1,
          email,
          full_name: fullName,
          college,
          error: 'Password must be at least 8 characters in length.',
        };
      }

      const matchedTrack = trackIdInput ? (trackMap.get(trackIdInput) || trackMap.get(trackIdInput.toLowerCase())) : null;
      const finalTrackId = matchedTrack?.id || defaultTrackId;

      // Check existing email
      const { data: existingProfile } = await adminClient
        .from('profiles')
        .select('id, email')
        .eq('email', email)
        .maybeSingle();

      if (existingProfile) {
        return {
          success: false,
          row: index + 1,
          email,
          full_name: fullName,
          college,
          error: 'A learner account already exists for this email.',
        };
      }

      // Transactional Step with Compensating Rollback
      let createdUserId: string | null = null;
      try {
        // Step A: Create Auth User
        const { data: authCreated, error: createAuthError } = await adminClient.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: {
            full_name: fullName,
            role: 'learner',
            college,
            college_email: collegeEmail,
          },
        });

        if (createAuthError || !authCreated?.user) {
          const msg = createAuthError?.message || 'Auth account creation failed';
          if (msg.includes('already been registered') || msg.includes('already exists')) {
            return {
              success: false,
              row: index + 1,
              email,
              full_name: fullName,
              college,
              error: 'A learner account already exists for this email.',
            };
          }
          return {
            success: false,
            row: index + 1,
            email,
            full_name: fullName,
            college,
            error: msg,
          };
        }

        createdUserId = authCreated.user.id;

        // Step B: Upsert Profile Record
        const { error: profileUpsertError } = await adminClient
          .from('profiles')
          .upsert({
            id: createdUserId,
            full_name: fullName,
            email,
            college_email: collegeEmail,
            college,
            role: 'learner',
          });

        if (profileUpsertError) {
          throw new Error(`Profile creation failed: ${profileUpsertError.message}`);
        }

        // Step C: Create Single Program Enrollment
        const enrollmentPayload: any = {
          user_id: createdUserId,
          program_id: 'upshift-complete-program',
          track_id: finalTrackId,
          status: 'active',
          payment_status: 'active',
          amount_paid: 4999.00,
          currency: 'INR',
          enrolled_at: new Date().toISOString(),
        };

        let { error: enrollmentError } = await adminClient
          .from('enrollments')
          .insert(enrollmentPayload);

        if (enrollmentError && (enrollmentError.message?.includes('track_id') || (enrollmentError as any).code === 'PGRST204')) {
          const fallbackEnrollmentPayload = {
            ...enrollmentPayload,
            course_id: finalTrackId,
          };
          delete fallbackEnrollmentPayload.track_id;
          const fbRes = await adminClient.from('enrollments').insert(fallbackEnrollmentPayload);
          enrollmentError = fbRes.error;
        }

        if (enrollmentError) {
          throw new Error(`Enrollment creation failed: ${enrollmentError.message}`);
        }

        return {
          success: true,
          learner: {
            id: createdUserId,
            full_name: fullName,
            email,
            college,
            college_email: collegeEmail,
            program_id: 'upshift-complete-program',
            program_name: 'UpShift Complete Applied AI Program',
          },
        };
      } catch (transactionErr: any) {
        // Compensating Rollback: delete auth user if profile or enrollment failed
        if (createdUserId) {
          try {
            await adminClient.auth.admin.deleteUser(createdUserId);
          } catch (delErr) {
            console.error(`[admin-create-learner] Rollback failed for user ${createdUserId}:`, delErr);
          }
        }
        return {
          success: false,
          row: index + 1,
          email,
          full_name: fullName,
          college,
          error: transactionErr?.message || 'Failed to complete learner registration. Changes were rolled back.',
        };
      }
    };

    // Process all items in payload sequentially for strict safety
    const results = [];
    for (let i = 0; i < learnerList.length; i++) {
      const res = await processLearner(learnerList[i], i);
      results.push(res);
    }

    // 5. Build Response
    if (!isBatch) {
      // Single learner response
      const singleRes = results[0];
      if (singleRes.success) {
        return new Response(
          JSON.stringify({ success: true, learner: singleRes.learner }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } else {
        const isConflict = singleRes.error?.includes('already exists');
        return new Response(
          JSON.stringify({ error: singleRes.error }),
          { status: isConflict ? 409 : 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Batch response
    const created = results.filter((r) => r.success).map((r) => r.learner);
    const failed = results.filter((r) => !r.success).map((r) => ({
      row: r.row,
      email: r.email,
      full_name: r.full_name,
      college: r.college,
      error: r.error,
    }));

    return new Response(
      JSON.stringify({
        success: true,
        total: results.length,
        createdCount: created.length,
        failedCount: failed.length,
        created,
        failed,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err: any) {
    console.error('[admin-create-learner] Unexpected error:', err?.message);
    return new Response(
      JSON.stringify({ error: 'An unexpected internal error occurred. Please try again.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
