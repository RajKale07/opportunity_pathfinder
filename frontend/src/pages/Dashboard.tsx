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
      <div className="flex h-96 items-center justify-center space-x-2 text-[#4b5563]">
        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs font-mono">Synchronizing with Student Digital Twin...</span>
      </div>
    );
  }

  const topCareer = recommendations[0];
  const topOpp = opportunities[0];

  return (
    <div className="space-y-4 text-[#111827]">
      {/* Top Header / LeetCode Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#e5e7eb]">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#111827]">Dashboard</h1>
          <p className="text-xs text-[#6b7280]">Continuous Closed-Loop Career Operating System & Digital Twin</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleRunFullDemo}
            disabled={runningDemo}
            className="px-3.5 py-1.5 bg-black hover:bg-[#262626] disabled:opacity-50 text-white rounded text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-sm"
          >
            <Play className={`w-3.5 h-3.5 fill-current ${runningDemo ? 'animate-spin' : ''}`} />
            <span>{runningDemo ? 'Replaying Loop...' : 'Run 16-Step Scenario'}</span>
          </button>
          <button
            onClick={loadDashboardData}
            title="Refresh All Telemetry"
            className="p-1.5 bg-white hover:bg-[#f3f4f6] text-[#4b5563] hover:text-black border border-[#e5e7eb] rounded transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {demoNotification && (
        <div className="p-3 bg-white border border-black rounded text-xs text-[#111827] flex items-center justify-between shadow-sm">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#059669]" />
            {demoNotification}
          </span>
          <button onClick={() => setDemoNotification(null)} className="text-[#6b7280] hover:text-black text-xs font-medium">
            Dismiss
          </button>
        </div>
      )}

      {/* LeetCode Style Unified Metric Strip */}
      <div className="bg-white border border-[#e5e7eb] rounded overflow-hidden shadow-sm">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-y sm:divide-y-0 sm:divide-x divide-[#e5e7eb]">
          <div className="p-4 space-y-1">
            <div className="text-[11px] font-mono text-[#6b7280]">Skill Proficiency</div>
            <div className="text-xl font-bold font-mono text-[#111827]">{twin?.features?.skillProficiency || 0}%</div>
            <div className="text-[10px] text-[#059669] font-medium flex items-center gap-1 font-mono">
              <TrendingUp className="w-3 h-3" /> Core Mastery
            </div>
          </div>

          <div className="p-4 space-y-1">
            <div className="text-[11px] font-mono text-[#6b7280]">Execution Rate</div>
            <div className="text-xl font-bold font-mono text-[#111827]">{execution?.executionRate || 0}%</div>
            <div className="text-[10px] text-[#6b7280] font-mono">
              {execution?.completedTasks || 0}/{execution?.totalAssignedTasks || 0} tasks
            </div>
          </div>

          <div className="p-4 space-y-1">
            <div className="text-[11px] font-mono text-[#6b7280]">Consistency</div>
            <div className="text-xl font-bold font-mono text-[#111827]">{execution?.consistencyScore || 78}%</div>
            <div className="text-[10px] text-[#059669] font-mono">Regular streak</div>
          </div>

          <div className="p-4 space-y-1">
            <div className="text-[11px] font-mono text-[#6b7280]">Problem Solving</div>
            <div className="text-xl font-bold font-mono text-[#111827]">{twin?.features?.problemSolvingScore || 55}%</div>
            <div className="text-[10px] text-[#6b7280] font-mono">Algorithms (DSA)</div>
          </div>

          <div className="p-4 space-y-1">
            <div className="text-[11px] font-mono text-[#6b7280]">Career Readiness</div>
            <div className="text-xl font-bold font-mono text-[#111827]">{twin?.overallReadiness || 0}%</div>
            <div className="text-[10px] text-[#6b7280] font-mono">10-Dim Radar</div>
          </div>

          <div className="p-4 space-y-1">
            <div className="text-[11px] font-mono text-[#6b7280]">Top Match</div>
            <div className="text-xl font-bold font-mono text-[#059669]">{topOpp?.matchPercentage || 84}%</div>
            <div className="text-[10px] text-[#6b7280] truncate font-medium">{topOpp?.company || 'Stripe'}</div>
          </div>
        </div>
      </div>

      {/* Executive Career Diagnostic */}
      <div className="bg-white border border-[#e5e7eb] rounded p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between pb-2 border-b border-[#e5e7eb] text-xs">
          <div className="flex items-center space-x-2 font-semibold text-[#111827]">
            <Cpu className="w-3.5 h-3.5 text-black" />
            <span>Executive Career Diagnostic</span>
          </div>
          <div className="text-[11px] text-[#6b7280]">
            Twin State: <strong className="text-[#111827] font-mono">v{twin?.currentVersion || 1}</strong> • Tier:{' '}
            <span className="px-1.5 py-0.5 rounded bg-[#f3f4f6] text-[#111827] font-mono text-[10px] font-bold border border-[#e5e7eb]">
              {twin?.readinessTier || 'DEVELOPING'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          <div className="space-y-1">
            <div className="text-[11px] font-bold text-black uppercase tracking-wider">1. Current State</div>
            <div className="text-xs font-semibold text-[#111827]">
              {twin?.features?.experienceLevel || 'INTERMEDIATE'} in {topCareer?.domain || 'Software Engineering'}
            </div>
            <p className="text-[11px] text-[#6b7280] leading-relaxed">
              Skill Proficiency is <span className="text-[#111827] font-mono font-bold">{twin?.features?.skillProficiency || 0}%</span> across {twin?.features?.projectCount || 0} projects with {twin?.overallReadiness || 0}% readiness.
            </p>
          </div>

          <div className="space-y-1">
            <div className="text-[11px] font-bold text-black uppercase tracking-wider">2. Next Action</div>
            <div className="text-xs font-semibold text-[#111827]">
              {todayTasks.length > 0 ? todayTasks[0].title : 'Generate personalized roadmap'}
            </div>
            <p className="text-[11px] text-[#6b7280] leading-relaxed">
              {todayTasks.length > 0 
                ? `Complete Phase 1 task (${todayTasks[0].estimatedHours}h). Submit repository evidence to unblock next phase.` 
                : 'Select target role on Career Paths page to calculate gaps and generate plan.'}
            </p>
          </div>

          <div className="space-y-1">
            <div className="text-[11px] font-bold text-black uppercase tracking-wider">3. Rationale</div>
            <div className="text-xs font-semibold text-[#111827]">
              Prerequisite Dependency & Gap Mitigation
            </div>
            <p className="text-[11px] text-[#6b7280] leading-relaxed">
              Targeting <span className="text-[#111827] font-medium">{topCareer?.title || 'Backend Developer'}</span> requires closing {topCareer?.topSkillGaps?.length || 2} prerequisite gaps before advancing.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Tasks Table + Opportunities & Alignment */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column: Active Tasks (LeetCode Problem List Style) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-[#e5e7eb] rounded overflow-hidden shadow-sm">
            <div className="px-4 py-3 border-b border-[#e5e7eb] flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-black" />
                <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider">Prioritized Active Tasks</h3>
              </div>
              <Link to="/tasks" className="text-xs text-black hover:underline flex items-center gap-1 font-semibold">
                Workbench <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {todayTasks.length === 0 ? (
              <div className="p-8 text-center space-y-3">
                <p className="text-xs text-[#6b7280]">No active tasks loaded for today.</p>
                <Link
                  to="/career-paths"
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-black hover:bg-neutral-800 text-white rounded text-xs font-semibold"
                >
                  <span>Select Career Path & Generate Roadmap</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-[#e5e7eb]">
                {todayTasks.map((t, idx) => (
                  <div
                    key={t.id}
                    className="p-3.5 hover:bg-[#f9fafb] transition-colors flex items-center justify-between gap-3"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] text-[#6b7280] font-mono">#{idx + 1}</span>
                        <h4 className="text-xs font-semibold text-[#111827] hover:underline cursor-pointer truncate">
                          {t.title}
                        </h4>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-medium ${
                          t.priority === 'CRITICAL' ? 'bg-[#fef2f2] text-[#dc2626] border border-[#fecaca]' :
                          t.priority === 'HIGH' ? 'bg-[#fffbeb] text-[#d97706] border border-[#fde68a]' : 'bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0]'
                        }`}>
                          {t.priority}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3 text-[11px] text-[#6b7280]">
                        <span>Skill: <strong className="text-[#111827]">{t.skillName || 'Architecture'}</strong></span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {t.estimatedHours}h</span>
                      </div>
                    </div>

                    <Link
                      to="/tasks"
                      className="px-2.5 py-1 rounded bg-black hover:bg-neutral-800 text-white text-xs font-semibold flex-shrink-0 transition-colors"
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
            <div className="bg-white border border-[#e5e7eb] rounded overflow-hidden shadow-sm">
              <div className="px-4 py-3 border-b border-[#e5e7eb] flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider">{activePlan.title}</h3>
                  <p className="text-[11px] text-[#6b7280]">Version {activePlan.version} • {activePlan.phases?.length || 3} Phases</p>
                </div>
                <Link to="/roadmap" className="text-xs text-black hover:underline flex items-center gap-1 font-semibold">
                  Roadmap <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#e5e7eb]">
                {activePlan.phases?.slice(0, 3).map((p: any) => (
                  <div key={p.id} className="p-3.5 space-y-1.5 hover:bg-[#f9fafb] transition-colors">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-[#6b7280] font-mono">Phase {p.phaseOrder}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-medium ${
                        p.status === 'COMPLETED' ? 'bg-[#ecfdf5] text-[#059669]' :
                        p.status === 'IN_PROGRESS' ? 'bg-[#fffbeb] text-[#d97706]' : 'bg-[#f3f4f6] text-[#6b7280]'
                      }`}>
                        {p.status}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-[#111827] truncate">{p.title}</div>
                    <div className="text-[11px] text-[#6b7280]">{p.tasks?.length || 0} tasks • {p.durationWeeks} weeks</div>
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
            <div className="bg-white border border-[#e5e7eb] rounded p-4 space-y-3 shadow-sm">
              <div className="flex items-center justify-between pb-2 border-b border-[#e5e7eb]">
                <span className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-black" />
                  Top Match
                </span>
                <span className="text-xs font-bold font-mono text-[#059669]">{topOpp.matchPercentage}% Fit</span>
              </div>

              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-[#111827]">{topOpp.title}</h4>
                <div className="text-xs text-[#6b7280]">{topOpp.company} • {topOpp.location}</div>
                <div className="text-xs text-black font-mono font-semibold">{topOpp.compensation}</div>
              </div>

              {/* Match vs Readiness Breakdown */}
              <div className="p-2.5 bg-[#f9fafb] rounded border border-[#e5e7eb] space-y-1.5 text-xs">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-[#6b7280]">Opportunity Match:</span>
                  <span className="font-mono font-bold text-[#059669]">{topOpp.matchPercentage}%</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-[#6b7280]">Candidate Readiness:</span>
                  <span className="font-mono font-bold text-black">{topOpp.readinessPercentage}%</span>
                </div>
                <div className="text-[10px] text-[#6b7280] pt-1.5 border-t border-[#e5e7eb] line-clamp-2">
                  {topOpp.whyMatchedExplanation}
                </div>
              </div>

              <Link
                to="/opportunities"
                className="w-full py-1.5 bg-[#f3f4f6] hover:bg-[#e5e7eb] text-[#111827] rounded text-xs font-semibold flex items-center justify-center space-x-1 transition-colors"
              >
                <span>View All Matched Roles</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}

          {/* Career Path Alignment */}
          {topCareer && (
            <div className="bg-white border border-[#e5e7eb] rounded p-4 space-y-3 shadow-sm">
              <div className="flex items-center justify-between pb-2 border-b border-[#e5e7eb]">
                <span className="text-xs font-bold text-[#111827] uppercase tracking-wider">
                  Target Alignment
                </span>
                <span className="text-xs font-bold font-mono text-black">{topCareer.overallMatchScore}%</span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-[#111827]">{topCareer.title}</h4>
                <p className="text-[11px] text-[#6b7280]">{topCareer.domain}</p>
              </div>

              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between text-[#6b7280]">
                  <span>Skill Alignment:</span>
                  <span className="text-[#111827] font-mono font-semibold">{topCareer.skillAlignment}%</span>
                </div>
                <div className="flex justify-between text-[#6b7280]">
                  <span>Interest Alignment:</span>
                  <span className="text-[#111827] font-mono font-semibold">{topCareer.interestAlignment}%</span>
                </div>
                <div className="flex justify-between text-[#6b7280]">
                  <span>Project Portfolio:</span>
                  <span className="text-[#111827] font-mono font-semibold">{topCareer.projectAlignment}%</span>
                </div>
              </div>

              <Link
                to="/career-paths"
                className="w-full py-1.5 bg-[#f3f4f6] hover:bg-[#e5e7eb] text-[#111827] rounded text-xs font-semibold flex items-center justify-center space-x-1 transition-colors"
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
