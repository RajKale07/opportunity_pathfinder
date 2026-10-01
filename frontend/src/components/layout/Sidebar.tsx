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
    <aside className="w-60 bg-[#1a1a1a] border-r border-[#282828] flex flex-col justify-between flex-shrink-0 min-h-[calc(100vh-3.5rem)]">
      <div className="p-3 space-y-5">
        {navItems.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <div className="px-3 text-[10px] font-semibold text-[#666666] uppercase tracking-wider">
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
                      flex items-center space-x-2.5 px-3 py-1.5 rounded text-xs transition-colors
                      ${isActive 
                        ? 'bg-[#262626] text-[#eff1f6] font-medium border-l-2 border-[#ffa116]' 
                        : 'text-[#9ca3af] hover:text-[#eff1f6] hover:bg-[#222222]'}
                    `}
                  >
                    <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 m-2 rounded bg-[#202020] border border-[#2a2a2a] text-[11px] text-[#888888] space-y-1">
        <div className="font-medium text-[#cccccc] flex items-center justify-between">
          <span>Closed-Loop OS</span>
          <span className="h-1.5 w-1.5 rounded-full bg-[#ffa116]"></span>
        </div>
        <p className="text-[10px] text-[#666666] leading-tight">
          Adaptive feedback loop active
        </p>
      </div>
    </aside>
  );
};
