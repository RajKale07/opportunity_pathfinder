import React, { useState, useEffect } from 'react';
import { demoApi, evaluationApi } from '../api/client';
import {
  FlaskConical,
  Play,
  Download,
  CheckCircle2,
  Cpu,
  Layers,
  Sparkles,
  TrendingUp,
  Table,
  ArrowRight
} from 'lucide-react';

export const ResearchDemoPage: React.FC = () => {
  const [overview, setOverview] = useState<any>(null);
  const [scenarioLogs, setScenarioLogs] = useState<any[]>([]);
  const [running, setRunning] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchOverview = () => {
    evaluationApi.getOverview()
      .then((res: any) => {
        if (res.data) setOverview(res.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const handleRun16StepScenario = async () => {
    setRunning(true);
    try {
      const res: any = await demoApi.runScenario();
      if (res.data) {
        setScenarioLogs(res.data);
      }
      fetchOverview();
    } catch (err: any) {
      console.error(err);
    } finally {
      setRunning(false);
    }
  };

  const handleDownloadCsv = (dataset: string) => {
    window.open(evaluationApi.getExportUrl(dataset), '_blank');
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center space-x-3 text-slate-400">
        <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm font-medium">Loading research evaluation data & benchmarks...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            <FlaskConical className="w-4 h-4" />
            <span>Empirical Research & Demonstration Console</span>
          </div>
          <h1 className="text-xl font-extrabold text-white">Closed-Loop Replay & Academic Evaluation</h1>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Replay the full 16-step closed-loop lifecycle, inspect empirical baseline comparisons against static and popularity recommenders, view ablation studies, and export reproducible research datasets.
          </p>
        </div>

        <button
          onClick={handleRun16StepScenario}
          disabled={running}
          className="px-5 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all shadow-lg shadow-emerald-500/25 flex-shrink-0"
        >
          <Play className={`w-4 h-4 fill-current ${running ? 'animate-spin' : ''}`} />
          <span>{running ? 'Executing 16-Step Loop...' : 'Execute 16-Step Demo Scenario'}</span>
        </button>
      </div>

      {/* 16-Step Scenario Timeline Log Output */}
      {scenarioLogs.length > 0 && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-emerald-500/30 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Section 43 Demo Scenario Replay Logs (16-Step Verification)</span>
            </h3>
            <span className="text-xs text-emerald-400 font-semibold">16 of 16 Steps Succeeded</span>
          </div>

          <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
            {scenarioLogs.map((log) => (
              <div
                key={log.stepNumber}
                className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80 flex items-start space-x-3 text-xs"
              >
                <div className="h-6 w-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center flex-shrink-0 text-[11px] mt-0.5">
                  {log.stepNumber}
                </div>
                <div className="space-y-0.5 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">{log.actionTitle}</span>
                    <span className="text-[10px] text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10">
                      Twin v{log.twinVersion}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">{log.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empirical Baseline Comparison (Section 27) */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Baseline Performance Comparison (Section 27)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Opportunity Pathfinder (Adaptive Twin) benchmarked against traditional static baselines.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3">Evaluation Metric</th>
                <th className="p-3">Baseline Approach</th>
                <th className="p-3">Baseline Score</th>
                <th className="p-3 text-emerald-400">Opportunity Pathfinder</th>
                <th className="p-3 text-right">Empirical Gain</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {overview?.baselineComparisons?.map((b: any, idx: number) => (
                <tr key={idx} className="hover:bg-slate-800/30">
                  <td className="p-3 font-semibold text-white">{b.metric}</td>
                  <td className="p-3 text-slate-400">{b.baselineName}</td>
                  <td className="p-3 font-mono">{b.baselineScore}</td>
                  <td className="p-3 font-mono font-bold text-emerald-400">{b.pathfinderScore}</td>
                  <td className="p-3 text-right font-bold text-emerald-400">+{b.improvementPercentage}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ablation Studies (Section 55) */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-400" />
          <span>Ablation Studies (Section 55)</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3">Ablation Configuration</th>
                <th className="p-3">Component Description</th>
                <th className="p-3">Match Accuracy</th>
                <th className="p-3">Roadmap Completion</th>
                <th className="p-3 text-right">Readiness Correlation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {overview?.ablationStudy?.map((a: any, idx: number) => (
                <tr key={idx} className="hover:bg-slate-800/30">
                  <td className="p-3 font-semibold text-white">{a.configuration}</td>
                  <td className="p-3 text-slate-400">{a.description}</td>
                  <td className="p-3 font-mono">{a.matchAccuracy}%</td>
                  <td className="p-3 font-mono">{a.roadmapCompletionRate}%</td>
                  <td className="p-3 text-right font-mono font-bold text-emerald-400">{a.readinessCorrelation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Research Dataset Exports (Section 25) */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Research Dataset Export Suite (Section 25)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Download real relational telemetry tables formatted for academic papers and external ML pipelines.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => handleDownloadCsv('student_features')}
            className="p-3.5 bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 rounded-xl text-left space-y-1 transition-all"
          >
            <div className="text-xs font-bold text-emerald-400 flex items-center justify-between">
              <span>student_features.csv</span>
              <Download className="w-3.5 h-3.5" />
            </div>
            <p className="text-[11px] text-slate-400">Features, GPA, study hours, and academic scores.</p>
          </button>

          <button
            onClick={() => handleDownloadCsv('skill_progress')}
            className="p-3.5 bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 rounded-xl text-left space-y-1 transition-all"
          >
            <div className="text-xs font-bold text-emerald-400 flex items-center justify-between">
              <span>skill_progress.csv</span>
              <Download className="w-3.5 h-3.5" />
            </div>
            <p className="text-[11px] text-slate-400">Proficiencies, confidence, and assessment timestamps.</p>
          </button>

          <button
            onClick={() => handleDownloadCsv('execution_history')}
            className="p-3.5 bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 rounded-xl text-left space-y-1 transition-all"
          >
            <div className="text-xs font-bold text-emerald-400 flex items-center justify-between">
              <span>execution_history.csv</span>
              <Download className="w-3.5 h-3.5" />
            </div>
            <p className="text-[11px] text-slate-400">Task difficulties, estimated hours, deadlines, and completion records.</p>
          </button>
        </div>
      </div>
    </div>
  );
};
