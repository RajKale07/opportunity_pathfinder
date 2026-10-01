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
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 shadow-xl">
        <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
          <Briefcase className="w-4 h-4" />
          <span>Closed-Loop Opportunity Matching</span>
        </div>
        <h1 className="text-xl font-extrabold text-white">Target Roles, Internships & Fellowships</h1>
        <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
          Opportunity Pathfinder distinguishes between <strong>Opportunity Match</strong> (how well your skills satisfy role criteria) and <strong>Candidate Readiness</strong> (your actual mock interview, portfolio, and consistency evidence).
        </p>
      </div>

      {appliedMsg && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            {appliedMsg}
          </span>
          <button onClick={() => setAppliedMsg(null)} className="text-slate-400 hover:text-white text-xs">
            Dismiss
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex space-x-2">
        {['ALL', 'INTERNSHIP', 'FULL_TIME', 'RESEARCH'].map((t) => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              typeFilter === t
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {t.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Opportunity Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filtered.map((opp) => (
          <div
            key={opp.id}
            className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 shadow-xl"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{opp.company}</span>
                  <h3 className="text-base font-bold text-white">{opp.title}</h3>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <span className="text-base font-extrabold text-emerald-400">{opp.matchPercentage}%</span>
                    <span className="text-[9px] text-slate-500 font-semibold block uppercase">Match</span>
                  </div>
                  <div className="text-right pl-2 border-l border-slate-800">
                    <span className="text-base font-extrabold text-indigo-400">{opp.readinessPercentage}%</span>
                    <span className="text-[9px] text-slate-500 font-semibold block uppercase">Readiness</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  {opp.location}
                </span>
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <DollarSign className="w-3.5 h-3.5" />
                  {opp.compensation}
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-semibold uppercase">
                  {opp.type}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{opp.description}</p>

              {/* Match vs Readiness Breakdown & Explanation (Section 20) */}
              <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-400">
                  <span>Requirement Coverage:</span>
                  <span className="font-semibold text-emerald-400">{opp.requirementsMetRatio}</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Satisfied Competencies:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {opp.satisfiedSkills?.map((s: string, idx: number) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                        ✓ {s}
                      </span>
                    ))}
                  </div>
                </div>

                {opp.missingSkills && opp.missingSkills.length > 0 && (
                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Pending / Missing:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {opp.missingSkills.map((s: string, idx: number) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-medium">
                          ✗ {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 leading-relaxed">
                  <strong>Match Rationale:</strong> {opp.whyMatchedExplanation}
                </div>
                <div className="text-[11px] text-slate-400 leading-relaxed">
                  <strong>Readiness Insight:</strong> {opp.readinessExplanation}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => handleApply(opp.id)}
                disabled={applyingId === opp.id || opp.applicationStatus === 'APPLIED'}
                className={`flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all ${
                  opp.applicationStatus === 'APPLIED'
                    ? 'bg-slate-800 text-slate-400 cursor-default'
                    : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
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
