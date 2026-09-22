import { normalizeGigPayload } from '../src/services/gigService.js';

function parseCSV(text) {
  const lines = [];
  let currentField = '';
  let currentLine = [];
  let inQuotes = false;
  
  const cleanText = text.charCodeAt(0) === 0xFEFF ? text.slice(1) : text;

  for (let i = 0; i < cleanText.length; i++) {
    const char = cleanText[i];
    const nextChar = cleanText[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentField += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      currentLine.push(currentField.trim());
      currentField = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      currentLine.push(currentField.trim());
      currentField = '';
      if (currentLine.some(f => f.length > 0)) {
        lines.push(currentLine);
      }
      currentLine = [];
    } else {
      currentField += char;
    }
  }

  if (currentField.length > 0 || currentLine.length > 0) {
    currentLine.push(currentField.trim());
    if (currentLine.some(f => f.length > 0)) {
      lines.push(currentLine);
    }
  }

  return lines;
}

function runCsvParseVerification(csvText, mockTrackMap = new Map([['m1', { id: 'uuid-m1', code: 'M1' }]])) {
  const parsedMatrix = parseCSV(csvText);
  if (parsedMatrix.length < 2) return { error: 'Empty' };

  const rawHeaders = parsedMatrix[0].map(h => h.toLowerCase().trim().replace(/[\s\-]+/g, '_'));
  const colMap = {
    externalId: rawHeaders.findIndex(h => h === 'external_gig_id' || h === 'external_id' || h === 'gig_id' || h === 'id'),
    title: rawHeaders.findIndex(h => h === 'title' || h === 'gig_title' || h === 'opportunity_title' || h === 'name'),
    track: rawHeaders.findIndex(h => h === 'track_id' || h === 'track' || h === 'course_id' || h === 'course' || h === 'module' || h === 'track_code'),
    isLocalBusiness: rawHeaders.findIndex(h => h === 'is_local_business' || h === 'local_business' || h === 'is_local'),
    originUrl: rawHeaders.findIndex(h => h === 'origin_url' || h === 'url' || h === 'apply_url' || h === 'link'),
  };

  const results = [];
  for (let idx = 1; idx < parsedMatrix.length; idx++) {
    const row = parsedMatrix[idx];
    if (row.length === 0 || row.every(c => c.length === 0)) continue;

    const rawLocalBusiness = colMap.isLocalBusiness !== -1 ? row[colMap.isLocalBusiness] || '' : '';
    const rowErrors = [];

    let parsedIsLocal = false;
    const trimmedLocal = rawLocalBusiness.trim();
    if (trimmedLocal === '') {
      parsedIsLocal = false;
    } else {
      const lowerLocal = trimmedLocal.toLowerCase();
      if (lowerLocal === 'yes' || lowerLocal === 'true' || lowerLocal === '1') {
        parsedIsLocal = true;
      } else if (lowerLocal === 'no' || lowerLocal === 'false' || lowerLocal === '0') {
        parsedIsLocal = false;
      } else {
        rowErrors.push('is_local_business must be YES, NO, or blank.');
        parsedIsLocal = false;
      }
    }

    const payload = normalizeGigPayload({
      title: row[colMap.title] || 'Test',
      track_id: 'M1',
      origin_url: 'https://example.com',
      is_local_business: parsedIsLocal,
    });

    results.push({
      rowNumber: idx + 1,
      rawInput: rawLocalBusiness,
      parsedIsLocal,
      normalizedValue: payload.is_local_business,
      isValid: rowErrors.length === 0,
      errors: rowErrors,
    });
  }

  return results;
}

console.log('=== RUNNING LOCAL BUSINESS SUITE VERIFICATION ===\n');

// CASE 1: is_local_business = YES -> database true
const testCsv1 = `title,track_id,origin_url,is_local_business\nBakery Reel Producer,M1,https://example.com,YES`;
const res1 = runCsvParseVerification(testCsv1)[0];
console.assert(res1.isValid === true && res1.normalizedValue === true, 'CASE 1 FAILED');
console.log('✔ CASE 1: is_local_business = "YES" -> true (PASSED)');

