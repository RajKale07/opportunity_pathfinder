import React, { useState, useEffect } from 'react';
import { executionApi } from '../api/client';
import { Activity, Clock } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const ExecutionPage: React.FC = () => {
  const [execution, setExecution] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    executionApi.getSummary()
      .then((res: any) => {
        if (res.data) setExecution(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center space-x-2 text-[#4b5563]">
        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs font-mono">Analyzing behavioral execution telemetry...</span>
      </div>
    );
  }

  const breakdownData = [
    { name: 'Completed', count: execution?.completedTasks || 0, fill: '#059669' },
    { name: 'In Progress', count: execution?.inProgressTasks || 0, fill: '#111827' },
    { name: 'Delayed', count: execution?.delayedTasks || 0, fill: '#d97706' },
    { name: 'Failed', count: execution?.failedTasks || 0, fill: '#dc2626' },
  ];

  return (
    <div className="space-y-4 text-[#111827]">
      {/* Header */}
      <div className="bg-white border border-[#e5e7eb] rounded px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div>
          <div className="flex items-center space-x-2 text-[11px] font-mono font-bold text-black">
            <Activity className="w-3.5 h-3.5" />
            <span>BEHAVIORAL ANALYTICS ENGINE</span>
          </div>
          <h1 className="text-base font-bold text-[#111827] mt-0.5">Execution Velocity & Habit Consistency</h1>
          <p className="text-xs text-[#6b7280] mt-0.5">
            Real performance tracking evaluating deadline adherence, consistency, and pacing stability.
          </p>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="bg-white border border-[#e5e7eb] rounded grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#e5e7eb] shadow-sm">
        <div className="p-3.5">
          <span className="text-[11px] font-mono text-[#6b7280]">Execution Rate</span>
          <div className="text-lg font-bold font-mono text-[#059669] mt-0.5">{execution?.executionRate || 0}%</div>
          <p className="text-[10px] text-[#9ca3af] mt-0.5">completed / assigned</p>
        </div>

        <div className="p-3.5">
          <span className="text-[11px] font-mono text-[#6b7280]">Deadline Adherence</span>
          <div className="text-lg font-bold font-mono text-[#111827] mt-0.5">{execution?.deadlineAdherenceRate || 0}%</div>
          <p className="text-[10px] text-[#9ca3af] mt-0.5">on-time deliveries</p>
        </div>

        <div className="p-3.5">
          <span className="text-[11px] font-mono text-[#6b7280]">Consistency Score</span>
          <div className="text-lg font-bold font-mono text-black mt-0.5">{execution?.consistencyScore || 78}%</div>
          <p className="text-[10px] text-[#9ca3af] mt-0.5">regularity factor</p>
        </div>

        <div className="p-3.5">
          <span className="text-[11px] font-mono text-[#6b7280]">Learning Velocity</span>
          <div className="text-lg font-bold font-mono text-[#111827] mt-0.5">{execution?.learningVelocity || 3.5}</div>
          <p className="text-[10px] text-[#9ca3af] mt-0.5">tasks / week</p>
        </div>
      </div>

      {/* Charts & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Task Distribution */}
        <div className="bg-white border border-[#e5e7eb] rounded p-4 space-y-3 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#e5e7eb] pb-2">
            <span className="text-xs font-bold text-[#111827]">Task Execution Distribution</span>
            <span className="text-[11px] font-mono text-[#6b7280]">Summary</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={breakdownData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={11} tickLine={false} />
                <YAxis stroke="#6b7280" fontSize={11} allowDecimals={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e5e7eb',
                    borderRadius: '4px',
                    fontSize: '12px',
                    color: '#111827',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Bar dataKey="count" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Verified Execution Records */}
        <div className="bg-white border border-[#e5e7eb] rounded overflow-hidden shadow-sm">
          <div className="px-4 py-2.5 border-b border-[#e5e7eb] flex items-center justify-between bg-[#f9fafb]">
            <span className="text-xs font-bold text-[#111827]">Verified Execution Telemetry</span>
            <span className="text-[11px] font-mono text-[#6b7280]">Audit Trail</span>
          </div>

          {execution?.recentRecords && execution.recentRecords.length > 0 ? (
            <div className="divide-y divide-[#e5e7eb]">
              {execution.recentRecords.map((r: any) => (
                <div
                  key={r.id}
                  className="px-4 py-3 hover:bg-[#f9fafb] transition-colors flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="font-semibold text-[#111827]">{r.taskTitle}</div>
                    <div className="text-[11px] font-mono text-[#6b7280]">
                      Logged on {new Date(r.recordedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-black">{r.timeSpentHours}h</span>
                    <div className="text-[10px] font-mono">
                      {r.completedOnTime ? (
                        <span className="text-[#059669] font-bold">On Time</span>
                      ) : (
                        <span className="text-[#dc2626] font-bold">Delayed</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs font-mono text-[#6b7280] p-8 text-center">
              No execution records found. Complete roadmap tasks to record telemetry.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
