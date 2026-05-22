import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { jobService } from '../services/api';
import toast from 'react-hot-toast';

// ── Icons ──────────────────────────────────────────────────────────────────
const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const ExternalIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
);
const LocationIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const BriefcaseIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="7" width="20" height="14" rx="2"/>
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
  </svg>
);
const FilterIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
  </svg>
);
const RefreshIcon = ({ spin }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    className={spin ? 'animate-spin' : ''}>
    <polyline points="23 4 23 10 17 10"/>
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
  </svg>
);

const JOB_TYPES = [
  { value: '', label: 'All Types' },
  { value: 'FULLTIME', label: 'Full Time' },
  { value: 'PARTTIME', label: 'Part Time' },
  { value: 'INTERN', label: 'Internship' },
  { value: 'CONTRACTOR', label: 'Contract' },
];

const MATCH_COLORS = {
  'Strong Match': '#4ade80',
  'Good Match':   '#60a5fa',
  'Partial Match':'#f59e0b',
  'Low Match':    '#6b7280',
};

// ── Match Score Ring ───────────────────────────────────────────────────────
const MatchRing = ({ score, label }) => {
  const r = 18, circ = 2 * Math.PI * r;
  const color = MATCH_COLORS[label] || '#6b7280';
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="44" height="44" viewBox="0 0 44 44">
        <circle cx="22" cy="22" r={r} fill="none" stroke="var(--border)" strokeWidth="3.5"/>
        <circle cx="22" cy="22" r={r} fill="none" stroke={color} strokeWidth="3.5"
          strokeDasharray={`${(score / 100) * circ} ${circ}`} strokeLinecap="round"
          transform="rotate(-90 22 22)" style={{ transition: 'stroke-dasharray 0.6s ease' }}/>
        <text x="22" y="26" textAnchor="middle" fontSize="10" fontWeight="600"
          fill="var(--text)" fontFamily="Inter, sans-serif">{score}%</text>
      </svg>
      <span className="font-mono text-xs" style={{ color }}>{label}</span>
    </div>
  );
};