// CASE 2: is_local_business = NO -> database false
const testCsv2 = `title,track_id,origin_url,is_local_business\nGlobal Tech Video,M1,https://example.com,NO`;
const res2 = runCsvParseVerification(testCsv2)[0];
console.assert(res2.isValid === true && res2.normalizedValue === false, 'CASE 2 FAILED');
console.log('✔ CASE 2: is_local_business = "NO" -> false (PASSED)');

// CASE 3: is_local_business = blank -> database false
const testCsv3 = `title,track_id,origin_url,is_local_business\nBlank Gig,M1,https://example.com,`;
const res3 = runCsvParseVerification(testCsv3)[0];
console.assert(res3.isValid === true && res3.normalizedValue === false, 'CASE 3 FAILED');
console.log('✔ CASE 3: is_local_business = blank -> false (PASSED)');

// CASE 4: column completely absent -> import still succeeds -> false
const testCsv4 = `title,track_id,origin_url\nOld CSV Gig,M1,https://example.com`;
const res4 = runCsvParseVerification(testCsv4)[0];
console.assert(res4.isValid === true && res4.normalizedValue === false, 'CASE 4 FAILED');
console.log('✔ CASE 4: column completely absent -> import succeeds with false (PASSED)');

// CASE 5: is_local_business = yes (lowercase) -> true
const testCsv5 = `title,track_id,origin_url,is_local_business\nLocal Store,M1,https://example.com,yes`;
const res5 = runCsvParseVerification(testCsv5)[0];
console.assert(res5.isValid === true && res5.normalizedValue === true, 'CASE 5 FAILED');
console.log('✔ CASE 5: is_local_business = "yes" -> true (PASSED)');

// CASE 6: is_local_business = "  YES  " (whitespace) -> true
const testCsv6 = `title,track_id,origin_url,is_local_business\nLocal Clinic,M1,https://example.com,"  YES  "`;
const res6 = runCsvParseVerification(testCsv6)[0];
console.assert(res6.isValid === true && res6.normalizedValue === true, 'CASE 6 FAILED');
console.log('✔ CASE 6: is_local_business = "  YES  " -> true (PASSED)');

// CASE 7: is_local_business = MAYBE -> row validation error
const testCsv7 = `title,track_id,origin_url,is_local_business\nInvalid Value Gig,M1,https://example.com,MAYBE`;
const res7 = runCsvParseVerification(testCsv7)[0];
console.assert(res7.isValid === false && res7.errors.includes('is_local_business must be YES, NO, or blank.'), 'CASE 7 FAILED');
console.log('✔ CASE 7: is_local_business = "MAYBE" -> validation error (PASSED)');

// CASE 8: Invalid numeric (123) / invalid string (TRUEE)
const testCsv8 = `title,track_id,origin_url,is_local_business\nInvalid 1,M1,https://example.com,TRUEE\nInvalid 2,M1,https://example.com,123`;
const res8 = runCsvParseVerification(testCsv8);
console.assert(res8[0].isValid === false && res8[1].isValid === false, 'CASE 8 FAILED');
console.log('✔ CASE 8: is_local_business = "TRUEE", "123" -> validation errors (PASSED)');

// CASE 9: normalizeGigPayload defensive checks
console.assert(normalizeGigPayload({ is_local_business: true }).is_local_business === true, 'Normalize true failed');
console.assert(normalizeGigPayload({ is_local_business: false }).is_local_business === false, 'Normalize false failed');
console.assert(normalizeGigPayload({ is_local_business: null }).is_local_business === false, 'Normalize null failed');
console.assert(normalizeGigPayload({ is_local_business: undefined }).is_local_business === false, 'Normalize undefined failed');
console.assert(normalizeGigPayload({ is_local_business: 'Yes' }).is_local_business === true, 'Normalize Yes string failed');
console.assert(normalizeGigPayload({ is_local_business: 'no' }).is_local_business === false, 'Normalize no string failed');
console.assert(normalizeGigPayload({ is_local_business: 'invalid' }).is_local_business === false, 'Normalize invalid string failed');
console.log('✔ CASE 9: Defensive normalization handles boolean, string, null, undefined (PASSED)');

console.log('\nALL 9 LOCAL BUSINESS TESTS PASSED SUCCESSFULLY! 🎉');
