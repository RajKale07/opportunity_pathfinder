import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

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
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

export default function Register() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.register(form);
      toast.success('OTP sent to your email');
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.verifyOtp({ email: form.email, otp });
      toast.success('Account verified');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { backgroundColor: 'var(--surface2)', color: 'var(--text)', borderColor: 'var(--border2)' };

  return (
    <div className="min-h-screen t-bg flex items-center justify-center px-4 transition-colors"
      style={{ backgroundImage: 'linear-gradient(rgba(128,128,128,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(128,128,128,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="w-full max-w-sm">

        {/* Logo + toggle */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="t-text">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            <span className="font-mono text-sm t-text tracking-wider">PATHFINDER</span>
          </div>
          <button onClick={toggle} className="flex items-center justify-center w-7 h-7 rounded border t-border2 t-dim hover:t-text-sec transition-colors">
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2].map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-mono border transition-colors ${
                step > s ? 't-btn border-transparent' : step === s ? 't-btn border-transparent' : 'border t-border2 t-dim'
              }`} style={step >= s ? { backgroundColor: 'var(--btn-bg)', color: 'var(--text-inv)' } : {}}>
                {step > s ? <CheckIcon /> : s}
              </div>
              {i === 0 && <div className="flex-1 h-px transition-colors" style={{ backgroundColor: step > 1 ? 'var(--btn-bg)' : 'var(--border)' }} />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div key="step1" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
              <h1 className="text-2xl font-semibold t-text mb-1">Create account</h1>
              <p className="text-sm t-dim mb-6">Start your opportunity journey</p>
              <form onSubmit={handleRegister} className="space-y-4">
                {[['Full Name', 'text', 'name', 'John Doe'], ['Email', 'email', 'email', 'you@example.com'], ['Password', 'password', 'password', 'Min 6 characters']].map(([label, type, key, ph]) => (
                  <div key={key}>
                    <label className="block text-xs t-dim mb-1.5 font-mono uppercase tracking-wider">{label}</label>
                    <input type={type} className="w-full border rounded text-sm px-3 py-2.5 outline-none transition-colors" style={inputStyle}
                      placeholder={ph} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} required />
                  </div>
                ))}
                <button type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 text-sm font-medium py-2.5 rounded transition-colors disabled:opacity-40 mt-2 t-btn">
                  {loading ? <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> : 'Send OTP'}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div key="step2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
              <h1 className="text-2xl font-semibold t-text mb-1">Verify email</h1>
              <p className="text-sm t-dim mb-6">Code sent to <span className="t-text-sec">{form.email}</span></p>
              <form onSubmit={handleVerify} className="space-y-4">
                <div>
                  <label className="block text-xs t-dim mb-1.5 font-mono uppercase tracking-wider">OTP Code</label>
                  <input className="w-full border rounded text-sm px-3 py-2.5 outline-none transition-colors font-mono tracking-[0.5em] text-center"
                    style={inputStyle} placeholder="000000" maxLength={6} value={otp} onChange={e => setOtp(e.target.value)} required />
                  <p className="text-xs t-dim mt-1.5 font-mono">Valid for 10 minutes</p>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 text-sm font-medium py-2.5 rounded transition-colors disabled:opacity-40 t-btn">
                  {loading ? <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> : 'Verify'}
                </button>
                <button type="button" onClick={() => setStep(1)} className="w-full text-sm t-dim hover:t-text-sec transition-colors py-1">Back</button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-6 pt-6 border-t t-border">
          <p className="text-sm t-dim">Already have an account?{' '}
            <Link to="/login" className="t-text hover:t-text-sec transition-colors">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
