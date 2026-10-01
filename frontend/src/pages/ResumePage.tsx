import React, { useState } from 'react';
import { resumeApi } from '../api/client';
import { FileSearch, Sparkles, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, Tag } from 'lucide-react';

export const ResumePage: React.FC = () => {
  const [text, setText] = useState(
    `B.S. in Computer Science. Built a distributed task broker using Java multithreading and ThreadPoolExecutor. Developed scalable REST APIs with Spring Boot, PostgreSQL, and Docker. Implemented JWT authentication, index optimizations, and ACID transactional pipelines.`
  );
  const [targetRole, setTargetRole] = useState('Backend Developer');
  const [analysis, setAnalysis] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setAnalyzing(true);
    try {
      const res: any = await resumeApi.analyze({ text, targetRole });
      if (res.data) setAnalysis(res.data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 shadow-xl">
        <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
          <FileSearch className="w-4 h-4" />
          <span>Evidence Extraction Layer</span>
        </div>
        <h1 className="text-xl font-extrabold text-white">Resume & Portfolio Project Analyzer</h1>
        <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
          Extract verified skills, architectural patterns, and missing industry keywords from your resume or project descriptions. Keyword presence is treated as supporting evidence, verified alongside assessment and repository telemetry.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white">Input Resume or Project Text</h3>

          <form onSubmit={handleAnalyze} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Target Role Profile</label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Resume / Project Description</label>
              <textarea
                rows={9}
                required
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste experience summaries, technical project overviews, or portfolio READMEs..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white font-mono leading-relaxed focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={analyzing || !text.trim()}
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-colors shadow-lg shadow-emerald-500/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>{analyzing ? 'Extracting Entities...' : 'Analyze Technical Evidence'}</span>
            </button>
          </form>
        </div>

        {/* Extraction Output */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white">Structured Telemetry Output</h3>

          {!analysis ? (
            <div className="p-12 text-center bg-slate-950/40 rounded-xl border border-dashed border-slate-800 text-xs text-slate-400">
              Paste your resume or project overview and click "Analyze Technical Evidence" to extract competencies.
            </div>
          ) : (
            <div className="space-y-4">
              {/* Density Score */}
              <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Keyword Density</span>
                  <div className="text-xl font-extrabold text-emerald-400">{analysis.keywordDensityScore}%</div>
                </div>
                <div className="text-right text-slate-400">
                  <span>{analysis.wordsAnalyzed} words evaluated</span>
                </div>
              </div>

              {/* Detected Skills */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Detected Core Skills:</span>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.detectedSkills?.map((s: string, idx: number) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium">
                      ✓ {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Detected Architectural Patterns */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Architectural Patterns:</span>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.detectedArchitectures?.map((a: string, idx: number) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-medium">
                      ❖ {a}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Recommended Keywords */}
              {analysis.missingRecommendedKeywords && analysis.missingRecommendedKeywords.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Recommended Additions:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.missingRecommendedKeywords.map((k: string, idx: number) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-medium">
                        + {k}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800/80 text-xs space-y-1 text-slate-300">
                <div className="text-[10px] font-bold text-slate-500 uppercase">Impact Recommendations:</div>
                <p className="text-[11px] leading-relaxed text-slate-400">{analysis.improvementRecommendations}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
