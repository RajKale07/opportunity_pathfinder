import React, { useState, useEffect } from 'react';
import { opportunityApi } from '../api/client';
import { Briefcase, CheckCircle2, XCircle, ArrowRight, ShieldCheck, MapPin, DollarSign, Bookmark } from 'lucide-react';

export const OpportunitiesPage: React.FC = () => {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [applyingId, setApplyingId] = useState<number | null>(null);
  const [appliedMsg, setAppliedMsg] = useState<string | null>(null);

  const fetchOpportunities = () => {
    opportunityApi.getMatches()
      .then((res: any) => {
        if (res.data) setOpportunities(res.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const handleApply = async (id: number) => {
    setApplyingId(id);
    try {
      await opportunityApi.apply(id, { status: 'APPLIED', notes: 'Submitted resume and portfolio links.' });
      setAppliedMsg('Application status updated to APPLIED in your career pipeline.');
      fetchOpportunities();
    } catch (e) {
      console.error(e);
    } finally {
      setApplyingId(null);
    }
  };

  const filtered = opportunities.filter((o) => {
    if (typeFilter === 'ALL') return true;
    return o.type === typeFilter;
  });

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center space-x-3 text-slate-400">
        <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm font-medium">Matching opportunities against Student Digital Twin...</span>
      </div>
    );
  }

  return (
    <div className="space-y-5 text-[#eff1f6]">
      <div className="bg-[#262626] border border-[#333333] rounded p-4 space-y-1">
        <div className="flex items-center space-x-2 text-xs font-semibold text-[#ffa116] uppercase tracking-wider">
          <Briefcase className="w-3.5 h-3.5" />
          <span>Closed-Loop Opportunity Matching</span>
        </div>
        <h1 className="text-lg font-bold text-[#eff1f6]">Target Roles, Internships & Fellowships</h1>
        <p className="text-xs text-[#9ca3af] max-w-2xl leading-relaxed">
          Opportunity Pathfinder distinguishes between <strong className="text-[#eff1f6]">Opportunity Match</strong> (skill requirements overlap) and <strong className="text-[#eff1f6]">Candidate Readiness</strong> (mock interviews, portfolio, and consistency evidence).
        </p>
      </div>

      {appliedMsg && (
        <div className="p-3 bg-[#262626] border border-[#2cbb5d]/40 rounded text-xs text-[#eff1f6] flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#2cbb5d]" />
            {appliedMsg}
          </span>
          <button onClick={() => setAppliedMsg(null)} className="text-[#9ca3af] hover:text-white text-xs">
            Dismiss
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex space-x-1.5">
        {['ALL', 'INTERNSHIP', 'FULL_TIME', 'RESEARCH'].map((t) => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              typeFilter === t
                ? 'bg-[#333333] text-[#eff1f6] border border-[#444444]'
                : 'text-[#9ca3af] hover:text-[#eff1f6] hover:bg-[#262626]'
            }`}
          >
            {t.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Opportunity Cards (LeetCode Style Clean Panels) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((opp) => (
          <div
            key={opp.id}
            className="bg-[#262626] border border-[#333333] hover:border-[#444444] rounded p-4 transition-colors flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2.5">
              <div className="flex items-start justify-between pb-2 border-b border-[#333333]">
                <div>
                  <span className="text-[10px] text-[#9ca3af] uppercase font-mono tracking-wider">{opp.company}</span>
                  <h3 className="text-sm font-semibold text-[#eff1f6]">{opp.title}</h3>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <span className="text-base font-bold font-mono text-[#2cbb5d]">{opp.matchPercentage}%</span>
                    <span className="text-[9px] text-[#9ca3af] block uppercase">Match</span>
                  </div>
                  <div className="text-right pl-2 border-l border-[#333333]">
                    <span className="text-base font-bold font-mono text-[#ffa116]">{opp.readinessPercentage}%</span>
                    <span className="text-[9px] text-[#9ca3af] block uppercase">Readiness</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 text-[11px] text-[#9ca3af]">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#71717a]" />
                  {opp.location}
                </span>
                <span className="flex items-center gap-1 text-[#ffa116] font-mono font-medium">
                  <DollarSign className="w-3 h-3" />
                  {opp.compensation}
                </span>
                <span className="px-1.5 py-0.2 rounded bg-[#333333] text-[#eff1f6] text-[10px] font-mono uppercase">
                  {opp.type}
                </span>
              </div>

              <p className="text-xs text-[#d1d5db] leading-relaxed line-clamp-2">{opp.description}</p>

              {/* Match vs Readiness Breakdown & Explanation */}
              <div className="p-2.5 bg-[#202020] rounded border border-[#2d2d2d] space-y-1.5 text-xs">
                <div className="flex justify-between items-center text-[11px] text-[#9ca3af]">
                  <span>Requirement Coverage:</span>
                  <span className="font-mono text-[#2cbb5d] font-semibold">{opp.requirementsMetRatio}</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-[#9ca3af] uppercase font-semibold">Satisfied Competencies:</span>
                  <div className="flex flex-wrap gap-1">
                    {opp.satisfiedSkills?.map((s: string, idx: number) => (
                      <span key={idx} className="text-[10px] px-1.5 py-0.2 rounded bg-[#2cbb5d]/10 text-[#2cbb5d] font-mono">
                        ✓ {s}
                      </span>
                    ))}
                  </div>
                </div>

                {opp.missingSkills && opp.missingSkills.length > 0 && (
                  <div className="space-y-1 pt-0.5">
                    <span className="text-[10px] text-[#9ca3af] uppercase font-semibold">Missing:</span>
                    <div className="flex flex-wrap gap-1">
                      {opp.missingSkills.map((s: string, idx: number) => (
                        <span key={idx} className="text-[10px] px-1.5 py-0.2 rounded bg-[#ef4743]/10 text-[#ef4743] font-mono">
                          ✗ {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-1.5 border-t border-[#2d2d2d] text-[11px] text-[#9ca3af] leading-relaxed">
                  <strong className="text-[#eff1f6]">Rationale:</strong> {opp.whyMatchedExplanation}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#333333]">
              <button
                onClick={() => handleApply(opp.id)}
                disabled={applyingId === opp.id || opp.applicationStatus === 'APPLIED'}
                className={`w-full py-2 rounded text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors ${
                  opp.applicationStatus === 'APPLIED'
                    ? 'bg-[#333333] text-[#71717a] cursor-default'
                    : 'bg-[#ffa116] hover:bg-[#e08e14] text-black shadow-sm'
                }`}
              >
                <span>{opp.applicationStatus === 'APPLIED' ? 'Application Tracked (In Review)' : 'Apply with Digital Twin Proof'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
