import dns from 'node:dns';
import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

// ------------------------------------------------------------------------------
// DNS over HTTPS patch to ensure smooth connection across ISP DNS blocks
// ------------------------------------------------------------------------------
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

// ------------------------------------------------------------------------------
// Load environment variables from .env.local if not already in process.env
// ------------------------------------------------------------------------------
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
const secretKey = process.env.SUPABASE_SECRET_KEY;
const adminEmail = process.env.INITIAL_ADMIN_EMAIL || process.argv[2];
const adminPassword = process.env.INITIAL_ADMIN_PASSWORD || process.argv[3];

if (!supabaseUrl || !secretKey) {
  console.error('[Error] Missing VITE_SUPABASE_URL or SUPABASE_SECRET_KEY in environment/.env.local');
  process.exit(1);
}

if (!adminEmail || !adminPassword) {
  console.log('\n=============================================================');
  console.log('UPSHIFT INITIAL ADMIN PROVISIONING UTILITY');
  console.log('=============================================================');
  console.log('Usage:');
  console.log('  node scripts/setup-initial-admin.mjs <admin_email> <admin_password>');
  console.log('Or set environment variables:');
  console.log('  INITIAL_ADMIN_EMAIL=admin@upshift.work');
  console.log('  INITIAL_ADMIN_PASSWORD=your-secure-password');
  console.log('=============================================================\n');
  process.exit(0);
}

const supabaseAdmin = createClient(supabaseUrl, secretKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});

async function provisionAdmin() {
  console.log(`\n[UpShift Admin Provisioner] Setting up admin account for: ${adminEmail}`);

  try {
    // 1. Check if user already exists
    const { data: listData, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    if (listError) throw listError;

    const existingUser = listData.users.find(
      (u) => u.email?.toLowerCase() === adminEmail.toLowerCase()
    );

    let userId;

    if (existingUser) {
      console.log(`[Info] Auth user already exists (${existingUser.id}). Updating password and metadata...`);
      userId = existingUser.id;
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        password: adminPassword,
        email_confirm: true,
        user_metadata: { role: 'admin', full_name: 'Platform Administrator' }
      });
      if (updateError) throw updateError;
    } else {
      console.log('[Info] Creating new administrative Auth account in Supabase Auth...');
      const { data: createData, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
        user_metadata: { role: 'admin', full_name: 'Platform Administrator' }
      });
      if (createError) throw createError;
      userId = createData.user.id;
    }

    // 2. Ensure profile has admin role in public.profiles
    console.log(`[Info] Ensuring public.profiles record has role = 'admin' for user: ${userId}`);
    const { error: profileError } = await supabaseAdmin.from('profiles').upsert({
      id: userId,
      email: adminEmail,
      full_name: 'Platform Administrator',
      role: 'admin',
      updated_at: new Date().toISOString()
    });

    if (profileError) {
      console.log('[Note] If public.profiles table is not yet migrated, run 001_initial_schema.sql first.');
      console.log('[Note] Profile update message:', profileError.message);
    } else {
      console.log('[Success] public.profiles record set to role: admin');
    }

    console.log('\n=============================================================');
    console.log('✓ ADMIN ACCOUNT READY FOR PHASE 2 AUTHENTICATION');
    console.log(`  User ID: ${userId}`);
    console.log(`  Email:   ${adminEmail}`);
    console.log('  Role:    admin');
    console.log('=============================================================\n');
  } catch (err) {
    console.error('[Error] Admin provisioning failed:', err.message);
    process.exit(1);
  }
}

provisionAdmin();
