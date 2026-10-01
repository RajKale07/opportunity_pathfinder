import React, { useState, useEffect } from 'react';
import { profileApi } from '../api/client';
import { Settings, CheckCircle2, Save } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [headline, setHeadline] = useState('');
  const [biography, setBiography] = useState('');
  const [preferredDomain, setPreferredDomain] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [weeklyHours, setWeeklyHours] = useState(15);
  const [remotePreference, setRemotePreference] = useState('HYBRID');
  const [githubUrl, setGithubUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    profileApi.getProfile().then((res: any) => {
      if (res.data) {
        setProfile(res.data);
        setHeadline(res.data.headline || '');
        setBiography(res.data.biography || '');
        setPreferredDomain(res.data.preferredDomain || '');
        setTargetRole(res.data.targetRole || '');
        setWeeklyHours(res.data.weeklyAvailableHours || 15);
        setRemotePreference(res.data.remotePreference || 'HYBRID');
        setGithubUrl(res.data.githubUrl || '');
      }
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await profileApi.updateProfile({
        headline,
        biography,
        preferredDomain,
        targetRole,
        weeklyAvailableHours: weeklyHours,
        remotePreference,
        githubUrl,
      });
      setMsg('Profile preferences updated and synchronized with Student Digital Twin.');
    } catch (err: any) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4 max-w-4xl">
      {/* Header */}
      <div className="bg-[#262626] border border-[#333333] rounded px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2 text-[11px] font-mono text-[#ffa116]">
            <Settings className="w-3.5 h-3.5" />
            <span>PROFILE & SYSTEM PREFERENCES</span>
          </div>
          <h1 className="text-base font-semibold text-[#eff1f6] mt-0.5">Student Career Profile & Preferences</h1>
          <p className="text-xs text-[#9ca3af] mt-0.5">
            Configure target domains, weekly study availability, portfolio repositories, and career constraints.
          </p>
        </div>
      </div>

      {msg && (
        <div className="p-3 bg-[#262626] border border-[#2cbb5d]/40 rounded text-xs text-[#2cbb5d] font-mono flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            {msg}
          </span>
          <button onClick={() => setMsg(null)} className="text-[#9ca3af] hover:text-[#eff1f6] text-xs">Dismiss</button>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-[#262626] border border-[#333333] rounded p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] font-mono text-[#9ca3af] block mb-1">Professional Headline</label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-[#333333] rounded px-3 py-1.5 text-xs text-[#eff1f6] focus:outline-none focus:border-[#ffa116]"
            />
          </div>

          <div>
            <label className="text-[11px] font-mono text-[#9ca3af] block mb-1">Target Primary Role</label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-[#333333] rounded px-3 py-1.5 text-xs text-[#eff1f6] focus:outline-none focus:border-[#ffa116]"
            />
          </div>

          <div>
            <label className="text-[11px] font-mono text-[#9ca3af] block mb-1">Preferred Career Domain</label>
            <input
              type="text"
              value={preferredDomain}
              onChange={(e) => setPreferredDomain(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-[#333333] rounded px-3 py-1.5 text-xs text-[#eff1f6] focus:outline-none focus:border-[#ffa116]"
            />
          </div>

          <div>
            <label className="text-[11px] font-mono text-[#9ca3af] block mb-1">
              Weekly Available Study Hours: <span className="text-[#ffa116] font-bold">{weeklyHours}h/wk</span>
            </label>
            <input
              type="range"
              min="5"
              max="40"
              value={weeklyHours}
              onChange={(e) => setWeeklyHours(Number(e.target.value))}
              className="w-full accent-[#ffa116] mt-2"
            />
          </div>

          <div>
            <label className="text-[11px] font-mono text-[#9ca3af] block mb-1">Work Preference</label>
            <select
              value={remotePreference}
              onChange={(e) => setRemotePreference(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-[#333333] rounded px-3 py-1.5 text-xs text-[#eff1f6] focus:outline-none focus:border-[#ffa116]"
            >
              <option value="REMOTE">Remote</option>
              <option value="HYBRID">Hybrid</option>
              <option value="ONSITE">On-Site</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-mono text-[#9ca3af] block mb-1">GitHub Profile / Org URL</label>
            <input
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-[#333333] rounded px-3 py-1.5 text-xs text-[#eff1f6] focus:outline-none focus:border-[#ffa116]"
            />
          </div>
        </div>

        <div>
          <label className="text-[11px] font-mono text-[#9ca3af] block mb-1">Biography / Career Statement</label>
          <textarea
            rows={3}
            value={biography}
            onChange={(e) => setBiography(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-[#333333] rounded p-3 text-xs text-[#eff1f6] focus:outline-none focus:border-[#ffa116]"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2 bg-[#ffa116] hover:bg-[#ffb03a] disabled:opacity-50 text-black rounded text-xs font-semibold flex items-center space-x-1.5 transition-colors"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{saving ? 'Synchronizing...' : 'Save & Update Twin'}</span>
        </button>
      </form>
    </div>
  );
};
