import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { digitalTwinApi } from '../../api/client';
import { Sparkles, RefreshCw, LogOut, User as UserIcon, Shield } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [twinSummary, setTwinSummary] = useState<{ version: number; readiness: number; tier: string } | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTwinStatus = () => {
    setRefreshing(true);
    digitalTwinApi.getCurrentState()
      .then((res: any) => {
        if (res.data) {
          setTwinSummary({
            version: res.data.currentVersion,
            readiness: res.data.overallReadiness,
            tier: res.data.readinessTier,
          });
        }
      })
      .catch(() => {})
      .finally(() => setRefreshing(false));
  };

  useEffect(() => {
    fetchTwinStatus();
  }, []);

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
              Opportunity Pathfinder
              <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                OS v2.4
              </span>
            </span>
            <p className="text-[11px] text-slate-400 font-medium">AI Career Operating System & Digital Twin</p>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {/* Digital Twin State Pill */}
        {twinSummary && (
          <div className="hidden md:flex items-center space-x-2.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-300 font-medium">
              Twin State: <strong className="text-emerald-400">v{twinSummary.version}</strong>
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300">
              Readiness: <strong className="text-white">{twinSummary.readiness}%</strong>
            </span>
            <button 
              onClick={fetchTwinStatus} 
              title="Refresh Twin Telemetry"
              className={`p-1 rounded text-slate-400 hover:text-white transition-colors ${refreshing ? 'animate-spin' : ''}`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* User Badge */}
        <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
          <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 text-xs font-semibold">
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-semibold text-slate-200">{user?.fullName || 'User'}</div>
            <div className="text-[10px] text-slate-400 flex items-center gap-1">
              <Shield className="w-2.5 h-2.5 text-emerald-400" />
              {user?.role?.replace('ROLE_', '') || 'STUDENT'}
            </div>
          </div>
          <button
            onClick={logout}
            title="Log Out"
            className="p-1.5 ml-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
