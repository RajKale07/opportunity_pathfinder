import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { skillGapService } from '../services/api';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const ExternalIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
);

const PRIORITY_CONFIG = {
  CRITICAL:  { color: '#f87171', bg: '#f8717115', label: 'Critical',   desc: 'Must have to get hired' },
  IMPORTANT: { color: '#f59e0b', bg: '#f59e0b15', label: 'Important',  desc: 'Strongly preferred by employers' },
  NICE:      { color: '#60a5fa', bg: '#60a5fa15', label: 'Nice to Have', desc: 'Gives you an edge' },
};

const LEVEL_COLORS = {
  Beginner:     '#4ade80',
  Intermediate: '#f59e0b',
  Advanced:     '#f87171',
};

// Readiness ring
const ReadinessRing = ({ score }) => {
  const r = 52, circ = 2 * Math.PI * r;
  const color = score >= 70 ? '#4ade80' : score >= 40 ? '#f59e0b' : '#f87171';
  return (
    <svg width="130" height="130" viewBox="0 0 130 130">
      <circle cx="65" cy="65" r={r} fill="none" stroke="var(--border)" strokeWidth="8"/>
      <circle cx="65" cy="65" r={r} fill="none" stroke={color} strokeWidth="8"
        strokeDasharray={`${(score / 100) * circ} ${circ}`} strokeLinecap="round"
        transform="rotate(-90 65 65)" style={{ transition: 'stroke-dasharray 1s ease' }}/>
      <text x="65" y="60" textAnchor="middle" fontSize="26" fontWeight="700"
        fill="var(--text)" fontFamily="Inter, sans-serif">{score}%</text>
      <text x="65" y="78" textAnchor="middle" fontSize="11"
        fill="var(--dim)" fontFamily="Inter, sans-serif">Ready</text>
    </svg>
  );
};

// Category bar
const CategoryBar = ({ label, have, total, pct, color }) => (
  <div>
    <div className="flex items-center justify-between mb-1">
      <span className="text-xs t-dim">{label}</span>
      <span className="font-mono text-xs" style={{ color }}>{have}/{total}</span>
    </div>
    <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: 'var(--border)' }}>
      <div className="h-1.5 rounded-full transition-all duration-700"
        style={{ width: `${pct}%`, backgroundColor: color }} />
    </div>
  </div>
);

