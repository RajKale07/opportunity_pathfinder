import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { profileService } from '../services/api';
import toast from 'react-hot-toast';

const GENDERS = ['Male', 'Female', 'Other', 'Prefer not to say'];
const CATEGORIES = ['General', 'OBC', 'SC', 'ST', 'EWS'];
const EMPLOYMENT = ['Student', 'Fresher', 'Employed', 'Self-employed', 'Unemployed'];
const STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
  'Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh',
];

const inputCls = 'w-full border rounded text-sm px-3 py-2 outline-none transition-colors';
const inputStyle = { backgroundColor: 'var(--surface2)', color: 'var(--text)', borderColor: 'var(--border2)' };

const INCOME_OPTIONS = [
  'Below ₹1,00,000', '₹1,00,000 - ₹2,50,000', '₹2,50,000 - ₹5,00,000',
  '₹5,00,000 - ₹8,00,000', '₹8,00,000 - ₹12,00,000', 'Above ₹12,00,000',
];

const currentYear = new Date().getFullYear();
const GRAD_YEARS = Array.from({ length: 20 }, (_, i) => String(currentYear - i + 4));

const Field = ({ label, children, span2 = false }) => (
  <div className={span2 ? 'sm:col-span-2' : ''}>
    <label className="block text-xs t-dim mb-1 font-mono uppercase tracking-wider">{label}</label>
    {children}
  </div>
);

const Input = ({ value, onChange, placeholder, type = 'text' }) => (
  <input type={type} className={inputCls} style={inputStyle}
    placeholder={placeholder} value={value || ''} onChange={e => onChange(e.target.value)} />
);

const Select = ({ value, onChange, options, placeholder }) => (
  <select className={inputCls} style={inputStyle} value={value || ''} onChange={e => onChange(e.target.value)}>
    <option value="">{placeholder}</option>
    {options.map(o => <option key={o} value={o}>{o}</option>)}
  </select>
);

// Native date picker styled to match the app theme
const DatePicker = ({ value, onChange }) => {
  // Convert DD/MM/YYYY → YYYY-MM-DD for input[type=date]
  const toInputVal = (v) => {
    if (!v) return '';
    if (v.includes('-')) return v; // already ISO
    const [d, m, y] = v.split('/');
    return y && m && d ? `${y}-${m.padStart(2,'0')}-${d.padStart(2,'0')}` : '';
  };
  // Convert YYYY-MM-DD → DD/MM/YYYY for storage
  const fromInputVal = (v) => {
    if (!v) return '';
    const [y, m, d] = v.split('-');
    return `${d}/${m}/${y}`;
  };
  return (
    <input
      type="date"
      className={inputCls}
      style={{ ...inputStyle, colorScheme: 'dark' }}
      value={toInputVal(value)}
      max={new Date().toISOString().split('T')[0]}
      onChange={e => onChange(fromInputVal(e.target.value))}
    />
  );
};

const Section = ({ title, tag, children }) => (
  <div className="t-surface border t-border rounded-lg overflow-hidden">
    <div className="px-5 py-3 border-b t-border flex items-center justify-between">
      <p className="text-sm font-medium t-text">{title}</p>
      <span className="font-mono text-xs t-dim border t-border px-2 py-0.5 rounded">{tag}</span>
    </div>
    <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
  </div>
);

const CompletenessRing = ({ pct }) => {
  const r = 26, circ = 2 * Math.PI * r;
  return (
    <svg width="68" height="68" viewBox="0 0 68 68">
      <circle cx="34" cy="34" r={r} fill="none" stroke="var(--border)" strokeWidth="5" />
      <circle cx="34" cy="34" r={r} fill="none" stroke="var(--text)" strokeWidth="5"
        strokeDasharray={`${(pct / 100) * circ} ${circ}`} strokeLinecap="round"
        transform="rotate(-90 34 34)" style={{ transition: 'stroke-dasharray 0.6s ease' }} />
      <text x="34" y="38" textAnchor="middle" fontSize="12" fontWeight="600"
        fill="var(--text)" fontFamily="Inter, sans-serif">{pct}%</text>
    </svg>
  );
};

const EMPTY = {
  fullName: '', phone: '', dob: '', gender: '', city: '', state: '',
  category: '', annualIncome: '', employmentStatus: '',
  tenthPercentage: '', twelfthPercentage: '', graduationCgpa: '',
  graduationDegree: '', graduationBranch: '', graduationYear: '',
  experience: '', githubUrl: '', linkedinUrl: '',
};

