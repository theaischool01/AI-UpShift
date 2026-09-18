import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Read .env.local
const envContent = fs.readFileSync('.env.local', 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return;
  const eqIdx = trimmed.indexOf('=');
  if (eqIdx !== -1) {
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    env[key] = val;
  }
});

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SECRET_KEY || env.VITE_SUPABASE_PUBLISHABLE_KEY;

console.log('Connecting to Supabase at:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
});

async function resetGigs() {
  // 1. Check count before
  const { count: beforeCount, error: countErr } = await supabase
    .from('gigs')
    .select('*', { count: 'exact', head: true });

  if (countErr) {
    console.error('Error fetching count:', countErr);
  } else {
    console.log(`Current gigs count: ${beforeCount}`);
  }

  // 2. Delete all rows
  const { data, error: deleteErr } = await supabase
    .from('gigs')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');

  if (deleteErr) {
    console.error('Error deleting gigs:', deleteErr);
  } else {
    console.log('Successfully deleted all records from public.gigs.');
  }

  // 3. Check count after
  const { count: afterCount, error: verifyErr } = await supabase
    .from('gigs')
    .select('*', { count: 'exact', head: true });

  if (verifyErr) {
    console.error('Error verifying count:', verifyErr);
  } else {
    console.log(`Verified new gigs count: ${afterCount}`);
  }
}

resetGigs();
