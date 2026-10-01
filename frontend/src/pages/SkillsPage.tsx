import React, { useState, useEffect } from 'react';
import { skillsApi } from '../api/client';
import { GitFork, CheckCircle, AlertCircle, Plus, Sparkles, Layers } from 'lucide-react';

export const SkillsPage: React.FC = () => {
  const [skills, setSkills] = useState<any[]>([]);
  const [graph, setGraph] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editingSkill, setEditingSkill] = useState<any>(null);
  const [newProficiency, setNewProficiency] = useState(50);
  const [updating, setUpdating] = useState(false);

  const fetchSkillsData = () => {
    Promise.all([skillsApi.getMySkills(), skillsApi.getGraph()])
      .then(([myRes, graphRes]: any[]) => {
        if (myRes.data) setSkills(myRes.data);
        if (graphRes.data) setGraph(graphRes.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSkillsData();
  }, []);

  const handleUpdateProficiency = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill) return;
    setUpdating(true);
    try {
      await skillsApi.updateSkill({
        skillId: editingSkill.skillId,
        proficiency: newProficiency,
        confidenceScore: Math.min(100, newProficiency + 10),
      });
      setEditingSkill(null);
      fetchSkillsData();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center space-x-3 text-slate-400">
        <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm font-medium">Loading Skill Graph & Proficiencies...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 shadow-xl">
        <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
          <GitFork className="w-4 h-4" />
          <span>Competency Graph & Skill Matrix</span>
        </div>
        <h1 className="text-xl font-extrabold text-white">Verified Skills & Prerequisite Structure</h1>
        <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
          Explore your verified proficiencies and underlying dependency graph. Advanced competencies require satisfying foundational prerequisites first.
        </p>
      </div>

      {/* Prerequisite Dependencies Cards */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          <span>Skill Graph Dependency Rules (Prerequisite Chain)</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase">Target: Spring Boot</span>
            <div className="text-xs font-semibold text-slate-200">Prerequisite: Java OOP (≥60%)</div>
            <p className="text-[11px] text-slate-400">Blocks Spring Data and microservices if Java proficiency is inadequate.</p>
          </div>
          <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase">Target: PostgreSQL</span>
            <div className="text-xs font-semibold text-slate-200">Prerequisite: Relational SQL (≥65%)</div>
            <p className="text-[11px] text-slate-400">Requires mastering joins and normalization before index tuning.</p>
          </div>
          <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase">Target: System Design</span>
            <div className="text-xs font-semibold text-slate-200">Prerequisite: DSA & Complexity (≥55%)</div>
            <p className="text-[11px] text-slate-400">Requires complexity analysis fundamentals for caching and latency trade-offs.</p>
          </div>
          <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase">Target: Microservices</span>
            <div className="text-xs font-semibold text-slate-200">Prerequisite: REST APIs & Docker</div>
            <p className="text-[11px] text-slate-400">Containerization and stateless APIs required for distributed deployment.</p>
          </div>
        </div>
      </div>

      {/* Student Tracked Skills Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map((s) => (
          <div
            key={s.id}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {s.category}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  Assessed: {new Date(s.lastAssessedAt).toLocaleDateString()}
                </span>
              </div>
              <h4 className="text-base font-bold text-white">{s.skillName}</h4>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-400">Proficiency</span>
                  <span className="text-emerald-400">{s.proficiency}%</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all"
                    style={{ width: `${s.proficiency}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
              <span className="text-xs text-slate-400">
                Confidence: <strong className="text-slate-200">{s.confidenceScore}%</strong>
              </span>
              <button
                onClick={() => {
                  setEditingSkill(s);
                  setNewProficiency(s.proficiency);
                }}
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300"
              >
                Update Level
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Proficiency Modal */}
      {editingSkill && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white">Update Proficiency: {editingSkill.skillName}</h3>
            <form onSubmit={handleUpdateProficiency} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-2">
                  Proficiency Level ({newProficiency}%):
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={newProficiency}
                  onChange={(e) => setNewProficiency(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>
              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingSkill(null)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold"
                >
                  {updating ? 'Saving...' : 'Save & Advance Twin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
