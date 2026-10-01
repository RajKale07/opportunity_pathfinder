import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ArrowRight, Lock, Mail, User, AlertCircle } from 'lucide-react';

export const Register: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(fullName, email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-sm bg-[#262626] border border-[#333333] p-7 rounded shadow-2xl">
        <div className="text-center space-y-1 mb-6">
          <div className="inline-flex h-10 w-10 rounded bg-[#ffa116] items-center justify-center mb-2">
            <Sparkles className="w-5 h-5 text-black" />
          </div>
          <h1 className="text-lg font-bold text-[#eff1f6] tracking-tight">Create Student Twin</h1>
          <p className="text-xs text-[#9ca3af]">Initialize Career Digital Twin & Analytics</p>
        </div>

        {error && (
          <div className="mb-4 p-2.5 bg-[#ef4743]/10 border border-[#ef4743]/30 rounded text-[#ef4743] text-xs flex items-center gap-2 font-mono">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-[11px] font-mono text-[#9ca3af] mb-1">Full Name</label>
            <div className="relative">
              <User className="w-3.5 h-3.5 absolute left-3 top-3 text-[#9ca3af]" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full bg-[#1a1a1a] border border-[#333333] rounded pl-9 pr-3 py-2 text-xs text-[#eff1f6] placeholder-[#6b7280] focus:outline-none focus:border-[#ffa116]"
                placeholder="Alex Chen"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-[#9ca3af] mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 absolute left-3 top-3 text-[#9ca3af]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#1a1a1a] border border-[#333333] rounded pl-9 pr-3 py-2 text-xs text-[#eff1f6] placeholder-[#6b7280] focus:outline-none focus:border-[#ffa116]"
                placeholder="alex.chen@university.edu"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-[#9ca3af] mb-1">Password</label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 absolute left-3 top-3 text-[#9ca3af]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-[#1a1a1a] border border-[#333333] rounded pl-9 pr-3 py-2 text-xs text-[#eff1f6] placeholder-[#6b7280] focus:outline-none focus:border-[#ffa116]"
                placeholder="At least 6 characters"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-[#ffa116] hover:bg-[#ffb03a] text-black font-semibold text-xs py-2.5 rounded flex items-center justify-center space-x-1.5 transition-colors disabled:opacity-50"
          >
            <span>{loading ? 'Initializing Twin...' : 'Initialize Digital Twin'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-[#333333] text-center">
          <p className="text-xs text-[#9ca3af]">
            Already have an active twin?{' '}
            <Link to="/login" className="text-[#ffa116] hover:underline font-semibold">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
