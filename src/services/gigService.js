// ==============================================================================
// UpShift Commercial Opportunities (Gigs) Canonical Data Service
// ==============================================================================
// Authoritative relationship:
//   public.gigs.track_id -> public.tracks(id)
// Specialization Modules (M1-M6) serve as capability taxonomy for opportunities.
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
 * Fetch paginated gigs with search, track filtering, and marketplace sorting
 * 
 * Sort modes:
 * - 'priority': is_featured DESC, priority DESC, created_at DESC (Default)
 * - 'newest': posted_at DESC NULLS LAST, created_at DESC
 * - 'pay': max_amount DESC NULLS LAST, min_amount DESC NULLS LAST, created_at DESC
 * - 'trending': 7-day weighted interaction popularity score with deterministic fallback
 */
export async function fetchGigs({
  page = 1,
  pageSize = 25,
  search = '',
  trackId = 'ALL',
  isActive = null,
  sortBy = 'priority',
} = {}) {
  try {
    const from = Math.max(0, (page - 1) * pageSize);
    const to = from + pageSize - 1;

    // Full columns query with fallback
    const selectQuery = `
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
      compensation_type,
      min_amount,
      max_amount,
      currency,
      priority,
      is_featured,
      posted_at,
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
    `;

    // Try full marketplace query first
    let query = supabase.from('gigs').select(selectQuery, { count: 'exact' });

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

    // Apply sorting strategy
    if (sortBy === 'newest') {
      query = query
        .order('posted_at', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false });
    } else if (sortBy === 'pay') {
      query = query
        .order('max_amount', { ascending: false, nullsFirst: false })
        .order('min_amount', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false });
    } else if (sortBy === 'trending') {
      // If trending RPC is available, we query it; otherwise default to interaction/priority sort
      try {
        const { data: trendingScores } = await supabase.rpc('get_trending_gigs', { days_window: 7, result_limit: 100 });
        if (trendingScores && trendingScores.length > 0) {
          // If we have trending IDs, fetch with standard query and sort by score in memory if within page
          query = query
            .order('is_featured', { ascending: false })
            .order('priority', { ascending: false })
            .order('created_at', { ascending: false });
        } else {
          query = query
            .order('is_featured', { ascending: false })
            .order('priority', { ascending: false })
            .order('created_at', { ascending: false });
        }
      } catch {
        query = query
          .order('is_featured', { ascending: false })
          .order('priority', { ascending: false })
          .order('created_at', { ascending: false });
      }
    } else {
      // Default: 'priority'
      query = query
        .order('is_featured', { ascending: false })
        .order('priority', { ascending: false })
        .order('created_at', { ascending: false });
    }

    const { data, count, error } = await query.range(from, to);

    if (error) {
      // Graceful fallback for environments before migration 013
      if (error.message && (error.message.includes('priority') || error.message.includes('max_amount') || error.message.includes('posted_at'))) {
        console.warn('[gigService:fetchGigs] Optional sorting columns not detected in remote DB, falling back to base query.');
        let fallbackQuery = supabase.from('gigs').select(`
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
        `, { count: 'exact' });

        if (isActive !== null) fallbackQuery = fallbackQuery.eq('is_active', Boolean(isActive));
        if (trackId && trackId !== 'ALL') fallbackQuery = fallbackQuery.eq('track_id', trackId);
        if (trimmedSearch) fallbackQuery = fallbackQuery.or(`title.ilike.%${trimmedSearch}%,short_description.ilike.%${trimmedSearch}%`);

        fallbackQuery = fallbackQuery.order('created_at', { ascending: false });
        const fallbackRes = await fallbackQuery.range(from, to);
        if (fallbackRes.error) throw fallbackRes.error;

        return {
          data: fallbackRes.data || [],
          count: fallbackRes.count || 0,
          error: null,
        };
      }

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
        compensation_type,
        min_amount,
        max_amount,
        currency,
        priority,
        is_featured,
        posted_at,
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
      // Fallback query if optional columns are pending
      if (error.message && (error.message.includes('priority') || error.message.includes('compensation_type'))) {
        const { data: fbData, error: fbErr } = await supabase
          .from('gigs')
          .select(`
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
          `)
          .eq('id', gigId)
          .single();

        if (fbErr) throw fbErr;
        return { data: fbData, error: null };
      }

      logGigError('fetchGigById', error);
      throw error;
    }

    return { data, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
}

/**
 * Canonical Gig Payload Normalization Helper
 * Sanitizes both CSV-parsed and Form-submitted fields into the canonical database model.
 */
