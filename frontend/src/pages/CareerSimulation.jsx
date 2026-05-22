import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function CareerSimulation() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState('');
  const [showOptimistic, setShowOptimistic] = useState(false);

  const fetchSimulation = async (role = '') => {
    setLoading(true);
    try {
      const res = await api.get('/career/simulate', { params: role ? { role } : {} });
      setData(res.data);
    } catch {
      toast.error('Failed to load simulation');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSimulation(); }, []);

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    fetchSimulation(role);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!data) return null;

  const projection = showOptimistic ? data.optimisticProjection : data.projection;
  const maxSalary = Math.max(...projection.map(p => p.salary));

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <p className="font-mono text-xs t-dim uppercase tracking-widest mb-1">Feature 13</p>
        <h1 className="text-2xl font-semibold t-text">Career Simulation Engine</h1>
        <p className="text-sm t-dim mt-1">Predict your salary growth and career trajectory over the next 5 years</p>
      </motion.div>

      {/* Role Selector */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        className="t-surface border t-border rounded-lg p-4">
        <p className="text-xs t-dim font-mono uppercase tracking-wider mb-3">Simulate for role</p>
        <div className="flex flex-wrap gap-2">
          {data.allRoles.map(role => (
            <button key={role}
              onClick={() => handleRoleChange(role)}
              className={`text-xs px-3 py-1.5 rounded border transition-colors ${
                (selectedRole || data.role) === role
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 't-border t-dim hover:t-surface2'
              }`}>
              {role}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Current Status Cards */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Detected Role', value: data.role, sub: null },
          { label: 'Experience Level', value: data.expLevelLabel, sub: null },
          { label: 'Current Salary', value: `₹${data.currentSalary} LPA`, sub: 'estimated' },
          { label: 'Peak Potential', value: `₹${data.peakSalary} LPA`, sub: 'at senior level' },
        ].map((card, i) => (
          <div key={i} className="t-surface border t-border rounded-lg p-4">
            <p className="text-xs t-dim font-mono uppercase tracking-wider">{card.label}</p>
            <p className="text-lg font-semibold t-text mt-1">{card.value}</p>
            {card.sub && <p className="text-xs t-dim mt-0.5">{card.sub}</p>}
          </div>
        ))}
      </motion.div>

      {/* Salary Projection Chart */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        className="t-surface border t-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold t-text">5-Year Salary Projection</h2>
            <p className="text-xs t-dim mt-0.5">Based on your current skills and experience</p>
          </div>
          <button
            onClick={() => setShowOptimistic(!showOptimistic)}
            className={`text-xs px-3 py-1.5 rounded border transition-colors ${
              showOptimistic ? 'bg-green-600 border-green-600 text-white' : 't-border t-dim hover:t-surface2'
            }`}>
            {showOptimistic ? '✦ Optimistic' : 'Show Optimistic'}
          </button>
        </div>

        {/* Bar Chart */}
        <div className="flex items-end gap-3 h-48 mt-4">
          {projection.map((point, i) => {
            const height = Math.round((point.salary / maxSalary) * 100);
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <p className="text-xs font-semibold t-text">₹{point.salary}</p>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className={`w-full rounded-t-md ${
                    showOptimistic ? 'bg-green-500 bg-opacity-70' : 'bg-blue-500 bg-opacity-70'
                  } ${i === 0 ? 'opacity-60' : ''}`}
                  style={{ minHeight: '8px' }}
                />
                <p className="text-xs t-dim">{point.year}</p>
              </div>
            );
          })}
        </div>

        {/* Milestones */}
        {!showOptimistic && (
          <div className="mt-4 space-y-1">
            {data.projection.map((point, i) => (
              <div key={i} className="flex items-center gap-2 text-xs t-dim">
                <span className="font-mono w-14 flex-shrink-0">{point.year}</span>
                <span>→</span>
                <span>{point.milestone}</span>
              </div>
            ))}
          </div>
        )}

        {showOptimistic && (
          <p className="text-xs t-dim mt-3">
            ✦ Optimistic scenario: assumes you learn {data.missingPowerSkills.slice(0, 3).join(', ')} in the next 6 months
          </p>
        )}
      </motion.div>

      {/* Power Skills */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
        className="grid md:grid-cols-2 gap-4">
        <div className="t-surface border t-border rounded-lg p-5">
          <h2 className="font-semibold t-text mb-1">Power Skills Status</h2>
          <p className="text-xs t-dim mb-4">{data.powerSkillsHave} of {data.totalPowerSkills} high-value skills for {data.role}</p>
          <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${(data.powerSkillsHave / data.totalPowerSkills) * 100}%` }}
            />
          </div>
          {data.missingPowerSkills.length > 0 && (
            <>
              <p className="text-xs t-dim font-mono uppercase tracking-wider mb-2">Learn these to boost salary</p>
              <div className="flex flex-wrap gap-2">
                {data.missingPowerSkills.map(skill => (
                  <span key={skill} className="text-xs px-2 py-1 rounded border border-orange-500 border-opacity-50 text-orange-400">
                    + {skill}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Insights */}
        <div className="t-surface border t-border rounded-lg p-5">
          <h2 className="font-semibold t-text mb-4">Career Insights</h2>
          <div className="space-y-3">
            {data.insights.map((insight, i) => (
              <div key={i} className="flex gap-2 text-sm t-dim">
                <span className="text-blue-400 flex-shrink-0">→</span>
                <span>{insight}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Role Comparison */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        className="t-surface border t-border rounded-lg p-5">
        <h2 className="font-semibold t-text mb-1">Role Salary Comparison</h2>
        <p className="text-xs t-dim mb-4">Estimated salary at Year 3 across all career paths</p>
        <div className="space-y-3">
          {data.roleComparison.map((rc, i) => {
            const maxComp = data.roleComparison[0].salary3yr;
            const pct = Math.round((rc.salary3yr / maxComp) * 100);
            return (
              <div key={i} className="flex items-center gap-3">
                <p className={`text-xs w-44 flex-shrink-0 ${rc.current ? 'text-blue-400 font-semibold' : 't-dim'}`}>
                  {rc.current ? '▶ ' : ''}{rc.role}
                </p>
                <div className="flex-1 bg-gray-700 rounded-full h-1.5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ delay: i * 0.05, duration: 0.4 }}
                    className={`h-1.5 rounded-full ${rc.current ? 'bg-blue-500' : 'bg-gray-500'}`}
                  />
                </div>
                <p className="text-xs t-dim w-20 text-right">₹{rc.salary3yr} LPA</p>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
