import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  digitalTwinApi,
  learningApi,
  executionApi,
  opportunityApi,
  careersApi,
  demoApi
} from '../api/client';
import {
  Sparkles,
  Cpu,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Briefcase,
  Play,
  RotateCcw,
  Zap,
  Target,
  Clock
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

export const Dashboard: React.FC = () => {
  const [twin, setTwin] = useState<any>(null);
  const [activePlan, setActivePlan] = useState<any>(null);
  const [todayTasks, setTodayTasks] = useState<any[]>([]);
  const [execution, setExecution] = useState<any>(null);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [runningDemo, setRunningDemo] = useState(false);
  const [demoNotification, setDemoNotification] = useState<string | null>(null);

  const loadDashboardData = async () => {
    try {
      const [twinRes, planRes, tasksRes, execRes, oppRes, recRes] = await Promise.allSettled([
        digitalTwinApi.getCurrentState(),
        learningApi.getActivePlan(),
        learningApi.getTodayTasks(),
        executionApi.getSummary(),
        opportunityApi.getMatches(),
        careersApi.getRecommendations()
      ]);

      if (twinRes.status === 'fulfilled' && (twinRes.value as any).data) {
        setTwin((twinRes.value as any).data);
      }
      if (planRes.status === 'fulfilled' && (planRes.value as any).data) {
        setActivePlan((planRes.value as any).data);
      }
      if (tasksRes.status === 'fulfilled' && (tasksRes.value as any).data) {
        setTodayTasks((tasksRes.value as any).data);
      }
      if (execRes.status === 'fulfilled' && (execRes.value as any).data) {
        setExecution((execRes.value as any).data);
      }
      if (oppRes.status === 'fulfilled' && (oppRes.value as any).data) {
        setOpportunities((oppRes.value as any).data);
      }
      if (recRes.status === 'fulfilled' && (recRes.value as any).data) {
        setRecommendations((recRes.value as any).data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleRunFullDemo = async () => {
    setRunningDemo(true);
    setDemoNotification('Executing 16-step closed-loop demonstration scenario...');
    try {
      const res: any = await demoApi.runScenario();
      setDemoNotification('Scenario completed! Adaptive loop modified roadmap and updated Digital Twin to v4.');
      loadDashboardData();
    } catch (err: any) {
      setDemoNotification('Scenario failed: ' + (err?.message || 'Error'));
    } finally {
      setRunningDemo(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center space-x-3 text-slate-400">
        <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm font-medium">Synchronizing with Student Digital Twin...</span>
      </div>
    );
  }

  const topCareer = recommendations[0];
  const topOpp = opportunities[0];

  return (
    <div className="space-y-6">
      {/* Demonstration Banner & Execution Bar */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              Closed-Loop Demonstration Mode
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                Automated 16-Step Loop
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Trigger the complete lifecycle: profile → roadmap → assessment failure → adaptive replanning → twin update → opportunity match.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 flex-shrink-0">
          <button
            onClick={handleRunFullDemo}
            disabled={runningDemo}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all shadow-lg shadow-emerald-500/20"
          >
            <Play className={`w-3.5 h-3.5 fill-current ${runningDemo ? 'animate-spin' : ''}`} />
            <span>{runningDemo ? 'Replaying Loop...' : 'Run 16-Step Scenario'}</span>
          </button>
          <button
            onClick={loadDashboardData}
            title="Refresh All Telemetry"
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {demoNotification && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            {demoNotification}
          </span>
          <button onClick={() => setDemoNotification(null)} className="text-slate-400 hover:text-white text-xs">
            Dismiss
          </button>
        </div>
      )}

      {/* Primary Career Question Card: Where am I now, what should I do next, and why? */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-emerald-500/5 to-transparent pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
            <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              <Cpu className="w-4 h-4" />
              <span>Executive Career Diagnostic</span>
            </div>
            <div className="text-xs text-slate-400">
              Digital Twin Version: <strong className="text-white">v{twin?.currentVersion || 1}</strong> • Tier:{' '}
              <strong className="text-emerald-400">{twin?.readinessTier || 'DEVELOPING'}</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1.5 border-l-2 border-emerald-500 pl-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase">1. Where am I now?</span>
              <p className="text-sm font-semibold text-slate-100">
                {twin?.features?.experienceLevel || 'INTERMEDIATE'} in {topCareer?.domain || 'Software Engineering'}
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Avg Skill Proficiency is <strong className="text-white">{twin?.features?.skillProficiency || 0}%</strong> with{' '}
                {twin?.features?.projectCount || 0} portfolio projects and {twin?.overallReadiness || 0}% composite readiness.
              </p>
            </div>

            <div className="space-y-1.5 border-l-2 border-teal-500 pl-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase">2. What should I do next?</span>
              <p className="text-sm font-semibold text-slate-100">
                {todayTasks.length > 0 ? todayTasks[0].title : 'Generate personalized roadmap'}
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">
                {todayTasks.length > 0 
                  ? `Focus on Phase 1 diagnostic task (${todayTasks[0].estimatedHours}h estimated). Submit repository evidence to unblock next phase.` 
                  : 'Select target role on Career Paths page to calculate gaps and generate plan.'}
              </p>
            </div>

            <div className="space-y-1.5 border-l-2 border-indigo-500 pl-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase">3. Why this action?</span>
              <p className="text-sm font-semibold text-slate-100">
                Prerequisite Dependency & Gap Mitigation
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Targeting <strong className="text-slate-200">{topCareer?.title || 'Backend Developer'}</strong> requires closing{' '}
                {topCareer?.topSkillGaps?.length || 2} prerequisite gaps before advancing to production capstones.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Digital Twin Core Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 font-medium">Skill Proficiency</span>
          <div className="text-xl font-bold text-white">{twin?.features?.skillProficiency || 0}%</div>
          <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
            <TrendingUp className="w-3 h-3" /> Core Mastery
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 font-medium">Execution Rate</span>
          <div className="text-xl font-bold text-white">{execution?.executionRate || 0}%</div>
          <div className="text-[10px] text-slate-400">
            {execution?.completedTasks || 0}/{execution?.totalAssignedTasks || 0} tasks
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 font-medium">Consistency Score</span>
          <div className="text-xl font-bold text-white">{execution?.consistencyScore || 78}%</div>
          <div className="text-[10px] text-emerald-400">Regularity factor</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 font-medium">Problem Solving</span>
          <div className="text-xl font-bold text-white">{twin?.features?.problemSolvingScore || 55}%</div>
          <div className="text-[10px] text-slate-400">DSA & Algorithms</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 font-medium">Overall Readiness</span>
          <div className="text-xl font-bold text-white">{twin?.overallReadiness || 0}%</div>
          <div className="text-[10px] text-indigo-400 font-semibold">10-Dim Radar</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 font-medium">Active Top Match</span>
          <div className="text-xl font-bold text-emerald-400">{topOpp?.matchPercentage || 84}%</div>
          <div className="text-[10px] text-slate-400 truncate">{topOpp?.company || 'Stripe'}</div>
        </div>
      </div>

      {/* Main Grid: Today's Tasks + Top Career & Opportunity Match */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Today's Prioritized Tasks */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Prioritized Active Tasks</h3>
              </div>
              <Link to="/tasks" className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-medium">
                View all in workbench <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {todayTasks.length === 0 ? (
              <div className="p-8 text-center bg-slate-950/40 rounded-xl border border-dashed border-slate-800 space-y-3">
                <p className="text-xs text-slate-400">No active tasks loaded for today.</p>
                <Link
                  to="/career-paths"
                  className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold"
                >
                  <span>Select Career Path & Generate Roadmap</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="space-y-2.5">
                {todayTasks.map((t) => (
                  <div
                    key={t.id}
                    className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {t.skillName || 'Architecture'}
                        </span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {t.estimatedHours}h
                        </span>
                        <span className="text-[10px] text-rose-400 font-semibold">{t.priority}</span>
                      </div>
                      <h4 className="text-xs font-semibold text-slate-200">{t.title}</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{t.description}</p>
                    </div>

                    <Link
                      to="/tasks"
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-300 text-xs font-semibold flex-shrink-0 transition-colors"
                    >
                      Submit Proof
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Learning Roadmap Snapshot */}
          {activePlan && (
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">{activePlan.title}</h3>
                  <p className="text-xs text-slate-400">Plan v{activePlan.version} • {activePlan.phases?.length || 3} Structured Phases</p>
                </div>
                <Link to="/roadmap" className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-medium">
                  Full roadmap <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {activePlan.phases?.slice(0, 3).map((p: any) => (
                  <div key={p.id} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-500 font-bold uppercase">Phase {p.phaseOrder}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${
                        p.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400' :
                        p.status === 'IN_PROGRESS' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {p.status}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-slate-200 line-clamp-1">{p.title}</div>
                    <div className="text-[10px] text-slate-400">{p.tasks?.length || 0} tasks • {p.durationWeeks} weeks</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Opportunities & Path Alignment */}
        <div className="space-y-4">
          {/* Top Opportunity Card */}
          {topOpp && (
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                  Top Matched Opportunity
                </span>
                <span className="text-xs font-bold text-emerald-400">{topOpp.matchPercentage}% Match</span>
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white">{topOpp.title}</h4>
                <div className="text-xs text-slate-300 font-medium">{topOpp.company} • {topOpp.location}</div>
                <div className="text-xs text-emerald-400 font-semibold">{topOpp.compensation}</div>
              </div>

              {/* Match vs Readiness Breakdown */}
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Opportunity Match:</span>
                  <span className="font-bold text-emerald-400">{topOpp.matchPercentage}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Candidate Readiness:</span>
                  <span className="font-bold text-indigo-400">{topOpp.readinessPercentage}%</span>
                </div>
                <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                  {topOpp.whyMatchedExplanation}
                </div>
              </div>

              <Link
                to="/opportunities"
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1 transition-colors"
              >
                <span>View All Matched Roles</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          {/* Career Path Alignment */}
          {topCareer && (
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Target Path Alignment
                </span>
                <span className="text-xs font-bold text-indigo-400">{topCareer.overallMatchScore}%</span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white">{topCareer.title}</h4>
                <p className="text-xs text-slate-400">{topCareer.domain}</p>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Skill Alignment:</span>
                  <span className="text-white font-semibold">{topCareer.skillAlignment}%</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Interest Alignment:</span>
                  <span className="text-white font-semibold">{topCareer.interestAlignment}%</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Project Portfolio:</span>
                  <span className="text-white font-semibold">{topCareer.projectAlignment}%</span>
                </div>
              </div>

              <Link
                to="/career-paths"
                className="w-full py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1 transition-colors"
              >
                <span>Compare Alternative Paths</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
