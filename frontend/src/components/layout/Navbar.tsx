import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { digitalTwinApi } from '../../api/client';
import { Sparkles, RefreshCw, LogOut } from 'lucide-react';

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
    <header className="h-14 border-b border-[#e5e7eb] bg-white px-5 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2.5">
          <div className="h-7 w-7 rounded-md bg-black flex items-center justify-center text-white font-black text-sm shadow-sm">
            <Sparkles className="w-4 h-4 text-white fill-white" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="font-bold text-sm tracking-tight text-[#111827]">
              Opportunity Pathfinder
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#f3f4f6] text-[#374151] border border-[#e5e7eb] font-semibold">
              OS
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {/* Digital Twin State Pill */}
        {twinSummary && (
          <div className="hidden md:flex items-center space-x-2 px-3 py-1 rounded bg-[#f9fafb] border border-[#e5e7eb] text-xs">
            <span className="h-2 w-2 rounded-full bg-black"></span>
            <span className="text-[#4b5563]">
              Twin: <strong className="text-[#111827] font-mono font-bold">v{twinSummary.version}</strong>
            </span>
            <span className="text-[#d1d5db]">|</span>
            <span className="text-[#4b5563]">
              Readiness: <strong className="text-[#111827] font-mono font-bold">{twinSummary.readiness}%</strong>
            </span>
            <button 
              onClick={fetchTwinStatus} 
              title="Refresh Twin Telemetry"
              className={`p-0.5 rounded text-[#6b7280] hover:text-black transition-colors ${refreshing ? 'animate-spin' : ''}`}
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* User Badge */}
        <div className="flex items-center space-x-2.5 pl-3 border-l border-[#e5e7eb]">
          <div className="h-7 w-7 rounded-full bg-black text-white flex items-center justify-center text-xs font-semibold">
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-semibold text-[#111827]">{user?.fullName || 'User'}</div>
            <div className="text-[10px] text-[#6b7280] font-mono">
              {user?.role?.replace('ROLE_', '') || 'STUDENT'}
            </div>
          </div>
          <button
            onClick={logout}
            title="Log Out"
            className="p-1.5 text-[#6b7280] hover:text-black hover:bg-[#f3f4f6] rounded transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
