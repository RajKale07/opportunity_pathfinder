import React, { useState, useEffect } from 'react';
import { learningApi, tasksApi } from '../api/client';
import { CheckSquare, Github, CheckCircle2 } from 'lucide-react';

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
    <div className="space-y-4 text-[#111827]">
      <div className="bg-white border border-[#e5e7eb] rounded p-4 space-y-1 shadow-sm">
        <div className="flex items-center space-x-2 text-xs font-bold text-black uppercase tracking-wider">
          <CheckSquare className="w-3.5 h-3.5" />
          <span>Evidence-Based Task Execution</span>
        </div>
        <h1 className="text-lg font-bold text-[#111827]">Task Workbench & Proof Submission</h1>
        <p className="text-xs text-[#6b7280] max-w-2xl leading-relaxed">
          Submit verifiable repository links, notes, or lab test outcomes. Completing tasks with evidence directly advances your skill proficiencies and updates the Student Digital Twin.
        </p>
      </div>

      {successMsg && (
        <div className="p-3 bg-white border border-black rounded text-xs text-[#111827] flex items-center justify-between shadow-sm">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#059669]" />
            {successMsg}
          </span>
          <button onClick={() => setSuccessMsg(null)} className="text-[#6b7280] hover:text-black text-xs font-medium">
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
            className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
              filter === f
                ? 'bg-black text-white shadow-sm'
                : 'bg-white text-[#4b5563] hover:text-black border border-[#e5e7eb]'
            }`}
          >
            {f.replace('_', ' ')}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center space-x-3 text-[#4b5563]">
          <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-mono">Loading tasks...</span>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="p-8 text-center bg-white border border-[#e5e7eb] rounded text-xs text-[#6b7280] shadow-sm">
          No tasks found matching filter "{filter}".
        </div>
      ) : (
        /* LeetCode Problem List Table */
        <div className="bg-white border border-[#e5e7eb] rounded overflow-hidden shadow-sm">
          <div className="grid grid-cols-12 px-4 py-2.5 bg-[#f9fafb] border-b border-[#e5e7eb] text-[11px] font-bold text-[#6b7280] uppercase tracking-wider font-mono">
            <div className="col-span-1">Status</div>
            <div className="col-span-6">Task Title</div>
            <div className="col-span-2">Skill Domain</div>
            <div className="col-span-1 text-center">Hours</div>
            <div className="col-span-2 text-right">Action</div>
          </div>

          <div className="divide-y divide-[#e5e7eb]">
            {filteredTasks.map((t) => (
              <div
                key={t.id}
                className="grid grid-cols-12 px-4 py-3 hover:bg-[#f9fafb] transition-colors items-center text-xs"
              >
                <div className="col-span-1">
                  {t.status === 'COMPLETED' ? (
                    <span className="text-[#059669] font-mono text-[11px] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Done
                    </span>
                  ) : t.status === 'IN_PROGRESS' ? (
                    <span className="text-[#d97706] font-mono text-[11px] font-bold">Active</span>
                  ) : (
                    <span className="text-[#9ca3af] font-mono text-[11px]">Todo</span>
                  )}
                </div>

                <div className="col-span-6 pr-4">
                  <div className="font-semibold text-[#111827] hover:underline cursor-pointer">{t.title}</div>
                  <div className="text-[11px] text-[#6b7280] truncate">{t.description}</div>
                  {t.evidences && t.evidences.length > 0 && (
                    <a
                      href={t.evidences[0].urlOrReference}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] text-black hover:underline flex items-center gap-1 mt-0.5 font-medium"
                    >
                      <Github className="w-2.5 h-2.5" />
                      <span className="truncate">{t.evidences[0].urlOrReference}</span>
                    </a>
                  )}
                </div>

                <div className="col-span-2">
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#f3f4f6] text-[#374151] border border-[#e5e7eb]">
                    {t.skillName || 'Capstone'}
                  </span>
                </div>

                <div className="col-span-1 text-center font-mono text-[11px] text-[#6b7280]">
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
                      className="px-2.5 py-1 bg-black hover:bg-neutral-800 text-white rounded text-xs font-semibold transition-colors shadow-sm"
                    >
                      Submit Proof
                    </button>
                  ) : (
                    <span className="text-[11px] text-[#059669] font-mono font-bold">Verified ✓</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submit Evidence Modal */}
      {activeTask && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-[#e5e7eb] p-5 rounded max-w-md w-full space-y-4 shadow-xl text-[#111827]">
            <div className="border-b border-[#e5e7eb] pb-2">
              <h3 className="text-sm font-bold text-[#111827]">Submit Proof: {activeTask.title}</h3>
              <p className="text-xs text-[#6b7280] mt-0.5">
                Attach public GitHub repository or verifiable artifact to complete this milestone.
              </p>
            </div>

            <form onSubmit={handleSubmitEvidence} className="space-y-3.5">
              <div>
                <label className="text-xs text-[#6b7280] font-semibold block mb-1">GitHub Repository or Project Link</label>
                <input
                  type="url"
                  required
                  value={evidenceUrl}
                  onChange={(e) => setEvidenceUrl(e.target.value)}
                  placeholder="https://github.com/username/project-repo"
                  className="w-full bg-[#f9fafb] border border-[#d1d5db] rounded px-3 py-1.5 text-xs text-[#111827] placeholder-[#9ca3af] focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="text-xs text-[#6b7280] font-semibold block mb-1">Implementation Notes & Findings</label>
                <textarea
                  rows={3}
                  value={evidenceNotes}
                  onChange={(e) => setEvidenceNotes(e.target.value)}
                  placeholder="Document key trade-offs, algorithms used, and test metrics..."
                  className="w-full bg-[#f9fafb] border border-[#d1d5db] rounded px-3 py-1.5 text-xs text-[#111827] placeholder-[#9ca3af] focus:outline-none focus:border-black"
                />
              </div>

              <div className="flex space-x-2 pt-1">
                <button
                  type="button"
                  onClick={() => setActiveTask(null)}
                  className="flex-1 py-1.5 rounded bg-[#f3f4f6] hover:bg-[#e5e7eb] text-[#111827] text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-1.5 rounded bg-black hover:bg-neutral-800 text-white text-xs font-semibold shadow-sm"
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
