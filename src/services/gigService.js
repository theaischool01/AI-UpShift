// ==============================================================================
// UpShift Commercial Opportunities (Gigs) Canonical Data Service
// ==============================================================================
// Authoritative relationship:
//   public.gigs.track_id -> public.tracks(id)
// Modules (M1-M6) serve as curriculum & capability taxonomy for opportunities.
// ==============================================================================

import { supabase } from '../lib/supabaseClient.js';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Diagnostic helper to log comprehensive error metadata
 */
function logGigError(operation, error) {
  console.error(`[gigService:${operation}] Database Error:`, {
    operation,
    code: error?.code,
    message: error?.message,
    details: error?.details,
    hint: error?.hint,
    status: error?.status,
  });
}

/**
 * Fetch list of tracks (M1-M6 capability taxonomy)
 */
export async function fetchTracks() {
  try {
    const { data, error } = await supabase
      .from('tracks')
      .select('id, code, name, category, color, bg_color')
      .order('code', { ascending: true });

    if (error) {
      logGigError('fetchTracks', error);
      throw error;
    }
    return { data: data || [], error: null };
  } catch (err) {
    return { data: [], error: err };
  }
}

/**
 * Fetch paginated gigs with optional search and track filtering
 */
export async function fetchGigs({
  page = 1,
  pageSize = 25,
  search = '',
  trackId = 'ALL',
  isActive = null,
} = {}) {
  try {
    const from = Math.max(0, (page - 1) * pageSize);
    const to = from + pageSize - 1;

    let query = supabase
      .from('gigs')
      .select(
        `
        id,
        external_gig_id,
        title,
        track_id,
        short_description,
        overview,
        responsibilities,
        deliverables,
        requirements,
        proof_spec,
        origin_url,
        payment_amount,
        is_active,
        created_at,
        track:tracks (
          id,
          code,
          name,
          category,
          color,
          bg_color
        )
      `,
        { count: 'exact' }
      );

    if (isActive !== null) {
      query = query.eq('is_active', Boolean(isActive));
    }

    if (trackId && trackId !== 'ALL') {
      query = query.eq('track_id', trackId);
    }

    const trimmedSearch = (search || '').trim().replace(/[,%]/g, '');
    if (trimmedSearch) {
      query = query.or(
        `title.ilike.%${trimmedSearch}%,short_description.ilike.%${trimmedSearch}%`
      );
    }

    const { data, count, error } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      logGigError('fetchGigs', error);
      throw error;
    }

    return {
      data: data || [],
      count: count || 0,
      error: null,
    };
  } catch (err) {
    return {
      data: [],
      count: 0,
      error: err,
    };
  }
}

/**
 * Fetch single gig by UUID with full specification details
 */
export async function fetchGigById(gigId) {
  if (!gigId || !UUID_REGEX.test(gigId)) {
    return { data: null, error: new Error('Invalid Opportunity ID format.') };
  }

  try {
    const { data, error } = await supabase
      .from('gigs')
      .select(
        `
        id,
        external_gig_id,
        title,
        track_id,
        short_description,
        overview,
        responsibilities,
        deliverables,
        requirements,
        proof_spec,
        origin_url,
        payment_amount,
        is_active,
        created_at,
        track:tracks (
          id,
          code,
          name,
          category,
          color,
          bg_color
        )
      `
      )
      .eq('id', gigId)
      .single();

    if (error) {
      logGigError('fetchGigById', error);
      throw error;
    }

    return { data, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
}

/**
 * Insert a new gig record
 */
export async function createGig(payload) {
  try {
    const { data, error } = await supabase
      .from('gigs')
      .insert([payload])
      .select()
      .single();

    if (error) {
      logGigError('createGig', error);
      throw error;
    }

    return { data, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
}

/**
 * Update an existing gig record
 */
export async function updateGig(gigId, payload) {
  if (!gigId || !UUID_REGEX.test(gigId)) {
    return { data: null, error: new Error('Invalid Opportunity ID.') };
  }

  try {
    const { data, error } = await supabase
      .from('gigs')
      .update(payload)
      .eq('id', gigId)
      .select()
      .single();

    if (error) {
      logGigError('updateGig', error);
      throw error;
    }

    return { data, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
}

/**
 * Delete a gig record
 */
export async function deleteGig(gigId) {
  if (!gigId || !UUID_REGEX.test(gigId)) {
    return { error: new Error('Invalid Opportunity ID.') };
  }

  try {
    const { error } = await supabase.from('gigs').delete().eq('id', gigId);

    if (error) {
      logGigError('deleteGig', error);
      throw error;
    }

    return { error: null };
  } catch (err) {
    return { error: err };
  }
}
