import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { careersApi, learningApi } from '../api/client';
import { Compass, CheckCircle2, ArrowRight, ShieldCheck, Target, Sparkles, Layers } from 'lucide-react';

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
      <div className="flex h-96 items-center justify-center space-x-3 text-slate-400">
        <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm font-medium">Computing multi-factor career alignments...</span>
      </div>
    );
  }

  return (
    <div className="space-y-5 text-[#eff1f6]">
      <div className="bg-[#262626] border border-[#333333] rounded p-4 space-y-1">
        <div className="flex items-center space-x-2 text-xs font-semibold text-[#ffa116] uppercase tracking-wider">
          <Compass className="w-3.5 h-3.5" />
          <span>Multi-Path Career Optimization</span>
        </div>
        <h1 className="text-lg font-bold text-[#eff1f6]">Target Career Paths & Alignment Scores</h1>
        <p className="text-xs text-[#9ca3af] max-w-2xl leading-relaxed">
          Compare primary, alternative, and exploratory roles evaluated across transparent alignment factors and objective skill gap algorithms.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {recommendations.map((path) => (
          <div
            key={path.careerPathId}
            className="bg-[#262626] border border-[#333333] hover:border-[#444444] rounded p-4 transition-colors flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between pb-2 border-b border-[#333333]">
                <div>
                  <span className="text-[10px] text-[#9ca3af] uppercase font-mono tracking-wider">{path.domain}</span>
                  <h3 className="text-sm font-semibold text-[#eff1f6] mt-0.5">{path.title}</h3>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold font-mono text-[#2cbb5d]">{path.overallMatchScore}%</div>
                  <span className="text-[10px] text-[#9ca3af] uppercase">Match</span>
                </div>
              </div>

              {/* Transparent Factor Breakdown */}
              <div className="space-y-1.5 p-3 rounded bg-[#202020] border border-[#2d2d2d] text-xs">
                <span className="text-[10px] font-semibold text-[#9ca3af] uppercase tracking-wider block mb-1">
                  Alignment Matrix:
                </span>
                <div className="flex justify-between items-center text-[11px] text-[#9ca3af]">
                  <span>Skill Alignment (30%):</span>
                  <span className="font-mono text-[#eff1f6]">{path.skillAlignment}%</span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-[#9ca3af]">
                  <span>Domain Interest (20%):</span>
                  <span className="font-mono text-[#eff1f6]">{path.interestAlignment}%</span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-[#9ca3af]">
                  <span>Project Portfolio (15%):</span>
                  <span className="font-mono text-[#eff1f6]">{path.projectAlignment}%</span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-[#9ca3af]">
                  <span>Academic Background (10%):</span>
                  <span className="font-mono text-[#eff1f6]">{path.academicAlignment}%</span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-[#9ca3af]">
                  <span>Market Fit (10%):</span>
                  <span className="font-mono text-[#eff1f6]">{path.opportunityAlignment}%</span>
                </div>
              </div>

              {/* Rationale Narrative */}
              <div className="text-[11px] text-[#9ca3af] leading-relaxed italic bg-[#202020] p-2.5 rounded border border-[#2d2d2d]">
                "{path.matchRationale}"
              </div>

              {/* Top Gaps */}
              {path.topSkillGaps && path.topSkillGaps.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] font-semibold text-[#9ca3af] uppercase tracking-wider">
                    Key Competency Gaps:
                  </span>
                  <div className="space-y-1">
                    {path.topSkillGaps.map((g: any) => (
                      <div key={g.skillId} className="flex justify-between items-center text-[11px] p-1.5 rounded bg-[#202020] border border-[#2d2d2d]">
                        <span className="text-[#eff1f6]">{g.skillName}</span>
                        <span className="text-[#ef4743] font-mono text-[10px]">
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
              className="w-full py-2 bg-[#ffa116] hover:bg-[#e08e14] disabled:opacity-50 text-black rounded text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors shadow-sm"
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
