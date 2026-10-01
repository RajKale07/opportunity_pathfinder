import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Cpu,
  Compass,
  GitFork,
  Target,
  Map,
  CheckSquare,
  Activity,
  AlertTriangle,
  Briefcase,
  Radar,
  MessageSquareCode,
  FileSearch,
  History,
  FlaskConical,
  Settings
} from 'lucide-react';

const navItems = [
  { group: 'Core Intelligence', items: [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/digital-twin', label: 'Digital Twin', icon: Cpu },
    { to: '/career-paths', label: 'Career Paths', icon: Compass },
    { to: '/skills', label: 'Skill Graph', icon: GitFork },
    { to: '/skill-gaps', label: 'Skill Gaps', icon: Target },
  ]},
  { group: 'Execution & Learning', items: [
    { to: '/roadmap', label: 'Adaptive Roadmap', icon: Map },
    { to: '/tasks', label: 'Task Workbench', icon: CheckSquare },
    { to: '/execution', label: 'Execution Monitor', icon: Activity },
    { to: '/intelligence', label: 'Failure Intelligence', icon: AlertTriangle },
  ]},
  { group: 'Opportunities & Outcomes', items: [
    { to: '/opportunities', label: 'Opportunity Matcher', icon: Briefcase },
    { to: '/readiness', label: '10D Readiness Profile', icon: Radar },
    { to: '/interviews', label: 'Mock Interviews', icon: MessageSquareCode },
    { to: '/resume', label: 'Resume & Portfolio', icon: FileSearch },
  ]},
  { group: 'Auditing & Research', items: [
    { to: '/adaptations', label: 'Adaptation Audit', icon: History },
    { to: '/research', label: 'Research & Demo Lab', icon: FlaskConical },
    { to: '/settings', label: 'Profile Settings', icon: Settings },
  ]}
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-slate-900/90 border-r border-slate-800 flex flex-col justify-between flex-shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="p-3.5 space-y-6">
        {navItems.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <div className="px-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              {section.group}
            </div>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) => `
                      flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all
                      ${isActive 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold' 
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'}
                    `}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-slate-800/80 m-2 rounded-xl bg-slate-950/60 border text-[11px] text-slate-400 space-y-1">
        <div className="font-semibold text-slate-300 flex items-center justify-between">
          <span>Closed-Loop AI</span>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
        </div>
        <p className="text-[10px] text-slate-500 leading-tight">
          Observing telemetry & adapting roadmaps based on real evidence.
        </p>
      </div>
    </aside>
  );
};
