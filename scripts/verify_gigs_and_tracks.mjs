import dns from 'node:dns';
import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

// DNS patch for Supabase connection
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
const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
let supabaseUrl = '';
let secretKey = '';
let pubKey = '';

for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (trimmed.startsWith('VITE_SUPABASE_URL=')) {
    supabaseUrl = trimmed.split('=')[1].trim().replace(/^["']|["']$/g, '');
  }
  if (trimmed.startsWith('SUPABASE_SECRET_KEY=')) {
    secretKey = trimmed.split('=')[1].trim().replace(/^["']|["']$/g, '');
  }
  if (trimmed.startsWith('VITE_SUPABASE_PUBLISHABLE_KEY=')) {
    pubKey = trimmed.split('=')[1].trim().replace(/^["']|["']$/g, '');
  }
}

const adminClient = createClient(supabaseUrl, secretKey || pubKey);
const publicClient = createClient(supabaseUrl, pubKey);

async function testGigsQueries() {
  console.log('====================================================');
  console.log('UPSHIFT — END-TO-END SUPABASE GIGS & TRACKS TEST');
  console.log('====================================================');

  // Test 1: Public / Anon query for active opportunities
  console.log('\n[1] Testing Public Anon query for active gigs:');
  const { data: publicGigs, error: pubErr } = await publicClient
    .from('gigs')
    .select('id, external_gig_id, title, payment_amount, overview, responsibilities, deliverables, requirements, proof_spec, origin_url, created_at')
    .limit(5);

  if (pubErr) {
    console.error('Public query failed:', pubErr);
  } else {
    console.log(`SUCCESS: Fetched ${publicGigs?.length} public opportunities.`);
    console.log('Sample gig:', publicGigs?.[0]?.title, '| Pay:', publicGigs?.[0]?.payment_amount, '| Has overview:', Boolean(publicGigs?.[0]?.overview));
  }

  // Test 2: Admin client query with relational course / track mapping
  console.log('\n[2] Testing Admin client relational query for gigs with associated track/course metadata:');
  const { data: adminGigs, error: admErr } = await adminClient
    .from('gigs')
    .select(`
      id,
      external_gig_id,
      title,
      course_id,
      payment_amount,
      course:courses (
        id,
        code,
        name
      )
    `)
    .limit(5);

  if (admErr) {
    console.error('Admin relational query failed:', admErr);
  } else {
    console.log(`SUCCESS: Fetched ${adminGigs?.length} relational opportunities.`);
    console.log('Sample:', adminGigs?.[0]);
  }

  // Test 3: Tracks metadata query
  console.log('\n[3] Testing Track / Course metadata query:');
  const { data: coursesData, error: cErr } = await publicClient
    .from('courses')
    .select('id, code, name, category, color, bg_color')
    .order('code', { ascending: true });

  if (cErr) {
    console.error('Courses metadata query failed:', cErr);
  } else {
    console.log(`SUCCESS: Fetched ${coursesData?.length} tracks from database:`);
    coursesData?.forEach(c => console.log(` - ${c.code}: ${c.name} (${c.id})`));
  }
}

testGigsQueries();
