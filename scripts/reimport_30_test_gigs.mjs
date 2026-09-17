import dns from 'node:dns';
import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

// DNS patch for Supabase connection reliability
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

// Load environment variables
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
const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Realistic payment values for each test gig
const paymentMap = {
  'UP-TEST-M1-001': '$25/hr',
  'UP-TEST-M1-002': '$30/hr',
  'UP-TEST-M1-003': '$20–35/hr',
  'UP-TEST-M1-004': '$25/hr',
  'UP-TEST-M1-005': '$500/project',

  'UP-TEST-M2-001': '$35/hr',
  'UP-TEST-M2-002': '$600/project',
  'UP-TEST-M2-003': '$25/hr',
  'UP-TEST-M2-004': '$40/hr',
  'UP-TEST-M2-005': '$30/hr',

  'UP-TEST-M3-001': '$22/hr',
  'UP-TEST-M3-002': '$25/hr',
  'UP-TEST-M3-003': '$28/hr',
  'UP-TEST-M3-004': '$24/hr',
  'UP-TEST-M3-005': '$35/hr',

  'UP-TEST-M4-001': '$45/hr',
  'UP-TEST-M4-002': '$40/hr',
  'UP-TEST-M4-003': '$1,500–2,500/month',
  'UP-TEST-M4-004': '$35/hr',
  'UP-TEST-M4-005': '$800/project',

  'UP-TEST-M5-001': '$30/hr',
  'UP-TEST-M5-002': '$25/hr',
  'UP-TEST-M5-003': '$35/hr',
  'UP-TEST-M5-004': '$28/hr',
  'UP-TEST-M5-005': '$25/hr',

  'UP-TEST-M6-001': '$50/hr',
  'UP-TEST-M6-002': '$45/hr',
  'UP-TEST-M6-003': '$40/hr',
  'UP-TEST-M6-004': '$35/hr',
  'UP-TEST-M6-005': '$1,200/project',
};

async function run() {
  console.log('[Reimport] Fetching current 30 test gigs from public.gigs...');
  const { data: existingGigs, error: fetchErr } = await supabase
    .from('gigs')
    .select('*')
    .like('external_gig_id', 'UP-TEST-%')
    .order('external_gig_id', { ascending: true });

  if (fetchErr) {
    console.error('[Reimport] Fetch error:', fetchErr);
    process.exit(1);
  }

  console.log(`[Reimport] Found ${existingGigs.length} UP-TEST records.`);

  // Generate CSV rows
  const headers = [
    'external_gig_id',
    'title',
    'course_id',
    'payment_amount',
    'short_description',
    'long_description',
    'origin_site',
    'origin_url',
    'organization',
    'location',
    'engagement_type'
  ];

  const csvRows = [headers.join(',')];
  const payloadRows = [];

  for (const gig of existingGigs) {
    const payment = paymentMap[gig.external_gig_id] || '$30/hr';
    const row = [
      gig.external_gig_id,
      `"${(gig.title || '').replace(/"/g, '""')}"`,
      gig.course_id,
      `"${payment}"`,
      `"${(gig.short_description || '').replace(/"/g, '""')}"`,
      `"${(gig.long_description || '').replace(/"/g, '""')}"`,
      gig.origin_site,
      `"${gig.origin_url}"`,
      `"${(gig.organization || '').replace(/"/g, '""')}"`,
      `"${gig.location || 'Remote'}"`,
      `"${gig.engagement_type || 'Contract'}"`
    ];
    csvRows.push(row.join(','));

    payloadRows.push({
      external_gig_id: gig.external_gig_id,
      title: gig.title,
      course_id: gig.course_id,
      payment_amount: payment,
      short_description: gig.short_description,
      long_description: gig.long_description,
      origin_site: gig.origin_site,
      origin_url: gig.origin_url,
      organization: gig.organization,
      location: gig.location,
      engagement_type: gig.engagement_type,
    });
  }

  const csvContent = csvRows.join('\n');
  const csvFilePath = path.resolve(process.cwd(), 'scripts/test_30_gigs_with_payment.csv');
  fs.writeFileSync(csvFilePath, csvContent, 'utf8');
  console.log(`[Reimport] Generated CSV written to: ${csvFilePath}`);

  console.log('[Reimport] Executing upsert on external_gig_id with payment_amount...');
  const { data: upsertData, error: upsertErr } = await supabase
    .from('gigs')
    .upsert(payloadRows, { onConflict: 'external_gig_id' })
    .select('id, external_gig_id, payment_amount');

  if (upsertErr) {
    console.error('[Reimport] Upsert FAILED:', upsertErr);
    process.exit(1);
  }

  console.log(`[Reimport] Upsert SUCCESS! Updated rows: ${upsertData.length}`);

  // Verification
  console.log('[Verification] Checking database state after upsert:');
  const { data: verifiedGigs, error: vErr } = await supabase
    .from('gigs')
    .select('external_gig_id, title, payment_amount')
    .like('external_gig_id', 'UP-TEST-%')
    .order('external_gig_id', { ascending: true });

  if (vErr) {
    console.error('[Verification] Verification query failed:', vErr);
  } else {
    console.log(`[Verification] Verified ${verifiedGigs.length} records. Sample check:`);
    verifiedGigs.slice(0, 8).forEach(g => {
      console.log(` - ${g.external_gig_id}: ${g.title.padEnd(35)} => Payment: ${g.payment_amount}`);
    });
    const withPayment = verifiedGigs.filter(g => g.payment_amount && g.payment_amount.trim() !== '');
    console.log(`[Verification] Records with non-empty payment_amount: ${withPayment.length} / ${verifiedGigs.length}`);
  }
}

run();
