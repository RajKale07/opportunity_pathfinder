import React, { useState, useEffect } from 'react';
import { skillsApi } from '../api/client';
import { GitFork, Layers } from 'lucide-react';

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
      <div className="flex h-96 items-center justify-center space-x-2 text-[#4b5563]">
        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs font-mono">Loading skill matrix & dependency graph...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4 text-[#111827]">
      {/* Header */}
      <div className="bg-white border border-[#e5e7eb] rounded px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div>
          <div className="flex items-center space-x-2 text-[11px] font-mono font-bold text-black">
            <GitFork className="w-3.5 h-3.5" />
            <span>COMPETENCY GRAPH & SKILL MATRIX</span>
          </div>
          <h1 className="text-base font-bold text-[#111827] mt-0.5">Verified Skills & Prerequisite Structure</h1>
          <p className="text-xs text-[#6b7280] mt-0.5">
            Explore verified proficiencies and foundational dependency rules.
          </p>
        </div>
        <div className="text-right font-mono text-xs text-[#6b7280]">
          Total Verified: <span className="text-[#111827] font-bold">{skills.length}</span>
        </div>
      </div>

      {/* Prerequisite Dependencies Table / Strip */}
      <div className="bg-white border border-[#e5e7eb] rounded overflow-hidden shadow-sm">
        <div className="px-4 py-2.5 border-b border-[#e5e7eb] flex items-center justify-between bg-[#f9fafb]">
          <span className="text-xs font-bold text-[#111827] flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-black" />
            Prerequisite Dependency Rules (Prerequisite Chain)
          </span>
          <span className="text-[11px] font-mono text-[#6b7280]">DAG Enforcement</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#e5e7eb]">
          <div className="p-3.5 space-y-1">
            <div className="text-[10px] font-mono uppercase font-bold text-black">Target: Spring Boot</div>
            <div className="text-xs font-semibold text-[#111827]">Prereq: Java OOP (≥60%)</div>
            <p className="text-[11px] text-[#6b7280]">Blocks Spring Data and microservices if Java proficiency is inadequate.</p>
          </div>
          <div className="p-3.5 space-y-1">
            <div className="text-[10px] font-mono uppercase font-bold text-black">Target: PostgreSQL</div>
            <div className="text-xs font-semibold text-[#111827]">Prereq: Relational SQL (≥65%)</div>
            <p className="text-[11px] text-[#6b7280]">Requires mastering joins and normalization before index tuning.</p>
          </div>
          <div className="p-3.5 space-y-1">
            <div className="text-[10px] font-mono uppercase font-bold text-black">Target: System Design</div>
            <div className="text-xs font-semibold text-[#111827]">Prereq: DSA & Complexity (≥55%)</div>
            <p className="text-[11px] text-[#6b7280]">Requires complexity analysis fundamentals for caching and latency trade-offs.</p>
          </div>
          <div className="p-3.5 space-y-1">
            <div className="text-[10px] font-mono uppercase font-bold text-black">Target: Microservices</div>
            <div className="text-xs font-semibold text-[#111827]">Prereq: REST APIs & Docker</div>
            <p className="text-[11px] text-[#6b7280]">Containerization and stateless APIs required for distributed deployment.</p>
          </div>
        </div>
      </div>

      {/* LeetCode Style Problem/Skill List Table */}
      <div className="bg-white border border-[#e5e7eb] rounded overflow-hidden shadow-sm">
        <div className="px-4 py-2.5 border-b border-[#e5e7eb] flex items-center justify-between bg-[#f9fafb]">
          <span className="text-xs font-bold text-[#111827]">Tracked Competencies</span>
          <span className="text-[11px] font-mono text-[#6b7280]">Updated Real-Time via Digital Twin</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#e5e7eb] text-[#6b7280] font-mono text-[11px] bg-[#f9fafb]">
                <th className="py-2.5 px-4 font-semibold w-12 text-center">#</th>
                <th className="py-2.5 px-4 font-semibold">Skill / Competency</th>
                <th className="py-2.5 px-4 font-semibold">Category</th>
                <th className="py-2.5 px-4 font-semibold w-48">Proficiency</th>
                <th className="py-2.5 px-4 font-semibold text-center">Confidence</th>
                <th className="py-2.5 px-4 font-semibold">Last Assessed</th>
                <th className="py-2.5 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e7eb]">
              {skills.map((s, idx) => {
                const isHigh = s.proficiency >= 70;
                const isMed = s.proficiency >= 40 && s.proficiency < 70;
                return (
                  <tr key={s.id} className="hover:bg-[#f9fafb] transition-colors">
                    <td className="py-3 px-4 text-center font-mono text-[#6b7280]">{idx + 1}</td>
                    <td className="py-3 px-4 font-semibold text-[#111827]">{s.skillName}</td>
                    <td className="py-3 px-4">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#f3f4f6] text-[#374151] border border-[#e5e7eb]">
                        {s.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 h-1.5 bg-[#e5e7eb] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              isHigh ? 'bg-[#059669]' : isMed ? 'bg-[#d97706]' : 'bg-[#dc2626]'
                            }`}
                            style={{ width: `${s.proficiency}%` }}
                          />
                        </div>
                        <span
                          className={`font-mono text-xs font-bold w-9 text-right ${
                            isHigh ? 'text-[#059669]' : isMed ? 'text-[#d97706]' : 'text-[#dc2626]'
                          }`}
                        >
                          {s.proficiency}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-[#111827] font-semibold">{s.confidenceScore}%</td>
                    <td className="py-3 px-4 font-mono text-[#6b7280]">
                      {new Date(s.lastAssessedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setEditingSkill(s);
                          setNewProficiency(s.proficiency);
                        }}
                        className="px-2.5 py-1 bg-black hover:bg-neutral-800 text-white rounded text-[11px] font-semibold transition-colors"
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
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-[#e5e7eb] p-5 rounded max-w-sm w-full space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#e5e7eb] pb-2">
              <h3 className="text-xs font-bold text-[#111827]">Update Level: {editingSkill.skillName}</h3>
              <span className="text-[11px] font-mono font-bold text-black">{newProficiency}%</span>
            </div>
            <form onSubmit={handleUpdateProficiency} className="space-y-4">
              <div>
                <label className="text-xs text-[#6b7280] block mb-2">Adjust Proficiency Level:</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={newProficiency}
                  onChange={(e) => setNewProficiency(Number(e.target.value))}
                  className="w-full accent-black"
                />
              </div>
              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingSkill(null)}
                  className="flex-1 py-1.5 rounded bg-[#f3f4f6] hover:bg-[#e5e7eb] text-[#111827] text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 py-1.5 rounded bg-black hover:bg-neutral-800 text-white text-xs font-semibold transition-colors disabled:opacity-50"
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
