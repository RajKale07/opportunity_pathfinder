import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { careerService } from '../services/api';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const LEVEL_COLORS = {
  FOUNDATION: '#6b7280',
  JUNIOR:     '#60a5fa',
  MID:        '#4ade80',
  SENIOR:     '#f59e0b',
  LEAD:       '#a78bfa',
};

const LEVEL_LABELS = {
  FOUNDATION: 'Foundation',
  JUNIOR:     'Junior',
  MID:        'Mid-Level',
  SENIOR:     'Senior',
  LEAD:       'Lead / Architect',
};

function StepCard({ step, index, isCurrent, isPast, isNext }) {
  const [expanded, setExpanded] = useState(isCurrent);
  const color = LEVEL_COLORS[step.level] || '#6b7280';

  return (
    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="relative flex gap-4">

      {/* Timeline line + dot */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center z-10 flex-shrink-0 transition-all"
          style={{
            borderColor: isPast || isCurrent ? color : 'var(--border)',
            backgroundColor: isPast ? color : isCurrent ? color + '30' : 'var(--surface)',
          }}>
          {isPast
            ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--bg)" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
            : isCurrent
              ? <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
              : <span className="font-mono text-xs" style={{ color: 'var(--dim)' }}>{index + 1}</span>
          }
        </div>
        {index < 7 && (
          <div className="w-0.5 flex-1 mt-1" style={{ backgroundColor: isPast ? color + '60' : 'var(--border)', minHeight: '24px' }} />
        )}
      </div>

      {/* Card */}
      <div className="flex-1 mb-4">
        <div className="t-surface border t-border rounded-lg overflow-hidden transition-colors"
          style={{ borderColor: isCurrent ? color + '60' : undefined }}>
          <div className="p-4 cursor-pointer" onClick={() => setExpanded(e => !e)}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs px-1.5 py-0.5 rounded"
                    style={{ backgroundColor: color + '20', color }}>
                    {LEVEL_LABELS[step.level]}
                  </span>
                  {isCurrent && (
                    <span className="font-mono text-xs px-1.5 py-0.5 rounded"
                      style={{ backgroundColor: '#4ade8020', color: '#4ade80', border: '1px solid #4ade8040' }}>
                      ← You are here
                    </span>
                  )}
                  <span className="text-xs t-dim ml-auto">{step.duration}</span>
                </div>
                <p className="text-sm font-semibold t-text">{step.title}</p>
                <p className="text-xs t-dim mt-0.5">{step.description}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs font-medium" style={{ color }}>{step.salaryRange}</p>
                <p className="text-xs t-dim">salary</p>
              </div>
            </div>

            {/* Skill completion bar */}
            <div className="mt-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs t-dim">Skills ready</span>
                <span className="font-mono text-xs" style={{ color }}>{step.completionPct}%</span>
              </div>
              <div className="w-full h-1 rounded-full" style={{ backgroundColor: 'var(--border)' }}>
                <div className="h-1 rounded-full transition-all duration-700"
                  style={{ width: `${step.completionPct}%`, backgroundColor: color }} />
              </div>
            </div>
          </div>

          <AnimatePresence>
            {expanded && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="px-4 pb-4 pt-0 border-t t-border space-y-3 mt-0">
                  {step.skillsHave?.length > 0 && (
                    <div>
                      <p className="text-xs t-dim mb-1.5 font-mono uppercase tracking-wider">Skills you have</p>
                      <div className="flex flex-wrap gap-1.5">
                        {step.skillsHave.map(s => (
                          <span key={s} className="font-mono text-xs px-1.5 py-0.5 rounded"
                            style={{ backgroundColor: '#4ade8015', color: '#4ade80', border: '1px solid #4ade8030' }}>
                            ✓ {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {step.skillsMissing?.length > 0 && (
                    <div>
                      <p className="text-xs t-dim mb-1.5 font-mono uppercase tracking-wider">Skills to learn</p>
                      <div className="flex flex-wrap gap-1.5">
                        {step.skillsMissing.map(s => (
                          <span key={s} className="font-mono text-xs px-1.5 py-0.5 rounded"
                            style={{ backgroundColor: '#f59e0b15', color: '#f59e0b', border: '1px solid #f59e0b30' }}>
                            + {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

export default function CareerRoadmap() {
  const [data, setData]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [selectedRole, setSelectedRole] = useState(null);
  const [showPaths, setShowPaths] = useState(false);

  const fetchRoadmap = async (role) => {
    setLoading(true);
    try {
      const res = await careerService.getRoadmap(role);
      setData(res.data);
      setSelectedRole(res.data.role);
    } catch {
      toast.error('Failed to load roadmap');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRoadmap(null); }, []);

  if (loading) return (
    <div className="max-w-3xl space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex gap-4 animate-pulse">
          <div className="w-8 h-8 rounded-full t-surface2 flex-shrink-0" />
          <div className="flex-1 t-surface border t-border rounded-lg p-4 space-y-2">
            <div className="h-3 t-surface2 rounded w-1/4" />
            <div className="h-4 t-surface2 rounded w-1/2" />
            <div className="h-3 t-surface2 rounded w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );

  if (!data) return null;

  const { role, icon, description, steps, currentStep, skillGap,
          userSkills, trendingSkills, avgSalaryFresher, avgSalarySenior,
          allPaths, profileComplete } = data;

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <p className="font-mono text-xs t-dim uppercase tracking-widest mb-1">Career</p>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold t-text flex items-center gap-2">
              <span>{icon}</span> {role}
            </h1>
            <p className="text-sm t-dim mt-0.5">{description}</p>
          </div>
          <button onClick={() => setShowPaths(p => !p)}
            className="flex items-center gap-1.5 text-xs px-3 py-2 border t-border rounded t-dim hover:t-text transition-colors flex-shrink-0">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/>
              <polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
            </svg>
            Switch Path
          </button>
        </div>
      </motion.div>

      {/* Switch path panel */}
      <AnimatePresence>
        {showPaths && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-4">
            <div className="t-surface border t-border rounded-lg p-4">
              <p className="text-xs t-dim font-mono uppercase tracking-wider mb-3">Choose a career path</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {allPaths?.map(p => (
                  <button key={p.name} onClick={() => { fetchRoadmap(p.name); setShowPaths(false); }}
                    className="flex items-start gap-3 p-3 rounded border text-left transition-colors"
                    style={{
                      borderColor: p.name === role ? 'var(--subtle)' : 'var(--border)',
                      backgroundColor: p.name === role ? 'var(--surface2)' : 'transparent',
                    }}>
                    <span className="text-lg flex-shrink-0">{p.icon}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium t-text truncate">{p.name}</p>
                      <p className="text-xs t-dim truncate">{p.avgSalaryFresher} → {p.avgSalarySenior}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats row */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="grid grid-cols-3 gap-3 mb-6">
        <div className="t-surface border t-border rounded-lg p-4 text-center">
          <p className="text-xs t-dim font-mono uppercase tracking-wider mb-1">Fresher Salary</p>
          <p className="text-sm font-semibold t-text">{avgSalaryFresher}</p>
        </div>
        <div className="t-surface border t-border rounded-lg p-4 text-center">
          <p className="text-xs t-dim font-mono uppercase tracking-wider mb-1">Senior Salary</p>
          <p className="text-sm font-semibold t-text">{avgSalarySenior}</p>
        </div>
        <div className="t-surface border t-border rounded-lg p-4 text-center">
          <p className="text-xs t-dim font-mono uppercase tracking-wider mb-1">Your Progress</p>
          <p className="text-sm font-semibold t-text">Step {currentStep + 1} / {steps?.length}</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Roadmap steps */}
        <div className="lg:col-span-2">
          <p className="text-xs t-dim font-mono uppercase tracking-wider mb-4">Your Roadmap</p>
          {steps?.map((step, i) => (
            <StepCard key={i} step={step} index={i}
              isCurrent={i === currentStep}
              isPast={i < currentStep}
              isNext={i === currentStep + 1} />
          ))}
        </div>

        {/* Right panel */}
        <div className="space-y-4">
          {/* Skill gap */}
          {skillGap?.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="t-surface border t-border rounded-lg p-4">
              <p className="text-xs t-dim font-mono uppercase tracking-wider mb-3">Skills to Learn</p>
              <div className="flex flex-wrap gap-1.5">
                {skillGap.slice(0, 12).map(s => (
                  <span key={s} className="font-mono text-xs px-1.5 py-0.5 rounded border t-border t-dim">
                    {s}
                  </span>
                ))}
              </div>
              {!profileComplete && (
                <Link to="/documents" className="text-xs t-dim hover:t-text transition-colors mt-3 block">
                  Add documents to detect your skills →
                </Link>
              )}
            </motion.div>
          )}

          {/* Your skills */}
          {userSkills?.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
              className="t-surface border t-border rounded-lg p-4">
              <p className="text-xs t-dim font-mono uppercase tracking-wider mb-3">Your Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {userSkills.map(s => (
                  <span key={s} className="font-mono text-xs px-1.5 py-0.5 rounded"
                    style={{ backgroundColor: '#4ade8015', color: '#4ade80', border: '1px solid #4ade8030' }}>
                    ✓ {s}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Trending skills */}
          {trendingSkills?.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}
              className="t-surface border t-border rounded-lg p-4">
              <p className="text-xs t-dim font-mono uppercase tracking-wider mb-1">Trending in {role}</p>
              <p className="text-xs t-dim mb-3">High demand skills in 2025</p>
              <div className="space-y-2">
                {trendingSkills.map((s, i) => (
                  <div key={s} className="flex items-center gap-2">
                    <span className="font-mono text-xs t-dim w-4">{i + 1}.</span>
                    <span className="text-xs t-text">{s}</span>
                    <div className="flex-1 h-1 rounded-full" style={{ backgroundColor: 'var(--border)' }}>
                      <div className="h-1 rounded-full" style={{
                        width: `${100 - i * 12}%`,
                        backgroundColor: '#60a5fa'
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* No skills prompt */}
          {userSkills?.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="t-surface border t-border rounded-lg p-4 text-center">
              <p className="text-xs t-dim mb-2">No skills detected yet</p>
              <Link to="/documents" className="text-xs font-medium px-3 py-1.5 rounded t-btn transition-colors">
                Add Documents
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
