import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { careersApi, learningApi } from '../api/client';
import { Compass, ArrowRight } from 'lucide-react';

export const CareerPathsPage: React.FC = () => {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingId, setGeneratingId] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    careersApi.getRecommendations()
      .then((res: any) => {
        if (res.data) setRecommendations(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSelectPathAndGenerateRoadmap = async (careerPathId: number) => {
    setGeneratingId(careerPathId);
    try {
      await learningApi.generateRoadmap(careerPathId);
      navigate('/roadmap');
    } catch (e) {
      console.error(e);
    } finally {
      setGeneratingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center space-x-2 text-[#4b5563]">
        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs font-mono">Computing multi-factor career alignments...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4 text-[#111827]">
      <div className="bg-white border border-[#e5e7eb] rounded p-4 space-y-1 shadow-sm">
        <div className="flex items-center space-x-2 text-xs font-bold text-black uppercase tracking-wider">
          <Compass className="w-3.5 h-3.5" />
          <span>Multi-Path Career Optimization</span>
        </div>
        <h1 className="text-lg font-bold text-[#111827]">Target Career Paths & Alignment Scores</h1>
        <p className="text-xs text-[#6b7280] max-w-2xl leading-relaxed">
          Compare primary, alternative, and exploratory roles evaluated across transparent alignment factors and objective skill gap algorithms.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {recommendations.map((path) => (
          <div
            key={path.careerPathId}
            className="bg-white border border-[#e5e7eb] hover:border-black rounded p-4 transition-colors flex flex-col justify-between space-y-4 shadow-sm"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between pb-2 border-b border-[#e5e7eb]">
                <div>
                  <span className="text-[10px] text-[#6b7280] uppercase font-mono tracking-wider font-semibold">{path.domain}</span>
                  <h3 className="text-sm font-bold text-[#111827] mt-0.5">{path.title}</h3>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold font-mono text-[#059669]">{path.overallMatchScore}%</div>
                  <span className="text-[10px] text-[#6b7280] uppercase font-mono">Match</span>
                </div>
              </div>

              {/* Transparent Factor Breakdown */}
              <div className="space-y-1.5 p-3 rounded bg-[#f9fafb] border border-[#e5e7eb] text-xs">
                <span className="text-[10px] font-bold text-[#6b7280] uppercase tracking-wider block mb-1">
                  Alignment Matrix:
                </span>
                <div className="flex justify-between items-center text-[11px] text-[#6b7280]">
                  <span>Skill Alignment (30%):</span>
                  <span className="font-mono font-semibold text-[#111827]">{path.skillAlignment}%</span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-[#6b7280]">
                  <span>Domain Interest (20%):</span>
                  <span className="font-mono font-semibold text-[#111827]">{path.interestAlignment}%</span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-[#6b7280]">
                  <span>Project Portfolio (15%):</span>
                  <span className="font-mono font-semibold text-[#111827]">{path.projectAlignment}%</span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-[#6b7280]">
                  <span>Academic Background (10%):</span>
                  <span className="font-mono font-semibold text-[#111827]">{path.academicAlignment}%</span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-[#6b7280]">
                  <span>Market Fit (10%):</span>
                  <span className="font-mono font-semibold text-[#111827]">{path.opportunityAlignment}%</span>
                </div>
              </div>

              {/* Rationale Narrative */}
              <div className="text-[11px] text-[#4b5563] leading-relaxed italic bg-[#f9fafb] p-2.5 rounded border border-[#e5e7eb]">
                "{path.matchRationale}"
              </div>

              {/* Top Gaps */}
              {path.topSkillGaps && path.topSkillGaps.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-[#6b7280] uppercase tracking-wider">
                    Key Competency Gaps:
                  </span>
                  <div className="space-y-1">
                    {path.topSkillGaps.map((g: any) => (
                      <div key={g.skillId} className="flex justify-between items-center text-[11px] p-1.5 rounded bg-[#f9fafb] border border-[#e5e7eb]">
                        <span className="text-[#111827] font-medium">{g.skillName}</span>
                        <span className="text-[#dc2626] font-mono text-[10px] font-bold">
                          {g.currentProficiency}% → {g.requiredProficiency}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => handleSelectPathAndGenerateRoadmap(path.careerPathId)}
              disabled={generatingId === path.careerPathId}
              className="w-full py-2 bg-black hover:bg-neutral-800 disabled:opacity-50 text-white rounded text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors shadow-sm"
            >
              <span>{generatingId === path.careerPathId ? 'Generating...' : 'Select Path & Generate Roadmap'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
