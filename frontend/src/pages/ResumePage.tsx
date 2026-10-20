import React, { useState } from 'react';
import { resumeApi } from '../api/client';
import { FileSearch, Sparkles } from 'lucide-react';

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
    <div className="space-y-4 text-[#111827]">
      {/* Header */}
      <div className="bg-white border border-[#e5e7eb] rounded px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div>
          <div className="flex items-center space-x-2 text-[11px] font-mono font-bold text-black">
            <FileSearch className="w-3.5 h-3.5" />
            <span>EVIDENCE EXTRACTION LAYER</span>
          </div>
          <h1 className="text-base font-bold text-[#111827] mt-0.5">Resume & Project Evidence Analyzer</h1>
          <p className="text-xs text-[#6b7280] mt-0.5">
            Extract verified skills, architectural patterns, and missing industry keywords from text and portfolio descriptions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input Form */}
        <div className="bg-white border border-[#e5e7eb] rounded p-4 space-y-4 shadow-sm">
          <div className="border-b border-[#e5e7eb] pb-2">
            <h3 className="text-xs font-bold text-[#111827]">Input Resume or Project Text</h3>
          </div>

          <form onSubmit={handleAnalyze} className="space-y-3">
            <div>
              <label className="text-[11px] font-mono font-semibold text-[#6b7280] block mb-1">Target Role Profile</label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full bg-[#f9fafb] border border-[#d1d5db] rounded px-3 py-1.5 text-xs text-[#111827] focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono font-semibold text-[#6b7280] block mb-1">Resume / Project Description</label>
              <textarea
                rows={9}
                required
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste experience summaries, technical project overviews, or portfolio READMEs..."
                className="w-full bg-[#f9fafb] border border-[#d1d5db] rounded p-3 text-xs text-[#111827] font-mono placeholder-[#9ca3af] focus:outline-none focus:border-black leading-relaxed"
              />
            </div>

            <button
              type="submit"
              disabled={analyzing || !text.trim()}
              className="w-full py-2 bg-black hover:bg-neutral-800 disabled:opacity-50 text-white rounded text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{analyzing ? 'Extracting Competencies...' : 'Analyze Technical Evidence'}</span>
            </button>
          </form>
        </div>

        {/* Extraction Output */}
        <div className="bg-white border border-[#e5e7eb] rounded p-4 space-y-4 shadow-sm">
          <div className="border-b border-[#e5e7eb] pb-2 flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#111827]">Structured Telemetry Output</h3>
            {analysis && (
              <span className="text-[11px] font-mono text-[#059669] font-bold">
                Analyzed {analysis.wordsAnalyzed} words
              </span>
            )}
          </div>

          {!analysis ? (
            <div className="p-12 text-center text-xs font-mono text-[#6b7280]">
              Input technical text and click "Analyze Technical Evidence" to extract competencies.
            </div>
          ) : (
            <div className="space-y-4">
              {/* Density Score */}
              <div className="p-3 bg-[#f9fafb] border border-[#e5e7eb] rounded flex justify-between items-center text-xs">
                <div>
                  <span className="text-[10px] font-mono uppercase font-bold text-[#6b7280]">Keyword Match Density</span>
                  <div className="text-lg font-bold font-mono text-black">{analysis.keywordDensityScore}%</div>
                </div>
                <div className="text-right text-[11px] font-mono text-[#6b7280]">
                  Target: {targetRole}
                </div>
              </div>

              {/* Detected Skills */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase font-bold text-[#6b7280]">Detected Core Skills:</span>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.detectedSkills?.map((s: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0] font-mono text-[11px] font-semibold"
                    >
                      ✓ {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Detected Architectural Patterns */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase font-bold text-[#6b7280]">Architectural Patterns:</span>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.detectedArchitectures?.map((a: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-[#f3f4f6] text-[#111827] border border-[#e5e7eb] font-mono text-[11px] font-semibold"
                    >
                      ❖ {a}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Recommended Keywords */}
              {analysis.missingRecommendedKeywords && analysis.missingRecommendedKeywords.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono uppercase font-bold text-[#6b7280]">Recommended Additions:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.missingRecommendedKeywords.map((k: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-[#fef2f2] text-[#dc2626] border border-[#fecaca] font-mono text-[11px] font-bold"
                      >
                        + {k}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              <div className="p-3 bg-[#f9fafb] rounded border border-[#e5e7eb] text-xs space-y-1">
                <div className="text-[10px] font-mono uppercase font-bold text-black">Impact Recommendations:</div>
                <p className="text-[11px] font-mono text-[#111827] leading-relaxed">
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