export default function ProfilePage() {
  const [form, setForm] = useState(EMPTY);
  const [completeness, setCompleteness] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [autoFilled, setAutoFilled] = useState(false);
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [addingSkill, setAddingSkill] = useState(false);
  const skillInputRef = useRef(null);

  useEffect(() => {
    Promise.all([profileService.get(), profileService.getSkills()])
      .then(([profileRes, skillsRes]) => {
        const { completeness: c, id, ...data } = profileRes.data;
        setForm({ ...EMPTY, ...data });
        setCompleteness(c);
        const { fullName, ...rest } = data;
        setAutoFilled(Object.values(rest).some(v => v && v.trim()));
        setSkills(skillsRes.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleAddSkill = async () => {
    const name = skillInput.trim();
    if (!name) return;
    setAddingSkill(true);
    try {
      const res = await profileService.addSkill(name);
      setSkills(prev => [...prev, res.data]);
      setSkillInput('');
      skillInputRef.current?.focus();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to add skill');
    } finally {
      setAddingSkill(false);
    }
  };

  const handleDeleteSkill = async (id) => {
    try {
      await profileService.deleteSkill(id);
      setSkills(prev => prev.filter(s => s.id !== id));
    } catch {
      toast.error('Failed to remove skill');
    }
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(); }
    if (e.key === ',' ) { e.preventDefault(); handleAddSkill(); }
  };

  const set = (key) => (val) => {
    setForm(prev => {
      const next = { ...prev, [key]: val };
      // Recalculate completeness locally
      const vals = Object.values(next);
      const filled = vals.filter(v => v && v.trim()).length;
      setCompleteness(Math.min(100, Math.round((filled / 18) * 100)));
      return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await profileService.update(form);
      setCompleteness(res.data.completeness);
      toast.success('Profile saved');
    } catch {
      toast.error('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <svg className="animate-spin t-dim" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
      </svg>
    </div>
  );

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <p className="font-mono text-xs t-dim uppercase tracking-widest mb-1">Profile</p>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold t-text">Smart Profile</h1>
            <p className="text-sm t-dim mt-0.5">Your profile powers all recommendations — keep it complete</p>
          </div>
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded transition-colors t-btn disabled:opacity-40 flex-shrink-0">
            {saving
              ? <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
              : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            }
            Save Profile
          </button>
        </div>
      </motion.div>

      {/* Completeness bar */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="t-surface border t-border rounded-lg p-5 mb-4 flex items-center gap-5">
        <CompletenessRing pct={completeness} />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-medium t-text">Profile Completeness</p>
            {autoFilled && (
              <span className="font-mono text-xs border t-border px-2 py-0.5 rounded t-dim">
                ✦ auto-filled from documents
              </span>
            )}
          </div>
          <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: 'var(--border)' }}>
            <div className="h-1.5 rounded-full transition-all duration-700"
              style={{ width: `${completeness}%`, backgroundColor: 'var(--text)' }} />
          </div>
          <p className="text-xs t-dim mt-1.5">
            {completeness < 40 ? 'Fill in your details to unlock personalized recommendations'
              : completeness < 75 ? 'Good progress — a few more fields to go'
              : completeness < 100 ? 'Almost complete — great job!'
              : 'Profile complete — you\'re all set!'}
          </p>
        </div>
      </motion.div>

      <div className="space-y-4">
        {/* Personal Info */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
          <Section title="Personal Information" tag="personal">
            <Field label="Full Name">
              <Input value={form.fullName} onChange={set('fullName')} placeholder="As on official documents" />
            </Field>
            <Field label="Phone Number">
              <Input value={form.phone} onChange={set('phone')} placeholder="10-digit mobile number" />
            </Field>
            <Field label="Date of Birth">
              <DatePicker value={form.dob} onChange={set('dob')} />
            </Field>
            <Field label="Gender">
              <Select value={form.gender} onChange={set('gender')} options={GENDERS} placeholder="Select gender" />
            </Field>
            <Field label="City">
              <Input value={form.city} onChange={set('city')} placeholder="e.g. Mumbai" />
            </Field>
            <Field label="State">
              <Select value={form.state} onChange={set('state')} options={STATES} placeholder="Select state" />
            </Field>
            <Field label="Category">
              <Select value={form.category} onChange={set('category')} options={CATEGORIES} placeholder="Select category" />
            </Field>
            <Field label="Annual Family Income">
              <Select value={form.annualIncome} onChange={set('annualIncome')} options={INCOME_OPTIONS} placeholder="Select income range" />
            </Field>
            <Field label="Employment Status" span2>
              <Select value={form.employmentStatus} onChange={set('employmentStatus')} options={EMPLOYMENT} placeholder="Select status" />
            </Field>
          </Section>
        </motion.div>

        {/* Education */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.11 }}>
          <Section title="Education" tag="academic">
            <Field label="10th Percentage / CGPA">
              <Input value={form.tenthPercentage} onChange={set('tenthPercentage')} placeholder="e.g. 85.4%" />
            </Field>
            <Field label="12th Percentage / CGPA">
              <Input value={form.twelfthPercentage} onChange={set('twelfthPercentage')} placeholder="e.g. 88.2%" />
            </Field>
            <Field label="Graduation Degree">
              <Input value={form.graduationDegree} onChange={set('graduationDegree')} placeholder="e.g. B.Tech, BCA, B.Sc" />
            </Field>
            <Field label="Branch / Specialization">
              <Input value={form.graduationBranch} onChange={set('graduationBranch')} placeholder="e.g. Computer Science" />
            </Field>
            <Field label="Graduation CGPA / Percentage">
              <Input value={form.graduationCgpa} onChange={set('graduationCgpa')} placeholder="e.g. 8.2 CGPA or 78%" />
            </Field>
            <Field label="Year of Passing">
              <Select value={form.graduationYear} onChange={set('graduationYear')} options={GRAD_YEARS} placeholder="Select year" />
            </Field>
          </Section>
        </motion.div>

        {/* Skills */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}>
          <div className="t-surface border t-border rounded-lg overflow-hidden">
            <div className="px-5 py-3 border-b t-border flex items-center justify-between">
              <p className="text-sm font-medium t-text">Skills</p>
              <span className="font-mono text-xs t-dim border t-border px-2 py-0.5 rounded">{skills.length} added</span>
            </div>
            <div className="p-5">
              {/* Input row */}
              <div className="flex gap-2 mb-4">
                <input
                  ref={skillInputRef}
                  className={inputCls + ' flex-1'}
                  style={inputStyle}
                  placeholder="Type a skill and press Enter or comma (e.g. React, Python, AWS)"
                  value={skillInput}
                  onChange={e => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                  disabled={addingSkill}
                />
                <button
                  onClick={handleAddSkill}
                  disabled={addingSkill || !skillInput.trim()}
                  className="px-4 py-2 text-sm rounded t-btn disabled:opacity-40 flex-shrink-0 transition-colors"
                >
                  Add
                </button>
              </div>
              {/* Skill tags */}
              {skills.length === 0 ? (
                <p className="text-xs t-dim">No skills added yet. Type above or upload documents to auto-extract skills.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {skills.map(skill => (
                    <span key={skill.id}
                      className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border ${
                        skill.source === 'MANUAL'
                          ? 'border-blue-500 border-opacity-50 text-blue-400'
                          : 'border-green-500 border-opacity-50 text-green-400'
                      }`}>
                      {skill.name}
                      <span className="text-xs opacity-50">{skill.source === 'MANUAL' ? '' : '·ocr'}</span>
                      <button
                        onClick={() => handleDeleteSkill(skill.id)}
                        className="opacity-50 hover:opacity-100 transition-opacity ml-0.5"
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <p className="text-xs t-dim mt-3">Blue = manually added · Green = auto-extracted from documents</p>
            </div>
          </div>
        </motion.div>

        {/* Career */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.17 }}>
          <Section title="Career" tag="career">
            <Field label="Work Experience" span2>
              <Input value={form.experience} onChange={set('experience')} placeholder="e.g. Fresher / 2 years as Software Engineer at TCS" />
            </Field>
          </Section>
        </motion.div>

        {/* Social Links */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.17 }}>
          <Section title="Social Links" tag="links">
            <Field label="GitHub URL">
              <Input value={form.githubUrl} onChange={set('githubUrl')} placeholder="https://github.com/username" />
            </Field>
            <Field label="LinkedIn URL">
              <Input value={form.linkedinUrl} onChange={set('linkedinUrl')} placeholder="https://linkedin.com/in/username" />
            </Field>
          </Section>
        </motion.div>
      </div>

      {/* Bottom save */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        className="mt-4 flex justify-end">
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded transition-colors t-btn disabled:opacity-40">
          {saving
            ? <><svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Saving...</>
            : 'Save Profile'
          }
        </button>
      </motion.div>
    </div>
  );
}
