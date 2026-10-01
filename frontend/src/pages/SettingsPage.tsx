import React, { useState, useEffect } from 'react';
import { profileApi } from '../api/client';
import { Settings, CheckCircle2, User, Save, Shield } from 'lucide-react';

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
    <div className="space-y-6 max-w-4xl">
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 shadow-xl">
        <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
          <Settings className="w-4 h-4" />
          <span>Profile & Privacy Controls</span>
        </div>
        <h1 className="text-xl font-extrabold text-white">Student Career Profile & Preferences</h1>
        <p className="text-xs text-slate-400 leading-relaxed">
          Configure target domains, weekly study availability, portfolio repositories, and career constraints.
        </p>
      </div>

      {msg && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            {msg}
          </span>
          <button onClick={() => setMsg(null)} className="text-slate-400 hover:text-white text-xs">Dismiss</button>
        </div>
      )}

      <form onSubmit={handleSave} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Professional Headline</label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Target Primary Role</label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Preferred Career Domain</label>
            <input
              type="text"
              value={preferredDomain}
              onChange={(e) => setPreferredDomain(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Weekly Available Study Hours ({weeklyHours}h/wk)</label>
            <input
              type="range"
              min="5"
              max="40"
              value={weeklyHours}
              onChange={(e) => setWeeklyHours(Number(e.target.value))}
              className="w-full accent-emerald-500 mt-2"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Work Preference</label>
            <select
              value={remotePreference}
              onChange={(e) => setRemotePreference(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
            >
              <option value="REMOTE">Remote</option>
              <option value="HYBRID">Hybrid</option>
              <option value="ONSITE">On-Site</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">GitHub Profile / Organization URL</label>
            <input
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">Biography / Career Statement</label>
          <textarea
            rows={3}
            value={biography}
            onChange={(e) => setBiography(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all shadow-lg shadow-emerald-500/20"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Synchronizing...' : 'Save & Update Career Twin'}</span>
        </button>
      </form>
    </div>
  );
};
