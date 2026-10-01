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
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 shadow-xl">
        <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
          <RadarIcon className="w-4 h-4" />
          <span>Multidimensional Readiness Profile</span>
        </div>
        <h1 className="text-xl font-extrabold text-white">10-Dimensional Career Readiness Radar</h1>
        <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
          Opportunity Pathfinder refuses to reduce a student to an arbitrary single number. We evaluate technical depth, verified portfolio assets, algorithmic problem solving, mock interview performance, and execution consistency.
        </p>
      </div>

      {/* Top Profile Summary Strip */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Composite Evaluation Tier</span>
          <div className="text-2xl font-extrabold text-white flex items-center gap-2">
            <span>{profile?.readinessTier || 'DEVELOPING APPLICANT'}</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
              {profile?.overallReadinessScore}% Overall
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-xl leading-relaxed italic">{profile?.summaryNarrative}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0 text-xs">
          <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-emerald-400 uppercase flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Key Strengths
            </span>
            <ul className="text-slate-300 space-y-0.5">
              {profile?.keyStrengths?.map((s: string, i: number) => (
                <li key={i}>• {s}</li>
              ))}
            </ul>
          </div>

          <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-rose-400 uppercase flex items-center gap-1">
              <AlertOctagon className="w-3.5 h-3.5" /> Primary Blockers
            </span>
            <ul className="text-slate-300 space-y-0.5">
              {profile?.keyBlockers?.map((b: string, i: number) => (
                <li key={i}>• {b}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Radar Chart + Dimension Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col items-center justify-center">
          <h3 className="text-sm font-bold text-white self-start">10-Dimension Radar Assessment</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={10} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={9} />
                <Radar name="Student Score" dataKey="Score" stroke="#10b981" fill="#10b981" fillOpacity={0.4} />
                <Radar name="Target Industry Bar" dataKey="Benchmark" stroke="#6366f1" fill="#6366f1" fillOpacity={0.15} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center space-x-6 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-emerald-500"></span>
              <span>Your Student Twin</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-indigo-500"></span>
              <span>Target Benchmark (70%)</span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white">Dimension Diagnostics & Grounded Evidence</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {profile?.dimensions?.map((d: any, idx: number) => (
              <div
                key={idx}
                className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 flex flex-col space-y-1.5"
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-200">{d.dimensionName}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] text-slate-500">{d.benchmark}</span>
                    <span className={`font-extrabold text-xs ${d.score >= 70 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {d.score}%
                    </span>
                  </div>
                </div>

                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${d.score >= 70 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                    style={{ width: `${d.score}%` }}
                  />
                </div>

                <p className="text-[11px] text-slate-400">{d.evidenceSummary}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
