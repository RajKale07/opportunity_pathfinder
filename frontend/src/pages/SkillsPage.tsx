import React, { useState, useEffect } from 'react';
import { skillsApi } from '../api/client';
import { GitFork, Layers, CheckCircle2, ChevronRight, SlidersHorizontal } from 'lucide-react';

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
      <div className="flex h-96 items-center justify-center space-x-2 text-[#9ca3af]">
        <div className="w-4 h-4 border-2 border-[#ffa116] border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs font-mono">Loading skill matrix & dependency graph...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-[#262626] border border-[#333333] rounded px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2 text-[11px] font-mono text-[#ffa116]">
            <GitFork className="w-3.5 h-3.5" />
            <span>COMPETENCY GRAPH & SKILL MATRIX</span>
          </div>
          <h1 className="text-base font-semibold text-[#eff1f6] mt-0.5">Verified Skills & Prerequisite Structure</h1>
          <p className="text-xs text-[#9ca3af] mt-0.5">
            Explore verified proficiencies and foundational dependency rules.
          </p>
        </div>
        <div className="text-right font-mono text-xs text-[#9ca3af]">
          Total Verified: <span className="text-[#eff1f6] font-bold">{skills.length}</span>
        </div>
      </div>

      {/* Prerequisite Dependencies Table / Strip */}
      <div className="bg-[#262626] border border-[#333333] rounded overflow-hidden">
        <div className="px-4 py-2.5 border-b border-[#333333] flex items-center justify-between">
          <span className="text-xs font-semibold text-[#eff1f6] flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#ffa116]" />
            Prerequisite Dependency Rules (Prerequisite Chain)
          </span>
          <span className="text-[11px] font-mono text-[#9ca3af]">DAG Enforcement</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#333333]">
          <div className="p-3.5 space-y-1">
            <div className="text-[10px] font-mono uppercase text-[#ffa116]">Target: Spring Boot</div>
            <div className="text-xs font-medium text-[#eff1f6]">Prereq: Java OOP (≥60%)</div>
            <p className="text-[11px] text-[#9ca3af]">Blocks Spring Data and microservices if Java proficiency is inadequate.</p>
          </div>
          <div className="p-3.5 space-y-1">
            <div className="text-[10px] font-mono uppercase text-[#ffa116]">Target: PostgreSQL</div>
            <div className="text-xs font-medium text-[#eff1f6]">Prereq: Relational SQL (≥65%)</div>
            <p className="text-[11px] text-[#9ca3af]">Requires mastering joins and normalization before index tuning.</p>
          </div>
          <div className="p-3.5 space-y-1">
            <div className="text-[10px] font-mono uppercase text-[#ffa116]">Target: System Design</div>
            <div className="text-xs font-medium text-[#eff1f6]">Prereq: DSA & Complexity (≥55%)</div>
            <p className="text-[11px] text-[#9ca3af]">Requires complexity analysis fundamentals for caching and latency trade-offs.</p>
          </div>
          <div className="p-3.5 space-y-1">
            <div className="text-[10px] font-mono uppercase text-[#ffa116]">Target: Microservices</div>
            <div className="text-xs font-medium text-[#eff1f6]">Prereq: REST APIs & Docker</div>
            <p className="text-[11px] text-[#9ca3af]">Containerization and stateless APIs required for distributed deployment.</p>
          </div>
        </div>
      </div>

      {/* LeetCode Style Problem/Skill List Table */}
      <div className="bg-[#262626] border border-[#333333] rounded overflow-hidden">
        <div className="px-4 py-2.5 border-b border-[#333333] flex items-center justify-between">
          <span className="text-xs font-semibold text-[#eff1f6]">Tracked Competencies</span>
          <span className="text-[11px] font-mono text-[#9ca3af]">Updated Real-Time via Digital Twin</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#333333] text-[#9ca3af] font-mono text-[11px]">
                <th className="py-2.5 px-4 font-normal w-12 text-center">#</th>
                <th className="py-2.5 px-4 font-normal">Skill / Competency</th>
                <th className="py-2.5 px-4 font-normal">Category</th>
                <th className="py-2.5 px-4 font-normal w-48">Proficiency</th>
                <th className="py-2.5 px-4 font-normal text-center">Confidence</th>
                <th className="py-2.5 px-4 font-normal">Last Assessed</th>
                <th className="py-2.5 px-4 font-normal text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#333333]">
              {skills.map((s, idx) => {
                const isHigh = s.proficiency >= 70;
                const isMed = s.proficiency >= 40 && s.proficiency < 70;
                return (
                  <tr key={s.id} className="hover:bg-[#2e2e2e] transition-colors">
                    <td className="py-3 px-4 text-center font-mono text-[#9ca3af]">{idx + 1}</td>
                    <td className="py-3 px-4 font-medium text-[#eff1f6]">{s.skillName}</td>
                    <td className="py-3 px-4">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#333333] text-[#9ca3af]">
                        {s.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 h-1.5 bg-[#333333] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              isHigh ? 'bg-[#2cbb5d]' : isMed ? 'bg-[#ffc01e]' : 'bg-[#ef4743]'
                            }`}
                            style={{ width: `${s.proficiency}%` }}
                          />
                        </div>
                        <span
                          className={`font-mono text-xs font-semibold w-9 text-right ${
                            isHigh ? 'text-[#2cbb5d]' : isMed ? 'text-[#ffc01e]' : 'text-[#ef4743]'
                          }`}
                        >
                          {s.proficiency}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-[#9ca3af]">{s.confidenceScore}%</td>
                    <td className="py-3 px-4 font-mono text-[#9ca3af]">
                      {new Date(s.lastAssessedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setEditingSkill(s);
                          setNewProficiency(s.proficiency);
                        }}
                        className="px-2.5 py-1 bg-[#333333] hover:bg-[#3d3d3d] text-[#ffa116] rounded text-[11px] font-medium transition-colors"
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Proficiency Modal */}
      {editingSkill && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-[#262626] border border-[#333333] p-5 rounded max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#333333] pb-2">
              <h3 className="text-xs font-semibold text-[#eff1f6]">Update Level: {editingSkill.skillName}</h3>
              <span className="text-[11px] font-mono text-[#ffa116]">{newProficiency}%</span>
            </div>
            <form onSubmit={handleUpdateProficiency} className="space-y-4">
              <div>
                <label className="text-xs text-[#9ca3af] block mb-2">Adjust Proficiency Level:</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={newProficiency}
                  onChange={(e) => setNewProficiency(Number(e.target.value))}
                  className="w-full accent-[#ffa116]"
                />
              </div>
              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingSkill(null)}
                  className="flex-1 py-1.5 rounded bg-[#333333] hover:bg-[#3d3d3d] text-[#eff1f6] text-xs font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 py-1.5 rounded bg-[#ffa116] hover:bg-[#ffb03a] text-black text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  {updating ? 'Saving...' : 'Save & Sync'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
