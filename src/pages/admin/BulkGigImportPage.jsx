import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  UploadCloud, 
  FileText, 
  Download, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ArrowLeft, 
  AlertTriangle,
  Briefcase,
  RefreshCw,
  Globe
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

// Robust CSV parser handling quotes, commas within quotes, CRLF/LF
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

function isValidHttpUrl(str) {
  try {
    const parsed = new URL(str);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export default function BulkGigImportPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Curriculum courses from database
  const [courses, setCourses] = useState([]);
  const [courseMap, setCourseMap] = useState(new Map());
  const [loadingCourses, setLoadingCourses] = useState(true);

  // File state
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [parseError, setParseError] = useState(null);

  // Parsed rows
  const [previewRows, setPreviewRows] = useState([]);
  const [allValidatedRows, setAllValidatedRows] = useState([]);
  const [counts, setCounts] = useState({ total: 0, valid: 0, invalid: 0, duplicates: 0 });

  // Import state
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState({ current: 0, total: 0, inserted: 0, updated: 0, failed: 0 });
  const [importComplete, setImportComplete] = useState(false);
  const [importFailures, setImportFailures] = useState([]);

  // Load courses
  useEffect(() => {
    async function loadCourses() {
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('id, code, name, category')
          .order('code', { ascending: true });

        if (error) throw error;
        setCourses(data || []);

        const map = new Map();
        (data || []).forEach(c => {
          map.set(c.id.toLowerCase(), c);
          map.set(c.code.toLowerCase(), c);
          map.set(c.id, c);
        });
        setCourseMap(map);
      } catch (err) {
        console.warn('[BulkGigImport] Failed to fetch courses:', err);
      } finally {
        setLoadingCourses(false);
      }
    }
    loadCourses();
  }, []);

  // 4E.1 Download CSV Template
  const handleDownloadTemplate = () => {
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

    const sampleRows = [
      [
        'UP-TEST-M1-001',
        'AI Short-Form Video Editor',
        'reelrush-ai',
        '$25/hr',
        'Create short-form AI video content',
        'We are seeking an expert short-form video producer familiar with automated AI video pipelines to generate commercial reels. Deliverables include final 4K renders, voiceover sync, and hook testing.',
        'Contra',
        'https://example.com',
        'Example Studio',
        'Remote',
        'Freelance'
      ],
      [
        'UP-TEST-M6-001',
        'Full-Stack AI Agent Handler & Workflow Integrator',
        'agenthandlers',
        '$500/project',
        'Deploy custom multi-agent orchestrations for client customer support automation.',
        'Client requires an experienced AI builder to construct autonomous AgentHandler workflows utilizing modern LLM tool calling, persistent memory, and API integrations.',
        'Contra',
        'https://contra.com/opportunity/8419-ai-agent-architect',
        'Nexus AI Labs',
        'Remote (Worldwide)',
        'Freelance'
      ]
    ];

    const csvContent = [
      headers.join(','),
      ...sampleRows.map(r => r.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'gigs_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Process CSV content
  const processCSVContent = (content) => {
    setParseError(null);
    setImportComplete(false);
    setImportFailures([]);

    const parsedLines = parseCSV(content);
    if (parsedLines.length === 0) {
      setParseError('The uploaded CSV file is empty.');
      return;
    }

    const rawHeaders = parsedLines[0].map(h => h.trim().toLowerCase());

    const required = [
      'external_gig_id',
      'title',
      'course_id',
      'payment_amount',
      'short_description',
      'long_description',
      'origin_site',
      'origin_url'
    ];

    const missing = required.filter(r => !rawHeaders.includes(r));
    if (missing.length > 0) {
      setParseError(`Missing required columns: ${missing.join(', ')}. Please use the template.`);
      return;
    }

    const dataLines = parsedLines.slice(1);
    if (dataLines.length === 0) {
      setParseError('CSV contains headers but no gig data rows.');
      return;
    }

    const colIdx = {
      external_gig_id: rawHeaders.indexOf('external_gig_id'),
      title: rawHeaders.indexOf('title'),
      course_id: rawHeaders.indexOf('course_id'),
      payment_amount: rawHeaders.indexOf('payment_amount'),
      short_description: rawHeaders.indexOf('short_description'),
      long_description: rawHeaders.indexOf('long_description'),
      origin_site: rawHeaders.indexOf('origin_site'),
      origin_url: rawHeaders.indexOf('origin_url'),
      organization: rawHeaders.indexOf('organization'),
      location: rawHeaders.indexOf('location'),
      engagement_type: rawHeaders.indexOf('engagement_type'),
    };

    const seenExternalIds = new Set();
    const validated = [];
    let validCount = 0;
    let invalidCount = 0;
    let duplicateCount = 0;

    dataLines.forEach((line, index) => {
      const rowNumber = index + 2;
      const externalGigId = (line[colIdx.external_gig_id] || '').trim();
      const title = (line[colIdx.title] || '').trim();
      const rawCourse = (line[colIdx.course_id] || '').trim();
      const paymentAmount = colIdx.payment_amount !== -1 ? (line[colIdx.payment_amount] || '').trim() : '';
      const shortDesc = (line[colIdx.short_description] || '').trim();
      const longDesc = (line[colIdx.long_description] || '').trim();
      const originSite = (line[colIdx.origin_site] || '').trim();
      const originUrl = (line[colIdx.origin_url] || '').trim();
      const organization = colIdx.organization !== -1 ? (line[colIdx.organization] || '').trim() : '';
      const location = colIdx.location !== -1 ? (line[colIdx.location] || '').trim() : 'Remote';
      const engagementType = colIdx.engagement_type !== -1 ? (line[colIdx.engagement_type] || '').trim() : 'Contract';

      const errors = [];

      if (!externalGigId) errors.push('Missing external_gig_id');
      if (!title) errors.push('Missing title');
      if (!paymentAmount) {
        errors.push('Payment amount is required');
      } else if (paymentAmount.length > 80) {
        errors.push('Payment amount cannot exceed 80 characters');
      }
      if (!shortDesc) errors.push('Missing short_description');
      if (!longDesc) errors.push('Missing long_description');
      if (!originSite) errors.push('Missing origin_site');

      if (!originUrl) {
        errors.push('Missing origin_url');
      } else if (!isValidHttpUrl(originUrl)) {
        errors.push('Invalid URL (must start with http:// or https://)');
      }

      // Course track resolution
      let matchedCourse = null;
      if (!rawCourse) {
        errors.push('Missing course_id');
      } else {
        matchedCourse = courseMap.get(rawCourse.toLowerCase()) || courseMap.get(rawCourse);
        if (!matchedCourse) {
          errors.push(`Invalid course_id: "${rawCourse}"`);
        }
      }

      // Duplicate external_gig_id inside the file
      let isDuplicate = false;
      if (externalGigId && seenExternalIds.has(externalGigId)) {
        errors.push('Duplicate external_gig_id in import file');
        isDuplicate = true;
        duplicateCount++;
      } else if (externalGigId) {
        seenExternalIds.add(externalGigId);
      }

      const isValid = errors.length === 0;
      if (isValid) {
        validCount++;
      } else if (!isDuplicate) {
        invalidCount++;
      }

      validated.push({
        rowNumber,
        externalGigId,
        title,
        matchedCourse,
        rawCourse,
        paymentAmount,
        shortDesc,
        longDesc,
        originSite,
        originUrl,
        organization,
        location,
        engagementType,
        isValid,
        errors,
      });
    });

    setCounts({
      total: dataLines.length,
      valid: validCount,
      invalid: invalidCount,
      duplicates: duplicateCount,
    });

    setAllValidatedRows(validated);
    setPreviewRows(validated.slice(0, 100)); // Memory-safe bounded preview
  };

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.csv') && selectedFile.type !== 'text/csv') {
      setParseError('Please upload a CSV file.');
      setFile(null);
      return;
    }

    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      processCSVContent(content);
    };
    reader.onerror = () => {
      setParseError('Failed to read file from disk.');
    };
    reader.readAsText(selectedFile);
  };

  const handleClearFile = () => {
    setFile(null);
    setParseError(null);
    setPreviewRows([]);
    setAllValidatedRows([]);
    setCounts({ total: 0, valid: 0, invalid: 0, duplicates: 0 });
    setImportComplete(false);
    setImportFailures([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  // 4E.6 - 4E.8 Bulk UPSERT in batches of 100
  const handleExecuteImport = async () => {
    if (isImporting || counts.valid === 0) return;

    const validRows = allValidatedRows.filter(r => r.isValid);
    if (validRows.length === 0) return;

    setIsImporting(true);
    setImportComplete(false);
    setImportFailures([]);

    const BATCH_SIZE = 100;
    let insertedAccumulator = 0;
    let updatedAccumulator = 0;
    let failedAccumulator = 0;
    const failureList = [];

    setImportProgress({
      current: 0,
      total: validRows.length,
      inserted: 0,
      updated: 0,
      failed: 0,
    });

    try {
      for (let i = 0; i < validRows.length; i += BATCH_SIZE) {
        const chunk = validRows.slice(i, i + BATCH_SIZE);
        const externalIds = chunk.map(r => r.externalGigId);

        // Pre-check which IDs already exist in database to differentiate Insert vs Update
        let existingIdSet = new Set();
        try {
          const { data: existingGigs } = await supabase
            .from('gigs')
            .select('external_gig_id')
            .in('external_gig_id', externalIds);
          
          if (existingGigs) {
            existingGigs.forEach(g => existingIdSet.add(g.external_gig_id));
          }
        } catch {
          // If check fails, we still proceed with upsert
        }

        const batchPayload = chunk.map(r => ({
          external_gig_id: r.externalGigId,
          title: r.title,
          course_id: r.matchedCourse ? r.matchedCourse.id : r.rawCourse,
          payment_amount: r.paymentAmount,
          short_description: r.shortDesc,
          long_description: r.longDesc,
          origin_site: r.originSite,
          origin_url: r.originUrl,
          organization: r.organization || null,
          location: r.location || 'Remote',
          engagement_type: r.engagementType || 'Contract',
        }));

        // PostgREST Upsert on external_gig_id
        let { data: upsertData, error: upsertError } = await supabase
          .from('gigs')
          .upsert(batchPayload, { onConflict: 'external_gig_id' })
          .select('id, external_gig_id');

        // If payment_amount column is unavailable, STOP and report clear actionable error (NO SILENT DATA REMOVAL)
        if (upsertError && (upsertError.code === 'PGRST204' || upsertError.code === '42703' || upsertError.message?.toLowerCase().includes('payment_amount'))) {
          const schemaErrorMsg = 'Payment field is not available in the database. Apply the latest database migration before importing gigs.';
          chunk.forEach(r => {
            failureList.push({
              row: r.rowNumber,
              external_gig_id: r.externalGigId,
              title: r.title,
              course_id: r.rawCourse,
              payment_amount: r.paymentAmount,
              origin_site: r.originSite,
              error: schemaErrorMsg,
            });
          });
          failedAccumulator += chunk.length;
          break; // Stop importing remaining chunks immediately
        }

        if (upsertError) {
          chunk.forEach(r => {
            failureList.push({
              row: r.rowNumber,
              external_gig_id: r.externalGigId,
              title: r.title,
              course_id: r.rawCourse,
              payment_amount: r.paymentAmount,
              origin_site: r.originSite,
              error: upsertError.message || 'Database upsert failed',
            });
          });
          failedAccumulator += chunk.length;
        } else {
          // Count inserts vs updates
          let chunkInserted = 0;
          let chunkUpdated = 0;
          chunk.forEach(r => {
            if (existingIdSet.has(r.externalGigId)) {
              chunkUpdated++;
            } else {
              chunkInserted++;
            }
          });
          insertedAccumulator += chunkInserted;
          updatedAccumulator += chunkUpdated;
        }

        setImportProgress({
          current: Math.min(i + BATCH_SIZE, validRows.length),
          total: validRows.length,
          inserted: insertedAccumulator,
          updated: updatedAccumulator,
          failed: failedAccumulator,
        });
      }
    } catch (err) {
      console.error('[BulkGigImport] Batch upsert exception:', err);
    } finally {
      setIsImporting(false);
      setImportComplete(true);
      setImportFailures(failureList);
    }
  };

  // 4E.9 Download Error Report
  const handleDownloadErrorReport = () => {
    const headers = ['row', 'external_gig_id', 'title', 'course_id', 'payment_amount', 'origin_site', 'error'];

    const allErrors = [
      ...allValidatedRows.filter(r => !r.isValid).map(r => ({
        row: r.rowNumber,
        external_gig_id: r.externalGigId,
        title: r.title,
        course_id: r.rawCourse,
        payment_amount: r.paymentAmount,
        origin_site: r.originSite,
        error: r.errors.join('; '),
      })),
      ...importFailures
    ];

    const csvRows = [
      headers.join(','),
      ...allErrors.map(e => [
        e.row,
        `"${(e.external_gig_id || '').replace(/"/g, '""')}"`,
        `"${(e.title || '').replace(/"/g, '""')}"`,
        `"${(e.course_id || '').replace(/"/g, '""')}"`,
        `"${(e.payment_amount || '').replace(/"/g, '""')}"`,
        `"${(e.origin_site || '').replace(/"/g, '""')}"`,
        `"${(e.error || '').replace(/"/g, '""')}"`,
      ].join(','))
    ];

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'gig_import_errors.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="admin-page space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
        <Link to="/admin/gigs" className="hover:text-gray-900 transition-colors">Gigs</Link>
        <span>/</span>
        <span className="text-gray-900 font-semibold">Bulk Import</span>
      </div>

      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-[#E31B23]" />
            Bulk Gig CSV Import
          </h1>
          <p>
            Upload and upsert external opportunities. Existing external IDs will be updated; new IDs will be inserted.
          </p>
        </div>

        <div className="admin-page-actions">
          <button
            type="button"
            onClick={handleDownloadTemplate}
            className="admin-btn-secondary"
            title="Download CSV format template"
          >
            <Download className="w-4 h-4 text-gray-600" />
            <span>Download CSV Template</span>
          </button>

          <Link
            to="/admin/gigs"
            className="admin-btn-secondary"
          >
            <ArrowLeft className="w-4 h-4 text-gray-600" />
            <span>Back to Gigs</span>
          </Link>
        </div>
      </div>

      {/* Upload Zone */}
      <div className="admin-card p-6">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
            isDragging 
              ? 'border-[#E31B23] bg-red-50/40' 
              : file 
              ? 'border-emerald-300 bg-emerald-50/20' 
              : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={(e) => handleFileSelect(e.target.files[0])}
            className="hidden"
            id="gig-csv-file-input"
          />

          {!file ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-[#E31B23]">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  <label 
                    htmlFor="gig-csv-file-input" 
                    className="text-[#E31B23] hover:underline cursor-pointer"
                  >
                    Click to choose file
                  </label>{' '}
                  or drag and drop
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Supported format: standard comma-separated .CSV (batches of 100 records)
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024).toFixed(1)} KB &bull; {counts.total} rows detected
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <label
                  htmlFor="gig-csv-file-input"
                  className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
                >
                  Change File
                </label>
                <button
                  type="button"
                  onClick={handleClearFile}
                  disabled={isImporting}
                  className="p-1.5 text-gray-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"
                  title="Remove file"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {parseError && (
          <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-800">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <p className="font-semibold text-sm text-red-900">CSV Validation Error</p>
              <p>{parseError}</p>
            </div>
          </div>
        )}
      </div>

      {/* Validation Summary & Execution */}
      {file && !parseError && (
        <div className="space-y-6">
          {/* Summary Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Rows</span>
              <p className="text-2xl font-bold text-gray-900 mt-1">{counts.total}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <span className="text-xs font-medium text-emerald-600 uppercase tracking-wider">Valid Rows</span>
              <p className="text-2xl font-bold text-emerald-600 mt-1">{counts.valid}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <span className="text-xs font-medium text-amber-600 uppercase tracking-wider">Invalid Rows</span>
              <p className="text-2xl font-bold text-amber-600 mt-1">{counts.invalid}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <span className="text-xs font-medium text-red-600 uppercase tracking-wider">Duplicate IDs in File</span>
              <p className="text-2xl font-bold text-red-600 mt-1">{counts.duplicates}</p>
            </div>
          </div>

          {/* Import Progress Banner */}
          {isImporting && (
            <div className="admin-card p-6 border-[#E31B23]/30 bg-red-50/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 text-[#E31B23] animate-spin" />
                  <span className="text-sm font-semibold text-gray-900">
                    Importing gigs... {importProgress.current} / {importProgress.total}
                  </span>
                </div>
                <span className="text-xs font-mono font-medium text-gray-600">
                  {Math.round((importProgress.current / (importProgress.total || 1)) * 100)}%
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-[#E31B23] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(importProgress.current / (importProgress.total || 1)) * 100}%` }}
                />
              </div>

              <div className="flex items-center gap-6 mt-3 text-xs text-gray-600">
                <span>Inserted: <strong className="text-emerald-600">{importProgress.inserted}</strong></span>
                <span>Updated: <strong className="text-blue-600">{importProgress.updated}</strong></span>
                <span>Failed: <strong className="text-red-600">{importProgress.failed}</strong></span>
                <span>Remaining: <strong className="text-gray-900">{importProgress.total - importProgress.current}</strong></span>
              </div>
            </div>
          )}

          {/* Import Complete Banner */}
          {importComplete && (
            <div className="admin-card p-6 border-emerald-200 bg-emerald-50/20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-base font-bold text-gray-900">Import Complete</h3>
                    <p className="text-xs text-gray-600 mt-1">
                      Inserted: <strong className="text-emerald-700">{importProgress.inserted}</strong> &bull; Updated: <strong className="text-blue-700">{importProgress.updated}</strong> &bull; Failed: <strong className="text-red-700">{importProgress.failed + counts.invalid + counts.duplicates}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {(importProgress.failed > 0 || counts.invalid > 0 || counts.duplicates > 0) && (
                    <button
                      type="button"
                      onClick={handleDownloadErrorReport}
                      className="px-3.5 py-2 text-xs font-semibold text-red-700 bg-red-100 hover:bg-red-200 rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <Download className="w-4 h-4" />
                      Download Error Report
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleClearFile}
                    className="admin-btn-secondary"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Import Another File
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate('/admin/gigs')}
                    className="px-4 py-2 text-xs font-semibold text-white bg-[#111827] hover:bg-black rounded-lg transition-colors"
                  >
                    View Gigs Board
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Execution Bar */}
          {!importComplete && (
            <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl">
              <div className="text-xs text-gray-500">
                {counts.valid > 0 ? (
                  <span>Ready to upsert <strong>{counts.valid}</strong> opportunity records in batches of 100.</span>
                ) : (
                  <span className="text-amber-600">No valid records found to import. Please resolve the errors below.</span>
                )}
              </div>

              <div className="flex items-center gap-3">
                {(counts.invalid > 0 || counts.duplicates > 0) && (
                  <button
                    type="button"
                    onClick={handleDownloadErrorReport}
                    className="admin-btn-secondary text-red-700 hover:bg-red-50"
                  >
                    <Download className="w-4 h-4 text-red-600" />
                    Export Validation Errors
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleExecuteImport}
                  disabled={isImporting || counts.valid === 0}
                  className="admin-btn-primary"
                >
                  {isImporting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Upserting Gigs...</span>
                    </>
                  ) : (
                    <>
                      <Briefcase className="w-4 h-4" />
                      <span>Upsert {counts.valid} Gigs</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Preview Table */}
          <div className="admin-card overflow-hidden p-0">
            <div className="p-4 border-b border-gray-200 bg-gray-50/70 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Validation Preview</h3>
                <p className="text-xs text-gray-500">
                  Showing {Math.min(previewRows.length, 100)} of {counts.total} rows.
                </p>
              </div>
              <span className="text-xs font-mono text-gray-400 bg-white px-2 py-1 border border-gray-200 rounded">
                Memory-Safe Window
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-600">
                <thead className="bg-gray-50 border-b border-gray-200 font-semibold text-gray-700">
                  <tr>
                    <th className="py-3 px-4 w-16">Row</th>
                    <th className="py-3 px-4">Gig ID</th>
                    <th className="py-3 px-4">Title</th>
                    <th className="py-3 px-4">Course</th>
                    <th className="py-3 px-4">Payment</th>
                    <th className="py-3 px-4">Origin Site</th>
                    <th className="py-3 px-4">Validation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {previewRows.map((row) => (
                    <tr 
                      key={row.rowNumber} 
                      className={`hover:bg-gray-50/60 transition-colors ${!row.isValid ? 'bg-amber-50/30' : ''}`}
                    >
                      <td className="py-3 px-4 font-mono text-gray-400">#{row.rowNumber}</td>
                      <td className="py-3 px-4 font-mono text-gray-900 font-medium">{row.externalGigId || '—'}</td>
                      <td className="py-3 px-4 font-medium text-gray-900 max-w-xs truncate" title={row.title}>
                        {row.title || '—'}
                      </td>
                      <td className="py-3 px-4">
                        {row.matchedCourse ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 text-gray-800">
                            {row.matchedCourse.code} &bull; {row.matchedCourse.name}
                          </span>
                        ) : (
                          <span className="font-mono text-amber-700">{row.rawCourse || '—'}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-semibold text-gray-900 whitespace-nowrap">
                        {row.paymentAmount || '—'}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 text-[11px] text-gray-700">
                          <Globe className="w-3 h-3 text-gray-400" />
                          {row.originSite || '—'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {row.isValid ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            VALID
                          </span>
                        ) : (
                          <div className="flex flex-col gap-0.5">
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 w-fit">
                              <AlertTriangle className="w-3 h-3" />
                              INVALID
                            </span>
                            <span className="text-[10px] text-amber-800 font-medium">
                              {row.errors.join(', ')}
                            </span>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
