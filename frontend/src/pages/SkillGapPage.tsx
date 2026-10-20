import React, { useState, useEffect } from 'react';
import { careersApi, skillGapsApi } from '../api/client';
import { Target, ShieldAlert } from 'lucide-react';

export const SkillGapPage: React.FC = () => {
  const [careers, setCareers] = useState<any[]>([]);
  const [selectedCareerId, setSelectedCareerId] = useState<number>(1);
  const [gapReport, setGapReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    careersApi.getAll().then((res: any) => {
      if (res.data && res.data.length > 0) {
        setCareers(res.data);
        setSelectedCareerId(res.data[0].id);
      }
    });
  }, []);

  useEffect(() => {
    if (selectedCareerId) {
      setLoading(true);
      skillGapsApi.getReport(selectedCareerId)
        .then((res: any) => {
          if (res.data) setGapReport(res.data);
        })
        .finally(() => setLoading(false));
    }
  }, [selectedCareerId]);

  return (
    <div className="space-y-4 text-[#111827]">
      {/* Header */}
      <div className="bg-white border border-[#e5e7eb] rounded px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div>
          <div className="flex items-center space-x-2 text-[11px] font-mono font-bold text-black">
            <Target className="w-3.5 h-3.5" />
            <span>SKILL GAP DIAGNOSTIC ENGINE</span>
          </div>
          <h1 className="text-base font-bold text-[#111827] mt-0.5">Prerequisite & Competency Gap Diagnosis</h1>
          <p className="text-xs text-[#6b7280] mt-0.5">
            Compare target industry role standards against your current Student Digital Twin to pinpoint gaps.
          </p>
        </div>
      </div>

      {/* Role Filter Tabs (LeetCode Tag Style) */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
        {careers.map((c) => {
          const isSelected = selectedCareerId === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setSelectedCareerId(c.id)}
              className={`px-3 py-1.5 rounded text-xs whitespace-nowrap transition-colors ${
                isSelected
                  ? 'bg-black text-white font-semibold shadow-sm'
                  : 'bg-white text-[#4b5563] hover:text-black border border-[#e5e7eb]'
              }`}
            >
              {c.title}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center space-x-2 text-[#4b5563]">
          <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-mono">Computing gap matrix & blocker chains...</span>
        </div>
      ) : gapReport ? (
        <div className="space-y-4">
          {/* Summary Strip */}
          <div className="bg-white border border-[#e5e7eb] rounded grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#e5e7eb] shadow-sm">
            <div className="p-3.5">
              <span className="text-[11px] font-mono text-[#6b7280]">Required Skills</span>
              <div className="text-lg font-bold font-mono text-[#111827] mt-0.5">{gapReport.totalRequiredSkills}</div>
            </div>
            <div className="p-3.5">
              <span className="text-[11px] font-mono text-[#6b7280]">Target Met</span>
              <div className="text-lg font-bold font-mono text-[#059669] mt-0.5">{gapReport.readySkillsCount} Ready</div>
            </div>
            <div className="p-3.5">
              <span className="text-[11px] font-mono text-[#6b7280]">Identified Gaps</span>
              <div className="text-lg font-bold font-mono text-[#dc2626] mt-0.5">{gapReport.gapSkillsCount} Gaps</div>
            </div>
            <div className="p-3.5">
              <span className="text-[11px] font-mono text-[#6b7280]">Avg Deficit</span>
              <div className="text-lg font-bold font-mono text-[#111827] mt-0.5">{gapReport.averageGapPercentage}%</div>
            </div>
          </div>

          {/* Gaps List in LeetCode Table Style */}
          <div className="bg-white border border-[#e5e7eb] rounded overflow-hidden shadow-sm">
            <div className="px-4 py-2.5 border-b border-[#e5e7eb] flex items-center justify-between bg-[#f9fafb]">
              <span className="text-xs font-bold text-[#111827]">
                Competency Discrepancies for {gapReport.careerPathTitle}
              </span>
              <span className="text-[11px] font-mono text-[#6b7280]">Ranked by Severity</span>
            </div>

            <div className="divide-y divide-[#e5e7eb]">
              {gapReport.gaps?.map((g: any) => {
                const isHigh = g.priority === 'HIGH';
                const isMed = g.priority === 'MEDIUM';
                return (
                  <div key={g.skillId} className="p-4 hover:bg-[#f9fafb] transition-colors space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-[#111827]">{g.skillName}</span>
                        <span
                          className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded ${
                            isHigh
                              ? 'text-[#dc2626] bg-[#fef2f2] border border-[#fecaca]'
                              : isMed
                              ? 'text-[#d97706] bg-[#fffbeb] border border-[#fde68a]'
                              : 'text-[#4b5563] bg-[#f3f4f6] border border-[#e5e7eb]'
                          }`}
                        >
                          {g.priority}
                        </span>
                        {g.isPrerequisiteBlocker && (
                          <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-black text-white flex items-center gap-1 font-bold">
                            <ShieldAlert className="w-2.5 h-2.5" /> Prereq Blocker
                          </span>
                        )}
                      </div>

                      <div className="text-xs font-mono text-[#6b7280]">
                        Current: <span className="text-[#111827] font-semibold">{g.currentProficiency}%</span> • Target:{' '}
                        <span className="text-[#111827] font-semibold">{g.requiredProficiency}%</span> • Gap:{' '}
                        <span className="text-[#dc2626] font-bold">-{g.gapValue}%</span>
                      </div>
                    </div>

                    <p className="text-xs text-[#4b5563] leading-relaxed">{g.actionRecommendation}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
