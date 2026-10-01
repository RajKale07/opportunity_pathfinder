import React, { useState, useEffect } from 'react';
import { adaptiveApi } from '../api/client';
import { History, ArrowRight } from 'lucide-react';

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
      <div className="flex h-96 items-center justify-center space-x-2 text-[#9ca3af]">
        <div className="w-4 h-4 border-2 border-[#ffa116] border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs font-mono">Loading adaptation audit trail...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-[#262626] border border-[#333333] rounded px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2 text-[11px] font-mono text-[#ffa116]">
            <History className="w-3.5 h-3.5" />
            <span>AUDITABILITY & PLAN LINEAGE</span>
          </div>
          <h1 className="text-base font-semibold text-[#eff1f6] mt-0.5">Adaptive Replanning Audit Trail</h1>
          <p className="text-xs text-[#9ca3af] mt-0.5">
            Every automated roadmap modification is permanently logged with before/after diffs, trigger policies, and twin version transitions.
          </p>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="p-8 text-center bg-[#262626] border border-[#333333] rounded text-xs font-mono text-[#9ca3af]">
          No automated roadmap adaptations triggered yet. Complete tasks or log an assessment failure to observe replanning.
        </div>
      ) : (
        <div className="bg-[#262626] border border-[#333333] rounded divide-y divide-[#333333] overflow-hidden">
          {history.map((ad) => (
            <div key={ad.id} className="p-4 hover:bg-[#2e2e2e] transition-colors space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-2.5">
                  <span className="text-xs font-mono font-bold text-[#ffa116] px-2 py-0.5 rounded bg-[#ffa116]/10 border border-[#ffa116]/30">
                    {ad.actionType}
                  </span>
                  <span className="text-xs font-mono text-[#9ca3af]">
                    Twin: <span className="text-[#eff1f6]">v{ad.previousTwinVersion}</span> →{' '}
                    <span className="text-[#2cbb5d]">v{ad.newTwinVersion}</span>
                  </span>
                </div>

                <span className="text-[11px] text-[#9ca3af] font-mono">
                  {new Date(ad.timestamp).toLocaleString()}
                </span>
              </div>

              <div className="text-xs text-[#eff1f6]">
                <span className="text-[10px] font-mono uppercase text-[#9ca3af] block mb-0.5">Trigger Reason:</span>
                <p className="text-xs font-mono text-[#eff1f6]">{ad.triggerReason}</p>
              </div>

              {/* Before vs After Differential in LeetCode Console Diff Style */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded bg-[#1a1a1a] border border-[#333333] space-y-1">
                  <span className="text-[10px] uppercase text-[#ef4743] font-bold">- Previous Plan State:</span>
                  <p className="text-[#9ca3af] text-[11px] leading-relaxed">{ad.beforePlanSummary}</p>
                </div>

                <div className="p-2.5 rounded bg-[#202020] border border-[#2cbb5d]/40 space-y-1">
                  <span className="text-[10px] uppercase text-[#2cbb5d] font-bold">+ Adapted Plan State:</span>
                  <p className="text-[#eff1f6] text-[11px] leading-relaxed">{ad.afterPlanSummary}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
