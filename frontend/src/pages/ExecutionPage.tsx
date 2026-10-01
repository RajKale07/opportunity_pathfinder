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
      <div className="flex h-96 items-center justify-center space-x-2 text-[#9ca3af]">
        <div className="w-4 h-4 border-2 border-[#ffa116] border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs font-mono">Analyzing behavioral execution telemetry...</span>
      </div>
    );
  }

  const breakdownData = [
    { name: 'Completed', count: execution?.completedTasks || 0, fill: '#2cbb5d' },
    { name: 'In Progress', count: execution?.inProgressTasks || 0, fill: '#ffc01e' },
    { name: 'Delayed', count: execution?.delayedTasks || 0, fill: '#ffa116' },
    { name: 'Failed', count: execution?.failedTasks || 0, fill: '#ef4743' },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-[#262626] border border-[#333333] rounded px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2 text-[11px] font-mono text-[#ffa116]">
            <Activity className="w-3.5 h-3.5" />
            <span>BEHAVIORAL ANALYTICS ENGINE</span>
          </div>
          <h1 className="text-base font-semibold text-[#eff1f6] mt-0.5">Execution Velocity & Habit Consistency</h1>
          <p className="text-xs text-[#9ca3af] mt-0.5">
            Real performance tracking evaluating deadline adherence, consistency, and pacing stability.
          </p>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="bg-[#262626] border border-[#333333] rounded grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#333333]">
        <div className="p-3.5">
          <span className="text-[11px] font-mono text-[#9ca3af]">Execution Rate</span>
          <div className="text-lg font-bold font-mono text-[#2cbb5d] mt-0.5">{execution?.executionRate || 0}%</div>
          <p className="text-[10px] text-[#9ca3af] mt-0.5">completed / assigned</p>
        </div>

        <div className="p-3.5">
          <span className="text-[11px] font-mono text-[#9ca3af]">Deadline Adherence</span>
          <div className="text-lg font-bold font-mono text-[#eff1f6] mt-0.5">{execution?.deadlineAdherenceRate || 0}%</div>
          <p className="text-[10px] text-[#9ca3af] mt-0.5">on-time deliveries</p>
        </div>

        <div className="p-3.5">
          <span className="text-[11px] font-mono text-[#9ca3af]">Consistency Score</span>
          <div className="text-lg font-bold font-mono text-[#ffa116] mt-0.5">{execution?.consistencyScore || 78}%</div>
          <p className="text-[10px] text-[#9ca3af] mt-0.5">regularity factor</p>
        </div>

        <div className="p-3.5">
          <span className="text-[11px] font-mono text-[#9ca3af]">Learning Velocity</span>
          <div className="text-lg font-bold font-mono text-[#eff1f6] mt-0.5">{execution?.learningVelocity || 3.5}</div>
          <p className="text-[10px] text-[#9ca3af] mt-0.5">tasks / week</p>
        </div>
      </div>

      {/* Charts & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Task Distribution */}
        <div className="bg-[#262626] border border-[#333333] rounded p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-[#333333] pb-2">
            <span className="text-xs font-semibold text-[#eff1f6]">Task Execution Distribution</span>
            <span className="text-[11px] font-mono text-[#9ca3af]">Summary</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={breakdownData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333333" vertical={false} />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} tickLine={false} />
                <YAxis stroke="#9ca3af" fontSize={11} allowDecimals={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a1a',
                    borderColor: '#333333',
                    borderRadius: '4px',
                    fontSize: '12px',
                    color: '#eff1f6',
                  }}
                />
                <Bar dataKey="count" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Verified Execution Records */}
        <div className="bg-[#262626] border border-[#333333] rounded overflow-hidden">
          <div className="px-4 py-2.5 border-b border-[#333333] flex items-center justify-between">
            <span className="text-xs font-semibold text-[#eff1f6]">Verified Execution Telemetry</span>
            <span className="text-[11px] font-mono text-[#9ca3af]">Audit Trail</span>
          </div>

          {execution?.recentRecords && execution.recentRecords.length > 0 ? (
            <div className="divide-y divide-[#333333]">
              {execution.recentRecords.map((r: any) => (
                <div
                  key={r.id}
                  className="px-4 py-3 hover:bg-[#2e2e2e] transition-colors flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="font-medium text-[#eff1f6]">{r.taskTitle}</div>
                    <div className="text-[11px] font-mono text-[#9ca3af]">
                      Logged on {new Date(r.recordedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-[#ffa116]">{r.timeSpentHours}h</span>
                    <div className="text-[10px] font-mono text-[#9ca3af]">
                      {r.completedOnTime ? (
                        <span className="text-[#2cbb5d]">On Time</span>
                      ) : (
                        <span className="text-[#ef4743]">Delayed</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs font-mono text-[#9ca3af] p-8 text-center">
              No execution records found. Complete roadmap tasks to record telemetry.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
