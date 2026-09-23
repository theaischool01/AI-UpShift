// Payment Service for UpShift Complete Program Razorpay Checkout
import { supabase } from '../lib/supabaseClient';

// Helper: Dynamically load Razorpay Checkout script
export function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.warn('[Razorpay] Failed to load checkout script from CDN.');
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

// 1. Create Razorpay Order via Supabase Edge Function
export async function createRazorpayOrder(customerData) {
  try {
    const { data, error } = await supabase.functions.invoke('create-razorpay-order', {
      body: {
        customer: {
          name: customerData.fullName,
          email: customerData.email,
          mobile: customerData.mobile,
          college: customerData.college,
          education: {
            degree: customerData.courseDegree,
            branch: customerData.branch,
            current_year: customerData.currentYear,
            graduation_year: customerData.graduationYear,
          },
          heard_from: customerData.heardFrom,
        },
      },
    });

    if (error) {
      // Fallback: direct HTTP call to edge function
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      if (supabaseUrl) {
        const res = await fetch(`${supabaseUrl}/functions/v1/create-razorpay-order`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ customer: customerData }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Failed to create payment order.');
        return json;
      }
      throw new Error(error.message || 'Order creation failed.');
    }

    return data;
  } catch (err) {
    console.error('[paymentService] createRazorpayOrder error:', err);
    throw err;
  }
}

// 2. Verify Razorpay Payment via Supabase Edge Function
export async function verifyRazorpayPayment({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
  learnerData,
}) {
  try {
    const payload = {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      learner: {
        full_name: learnerData.fullName,
        email: learnerData.email,
        password: learnerData.password,
        dob_age: learnerData.dobAge,
        gender: learnerData.gender,
        mobile: learnerData.mobile,
        city: learnerData.city,
        state: learnerData.state,
        current_status: learnerData.otherStatus
          ? `${learnerData.currentStatus} (${learnerData.otherStatus})`
          : learnerData.currentStatus,
        other_status: learnerData.otherStatus || null,
        college: learnerData.college,
        course_degree: learnerData.courseDegree,
        branch: learnerData.branch,
        current_year: learnerData.currentYear,
        graduation_year: learnerData.graduationYear,
        heard_from: learnerData.heardFrom,
        program_id: 'upshift-complete-program',
        track_id: learnerData.trackId || null,
      },
    };

    const { data, error } = await supabase.functions.invoke('verify-razorpay-payment', {
      body: payload,
    });

    if (error) {
      // Direct fetch fallback
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      if (supabaseUrl) {
        const res = await fetch(`${supabaseUrl}/functions/v1/verify-razorpay-payment`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Payment verification failed.');
        return json;
      }
      throw new Error(error.message || 'Payment verification failed.');
    }

    return data;
  } catch (err) {
    console.error('[paymentService] verifyRazorpayPayment error:', err);
    throw err;
  }
}

// ==============================================================================
// PROVIDER-AGNOSTIC PAYMENT INTERFACE (PREPARED FOR JUSPAY / MULTI-GATEWAY)
// ==============================================================================

/**
 * Clean entry point to create a payment order with the active provider
 */
export async function createPaymentOrder(orderParams) {
  // Currently routes to Razorpay; will support Juspay gateway switch seamlessly
  return createRazorpayOrder(orderParams);
}

/**
 * Clean entry point to verify payment server-side with the active provider
 */
export async function verifyPayment(verificationParams) {
  // Currently routes to Razorpay; will support Juspay verification seamlessly
  return verifyRazorpayPayment(verificationParams);
}

/**
 * Unified payment failure handler
 */
export function handlePaymentFailure(error) {
  console.warn('[paymentService] Payment failure event:', error);
  return {
    success: false,
    error: error?.message || error?.description || 'Payment was declined or cancelled.'
  };
}

/**
 * Authoritative payment webhook receiver contract (to be wired for server-to-server confirmation)
 */
export function handlePaymentWebhook() {
  // Webhook handler stub prepared for future provider reconciliation
  return { status: 'pending_provider_discussion' };
}

