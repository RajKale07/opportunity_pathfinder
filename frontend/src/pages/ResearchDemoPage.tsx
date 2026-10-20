import React, { useState, useEffect } from 'react';
import { demoApi, evaluationApi } from '../api/client';
import {
  FlaskConical,
  Play,
  Download,
  CheckCircle2,
  TrendingUp,
  Layers
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
      <div className="flex h-96 items-center justify-center space-x-2 text-[#4b5563]">
        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs font-mono">Loading research evaluation data & benchmarks...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4 text-[#111827]">
      {/* Header Banner */}
      <div className="bg-white border border-[#e5e7eb] rounded p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs font-bold text-black uppercase tracking-wider">
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Empirical Research & Demonstration Console</span>
          </div>
          <h1 className="text-lg font-bold text-[#111827]">Closed-Loop Replay & Academic Evaluation</h1>
          <p className="text-xs text-[#6b7280] max-w-2xl leading-relaxed">
            Replay the full 16-step closed-loop lifecycle, inspect empirical baseline comparisons against static recommenders, view ablation studies, and export reproducible research datasets.
          </p>
        </div>

        <button
          onClick={handleRun16StepScenario}
          disabled={running}
          className="px-4 py-2 bg-black hover:bg-neutral-800 disabled:opacity-50 text-white rounded text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-sm flex-shrink-0"
        >
          <Play className={`w-3.5 h-3.5 fill-current ${running ? 'animate-spin' : ''}`} />
          <span>{running ? 'Executing 16-Step Loop...' : 'Execute 16-Step Demo Scenario'}</span>
        </button>
      </div>

      {/* 16-Step Scenario Timeline Log Output */}
      {scenarioLogs.length > 0 && (
        <div className="bg-white border border-[#e5e7eb] rounded overflow-hidden shadow-sm">
          <div className="px-4 py-3 bg-[#f9fafb] border-b border-[#e5e7eb] flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
              <span>Section 43 Demo Scenario Replay Logs (16-Step Verification)</span>
            </h3>
            <span className="text-[11px] font-mono text-[#059669] font-bold">16 / 16 Succeeded</span>
          </div>

          <div className="divide-y divide-[#e5e7eb] max-h-96 overflow-y-auto">
            {scenarioLogs.map((log) => (
              <div
                key={log.stepNumber}
                className="p-3 hover:bg-[#f9fafb] transition-colors flex items-start space-x-3 text-xs"
              >
                <div className="h-5 w-5 rounded bg-black text-white font-mono font-bold flex items-center justify-center flex-shrink-0 text-[10px] mt-0.5">
                  {log.stepNumber}
                </div>
                <div className="space-y-0.5 flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#111827]">{log.actionTitle}</span>
                    <span className="text-[10px] font-mono text-black px-1.5 py-0.5 rounded bg-[#f3f4f6] font-bold border border-[#e5e7eb]">
                      Twin v{log.twinVersion}
                    </span>
                  </div>
                  <p className="text-[#6b7280] text-[11px] leading-relaxed">{log.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empirical Baseline Comparison (Section 27) */}
      <div className="bg-white border border-[#e5e7eb] rounded overflow-hidden shadow-sm">
        <div className="px-4 py-3 border-b border-[#e5e7eb] bg-[#f9fafb]">
          <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-3.5 h-3.5 text-black" />
            <span>Baseline Performance Comparison (Section 27)</span>
          </h3>
          <p className="text-[11px] text-[#6b7280]">
            Opportunity Pathfinder (Adaptive Twin) benchmarked against traditional static baselines.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#f9fafb] text-[#6b7280] uppercase text-[10px] font-mono tracking-wider border-b border-[#e5e7eb]">
              <tr>
                <th className="p-3 font-semibold">Evaluation Metric</th>
                <th className="p-3 font-semibold">Baseline Approach</th>
                <th className="p-3 font-semibold">Baseline Score</th>
                <th className="p-3 font-semibold text-[#059669]">Opportunity Pathfinder</th>
                <th className="p-3 font-semibold text-right">Empirical Gain</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e7eb] text-[#374151]">
              {overview?.baselineComparisons?.map((b: any, idx: number) => (
                <tr key={idx} className="hover:bg-[#f9fafb] transition-colors">
                  <td className="p-3 font-semibold text-[#111827]">{b.metric}</td>
                  <td className="p-3 text-[#6b7280]">{b.baselineName}</td>
                  <td className="p-3 font-mono">{b.baselineScore}</td>
                  <td className="p-3 font-mono font-bold text-[#059669]">{b.pathfinderScore}</td>
                  <td className="p-3 text-right font-mono font-bold text-[#059669]">+{b.improvementPercentage}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ablation Studies (Section 55) */}
      <div className="bg-white border border-[#e5e7eb] rounded overflow-hidden shadow-sm">
        <div className="px-4 py-3 border-b border-[#e5e7eb] bg-[#f9fafb]">
          <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-black" />
            <span>Ablation Studies (Section 55)</span>
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#f9fafb] text-[#6b7280] uppercase text-[10px] font-mono tracking-wider border-b border-[#e5e7eb]">
              <tr>
                <th className="p-3 font-semibold">Configuration</th>
                <th className="p-3 font-semibold">Component Description</th>
                <th className="p-3 font-semibold">Match Accuracy</th>
                <th className="p-3 font-semibold">Roadmap Completion</th>
                <th className="p-3 font-semibold text-right">Readiness Correlation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e7eb] text-[#374151]">
              {overview?.ablationStudy?.map((a: any, idx: number) => (
                <tr key={idx} className="hover:bg-[#f9fafb] transition-colors">
                  <td className="p-3 font-semibold text-[#111827]">{a.configuration}</td>
                  <td className="p-3 text-[#6b7280]">{a.description}</td>
                  <td className="p-3 font-mono">{a.matchAccuracy}%</td>
                  <td className="p-3 font-mono">{a.roadmapCompletionRate}%</td>
                  <td className="p-3 text-right font-mono font-bold text-[#059669]">{a.readinessCorrelation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Research Dataset Exports (Section 25) */}
      <div className="bg-white border border-[#e5e7eb] rounded p-4 space-y-3 shadow-sm">
        <div>
          <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-2">
            <Download className="w-3.5 h-3.5 text-black" />
            <span>Research Dataset Export Suite (Section 25)</span>
          </h3>
          <p className="text-[11px] text-[#6b7280]">
            Download real relational telemetry tables formatted for academic papers and external ML pipelines.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <button
            onClick={() => handleDownloadCsv('student_features')}
            className="p-3 bg-[#f9fafb] hover:bg-[#f3f4f6] border border-[#e5e7eb] rounded text-left space-y-1 transition-colors"
          >
            <div className="text-xs font-bold text-[#111827] flex items-center justify-between">
              <span>student_features.csv</span>
              <Download className="w-3.5 h-3.5 text-black" />
            </div>
            <p className="text-[10px] text-[#6b7280]">Features, GPA, study hours, and academic scores.</p>
          </button>

          <button
            onClick={() => handleDownloadCsv('skill_progress')}
            className="p-3 bg-[#f9fafb] hover:bg-[#f3f4f6] border border-[#e5e7eb] rounded text-left space-y-1 transition-colors"
          >
            <div className="text-xs font-bold text-[#111827] flex items-center justify-between">
              <span>skill_progress.csv</span>
              <Download className="w-3.5 h-3.5 text-black" />
            </div>
            <p className="text-[10px] text-[#6b7280]">Proficiencies, confidence, and assessment timestamps.</p>
          </button>

          <button
            onClick={() => handleDownloadCsv('execution_history')}
            className="p-3 bg-[#f9fafb] hover:bg-[#f3f4f6] border border-[#e5e7eb] rounded text-left space-y-1 transition-colors"
          >
            <div className="text-xs font-bold text-[#111827] flex items-center justify-between">
              <span>execution_history.csv</span>
              <Download className="w-3.5 h-3.5 text-black" />
            </div>
            <p className="text-[10px] text-[#6b7280]">Task difficulties, estimated hours, and deadlines.</p>
          </button>
        </div>
      </div>
    </div>
  );
};
