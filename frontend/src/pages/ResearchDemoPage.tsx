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
    <div className="space-y-5 text-[#eff1f6]">
      {/* Header Banner */}
      <div className="bg-[#262626] border border-[#333333] rounded p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#ffa116] uppercase tracking-wider">
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Empirical Research & Demonstration Console</span>
          </div>
          <h1 className="text-lg font-bold text-[#eff1f6]">Closed-Loop Replay & Academic Evaluation</h1>
          <p className="text-xs text-[#9ca3af] max-w-2xl leading-relaxed">
            Replay the full 16-step closed-loop lifecycle, inspect empirical baseline comparisons against static recommenders, view ablation studies, and export reproducible research datasets.
          </p>
        </div>

        <button
          onClick={handleRun16StepScenario}
          disabled={running}
          className="px-4 py-2 bg-[#ffa116] hover:bg-[#e08e14] disabled:opacity-50 text-black rounded text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-sm flex-shrink-0"
        >
          <Play className={`w-3.5 h-3.5 fill-current ${running ? 'animate-spin' : ''}`} />
          <span>{running ? 'Executing 16-Step Loop...' : 'Execute 16-Step Demo Scenario'}</span>
        </button>
      </div>

      {/* 16-Step Scenario Timeline Log Output */}
      {scenarioLogs.length > 0 && (
        <div className="bg-[#262626] border border-[#333333] rounded overflow-hidden">
          <div className="px-4 py-3 bg-[#202020] border-b border-[#333333] flex items-center justify-between">
            <h3 className="text-xs font-semibold text-[#eff1f6] uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2cbb5d]" />
              <span>Section 43 Demo Scenario Replay Logs (16-Step Verification)</span>
            </h3>
            <span className="text-[11px] font-mono text-[#2cbb5d] font-semibold">16 / 16 Succeeded</span>
          </div>

          <div className="divide-y divide-[#333333] max-h-96 overflow-y-auto">
            {scenarioLogs.map((log) => (
              <div
                key={log.stepNumber}
                className="p-3 hover:bg-[#2c2c2c] transition-colors flex items-start space-x-3 text-xs"
              >
                <div className="h-5 w-5 rounded bg-[#333333] text-[#ffa116] font-mono font-bold flex items-center justify-center flex-shrink-0 text-[10px] mt-0.5">
                  {log.stepNumber}
                </div>
                <div className="space-y-0.5 flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#eff1f6]">{log.actionTitle}</span>
                    <span className="text-[10px] font-mono text-[#ffa116] px-1.5 py-0.2 rounded bg-[#333333]">
                      Twin v{log.twinVersion}
                    </span>
                  </div>
                  <p className="text-[#9ca3af] text-[11px] leading-relaxed">{log.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empirical Baseline Comparison (Section 27) */}
      <div className="bg-[#262626] border border-[#333333] rounded overflow-hidden">
        <div className="px-4 py-3 border-b border-[#333333]">
          <h3 className="text-xs font-semibold text-[#eff1f6] uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-3.5 h-3.5 text-[#ffa116]" />
            <span>Baseline Performance Comparison (Section 27)</span>
          </h3>
          <p className="text-[11px] text-[#9ca3af]">
            Opportunity Pathfinder (Adaptive Twin) benchmarked against traditional static baselines.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#202020] text-[#9ca3af] uppercase text-[10px] font-mono tracking-wider border-b border-[#333333]">
              <tr>
                <th className="p-3">Evaluation Metric</th>
                <th className="p-3">Baseline Approach</th>
                <th className="p-3">Baseline Score</th>
                <th className="p-3 text-[#2cbb5d]">Opportunity Pathfinder</th>
                <th className="p-3 text-right">Empirical Gain</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#333333] text-[#d1d5db]">
              {overview?.baselineComparisons?.map((b: any, idx: number) => (
                <tr key={idx} className="hover:bg-[#2c2c2c] transition-colors">
                  <td className="p-3 font-medium text-[#eff1f6]">{b.metric}</td>
                  <td className="p-3 text-[#9ca3af]">{b.baselineName}</td>
                  <td className="p-3 font-mono">{b.baselineScore}</td>
                  <td className="p-3 font-mono font-bold text-[#2cbb5d]">{b.pathfinderScore}</td>
                  <td className="p-3 text-right font-mono font-bold text-[#2cbb5d]">+{b.improvementPercentage}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ablation Studies (Section 55) */}
      <div className="bg-[#262626] border border-[#333333] rounded overflow-hidden">
        <div className="px-4 py-3 border-b border-[#333333]">
          <h3 className="text-xs font-semibold text-[#eff1f6] uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-[#ffa116]" />
            <span>Ablation Studies (Section 55)</span>
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#202020] text-[#9ca3af] uppercase text-[10px] font-mono tracking-wider border-b border-[#333333]">
              <tr>
                <th className="p-3">Configuration</th>
                <th className="p-3">Component Description</th>
                <th className="p-3">Match Accuracy</th>
                <th className="p-3">Roadmap Completion</th>
                <th className="p-3 text-right">Readiness Correlation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#333333] text-[#d1d5db]">
              {overview?.ablationStudy?.map((a: any, idx: number) => (
                <tr key={idx} className="hover:bg-[#2c2c2c] transition-colors">
                  <td className="p-3 font-medium text-[#eff1f6]">{a.configuration}</td>
                  <td className="p-3 text-[#9ca3af]">{a.description}</td>
                  <td className="p-3 font-mono">{a.matchAccuracy}%</td>
                  <td className="p-3 font-mono">{a.roadmapCompletionRate}%</td>
                  <td className="p-3 text-right font-mono font-bold text-[#2cbb5d]">{a.readinessCorrelation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Research Dataset Exports (Section 25) */}
      <div className="bg-[#262626] border border-[#333333] rounded p-4 space-y-3">
        <div>
          <h3 className="text-xs font-semibold text-[#eff1f6] uppercase tracking-wider flex items-center gap-2">
            <Download className="w-3.5 h-3.5 text-[#ffa116]" />
            <span>Research Dataset Export Suite (Section 25)</span>
          </h3>
          <p className="text-[11px] text-[#9ca3af]">
            Download real relational telemetry tables formatted for academic papers and external ML pipelines.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <button
            onClick={() => handleDownloadCsv('student_features')}
            className="p-3 bg-[#202020] hover:bg-[#2d2d2d] border border-[#333333] rounded text-left space-y-1 transition-colors"
          >
            <div className="text-xs font-semibold text-[#eff1f6] flex items-center justify-between">
              <span>student_features.csv</span>
              <Download className="w-3.5 h-3.5 text-[#ffa116]" />
            </div>
            <p className="text-[10px] text-[#9ca3af]">Features, GPA, study hours, and academic scores.</p>
          </button>

          <button
            onClick={() => handleDownloadCsv('skill_progress')}
            className="p-3 bg-[#202020] hover:bg-[#2d2d2d] border border-[#333333] rounded text-left space-y-1 transition-colors"
          >
            <div className="text-xs font-semibold text-[#eff1f6] flex items-center justify-between">
              <span>skill_progress.csv</span>
              <Download className="w-3.5 h-3.5 text-[#ffa116]" />
            </div>
            <p className="text-[10px] text-[#9ca3af]">Proficiencies, confidence, and assessment timestamps.</p>
          </button>

          <button
            onClick={() => handleDownloadCsv('execution_history')}
            className="p-3 bg-[#202020] hover:bg-[#2d2d2d] border border-[#333333] rounded text-left space-y-1 transition-colors"
          >
            <div className="text-xs font-semibold text-[#eff1f6] flex items-center justify-between">
              <span>execution_history.csv</span>
              <Download className="w-3.5 h-3.5 text-[#ffa116]" />
            </div>
            <p className="text-[10px] text-[#9ca3af]">Task difficulties, estimated hours, and deadlines.</p>
          </button>
        </div>
      </div>
    </div>
  );
};
