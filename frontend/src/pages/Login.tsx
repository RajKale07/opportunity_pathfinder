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
    <div className="min-h-screen bg-[#f7f8fa] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-sm bg-white border border-[#e5e7eb] p-7 rounded shadow-xl">
        <div className="text-center space-y-1 mb-6">
          <div className="inline-flex h-10 w-10 rounded bg-black items-center justify-center mb-2 shadow-sm">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg font-bold text-[#111827] tracking-tight">Opportunity Pathfinder</h1>
          <p className="text-xs text-[#6b7280]">AI Career Operating System & Digital Twin</p>
        </div>

        {error && (
          <div className="mb-4 p-2.5 bg-[#fef2f2] border border-[#fecaca] rounded text-[#dc2626] text-xs flex items-center gap-2 font-mono">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-[11px] font-mono font-semibold text-[#6b7280] mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 absolute left-3 top-3 text-[#9ca3af]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#f9fafb] border border-[#d1d5db] rounded pl-9 pr-3 py-2 text-xs text-[#111827] placeholder-[#9ca3af] focus:outline-none focus:border-black"
                placeholder="student@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono font-semibold text-[#6b7280] mb-1">Password</label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 absolute left-3 top-3 text-[#9ca3af]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#f9fafb] border border-[#d1d5db] rounded pl-9 pr-3 py-2 text-xs text-[#111827] placeholder-[#9ca3af] focus:outline-none focus:border-black"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-black hover:bg-neutral-800 text-white font-semibold text-xs py-2.5 rounded flex items-center justify-center space-x-1.5 transition-colors shadow-sm disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Pathfinder'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-[#e5e7eb] text-center space-y-3">
          <div className="p-2 bg-[#f9fafb] rounded border border-[#e5e7eb] text-[11px] font-mono text-[#4b5563]">
            Demo: <span className="text-[#111827] font-semibold">student@example.com</span> / <span className="text-[#111827] font-semibold">password123</span>
          </div>
          <p className="text-xs text-[#6b7280]">
            New student?{' '}
            <Link to="/register" className="text-black hover:underline font-bold">
              Create student twin
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
