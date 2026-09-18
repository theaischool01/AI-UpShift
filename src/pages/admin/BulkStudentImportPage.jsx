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
  Users
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';

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

export default function BulkStudentImportPage() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const fileInputRef = useRef(null);

  const [tracks, setTracks] = useState([]);
  const [trackMap, setTrackMap] = useState(new Map());
  const [loadingTracks, setLoadingTracks] = useState(true);

  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [parseError, setParseError] = useState(null);

  const [previewRows, setPreviewRows] = useState([]);
  const [allValidatedRows, setAllValidatedRows] = useState([]);
  const [counts, setCounts] = useState({ total: 0, valid: 0, invalid: 0, duplicates: 0 });

  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState({ current: 0, total: 0, created: 0, failed: 0 });
  const [importComplete, setImportComplete] = useState(false);
  const [importFailures, setImportFailures] = useState([]);

  useEffect(() => {
    async function loadTracks() {
      try {
        let { data, error } = await supabase
          .from('tracks')
          .select('id, code, name, category')
          .order('code', { ascending: true });

        if (error) {
          const fallbackRes = await supabase
            .from('courses')
            .select('id, code, name, category')
            .order('code', { ascending: true });
          if (fallbackRes.error) throw error;
          data = fallbackRes.data;
        }

        setTracks(data || []);

        const map = new Map();
        (data || []).forEach(t => {
          map.set(t.id.toLowerCase(), t);
          map.set(t.code.toLowerCase(), t);
          map.set(t.id, t);
          map.set(t.code, t);
        });
        setTrackMap(map);
      } catch (err) {
        console.warn('[BulkStudentImport] Failed to fetch tracks:', err);
      } finally {
        setLoadingTracks(false);
      }
    }
    loadTracks();
  }, []);

  const handleDownloadTemplate = () => {
    const headers = ['full_name', 'email', 'college_email', 'college', 'password', 'track_id'];
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
    link.setAttribute('download', 'upshift_student_roster_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const processCSVFile = async (selectedFile) => {
    if (!selectedFile) return;

    if (!selectedFile.name.toLowerCase().endsWith('.csv')) {
      setParseError('Please upload a standard CSV (.csv) file.');
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setParseError('File size exceeds 5MB limit. Please upload a smaller roster.');
      return;
    }

    setFile(selectedFile);
    setParseError(null);
    setImportComplete(false);
    setImportFailures([]);

    try {
      const text = await selectedFile.text();
      const parsedMatrix = parseCSV(text);

      if (parsedMatrix.length < 2) {
        setParseError('The uploaded CSV is empty or missing a header row.');
        return;
      }

      const rawHeaders = parsedMatrix[0].map(h => h.toLowerCase().trim().replace(/[\s\-]+/g, '_'));
      const colMap = {
        fullName: rawHeaders.findIndex(h => h === 'full_name' || h === 'name' || h === 'student_name'),
        email: rawHeaders.findIndex(h => h === 'email' || h === 'account_email' || h === 'student_email'),
        collegeEmail: rawHeaders.findIndex(h => h === 'college_email' || h === 'university_email' || h === 'edu_email'),
        college: rawHeaders.findIndex(h => h === 'college' || h === 'university' || h === 'institution'),
        password: rawHeaders.findIndex(h => h === 'password' || h === 'initial_password' || h === 'passphrase'),
        track: rawHeaders.findIndex(h => h === 'track_id' || h === 'track' || h === 'course_id' || h === 'course' || h === 'module'),
      };

      const missing = [];
      if (colMap.fullName === -1) missing.push('full_name');
      if (colMap.email === -1) missing.push('email');
      if (colMap.collegeEmail === -1) missing.push('college_email');
      if (colMap.college === -1) missing.push('college');
      if (colMap.password === -1) missing.push('password');
      if (colMap.track === -1) missing.push('track_id');

      if (missing.length > 0) {
        setParseError(`Missing required CSV columns: ${missing.join(', ')}. Please use the template format.`);
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const seenEmailsInFile = new Set();
      const validatedList = [];

      let validCount = 0;
      let invalidCount = 0;
      let duplicateCount = 0;

      for (let idx = 1; idx < parsedMatrix.length; idx++) {
        const row = parsedMatrix[idx];
        if (row.length === 0 || row.every(c => c.length === 0)) continue;

        const fullName = row[colMap.fullName] || '';
        const email = (row[colMap.email] || '').toLowerCase();
        const collegeEmail = (row[colMap.collegeEmail] || '').toLowerCase();
        const college = row[colMap.college] || '';
        const password = row[colMap.password] || '';
        const rawTrack = row[colMap.track] || '';

        const rowErrors = [];

        if (!fullName) rowErrors.push('Missing Full Name');
        if (!email) {
          rowErrors.push('Missing Account Email');
        } else if (!emailRegex.test(email)) {
          rowErrors.push('Invalid Account Email syntax');
        }

        if (seenEmailsInFile.has(email)) {
          rowErrors.push('Duplicate Email within file');
          duplicateCount++;
        } else if (email) {
          seenEmailsInFile.add(email);
        }

        if (!collegeEmail) {
          rowErrors.push('Missing College Email');
        } else if (!emailRegex.test(collegeEmail)) {
          rowErrors.push('Invalid College Email syntax');
        }

        if (!college) rowErrors.push('Missing College/University');
        if (!password) {
          rowErrors.push('Missing Password');
        } else if (password.length < 8) {
          rowErrors.push('Password under 8 characters');
        }

        const matchedTrack = trackMap.get(rawTrack.toLowerCase()) || trackMap.get(rawTrack);
        if (!matchedTrack) {
          rowErrors.push(`Unrecognized Track: "${rawTrack}"`);
        }

        const isValid = rowErrors.length === 0;
        if (isValid) validCount++;
        else invalidCount++;

        validatedList.push({
          rowNumber: idx + 1,
          fullName,
          email,
          collegeEmail,
          college,
          password,
          rawTrack,
          trackId: matchedTrack?.id || rawTrack,
          trackCode: matchedTrack?.code || rawTrack,
          trackName: matchedTrack?.name || '',
          isValid,
          errors: rowErrors,
        });
      }

      setAllValidatedRows(validatedList);
      setPreviewRows(validatedList.slice(0, 100));
      setCounts({
        total: validatedList.length,
        valid: validCount,
        invalid: invalidCount,
        duplicates: duplicateCount,
      });
    } catch (err) {
      console.error('[BulkStudentImport] Parse error:', err);
      setParseError('Unable to process CSV file format.');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processCSVFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processCSVFile(e.target.files[0]);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreviewRows([]);
    setAllValidatedRows([]);
    setCounts({ total: 0, valid: 0, invalid: 0, duplicates: 0 });
    setParseError(null);
    setImportComplete(false);
    setImportFailures([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleExecuteBatchImport = async () => {
    const validRowsToCreate = allValidatedRows.filter(r => r.isValid);
    if (validRowsToCreate.length === 0 || isImporting) return;

    setIsImporting(true);
    setImportProgress({ current: 0, total: validRowsToCreate.length, created: 0, failed: 0 });

    const BATCH_SIZE = 10;
    const failureList = [];
    let createdAccumulator = 0;
    let failedAccumulator = 0;

    try {
      for (let i = 0; i < validRowsToCreate.length; i += BATCH_SIZE) {
        const chunk = validRowsToCreate.slice(i, i + BATCH_SIZE);

        const results = await Promise.allSettled(
          chunk.map(async (row) => {
            const payload = {
              learner: {
                full_name: row.fullName,
                email: row.email,
                college_email: row.collegeEmail,
                college: row.college,
                password: row.password,
                track_id: row.trackId,
              },
            };

            const { data, error } = await supabase.functions.invoke('admin-create-learner', {
              body: payload,
            });

            if (error) throw error;
            if (!data?.success) throw new Error(data?.error || 'Failed to create student record');
            return data;
          })
        );

        results.forEach((res, indexInChunk) => {
          const row = chunk[indexInChunk];
          if (res.status === 'fulfilled') {
            createdAccumulator++;
          } else {
            failedAccumulator++;
            const errReason = res.reason?.message || 'Server error';
            failureList.push({
              row: row.rowNumber,
              full_name: row.fullName,
              email: row.email,
              college: row.college,
              track_id: row.rawTrack,
              error: errReason,
            });
          }
        });

        setImportProgress({
          current: Math.min(i + BATCH_SIZE, validRowsToCreate.length),
          total: validRowsToCreate.length,
          created: createdAccumulator,
          failed: failedAccumulator,
        });
      }

      setImportFailures(failureList);
      setImportComplete(true);
    } catch (err) {
      console.error('[BulkStudentImport] Batch import execution error:', err);
    } finally {
      setIsImporting(false);
    }
  };

  const handleDownloadErrorReport = () => {
    const headers = ['row', 'full_name', 'email', 'college', 'track_id', 'error'];
    
    const allErrors = [
      ...allValidatedRows.filter(r => !r.isValid).map(r => ({
        row: r.rowNumber,
        full_name: r.fullName,
        email: r.email,
        college: r.college,
        track_id: r.rawTrack,
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
        `"${(e.track_id || '').replace(/"/g, '""')}"`,
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
    <div className="admin-page admin-page-medium">
      {/* Page Header */}
      <div className="admin-page-header">
        <div className="admin-page-title-group">
          <h1 className="admin-page-title">
            <Users size={22} />
            <span>Bulk Student CSV Import</span>
          </h1>
          <p className="admin-page-description">
            Upload a CSV file to register multiple learners and enroll them into UpShift with their assigned track.
          </p>
        </div>

        <div className="admin-page-actions">
          <button
            type="button"
            onClick={handleDownloadTemplate}
            className="admin-btn admin-btn-secondary"
            title="Download CSV format template"
          >
            <Download size={14} />
            <span>Download Template</span>
          </button>

          <Link
            to="/admin/students"
            className="admin-btn admin-btn-secondary"
          >
            <ArrowLeft size={14} />
            <span>Back to Students</span>
          </Link>
        </div>
      </div>

      {/* Parse Error Banner */}
      {parseError && (
        <div role="alert" className="admin-alert admin-alert-danger">
          <div className="admin-alert-content">
            <AlertCircle size={16} />
            <span>{parseError}</span>
          </div>
          <button
            onClick={() => setParseError(null)}
            className="admin-btn admin-btn-sm admin-btn-secondary"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Upload Dropzone */}
      {!file && (
        <div className="admin-card">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`admin-dropzone ${isDragging ? 'is-dragging' : ''}`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileInputChange}
              style={{ display: 'none' }}
            />
            <div className="admin-dropzone-icon">
              <UploadCloud size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#111827', margin: '0 0 4px 0' }}>
                Drag & Drop Student CSV Roster
              </h3>
              <p style={{ fontSize: '12.5px', color: '#6B7280', margin: 0 }}>
                or click to browse your computer (.csv up to 5MB)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* File Loaded Preview & Validation Stage */}
      {file && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* File Meta Header Card */}
          <div className="admin-card admin-card-compact" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#FEF2F2', color: '#E31B23', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={18} />
              </div>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#111827', margin: 0 }}>
                  {file.name}
                </h4>
                <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#6B7280' }}>
                  {(file.size / 1024).toFixed(1)} KB · {counts.total} total rows detected
                </span>
              </div>
            </div>

            {!isImporting && !importComplete && (
              <button
                onClick={handleReset}
                className="admin-btn admin-btn-sm admin-btn-secondary"
                title="Remove file and upload another"
              >
                <Trash2 size={13} />
                <span>Change File</span>
              </button>
            )}
          </div>

          {/* Validation Counters Grid */}
          <div className="admin-stats-grid">
            <div className="admin-stat-box">
              <span className="admin-stat-label">Total Rows</span>
              <span className="admin-stat-value">{counts.total}</span>
            </div>
            <div className="admin-stat-box">
              <span className="admin-stat-label" style={{ color: '#059669' }}>Valid to Create</span>
              <span className="admin-stat-value" style={{ color: '#059669' }}>{counts.valid}</span>
            </div>
            <div className="admin-stat-box">
              <span className="admin-stat-label" style={{ color: '#DC2626' }}>Invalid Rows</span>
              <span className="admin-stat-value" style={{ color: '#DC2626' }}>{counts.invalid}</span>
            </div>
            <div className="admin-stat-box">
              <span className="admin-stat-label" style={{ color: '#EA580C' }}>Duplicate Emails</span>
              <span className="admin-stat-value" style={{ color: '#EA580C' }}>{counts.duplicates}</span>
            </div>
          </div>

          {/* Import Progress Bar */}
          {isImporting && (
            <div className="admin-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', fontFamily: 'monospace' }}>
                <span>Importing learner records...</span>
                <span>{importProgress.current} / {importProgress.total} ({Math.round((importProgress.current / importProgress.total) * 100)}%)</span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: '#E5E7EB', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ width: `${(importProgress.current / importProgress.total) * 100}%`, height: '100%', backgroundColor: '#E31B23', transition: 'width 0.3s ease' }} />
              </div>
            </div>
          )}

          {/* Import Complete Summary Card */}
          {importComplete && (
            <div className="admin-card" style={{ backgroundColor: '#F0FDF4', borderColor: '#BBF7D0', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '16px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#DCFCE7', color: '#15803D', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#111827', margin: '0 0 4px 0' }}>
                    Batch Import Completed
                  </h3>
                  <p style={{ fontSize: '12.5px', color: '#4B5563', margin: 0, lineHeight: 1.5 }}>
                    Successfully created <strong>{importProgress.created}</strong> student accounts.
                    {importProgress.failed > 0 && ` ${importProgress.failed} accounts failed creation.`}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <Link
                  to="/admin/students"
                  className="admin-btn admin-btn-primary"
                >
                  <Users size={14} />
                  <span>View Students Directory</span>
                </Link>

                {importFailures.length > 0 && (
                  <button
                    onClick={handleDownloadErrorReport}
                    className="admin-btn admin-btn-secondary"
                  >
                    <Download size={14} />
                    <span>Download Failed Rows Report</span>
                  </button>
                )}

                <button
                  onClick={handleReset}
                  className="admin-btn admin-btn-secondary"
                >
                  <span>Import Another Roster</span>
                </button>
              </div>
            </div>
          )}

          {/* Validation Data Preview Table */}
          {!importComplete && (
            <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '14px 20px', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FAFAFA' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#111827', textTransform: 'uppercase', fontFamily: 'monospace' }}>
                  Roster Pre-Validation Preview ({Math.min(100, allValidatedRows.length)} of {allValidatedRows.length} rows)
                </span>
                {counts.invalid > 0 && (
                  <button
                    onClick={handleDownloadErrorReport}
                    className="admin-btn admin-btn-sm admin-btn-secondary"
                  >
                    <Download size={12} />
                    <span>Export Error Log</span>
                  </button>
                )}
              </div>

              <div className="admin-table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Status</th>
                      <th>Student Name</th>
                      <th>Account Email</th>
                      <th>College</th>
                      <th>Track Code</th>
                      <th>Notes / Issues</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewRows.map((r) => (
                      <tr key={r.rowNumber} style={{ backgroundColor: r.isValid ? 'transparent' : '#FEF2F2' }}>
                        <td style={{ fontFamily: 'monospace', color: '#9CA3AF' }}>{r.rowNumber}</td>
                        <td>
                          {r.isValid ? (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#047857', fontWeight: 700, fontSize: '11px', fontFamily: 'monospace' }}>
                              <CheckCircle2 size={12} /> Valid
                            </span>
                          ) : (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#B91C1C', fontWeight: 700, fontSize: '11px', fontFamily: 'monospace' }}>
                              <AlertTriangle size={12} /> Invalid
                            </span>
                          )}
                        </td>
                        <td style={{ fontWeight: 600 }}>{r.fullName || '—'}</td>
                        <td style={{ fontFamily: 'monospace' }}>{r.email}</td>
                        <td>{r.college}</td>
                        <td>
                          <span style={{ padding: '2px 5px', borderRadius: '4px', fontSize: '10.5px', fontFamily: 'monospace', fontWeight: 700, backgroundColor: '#F3F4F6' }}>
                            {r.trackCode}
                          </span>
                        </td>
                        <td>
                          {r.errors.length > 0 ? (
                            <span style={{ color: '#DC2626', fontSize: '11px', fontWeight: 500 }}>
                              {r.errors.join('; ')}
                            </span>
                          ) : (
                            <span style={{ color: '#10B981', fontSize: '11px' }}>Ready</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Action Bar */}
              <div style={{ padding: '16px 20px', borderTop: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FAFAFA' }}>
                <span style={{ fontSize: '12.5px', color: '#6B7280' }}>
                  {counts.valid} valid accounts ready for batch creation.
                </span>

                <button
                  type="button"
                  onClick={handleExecuteBatchImport}
                  disabled={counts.valid === 0 || isImporting}
                  className="admin-btn admin-btn-primary"
                >
                  {isImporting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Importing batch...</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud size={14} />
                      <span>Create {counts.valid} Student Accounts</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
