import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';
import { Suspense, lazy } from 'react';

const Scene3D = lazy(() => import('../components/Scene3D'));

const EyeIcon = ({ show }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    {show
      ? <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
      : <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
    }
  </svg>
);

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

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authService.login(form);
      login(res.data);
      toast.success(`Welcome back, ${res.data.name}`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen t-bg flex transition-colors">
      {/* Left — 3D Scene */}
      <div className="hidden lg:flex flex-1 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0">
          <Suspense fallback={null}><Scene3D /></Suspense>
        </div>
        <div className="absolute bottom-10 left-0 right-0 text-center">
          <p className="font-mono text-xs t-dim tracking-widest uppercase">Opportunity Pathfinder</p>
        </div>
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(rgba(128,128,128,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(128,128,128,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="hidden lg:block w-px" style={{ backgroundColor: 'var(--border)' }} />

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center px-8">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-sm">

          {/* Logo + theme toggle */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="t-text">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
                <span className="font-mono text-sm t-text tracking-wider">PATHFINDER</span>
              </div>
              <button onClick={toggle} className="flex items-center justify-center w-7 h-7 rounded border t-border2 t-dim hover:t-text-sec transition-colors">
                {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
              </button>
            </div>
            <h1 className="text-2xl font-semibold t-text mb-1">Sign in</h1>
            <p className="text-sm t-dim">Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs t-dim mb-1.5 font-mono uppercase tracking-wider">Email</label>
              <input type="email"
                className="w-full t-surface2 border t-border2 rounded text-sm t-text px-3 py-2.5 outline-none focus:border-[var(--subtle)] transition-colors"
                style={{ backgroundColor: 'var(--surface2)', color: 'var(--text)', borderColor: 'var(--border2)' }}
                placeholder="you@example.com"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <label className="block text-xs t-dim mb-1.5 font-mono uppercase tracking-wider">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'}
                  className="w-full border rounded text-sm px-3 py-2.5 pr-10 outline-none transition-colors"
                  style={{ backgroundColor: 'var(--surface2)', color: 'var(--text)', borderColor: 'var(--border2)' }}
                  placeholder="••••••••"
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 t-subtle hover:t-text-sec transition-colors">
                  <EyeIcon show={showPass} />
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 text-sm font-medium py-2.5 rounded transition-colors disabled:opacity-40 mt-2 t-btn">
              {loading
                ? <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                : <span>Continue</span>
              }
            </button>
          </form>

          <div className="mt-6 pt-6 border-t t-border">
            <p className="text-sm t-dim">No account?{' '}
              <Link to="/register" className="t-text hover:t-text-sec transition-colors">Create one</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
