import React, { useState, useEffect } from 'react';
import { opportunityApi } from '../api/client';
import { Briefcase, CheckCircle2, ArrowRight, MapPin, DollarSign } from 'lucide-react';

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
      <div className="flex h-96 items-center justify-center space-x-2 text-[#4b5563]">
        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs font-mono">Matching opportunities against Student Digital Twin...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4 text-[#111827]">
      <div className="bg-white border border-[#e5e7eb] rounded p-4 space-y-1 shadow-sm">
        <div className="flex items-center space-x-2 text-xs font-bold text-black uppercase tracking-wider">
          <Briefcase className="w-3.5 h-3.5" />
          <span>Closed-Loop Opportunity Matching</span>
        </div>
        <h1 className="text-lg font-bold text-[#111827]">Target Roles, Internships & Fellowships</h1>
        <p className="text-xs text-[#6b7280] max-w-2xl leading-relaxed">
          Opportunity Pathfinder distinguishes between <strong className="text-[#111827]">Opportunity Match</strong> (skill requirements overlap) and <strong className="text-[#111827]">Candidate Readiness</strong> (mock interviews, portfolio, and consistency evidence).
        </p>
      </div>

      {appliedMsg && (
        <div className="p-3 bg-white border border-black rounded text-xs text-[#111827] flex items-center justify-between shadow-sm">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#059669]" />
            {appliedMsg}
          </span>
          <button onClick={() => setAppliedMsg(null)} className="text-[#6b7280] hover:text-black text-xs font-medium">
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
            className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
              typeFilter === t
                ? 'bg-black text-white shadow-sm'
                : 'bg-white text-[#4b5563] hover:text-black border border-[#e5e7eb]'
            }`}
          >
            {t.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Opportunity Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((opp) => (
          <div
            key={opp.id}
            className="bg-white border border-[#e5e7eb] hover:border-black rounded p-4 transition-colors flex flex-col justify-between space-y-3 shadow-sm"
          >
            <div className="space-y-2.5">
              <div className="flex items-start justify-between pb-2 border-b border-[#e5e7eb]">
                <div>
                  <span className="text-[10px] text-[#6b7280] uppercase font-mono tracking-wider font-semibold">{opp.company}</span>
                  <h3 className="text-sm font-bold text-[#111827]">{opp.title}</h3>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <span className="text-base font-bold font-mono text-[#059669]">{opp.matchPercentage}%</span>
                    <span className="text-[9px] text-[#6b7280] block uppercase font-mono">Match</span>
                  </div>
                  <div className="text-right pl-2 border-l border-[#e5e7eb]">
                    <span className="text-base font-bold font-mono text-black">{opp.readinessPercentage}%</span>
                    <span className="text-[9px] text-[#6b7280] block uppercase font-mono">Readiness</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 text-[11px] text-[#6b7280]">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#9ca3af]" />
                  {opp.location}
                </span>
                <span className="flex items-center gap-1 text-black font-mono font-semibold">
                  <DollarSign className="w-3 h-3" />
                  {opp.compensation}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-[#f3f4f6] text-[#111827] text-[10px] font-mono uppercase font-semibold border border-[#e5e7eb]">
                  {opp.type}
                </span>
              </div>

              <p className="text-xs text-[#4b5563] leading-relaxed line-clamp-2">{opp.description}</p>

              {/* Match vs Readiness Breakdown & Explanation */}
              <div className="p-2.5 bg-[#f9fafb] rounded border border-[#e5e7eb] space-y-1.5 text-xs">
                <div className="flex justify-between items-center text-[11px] text-[#6b7280]">
                  <span>Requirement Coverage:</span>
                  <span className="font-mono text-[#059669] font-bold">{opp.requirementsMetRatio}</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-[#6b7280] uppercase font-bold">Satisfied Competencies:</span>
                  <div className="flex flex-wrap gap-1">
                    {opp.satisfiedSkills?.map((s: string, idx: number) => (
                      <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-[#ecfdf5] text-[#059669] font-mono border border-[#a7f3d0]">
                        ✓ {s}
                      </span>
                    ))}
                  </div>
                </div>

                {opp.missingSkills && opp.missingSkills.length > 0 && (
                  <div className="space-y-1 pt-0.5">
                    <span className="text-[10px] text-[#6b7280] uppercase font-bold">Missing:</span>
                    <div className="flex flex-wrap gap-1">
                      {opp.missingSkills.map((s: string, idx: number) => (
                        <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-[#fef2f2] text-[#dc2626] font-mono border border-[#fecaca]">
                          ✗ {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-1.5 border-t border-[#e5e7eb] text-[11px] text-[#6b7280] leading-relaxed">
                  <strong className="text-[#111827]">Rationale:</strong> {opp.whyMatchedExplanation}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#e5e7eb]">
              <button
                onClick={() => handleApply(opp.id)}
                disabled={applyingId === opp.id || opp.applicationStatus === 'APPLIED'}
                className={`w-full py-2 rounded text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors ${
                  opp.applicationStatus === 'APPLIED'
                    ? 'bg-[#f3f4f6] text-[#9ca3af] cursor-default'
                    : 'bg-black hover:bg-neutral-800 text-white shadow-sm'
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
