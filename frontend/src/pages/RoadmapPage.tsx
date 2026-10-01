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
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            <Map className="w-4 h-4" />
            <span>Closed-Loop Personalized Roadmap</span>
          </div>
          <h1 className="text-xl font-extrabold text-white">{plan.title}</h1>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">{plan.objective}</p>
        </div>

        <div className="flex items-center space-x-3 bg-slate-950/60 px-4 py-2.5 rounded-xl border border-slate-800 text-xs">
          <div>
            Plan Version: <strong className="text-emerald-400">v{plan.version}</strong>
          </div>
          <span className="text-slate-600">•</span>
          <div>
            Status: <strong className="text-white">{plan.status}</strong>
          </div>
        </div>
      </div>

      {/* Sequential Phases */}
      <div className="space-y-6">
        {plan.phases?.map((phase: any) => (
          <div
            key={phase.id}
            className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-extrabold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                    Phase {phase.phaseOrder}
                  </span>
                  <h3 className="text-base font-bold text-white">{phase.title}</h3>
                </div>
                <p className="text-xs text-slate-400">{phase.description}</p>
              </div>

              <div className="flex items-center space-x-3 text-xs text-slate-400 flex-shrink-0">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  {phase.durationWeeks} Weeks
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  phase.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400' :
                  phase.status === 'IN_PROGRESS' ? 'bg-indigo-500/20 text-indigo-400' :
                  'bg-slate-800 text-slate-400'
                }`}>
                  {phase.status}
                </span>
              </div>
            </div>

            {/* Tasks inside this Phase */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {phase.tasks?.map((task: any) => (
                <div
                  key={task.id}
                  className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {task.skillName || 'Applied Capstone'}
                      </span>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        task.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400' :
                        task.status === 'IN_PROGRESS' ? 'bg-indigo-500/20 text-indigo-400' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {task.status}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-200">{task.title}</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{task.description}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
                    <span className="text-[10px] text-slate-500">
                      Difficulty: {task.difficulty}/5 • Est: {task.estimatedHours}h
                    </span>
                    <Link
                      to="/tasks"
                      className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                    >
                      {task.status === 'COMPLETED' ? 'View Evidence' : 'Execute & Submit'}
                      <ArrowRight className="w-3 h-3" />
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
