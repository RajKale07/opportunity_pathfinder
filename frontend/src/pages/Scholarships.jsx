import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { scholarshipService } from '../services/api';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const ExternalIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
);

const FILTERS = [
  { value: 'all',      label: 'All Scholarships' },
  { value: 'eligible', label: 'Eligible Only' },
  { value: 'high',     label: 'High Probability' },
];

const CATEGORY_COLORS = {
  CENTRAL: '#60a5fa',
  STATE:   '#4ade80',
  PRIVATE: '#a78bfa',
  MINORITY:'#f59e0b',
};

const probColor = (p) => {
  if (p >= 75) return '#4ade80';
  if (p >= 50) return '#60a5fa';
  if (p >= 25) return '#f59e0b';
  return '#6b7280';
};

const ProbRing = ({ prob }) => {
  const r = 22, circ = 2 * Math.PI * r;
  const color = probColor(prob);
  return (
    <div className="flex flex-col items-center gap-1 flex-shrink-0">
      <svg width="54" height="54" viewBox="0 0 54 54">
        <circle cx="27" cy="27" r={r} fill="none" stroke="var(--border)" strokeWidth="4"/>
        <circle cx="27" cy="27" r={r} fill="none" stroke={color} strokeWidth="4"
          strokeDasharray={`${(prob / 100) * circ} ${circ}`} strokeLinecap="round"
          transform="rotate(-90 27 27)" style={{ transition: 'stroke-dasharray 0.6s ease' }}/>
        <text x="27" y="31" textAnchor="middle" fontSize="11" fontWeight="600"
          fill="var(--text)" fontFamily="Inter, sans-serif">{prob}%</text>
      </svg>
      <span className="font-mono text-xs" style={{ color }}>
        {prob >= 75 ? 'High' : prob >= 50 ? 'Medium' : prob >= 25 ? 'Low' : 'Poor'}
      </span>
    </div>
  );
};

