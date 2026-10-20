import React, { useState, useEffect } from 'react';
import { digitalTwinApi } from '../api/client';
import { Cpu, Layers, History } from 'lucide-react';

export const DigitalTwinPage: React.FC = () => {
  const [twin, setTwin] = useState<any>(null);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      digitalTwinApi.getCurrentState(),
      digitalTwinApi.getTimeline()
    ])
      .then(([stateRes, timeRes]: any[]) => {
        if (stateRes.data) setTwin(stateRes.data);
        if (timeRes.data) setTimeline(timeRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center space-x-2 text-[#4b5563]">
        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs font-mono">Reconstructing Student Digital Twin...</span>
      </div>
    );
  }

  const features = twin?.features || {};

  const featureCards = [
    { label: 'Skill Proficiency', value: `${features.skillProficiency || 0}%`, desc: 'Target & core skills weighted mean' },
    { label: 'Consistency Score', value: `${features.consistencyScore || 0}%`, desc: 'Active execution habit regularities' },
    { label: 'Task Completion Rate', value: `${features.taskCompletionRate || 0}%`, desc: 'Completed vs assigned tasks' },
    { label: 'Learning Velocity', value: `${features.learningVelocity || 0} tasks/wk`, desc: 'Active pacing through roadmap phases' },
    { label: 'Project Portfolio', value: `${features.projectCount || 0} Projects`, desc: `Average complexity: ${features.projectQuality || 0}/10` },
    { label: 'Problem Solving (DSA)', value: `${features.problemSolvingScore || 0}%`, desc: 'Algorithmic code assessment mastery' },
    { label: 'Academic Baseline', value: `${features.academicScore || 0}%`, desc: 'Normalized university GPA metric' },
    { label: 'Mock Interview Score', value: `${features.interviewScore || 0}%`, desc: 'Technical & behavioral evaluation' },
    { label: 'Goal Alignment', value: `${features.careerGoalAlignment || 0}%`, desc: 'Convergence with primary target role' },
    { label: 'Opportunity Alignment', value: `${features.opportunityAlignment || 0}%`, desc: 'Active matching against industry posts' },
    { label: 'Failure Recovery Rate', value: `${features.failureRecoveryRate || 0}%`, desc: 'Remediated failures vs recorded' },
    { label: 'Experience Level', value: features.experienceLevel || 'INTERMEDIATE', desc: 'Synthesized domain proficiency tier' },
  ];

  return (
    <div className="space-y-4 text-[#111827]">
      {/* Header Banner */}
      <div className="bg-white border border-[#e5e7eb] rounded p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs font-bold text-black uppercase tracking-wider">
            <Cpu className="w-3.5 h-3.5" />
            <span>Autonomous State Representation</span>
          </div>
          <h1 className="text-lg font-bold text-[#111827]">Student Digital Twin Architecture</h1>
          <p className="text-xs text-[#6b7280] max-w-2xl leading-relaxed">
            Continuously updated model of your career state. Every completed task, submitted repository evidence, assessment failure, and interview outcome modifies this structured twin.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-[#f9fafb] p-2.5 rounded border border-[#e5e7eb] text-xs">
          <div className="text-center px-3 border-r border-[#e5e7eb]">
            <span className="text-[10px] text-[#6b7280] uppercase font-mono">Version</span>
            <div className="text-base font-bold font-mono text-black">v{twin?.currentVersion || 1}</div>
          </div>
          <div className="text-center px-3 border-r border-[#e5e7eb]">
            <span className="text-[10px] text-[#6b7280] uppercase font-mono">Readiness</span>
            <div className="text-base font-bold font-mono text-black">{twin?.overallReadiness || 0}%</div>
          </div>
          <div className="text-center px-3">
            <span className="text-[10px] text-[#6b7280] uppercase font-mono">Snapshots</span>
            <div className="text-base font-bold font-mono text-[#059669]">{twin?.snapshotHistory?.length || 1}</div>
          </div>
        </div>
      </div>

      {/* Feature Vector Model (Continuous Grid Panel) */}
      <div className="bg-white border border-[#e5e7eb] rounded overflow-hidden shadow-sm">
        <div className="px-4 py-3 border-b border-[#e5e7eb] flex items-center justify-between">
          <h2 className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-black" />
            <span>Digital Twin Feature Vector (18+ Normalized Parameters)</span>
          </h2>
          <span className="text-[11px] font-mono text-[#6b7280]">Mathematical Formulations</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#e5e7eb] border-b border-[#e5e7eb]">
          {featureCards.slice(0, 4).map((f, i) => (
            <div key={i} className="p-3.5 space-y-0.5 hover:bg-[#f9fafb] transition-colors">
              <div className="text-[11px] text-[#6b7280]">{f.label}</div>
              <div className="text-base font-bold font-mono text-[#111827]">{f.value}</div>
              <p className="text-[10px] text-[#9ca3af] truncate">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#e5e7eb] border-b border-[#e5e7eb]">
          {featureCards.slice(4, 8).map((f, i) => (
            <div key={i} className="p-3.5 space-y-0.5 hover:bg-[#f9fafb] transition-colors">
              <div className="text-[11px] text-[#6b7280]">{f.label}</div>
              <div className="text-base font-bold font-mono text-[#111827]">{f.value}</div>
              <p className="text-[10px] text-[#9ca3af] truncate">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#e5e7eb]">
          {featureCards.slice(8, 12).map((f, i) => (
            <div key={i} className="p-3.5 space-y-0.5 hover:bg-[#f9fafb] transition-colors">
              <div className="text-[11px] text-[#6b7280]">{f.label}</div>
              <div className="text-base font-bold font-mono text-[#111827]">{f.value}</div>
              <p className="text-[10px] text-[#9ca3af] truncate">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Snapshot Version Lineage & History */}
      <div className="bg-white border border-[#e5e7eb] rounded overflow-hidden shadow-sm">
        <div className="px-4 py-3 border-b border-[#e5e7eb] flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-2">
              <History className="w-3.5 h-3.5 text-black" />
              <span>Version Lineage & State Change History</span>
            </h3>
            <p className="text-[11px] text-[#6b7280]">
              Traceable chronological record of twin state progression (v1 → v2 → v3 → v4).
            </p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#f3f4f6] text-[#111827] border border-[#e5e7eb] font-semibold">
            IMMUTABLE
          </span>
        </div>

        <div className="divide-y divide-[#e5e7eb]">
          {twin?.snapshotHistory?.map((snap: any) => (
            <div
              key={snap.id}
              className="p-3.5 hover:bg-[#f9fafb] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] font-mono font-bold text-white px-1.5 py-0.5 rounded bg-black">
                    v{snap.version}
                  </span>
                  <span className="font-semibold text-[#111827] font-mono">
                    {snap.triggerEvent}
                  </span>
                </div>
                <p className="text-[11px] text-[#6b7280]">{snap.changeSummary}</p>
              </div>

              <div className="flex items-center space-x-4 flex-shrink-0 text-[#6b7280] text-[11px]">
                <div>
                  Readiness: <strong className="text-[#111827] font-mono">{snap.overallReadiness}%</strong>
                </div>
                <div className="text-[10px] text-[#9ca3af] font-mono">
                  {new Date(snap.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
