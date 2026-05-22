import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const DOC_TYPES = 8;

const StatCard = ({ label, value, sub, icon, loading }) => (
  <div className="t-surface border t-border rounded-lg p-4 transition-colors">
    <div className="flex items-start justify-between mb-3">
      <span className="t-subtle">{icon}</span>
      <span className="font-mono text-xs t-dim uppercase tracking-wider">{label}</span>
    </div>
    {loading
      ? <div className="h-7 w-16 t-surface2 rounded animate-pulse" />
      : <p className="text-2xl font-semibold t-text">{value}</p>
    }
    <p className="text-xs t-dim mt-1">{sub}</p>
  </div>
);

const ScoreRing = ({ score }) => {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const filled = (score / 100) * circ;
  return (
    <svg width="72" height="72" viewBox="0 0 72 72">
      <circle cx="36" cy="36" r={r} fill="none" stroke="var(--border)" strokeWidth="5" />
      <circle cx="36" cy="36" r={r} fill="none" stroke="var(--text)" strokeWidth="5"
        strokeDasharray={`${filled} ${circ}`} strokeLinecap="round"
        transform="rotate(-90 36 36)" style={{ transition: 'stroke-dasharray 0.8s ease' }} />
      <text x="36" y="40" textAnchor="middle" fontSize="13" fontWeight="600"
        fill="var(--text)" fontFamily="Inter, sans-serif">{score}%</text>
    </svg>
  );
};

export default function Dashboard() {
  const { user, refreshTrigger } = useAuth();
  const location = useLocation();
  const [data, setData] = useState(null);
  const [jobsMatched, setJobsMatched] = useState(0);
  const [scholarshipsMatched, setScholarshipsMatched] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const userRes = await api.get('/user/me');
      setData(userRes.data);
      
      // Fetch matched jobs and scholarships in parallel
      const [jobsRes, scholarshipsRes] = await Promise.all([
        api.get('/jobs/matched').catch(() => ({ data: { matched: 0 } })),
        api.get('/scholarships/matched').catch(() => ({ data: { matched: 0 } })),
      ]);
      
      setJobsMatched(jobsRes.data.matched || 0);
      setScholarshipsMatched(scholarshipsRes.data.matched || 0);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Refetch on mount and when navigating to dashboard
  useEffect(() => { 
    setLoading(true);
    fetchData(); 
  }, [location.key]);

  // Poll for updates every 3 seconds
  useEffect(() => {
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Refetch when refresh trigger fires (e.g., after document upload)
  useEffect(() => {
    fetchData();
  }, [refreshTrigger]);

  const docCount   = data?.docCount   ?? 0;
  const skillCount = data?.skillCount ?? 0;
  const score      = data?.profileScore ?? 0;
  const docPct     = Math.round((docCount / DOC_TYPES) * 100);

  const steps = [
    { label: 'Account',   done: true },
    { label: 'Documents', done: docCount > 0 },
    { label: 'Skills',    done: skillCount > 0 },
  ];

  const stats = [
    {
      label: 'Documents',
      value: loading ? '—' : `${docCount}/${DOC_TYPES}`,
      sub: docCount === 0 ? 'No documents added yet' : `${DOC_TYPES - docCount} remaining`,
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
    },
    {
      label: 'Skills',
      value: loading ? '—' : skillCount,
      sub: skillCount === 0 ? 'Add documents to extract skills' : `${skillCount} skills detected`,
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    },
    {
      label: 'Jobs Matched',
      value: loading ? '—' : jobsMatched,
      sub: jobsMatched === 0 ? 'Add documents to match jobs' : `${jobsMatched} jobs available`,
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>,
    },
    {
      label: 'Scholarships',
      value: loading ? '—' : scholarshipsMatched,
      sub: scholarshipsMatched === 0 ? 'Complete profile to see scholarships' : `${scholarshipsMatched} eligible`,
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>,
    },
  ];

  return (
    <div>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <p className="font-mono text-xs t-dim uppercase tracking-widest mb-1">Overview</p>
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold t-text">
            Good to see you, {data?.name || user?.name}
          </h1>
          <button onClick={fetchData} disabled={loading}
            className="flex items-center gap-1.5 text-xs t-dim hover:t-text transition-colors disabled:opacity-40">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              className={loading ? 'animate-spin' : ''}>
              <polyline points="23 4 23 10 17 10"/>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
            </svg>
            Refresh
          </button>
        </div>
        <p className="text-sm t-dim mt-0.5">
          {score < 50 ? 'Complete your profile to unlock personalized opportunities' : 'Your profile is looking good — keep adding documents'}
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {stats.map((s, i) => <StatCard key={i} {...s} loading={loading} />)}
      </motion.div>

      {/* Profile score + setup steps */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-4">

        {/* Score card */}
        <div className="t-surface border t-border rounded-lg p-5 flex items-center gap-5">
          <ScoreRing score={score} />
          <div>
            <p className="text-sm font-medium t-text mb-1">Profile Score</p>
            <p className="text-xs t-dim">
              {score < 40 ? 'Add documents to improve your score' :
               score < 70 ? 'Good progress — add more documents' :
               'Great profile score!'}
            </p>
            <div className="mt-2 w-full h-1 rounded-full" style={{ backgroundColor: 'var(--border)' }}>
              <div className="h-1 rounded-full transition-all duration-700"
                style={{ width: `${score}%`, backgroundColor: 'var(--text)' }} />
            </div>
          </div>
        </div>

        {/* Setup steps */}
        <div className="t-surface border t-border rounded-lg p-5">
          <p className="text-sm font-medium t-text mb-4">Setup Progress</p>
          <div className="space-y-3">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0"
                  style={{ borderColor: s.done ? 'var(--text)' : 'var(--border)', backgroundColor: s.done ? 'var(--text)' : 'transparent' }}>
                  {s.done && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--bg)" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </div>
                <span className="text-sm" style={{ color: s.done ? 'var(--text)' : 'var(--dim)' }}>{s.label}</span>
                {!s.done && <span className="ml-auto font-mono text-xs t-dim">pending</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Doc progress */}
        <div className="t-surface border t-border rounded-lg p-5">
          <p className="text-sm font-medium t-text mb-1">Document Vault</p>
          <p className="text-xs t-dim mb-4">{docCount} of {DOC_TYPES} documents added</p>
          <div className="w-full h-1.5 rounded-full mb-4" style={{ backgroundColor: 'var(--border)' }}>
            <div className="h-1.5 rounded-full transition-all duration-700"
              style={{ width: `${docPct}%`, backgroundColor: 'var(--text)' }} />
          </div>
          <Link to="/documents"
            className="flex items-center gap-2 text-xs t-dim hover:t-text transition-colors">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add documents
          </Link>
        </div>
      </motion.div>

      {/* Coming soon panels */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {[
          { title: 'Job Recommendations', feature: 6 },
          { title: 'Scholarships',        feature: 7 },
          { title: 'Career Roadmap',      feature: 9 },
        ].map(({ title, feature }) => (
          <div key={title} className="t-surface border t-border rounded-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium t-text">{title}</p>
              <span className="font-mono text-xs t-dim border t-border px-2 py-0.5 rounded">Feature {feature}</span>
            </div>
            <div className="space-y-2">
              {[75, 55, 40].map((w, i) => (
                <div key={i} className="h-2 rounded t-surface2" style={{ width: `${w}%` }} />
              ))}
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
