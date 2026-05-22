import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { resumeService } from '../services/api';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const ATS_COLORS = {
  Excellent:   '#4ade80',
  Good:        '#60a5fa',
  Fair:        '#f59e0b',
  'Needs Work':'#f87171',
};

// ── ATS Score Ring ─────────────────────────────────────────────────────────
const AtsRing = ({ score, label }) => {
  const r = 40, circ = 2 * Math.PI * r;
  const color = ATS_COLORS[label] || '#6b7280';
  return (
    <div className="flex flex-col items-center">
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="var(--border)" strokeWidth="7"/>
        <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="7"
          strokeDasharray={`${(score / 100) * circ} ${circ}`} strokeLinecap="round"
          transform="rotate(-90 50 50)" style={{ transition: 'stroke-dasharray 1s ease' }}/>
        <text x="50" y="46" textAnchor="middle" fontSize="20" fontWeight="700"
          fill="var(--text)" fontFamily="Inter, sans-serif">{score}</text>
        <text x="50" y="60" textAnchor="middle" fontSize="9"
          fill="var(--dim)" fontFamily="Inter, sans-serif">ATS Score</text>
      </svg>
      <span className="font-mono text-sm font-semibold mt-1" style={{ color }}>{label}</span>
    </div>
  );
};

// ── Resume Preview ─────────────────────────────────────────────────────────
function ResumePreview({ resume }) {
  const { personal, education, experience, skills, certifications, projects } = resume;

  const Section = ({ title, children }) => (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <p className="text-xs font-bold tracking-widest uppercase" style={{ color: '#111' }}>{title}</p>
        <div className="flex-1 h-px" style={{ backgroundColor: '#ddd' }} />
      </div>
      {children}
    </div>
  );

  return (
    <div id="resume-preview" className="bg-white text-black p-8 rounded-lg shadow-sm"
      style={{ fontFamily: 'Georgia, serif', fontSize: '11px', lineHeight: '1.5', minHeight: '842px' }}>

      {/* Header */}
      <div className="mb-4">
        <h1 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '4px', fontFamily: 'Arial, sans-serif' }}>
          {personal?.name || 'Your Name'}
        </h1>
        <div style={{ fontSize: '10px', color: '#555', fontFamily: 'Arial, sans-serif' }}>
          {[personal?.email, personal?.phone, personal?.location, personal?.github, personal?.linkedin]
            .filter(Boolean).filter(v => v.trim()).join('  |  ')}
        </div>
        <div style={{ height: '1px', backgroundColor: '#ddd', marginTop: '8px' }} />
      </div>

      {/* Education */}
      {education?.length > 0 && (
        <Section title="Education">
          {education.map((edu, i) => (
            <div key={i} className="mb-2">
              <div className="flex justify-between items-start">
                <span style={{ fontWeight: '700', fontFamily: 'Arial, sans-serif', fontSize: '11px' }}>{edu.degree}</span>
                <span style={{ color: '#777', fontSize: '10px' }}>{edu.year}</span>
              </div>
              <div style={{ color: '#555', fontSize: '10px' }}>
                {[edu.institution, edu.score].filter(v => v && v.trim()).join('  ·  ')}
              </div>
            </div>
          ))}
        </Section>
      )}

      {/* Experience */}
      {experience?.length > 0 && (
        <Section title="Experience">
          {experience.map((exp, i) => (
            <div key={i} className="mb-2">
              <div className="flex justify-between items-start">
                <span style={{ fontWeight: '700', fontFamily: 'Arial, sans-serif', fontSize: '11px' }}>
                  {exp.role}{exp.company ? ` — ${exp.company}` : ''}
                </span>
                <span style={{ color: '#777', fontSize: '10px' }}>{exp.duration}</span>
              </div>
              {exp.details && exp.details !== exp.role && (
                <div style={{ color: '#555', fontSize: '10px', marginTop: '2px' }}>{exp.details}</div>
              )}
            </div>
          ))}
        </Section>
      )}

      {/* Skills */}
      {skills?.length > 0 && (
        <Section title="Skills">
          <div style={{ color: '#333', fontSize: '10px', fontFamily: 'Arial, sans-serif' }}>
            {skills.map((s, i) => (
              <span key={s}>
                <span style={{ textTransform: 'capitalize' }}>{s}</span>
                {i < skills.length - 1 && <span style={{ color: '#aaa' }}>  ·  </span>}
              </span>
            ))}
          </div>
        </Section>
      )}

      {/* Certifications */}
      {certifications?.length > 0 && (
        <Section title="Certifications">
          {certifications.map((cert, i) => (
            <div key={i} className="mb-1">
              <div className="flex justify-between">
                <span style={{ fontWeight: '700', fontFamily: 'Arial, sans-serif', fontSize: '11px' }}>{cert.name}</span>
                <span style={{ color: '#777', fontSize: '10px' }}>{cert.date}</span>
              </div>
              {cert.issuer && <div style={{ color: '#555', fontSize: '10px' }}>{cert.issuer}</div>}
            </div>
          ))}
        </Section>
      )}

      {/* Projects */}
      {projects?.length > 0 && (
        <Section title="Projects">
          {projects.map((proj, i) => (
            <div key={i} className="mb-1">
              <span style={{ fontWeight: '700', fontFamily: 'Arial, sans-serif', fontSize: '11px' }}>• {proj.name}</span>
              {proj.description && <div style={{ color: '#555', fontSize: '10px', marginLeft: '10px' }}>{proj.description}</div>}
            </div>
          ))}
        </Section>
      )}
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function ResumeBuilder() {
  const [resume, setResume]     = useState(null);
  const [loading, setLoading]   = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    resumeService.get()
      .then(res => setResume(res.data))
      .catch(() => toast.error('Failed to load resume data'))
      .finally(() => setLoading(false));
  }, []);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const res = await resumeService.downloadPdf();
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `${resume?.personal?.name || 'resume'}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('Resume downloaded!');
    } catch {
      toast.error('PDF download failed');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return (
    <div className="max-w-5xl animate-pulse space-y-4">
      <div className="h-8 t-surface2 rounded w-1/3" />
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 h-96 t-surface border t-border rounded-lg" />
        <div className="h-96 t-surface border t-border rounded-lg" />
      </div>
    </div>
  );

  if (!resume) return null;

  const ats = resume.atsAnalysis || {};

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <p className="font-mono text-xs t-dim uppercase tracking-widest mb-1">Resume</p>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold t-text">Resume Builder</h1>
            <p className="text-sm t-dim mt-0.5">Auto-generated from your profile and documents</p>
          </div>
          <button onClick={handleDownload} disabled={downloading}
            className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded t-btn transition-colors disabled:opacity-40">
            {downloading
              ? <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
              : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            }
            Download PDF
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Resume Preview */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="lg:col-span-2 overflow-auto rounded-lg border t-border"
          style={{ maxHeight: '85vh' }}>
          <ResumePreview resume={resume} />
        </motion.div>

        {/* ATS Panel */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
          className="space-y-4">

          {/* ATS Score */}
          <div className="t-surface border t-border rounded-lg p-5 flex flex-col items-center">
            <AtsRing score={ats.score || 0} label={ats.label || 'Needs Work'} />
            <p className="text-xs t-dim mt-3 text-center">
              {ats.score >= 80 ? 'Great ATS compatibility!'
                : ats.score >= 60 ? 'Good — a few improvements needed'
                : 'Complete your profile to improve score'}
            </p>
          </div>

          {/* ATS Checks */}
          <div className="t-surface border t-border rounded-lg p-4">
            <p className="text-xs t-dim font-mono uppercase tracking-wider mb-3">ATS Checks</p>
            <div className="space-y-2">
              {ats.checks?.map((check, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: check.passed ? '#4ade8020' : '#f8717120' }}>
                    {check.passed
                      ? <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                      : <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    }
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium t-text">{check.name}</p>
                    <p className="text-xs t-dim">{check.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Suggestions */}
          {ats.suggestions?.length > 0 && (
            <div className="t-surface border t-border rounded-lg p-4">
              <p className="text-xs t-dim font-mono uppercase tracking-wider mb-3">Improvements</p>
              <div className="space-y-2">
                {ats.suggestions.map((s, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-yellow-500 flex-shrink-0 mt-0.5">→</span>
                    <p className="text-xs t-dim">{s}</p>
                  </div>
                ))}
              </div>
              <Link to="/profile" className="flex items-center gap-1 text-xs t-dim hover:t-text transition-colors mt-3">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                Update Profile to improve score
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
