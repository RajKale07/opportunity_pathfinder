import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const titles = {
  '/dashboard': 'Dashboard',
  '/profile': 'Profile',
  '/jobs': 'Jobs',
  '/scholarships': 'Scholarships',
  '/schemes': 'Government Schemes',
  '/resume': 'Resume Builder',
  '/assistant': 'AI Assistant',
  '/simulation': 'Career Simulation',
  '/admin': 'Admin Panel',
};

const SunIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);

const MoonIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

export default function Navbar() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const { theme, toggle } = useTheme();

  return (
    <header className="h-12 t-surface border-b t-border flex items-center justify-between px-6 transition-colors">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium t-text">{titles[pathname] || 'Pathfinder'}</span>
        <span className="t-subtle text-xs font-mono">—</span>
        <span className="text-xs t-dim font-mono">{pathname}</span>
      </div>
      <div className="flex items-center gap-3">
        {/* Theme toggle */}
        <button
          onClick={toggle}
          className="flex items-center justify-center w-7 h-7 rounded border t-border2 t-dim hover:t-text-sec transition-colors"
          title={theme === 'dark' ? 'Switch to light' : 'Switch to dark'}
        >
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>

        {/* Notification bell */}
        <button className="t-subtle hover:t-text-sec transition-colors">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
        </button>

        {/* Avatar */}
        <div className="w-6 h-6 rounded-full t-surface2 border t-border2 flex items-center justify-center">
          <span className="text-xs t-text-sec font-mono">{user?.name?.[0]?.toUpperCase()}</span>
        </div>
      </div>
    </header>
  );
}
