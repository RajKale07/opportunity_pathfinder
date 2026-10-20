import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { learningApi } from '../api/client';
import { Map, Clock, ArrowRight } from 'lucide-react';

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
      <div className="flex h-96 items-center justify-center space-x-2 text-[#4b5563]">
        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs font-mono">Loading personalized adaptive roadmap...</span>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="p-12 text-center bg-white border border-[#e5e7eb] rounded space-y-4 max-w-lg mx-auto shadow-sm">
        <Map className="w-12 h-12 text-[#9ca3af] mx-auto" />
        <h2 className="text-lg font-bold text-[#111827]">No Active Roadmap Generated</h2>
        <p className="text-xs text-[#6b7280]">
          Select a target career path to analyze skill gaps and synthesize your personalized, evidence-backed learning roadmap.
        </p>
        <Link
          to="/career-paths"
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-black hover:bg-neutral-800 text-white rounded text-xs font-semibold shadow-sm"
        >
          <span>Select Career Path</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4 text-[#111827]">
      {/* Header Banner */}
      <div className="bg-white border border-[#e5e7eb] rounded p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs font-bold text-black uppercase tracking-wider">
            <Map className="w-3.5 h-3.5" />
            <span>Closed-Loop Personalized Roadmap</span>
          </div>
          <h1 className="text-lg font-bold text-[#111827]">{plan.title}</h1>
          <p className="text-xs text-[#6b7280] max-w-2xl leading-relaxed">{plan.objective}</p>
        </div>

        <div className="flex items-center space-x-3 bg-[#f9fafb] px-3 py-1.5 rounded border border-[#e5e7eb] text-xs">
          <div>
            Version: <strong className="text-black font-mono">v{plan.version}</strong>
          </div>
          <span className="text-[#d1d5db]">|</span>
          <div>
            Status: <strong className="text-[#111827] font-mono">{plan.status}</strong>
          </div>
        </div>
      </div>

      {/* Sequential Phases */}
      <div className="space-y-4">
        {plan.phases?.map((phase: any) => (
          <div
            key={phase.id}
            className="bg-white border border-[#e5e7eb] rounded overflow-hidden shadow-sm"
          >
            <div className="px-4 py-3 bg-[#f9fafb] border-b border-[#e5e7eb] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono font-bold text-white px-1.5 py-0.5 rounded bg-black">
                    Phase {phase.phaseOrder}
                  </span>
                  <h3 className="text-xs font-bold text-[#111827]">{phase.title}</h3>
                </div>
                <p className="text-[11px] text-[#6b7280]">{phase.description}</p>
              </div>

              <div className="flex items-center space-x-3 text-xs text-[#6b7280] flex-shrink-0">
                <span className="flex items-center gap-1 font-mono text-[11px]">
                  <Clock className="w-3 h-3 text-[#9ca3af]" />
                  {phase.durationWeeks} Weeks
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                  phase.status === 'COMPLETED' ? 'bg-[#ecfdf5] text-[#059669]' :
                  phase.status === 'IN_PROGRESS' ? 'bg-[#fffbeb] text-[#d97706]' :
                  'bg-[#f3f4f6] text-[#6b7280]'
                }`}>
                  {phase.status}
                </span>
              </div>
            </div>

            {/* Tasks inside this Phase (LeetCode Problem List Style) */}
            <div className="divide-y divide-[#e5e7eb]">
              {phase.tasks?.map((task: any) => (
                <div
                  key={task.id}
                  className="p-3.5 hover:bg-[#f9fafb] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#f3f4f6] text-[#374151] border border-[#e5e7eb]">
                        {task.skillName || 'Applied'}
                      </span>
                      <h4 className="text-xs font-semibold text-[#111827] truncate">{task.title}</h4>
                      <span className={`text-[10px] font-mono font-medium px-1.5 py-0.5 rounded ${
                        task.status === 'COMPLETED' ? 'bg-[#ecfdf5] text-[#059669]' :
                        task.status === 'IN_PROGRESS' ? 'bg-[#fffbeb] text-[#d97706]' :
                        'bg-[#f3f4f6] text-[#6b7280]'
                      }`}>
                        {task.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6b7280] line-clamp-1">{task.description}</p>
                  </div>

                  <div className="flex items-center space-x-4 flex-shrink-0">
                    <span className="text-[10px] text-[#9ca3af] font-mono">
                      Diff: {task.difficulty}/5 • {task.estimatedHours}h
                    </span>
                    <Link
                      to="/tasks"
                      className="px-2.5 py-1 rounded bg-black hover:bg-neutral-800 text-white text-xs font-semibold transition-colors"
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
