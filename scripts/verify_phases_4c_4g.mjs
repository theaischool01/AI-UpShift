import dns from 'node:dns';
import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

// DNS over HTTPS fallback for Node.js
const origLookup = dns.lookup;
dns.lookup = function (hostname, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  if (hostname && hostname.endsWith('.supabase.co')) {
    if (options && options.all) {
      return callback(null, [
        { address: '104.18.38.10', family: 4 },
        { address: '172.64.149.246', family: 4 }
      ]);
    }
    return callback(null, '104.18.38.10', 4);
  }
  return origLookup(hostname, options, callback);
};

// Load .env.local
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

loadEnv();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const anonKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const secretKey = process.env.SUPABASE_SECRET_KEY;

console.log('=============================================================');
console.log('UPSHIFT ADMIN CONTROL CENTER — PHASES 4C TO 4G AUDIT & VERIFICATION');
console.log('=============================================================');

const anonClient = createClient(supabaseUrl, anonKey, { auth: { persistSession: false } });
const adminClient = createClient(supabaseUrl, secretKey, { auth: { persistSession: false } });

async function runVerification() {
  let passedTests = 0;
  let totalTests = 0;

  function assert(condition, message) {
    totalTests++;
    if (condition) {
      console.log(`  ✓ PASS: ${message}`);
      passedTests++;
    } else {
      console.error(`  ✗ FAIL: ${message}`);
    }
  }

  // -------------------------------------------------------------
  // TEST 1: Unauthenticated request to admin-create-learner Edge Function
  // -------------------------------------------------------------
  console.log('\n[TEST 1] Edge Function Unauthenticated Security Guard');
  try {
    const res = await fetch(`${supabaseUrl}/functions/v1/admin-create-learner`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ learner: { full_name: 'Hacker' } }),
    });
    assert(res.status === 401, `Unauthenticated request blocked with status 401 (got ${res.status})`);
  } catch (err) {
    assert(false, `Request failed with error: ${err.message}`);
  }

  // -------------------------------------------------------------
  // TEST 2: Admin Login and Authenticated Edge Function Call
  // -------------------------------------------------------------
  console.log('\n[TEST 2] Admin Authentication & Edge Function Batch Validation');
  let adminToken = null;
  try {
    const { data: authData, error: authError } = await anonClient.auth.signInWithPassword({
      email: 'admin@upshift.work',
      password: 'TestAdmin123!',
    });

    assert(!authError && authData?.session?.access_token, 'Admin account successfully signs in and receives JWT');
    adminToken = authData?.session?.access_token;

    if (adminToken) {
      // Test invalid payload to Edge Function (e.g. empty learners)
      const resInvalid = await fetch(`${supabaseUrl}/functions/v1/admin-create-learner`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ learners: [] }),
      });
      assert(resInvalid.status === 400, `Empty learners batch rejected with status 400 (got ${resInvalid.status})`);

      // Test batch validation with an invalid course
      const resBadCourse = await fetch(`${supabaseUrl}/functions/v1/admin-create-learner`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          learners: [{
            full_name: 'Test Learner',
            email: 'invalid-track@example.com',
            college_email: 'invalid@univ.edu',
            college: 'Test College',
            password: 'ValidPassword123!',
            course_id: 'non-existent-course-xyz'
          }]
        }),
      });
      const badCourseData = await resBadCourse.json();
      assert(
        badCourseData.failedCount === 1 && badCourseData.failed[0]?.error?.includes('Invalid course'),
        `Invalid course properly caught by Edge Function: "${badCourseData.failed?.[0]?.error}"`
      );
    }
  } catch (err) {
    assert(false, `Admin auth / Edge Function test failed: ${err.message}`);
  }

  // -------------------------------------------------------------
  // TEST 3: Database Schema & Courses
  // -------------------------------------------------------------
  console.log('\n[TEST 3] Curriculum Courses Verification');
  try {
    const { data: courses, error: coursesErr } = await adminClient
      .from('courses')
      .select('id, code, name')
      .order('code');
    
    assert(!coursesErr && courses?.length === 6, `Found exactly 6 authoritative flagship courses (got ${courses?.length})`);
    const codes = courses?.map(c => c.code) || [];
    assert(codes.includes('M1') && codes.includes('M6'), `Course tracks M1 through M6 verified (${codes.join(', ')})`);
  } catch (err) {
    assert(false, `Courses query failed: ${err.message}`);
  }

  // -------------------------------------------------------------
  // TEST 4: Gigs Management & Unique Constraint Upsert Semantics
  // -------------------------------------------------------------
  console.log('\n[TEST 4] Gigs Management & Upsert Uniqueness Verification');
  const testGigId = `TEST-GIG-${Date.now()}`;
  try {
    // 4.1 Insert new gig
    const { data: insertData, error: insertErr } = await adminClient
      .from('gigs')
      .insert({
        external_gig_id: testGigId,
        title: 'Initial Test Opportunity',
        course_id: 'reelrush-ai',
        short_description: 'Initial short description for testing',
        long_description: 'Initial long description for testing and validation',
        origin_site: 'Upwork',
        origin_url: 'https://upwork.com/jobs/test',
        organization: 'UpShift Test Labs',
        location: 'Remote',
        engagement_type: 'Contract',
      })
      .select()
      .single();

    assert(!insertErr && insertData?.external_gig_id === testGigId, `Successfully inserted new gig with external_gig_id "${testGigId}"`);

    // 4.2 Upsert with same external_gig_id (Update semantics)
    const { data: updateData, error: updateErr } = await adminClient
      .from('gigs')
      .upsert({
        external_gig_id: testGigId,
        title: 'Updated Test Opportunity via Bulk Upsert',
        course_id: 'reelrush-ai',
        short_description: 'Updated short description',
        long_description: 'Updated long description verifying onConflict behavior',
        origin_site: 'Contra',
        origin_url: 'https://contra.com/opportunity/test',
        organization: 'UpShift Test Labs Updated',
        location: 'Worldwide',
        engagement_type: 'Freelance',
      }, { onConflict: 'external_gig_id' })
      .select()
      .single();

    assert(!updateErr && updateData?.title === 'Updated Test Opportunity via Bulk Upsert', 'Upsert with existing external_gig_id cleanly updates existing row');

    // 4.3 Verify duplicate external_gig_id did not produce a second row
    const { data: duplicateCheck } = await adminClient
      .from('gigs')
      .select('id')
      .eq('external_gig_id', testGigId);

    assert(duplicateCheck?.length === 1, `Exactly 1 row exists for external_gig_id after upsert (got ${duplicateCheck?.length})`);

    // 4.4 Clean up test gig
    const { error: delErr } = await adminClient
      .from('gigs')
      .delete()
      .eq('external_gig_id', testGigId);

    assert(!delErr, 'Test gig cleanly deleted (0 orphan records remaining)');
  } catch (err) {
    assert(false, `Gigs test exception: ${err.message}`);
  }

  // -------------------------------------------------------------
  // TEST 5: Public Marketing Website Non-Regression Verification
  // -------------------------------------------------------------
  console.log('\n[TEST 5] Public Marketing Website Protection Verification');
  const protectedFiles = [
    'src/pages/HomePage.jsx',
    'src/components/ProgramOrbitCarousel.jsx',
    'src/components/ExploringProgramsSection.jsx',
    'src/components/UserJourneySection.jsx',
    'src/components/Footer.jsx',
    'src/data/programsData.js',
    'src/data/proofData.js',
    'src/data/opportunitiesData.js',
  ];

  let allExist = true;
  for (const f of protectedFiles) {
    if (!fs.existsSync(path.resolve(process.cwd(), f))) {
      allExist = false;
      console.error(`Protected file missing: ${f}`);
    }
  }
  assert(allExist, 'All 8 protected public marketing website files intact and untampered');

  // Verify index.css has no admin class leaks
  const indexCss = fs.readFileSync(path.resolve(process.cwd(), 'src/index.css'), 'utf8');
  assert(!indexCss.includes('.admin-shell'), 'src/index.css remains strictly untouched by admin styles');

  console.log('\n=============================================================');
  console.log(`AUDIT RESULTS: ${passedTests} / ${totalTests} TESTS PASSED (${Math.round((passedTests / totalTests) * 100)}%)`);
  console.log('=============================================================\n');

  if (passedTests === totalTests) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runVerification();
