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
  Users,
  RefreshCw
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';

// Native robust CSV parser handling quotes, escaped quotes, commas inside quotes, CRLF/LF
function parseCSV(text) {
  const lines = [];
  let currentField = '';
  let currentLine = [];
  let inQuotes = false;
  
  // Clean potential BOM
  const cleanText = text.charCodeAt(0) === 0xFEFF ? text.slice(1) : text;

  for (let i = 0; i < cleanText.length; i++) {
    const char = cleanText[i];
    const nextChar = cleanText[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote: "" -> "
        currentField += '"';
        i++;
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      currentLine.push(currentField.trim());
      currentField = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++; // Skip LF in CRLF
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

  // Push remaining field & line if any
  if (currentField.length > 0 || currentLine.length > 0) {
    currentLine.push(currentField.trim());
    if (currentLine.some(f => f.length > 0)) {
      lines.push(currentLine);
    }
  }

  return lines;
}

export default function BulkStudentImportPage() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const fileInputRef = useRef(null);

  // Curriculum courses from database
  const [courses, setCourses] = useState([]);
  const [courseMap, setCourseMap] = useState(new Map());
  const [loadingCourses, setLoadingCourses] = useState(true);

  // File state
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [parseError, setParseError] = useState(null);

  // Parsed data state
  const [headers, setHeaders] = useState([]);
  const [previewRows, setPreviewRows] = useState([]); // Up to first 100 for DOM safety
  const [allValidatedRows, setAllValidatedRows] = useState([]); // Full validated list for batching
  const [counts, setCounts] = useState({ total: 0, valid: 0, invalid: 0, duplicates: 0 });

  // Import execution state
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState({ current: 0, total: 0, created: 0, failed: 0 });
  const [importComplete, setImportComplete] = useState(false);
  const [importFailures, setImportFailures] = useState([]);

  // Load courses for dynamic code/id resolution
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
        console.warn('[BulkStudentImport] Failed to fetch courses:', err);
      } finally {
        setLoadingCourses(false);
      }
    }
    loadCourses();
  }, []);

  // 4C.1 Download CSV Template
  const handleDownloadTemplate = () => {
    const headers = ['full_name', 'email', 'college_email', 'college', 'password', 'course_id'];
    const sampleRows = [
      ['Aarav Sharma', 'aarav.sharma@example.com', 'aarav@iitd.ac.in', 'IIT Delhi', 'Passphrase2026!', 'M1'],
      ['Diya Patel', 'diya.patel@example.com', 'diya@nitw.ac.in', 'NIT Warangal', 'SecurePass2026#', 'M2'],
      ['Rohan Gupta', 'rohan.gupta@example.com', 'rohan@bits.ac.in', 'BITS Pilani', 'VibeCoder99!', 'M4']
    ];

    const csvContent = [
      headers.join(','),
      ...sampleRows.map(r => r.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'students_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Process and validate CSV
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
    setHeaders(rawHeaders);

    // Required headers validation
    const required = ['full_name', 'email', 'college_email', 'college', 'password', 'course_id'];
    const missing = required.filter(r => !rawHeaders.includes(r));

    if (missing.length > 0) {
      setParseError(`Missing required CSV columns: ${missing.join(', ')}. Please use the provided template.`);
      return;
    }

    const dataLines = parsedLines.slice(1);
    if (dataLines.length === 0) {
      setParseError('CSV contains headers but no student data rows.');
      return;
    }

    // Map column indices
    const colIdx = {
      full_name: rawHeaders.indexOf('full_name'),
      email: rawHeaders.indexOf('email'),
      college_email: rawHeaders.indexOf('college_email'),
      college: rawHeaders.indexOf('college'),
      password: rawHeaders.indexOf('password'),
      course_id: rawHeaders.indexOf('course_id'),
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const seenEmails = new Set();
    const validated = [];
    let validCount = 0;
    let invalidCount = 0;
    let duplicateCount = 0;

    dataLines.forEach((line, index) => {
      const rowNumber = index + 2; // +1 for 0-index, +1 for header row
      const fullName = (line[colIdx.full_name] || '').trim();
      const email = (line[colIdx.email] || '').trim().toLowerCase();
      const collegeEmail = (line[colIdx.college_email] || '').trim().toLowerCase();
      const college = (line[colIdx.college] || '').trim();
      const password = (line[colIdx.password] || '');
      const rawCourse = (line[colIdx.course_id] || '').trim();

      const errors = [];

      if (!fullName) errors.push('Missing full_name');
      if (!email) {
        errors.push('Missing email');
      } else if (!emailRegex.test(email)) {
        errors.push('Invalid email format');
      }

      if (!collegeEmail) {
        errors.push('Missing college_email');
      } else if (!emailRegex.test(collegeEmail)) {
        errors.push('Invalid college_email format');
      }

      if (!college) errors.push('Missing college');

      if (!password) {
        errors.push('Missing password');
      } else if (password.length < 8) {
        errors.push('Password must be at least 8 characters');
      }

      // Course validation against active database curriculum
      let matchedCourse = null;
      if (!rawCourse) {
        errors.push('Missing course_id');
      } else {
        matchedCourse = courseMap.get(rawCourse.toLowerCase()) || courseMap.get(rawCourse);
        if (!matchedCourse) {
          errors.push(`Invalid course_id: "${rawCourse}"`);
        }
      }

      // In-file duplicate email check
      let isDuplicate = false;
      if (email && seenEmails.has(email)) {
        errors.push('Duplicate email in import file');
        isDuplicate = true;
        duplicateCount++;
      } else if (email) {
        seenEmails.add(email);
      }

      const isValid = errors.length === 0;
      if (isValid) {
        validCount++;
      } else if (!isDuplicate) {
        invalidCount++;
      }

      validated.push({
        rowNumber,
        fullName,
        email,
        collegeEmail,
        college,
        password, // Handled internally only, never rendered
        rawCourse,
        matchedCourse,
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
    // Bounded preview to keep DOM light
    setPreviewRows(validated.slice(0, 100));
  };

  // Handle file select
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

  // Drag and drop handlers
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

  // 4C.11 - 4C.16 Secure Batch Creation Execution
  const handleExecuteImport = async () => {
    if (isImporting || counts.valid === 0) return;

    const validRowsToCreate = allValidatedRows.filter(r => r.isValid);
    if (validRowsToCreate.length === 0) return;

    setIsImporting(true);
    setImportComplete(false);
    setImportFailures([]);

    const BATCH_SIZE = 25; // 25-50 recommended controlled batch size
    let createdAccumulator = 0;
    let failedAccumulator = 0;
    const failureList = [];

    setImportProgress({
      current: 0,
      total: validRowsToCreate.length,
      created: 0,
      failed: 0,
    });

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const token = session?.access_token;

    try {
      for (let i = 0; i < validRowsToCreate.length; i += BATCH_SIZE) {
        const chunk = validRowsToCreate.slice(i, i + BATCH_SIZE);
        
        const payload = {
          learners: chunk.map(r => ({
            full_name: r.fullName,
            email: r.email,
            college_email: r.collegeEmail,
            college: r.college,
            password: r.password,
            course_id: r.matchedCourse ? r.matchedCourse.id : r.rawCourse,
          }))
        };

        // Call Edge Function
        let responseJson = null;
        try {
          const { data, error } = await supabase.functions.invoke('admin-create-learner', {
            body: payload,
          });

          if (error) {
            // Direct HTTP fetch fallback
            if (token && supabaseUrl) {
              const res = await fetch(`${supabaseUrl}/functions/v1/admin-create-learner`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
              });
              responseJson = await res.json();
            } else {
              throw new Error(error.message || 'Edge function error');
            }
          } else {
            responseJson = data;
          }
        } catch (fetchErr) {
          // If the entire batch failed network-wise
          chunk.forEach((row, idx) => {
            failureList.push({
              row: row.rowNumber,
              full_name: row.fullName,
              email: row.email,
              college: row.college,
              course_id: row.rawCourse,
              error: fetchErr.message || 'Network request failed',
            });
          });
          failedAccumulator += chunk.length;
          setImportProgress(prev => ({
            ...prev,
            current: Math.min(i + BATCH_SIZE, validRowsToCreate.length),
            failed: failedAccumulator,
          }));
          continue;
        }

        if (responseJson && responseJson.success) {
          const createdCount = responseJson.createdCount || 0;
          const failedCount = responseJson.failedCount || 0;
          
          createdAccumulator += createdCount;
          failedAccumulator += failedCount;

          if (Array.isArray(responseJson.failed)) {
            responseJson.failed.forEach(f => {
              const matchedRow = chunk[f.row - 1] || {};
              failureList.push({
                row: matchedRow.rowNumber || f.row,
                full_name: f.full_name || matchedRow.fullName || '',
                email: f.email || matchedRow.email || '',
                college: f.college || matchedRow.college || '',
                course_id: f.course_id || matchedRow.rawCourse || '',
                error: f.error || 'Creation failed',
              });
            });
          }
        } else {
          // Server returned error object
          const errText = responseJson?.error || 'Server rejected batch';
          chunk.forEach(row => {
            failureList.push({
              row: row.rowNumber,
              full_name: row.fullName,
              email: row.email,
              college: row.college,
              course_id: row.rawCourse,
              error: errText,
            });
          });
          failedAccumulator += chunk.length;
        }

        setImportProgress({
          current: Math.min(i + BATCH_SIZE, validRowsToCreate.length),
          total: validRowsToCreate.length,
          created: createdAccumulator,
          failed: failedAccumulator,
        });
      }
    } catch (unexpectedErr) {
      console.error('[BulkStudentImport] Batch import caught error:', unexpectedErr);
    } finally {
      setIsImporting(false);
      setImportComplete(true);
      setImportFailures(failureList);
    }
  };

  // 4C.18 Download Error Report (Strictly NO password column)
  const handleDownloadErrorReport = () => {
    const headers = ['row', 'full_name', 'email', 'college', 'course_id', 'error'];
    
    // Include both in-file validation failures and runtime batch failures
    const allErrors = [
      ...allValidatedRows.filter(r => !r.isValid).map(r => ({
        row: r.rowNumber,
        full_name: r.fullName,
        email: r.email,
        college: r.college,
        course_id: r.rawCourse,
        error: r.errors.join('; '),
      })),
      ...importFailures
    ];

    const csvRows = [
      headers.join(','),
      ...allErrors.map(e => [
        e.row,
        `"${(e.full_name || '').replace(/"/g, '""')}"`,
        `"${(e.email || '').replace(/"/g, '""')}"`,
        `"${(e.college || '').replace(/"/g, '""')}"`,
        `"${(e.course_id || '').replace(/"/g, '""')}"`,
        `"${(e.error || '').replace(/"/g, '""')}"`,
      ].join(','))
    ];

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'student_import_errors.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="admin-page space-y-6">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
        <Link to="/admin/students" className="hover:text-gray-900 transition-colors">Students</Link>
        <span>/</span>
        <span className="text-gray-900 font-semibold">Bulk Import</span>
      </div>

      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="flex items-center gap-2">
            <Users className="w-6 h-6 text-[#E31B23]" />
            Bulk Student CSV Import
          </h1>
          <p>
            Upload a CSV file to register multiple learners and enroll them into their flagship curriculum tracks.
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
            to="/admin/students"
            className="admin-btn-secondary"
          >
            <ArrowLeft className="w-4 h-4 text-gray-600" />
            <span>Back to Students</span>
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
            id="student-csv-file-input"
          />

          {!file ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-[#E31B23]">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  <label 
                    htmlFor="student-csv-file-input" 
                    className="text-[#E31B23] hover:underline cursor-pointer"
                  >
                    Click to choose file
                  </label>{' '}
                  or drag and drop
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Supported format: standard comma-separated .CSV (up to 5,000 learners per file)
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
                  htmlFor="student-csv-file-input"
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

        {/* Parsing / Validation Error Banner */}
        {parseError && (
          <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-800">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <p className="font-semibold text-sm text-red-900">Import File Rejected</p>
              <p>{parseError}</p>
            </div>
          </div>
        )}
      </div>

      {/* Validation Summary & Execution Area */}
      {file && !parseError && (
        <div className="space-y-6">
          {/* 4C.10 Import Summary Badges */}
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
              <span className="text-xs font-medium text-red-600 uppercase tracking-wider">Duplicates in CSV</span>
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
                    Creating learners... {importProgress.current} / {importProgress.total}
                  </span>
                </div>
                <span className="text-xs font-mono font-medium text-gray-600">
                  {Math.round((importProgress.current / (importProgress.total || 1)) * 100)}%
                </span>
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-[#E31B23] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(importProgress.current / (importProgress.total || 1)) * 100}%` }}
                />
              </div>

              <div className="flex items-center gap-6 mt-3 text-xs text-gray-600">
                <span>Created: <strong className="text-emerald-600">{importProgress.created}</strong></span>
                <span>Failed: <strong className="text-red-600">{importProgress.failed}</strong></span>
                <span>Remaining: <strong className="text-gray-900">{importProgress.total - importProgress.current}</strong></span>
              </div>
            </div>
          )}

          {/* 4C.19 Import Complete Summary */}
          {importComplete && (
            <div className="admin-card p-6 border-emerald-200 bg-emerald-50/20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-base font-bold text-gray-900">Import Complete</h3>
                    <p className="text-xs text-gray-600 mt-1">
                      Successfully processed import batch. Created: <strong className="text-emerald-700">{importProgress.created}</strong> &bull; Failed: <strong className="text-red-700">{importProgress.failed + counts.invalid + counts.duplicates}</strong>
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
                    onClick={() => navigate('/admin/students')}
                    className="px-4 py-2 text-xs font-semibold text-white bg-[#111827] hover:bg-black rounded-lg transition-colors"
                  >
                    View Students Directory
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Action Bar */}
          {!importComplete && (
            <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl">
              <div className="text-xs text-gray-500">
                {counts.valid > 0 ? (
                  <span>Ready to create <strong>{counts.valid}</strong> validated student account(s).</span>
                ) : (
                  <span className="text-amber-600">No valid student rows found to import. Please resolve the errors below.</span>
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
                      <span>Creating Learners...</span>
                    </>
                  ) : (
                    <>
                      <Users className="w-4 h-4" />
                      <span>Create {counts.valid} Learners</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* 4C.9 Preview Table */}
          <div className="admin-card overflow-hidden p-0">
            <div className="p-4 border-b border-gray-200 bg-gray-50/70 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Validation Preview</h3>
                <p className="text-xs text-gray-500">
                  Showing {Math.min(previewRows.length, 100)} of {counts.total} rows. Passwords are never displayed.
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
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">College</th>
                    <th className="py-3 px-4">Course</th>
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
                      <td className="py-3 px-4 font-medium text-gray-900">{row.fullName || '—'}</td>
                      <td className="py-3 px-4 font-mono text-gray-600">{row.email || '—'}</td>
                      <td className="py-3 px-4 text-gray-600 truncate max-w-[180px]">{row.college || '—'}</td>
                      <td className="py-3 px-4">
                        {row.matchedCourse ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 text-gray-800">
                            {row.matchedCourse.code} &bull; {row.matchedCourse.name}
                          </span>
                        ) : (
                          <span className="font-mono text-amber-700">{row.rawCourse || '—'}</span>
                        )}
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
