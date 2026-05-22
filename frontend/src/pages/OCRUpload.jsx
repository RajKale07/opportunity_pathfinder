import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { ocrService } from '../services/api';
import toast from 'react-hot-toast';

// ── Icons ──────────────────────────────────────────────────────────────────
const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/>
  </svg>
);
const FileIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
  </svg>
);
const UploadIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);
const ChevronIcon = ({ open }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

// ── Config ─────────────────────────────────────────────────────────────────
const DOC_TYPES = [
  { key: 'CLASS_10',    label: '10th Marksheet',      color: '#4ade80' },
  { key: 'CLASS_12',    label: '12th Marksheet',      color: '#34d399' },
  { key: 'GRADUATION',  label: 'Graduation / Degree', color: '#60a5fa' },
  { key: 'CERTIFICATE', label: 'Certificate',         color: '#f59e0b' },
  { key: 'RESUME',      label: 'Resume / CV',         color: '#a78bfa' },
  { key: 'AADHAAR',     label: 'Aadhaar Card',        color: '#f87171' },
  { key: 'INCOME',      label: 'Income Certificate',  color: '#fb923c' },
  { key: 'OTHER',       label: 'Other Document',      color: '#9ca3af' },
];

const FIELDS = {
  CLASS_10: [
    { key: 'board',      label: 'Board',                 placeholder: 'e.g. CBSE, ICSE, State Board', required: true },
    { key: 'school',     label: 'School Name',           placeholder: 'e.g. Delhi Public School',     required: true },
    { key: 'year',       label: 'Year of Passing',       placeholder: 'e.g. 2020',                    required: true },
    { key: 'percentage', label: 'Percentage / CGPA',     placeholder: 'e.g. 85.4%',                   required: true },
    { key: 'english',    label: 'English Marks',         placeholder: 'e.g. 88/100' },
    { key: 'math',       label: 'Math Marks',            placeholder: 'e.g. 92/100' },
    { key: 'science',    label: 'Science Marks',         placeholder: 'e.g. 90/100' },
    { key: 'social',     label: 'Social Science Marks',  placeholder: 'e.g. 87/100' },
  ],
  CLASS_12: [
    { key: 'board',      label: 'Board',                 placeholder: 'e.g. CBSE, ICSE, State Board', required: true },
    { key: 'school',     label: 'School / College Name', placeholder: 'e.g. St. Xavier College',      required: true },
    { key: 'stream',     label: 'Stream',                placeholder: 'e.g. Science / Commerce / Arts', required: true },
    { key: 'year',       label: 'Year of Passing',       placeholder: 'e.g. 2022',                    required: true },
    { key: 'percentage', label: 'Percentage / CGPA',     placeholder: 'e.g. 88.2%',                   required: true },
    { key: 'physics',    label: 'Physics Marks',         placeholder: 'e.g. 90/100' },
    { key: 'chemistry',  label: 'Chemistry Marks',       placeholder: 'e.g. 88/100' },
    { key: 'math',       label: 'Math / Biology Marks',  placeholder: 'e.g. 95/100' },
    { key: 'english',    label: 'English Marks',         placeholder: 'e.g. 85/100' },
  ],
  GRADUATION: [
    { key: 'university', label: 'University / Institute',  placeholder: 'e.g. Mumbai University',   required: true },
    { key: 'degree',     label: 'Degree',                  placeholder: 'e.g. B.Tech, BCA, B.Sc',   required: true },
    { key: 'branch',     label: 'Branch / Specialization', placeholder: 'e.g. Computer Science',    required: true },
    { key: 'year',       label: 'Year of Passing',         placeholder: 'e.g. 2024',                required: true },
    { key: 'cgpa',       label: 'CGPA / Percentage',       placeholder: 'e.g. 8.2 CGPA or 78%',     required: true },
    { key: 'backlogs',   label: 'Active Backlogs',         placeholder: 'e.g. 0' },
  ],
  CERTIFICATE: [
    { key: 'name',       label: 'Certificate Name',        placeholder: 'e.g. AWS Cloud Practitioner', required: true },
    { key: 'issuer',     label: 'Issued By',               placeholder: 'e.g. Amazon, Coursera, NPTEL', required: true },
    { key: 'date',       label: 'Issue Date',              placeholder: 'e.g. March 2024',              required: true },
    { key: 'validity',   label: 'Valid Till',              placeholder: 'e.g. March 2027 or Lifetime' },
    { key: 'credId',     label: 'Credential ID',           placeholder: 'e.g. ABC123XYZ' },
    { key: 'skills',     label: 'Skills Covered',          placeholder: 'e.g. Cloud, AWS, S3, EC2' },
  ],
  RESUME: [
    { key: 'skills',     label: 'Key Skills',              placeholder: 'e.g. Java, React, MySQL',      required: true },
    { key: 'experience', label: 'Total Experience',        placeholder: 'e.g. Fresher / 2 years' },
    { key: 'lastRole',   label: 'Last / Current Role',     placeholder: 'e.g. Software Engineer Intern' },
    { key: 'lastCompany',label: 'Last / Current Company',  placeholder: 'e.g. TCS, Infosys, Startup' },
    { key: 'projects',   label: 'Notable Projects',        placeholder: 'e.g. E-commerce App, Portfolio' },
    { key: 'github',     label: 'GitHub / Portfolio URL',  placeholder: 'e.g. github.com/username' },
  ],
  AADHAAR: [
    { key: 'name',       label: 'Full Name',               placeholder: 'As on Aadhaar',                required: true },
    { key: 'dob',        label: 'Date of Birth',           placeholder: 'e.g. 15/08/2000',              required: true },
    { key: 'gender',     label: 'Gender',                  placeholder: 'Male / Female / Other',        required: true },
    { key: 'uid',        label: 'Aadhaar Number (last 4)', placeholder: 'e.g. XXXX XXXX 1234' },
    { key: 'address',    label: 'Address',                 placeholder: 'City, State, PIN' },
  ],
  INCOME: [
    { key: 'name',       label: 'Applicant Name',          placeholder: 'Name on certificate',          required: true },
    { key: 'income',     label: 'Annual Income',           placeholder: 'e.g. ₹1,80,000',               required: true },
    { key: 'issuedBy',   label: 'Issued By',               placeholder: 'e.g. Tehsildar, SDM Office',   required: true },
    { key: 'year',       label: 'Financial Year',          placeholder: 'e.g. 2023-24' },
    { key: 'category',   label: 'Category',                placeholder: 'e.g. General, OBC, SC, ST' },
  ],
  OTHER: [
    { key: 'docName',    label: 'Document Name',           placeholder: 'e.g. Domicile Certificate',    required: true },
    { key: 'issuedBy',   label: 'Issued By',               placeholder: 'e.g. Government of Maharashtra' },
    { key: 'date',       label: 'Issue Date',              placeholder: 'e.g. Jan 2024' },
    { key: 'notes',      label: 'Notes',                   placeholder: 'Any additional info' },
  ],
};

const getDocMeta = (key) => DOC_TYPES.find(d => d.key === key);
const inputStyle = { backgroundColor: 'var(--surface2)', color: 'var(--text)', borderColor: 'var(--border2)' };

// ── DocTypeSelector ────────────────────────────────────────────────────────
function DocTypeSelector({ selected, onSelect, availableTypes }) {
  const [open, setOpen] = useState(false);
  const current = getDocMeta(selected);
  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-3 py-2.5 border rounded text-sm transition-colors"
        style={{ backgroundColor: 'var(--surface2)', color: 'var(--text)', borderColor: 'var(--border2)' }}>
        <div className="flex items-center gap-2">
          {current && <span className="w-2 h-2 rounded-full" style={{ backgroundColor: current.color }} />}
          <span>{current ? current.label : availableTypes.length === 0 ? 'All documents added' : 'Select document type'}</span>
        </div>
        <ChevronIcon open={open} />
      </button>
      <AnimatePresence>
        {open && availableTypes.length > 0 && (
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            className="absolute z-20 w-full mt-1 border t-border rounded-lg overflow-hidden shadow-xl"
            style={{ backgroundColor: 'var(--surface)' }}>
            {availableTypes.map(dt => (
              <button key={dt.key} type="button"
                onClick={() => { onSelect(dt.key); setOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-left transition-colors"
                style={{ borderBottom: '1px solid var(--border)' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--surface2)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = ''}>
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: dt.color }} />
                <span className="t-text">{dt.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Document Form ──────────────────────────────────────────────────────────
function DocForm({ docType, onSaved }) {
  const fields = FIELDS[docType] || [];
  const dt = getDocMeta(docType);
  const [form, setForm] = useState({});
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState('form');
  const inputRef = useRef();

  const handleNext = (e) => {
    e.preventDefault();
    const missing = fields.filter(f => f.required && !form[f.key]?.trim());
    if (missing.length) { toast.error(`Required: ${missing.map(f => f.label).join(', ')}`); return; }
    setStep('upload');
  };

  const handleSave = async (withFile) => {
    setSaving(true);
    try {
      if (withFile && file) {
        const fd = new FormData();
        fd.append('file', file);
        await ocrService.uploadWithMeta(fd, docType, dt.label);
      }
      const res = await ocrService.saveManual(docType, dt.label, form);
      onSaved(res.data);
      toast.success(`${dt.label} saved`);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-4">
      <AnimatePresence mode="wait">
        {step === 'form' ? (
          <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onSubmit={handleNext} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {fields.map(f => (
                <div key={f.key} className={f.key === 'address' || f.key === 'notes' || f.key === 'skills' || f.key === 'projects' ? 'sm:col-span-2' : ''}>
                  <label className="block text-xs t-dim mb-1 font-mono uppercase tracking-wider">
                    {f.label}{f.required && <span className="text-red-400 ml-0.5">*</span>}
                  </label>
                  {f.key === 'address' || f.key === 'notes' || f.key === 'projects' ? (
                    <textarea rows={2}
                      className="w-full border rounded text-sm px-3 py-2 outline-none transition-colors resize-none"
                      style={inputStyle} placeholder={f.placeholder}
                      value={form[f.key] || ''}
                      onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
                  ) : (
                    <input className="w-full border rounded text-sm px-3 py-2 outline-none transition-colors"
                      style={inputStyle} placeholder={f.placeholder}
                      value={form[f.key] || ''}
                      onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
                  )}
                </div>
              ))}
            </div>
            <button type="submit" className="w-full text-sm font-medium py-2.5 rounded transition-colors t-btn mt-1">
              Next — Upload Document
            </button>
          </motion.form>
        ) : (
          <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="space-y-3">
            <button type="button" onClick={() => setStep('form')} className="text-xs t-dim hover:t-text transition-colors">
              ← Back to form
            </button>

            <div className="border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-colors"
              style={{ borderColor: file ? 'var(--subtle)' : 'var(--border)', backgroundColor: 'var(--surface)' }}
              onClick={() => inputRef.current.click()}>
              <input ref={inputRef} type="file" className="hidden" accept=".png,.jpg,.jpeg,.pdf"
                onChange={e => setFile(e.target.files[0])} />
              <div className="flex justify-center mb-2 t-dim"><UploadIcon /></div>
              {file
                ? <p className="text-sm t-text font-medium">{dt.label}{file.name.substring(file.name.lastIndexOf('.'))}</p>
                : <p className="text-sm t-text">Click to upload {dt.label} <span className="t-dim">(optional)</span></p>
              }
              {file && <p className="text-xs t-dim mt-1">Saved as "{dt.label}"</p>}
            </div>

            <div className="flex gap-2">
              <button onClick={() => handleSave(false)} disabled={saving}
                className="flex-1 text-sm py-2.5 rounded border t-border t-dim hover:t-text transition-colors disabled:opacity-40">
                Save without file
              </button>
              <button onClick={() => handleSave(true)} disabled={saving || !file}
                className="flex-1 text-sm font-medium py-2.5 rounded transition-colors t-btn disabled:opacity-40">
                {saving
                  ? <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                      Saving...
                    </span>
                  : 'Save with file'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function OCRUpload() {
  const { triggerRefresh } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [selectedType, setSelectedType] = useState('');

  const addedTypes = documents.map(d => d.docType);
  const availableTypes = DOC_TYPES.filter(d => !addedTypes.includes(d.key));
  const currentDoc = getDocMeta(selectedType);

  useEffect(() => { fetchDocs(); }, []);

  useEffect(() => {
    if (selectedType && addedTypes.includes(selectedType)) setSelectedType('');
  }, [documents]);

  const fetchDocs = async () => {
    try { const res = await ocrService.getDocuments(); setDocuments(res.data); } catch {}
  };

  const handleSaved = (newDoc) => {
    setDocuments(prev => {
      const exists = prev.find(d => d.docType === newDoc.docType);
      if (exists) return prev.map(d => d.docType === newDoc.docType ? newDoc : d);
      return [newDoc, ...prev];
    });
    setSelectedType('');
    // Trigger dashboard refresh when document is saved
    triggerRefresh();
  };

  const handleDelete = async (id) => {
    try {
      await ocrService.deleteDocument(id);
      setDocuments(d => d.filter(doc => doc.id !== id));
      toast.success('Deleted');
    } catch { toast.error('Delete failed'); }
  };

  return (
    <div className="max-w-5xl">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <p className="font-mono text-xs t-dim uppercase tracking-widest mb-1">Documents</p>
        <h1 className="text-xl font-semibold t-text">Document Vault</h1>
        <p className="text-sm t-dim mt-0.5">Fill in your document details and optionally upload the file</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

        {/* Left — Add */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="lg:col-span-3">
          <div className="t-surface border t-border rounded-lg p-5">
            <p className="text-sm font-medium t-text mb-4">Add Document</p>
            <DocTypeSelector selected={selectedType} onSelect={k => setSelectedType(k)} availableTypes={availableTypes} />

            {currentDoc && (
              <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded border t-border text-xs t-dim"
                style={{ backgroundColor: 'var(--surface2)' }}>
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: currentDoc.color }} />
                Fill in the details, then optionally upload the physical document
              </div>
            )}

            <AnimatePresence mode="wait">
              {selectedType && (
                <motion.div key={selectedType} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <DocForm docType={selectedType} onSaved={handleSaved} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Right — Vault */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="lg:col-span-2 space-y-3">
          <div className="t-surface border t-border rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b t-border flex items-center justify-between">
              <p className="text-sm font-medium t-text">My Documents</p>
              <span className="font-mono text-xs t-dim">{documents.length} / {DOC_TYPES.length}</span>
            </div>

            {documents.length === 0 ? (
              <div className="px-4 py-10 text-center">
                <p className="text-xs t-dim">No documents yet</p>
              </div>
            ) : (
              <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                {documents.map(doc => {
                  const dt = getDocMeta(doc.docType);
                  return (
                    <div key={doc.id} className="px-4 py-3 flex items-center justify-between group"
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--surface2)'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = ''}>
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="t-dim flex-shrink-0"><FileIcon /></span>
                        <div className="min-w-0">
                          <p className="text-sm t-text font-medium truncate">{doc.fileName}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="font-mono text-xs" style={{ color: dt?.color || '#9ca3af' }}>
                              {dt?.label || doc.docType}
                            </span>
                            <span className="text-xs t-dim">
                              {new Date(doc.uploadedAt).toLocaleDateString('en-IN')}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button onClick={() => handleDelete(doc.id)}
                        className="t-dim hover:text-red-400 transition-colors ml-2 flex-shrink-0 opacity-0 group-hover:opacity-100">
                        <TrashIcon />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Progress */}
          <div className="t-surface border t-border rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs t-dim font-mono uppercase tracking-wider">Vault Progress</p>
              <span className="text-xs t-dim">{documents.length}/{DOC_TYPES.length}</span>
            </div>
            <div className="w-full h-1 rounded-full" style={{ backgroundColor: 'var(--border)' }}>
              <div className="h-1 rounded-full transition-all" style={{ width: `${(documents.length / DOC_TYPES.length) * 100}%`, backgroundColor: 'var(--text)' }} />
            </div>
            <div className="grid grid-cols-2 gap-1 mt-3">
              {DOC_TYPES.map(dt => {
                const added = addedTypes.includes(dt.key);
                return (
                  <div key={dt.key} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: added ? dt.color : 'var(--muted)' }} />
                    <span className="text-xs truncate" style={{ color: added ? 'var(--text)' : 'var(--dim)' }}>
                      {dt.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