export function normalizeGigPayload(raw = {}) {
  const cleanResponsibilities = Array.isArray(raw.responsibilities)
    ? raw.responsibilities.map(s => String(s).trim()).filter(Boolean)
    : (typeof raw.responsibilities === 'string' ? raw.responsibilities.split(/\n|\|\|/).map(s => s.replace(/^[•\-\*\s]+/, '').trim()).filter(Boolean) : []);

  const cleanDeliverables = Array.isArray(raw.deliverables)
    ? raw.deliverables.map(s => String(s).trim()).filter(Boolean)
    : (typeof raw.deliverables === 'string' ? raw.deliverables.split(/\n|\|\|/).map(s => s.replace(/^[•\-\*\s]+/, '').trim()).filter(Boolean) : []);

  const cleanRequirements = Array.isArray(raw.requirements)
    ? raw.requirements.map(s => String(s).trim()).filter(Boolean)
    : (typeof raw.requirements === 'string' ? raw.requirements.split(/\n|\|\|/).map(s => s.replace(/^[•\-\*\s]+/, '').trim()).filter(Boolean) : []);

  const minAmt = raw.min_amount !== undefined && raw.min_amount !== null && raw.min_amount !== '' && !isNaN(raw.min_amount) ? parseFloat(raw.min_amount) : null;
  const maxAmt = raw.max_amount !== undefined && raw.max_amount !== null && raw.max_amount !== '' && !isNaN(raw.max_amount) ? parseFloat(raw.max_amount) : (minAmt || null);
  const prio = raw.priority !== undefined && raw.priority !== null && raw.priority !== '' && !isNaN(raw.priority) ? Math.max(0, parseInt(raw.priority, 10)) : 0;
  const isFeat = typeof raw.is_featured === 'boolean' ? raw.is_featured : (String(raw.is_featured).toLowerCase() === 'true' || raw.is_featured === '1');

  return {
    external_gig_id: raw.external_gig_id ? String(raw.external_gig_id).trim() : null,
    title: raw.title ? String(raw.title).trim() : '',
    track_id: raw.track_id ? String(raw.track_id).trim() : '',
    payment_amount: raw.payment_amount ? String(raw.payment_amount).trim() : null,
    compensation_type: raw.compensation_type ? String(raw.compensation_type).trim().toLowerCase() : 'fixed',
    min_amount: minAmt,
    max_amount: maxAmt,
    currency: raw.currency ? String(raw.currency).trim().toUpperCase() : 'INR',
    priority: prio,
    is_featured: isFeat,
    posted_at: raw.posted_at ? String(raw.posted_at).trim() : null,
    short_description: raw.short_description ? String(raw.short_description).trim() : null,
    overview: raw.overview ? String(raw.overview).trim() : null,
    responsibilities: cleanResponsibilities,
    deliverables: cleanDeliverables,
    requirements: cleanRequirements,
    proof_spec: raw.proof_spec ? String(raw.proof_spec).trim() : null,
    origin_url: raw.origin_url ? String(raw.origin_url).trim() : '',
    is_active: raw.is_active !== undefined ? Boolean(raw.is_active) : true,
  };
}

/**
 * Strips marketplace sorting columns if remote PostgREST schema cache has not yet refreshed
 */
function stripPendingMarketplaceColumns(payload) {
  const {
    compensation_type,
    min_amount,
    max_amount,
    currency,
    priority,
    is_featured,
    posted_at,
    updated_at,
    ...baseline
  } = payload;
  return baseline;
}

function isSchemaCacheColumnError(error) {
  if (!error || !error.message) return false;
  const msg = error.message.toLowerCase();
  return (
    msg.includes('could not find the') ||
    msg.includes('schema cache') ||
    msg.includes('compensation_type') ||
    msg.includes('priority') ||
    msg.includes('is_featured') ||
    msg.includes('min_amount') ||
    msg.includes('max_amount')
  );
}

/**
 * Insert a new gig record with sanitized marketplace attributes
 */