function ScholarshipCard({ s, index }) {
  const [expanded, setExpanded] = useState(false);
  const catColor = CATEGORY_COLORS[s.category] || '#9ca3af';

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="t-surface border t-border rounded-lg overflow-hidden transition-colors">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <ProbRing prob={s.approvalProbability} />

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <p className="text-sm font-semibold t-text leading-snug">{s.name}</p>
              {s.eligible
                ? <span className="font-mono text-xs px-1.5 py-0.5 rounded flex-shrink-0"
                    style={{ backgroundColor: '#4ade8020', color: '#4ade80', border: '1px solid #4ade8040' }}>
                    ✓ Eligible
                  </span>
                : <span className="font-mono text-xs px-1.5 py-0.5 rounded flex-shrink-0"
                    style={{ backgroundColor: '#f59e0b20', color: '#f59e0b', border: '1px solid #f59e0b40' }}>
                    Check
                  </span>
              }
            </div>

            <p className="text-xs t-dim mb-2">{s.provider}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              <span className="font-mono text-xs px-1.5 py-0.5 rounded border"
                style={{ borderColor: catColor + '60', color: catColor }}>
                {s.category}
              </span>
              <span className="font-mono text-xs px-1.5 py-0.5 rounded border t-border t-dim">
                {s.targetGroup}
              </span>
              {s.amount && (
                <span className="font-mono text-xs px-1.5 py-0.5 rounded border t-border t-dim">
                  {s.amount}
                </span>
              )}
              {s.deadline && s.deadline !== 'Varies' && (
                <span className="font-mono text-xs px-1.5 py-0.5 rounded"
                  style={{ backgroundColor: '#f59e0b15', color: '#f59e0b', border: '1px solid #f59e0b30' }}>
                  📅 {s.deadline}
                </span>
              )}
            </div>

            {/* Match reasons */}
            {s.matchReasons?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {s.matchReasons.map((r, i) => (
                  <span key={i} className="text-xs px-1.5 py-0.5 rounded"
                    style={{ backgroundColor: '#4ade8015', color: '#4ade80', border: '1px solid #4ade8030' }}>
                    ✓ {r}
                  </span>
                ))}
              </div>
            )}

            {/* Missing criteria */}
            {s.missingCriteria?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {s.missingCriteria.map((m, i) => (
                  <span key={i} className="text-xs px-1.5 py-0.5 rounded"
                    style={{ backgroundColor: '#f59e0b15', color: '#f59e0b', border: '1px solid #f59e0b30' }}>
                    ⚠ {m}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Expand */}
        <button onClick={() => setExpanded(e => !e)}
          className="text-xs t-dim hover:t-text transition-colors mt-2">
          {expanded ? '▲ Hide details' : '▼ Show details'}
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="mt-3 pt-3 border-t t-border space-y-3">
                <p className="text-xs t-dim leading-relaxed">{s.description}</p>

                {/* Required documents */}
                {s.requiredDocuments?.length > 0 && (
                  <div>
                    <p className="text-xs t-dim mb-1.5 font-mono uppercase tracking-wider">Required Documents</p>
                    <div className="flex flex-wrap gap-1.5">
                      {s.requiredDocuments.map((d, i) => (
                        <span key={i} className="font-mono text-xs px-1.5 py-0.5 rounded border t-border t-dim">
                          {d.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-xs t-dim">
                    Deadline: <span className="t-text">{s.deadline}</span>
                  </span>
                  {s.applyUrl && (
                    <a href={s.applyUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded t-btn transition-colors">
                      Apply Now <ExternalIcon />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function Scholarships() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState('all');

  const fetch = async (f) => {
    setLoading(true);
    try {
      const res = await scholarshipService.getRecommendations(f);
      setData(res.data);
    } catch {
      toast.error('Failed to load scholarships');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(filter); }, [filter]);

  const scholarships = data?.scholarships || [];
  const summary = data?.profileSummary || {};
  const profileComplete = data?.profileComplete;

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <p className="font-mono text-xs t-dim uppercase tracking-widest mb-1">Opportunities</p>
        <h1 className="text-xl font-semibold t-text">Scholarship Recommendations</h1>
        <p className="text-sm t-dim mt-0.5">Matched against your profile — eligibility calculated automatically</p>
      </motion.div>

      {/* Profile summary bar */}
      {profileComplete && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
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

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
        className="flex gap-2 mb-4">
        {FILTERS.map(f => (
          <button key={f.value} onClick={() => setFilter(f.value)}
            className="text-sm px-4 py-2 rounded border transition-colors"
            style={{
              backgroundColor: filter === f.value ? 'var(--btn-bg)' : 'var(--surface)',
              color: filter === f.value ? 'var(--text-inv)' : 'var(--dim)',
              borderColor: filter === f.value ? 'var(--btn-bg)' : 'var(--border)',
            }}>
            {f.label}
          </button>
        ))}
        {!loading && (
          <span className="ml-auto text-xs t-dim self-center">{scholarships.length} results</span>
        )}
      </motion.div>

      {/* No profile warning */}
      {!loading && !profileComplete && (
        <div className="t-surface border t-border rounded-lg p-6 text-center mb-4">
          <p className="text-sm t-text mb-1">Complete your profile to see eligibility</p>
          <p className="text-xs t-dim mb-3">We need your category, income, marks, and state to calculate eligibility</p>
          <Link to="/profile" className="text-sm font-medium px-4 py-2 rounded t-btn transition-colors">
            Go to Profile
          </Link>
        </div>
      )}

      {/* Results */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="t-surface border t-border rounded-lg p-4 animate-pulse">
              <div className="flex gap-3">
                <div className="w-14 h-14 rounded-full t-surface2 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 t-surface2 rounded w-3/4" />
                  <div className="h-3 t-surface2 rounded w-1/2" />
                  <div className="h-3 t-surface2 rounded w-2/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : scholarships.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 t-surface border t-border rounded-lg">
          <p className="text-sm t-dim mb-1">No scholarships found for this filter</p>
          <button onClick={() => setFilter('all')} className="text-xs t-dim hover:t-text transition-colors mt-2">
            Show all scholarships
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {scholarships.map((s, i) => <ScholarshipCard key={s.id} s={s} index={i} />)}
        </div>
      )}
    </div>
  );
}