// Skill item card
function SkillItem({ item, index }) {
  const cfg = PRIORITY_CONFIG[item.priority];
  const res = item.resource;

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="flex items-start gap-3 p-3 rounded-lg border transition-colors"
      style={{
        backgroundColor: item.have ? '#4ade8008' : cfg.bg,
        borderColor: item.have ? '#4ade8030' : cfg.color + '30',
      }}>

      {/* Status icon */}
      <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ backgroundColor: item.have ? '#4ade8020' : cfg.color + '20' }}>
        {item.have
          ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
          : <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={cfg.color} strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        }
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium t-text capitalize">{item.skill}</span>
          {item.have
            ? <span className="font-mono text-xs" style={{ color: '#4ade80' }}>✓ You have this</span>
            : <span className="font-mono text-xs px-1.5 py-0.5 rounded"
                style={{ backgroundColor: cfg.color + '20', color: cfg.color }}>
                {cfg.label}
              </span>
          }
        </div>

        {/* Free course link */}
        {!item.have && res && (
          <div className="flex items-center gap-2 mt-1.5">
            <span className="font-mono text-xs px-1.5 py-0.5 rounded"
              style={{ backgroundColor: LEVEL_COLORS[res.level] + '20', color: LEVEL_COLORS[res.level] }}>
              {res.level}
            </span>
            <a href={res.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs t-dim hover:t-text transition-colors">
              {res.platform} — {res.title} <ExternalIcon />
            </a>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function SkillGap() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole]       = useState(null);
  const [showRoles, setShowRoles] = useState(false);

  const fetchGap = async (r) => {
    setLoading(true);
    try {
      const res = await skillGapService.getGap(r);
      setData(res.data);
      setRole(res.data.role);
    } catch {
      toast.error('Failed to load skill gap analysis');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGap(null); }, []);

  if (loading) return (
    <div className="max-w-4xl space-y-4 animate-pulse">
      <div className="h-8 t-surface2 rounded w-1/3" />
      <div className="grid grid-cols-3 gap-3">
        {[...Array(3)].map((_, i) => <div key={i} className="h-24 t-surface border t-border rounded-lg" />)}
      </div>
      <div className="h-64 t-surface border t-border rounded-lg" />
    </div>
  );

  if (!data) return null;

  const { readiness, criticalGap, importantGap, niceGap,
          relevantSkills, otherSkills, breakdown, allRoles, profileComplete, totalSkills } = data;

  const missingCritical  = criticalGap.filter(s => !s.have).length;
  const missingImportant = importantGap.filter(s => !s.have).length;

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <p className="font-mono text-xs t-dim uppercase tracking-widest mb-1">Analysis</p>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold t-text">Skill Gap Analysis</h1>
            <p className="text-sm t-dim mt-0.5">
              Analyzing for <span className="t-text">{role}</span>
              {totalSkills > 0 && ` · ${totalSkills} skills detected`}
            </p>
          </div>
          <button onClick={() => setShowRoles(p => !p)}
            className="flex items-center gap-1.5 text-xs px-3 py-2 border t-border rounded t-dim hover:t-text transition-colors flex-shrink-0">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/>
              <polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
            </svg>
            Change Role
          </button>
        </div>
      </motion.div>

      {/* Role switcher */}
      <AnimatePresence>
        {showRoles && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-4">
            <div className="t-surface border t-border rounded-lg p-4">
              <p className="text-xs t-dim font-mono uppercase tracking-wider mb-3">Select target role</p>
              <div className="flex flex-wrap gap-2">
                {allRoles?.map(r => (
                  <button key={r} onClick={() => { fetchGap(r); setShowRoles(false); }}
                    className="text-sm px-3 py-1.5 rounded border transition-colors"
                    style={{
                      backgroundColor: r === role ? 'var(--btn-bg)' : 'var(--surface)',
                      color: r === role ? 'var(--text-inv)' : 'var(--dim)',
                      borderColor: r === role ? 'var(--btn-bg)' : 'var(--border)',
                    }}>
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* No skills warning */}
      {!profileComplete || totalSkills === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="t-surface border t-border rounded-lg p-6 text-center mb-4">
          <p className="text-sm t-text mb-1">No skills detected yet</p>
          <p className="text-xs t-dim mb-3">Add your resume or certificates to auto-detect your skills</p>
          <Link to="/documents" className="text-sm font-medium px-4 py-2 rounded t-btn transition-colors">
            Add Documents
          </Link>
        </motion.div>
      ) : null}

      {/* Top stats */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">

        {/* Readiness ring */}
        <div className="t-surface border t-border rounded-lg p-5 flex flex-col items-center justify-center">
          <ReadinessRing score={readiness} />
          <p className="text-xs t-dim mt-2 text-center">
            {readiness >= 70 ? 'Job ready! Polish remaining skills'
              : readiness >= 40 ? 'Good progress — focus on critical skills'
              : 'Build your foundation first'}
          </p>
        </div>

        {/* Breakdown bars */}
        <div className="t-surface border t-border rounded-lg p-5 space-y-4">
          <p className="text-xs t-dim font-mono uppercase tracking-wider">Skill Coverage</p>
          <CategoryBar label="Critical Skills"   {...breakdown.critical}  color="#f87171" />
          <CategoryBar label="Important Skills"  {...breakdown.important} color="#f59e0b" />
          <CategoryBar label="Nice to Have"      {...breakdown.nice}      color="#60a5fa" />
        </div>

        {/* Summary */}
        <div className="t-surface border t-border rounded-lg p-5 space-y-3">
          <p className="text-xs t-dim font-mono uppercase tracking-wider">Summary</p>
          <div className="space-y-2">
            {[
              { label: 'Critical gaps',  value: missingCritical,  color: '#f87171' },
              { label: 'Important gaps', value: missingImportant, color: '#f59e0b' },
              { label: 'Skills you have', value: relevantSkills.length, color: '#4ade80' },
              { label: 'Other skills',   value: otherSkills.length, color: '#6b7280' },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-xs t-dim">{label}</span>
                <span className="font-mono text-sm font-semibold" style={{ color }}>{value}</span>
              </div>
            ))}
          </div>
          {missingCritical === 0 && (
            <div className="pt-2 border-t t-border">
              <p className="text-xs" style={{ color: '#4ade80' }}>✓ All critical skills covered!</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Skill sections */}
      <div className="space-y-6">
        {[
          { key: 'critical',  list: criticalGap,  cfg: PRIORITY_CONFIG.CRITICAL },
          { key: 'important', list: importantGap, cfg: PRIORITY_CONFIG.IMPORTANT },
          { key: 'nice',      list: niceGap,      cfg: PRIORITY_CONFIG.NICE },
        ].map(({ key, list, cfg }) => (
          <motion.div key={key} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="font-mono text-xs px-2 py-1 rounded"
                style={{ backgroundColor: cfg.color + '20', color: cfg.color }}>
                {cfg.label}
              </span>
              <span className="text-xs t-dim">{cfg.desc}</span>
              <span className="ml-auto font-mono text-xs t-dim">
                {list.filter(s => s.have).length}/{list.length} have
              </span>
            </div>
            <div className="space-y-2">
              {list.map((item, i) => <SkillItem key={item.skill} item={item} index={i} />)}
            </div>
          </motion.div>
        ))}

        {/* Other skills */}
        {otherSkills.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <p className="text-xs t-dim font-mono uppercase tracking-wider mb-3">
              Other Skills You Have
            </p>
            <div className="flex flex-wrap gap-2">
              {otherSkills.map(s => (
                <span key={s} className="font-mono text-xs px-2 py-1 rounded border t-border t-dim capitalize">
                  {s}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
