import React, { useState, useEffect } from 'react';
import { careersApi, skillGapsApi } from '../api/client';
import { Target, AlertCircle, ShieldAlert, ArrowRight } from 'lucide-react';

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
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-[#262626] border border-[#333333] rounded px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2 text-[11px] font-mono text-[#ffa116]">
            <Target className="w-3.5 h-3.5" />
            <span>SKILL GAP DIAGNOSTIC ENGINE</span>
          </div>
          <h1 className="text-base font-semibold text-[#eff1f6] mt-0.5">Prerequisite & Competency Gap Diagnosis</h1>
          <p className="text-xs text-[#9ca3af] mt-0.5">
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
                  ? 'bg-[#ffa116] text-black font-semibold'
                  : 'bg-[#262626] text-[#9ca3af] hover:text-[#eff1f6] border border-[#333333]'
              }`}
            >
              {c.title}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center space-x-2 text-[#9ca3af]">
          <div className="w-4 h-4 border-2 border-[#ffa116] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-mono">Computing gap matrix & blocker chains...</span>
        </div>
      ) : gapReport ? (
        <div className="space-y-4">
          {/* Summary Strip */}
          <div className="bg-[#262626] border border-[#333333] rounded grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#333333]">
            <div className="p-3.5">
              <span className="text-[11px] font-mono text-[#9ca3af]">Required Skills</span>
              <div className="text-lg font-bold font-mono text-[#eff1f6] mt-0.5">{gapReport.totalRequiredSkills}</div>
            </div>
            <div className="p-3.5">
              <span className="text-[11px] font-mono text-[#9ca3af]">Target Met</span>
              <div className="text-lg font-bold font-mono text-[#2cbb5d] mt-0.5">{gapReport.readySkillsCount} Ready</div>
            </div>
            <div className="p-3.5">
              <span className="text-[11px] font-mono text-[#9ca3af]">Identified Gaps</span>
              <div className="text-lg font-bold font-mono text-[#ef4743] mt-0.5">{gapReport.gapSkillsCount} Gaps</div>
            </div>
            <div className="p-3.5">
              <span className="text-[11px] font-mono text-[#9ca3af]">Avg Deficit</span>
              <div className="text-lg font-bold font-mono text-[#eff1f6] mt-0.5">{gapReport.averageGapPercentage}%</div>
            </div>
          </div>

          {/* Gaps List in LeetCode Table Style */}
          <div className="bg-[#262626] border border-[#333333] rounded overflow-hidden">
            <div className="px-4 py-2.5 border-b border-[#333333] flex items-center justify-between">
              <span className="text-xs font-semibold text-[#eff1f6]">
                Competency Discrepancies for {gapReport.careerPathTitle}
              </span>
              <span className="text-[11px] font-mono text-[#9ca3af]">Ranked by Severity</span>
            </div>

            <div className="divide-y divide-[#333333]">
              {gapReport.gaps?.map((g: any) => {
                const isHigh = g.priority === 'HIGH';
                const isMed = g.priority === 'MEDIUM';
                return (
                  <div key={g.skillId} className="p-4 hover:bg-[#2e2e2e] transition-colors space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-semibold text-[#eff1f6]">{g.skillName}</span>
                        <span
                          className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded ${
                            isHigh
                              ? 'text-[#ef4743] bg-[#ef4743]/10 border border-[#ef4743]/30'
                              : isMed
                              ? 'text-[#ffc01e] bg-[#ffc01e]/10 border border-[#ffc01e]/30'
                              : 'text-[#9ca3af] bg-[#333333]'
                          }`}
                        >
                          {g.priority}
                        </span>
                        {g.isPrerequisiteBlocker && (
                          <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#ef4743] text-white flex items-center gap-1">
                            <ShieldAlert className="w-2.5 h-2.5" /> Prereq Blocker
                          </span>
                        )}
                      </div>

                      <div className="text-xs font-mono text-[#9ca3af]">
                        Current: <span className="text-[#eff1f6]">{g.currentProficiency}%</span> • Target:{' '}
                        <span className="text-[#eff1f6]">{g.requiredProficiency}%</span> • Gap:{' '}
                        <span className="text-[#ef4743]">-{g.gapValue}%</span>
                      </div>
                    </div>

                    <p className="text-xs text-[#9ca3af] leading-relaxed">{g.actionRecommendation}</p>
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
