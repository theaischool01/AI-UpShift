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
  Briefcase
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { fetchTracks as fetchTracksService } from '../../services/gigService';

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

export default function BulkGigImportPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [tracks, setTracks] = useState([]);
  const [trackMap, setTrackMap] = useState(new Map());
  const [loadingTracks, setLoadingTracks] = useState(true);

  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [parseError, setParseError] = useState(null);

  const [previewRows, setPreviewRows] = useState([]);
  const [allValidatedRows, setAllValidatedRows] = useState([]);
  const [counts, setCounts] = useState({ total: 0, valid: 0, invalid: 0 });

  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState({ current: 0, total: 0, created: 0, failed: 0 });
  const [importComplete, setImportComplete] = useState(false);
  const [importFailures, setImportFailures] = useState([]);

  useEffect(() => {
    async function loadTracks() {
      try {
        const { data, error } = await fetchTracksService();
        if (error) throw error;
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
        console.warn('[BulkGigImport] Failed to fetch tracks:', err);
      } finally {
        setLoadingTracks(false);
      }
    }
    loadTracks();
  }, []);

  const handleDownloadTemplate = () => {
    const headers = ['title', 'track_id', 'payment_amount', 'origin_url', 'short_description', 'overview', 'responsibilities', 'deliverables', 'requirements', 'proof_spec'];
    const sampleRows = [
      ['AI Reels Content Producer', 'M1', '$45 / hr', 'https://www.upwork.com/jobs/~0111', 'Produce scroll-stopping reels using AI workflows.', 'Develop recurring short-form video content.', 'Script AI scenes||Edit reels', '15 production assets', 'Composition skills', 'Public video portfolio link'],
      ['Brand Asset Generator', 'M2', '$600 fixed', 'https://www.upwork.com/jobs/~0222', 'Generate commercial image assets.', 'Create high-res visuals.', 'Prompt engineering||Color matching', '20 hero visuals', 'Midjourney experience', 'Behance portfolio link']
    ];

    const csvContent = [
      headers.join(','),
      ...sampleRows.map(r => r.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'upshift_gig_roster_template.csv');
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
        title: rawHeaders.findIndex(h => h === 'title' || h === 'gig_title' || h === 'opportunity_title'),
        track: rawHeaders.findIndex(h => h === 'track_id' || h === 'track' || h === 'course_id' || h === 'course'),
        rate: rawHeaders.findIndex(h => h === 'payment_amount' || h === 'rate' || h === 'compensation'),
        originUrl: rawHeaders.findIndex(h => h === 'origin_url' || h === 'url' || h === 'apply_url' || h === 'link'),
        shortDesc: rawHeaders.findIndex(h => h === 'short_description' || h === 'summary'),
        overview: rawHeaders.findIndex(h => h === 'overview' || h === 'description'),
        responsibilities: rawHeaders.findIndex(h => h === 'responsibilities'),
        deliverables: rawHeaders.findIndex(h => h === 'deliverables'),
        requirements: rawHeaders.findIndex(h => h === 'requirements'),
        proofSpec: rawHeaders.findIndex(h => h === 'proof_spec' || h === 'required_proof'),
      };

      if (colMap.title === -1 || colMap.track === -1 || colMap.originUrl === -1) {
        setParseError('Missing mandatory CSV columns: title, track_id, origin_url.');
        return;
      }

      const validatedList = [];
      let validCount = 0;
      let invalidCount = 0;

      for (let idx = 1; idx < parsedMatrix.length; idx++) {
        const row = parsedMatrix[idx];
        if (row.length === 0 || row.every(c => c.length === 0)) continue;

        const title = row[colMap.title] || '';
        const rawTrack = row[colMap.track] || '';
        const paymentAmount = colMap.rate !== -1 ? row[colMap.rate] || '' : '';
        const originUrl = row[colMap.originUrl] || '';
        const shortDescription = colMap.shortDesc !== -1 ? row[colMap.shortDesc] || '' : '';
        const overview = colMap.overview !== -1 ? row[colMap.overview] || '' : '';
        const rawResp = colMap.responsibilities !== -1 ? row[colMap.responsibilities] || '' : '';
        const rawDeliv = colMap.deliverables !== -1 ? row[colMap.deliverables] || '' : '';
        const rawReq = colMap.requirements !== -1 ? row[colMap.requirements] || '' : '';
        const proofSpec = colMap.proofSpec !== -1 ? row[colMap.proofSpec] || '' : '';

        const rowErrors = [];

        if (!title) rowErrors.push('Missing Title');
        if (!originUrl) rowErrors.push('Missing Origin URL');

        const matchedTrack = trackMap.get(rawTrack.toLowerCase()) || trackMap.get(rawTrack);
        if (!matchedTrack) {
          rowErrors.push(`Unrecognized Track: "${rawTrack}"`);
        }

        const isValid = rowErrors.length === 0;
        if (isValid) validCount++;
        else invalidCount++;

        const parseList = (str) => str ? str.split('||').map(s => s.trim()).filter(Boolean) : [];

        validatedList.push({
          rowNumber: idx + 1,
          title,
          trackId: matchedTrack?.id || rawTrack,
          trackCode: matchedTrack?.code || rawTrack,
          paymentAmount,
          originUrl,
          shortDescription,
          overview,
          responsibilities: parseList(rawResp),
          deliverables: parseList(rawDeliv),
          requirements: parseList(rawReq),
          proofSpec,
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
      });
    } catch (err) {
      console.error('[BulkGigImport] Parse error:', err);
      setParseError('Unable to process CSV file.');
    }
  };

  const handleExecuteBatchImport = async () => {
    const validRowsToCreate = allValidatedRows.filter(r => r.isValid);
    if (validRowsToCreate.length === 0 || isImporting) return;

    setIsImporting(true);
    setImportProgress({ current: 0, total: validRowsToCreate.length, created: 0, failed: 0 });

    const payloadBatch = validRowsToCreate.map(r => ({
      title: r.title,
      track_id: r.trackId,
      payment_amount: r.paymentAmount || null,
      origin_url: r.originUrl,
      short_description: r.shortDescription || null,
      overview: r.overview || null,
      responsibilities: r.responsibilities,
      deliverables: r.deliverables,
      requirements: r.requirements,
      proof_spec: r.proofSpec || null,
    }));

    try {
      const { data, error } = await supabase
        .from('gigs')
        .insert(payloadBatch)
        .select();

      if (error) throw error;

      setImportProgress({
        current: validRowsToCreate.length,
        total: validRowsToCreate.length,
        created: (data || []).length,
        failed: 0,
      });
      setImportComplete(true);
    } catch (err) {
      console.error('[BulkGigImport] Insert error:', err);
      setImportFailures([{ row: 0, error: err.message || 'Database error during batch insert' }]);
      setImportComplete(true);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="admin-page admin-page-medium">
      {/* Page Header */}
      <div className="admin-page-header">
        <div className="admin-page-title-group">
          <h1 className="admin-page-title">
            <Briefcase size={22} />
            <span>Bulk Opportunity CSV Import</span>
          </h1>
          <p className="admin-page-description">
            Upload multiple commercial opportunities via CSV assigned to UpShift tracks.
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
            to="/admin/gigs"
            className="admin-btn admin-btn-secondary"
          >
            <ArrowLeft size={14} />
            <span>Back to Opportunities</span>
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
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                processCSVFile(e.dataTransfer.files[0]);
              }
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`admin-dropzone ${isDragging ? 'is-dragging' : ''}`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  processCSVFile(e.target.files[0]);
                }
              }}
              style={{ display: 'none' }}
            />
            <div className="admin-dropzone-icon">
              <UploadCloud size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#111827', margin: '0 0 4px 0' }}>
                Drag & Drop Opportunity CSV File
              </h3>
              <p style={{ fontSize: '12.5px', color: '#6B7280', margin: 0 }}>
                or click to browse (.csv format)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* File Loaded Preview & Validation Stage */}
      {file && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* File Meta Card */}
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
                  {(file.size / 1024).toFixed(1)} KB · {counts.total} rows
                </span>
              </div>
            </div>

            {!isImporting && !importComplete && (
              <button
                onClick={() => {
                  setFile(null);
                  setPreviewRows([]);
                  setAllValidatedRows([]);
                  setCounts({ total: 0, valid: 0, invalid: 0 });
                  setParseError(null);
                  setImportComplete(false);
                  setImportFailures([]);
                }}
                className="admin-btn admin-btn-sm admin-btn-secondary"
              >
                <Trash2 size={13} />
                <span>Change File</span>
              </button>
            )}
          </div>

          {/* Validation Counters */}
          <div className="admin-stats-grid">
            <div className="admin-stat-box">
              <span className="admin-stat-label">Total Rows</span>
              <span className="admin-stat-value">{counts.total}</span>
            </div>
            <div className="admin-stat-box">
              <span className="admin-stat-label" style={{ color: '#059669' }}>Valid Opportunities</span>
              <span className="admin-stat-value" style={{ color: '#059669' }}>{counts.valid}</span>
            </div>
            <div className="admin-stat-box">
              <span className="admin-stat-label" style={{ color: '#DC2626' }}>Invalid Rows</span>
              <span className="admin-stat-value" style={{ color: '#DC2626' }}>{counts.invalid}</span>
            </div>
          </div>

          {/* Import Complete Card */}
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
                    Successfully imported <strong>{importProgress.created}</strong> opportunities into UpShift tracks.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <Link
                  to="/admin/gigs"
                  className="admin-btn admin-btn-primary"
                >
                  <Briefcase size={14} />
                  <span>View All Opportunities</span>
                </Link>

                <button
                  onClick={() => {
                    setFile(null);
                    setPreviewRows([]);
                    setAllValidatedRows([]);
                    setCounts({ total: 0, valid: 0, invalid: 0 });
                    setParseError(null);
                    setImportComplete(false);
                    setImportFailures([]);
                  }}
                  className="admin-btn admin-btn-secondary"
                >
                  <span>Import Another File</span>
                </button>
              </div>
            </div>
          )}

          {/* Validation Table Preview */}
          {!importComplete && (
            <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '14px 20px', borderBottom: '1px solid #E5E7EB', backgroundColor: '#FAFAFA' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#111827', textTransform: 'uppercase', fontFamily: 'monospace' }}>
                  Opportunity Pre-Validation Preview ({Math.min(100, allValidatedRows.length)} of {allValidatedRows.length} rows)
                </span>
              </div>

              <div className="admin-table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Status</th>
                      <th>Opportunity Title</th>
                      <th>Track Code</th>
                      <th>Compensation</th>
                      <th>Issues</th>
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
                        <td style={{ fontWeight: 600 }}>{r.title || '—'}</td>
                        <td>
                          <span style={{ padding: '2px 5px', borderRadius: '4px', fontSize: '10.5px', fontFamily: 'monospace', fontWeight: 700, backgroundColor: '#F3F4F6' }}>
                            {r.trackCode}
                          </span>
                        </td>
                        <td style={{ fontFamily: 'monospace' }}>{r.paymentAmount || '—'}</td>
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
                  {counts.valid} valid opportunities ready for creation.
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
                      <span>Create {counts.valid} Opportunities</span>
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
