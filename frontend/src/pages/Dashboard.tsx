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
    <div className="space-y-5 text-[#eff1f6]">
      {/* Top Header / LeetCode Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#282828]">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#eff1f6]">Dashboard</h1>
          <p className="text-xs text-[#9ca3af]">Continuous Closed-Loop Career Operating System & Digital Twin</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleRunFullDemo}
            disabled={runningDemo}
            className="px-3.5 py-1.5 bg-[#ffa116] hover:bg-[#e08e14] disabled:opacity-50 text-black rounded text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-sm"
          >
            <Play className={`w-3.5 h-3.5 fill-current ${runningDemo ? 'animate-spin' : ''}`} />
            <span>{runningDemo ? 'Replaying Loop...' : 'Run 16-Step Scenario'}</span>
          </button>
          <button
            onClick={loadDashboardData}
            title="Refresh All Telemetry"
            className="p-1.5 bg-[#262626] hover:bg-[#333333] text-[#9ca3af] hover:text-[#eff1f6] border border-[#333333] rounded transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {demoNotification && (
        <div className="p-3 bg-[#262626] border border-[#ffa116]/40 rounded text-xs text-[#eff1f6] flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#ffa116]" />
            {demoNotification}
          </span>
          <button onClick={() => setDemoNotification(null)} className="text-[#9ca3af] hover:text-white text-xs">
            Dismiss
          </button>
        </div>
      )}

      {/* LeetCode Style Unified Metric Strip */}
      <div className="bg-[#262626] border border-[#333333] rounded overflow-hidden">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-y sm:divide-y-0 sm:divide-x divide-[#333333]">
          <div className="p-4 space-y-1">
            <div className="text-[11px] text-[#9ca3af]">Skill Proficiency</div>
            <div className="text-xl font-bold font-mono text-[#eff1f6]">{twin?.features?.skillProficiency || 0}%</div>
            <div className="text-[10px] text-[#2cbb5d] font-medium flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Core Mastery
            </div>
          </div>

          <div className="p-4 space-y-1">
            <div className="text-[11px] text-[#9ca3af]">Execution Rate</div>
            <div className="text-xl font-bold font-mono text-[#eff1f6]">{execution?.executionRate || 0}%</div>
            <div className="text-[10px] text-[#9ca3af]">
              {execution?.completedTasks || 0}/{execution?.totalAssignedTasks || 0} tasks
            </div>
          </div>

          <div className="p-4 space-y-1">
            <div className="text-[11px] text-[#9ca3af]">Consistency</div>
            <div className="text-xl font-bold font-mono text-[#eff1f6]">{execution?.consistencyScore || 78}%</div>
            <div className="text-[10px] text-[#2cbb5d]">Regular streak</div>
          </div>

          <div className="p-4 space-y-1">
            <div className="text-[11px] text-[#9ca3af]">Problem Solving</div>
            <div className="text-xl font-bold font-mono text-[#eff1f6]">{twin?.features?.problemSolvingScore || 55}%</div>
            <div className="text-[10px] text-[#9ca3af]">Algorithms (DSA)</div>
          </div>

          <div className="p-4 space-y-1">
            <div className="text-[11px] text-[#9ca3af]">Career Readiness</div>
            <div className="text-xl font-bold font-mono text-[#ffa116]">{twin?.overallReadiness || 0}%</div>
            <div className="text-[10px] text-[#9ca3af]">10-Dim Radar</div>
          </div>

          <div className="p-4 space-y-1">
            <div className="text-[11px] text-[#9ca3af]">Top Match</div>
            <div className="text-xl font-bold font-mono text-[#2cbb5d]">{topOpp?.matchPercentage || 84}%</div>
            <div className="text-[10px] text-[#9ca3af] truncate">{topOpp?.company || 'Stripe'}</div>
          </div>
        </div>
      </div>

      {/* Executive Career Diagnostic: Where am I now, what should I do next, and why? */}
      <div className="bg-[#262626] border border-[#333333] rounded p-4 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#333333] text-xs">
          <div className="flex items-center space-x-2 font-medium text-[#eff1f6]">
            <Cpu className="w-3.5 h-3.5 text-[#ffa116]" />
            <span>Executive Career Diagnostic</span>
          </div>
          <div className="text-[11px] text-[#9ca3af]">
            Twin State: <strong className="text-[#eff1f6] font-mono">v{twin?.currentVersion || 1}</strong> • Tier:{' '}
            <span className="px-1.5 py-0.5 rounded bg-[#333333] text-[#eff1f6] font-mono text-[10px]">
              {twin?.readinessTier || 'DEVELOPING'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          <div className="space-y-1">
            <div className="text-[11px] font-semibold text-[#ffa116] uppercase tracking-wider">1. Current State</div>
            <div className="text-xs font-medium text-[#eff1f6]">
              {twin?.features?.experienceLevel || 'INTERMEDIATE'} in {topCareer?.domain || 'Software Engineering'}
            </div>
            <p className="text-[11px] text-[#9ca3af] leading-relaxed">
              Skill Proficiency is <span className="text-[#eff1f6] font-mono">{twin?.features?.skillProficiency || 0}%</span> across {twin?.features?.projectCount || 0} projects with {twin?.overallReadiness || 0}% readiness.
            </p>
          </div>

          <div className="space-y-1">
            <div className="text-[11px] font-semibold text-[#ffa116] uppercase tracking-wider">2. Next Action</div>
            <div className="text-xs font-medium text-[#eff1f6]">
              {todayTasks.length > 0 ? todayTasks[0].title : 'Generate personalized roadmap'}
            </div>
            <p className="text-[11px] text-[#9ca3af] leading-relaxed">
              {todayTasks.length > 0 
                ? `Complete Phase 1 task (${todayTasks[0].estimatedHours}h). Submit repository evidence to unblock next phase.` 
                : 'Select target role on Career Paths page to calculate gaps and generate plan.'}
            </p>
          </div>

          <div className="space-y-1">
            <div className="text-[11px] font-semibold text-[#ffa116] uppercase tracking-wider">3. Rationale</div>
            <div className="text-xs font-medium text-[#eff1f6]">
              Prerequisite Dependency & Gap Mitigation
            </div>
            <p className="text-[11px] text-[#9ca3af] leading-relaxed">
              Targeting <span className="text-[#eff1f6]">{topCareer?.title || 'Backend Developer'}</span> requires closing {topCareer?.topSkillGaps?.length || 2} prerequisite gaps before advancing.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Tasks Table + Opportunities & Alignment */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column: Active Tasks (LeetCode Problem List Style) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#262626] border border-[#333333] rounded overflow-hidden">
            <div className="px-4 py-3 border-b border-[#333333] flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-[#ffa116]" />
                <h3 className="text-xs font-semibold text-[#eff1f6] uppercase tracking-wider">Prioritized Active Tasks</h3>
              </div>
              <Link to="/tasks" className="text-xs text-[#ffa116] hover:underline flex items-center gap-1 font-medium">
                Workbench <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {todayTasks.length === 0 ? (
              <div className="p-8 text-center space-y-3">
                <p className="text-xs text-[#9ca3af]">No active tasks loaded for today.</p>
                <Link
                  to="/career-paths"
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#ffa116] hover:bg-[#e08e14] text-black rounded text-xs font-semibold"
                >
                  <span>Select Career Path & Generate Roadmap</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-[#333333]">
                {todayTasks.map((t, idx) => (
                  <div
                    key={t.id}
                    className="p-3.5 hover:bg-[#2c2c2c] transition-colors flex items-center justify-between gap-3"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] text-[#9ca3af] font-mono">#{idx + 1}</span>
                        <h4 className="text-xs font-medium text-[#eff1f6] hover:text-[#ffa116] cursor-pointer truncate">
                          {t.title}
                        </h4>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                          t.priority === 'CRITICAL' ? 'bg-[#ef4743]/10 text-[#ef4743]' :
                          t.priority === 'HIGH' ? 'bg-[#ffc01e]/10 text-[#ffc01e]' : 'bg-[#2cbb5d]/10 text-[#2cbb5d]'
                        }`}>
                          {t.priority}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3 text-[11px] text-[#9ca3af]">
                        <span>Skill: <strong className="text-[#eff1f6]">{t.skillName || 'Architecture'}</strong></span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {t.estimatedHours}h</span>
                      </div>
                    </div>

                    <Link
                      to="/tasks"
                      className="px-2.5 py-1 rounded bg-[#333333] hover:bg-[#ffa116] hover:text-black text-[#eff1f6] text-xs font-medium flex-shrink-0 transition-colors"
                    >
                      Submit
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Learning Roadmap */}
          {activePlan && (
            <div className="bg-[#262626] border border-[#333333] rounded overflow-hidden">
              <div className="px-4 py-3 border-b border-[#333333] flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-semibold text-[#eff1f6] uppercase tracking-wider">{activePlan.title}</h3>
                  <p className="text-[11px] text-[#9ca3af]">Version {activePlan.version} • {activePlan.phases?.length || 3} Phases</p>
                </div>
                <Link to="/roadmap" className="text-xs text-[#ffa116] hover:underline flex items-center gap-1 font-medium">
                  Roadmap <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#333333]">
                {activePlan.phases?.slice(0, 3).map((p: any) => (
                  <div key={p.id} className="p-3.5 space-y-1.5 hover:bg-[#2c2c2c] transition-colors">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-[#9ca3af] font-mono">Phase {p.phaseOrder}</span>
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono ${
                        p.status === 'COMPLETED' ? 'bg-[#2cbb5d]/10 text-[#2cbb5d]' :
                        p.status === 'IN_PROGRESS' ? 'bg-[#ffa116]/10 text-[#ffa116]' : 'bg-[#333333] text-[#9ca3af]'
                      }`}>
                        {p.status}
                      </span>
                    </div>
                    <div className="text-xs font-medium text-[#eff1f6] truncate">{p.title}</div>
                    <div className="text-[11px] text-[#9ca3af]">{p.tasks?.length || 0} tasks • {p.durationWeeks} weeks</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Opportunities & Path Alignment */}
        <div className="space-y-4">
          {/* Top Opportunity */}
          {topOpp && (
            <div className="bg-[#262626] border border-[#333333] rounded p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#333333]">
                <span className="text-xs font-semibold text-[#eff1f6] uppercase tracking-wider flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-[#ffa116]" />
                  Top Match
                </span>
                <span className="text-xs font-bold font-mono text-[#2cbb5d]">{topOpp.matchPercentage}% Fit</span>
              </div>

              <div className="space-y-0.5">
                <h4 className="text-xs font-semibold text-[#eff1f6]">{topOpp.title}</h4>
                <div className="text-xs text-[#9ca3af]">{topOpp.company} • {topOpp.location}</div>
                <div className="text-xs text-[#ffa116] font-mono font-medium">{topOpp.compensation}</div>
              </div>

              {/* Match vs Readiness Breakdown */}
              <div className="p-2.5 bg-[#202020] rounded border border-[#2d2d2d] space-y-1.5 text-xs">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-[#9ca3af]">Opportunity Match:</span>
                  <span className="font-mono font-semibold text-[#2cbb5d]">{topOpp.matchPercentage}%</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-[#9ca3af]">Candidate Readiness:</span>
                  <span className="font-mono font-semibold text-[#ffa116]">{topOpp.readinessPercentage}%</span>
                </div>
                <div className="text-[10px] text-[#9ca3af] pt-1.5 border-t border-[#2d2d2d] line-clamp-2">
                  {topOpp.whyMatchedExplanation}
                </div>
              </div>

              <Link
                to="/opportunities"
                className="w-full py-1.5 bg-[#333333] hover:bg-[#3e3e3e] text-[#eff1f6] rounded text-xs font-medium flex items-center justify-center space-x-1 transition-colors"
              >
                <span>View All Matched Roles</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}

          {/* Career Path Alignment */}
          {topCareer && (
            <div className="bg-[#262626] border border-[#333333] rounded p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#333333]">
                <span className="text-xs font-semibold text-[#eff1f6] uppercase tracking-wider">
                  Target Alignment
                </span>
                <span className="text-xs font-bold font-mono text-[#ffa116]">{topCareer.overallMatchScore}%</span>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-[#eff1f6]">{topCareer.title}</h4>
                <p className="text-[11px] text-[#9ca3af]">{topCareer.domain}</p>
              </div>

              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between text-[#9ca3af]">
                  <span>Skill Alignment:</span>
                  <span className="text-[#eff1f6] font-mono">{topCareer.skillAlignment}%</span>
                </div>
                <div className="flex justify-between text-[#9ca3af]">
                  <span>Interest Alignment:</span>
                  <span className="text-[#eff1f6] font-mono">{topCareer.interestAlignment}%</span>
                </div>
                <div className="flex justify-between text-[#9ca3af]">
                  <span>Project Portfolio:</span>
                  <span className="text-[#eff1f6] font-mono">{topCareer.projectAlignment}%</span>
                </div>
              </div>

              <Link
                to="/career-paths"
                className="w-full py-1.5 bg-[#333333] hover:bg-[#3e3e3e] text-[#eff1f6] rounded text-xs font-medium flex items-center justify-center space-x-1 transition-colors"
              >
                <span>Compare Alternative Paths</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
