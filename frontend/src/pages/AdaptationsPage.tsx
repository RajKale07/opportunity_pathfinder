import React, { useState, useEffect } from 'react';
import { adaptiveApi } from '../api/client';
import { History } from 'lucide-react';

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
      <div className="flex h-96 items-center justify-center space-x-2 text-[#4b5563]">
        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs font-mono">Loading adaptation audit trail...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4 text-[#111827]">
      {/* Header */}
      <div className="bg-white border border-[#e5e7eb] rounded px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div>
          <div className="flex items-center space-x-2 text-[11px] font-mono font-bold text-black">
            <History className="w-3.5 h-3.5" />
            <span>AUDITABILITY & PLAN LINEAGE</span>
          </div>
          <h1 className="text-base font-bold text-[#111827] mt-0.5">Adaptive Replanning Audit Trail</h1>
          <p className="text-xs text-[#6b7280] mt-0.5">
            Every automated roadmap modification is permanently logged with before/after diffs, trigger policies, and twin version transitions.
          </p>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="p-8 text-center bg-white border border-[#e5e7eb] rounded text-xs font-mono text-[#6b7280] shadow-sm">
          No automated roadmap adaptations triggered yet. Complete tasks or log an assessment failure to observe replanning.
        </div>
      ) : (
        <div className="bg-white border border-[#e5e7eb] rounded divide-y divide-[#e5e7eb] overflow-hidden shadow-sm">
          {history.map((ad) => (
            <div key={ad.id} className="p-4 hover:bg-[#f9fafb] transition-colors space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-2.5">
                  <span className="text-xs font-mono font-bold text-white px-2 py-0.5 rounded bg-black">
                    {ad.actionType}
                  </span>
                  <span className="text-xs font-mono text-[#6b7280]">
                    Twin: <span className="text-[#111827] font-bold">v{ad.previousTwinVersion}</span> →{' '}
                    <span className="text-[#059669] font-bold">v{ad.newTwinVersion}</span>
                  </span>
                </div>

                <span className="text-[11px] text-[#6b7280] font-mono">
                  {new Date(ad.timestamp).toLocaleString()}
                </span>
              </div>

              <div className="text-xs text-[#111827]">
                <span className="text-[10px] font-mono uppercase font-bold text-[#6b7280] block mb-0.5">Trigger Reason:</span>
                <p className="text-xs font-mono text-[#111827]">{ad.triggerReason}</p>
              </div>

              {/* Before vs After Differential in LeetCode Console Diff Style */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded bg-[#fef2f2] border border-[#fecaca] space-y-1">
                  <span className="text-[10px] uppercase text-[#dc2626] font-bold">- Previous Plan State:</span>
                  <p className="text-[#991b1b] text-[11px] leading-relaxed">{ad.beforePlanSummary}</p>
                </div>

                <div className="p-2.5 rounded bg-[#ecfdf5] border border-[#a7f3d0] space-y-1">
                  <span className="text-[10px] uppercase text-[#059669] font-bold">+ Adapted Plan State:</span>
                  <p className="text-[#065f46] text-[11px] leading-relaxed">{ad.afterPlanSummary}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
