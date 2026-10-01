import React, { useState, useEffect } from 'react';
import { intelligenceApi, skillsApi } from '../api/client';
import { AlertTriangle, CheckCircle2, Plus, Sparkles, ShieldAlert, ArrowRight, HelpCircle } from 'lucide-react';

export const FailuresSuccessesPage: React.FC = () => {
  const [failures, setFailures] = useState<any[]>([]);
  const [successes, setSuccesses] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New failure form state
  const [showLogModal, setShowLogModal] = useState(false);
  const [context, setContext] = useState('SQL Joins Diagnostic Assessment');
  const [skillId, setSkillId] = useState<number | ''>('');
  const [score, setScore] = useState<number>(42);
  const [evidence, setEvidence] = useState('Subquery execution plan and index failure');
  const [submitting, setSubmitting] = useState(false);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);

  const fetchData = () => {
    Promise.all([
      intelligenceApi.getFailures(),
      intelligenceApi.getSuccesses(),
      skillsApi.getAll()
    ])
      .then(([failRes, succRes, skillsRes]: any[]) => {
        if (failRes.data) setFailures(failRes.data);
        if (succRes.data) setSuccesses(succRes.data);
        if (skillsRes.data) {
          setSkills(skillsRes.data);
          const sql = skillsRes.data.find((s: any) => s.name === 'SQL');
          if (sql) setSkillId(sql.id);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRecordFailure = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await intelligenceApi.recordFailure({
        failureType: 'ASSESSMENT_FAILURE',
        context,
        skillId: skillId === '' ? null : Number(skillId),
        score,
        evidence,
      });
      setAlertMsg(`Failure logged: Closed-loop Adaptive Planning Engine automatically intervened and injected remediation modules into your active roadmap!`);
      setShowLogModal(false);
      fetchData();
    } catch (err: any) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center space-x-3 text-slate-400">
        <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm font-medium">Loading Failure & Success Intelligence...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs font-semibold text-rose-400 uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" />
            <span>Failure & Success Intelligence</span>
          </div>
          <h1 className="text-xl font-extrabold text-white">Closed-Loop Learning from Setbacks</h1>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Failures are treated as high-signal telemetry. Root causes are categorized as <strong>Observed</strong>, <strong>Likely</strong>, or <strong>Unknown</strong> to trigger targeted roadmap adaptations.
          </p>
        </div>

        <button
          onClick={() => setShowLogModal(true)}
          className="px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-lg shadow-rose-500/20 flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Simulate / Log Assessment Failure</span>
        </button>
      </div>

      {alertMsg && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            {alertMsg}
          </span>
          <button onClick={() => setAlertMsg(null)} className="text-slate-400 hover:text-white text-xs">
            Dismiss
          </button>
        </div>
      )}

      {/* Two Column Layout: Failures vs Successes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Failures Column */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Failure Events & Root Cause Analysis</span>
            </h3>
            <span className="text-xs text-slate-500">{failures.length} Recorded</span>
          </div>

          {failures.length === 0 ? (
            <p className="text-xs text-slate-400 p-8 text-center bg-slate-950/40 rounded-xl border border-dashed border-slate-800">
              No failure events recorded. Click "Log Assessment Failure" above to test adaptive closed-loop replanning.
            </p>
          ) : (
            <div className="space-y-3.5">
              {failures.map((f) => (
                <div
                  key={f.id}
                  className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{f.context}</span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                      Score: {f.score}%
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                    <div>
                      Skill: <strong className="text-slate-200">{f.skillName}</strong>
                    </div>
                    <div>
                      Confidence: <strong className="text-amber-400">{f.confidence}</strong>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 space-y-1 text-xs">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Observed Root Cause:</div>
                    <p className="text-slate-300 text-[11px]">{f.observedFactor}</p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/30 space-y-1 text-xs">
                    <div className="text-[10px] font-bold text-emerald-400 uppercase">Adaptive Recovery Action:</div>
                    <p className="text-slate-300 text-[11px]">{f.recommendedRecoveryAction}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Successes Column */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Success Intelligence & Repeatable Patterns</span>
            </h3>
            <span className="text-xs text-slate-500">{successes.length} Recorded</span>
          </div>

          {successes.length === 0 ? (
            <p className="text-xs text-slate-400 p-8 text-center bg-slate-950/40 rounded-xl border border-dashed border-slate-800">
              No milestones recorded yet. Complete tasks or mock assessments.
            </p>
          ) : (
            <div className="space-y-3.5">
              {successes.map((s) => (
                <div
                  key={s.id}
                  className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{s.title}</span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Score: {s.score}%
                    </span>
                  </div>

                  <p className="text-xs text-slate-300">{s.context}</p>

                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 space-y-1 text-xs">
                    <div className="text-[10px] font-bold text-emerald-400 uppercase">Contributing Factor:</div>
                    <p className="text-slate-300 text-[11px]">{s.contributingFactors}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Log Failure Modal */}
      {showLogModal && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white">Log Assessment Failure (Closed-Loop Trigger)</h3>
            <p className="text-xs text-slate-400">
              Submitting an assessment failure allows the Adaptive Planning Engine to automatically detect the prerequisite deficit and modify the roadmap.
            </p>

            <form onSubmit={handleRecordFailure} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Assessment Context</label>
                <input
                  type="text"
                  required
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Affected Skill</label>
                  <select
                    value={skillId}
                    onChange={(e) => setSkillId(e.target.value ? Number(e.target.value) : '')}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    {skills.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Score ({score}%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={score}
                    onChange={(e) => setScore(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Observed Evidence / Deficit</label>
                <textarea
                  rows={2}
                  value={evidence}
                  onChange={(e) => setEvidence(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold"
                >
                  {submitting ? 'Adapting...' : 'Record & Trigger Adaptations'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
