import React, { useState, useEffect } from 'react';
import { intelligenceApi, skillsApi } from '../api/client';
import { AlertTriangle, CheckCircle2, Plus } from 'lucide-react';

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
      <div className="flex h-96 items-center justify-center space-x-2 text-[#4b5563]">
        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs font-mono">Loading Failure & Success Intelligence...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4 text-[#111827]">
      {/* Header */}
      <div className="bg-white border border-[#e5e7eb] rounded px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div>
          <div className="flex items-center space-x-2 text-[11px] font-mono font-bold text-black">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>FAILURE & SUCCESS INTELLIGENCE</span>
          </div>
          <h1 className="text-base font-bold text-[#111827] mt-0.5">Closed-Loop Learning from Setbacks</h1>
          <p className="text-xs text-[#6b7280] mt-0.5">
            Failures are treated as telemetry. Root causes trigger automated roadmap adaptations.
          </p>
        </div>

        <button
          onClick={() => setShowLogModal(true)}
          className="px-3.5 py-1.5 bg-black hover:bg-neutral-800 text-white rounded text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Simulate / Log Assessment Failure</span>
        </button>
      </div>

      {alertMsg && (
        <div className="p-3 bg-white border border-black rounded text-xs text-[#111827] flex items-center justify-between font-mono shadow-sm">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#059669]" />
            {alertMsg}
          </span>
          <button onClick={() => setAlertMsg(null)} className="text-[#6b7280] hover:text-black text-xs font-medium">
            Dismiss
          </button>
        </div>
      )}

      {/* Two Column Layout: Failures vs Successes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Failures Column */}
        <div className="bg-white border border-[#e5e7eb] rounded overflow-hidden shadow-sm">
          <div className="px-4 py-2.5 border-b border-[#e5e7eb] flex items-center justify-between bg-[#f9fafb]">
            <span className="text-xs font-bold text-[#111827] flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-[#dc2626]" />
              Failure Events & Root Cause Analysis
            </span>
            <span className="text-[11px] font-mono text-[#6b7280]">{failures.length} recorded</span>
          </div>

          {failures.length === 0 ? (
            <p className="text-xs text-[#6b7280] p-8 text-center font-mono">
              No failure events recorded. Click "Simulate / Log Assessment Failure" to test adaptive replanning.
            </p>
          ) : (
            <div className="divide-y divide-[#e5e7eb]">
              {failures.map((f) => (
                <div key={f.id} className="p-4 hover:bg-[#f9fafb] transition-colors space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#111827]">{f.context}</span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded text-[#dc2626] bg-[#fef2f2] border border-[#fecaca]">
                      Score: {f.score}%
                    </span>
                  </div>

                  <div className="flex items-center space-x-4 text-xs font-mono text-[#6b7280]">
                    <div>
                      Skill: <span className="text-[#111827] font-semibold">{f.skillName}</span>
                    </div>
                    <div>
                      Confidence: <span className="text-black font-semibold">{f.confidence}</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded bg-[#f9fafb] border border-[#e5e7eb] text-xs space-y-1">
                    <div className="text-[10px] font-mono uppercase font-bold text-[#6b7280]">Observed Root Cause:</div>
                    <p className="text-[#111827] text-[11px]">{f.observedFactor}</p>
                  </div>

                  <div className="p-2.5 rounded bg-[#ecfdf5] border border-[#a7f3d0] text-xs space-y-1">
                    <div className="text-[10px] font-mono uppercase font-bold text-[#059669]">Adaptive Recovery Action:</div>
                    <p className="text-[#065f46] text-[11px] font-medium">{f.recommendedRecoveryAction}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Successes Column */}
        <div className="bg-white border border-[#e5e7eb] rounded overflow-hidden shadow-sm">
          <div className="px-4 py-2.5 border-b border-[#e5e7eb] flex items-center justify-between bg-[#f9fafb]">
            <span className="text-xs font-bold text-[#111827] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
              Success Intelligence & Repeatable Patterns
            </span>
            <span className="text-[11px] font-mono text-[#6b7280]">{successes.length} recorded</span>
          </div>

          {successes.length === 0 ? (
            <p className="text-xs text-[#6b7280] p-8 text-center font-mono">
              No milestones recorded yet. Complete tasks or mock assessments.
            </p>
          ) : (
            <div className="divide-y divide-[#e5e7eb]">
              {successes.map((s) => (
                <div key={s.id} className="p-4 hover:bg-[#f9fafb] transition-colors space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#111827]">{s.title}</span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded text-[#059669] bg-[#ecfdf5] border border-[#a7f3d0]">
                      Score: {s.score}%
                    </span>
                  </div>

                  <p className="text-xs text-[#4b5563]">{s.context}</p>

                  <div className="p-2.5 rounded bg-[#f9fafb] border border-[#e5e7eb] text-xs space-y-1">
                    <div className="text-[10px] font-mono uppercase font-bold text-black">Contributing Factor:</div>
                    <p className="text-[#111827] text-[11px]">{s.contributingFactors}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Log Failure Modal */}
      {showLogModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-[#e5e7eb] p-5 rounded max-w-md w-full space-y-4 shadow-xl">
            <div className="border-b border-[#e5e7eb] pb-2">
              <h3 className="text-xs font-bold text-[#111827]">Log Assessment Failure (Closed-Loop Trigger)</h3>
              <p className="text-[11px] text-[#6b7280] mt-0.5">
                Simulating a failure causes the Adaptive Replanner to inject remediation modules.
              </p>
            </div>

            <form onSubmit={handleRecordFailure} className="space-y-3">
              <div>
                <label className="text-[11px] font-mono font-semibold text-[#6b7280] block mb-1">Assessment Context</label>
                <input
                  type="text"
                  required
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  className="w-full bg-[#f9fafb] border border-[#d1d5db] rounded px-3 py-1.5 text-xs text-[#111827] focus:outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono font-semibold text-[#6b7280] block mb-1">Affected Skill</label>
                  <select
                    value={skillId}
                    onChange={(e) => setSkillId(e.target.value ? Number(e.target.value) : '')}
                    className="w-full bg-[#f9fafb] border border-[#d1d5db] rounded px-3 py-1.5 text-xs text-[#111827] focus:outline-none focus:border-black"
                  >
                    {skills.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-mono font-semibold text-[#6b7280] block mb-1">Score ({score}%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={score}
                    onChange={(e) => setScore(Number(e.target.value))}
                    className="w-full bg-[#f9fafb] border border-[#d1d5db] rounded px-3 py-1.5 text-xs text-[#111827] focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono font-semibold text-[#6b7280] block mb-1">Observed Evidence / Deficit</label>
                <textarea
                  rows={2}
                  value={evidence}
                  onChange={(e) => setEvidence(e.target.value)}
                  className="w-full bg-[#f9fafb] border border-[#d1d5db] rounded px-3 py-1.5 text-xs text-[#111827] focus:outline-none focus:border-black"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="flex-1 py-1.5 rounded bg-[#f3f4f6] hover:bg-[#e5e7eb] text-[#111827] text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-1.5 rounded bg-black hover:bg-neutral-800 text-white text-xs font-semibold shadow-sm disabled:opacity-50"
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
