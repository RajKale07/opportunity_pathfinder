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
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 shadow-xl">
        <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
          <Compass className="w-4 h-4" />
          <span>Multi-Path Career Optimization</span>
        </div>
        <h1 className="text-xl font-extrabold text-white">Target Career Paths & Alignment Scores</h1>
        <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
          Opportunity Pathfinder does not pigeonhole you into a single destination. Compare primary, alternative, and exploratory roles evaluated across transparent alignment factors.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {recommendations.map((path) => (
          <div
            key={path.careerPathId}
            className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-5 shadow-xl relative overflow-hidden"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{path.domain}</span>
                  <h3 className="text-lg font-bold text-white mt-0.5">{path.title}</h3>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-extrabold text-emerald-400">{path.overallMatchScore}%</div>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase">Overall Match</span>
                </div>
              </div>

              {/* Transparent Factor Breakdown (Section 10 Formula) */}
              <div className="space-y-2 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Alignment Factor Matrix:
                </span>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-slate-400">Skill Proficiency Alignment (30%):</span>
                  <span className="font-semibold text-white">{path.skillAlignment}%</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-slate-400">Domain Interest Alignment (20%):</span>
                  <span className="font-semibold text-white">{path.interestAlignment}%</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-slate-400">Portfolio Project Evidence (15%):</span>
                  <span className="font-semibold text-white">{path.projectAlignment}%</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-slate-400">Academic Background (10%):</span>
                  <span className="font-semibold text-white">{path.academicAlignment}%</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-slate-400">Opportunity Market Fit (10%):</span>
                  <span className="font-semibold text-white">{path.opportunityAlignment}%</span>
                </div>
              </div>

              {/* Rationale Narrative */}
              <div className="text-xs text-slate-400 leading-relaxed italic bg-slate-950/30 p-3 rounded-lg border border-slate-800/50">
                "{path.matchRationale}"
              </div>

              {/* Top Gaps */}
              {path.topSkillGaps && path.topSkillGaps.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Key Competency Gaps:
                  </span>
                  <div className="space-y-1">
                    {path.topSkillGaps.map((g: any) => (
                      <div key={g.skillId} className="flex justify-between items-center text-xs p-2 rounded-lg bg-slate-950/40 border border-slate-800">
                        <span className="text-slate-300 font-medium">{g.skillName}</span>
                        <span className="text-rose-400 font-semibold text-[11px]">
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
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-all shadow-lg shadow-emerald-500/20"
            >
              <span>{generatingId === path.careerPathId ? 'Generating Roadmap...' : 'Select Path & Generate Roadmap'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
