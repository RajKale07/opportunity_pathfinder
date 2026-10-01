import React, { useState, useEffect } from 'react';
import { intelligenceApi, skillsApi } from '../api/client';
import { AlertTriangle, CheckCircle2, Plus, Sparkles, ShieldAlert, ArrowRight } from 'lucide-react';

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
      setAlertMsg(`Failure logged: Adaptive Planning Engine intervened and injected remediation modules into your active roadmap.`);
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
      <div className="flex h-96 items-center justify-center space-x-2 text-[#9ca3af]">
        <div className="w-4 h-4 border-2 border-[#ffa116] border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs font-mono">Loading Failure & Success Intelligence...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-[#262626] border border-[#333333] rounded px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2 text-[11px] font-mono text-[#ffa116]">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>FAILURE & SUCCESS INTELLIGENCE</span>
          </div>
          <h1 className="text-base font-semibold text-[#eff1f6] mt-0.5">Closed-Loop Learning from Setbacks</h1>
          <p className="text-xs text-[#9ca3af] mt-0.5">
            Failures are treated as telemetry. Root causes trigger automated roadmap adaptations.
          </p>
        </div>

        <button
          onClick={() => setShowLogModal(true)}
          className="px-3.5 py-1.5 bg-[#ffa116] hover:bg-[#ffb03a] text-black rounded text-xs font-semibold flex items-center space-x-1.5 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Simulate / Log Assessment Failure</span>
        </button>
      </div>

      {alertMsg && (
        <div className="p-3 bg-[#262626] border border-[#2cbb5d]/40 rounded text-xs text-[#2cbb5d] flex items-center justify-between font-mono">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            {alertMsg}
          </span>
          <button onClick={() => setAlertMsg(null)} className="text-[#9ca3af] hover:text-[#eff1f6] text-xs">
            Dismiss
          </button>
        </div>
      )}

      {/* Two Column Layout: Failures vs Successes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Failures Column */}
        <div className="bg-[#262626] border border-[#333333] rounded overflow-hidden">
          <div className="px-4 py-2.5 border-b border-[#333333] flex items-center justify-between">
            <span className="text-xs font-semibold text-[#eff1f6] flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-[#ef4743]" />
              Failure Events & Root Cause Analysis
            </span>
            <span className="text-[11px] font-mono text-[#9ca3af]">{failures.length} recorded</span>
          </div>

          {failures.length === 0 ? (
            <p className="text-xs text-[#9ca3af] p-8 text-center font-mono">
              No failure events recorded. Click "Simulate / Log Assessment Failure" to test adaptive replanning.
            </p>
          ) : (
            <div className="divide-y divide-[#333333]">
              {failures.map((f) => (
                <div key={f.id} className="p-4 hover:bg-[#2e2e2e] transition-colors space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#eff1f6]">{f.context}</span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded text-[#ef4743] bg-[#ef4743]/10 border border-[#ef4743]/30">
                      Score: {f.score}%
                    </span>
                  </div>

                  <div className="flex items-center space-x-4 text-xs font-mono text-[#9ca3af]">
                    <div>
                      Skill: <span className="text-[#eff1f6]">{f.skillName}</span>
                    </div>
                    <div>
                      Confidence: <span className="text-[#ffa116]">{f.confidence}</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded bg-[#1a1a1a] border border-[#333333] text-xs space-y-1">
                    <div className="text-[10px] font-mono uppercase text-[#9ca3af]">Observed Root Cause:</div>
                    <p className="text-[#eff1f6] text-[11px]">{f.observedFactor}</p>
                  </div>

                  <div className="p-2.5 rounded bg-[#202020] border border-[#2cbb5d]/30 text-xs space-y-1">
                    <div className="text-[10px] font-mono uppercase text-[#2cbb5d]">Adaptive Recovery Action:</div>
                    <p className="text-[#eff1f6] text-[11px]">{f.recommendedRecoveryAction}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Successes Column */}
        <div className="bg-[#262626] border border-[#333333] rounded overflow-hidden">
          <div className="px-4 py-2.5 border-b border-[#333333] flex items-center justify-between">
            <span className="text-xs font-semibold text-[#eff1f6] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2cbb5d]" />
              Success Intelligence & Repeatable Patterns
            </span>
            <span className="text-[11px] font-mono text-[#9ca3af]">{successes.length} recorded</span>
          </div>

          {successes.length === 0 ? (
            <p className="text-xs text-[#9ca3af] p-8 text-center font-mono">
              No milestones recorded yet. Complete tasks or mock assessments.
            </p>
          ) : (
            <div className="divide-y divide-[#333333]">
              {successes.map((s) => (
                <div key={s.id} className="p-4 hover:bg-[#2e2e2e] transition-colors space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#eff1f6]">{s.title}</span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded text-[#2cbb5d] bg-[#2cbb5d]/10 border border-[#2cbb5d]/30">
                      Score: {s.score}%
                    </span>
                  </div>

                  <p className="text-xs text-[#9ca3af]">{s.context}</p>

                  <div className="p-2.5 rounded bg-[#1a1a1a] border border-[#333333] text-xs space-y-1">
                    <div className="text-[10px] font-mono uppercase text-[#ffa116]">Contributing Factor:</div>
                    <p className="text-[#eff1f6] text-[11px]">{s.contributingFactors}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Log Failure Modal */}
      {showLogModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-[#262626] border border-[#333333] p-5 rounded max-w-md w-full space-y-4 shadow-2xl">
            <div className="border-b border-[#333333] pb-2">
              <h3 className="text-xs font-semibold text-[#eff1f6]">Log Assessment Failure (Closed-Loop Trigger)</h3>
              <p className="text-[11px] text-[#9ca3af] mt-0.5">
                Simulating a failure causes the Adaptive Replanner to inject remediation modules.
              </p>
            </div>

            <form onSubmit={handleRecordFailure} className="space-y-3">
              <div>
                <label className="text-[11px] font-mono text-[#9ca3af] block mb-1">Assessment Context</label>
                <input
                  type="text"
                  required
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-[#333333] rounded px-3 py-1.5 text-xs text-[#eff1f6] focus:outline-none focus:border-[#ffa116]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-[#9ca3af] block mb-1">Affected Skill</label>
                  <select
                    value={skillId}
                    onChange={(e) => setSkillId(e.target.value ? Number(e.target.value) : '')}
                    className="w-full bg-[#1a1a1a] border border-[#333333] rounded px-3 py-1.5 text-xs text-[#eff1f6] focus:outline-none focus:border-[#ffa116]"
                  >
                    {skills.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-[#9ca3af] block mb-1">Score ({score}%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={score}
                    onChange={(e) => setScore(Number(e.target.value))}
                    className="w-full bg-[#1a1a1a] border border-[#333333] rounded px-3 py-1.5 text-xs text-[#eff1f6] focus:outline-none focus:border-[#ffa116]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-[#9ca3af] block mb-1">Observed Evidence / Deficit</label>
                <textarea
                  rows={2}
                  value={evidence}
                  onChange={(e) => setEvidence(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-[#333333] rounded px-3 py-1.5 text-xs text-[#eff1f6] focus:outline-none focus:border-[#ffa116]"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="flex-1 py-1.5 rounded bg-[#333333] hover:bg-[#3d3d3d] text-[#eff1f6] text-xs font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-1.5 rounded bg-[#ffa116] hover:bg-[#ffb03a] text-black text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Triggering...' : 'Record & Adapt'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
