// Supabase Edge Function: create-razorpay-order
// Generates a canonical ₹4,999 (499900 paise) Razorpay Order and logs payment attempt

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const CANONICAL_AMOUNT_INR = 4999.00;
const CANONICAL_AMOUNT_PAISE = 499900;
const CANONICAL_CURRENCY = 'INR';
const PROGRAM_ID = 'upshift-complete-program';

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
    
    // Server-side Razorpay Secrets (NEVER exposed to client)
    const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID') || Deno.env.get('VITE_RAZORPAY_KEY_ID') || 'YOUR_RAZORPAY_KEY_ID_HERE';
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET') || 'YOUR_RAZORPAY_KEY_SECRET_HERE';

    const body = await req.json().catch(() => ({}));
    const customer = body?.customer || {};
    const customerName = (customer.name || customer.full_name || 'UpShift Learner').trim();
    const customerEmail = (customer.email || '').trim().toLowerCase();
    const customerPhone = (customer.phone || customer.mobile || '').trim();

    if (!customerEmail) {
      return new Response(
        JSON.stringify({ error: 'Customer email is required to create a payment order.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let razorpayOrderId = '';
    const receiptId = `rcpt_${Date.now().toString().slice(-8)}_${Math.random().toString(36).substring(2, 6)}`;

    // Check if real or test Razorpay credentials are provided
    const hasLiveOrTestCredentials = 
      razorpayKeyId && 
      razorpayKeySecret && 
      !razorpayKeyId.includes('YOUR_RAZORPAY_KEY') && 
      !razorpayKeySecret.includes('YOUR_RAZORPAY_KEY');

    if (hasLiveOrTestCredentials) {
      // Call official Razorpay Orders API
      const auth = btoa(`${razorpayKeyId}:${razorpayKeySecret}`);
      const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: CANONICAL_AMOUNT_PAISE,
          currency: CANONICAL_CURRENCY,
          receipt: receiptId,
          notes: {
            program_id: PROGRAM_ID,
            program_name: 'UpShift Complete Applied AI Program',
            customer_name: customerName,
            customer_email: customerEmail,
          },
        }),
      });

      const rzData = await razorpayResponse.json();
      if (!razorpayResponse.ok || !rzData?.id) {
        console.error('[create-razorpay-order] Razorpay API error:', rzData);
        return new Response(
          JSON.stringify({ error: rzData?.error?.description || 'Failed to initialize order with payment gateway.' }),
          { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      razorpayOrderId = rzData.id;
    } else {
      // Development / Placeholder Mode: Generate standardized order reference
      razorpayOrderId = `order_${Math.random().toString(36).substring(2, 14)}`;
      console.log(`[create-razorpay-order] Initialized placeholder order ${razorpayOrderId} for ${customerEmail}`);
    }

    // Record created payment attempt in Supabase if service credentials exist
    if (supabaseUrl && supabaseServiceKey) {
      try {
        const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
          auth: { persistSession: false },
        });

        await adminClient.from('payments').insert({
          razorpay_order_id: razorpayOrderId,
          amount: CANONICAL_AMOUNT_INR,
          currency: CANONICAL_CURRENCY,
          status: 'created',
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          program_id: PROGRAM_ID,
          metadata: {
            receipt: receiptId,
            education: customer.education || {},
            heard_from: customer.heard_from || null,
          },
        });
      } catch (dbErr) {
        console.warn('[create-razorpay-order] Payment log insert notice:', dbErr);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        order: {
          id: razorpayOrderId,
          amount: CANONICAL_AMOUNT_PAISE,
          amount_display: CANONICAL_AMOUNT_INR,
          currency: CANONICAL_CURRENCY,
          key_id: razorpayKeyId,
          program_id: PROGRAM_ID,
          program_name: 'UpShift Complete Applied AI Program',
        },
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    console.error('[create-razorpay-order] Unexpected error:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Failed to create payment order.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