// ── Job Card ───────────────────────────────────────────────────────────────
function JobCard({ job, index }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="t-surface border t-border rounded-lg overflow-hidden transition-colors"
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Logo */}
          <div className="w-10 h-10 rounded border t-border flex items-center justify-center flex-shrink-0 overflow-hidden"
            style={{ backgroundColor: 'var(--surface2)' }}>
            {job.logo
              ? <img src={job.logo} alt="" className="w-full h-full object-contain" onError={e => e.target.style.display = 'none'} />
              : <span className="text-sm font-semibold t-dim">{job.company?.[0] || '?'}</span>
            }
          </div>

          {/* Main info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-sm font-semibold t-text truncate">{job.title}</p>
                <p className="text-xs t-dim mt-0.5">{job.company}</p>
              </div>
              <MatchRing score={job.matchScore} label={job.matchLabel} />
            </div>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-3 mt-2">
              {job.location && (
                <span className="flex items-center gap-1 text-xs t-dim">
                  <LocationIcon />{job.location}
                </span>
              )}
              {job.type && (
                <span className="flex items-center gap-1 text-xs t-dim">
                  <BriefcaseIcon />{job.type.replace('_', ' ')}
                </span>
              )}
              {job.remote && (
                <span className="font-mono text-xs px-1.5 py-0.5 rounded border"
                  style={{ borderColor: '#4ade80', color: '#4ade80' }}>Remote</span>
              )}
              {job.fresherFriendly && (
                <span className="font-mono text-xs px-1.5 py-0.5 rounded border"
                  style={{ borderColor: '#60a5fa', color: '#60a5fa' }}>Fresher OK</span>
              )}
              {(job.salaryMin || job.salaryMax) && (
                <span className="text-xs t-dim">
                  {job.salaryCurrency || '$'}{job.salaryMin ? Math.round(job.salaryMin / 1000) + 'k' : ''}
                  {job.salaryMin && job.salaryMax ? ' – ' : ''}
                  {job.salaryMax ? Math.round(job.salaryMax / 1000) + 'k' : ''}
                </span>
              )}
            </div>

            {/* Matched skills */}
            {job.matchedSkills?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {job.matchedSkills.slice(0, 6).map(s => (
                  <span key={s} className="font-mono text-xs px-1.5 py-0.5 rounded"
                    style={{ backgroundColor: 'var(--surface2)', color: '#4ade80', border: '1px solid #4ade8033' }}>
                    ✓ {s}
                  </span>
                ))}
              </div>
            )}

            {/* Missing skills */}
            {job.missingSkills?.length > 0 && (
              <div className="mt-2">
                <p className="text-xs t-dim mb-1">Missing skills to improve match:</p>
                <div className="flex flex-wrap gap-1.5">
                  {job.missingSkills.map(s => (
                    <span key={s} className="font-mono text-xs px-1.5 py-0.5 rounded"
                      style={{ backgroundColor: 'var(--surface2)', color: '#f59e0b', border: '1px solid #f59e0b33' }}>
                      + {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Description toggle */}
        {job.description && (
          <div className="mt-3">
            <button onClick={() => setExpanded(e => !e)}
              className="text-xs t-dim hover:t-text transition-colors">
              {expanded ? '▲ Hide description' : '▼ Show description'}
            </button>
            <AnimatePresence>
              {expanded && (
                <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-xs t-dim mt-2 leading-relaxed overflow-hidden">
                  {job.description}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Apply button */}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs t-dim">
            {job.postedAt ? new Date(job.postedAt).toLocaleDateString('en-IN') : ''}
          </span>
          {job.applyUrl && (
            <a href={job.applyUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded transition-colors t-btn">
              Apply Now <ExternalIcon />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function Jobs() {
  const [jobs, setJobs]           = useState([]);
  const [loading, setLoading]     = useState(false);
  const [userSkills, setUserSkills] = useState([]);
  const [query, setQuery]         = useState('');
  const [location, setLocation]   = useState('');
  const [type, setType]           = useState('');
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [page, setPage]           = useState(1);
  const [total, setTotal]         = useState(0);
  const [searchedQuery, setSearchedQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchJobs = useCallback(async (pg = 1) => {
    setLoading(true);
    setHasSearched(true);
    try {
      const res = await jobService.search({ query, location, type, remoteOnly, page: pg });
      setJobs(res.data.jobs || []);
      setTotal(res.data.total || 0);
      setUserSkills(res.data.userSkills || []);
      setSearchedQuery(res.data.query || '');
      setPage(pg);
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || 'Failed to fetch jobs';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [query, location, type, remoteOnly]);

  // Auto-fetch on mount with profile-based query
  useEffect(() => { fetchJobs(1); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs(1);
  };

  const inputStyle = { backgroundColor: 'var(--surface2)', color: 'var(--text)', borderColor: 'var(--border2)' };

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <p className="font-mono text-xs t-dim uppercase tracking-widest mb-1">Opportunities</p>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold t-text">Job Recommendations</h1>
            <p className="text-sm t-dim mt-0.5">
              Ranked by skill match against your profile
              {userSkills.length > 0 && ` · ${userSkills.length} skills detected`}
            </p>
          </div>
          <button onClick={() => fetchJobs(page)} disabled={loading}
            className="flex items-center gap-1.5 text-xs t-dim hover:t-text transition-colors disabled:opacity-40">
            <RefreshIcon spin={loading} /> Refresh
          </button>
        </div>
      </motion.div>

      {/* Search + Filters */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="t-surface border t-border rounded-lg p-4 mb-4">
        <form onSubmit={handleSearch}>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 t-dim"><SearchIcon /></span>
              <input className="w-full border rounded text-sm pl-9 pr-3 py-2 outline-none transition-colors"
                style={inputStyle} placeholder="Job title, skills, or role..."
                value={query} onChange={e => setQuery(e.target.value)} />
            </div>
            <button type="button" onClick={() => setShowFilters(f => !f)}
              className="flex items-center gap-1.5 px-3 py-2 border t-border rounded text-sm t-dim hover:t-text transition-colors">
              <FilterIcon /> Filters
              {(location || type || remoteOnly) && (
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 ml-0.5" />
              )}
            </button>
            <button type="submit" disabled={loading}
              className="px-4 py-2 rounded text-sm font-medium t-btn transition-colors disabled:opacity-40">
              Search
            </button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3 pt-3 border-t t-border">
                  <div>
                    <label className="block text-xs t-dim mb-1 font-mono uppercase tracking-wider">Location</label>
                    <input className="w-full border rounded text-sm px-3 py-2 outline-none transition-colors"
                      style={inputStyle} placeholder="e.g. Mumbai, Bangalore"
                      value={location} onChange={e => setLocation(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs t-dim mb-1 font-mono uppercase tracking-wider">Job Type</label>
                    <select className="w-full border rounded text-sm px-3 py-2 outline-none transition-colors"
                      style={inputStyle} value={type} onChange={e => setType(e.target.value)}>
                      {JOB_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </div>
                  <div className="flex items-end pb-0.5">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <div onClick={() => setRemoteOnly(r => !r)}
                        className="w-9 h-5 rounded-full transition-colors relative flex-shrink-0"
                        style={{ backgroundColor: remoteOnly ? 'var(--text)' : 'var(--border)' }}>
                        <div className="w-3.5 h-3.5 rounded-full absolute top-0.5 transition-all"
                          style={{ backgroundColor: remoteOnly ? 'var(--bg)' : 'var(--dim)',
                                   left: remoteOnly ? '18px' : '3px' }} />
                      </div>
                      <span className="text-sm t-dim">Remote only</span>
                    </label>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </motion.div>

      {/* User skills summary */}
      {userSkills.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.08 }}
          className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-xs t-dim font-mono">Your skills:</span>
          {userSkills.slice(0, 10).map(s => (
            <span key={s} className="font-mono text-xs px-2 py-0.5 rounded border t-border t-dim">{s}</span>
          ))}
          {userSkills.length > 10 && <span className="text-xs t-dim">+{userSkills.length - 10} more</span>}
        </motion.div>
      )}

      {/* Results */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="t-surface border t-border rounded-lg p-4 animate-pulse">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded t-surface2" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 t-surface2 rounded w-1/2" />
                  <div className="h-3 t-surface2 rounded w-1/3" />
                  <div className="h-3 t-surface2 rounded w-2/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : jobs.length === 0 && hasSearched ? (
        <div className="flex flex-col items-center justify-center py-20 t-surface border t-border rounded-lg">
          <p className="text-sm t-dim mb-1">No jobs found</p>
          <p className="text-xs t-dim">Try a different search query or location</p>
        </div>
      ) : (
        <>
          {searchedQuery && (
            <p className="text-xs t-dim mb-3">
              Showing results for <span className="t-text">"{searchedQuery}"</span>
              {jobs.length > 0 && ` · ${jobs.length} jobs`}
            </p>
          )}

          <div className="space-y-3">
            {jobs.map((job, i) => <JobCard key={job.id || i} job={job} index={i} />)}
          </div>

          {/* Pagination */}
          {jobs.length > 0 && (
            <div className="flex items-center justify-center gap-3 mt-6">
              <button onClick={() => fetchJobs(page - 1)} disabled={page <= 1 || loading}
                className="px-4 py-2 text-sm border t-border rounded t-dim hover:t-text transition-colors disabled:opacity-30">
                ← Previous
              </button>
              <span className="font-mono text-xs t-dim">Page {page}</span>
              <button onClick={() => fetchJobs(page + 1)} disabled={loading}
                className="px-4 py-2 text-sm border t-border rounded t-dim hover:t-text transition-colors disabled:opacity-30">
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
