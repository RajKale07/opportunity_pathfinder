import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { learningApi, tasksApi } from '../api/client';
import { Map, CheckCircle2, Clock, ArrowRight, Sparkles, Layers, ShieldCheck } from 'lucide-react';

export const RoadmapPage: React.FC = () => {
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchPlan = () => {
    learningApi.getActivePlan()
      .then((res: any) => {
        if (res.data) setPlan(res.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPlan();
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center space-x-3 text-slate-400">
        <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm font-medium">Loading personalized adaptive roadmap...</span>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl space-y-4 max-w-lg mx-auto">
        <Map className="w-12 h-12 text-slate-600 mx-auto" />
        <h2 className="text-lg font-bold text-white">No Active Roadmap Generated</h2>
        <p className="text-xs text-slate-400">
          Select a target career path to analyze skill gaps and synthesize your personalized, evidence-backed learning roadmap.
        </p>
        <Link
          to="/career-paths"
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold"
        >
          <span>Select Career Path</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5 text-[#eff1f6]">
      {/* Header Banner */}
      <div className="bg-[#262626] border border-[#333333] rounded p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#ffa116] uppercase tracking-wider">
            <Map className="w-3.5 h-3.5" />
            <span>Closed-Loop Personalized Roadmap</span>
          </div>
          <h1 className="text-lg font-bold text-[#eff1f6]">{plan.title}</h1>
          <p className="text-xs text-[#9ca3af] max-w-2xl leading-relaxed">{plan.objective}</p>
        </div>

        <div className="flex items-center space-x-3 bg-[#1e1e1e] px-3 py-1.5 rounded border border-[#333333] text-xs">
          <div>
            Version: <strong className="text-[#ffa116] font-mono">v{plan.version}</strong>
          </div>
          <span className="text-[#444444]">|</span>
          <div>
            Status: <strong className="text-[#eff1f6] font-mono">{plan.status}</strong>
          </div>
        </div>
      </div>

      {/* Sequential Phases */}
      <div className="space-y-4">
        {plan.phases?.map((phase: any) => (
          <div
            key={phase.id}
            className="bg-[#262626] border border-[#333333] rounded overflow-hidden"
          >
            <div className="px-4 py-3 bg-[#222222] border-b border-[#333333] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono font-semibold text-black px-1.5 py-0.2 rounded bg-[#ffa116]">
                    Phase {phase.phaseOrder}
                  </span>
                  <h3 className="text-xs font-semibold text-[#eff1f6]">{phase.title}</h3>
                </div>
                <p className="text-[11px] text-[#9ca3af]">{phase.description}</p>
              </div>

              <div className="flex items-center space-x-3 text-xs text-[#9ca3af] flex-shrink-0">
                <span className="flex items-center gap-1 font-mono text-[11px]">
                  <Clock className="w-3 h-3 text-[#71717a]" />
                  {phase.durationWeeks} Weeks
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                  phase.status === 'COMPLETED' ? 'bg-[#2cbb5d]/10 text-[#2cbb5d]' :
                  phase.status === 'IN_PROGRESS' ? 'bg-[#ffa116]/10 text-[#ffa116]' :
                  'bg-[#333333] text-[#9ca3af]'
                }`}>
                  {phase.status}
                </span>
              </div>
            </div>

            {/* Tasks inside this Phase (LeetCode Problem List Style) */}
            <div className="divide-y divide-[#333333]">
              {phase.tasks?.map((task: any) => (
                <div
                  key={task.id}
                  className="p-3.5 hover:bg-[#2c2c2c] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#333333] text-[#9ca3af]">
                        {task.skillName || 'Applied'}
                      </span>
                      <h4 className="text-xs font-medium text-[#eff1f6] truncate">{task.title}</h4>
                      <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                        task.status === 'COMPLETED' ? 'bg-[#2cbb5d]/10 text-[#2cbb5d]' :
                        task.status === 'IN_PROGRESS' ? 'bg-[#ffa116]/10 text-[#ffa116]' :
                        'bg-[#333333] text-[#9ca3af]'
                      }`}>
                        {task.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#9ca3af] line-clamp-1">{task.description}</p>
                  </div>

                  <div className="flex items-center space-x-4 flex-shrink-0">
                    <span className="text-[10px] text-[#71717a] font-mono">
                      Diff: {task.difficulty}/5 • {task.estimatedHours}h
                    </span>
                    <Link
                      to="/tasks"
                      className="px-2.5 py-1 rounded bg-[#333333] hover:bg-[#ffa116] hover:text-black text-[#eff1f6] text-xs font-medium transition-colors"
                    >
                      {task.status === 'COMPLETED' ? 'Evidence' : 'Execute'}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
