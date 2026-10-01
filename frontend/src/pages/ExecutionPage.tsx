import React, { useState, useEffect } from 'react';
import { executionApi } from '../api/client';
import { Activity, TrendingUp, CheckCircle, Clock, Calendar, Zap, AlertCircle } from 'lucide-react';
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
      <div className="flex h-96 items-center justify-center space-x-3 text-slate-400">
        <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm font-medium">Analyzing behavioral execution telemetry...</span>
      </div>
    );
  }

  const breakdownData = [
    { name: 'Completed', count: execution?.completedTasks || 0, fill: '#10b981' },
    { name: 'In Progress', count: execution?.inProgressTasks || 0, fill: '#6366f1' },
    { name: 'Delayed', count: execution?.delayedTasks || 0, fill: '#f59e0b' },
    { name: 'Failed', count: execution?.failedTasks || 0, fill: '#f43f5e' },
  ];

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 shadow-xl">
        <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
          <Activity className="w-4 h-4" />
          <span>Behavioral Analytics Engine</span>
        </div>
        <h1 className="text-xl font-extrabold text-white">Execution Monitoring & Consistency</h1>
        <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
          Opportunity Pathfinder analyzes your actual execution velocity rather than passive intention. Formulas evaluate deadline adherence, regular habit streaks, and pacing stability.
        </p>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Execution Rate</span>
          <div className="text-2xl font-extrabold text-emerald-400">{execution?.executionRate || 0}%</div>
          <p className="text-[10px] text-slate-500">completed / assigned</p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Deadline Adherence</span>
          <div className="text-2xl font-extrabold text-indigo-400">{execution?.deadlineAdherenceRate || 0}%</div>
          <p className="text-[10px] text-slate-500">on-time deliveries</p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Consistency Score</span>
          <div className="text-2xl font-extrabold text-white">{execution?.consistencyScore || 78}%</div>
          <p className="text-[10px] text-emerald-400">Regularity factor</p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Learning Velocity</span>
          <div className="text-2xl font-extrabold text-teal-400">{execution?.learningVelocity || 3.5}</div>
          <p className="text-[10px] text-slate-500">tasks / week</p>
        </div>
      </div>

      {/* Charts & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white">Task Execution Distribution</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={breakdownData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white">Recent Verified Execution Records</h3>
          {execution?.recentRecords && execution.recentRecords.length > 0 ? (
            <div className="space-y-2.5">
              {execution.recentRecords.map((r: any) => (
                <div
                  key={r.id}
                  className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="font-semibold text-slate-200">{r.taskTitle}</div>
                    <div className="text-[10px] text-slate-500">
                      Logged on {new Date(r.recordedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-400">{r.timeSpentHours}h</span>
                    <div className="text-[10px] text-slate-400">
                      {r.completedOnTime ? 'On Time' : 'Delayed'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400">No execution logs recorded yet. Complete tasks in workbench.</p>
          )}
        </div>
      </div>
    </div>
  );
};
