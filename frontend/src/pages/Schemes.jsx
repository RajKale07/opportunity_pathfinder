import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { schemeService } from '../services/api';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const ExternalIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
);

const CATEGORIES = [
  { value: 'ALL',         label: 'All',        icon: '⊞' },
  { value: 'EDUCATION',   label: 'Education',  icon: '🎓' },
  { value: 'EMPLOYMENT',  label: 'Employment', icon: '💼' },
  { value: 'FINANCE',     label: 'Finance',    icon: '💰' },
  { value: 'HEALTH',      label: 'Health',     icon: '🏥' },
  { value: 'HOUSING',     label: 'Housing',    icon: '🏠' },
  { value: 'AGRICULTURE', label: 'Agriculture',icon: '🌾' },
  { value: 'SOCIAL',      label: 'Social',     icon: '🤝' },
];

const FILTERS = [
  { value: 'all',      label: 'All Schemes' },
  { value: 'eligible', label: 'Eligible Only' },
  { value: 'high',     label: 'High Match' },
];

const CAT_COLORS = {
  EDUCATION:   '#60a5fa',
  EMPLOYMENT:  '#4ade80',
  FINANCE:     '#f59e0b',
  HEALTH:      '#f87171',
  HOUSING:     '#a78bfa',
  AGRICULTURE: '#34d399',
  SOCIAL:      '#fb923c',
};

const scoreColor = (s) => {
  if (s >= 75) return '#4ade80';
  if (s >= 50) return '#60a5fa';
  if (s >= 25) return '#f59e0b';
  return '#6b7280';
};

const ScoreBar = ({ score }) => (
  <div className="flex items-center gap-2 mt-1">
    <div className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: 'var(--border)' }}>
      <div className="h-1.5 rounded-full transition-all duration-700"
        style={{ width: `${score}%`, backgroundColor: scoreColor(score) }} />
    </div>
    <span className="font-mono text-xs flex-shrink-0" style={{ color: scoreColor(score) }}>{score}%</span>
  </div>
);

