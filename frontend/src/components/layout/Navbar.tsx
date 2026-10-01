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
    <header className="h-14 border-b border-[#282828] bg-[#1a1a1a] px-5 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2.5">
          <div className="h-7 w-7 rounded-md bg-[#ffa116] flex items-center justify-center text-black font-black text-sm shadow-sm">
            <Sparkles className="w-4 h-4 text-black fill-black" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="font-semibold text-sm tracking-tight text-[#eff1f6]">
              Opportunity Pathfinder
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#282828] text-[#9ca3af] border border-[#383838]">
              OS
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {/* Digital Twin State Pill */}
        {twinSummary && (
          <div className="hidden md:flex items-center space-x-2 px-2.5 py-1 rounded bg-[#262626] border border-[#333333] text-xs">
            <span className="h-2 w-2 rounded-full bg-[#ffa116]"></span>
            <span className="text-[#9ca3af]">
              Twin: <strong className="text-[#eff1f6] font-mono">v{twinSummary.version}</strong>
            </span>
            <span className="text-[#444444]">|</span>
            <span className="text-[#9ca3af]">
              Readiness: <strong className="text-[#eff1f6] font-mono">{twinSummary.readiness}%</strong>
            </span>
            <button 
              onClick={fetchTwinStatus} 
              title="Refresh Twin Telemetry"
              className={`p-0.5 rounded text-[#9ca3af] hover:text-[#eff1f6] transition-colors ${refreshing ? 'animate-spin' : ''}`}
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* User Badge */}
        <div className="flex items-center space-x-2.5 pl-3 border-l border-[#282828]">
          <div className="h-7 w-7 rounded-full bg-[#262626] border border-[#3a3a3a] flex items-center justify-center text-[#eff1f6] text-xs font-medium">
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-medium text-[#eff1f6]">{user?.fullName || 'User'}</div>
            <div className="text-[10px] text-[#71717a] font-mono">
              {user?.role?.replace('ROLE_', '') || 'STUDENT'}
            </div>
          </div>
          <button
            onClick={logout}
            title="Log Out"
            className="p-1.5 text-[#71717a] hover:text-[#eff1f6] hover:bg-[#262626] rounded transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
