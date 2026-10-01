import React, { useState } from 'react';
import { resumeApi } from '../api/client';
import { FileSearch, Sparkles, CheckCircle2 } from 'lucide-react';

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
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-[#262626] border border-[#333333] rounded px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2 text-[11px] font-mono text-[#ffa116]">
            <FileSearch className="w-3.5 h-3.5" />
            <span>EVIDENCE EXTRACTION LAYER</span>
          </div>
          <h1 className="text-base font-semibold text-[#eff1f6] mt-0.5">Resume & Project Evidence Analyzer</h1>
          <p className="text-xs text-[#9ca3af] mt-0.5">
            Extract verified skills, architectural patterns, and missing industry keywords from text and portfolio descriptions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input Form */}
        <div className="bg-[#262626] border border-[#333333] rounded p-4 space-y-4">
          <div className="border-b border-[#333333] pb-2">
            <h3 className="text-xs font-semibold text-[#eff1f6]">Input Resume or Project Text</h3>
          </div>

          <form onSubmit={handleAnalyze} className="space-y-3">
            <div>
              <label className="text-[11px] font-mono text-[#9ca3af] block mb-1">Target Role Profile</label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#333333] rounded px-3 py-1.5 text-xs text-[#eff1f6] focus:outline-none focus:border-[#ffa116]"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono text-[#9ca3af] block mb-1">Resume / Project Description</label>
              <textarea
                rows={9}
                required
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste experience summaries, technical project overviews, or portfolio READMEs..."
                className="w-full bg-[#1a1a1a] border border-[#333333] rounded p-3 text-xs text-[#eff1f6] font-mono placeholder-[#6b7280] focus:outline-none focus:border-[#ffa116] leading-relaxed"
              />
            </div>

            <button
              type="submit"
              disabled={analyzing || !text.trim()}
              className="w-full py-2 bg-[#ffa116] hover:bg-[#ffb03a] disabled:opacity-50 text-black rounded text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{analyzing ? 'Extracting Competencies...' : 'Analyze Technical Evidence'}</span>
            </button>
          </form>
        </div>

        {/* Extraction Output */}
        <div className="bg-[#262626] border border-[#333333] rounded p-4 space-y-4">
          <div className="border-b border-[#333333] pb-2 flex items-center justify-between">
            <h3 className="text-xs font-semibold text-[#eff1f6]">Structured Telemetry Output</h3>
            {analysis && (
              <span className="text-[11px] font-mono text-[#2cbb5d]">
                Analyzed {analysis.wordsAnalyzed} words
              </span>
            )}
          </div>

          {!analysis ? (
            <div className="p-12 text-center text-xs font-mono text-[#9ca3af]">
              Input technical text and click "Analyze Technical Evidence" to extract competencies.
            </div>
          ) : (
            <div className="space-y-4">
              {/* Density Score */}
              <div className="p-3 bg-[#1a1a1a] border border-[#333333] rounded flex justify-between items-center text-xs">
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#9ca3af]">Keyword Match Density</span>
                  <div className="text-lg font-bold font-mono text-[#ffa116]">{analysis.keywordDensityScore}%</div>
                </div>
                <div className="text-right text-[11px] font-mono text-[#9ca3af]">
                  Target: {targetRole}
                </div>
              </div>

              {/* Detected Skills */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-[#9ca3af]">Detected Core Skills:</span>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.detectedSkills?.map((s: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-[#333333] text-[#2cbb5d] font-mono text-[11px]"
                    >
                      ✓ {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Detected Architectural Patterns */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-[#9ca3af]">Architectural Patterns:</span>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.detectedArchitectures?.map((a: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-[#333333] text-[#ffa116] font-mono text-[11px]"
                    >
                      ❖ {a}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Recommended Keywords */}
              {analysis.missingRecommendedKeywords && analysis.missingRecommendedKeywords.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono uppercase text-[#9ca3af]">Recommended Additions:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.missingRecommendedKeywords.map((k: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-[#ef4743]/10 text-[#ef4743] border border-[#ef4743]/30 font-mono text-[11px]"
                      >
                        + {k}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              <div className="p-3 bg-[#1a1a1a] rounded border border-[#333333] text-xs space-y-1">
                <div className="text-[10px] font-mono uppercase text-[#ffa116]">Impact Recommendations:</div>
                <p className="text-[11px] font-mono text-[#eff1f6] leading-relaxed">
                  {analysis.improvementRecommendations}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