export async function createGig(payload) {
  try {
    const cleanPayload = normalizeGigPayload(payload);

    let { data, error } = await supabase
      .from('gigs')
      .insert([cleanPayload])
      .select()
      .single();

    if (error && isSchemaCacheColumnError(error)) {
      console.warn('[gigService:createGig] Schema column pending in remote DB, retrying with baseline fields:', error.message);
      const fallbackPayload = stripPendingMarketplaceColumns(cleanPayload);
      const retryRes = await supabase
        .from('gigs')
        .insert([fallbackPayload])
        .select()
        .single();

      if (retryRes.error) {
        logGigError('createGig:fallback', retryRes.error);
        throw retryRes.error;
      }
      return { data: retryRes.data, error: null };
    }

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
    const cleanPayload = normalizeGigPayload(payload);

    let { data, error } = await supabase
      .from('gigs')
      .update(cleanPayload)
      .eq('id', gigId)
      .select()
      .single();

    if (error && isSchemaCacheColumnError(error)) {
      console.warn('[gigService:updateGig] Schema column pending in remote DB, retrying with baseline fields:', error.message);
      const fallbackPayload = stripPendingMarketplaceColumns(cleanPayload);
      const retryRes = await supabase
        .from('gigs')
        .update(fallbackPayload)
        .eq('id', gigId)
        .select()
        .single();

      if (retryRes.error) {
        logGigError('updateGig:fallback', retryRes.error);
        throw retryRes.error;
      }
      return { data: retryRes.data, error: null };
    }

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

/**
 * Batch import gigs with idempotent upsert on external_gig_id and row-level error reporting
 */
export async function importGigsBatch(payloadBatch = []) {
  if (!Array.isArray(payloadBatch) || payloadBatch.length === 0) {
    return { success: true, created: 0, failed: 0, errors: [] };
  }

  let createdCount = 0;
  let failedCount = 0;
  const failureList = [];

  const normalizedBatch = payloadBatch.map((item, idx) => ({
    ...normalizeGigPayload(item),
    _rowIdx: item.rowNumber || idx + 1,
  }));

  // Helper to run insert/upsert with automatic fallback if PostgREST cache has pending columns
  const executeWriteChunk = async (chunk, isUpsert) => {
    const cleanChunk = chunk.map(({ _rowIdx, ...fields }) => fields);

    const runWrite = async (items) => {
      if (isUpsert) {
        return await supabase
          .from('gigs')
          .upsert(items, { onConflict: 'external_gig_id' })
          .select('id');
      } else {
        return await supabase
          .from('gigs')
          .insert(items)
          .select('id');
      }
    };

    let { data, error } = await runWrite(cleanChunk);

    // If batch error due to pending schema columns, retry whole batch with baseline payload
    if (error && isSchemaCacheColumnError(error)) {
      console.warn('[gigService:importGigsBatch] Schema columns pending in remote DB, retrying batch with baseline fields.');
      const baselineChunk = cleanChunk.map(stripPendingMarketplaceColumns);
      const retryRes = await runWrite(baselineChunk);
      data = retryRes.data;
      error = retryRes.error;
    }

    if (error) {
      // Isolate failures row-by-row
      for (const item of chunk) {
        const { _rowIdx, ...itemFields } = item;
        let singleRes = isUpsert
          ? await supabase.from('gigs').upsert([itemFields], { onConflict: 'external_gig_id' })
          : await supabase.from('gigs').insert([itemFields]);

        if (singleRes.error && isSchemaCacheColumnError(singleRes.error)) {
          const baselineItem = stripPendingMarketplaceColumns(itemFields);
          singleRes = isUpsert
            ? await supabase.from('gigs').upsert([baselineItem], { onConflict: 'external_gig_id' })
            : await supabase.from('gigs').insert([baselineItem]);
        }

        if (singleRes.error) {
          failedCount++;
          failureList.push({
            row: _rowIdx,
            error: singleRes.error.message || 'Database write error',
            details: singleRes.error.details || singleRes.error.hint || null,
          });
        } else {
          createdCount++;
        }
      }
    } else {
      createdCount += (data || []).length;
    }
  };

  // Separate rows with external_gig_id vs rows without
  const withExternalId = normalizedBatch.filter(r => Boolean(r.external_gig_id));
  const withoutExternalId = normalizedBatch.filter(r => !r.external_gig_id);

  const CHUNK_SIZE = 50;

  if (withExternalId.length > 0) {
    for (let i = 0; i < withExternalId.length; i += CHUNK_SIZE) {
      await executeWriteChunk(withExternalId.slice(i, i + CHUNK_SIZE), true);
    }
  }

  if (withoutExternalId.length > 0) {
    for (let i = 0; i < withoutExternalId.length; i += CHUNK_SIZE) {
      await executeWriteChunk(withoutExternalId.slice(i, i + CHUNK_SIZE), false);
    }
  }

  return {
    success: failureList.length === 0,
    created: createdCount,
    failed: failedCount,
    errors: failureList,
  };
}

/**
 * Non-blocking interaction telemetry recording
 * Supported eventTypes: 'view', 'detail_open', 'apply_click', 'share'
 */
export async function recordGigInteraction({ gigId, eventType, userId = null } = {}) {
  if (!gigId || !UUID_REGEX.test(gigId)) return;
  const validEvents = ['view', 'detail_open', 'apply_click', 'share'];
  if (!validEvents.includes(eventType)) return;

  try {
    // Non-blocking async fire-and-forget
    supabase
      .from('gig_interactions')
      .insert([
        {
          gig_id: gigId,
          user_id: userId || null,
          event_type: eventType,
        },
      ])
      .then(({ error }) => {
        if (error && !error.message?.includes('does not exist')) {
          console.warn('[gigService:recordGigInteraction] Telemetry notice:', error.message);
        }
      })
      .catch(() => {});
  } catch {
    // Silent fail to guarantee primary user actions are never interrupted
  }
}
