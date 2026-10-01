import React, { useState, useEffect } from 'react';
import { readinessApi } from '../api/client';
import { Radar as RadarIcon, CheckCircle2, AlertOctagon, TrendingUp, ShieldCheck } from 'lucide-react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip
} from 'recharts';

export const ReadinessPage: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    readinessApi.getProfile()
      .then((res: any) => {
        if (res.data) setProfile(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center space-x-3 text-slate-400">
        <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm font-medium">Synthesizing 10-dimensional career readiness profile...</span>
      </div>
    );
  }

  const radarData = profile?.dimensions?.map((d: any) => ({
    subject: d.dimensionName,
    Score: d.score,
    Benchmark: 70,
  })) || [];

  return (
    <div className="space-y-5 text-[#eff1f6]">
      <div className="bg-[#262626] border border-[#333333] rounded p-4 space-y-1">
        <div className="flex items-center space-x-2 text-xs font-semibold text-[#ffa116] uppercase tracking-wider">
          <RadarIcon className="w-3.5 h-3.5" />
          <span>Multidimensional Readiness Profile</span>
        </div>
        <h1 className="text-lg font-bold text-[#eff1f6]">10-Dimensional Career Readiness Radar</h1>
        <p className="text-xs text-[#9ca3af] max-w-2xl leading-relaxed">
          Opportunity Pathfinder evaluates technical depth, verified portfolio assets, algorithmic problem solving, mock interview performance, and execution consistency.
        </p>
      </div>

      {/* Top Profile Summary Strip */}
      <div className="bg-[#262626] border border-[#333333] rounded p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] text-[#9ca3af] uppercase font-mono tracking-wider">Evaluation Tier</span>
          <div className="text-xl font-bold text-[#eff1f6] flex items-center gap-2">
            <span>{profile?.readinessTier || 'DEVELOPING APPLICANT'}</span>
            <span className="text-xs px-2 py-0.5 rounded bg-[#333333] text-[#ffa116] border border-[#444444] font-mono font-semibold">
              {profile?.overallReadinessScore}% Overall
            </span>
          </div>
          <p className="text-xs text-[#9ca3af] max-w-xl leading-relaxed italic">{profile?.summaryNarrative}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0 text-xs">
          <div className="p-3 bg-[#202020] rounded border border-[#2d2d2d] space-y-1">
            <span className="text-[10px] font-semibold text-[#2cbb5d] uppercase flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Strengths
            </span>
            <ul className="text-[#eff1f6] space-y-0.5 text-[11px]">
              {profile?.keyStrengths?.map((s: string, i: number) => (
                <li key={i}>• {s}</li>
              ))}
            </ul>
          </div>

          <div className="p-3 bg-[#202020] rounded border border-[#2d2d2d] space-y-1">
            <span className="text-[10px] font-semibold text-[#ef4743] uppercase flex items-center gap-1">
              <AlertOctagon className="w-3 h-3" /> Blockers
            </span>
            <ul className="text-[#eff1f6] space-y-0.5 text-[11px]">
              {profile?.keyBlockers?.map((b: string, i: number) => (
                <li key={i}>• {b}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Radar Chart + Dimension Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-[#262626] border border-[#333333] rounded p-4 space-y-3 flex flex-col items-center justify-center">
          <h3 className="text-xs font-semibold text-[#eff1f6] uppercase tracking-wider self-start">Radar Visualization</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#333333" />
                <PolarAngleAxis dataKey="subject" stroke="#9ca3af" fontSize={10} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#444444" fontSize={9} />
                <Radar name="Student Score" dataKey="Score" stroke="#ffa116" fill="#ffa116" fillOpacity={0.35} />
                <Radar name="Target Industry Bar" dataKey="Benchmark" stroke="#666666" fill="#666666" fillOpacity={0.15} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e1e1e', borderColor: '#333333', borderRadius: '4px', fontSize: '11px', color: '#eff1f6' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center space-x-6 text-xs text-[#9ca3af]">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ffa116]"></span>
              <span>Your Student Twin</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#666666]"></span>
              <span>Industry Bar (70%)</span>
            </div>
          </div>
        </div>

        <div className="bg-[#262626] border border-[#333333] rounded p-4 space-y-3">
          <h3 className="text-xs font-semibold text-[#eff1f6] uppercase tracking-wider">Dimension Diagnostics & Evidence</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1 divide-y divide-[#333333]">
            {profile?.dimensions?.map((d: any, idx: number) => (
              <div
                key={idx}
                className="pt-2 first:pt-0 space-y-1"
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-[#eff1f6]">{d.dimensionName}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] text-[#71717a] font-mono">{d.benchmark}</span>
                    <span className={`font-mono text-xs font-bold ${d.score >= 70 ? 'text-[#2cbb5d]' : 'text-[#ffc01e]'}`}>
                      {d.score}%
                    </span>
                  </div>
                </div>

                <div className="h-1.5 w-full bg-[#1e1e1e] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${d.score >= 70 ? 'bg-[#2cbb5d]' : 'bg-[#ffc01e]'}`}
                    style={{ width: `${d.score}%` }}
                  />
                </div>

                <p className="text-[11px] text-[#9ca3af]">{d.evidenceSummary}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
