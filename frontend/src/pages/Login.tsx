import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ArrowRight, Lock, Mail, AlertCircle } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('student@example.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.06)_0,transparent_70%)] pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 p-8 rounded-2xl shadow-2xl relative z-10 backdrop-blur-md">
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex h-12 w-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 items-center justify-center shadow-lg shadow-emerald-500/20 mb-2">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Opportunity Pathfinder</h1>
          <p className="text-xs text-slate-400 font-medium">AI Career Operating System & Student Digital Twin</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="student@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs py-3 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-lg shadow-emerald-500/25 disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Career OS'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-800/80 text-center">
          <div className="p-2.5 bg-slate-950/50 rounded-lg border border-slate-800 text-[11px] text-slate-400 mb-4">
            <span className="font-semibold text-slate-300">Quick Demo Account:</span> student@example.com / password123
          </div>
          <p className="text-xs text-slate-400">
            Don't have a profile yet?{' '}
            <Link to="/register" className="text-emerald-400 hover:underline font-semibold">
              Create student twin
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