function SchemeCard({ scheme, index }) {
  const [expanded, setExpanded] = useState(false);
  const catColor = CAT_COLORS[scheme.category] || '#9ca3af';

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="t-surface border t-border rounded-lg overflow-hidden transition-colors">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs px-1.5 py-0.5 rounded border flex-shrink-0"
                style={{ borderColor: catColor + '60', color: catColor }}>
                {scheme.category}
              </span>
              {scheme.eligible
                ? <span className="font-mono text-xs px-1.5 py-0.5 rounded flex-shrink-0"
                    style={{ backgroundColor: '#4ade8020', color: '#4ade80', border: '1px solid #4ade8040' }}>
                    ✓ Eligible
                  </span>
                : <span className="font-mono text-xs px-1.5 py-0.5 rounded flex-shrink-0"
                    style={{ backgroundColor: 'var(--surface2)', color: 'var(--dim)', border: '1px solid var(--border)' }}>
                    Check
                  </span>
              }
              {scheme.applyMode && (
                <span className="font-mono text-xs px-1.5 py-0.5 rounded border t-border t-dim flex-shrink-0">
                  {scheme.applyMode}
                </span>
              )}
            </div>
            <p className="text-sm font-semibold t-text leading-snug">{scheme.name}</p>
            <p className="text-xs t-dim mt-0.5">{scheme.ministry}</p>
          </div>
        </div>

        {/* Match score bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs t-dim">Eligibility Match</span>
          </div>
          <ScoreBar score={scheme.matchScore} />
        </div>

        {/* Benefits highlight */}
        {scheme.benefits && (
          <div className="px-3 py-2 rounded mb-3"
            style={{ backgroundColor: 'var(--surface2)', borderLeft: `3px solid ${catColor}` }}>
            <p className="text-xs t-dim mb-0.5 font-mono uppercase tracking-wider">Benefits</p>
            <p className="text-xs t-text">{scheme.benefits}</p>
          </div>
        )}

        {/* Match reasons */}
        {scheme.matchReasons?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {scheme.matchReasons.map((r, i) => (
              <span key={i} className="text-xs px-1.5 py-0.5 rounded"
                style={{ backgroundColor: '#4ade8015', color: '#4ade80', border: '1px solid #4ade8030' }}>
                ✓ {r}
              </span>
            ))}
          </div>
        )}

        {/* Missing criteria */}
        {scheme.missingCriteria?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {scheme.missingCriteria.map((m, i) => (
              <span key={i} className="text-xs px-1.5 py-0.5 rounded"
                style={{ backgroundColor: '#f59e0b15', color: '#f59e0b', border: '1px solid #f59e0b30' }}>
                ⚠ {m}
              </span>
            ))}
          </div>
        )}

        {/* Expand toggle */}
        <button onClick={() => setExpanded(e => !e)}
          className="text-xs t-dim hover:t-text transition-colors">
          {expanded ? '▲ Hide details' : '▼ Show details'}
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="mt-3 pt-3 border-t t-border space-y-3">
                <p className="text-xs t-dim leading-relaxed">{scheme.description}</p>

                {scheme.requiredDocuments?.length > 0 && (
                  <div>
                    <p className="text-xs t-dim mb-1.5 font-mono uppercase tracking-wider">Required Documents</p>
                    <div className="flex flex-wrap gap-1.5">
                      {scheme.requiredDocuments.map((d, i) => (
                        <span key={i} className="font-mono text-xs px-1.5 py-0.5 rounded border t-border t-dim">
                          {d.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {scheme.applyUrl && (
                  <div className="flex justify-end">
                    <a href={scheme.applyUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded t-btn transition-colors">
                      Apply Now <ExternalIcon />
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function Schemes() {
  const [data, setData]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [category, setCategory] = useState('ALL');
  const [filter, setFilter]     = useState('all');

  const fetchSchemes = async (cat, fil) => {
    setLoading(true);
    try {
      const res = await schemeService.getSchemes(cat, fil);
      setData(res.data);
    } catch {
      toast.error('Failed to load schemes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSchemes(category, filter); }, [category, filter]);

  const schemes = data?.schemes || [];
  const summary = data?.profileSummary || {};
  const profileComplete = data?.profileComplete;

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <p className="font-mono text-xs t-dim uppercase tracking-widest mb-1">Government</p>
        <h1 className="text-xl font-semibold t-text">Government Schemes</h1>
        <p className="text-sm t-dim mt-0.5">Eligibility matched against your profile — PMKVY, Mudra, Ayushman Bharat and more</p>
      </motion.div>

      {/* Profile summary */}
      {profileComplete && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 }}
          className="t-surface border t-border rounded-lg p-4 mb-4">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="text-xs t-dim font-mono uppercase tracking-wider">Your profile:</span>
            {Object.entries(summary).map(([k, v]) => (
              <span key={k} className="text-xs t-dim">
                <span className="t-subtle capitalize">{k}:</span>{' '}
                <span className={v === 'Not set' ? 'text-yellow-500' : 't-text'}>{v}</span>
              </span>
            ))}
            {Object.values(summary).some(v => v === 'Not set') && (
              <Link to="/profile" className="text-xs t-dim hover:t-text transition-colors ml-auto">
                Complete profile →
              </Link>
            )}
          </div>
        </motion.div>
      )}

      {/* Category tabs */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}
        className="flex flex-wrap gap-2 mb-4">
        {CATEGORIES.map(c => (
          <button key={c.value} onClick={() => setCategory(c.value)}
            className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded border transition-colors"
            style={{
              backgroundColor: category === c.value ? 'var(--btn-bg)' : 'var(--surface)',
              color: category === c.value ? 'var(--text-inv)' : 'var(--dim)',
              borderColor: category === c.value ? 'var(--btn-bg)' : 'var(--border)',
            }}>
            <span>{c.icon}</span> {c.label}
          </button>
        ))}
      </motion.div>

      {/* Filter row */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.08 }}
        className="flex items-center gap-2 mb-4">
        {FILTERS.map(f => (
          <button key={f.value} onClick={() => setFilter(f.value)}
            className="text-xs px-3 py-1.5 rounded border transition-colors"
            style={{
              backgroundColor: filter === f.value ? 'var(--surface2)' : 'transparent',
              color: filter === f.value ? 'var(--text)' : 'var(--dim)',
              borderColor: filter === f.value ? 'var(--subtle)' : 'var(--border)',
            }}>
            {f.label}
          </button>
        ))}
        {!loading && (
          <span className="ml-auto text-xs t-dim">{schemes.length} schemes</span>
        )}
      </motion.div>

      {/* No profile warning */}
      {!loading && !profileComplete && (
        <div className="t-surface border t-border rounded-lg p-6 text-center mb-4">
          <p className="text-sm t-text mb-1">Complete your profile to see eligibility</p>
          <p className="text-xs t-dim mb-3">We need your category, income, and employment status</p>
          <Link to="/profile" className="text-sm font-medium px-4 py-2 rounded t-btn transition-colors">
            Go to Profile
          </Link>
        </div>
      )}

      {/* Results */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="t-surface border t-border rounded-lg p-4 animate-pulse">
              <div className="space-y-2">
                <div className="h-3 t-surface2 rounded w-1/4" />
                <div className="h-4 t-surface2 rounded w-3/4" />
                <div className="h-3 t-surface2 rounded w-1/2" />
                <div className="h-2 t-surface2 rounded w-full mt-3" />
              </div>
            </div>
          ))}
        </div>
      ) : schemes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 t-surface border t-border rounded-lg">
          <p className="text-sm t-dim mb-1">No schemes found for this filter</p>
          <button onClick={() => { setFilter('all'); setCategory('ALL'); }}
            className="text-xs t-dim hover:t-text transition-colors mt-2">
            Show all schemes
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {schemes.map((s, i) => <SchemeCard key={s.id || i} scheme={s} index={i} />)}
        </div>
      )}
    </div>
  );
}
