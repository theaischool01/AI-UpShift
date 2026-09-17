import dns from 'node:dns';
import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

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
const learnerEmail = process.argv[2] || 'learner@upshift.work';
const learnerPassword = process.argv[3] || 'Learner2026!';

const supabaseAdmin = createClient(supabaseUrl, secretKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});

async function provisionLearner() {
  console.log(`\n[UpShift Learner Provisioner] Setting up learner account for: ${learnerEmail}`);

  try {
    const { data: listData, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    if (listError) throw listError;

    const existingUser = listData.users.find(
      (u) => u.email?.toLowerCase() === learnerEmail.toLowerCase()
    );

    let userId;

    if (existingUser) {
      console.log(`[Info] Auth user already exists (${existingUser.id}). Updating password and metadata...`);
      userId = existingUser.id;
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        password: learnerPassword,
        email_confirm: true,
        user_metadata: { role: 'learner', full_name: 'Aarav Sharma' }
      });
      if (updateError) throw updateError;
    } else {
      console.log('[Info] Creating new learner Auth account in Supabase Auth...');
      const { data: createData, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: learnerEmail,
        password: learnerPassword,
        email_confirm: true,
        user_metadata: { role: 'learner', full_name: 'Aarav Sharma' }
      });
      if (createError) throw createError;
      userId = createData.user.id;
    }

    console.log(`[Info] Ensuring public.profiles record has role = 'learner' for user: ${userId}`);
    const { error: profileError } = await supabaseAdmin.from('profiles').upsert({
      id: userId,
      email: learnerEmail,
      full_name: 'Aarav Sharma',
      role: 'learner',
      updated_at: new Date().toISOString()
    });

    if (profileError) {
      console.log('[Note] Profile update message:', profileError.message);
    } else {
      console.log('[Success] public.profiles record set to role: learner');
    }

    console.log('\n=============================================================');
    console.log('✓ LEARNER ACCOUNT READY');
    console.log(`  User ID: ${userId}`);
    console.log(`  Email:   ${learnerEmail}`);
    console.log(`  Password: ${learnerPassword}`);
    console.log('  Role:    learner');
    console.log('=============================================================\n');
  } catch (err) {
    console.error('[Error] Learner provisioning failed:', err.message);
    process.exit(1);
  }
}

provisionLearner();
