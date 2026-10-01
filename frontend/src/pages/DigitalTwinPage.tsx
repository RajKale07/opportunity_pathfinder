import React, { useState, useEffect } from 'react';
import { digitalTwinApi } from '../api/client';
import { Cpu, GitCommit, Layers, Sparkles, TrendingUp, History, Shield, CheckCircle } from 'lucide-react';

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
      <div className="flex h-96 items-center justify-center space-x-3 text-slate-400">
        <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm font-medium">Reconstructing Student Digital Twin...</span>
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
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            <Cpu className="w-4 h-4" />
            <span>Autonomous State Representation</span>
          </div>
          <h1 className="text-xl font-extrabold text-white">Student Digital Twin Architecture</h1>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Continuously updated model of your career state. Every completed task, submitted repository evidence, assessment failure, and interview outcome modifies this structured twin.
          </p>
        </div>

        <div className="flex items-center space-x-4 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
          <div className="text-center px-3 border-r border-slate-800">
            <span className="text-[10px] text-slate-500 font-semibold uppercase">Version</span>
            <div className="text-lg font-extrabold text-emerald-400">v{twin?.currentVersion || 1}</div>
          </div>
          <div className="text-center px-3 border-r border-slate-800">
            <span className="text-[10px] text-slate-500 font-semibold uppercase">Readiness</span>
            <div className="text-lg font-extrabold text-white">{twin?.overallReadiness || 0}%</div>
          </div>
          <div className="text-center px-3">
            <span className="text-[10px] text-slate-500 font-semibold uppercase">Snapshots</span>
            <div className="text-lg font-extrabold text-indigo-400">{twin?.snapshotHistory?.length || 1}</div>
          </div>
        </div>
      </div>

      {/* Feature Vector Model (Section 8: Digital Twin Feature Model) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>Digital Twin Feature Vector (18+ Normalized Parameters)</span>
          </h2>
          <span className="text-xs text-slate-500">Transparent Mathematical Formulations</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {featureCards.map((f, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1 hover:border-slate-700 transition-colors">
              <span className="text-[11px] font-medium text-slate-400">{f.label}</span>
              <div className="text-lg font-extrabold text-white">{f.value}</div>
              <p className="text-[10px] text-slate-500 line-clamp-1">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Snapshot Version Lineage & History */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <History className="w-4 h-4 text-emerald-400" />
              <span>Version Lineage & State Change History</span>
            </h3>
            <p className="text-xs text-slate-400">
              Traceable record of how your digital twin evolved over time (v1 → v2 → v3 → v4).
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-medium">
            Audit Immutable
          </span>
        </div>

        <div className="space-y-3">
          {twin?.snapshotHistory?.map((snap: any) => (
            <div
              key={snap.id}
              className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                    Twin v{snap.version}
                  </span>
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
                    {snap.triggerEvent}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{snap.changeSummary}</p>
              </div>

              <div className="flex items-center space-x-4 flex-shrink-0 text-xs text-slate-400">
                <div>
                  Readiness: <strong className="text-white">{snap.overallReadiness}%</strong>
                </div>
                <div className="text-[11px] text-slate-500">
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
