import React, { useState, useEffect } from 'react';
import { careersApi, skillGapsApi } from '../api/client';
import { Target, AlertCircle, CheckCircle2, ShieldAlert, ArrowRight, ShieldCheck } from 'lucide-react';

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
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 shadow-xl">
        <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
          <Target className="w-4 h-4" />
          <span>Skill Gap Engine</span>
        </div>
        <h1 className="text-xl font-extrabold text-white">Prerequisite & Competency Gap Diagnosis</h1>
        <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
          The Skill Gap Engine compares target career standards against your current Student Digital Twin, identifying missing competencies, prerequisite blockers, and priority levels.
        </p>
      </div>

      {/* Career Selector Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-1">
        {careers.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCareerId(c.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCareerId === c.id
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {c.title}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center space-x-3 text-slate-400">
          <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium">Computing gap matrix & blocker chains...</span>
        </div>
      ) : gapReport ? (
        <div className="space-y-5">
          {/* Summary Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400">Required Skills</span>
              <div className="text-xl font-bold text-white">{gapReport.totalRequiredSkills}</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400">Target Standard Met</span>
              <div className="text-xl font-bold text-emerald-400">{gapReport.readySkillsCount} Ready</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400">Identified Gaps</span>
              <div className="text-xl font-bold text-rose-400">{gapReport.gapSkillsCount} Gaps</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400">Avg Deficit</span>
              <div className="text-xl font-bold text-white">{gapReport.averageGapPercentage}%</div>
            </div>
          </div>

          {/* Gaps List */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white">Skill Gap Breakdown for {gapReport.careerPathTitle}</h3>

            <div className="space-y-3">
              {gapReport.gaps?.map((g: any) => (
                <div
                  key={g.skillId}
                  className={`p-4 rounded-xl border transition-all ${
                    g.priority === 'HIGH' ? 'bg-rose-950/20 border-rose-500/30' :
                    g.priority === 'MEDIUM' ? 'bg-amber-950/20 border-amber-500/30' :
                    g.priority === 'LOW' ? 'bg-indigo-950/20 border-indigo-500/30' :
                    'bg-slate-950/60 border-slate-800'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center space-x-2.5">
                      <span className="text-sm font-bold text-white">{g.skillName}</span>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        g.priority === 'HIGH' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                        g.priority === 'MEDIUM' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        g.priority === 'LOW' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' :
                        'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        Priority: {g.priority}
                      </span>
                      {g.isPrerequisiteBlocker && (
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-rose-500 text-white flex items-center gap-1">
                          <ShieldAlert className="w-3 h-3" /> Prerequisite Blocker
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-300">
                      Current: <strong className="text-white">{g.currentProficiency}%</strong> • Target:{' '}
                      <strong className="text-white">{g.requiredProficiency}%</strong> • Gap:{' '}
                      <strong className="text-rose-400">-{g.gapValue}%</strong>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">{g.actionRecommendation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
