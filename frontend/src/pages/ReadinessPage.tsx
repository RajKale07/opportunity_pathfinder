import React, { useState, useEffect } from 'react';
import { readinessApi } from '../api/client';
import { Radar as RadarIcon, CheckCircle2, AlertOctagon } from 'lucide-react';
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
      <div className="flex h-96 items-center justify-center space-x-2 text-[#4b5563]">
        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs font-mono">Synthesizing 10-dimensional career readiness profile...</span>
      </div>
    );
  }

  const radarData = profile?.dimensions?.map((d: any) => ({
    subject: d.dimensionName,
    Score: d.score,
    Benchmark: 70,
  })) || [];

  return (
    <div className="space-y-4 text-[#111827]">
      <div className="bg-white border border-[#e5e7eb] rounded p-4 space-y-1 shadow-sm">
        <div className="flex items-center space-x-2 text-xs font-bold text-black uppercase tracking-wider">
          <RadarIcon className="w-3.5 h-3.5" />
          <span>Multidimensional Readiness Profile</span>
        </div>
        <h1 className="text-lg font-bold text-[#111827]">10-Dimensional Career Readiness Radar</h1>
        <p className="text-xs text-[#6b7280] max-w-2xl leading-relaxed">
          Opportunity Pathfinder evaluates technical depth, verified portfolio assets, algorithmic problem solving, mock interview performance, and execution consistency.
        </p>
      </div>

      {/* Top Profile Summary Strip */}
      <div className="bg-white border border-[#e5e7eb] rounded p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <span className="text-[10px] text-[#6b7280] uppercase font-mono tracking-wider font-semibold">Evaluation Tier</span>
          <div className="text-xl font-bold text-[#111827] flex items-center gap-2">
            <span>{profile?.readinessTier || 'DEVELOPING APPLICANT'}</span>
            <span className="text-xs px-2 py-0.5 rounded bg-black text-white font-mono font-bold">
              {profile?.overallReadinessScore}% Overall
            </span>
          </div>
          <p className="text-xs text-[#4b5563] max-w-xl leading-relaxed italic">{profile?.summaryNarrative}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0 text-xs">
          <div className="p-3 bg-[#ecfdf5] rounded border border-[#a7f3d0] space-y-1">
            <span className="text-[10px] font-bold text-[#059669] uppercase flex items-center gap-1 font-mono">
              <CheckCircle2 className="w-3 h-3" /> Strengths
            </span>
            <ul className="text-[#065f46] space-y-0.5 text-[11px] font-medium">
              {profile?.keyStrengths?.map((s: string, i: number) => (
                <li key={i}>• {s}</li>
              ))}
            </ul>
          </div>

          <div className="p-3 bg-[#fef2f2] rounded border border-[#fecaca] space-y-1">
            <span className="text-[10px] font-bold text-[#dc2626] uppercase flex items-center gap-1 font-mono">
              <AlertOctagon className="w-3 h-3" /> Blockers
            </span>
            <ul className="text-[#991b1b] space-y-0.5 text-[11px] font-medium">
              {profile?.keyBlockers?.map((b: string, i: number) => (
                <li key={i}>• {b}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Radar Chart + Dimension Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white border border-[#e5e7eb] rounded p-4 space-y-3 flex flex-col items-center justify-center shadow-sm">
          <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider self-start">Radar Visualization</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="subject" stroke="#6b7280" fontSize={10} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#9ca3af" fontSize={9} />
                <Radar name="Student Score" dataKey="Score" stroke="#111827" fill="#111827" fillOpacity={0.25} />
                <Radar name="Target Industry Bar" dataKey="Benchmark" stroke="#9ca3af" fill="#9ca3af" fillOpacity={0.1} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb', borderRadius: '4px', fontSize: '11px', color: '#111827', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center space-x-6 text-xs text-[#6b7280]">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-black"></span>
              <span className="font-semibold text-[#111827]">Your Student Twin</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#9ca3af]"></span>
              <span>Industry Bar (70%)</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#e5e7eb] rounded p-4 space-y-3 shadow-sm">
          <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider">Dimension Diagnostics & Evidence</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1 divide-y divide-[#e5e7eb]">
            {profile?.dimensions?.map((d: any, idx: number) => (
              <div
                key={idx}
                className="pt-2 first:pt-0 space-y-1"
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-[#111827]">{d.dimensionName}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] text-[#6b7280] font-mono">{d.benchmark}</span>
                    <span className={`font-mono text-xs font-bold ${d.score >= 70 ? 'text-[#059669]' : 'text-[#d97706]'}`}>
                      {d.score}%
                    </span>
                  </div>
                </div>

                <div className="h-1.5 w-full bg-[#e5e7eb] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${d.score >= 70 ? 'bg-[#059669]' : 'bg-[#d97706]'}`}
                    style={{ width: `${d.score}%` }}
                  />
                </div>

                <p className="text-[11px] text-[#6b7280]">{d.evidenceSummary}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
