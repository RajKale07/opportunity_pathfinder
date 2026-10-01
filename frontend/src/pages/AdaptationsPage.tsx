import React, { useState, useEffect } from 'react';
import { adaptiveApi } from '../api/client';
import { History, GitCommit, ArrowRight, ShieldCheck, RefreshCw, Zap } from 'lucide-react';

export const AdaptationsPage: React.FC = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adaptiveApi.getHistory()
      .then((res: any) => {
        if (res.data) setHistory(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center space-x-3 text-slate-400">
        <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm font-medium">Loading adaptation audit trail...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 shadow-xl">
        <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
          <History className="w-4 h-4" />
          <span>Auditability & Plan Lineage</span>
        </div>
        <h1 className="text-xl font-extrabold text-white">Adaptive Replanning Audit Trail</h1>
        <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
          Every automated plan revision is permanently audited with before/after plan differentials, trigger policies, and student digital twin version transitions.
        </p>
      </div>

      {history.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl text-xs text-slate-400">
          No automated roadmap adaptations triggered yet. Complete tasks or log an assessment failure to observe closed-loop replanning.
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((ad) => (
            <div
              key={ad.id}
              className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-2.5">
                  <span className="text-xs font-bold text-emerald-400 px-2.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                    Policy: {ad.actionType}
                  </span>
                  <span className="text-xs text-slate-400">
                    Twin Version: <strong className="text-white">v{ad.previousTwinVersion}</strong> →{' '}
                    <strong className="text-emerald-400">v{ad.newTwinVersion}</strong>
                  </span>
                </div>

                <span className="text-xs text-slate-500 font-mono">
                  {new Date(ad.timestamp).toLocaleString()}
                </span>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1 text-xs">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Trigger Event Reason:</span>
                <p className="text-slate-200">{ad.triggerReason}</p>
              </div>

              {/* Before vs After Plan Differential */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-1">
                  <span className="text-[10px] font-bold text-rose-400 uppercase">Previous Roadmap Plan:</span>
                  <p className="text-slate-400 text-[11px] leading-relaxed font-mono">{ad.beforePlanSummary}</p>
                </div>

                <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase">Adapted Roadmap Plan:</span>
                  <p className="text-slate-200 text-[11px] leading-relaxed font-mono">{ad.afterPlanSummary}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
