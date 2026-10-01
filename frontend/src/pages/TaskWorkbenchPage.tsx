import React, { useState, useEffect } from 'react';
import { learningApi, tasksApi } from '../api/client';
import { CheckSquare, UploadCloud, Github, ExternalLink, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export const TaskWorkbenchPage: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [activeTask, setActiveTask] = useState<any>(null);
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [evidenceNotes, setEvidenceNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchTasks = () => {
    learningApi.getActivePlan()
      .then((res: any) => {
        if (res.data?.phases) {
          const all: any[] = [];
          res.data.phases.forEach((p: any) => {
            if (p.tasks) all.push(...p.tasks);
          });
          setTasks(all);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSubmitEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTask) return;
    setSubmitting(true);
    try {
      await tasksApi.submitEvidence(activeTask.id, {
        type: 'GITHUB_REPO',
        urlOrReference: evidenceUrl,
        notes: evidenceNotes,
      });
      setSuccessMsg(`Evidence verified! Task "${activeTask.title}" completed. Skill proficiency updated and Digital Twin advanced.`);
      setActiveTask(null);
      setEvidenceUrl('');
      setEvidenceNotes('');
      fetchTasks();
    } catch (err: any) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'ALL') return true;
    return t.status === filter;
  });

  return (
    <div className="space-y-5 text-[#eff1f6]">
      <div className="bg-[#262626] border border-[#333333] rounded p-4 space-y-1">
        <div className="flex items-center space-x-2 text-xs font-semibold text-[#ffa116] uppercase tracking-wider">
          <CheckSquare className="w-3.5 h-3.5" />
          <span>Evidence-Based Task Execution</span>
        </div>
        <h1 className="text-lg font-bold text-[#eff1f6]">Task Workbench & Proof Submission</h1>
        <p className="text-xs text-[#9ca3af] max-w-2xl leading-relaxed">
          Submit verifiable repository links, notes, or lab test outcomes. Completing tasks with evidence directly advances your skill proficiencies and updates the Student Digital Twin.
        </p>
      </div>

      {successMsg && (
        <div className="p-3 bg-[#262626] border border-[#2cbb5d]/40 rounded text-xs text-[#eff1f6] flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#2cbb5d]" />
            {successMsg}
          </span>
          <button onClick={() => setSuccessMsg(null)} className="text-[#9ca3af] hover:text-white text-xs">
            Dismiss
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex space-x-1.5">
        {['ALL', 'NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              filter === f
                ? 'bg-[#333333] text-[#eff1f6] border border-[#444444]'
                : 'text-[#9ca3af] hover:text-[#eff1f6] hover:bg-[#262626]'
            }`}
          >
            {f.replace('_', ' ')}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center space-x-3 text-[#9ca3af]">
          <div className="w-5 h-5 border-2 border-[#ffa116] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs">Loading tasks...</span>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="p-8 text-center bg-[#262626] border border-[#333333] rounded text-xs text-[#9ca3af]">
          No tasks found matching filter "{filter}".
        </div>
      ) : (
        /* LeetCode Problem List Table */
        <div className="bg-[#262626] border border-[#333333] rounded overflow-hidden">
          <div className="grid grid-cols-12 px-4 py-2.5 bg-[#202020] border-b border-[#333333] text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wider">
            <div className="col-span-1">Status</div>
            <div className="col-span-6">Task Title</div>
            <div className="col-span-2">Skill Domain</div>
            <div className="col-span-1 text-center">Hours</div>
            <div className="col-span-2 text-right">Action</div>
          </div>

          <div className="divide-y divide-[#333333]">
            {filteredTasks.map((t) => (
              <div
                key={t.id}
                className="grid grid-cols-12 px-4 py-3 hover:bg-[#2c2c2c] transition-colors items-center text-xs"
              >
                <div className="col-span-1">
                  {t.status === 'COMPLETED' ? (
                    <span className="text-[#2cbb5d] font-mono text-[11px] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Done
                    </span>
                  ) : t.status === 'IN_PROGRESS' ? (
                    <span className="text-[#ffa116] font-mono text-[11px]">Active</span>
                  ) : (
                    <span className="text-[#71717a] font-mono text-[11px]">Todo</span>
                  )}
                </div>

                <div className="col-span-6 pr-4">
                  <div className="font-medium text-[#eff1f6] hover:text-[#ffa116] cursor-pointer">{t.title}</div>
                  <div className="text-[11px] text-[#9ca3af] truncate">{t.description}</div>
                  {t.evidences && t.evidences.length > 0 && (
                    <a
                      href={t.evidences[0].urlOrReference}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] text-[#ffa116] hover:underline flex items-center gap-1 mt-0.5"
                    >
                      <Github className="w-2.5 h-2.5" />
                      <span className="truncate">{t.evidences[0].urlOrReference}</span>
                    </a>
                  )}
                </div>

                <div className="col-span-2">
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#333333] text-[#eff1f6]">
                    {t.skillName || 'Capstone'}
                  </span>
                </div>

                <div className="col-span-1 text-center font-mono text-[11px] text-[#9ca3af]">
                  {t.estimatedHours}h
                </div>

                <div className="col-span-2 text-right">
                  {t.status !== 'COMPLETED' ? (
                    <button
                      onClick={() => {
                        setActiveTask(t);
                        setEvidenceUrl('https://github.com/alexchen-dev/sql-joins-practice');
                        setEvidenceNotes('Implemented indexing benchmarks and optimized multi-table joins.');
                      }}
                      className="px-2.5 py-1 bg-[#333333] hover:bg-[#ffa116] hover:text-black text-[#eff1f6] rounded text-xs font-medium transition-colors"
                    >
                      Submit Proof
                    </button>
                  ) : (
                    <span className="text-[11px] text-[#2cbb5d] font-mono font-medium">Verified ✓</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submit Evidence Modal (LeetCode Dark Dialog) */}
      {activeTask && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-[#262626] border border-[#333333] p-5 rounded max-w-md w-full space-y-4 shadow-xl text-[#eff1f6]">
            <div>
              <h3 className="text-sm font-semibold text-[#eff1f6]">Submit Proof: {activeTask.title}</h3>
              <p className="text-xs text-[#9ca3af] mt-0.5">
                Attach public GitHub repository or verifiable artifact to complete this milestone.
              </p>
            </div>

            <form onSubmit={handleSubmitEvidence} className="space-y-3.5">
              <div>
                <label className="text-xs text-[#9ca3af] block mb-1">GitHub Repository or Project Link</label>
                <input
                  type="url"
                  required
                  value={evidenceUrl}
                  onChange={(e) => setEvidenceUrl(e.target.value)}
                  placeholder="https://github.com/username/project-repo"
                  className="w-full bg-[#1e1e1e] border border-[#333333] rounded px-3 py-1.5 text-xs text-[#eff1f6] placeholder-[#666666] focus:outline-none focus:border-[#ffa116]"
                />
              </div>

              <div>
                <label className="text-xs text-[#9ca3af] block mb-1">Implementation Notes & Findings</label>
                <textarea
                  rows={3}
                  value={evidenceNotes}
                  onChange={(e) => setEvidenceNotes(e.target.value)}
                  placeholder="Document key trade-offs, algorithms used, and test metrics..."
                  className="w-full bg-[#1e1e1e] border border-[#333333] rounded px-3 py-1.5 text-xs text-[#eff1f6] placeholder-[#666666] focus:outline-none focus:border-[#ffa116]"
                />
              </div>

              <div className="flex space-x-2 pt-1">
                <button
                  type="button"
                  onClick={() => setActiveTask(null)}
                  className="flex-1 py-1.5 rounded bg-[#333333] hover:bg-[#3e3e3e] text-[#eff1f6] text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-1.5 rounded bg-[#ffa116] hover:bg-[#e08e14] text-black text-xs font-semibold"
                >
                  {submitting ? 'Verifying...' : 'Submit & Update Twin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
