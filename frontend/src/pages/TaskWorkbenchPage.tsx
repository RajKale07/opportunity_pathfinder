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
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 shadow-xl">
        <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
          <CheckSquare className="w-4 h-4" />
          <span>Evidence-Based Task Execution</span>
        </div>
        <h1 className="text-xl font-extrabold text-white">Task Workbench & Proof Submission</h1>
        <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
          Submit verifiable repository links, notes, or lab test outcomes. Completing tasks with evidence directly advances your skill proficiencies and updates the Student Digital Twin.
        </p>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            {successMsg}
          </span>
          <button onClick={() => setSuccessMsg(null)} className="text-slate-400 hover:text-white text-xs">
            Dismiss
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex space-x-2">
        {['ALL', 'NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === f
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {f.replace('_', ' ')}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center space-x-3 text-slate-400">
          <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium">Loading assigned tasks...</span>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl text-xs text-slate-400">
          No tasks found matching filter "{filter}".
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTasks.map((t) => (
            <div
              key={t.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {t.skillName || 'Capstone'}
                  </span>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                    t.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400' :
                    t.status === 'IN_PROGRESS' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {t.status}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white">{t.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{t.description}</p>
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    Est: {t.estimatedHours}h
                  </span>
                  <span>Priority: <strong className="text-white">{t.priority}</strong></span>
                </div>

                {t.evidences && t.evidences.length > 0 && (
                  <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Submitted Evidence:</div>
                    <a
                      href={t.evidences[0].urlOrReference}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-emerald-400 hover:underline flex items-center gap-1 truncate"
                    >
                      <Github className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{t.evidences[0].urlOrReference}</span>
                    </a>
                  </div>
                )}

                {t.status !== 'COMPLETED' ? (
                  <button
                    onClick={() => {
                      setActiveTask(t);
                      setEvidenceUrl('https://github.com/alexchen-dev/sql-joins-practice');
                      setEvidenceNotes('Implemented indexing benchmarks and optimized multi-table joins.');
                    }}
                    className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Submit Evidence & Complete</span>
                  </button>
                ) : (
                  <div className="text-center text-xs text-emerald-400 font-semibold flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verified Milestone Completed</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Submit Evidence Modal */}
      {activeTask && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white">Submit Evidence for: {activeTask.title}</h3>
            <p className="text-xs text-slate-400">
              Attach link to public GitHub repository or test outcome. Submitting valid evidence updates proficiency by +15%.
            </p>

            <form onSubmit={handleSubmitEvidence} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">GitHub Repository or Project Link</label>
                <input
                  type="url"
                  required
                  value={evidenceUrl}
                  onChange={(e) => setEvidenceUrl(e.target.value)}
                  placeholder="https://github.com/username/project-repo"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Implementation Notes & Findings</label>
                <textarea
                  rows={3}
                  value={evidenceNotes}
                  onChange={(e) => setEvidenceNotes(e.target.value)}
                  placeholder="Document key trade-offs, algorithms used, and test metrics..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTask(null)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold"
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
