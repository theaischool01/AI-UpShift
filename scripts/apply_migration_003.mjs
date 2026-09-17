import dns from 'node:dns';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { createClient } from '@supabase/supabase-js';

// DNS patch for Indian ISP / Cloudflare routing to Supabase
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
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_SECRET_KEY;

console.log('[Verification] Testing REST query with select=id,external_gig_id,title,payment_amount...');
const supabase = createClient(supabaseUrl, supabaseKey);

async function verify() {
  const { data, error } = await supabase
    .from('gigs')
    .select('id, external_gig_id, title, payment_amount')
    .limit(5);

  if (error) {
    console.error('[Verification] REST query FAILED:', error);
    process.exit(1);
  } else {
    console.log('[Verification] REST query SUCCESS! PostgREST recognizes payment_amount:');
    console.log(JSON.stringify(data, null, 2));
  }
}

verify();
