'use client';

import { useEffect, useState } from 'react';
import { ShieldAlert, Sparkles, Loader2, Lock } from 'lucide-react';

type RecordItem = {
  id: string;
  title: string;
  targetRole: string;
  level: string;
  scenario: string;
  riskScore: number;
  result: string;
  createdAt: string;
};

export default function AiRiskPage() {
  const [title, setTitle] = useState('Cloud security learning risk check');
  const [targetRole, setTargetRole] = useState('SOC Analyst');
  const [level, setLevel] = useState('BEGINNER');
  const [scenario, setScenario] = useState('I am learning cybersecurity and want to know which skills, labs and risks I should focus on next.');
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function loadRecords() {
    const res = await fetch('/api/ai/risk-assessment');
    const data = await res.json();
    if (res.ok) setRecords(data.records || []);
  }

  useEffect(() => { loadRecords(); }, []);

  async function runAssessment() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/ai/risk-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, targetRole, level, scenario }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'AI risk assessment failed');
      setRecords([data.record, ...records]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-cyber-green font-mono text-sm uppercase tracking-wider mb-2">Private AI Coach</p>
        <h1 className="text-3xl font-display font-bold text-white flex items-center gap-3">
          <ShieldAlert className="w-8 h-8 text-cyber-green" /> AI Risk Assessment
        </h1>
        <p className="text-gray-400 mt-2 max-w-3xl">Generate updated, user-specific cybersecurity risk guidance, skill gaps, labs, and role-based learning plans. Each user only sees their own records.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 cyber-card border border-cyber-border rounded-xl p-5 space-y-4">
          <div>
            <label className="text-gray-400 text-xs font-mono">Assessment Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full mt-1 bg-cyber-dark border border-cyber-border rounded-lg p-3 text-white" />
          </div>
          <div>
            <label className="text-gray-400 text-xs font-mono">Target Role</label>
            <select value={targetRole} onChange={(e) => setTargetRole(e.target.value)} className="w-full mt-1 bg-cyber-dark border border-cyber-border rounded-lg p-3 text-white">
              <option>SOC Analyst</option>
              <option>Penetration Tester</option>
              <option>Bug Bounty Hunter</option>
              <option>Cloud Security Engineer</option>
              <option>Incident Responder</option>
              <option>Cybersecurity GRC Analyst</option>
            </select>
          </div>
          <div>
            <label className="text-gray-400 text-xs font-mono">Level</label>
            <select value={level} onChange={(e) => setLevel(e.target.value)} className="w-full mt-1 bg-cyber-dark border border-cyber-border rounded-lg p-3 text-white">
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
              <option value="EXPERT">Expert</option>
            </select>
          </div>
          <div>
            <label className="text-gray-400 text-xs font-mono">Your Scenario</label>
            <textarea value={scenario} onChange={(e) => setScenario(e.target.value)} rows={7} className="w-full mt-1 bg-cyber-dark border border-cyber-border rounded-lg p-3 text-white" />
          </div>
          {error && <p className="text-cyber-red text-sm">{error}</p>}
          <button onClick={runAssessment} disabled={loading} className="btn-cyber-solid w-full rounded-lg py-3 flex items-center justify-center gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />} Generate Fresh Risk Plan
          </button>
        </div>

        <div className="lg:col-span-2 space-y-4">
          {records.length === 0 && (
            <div className="cyber-card border border-cyber-border rounded-xl p-8 text-center">
              <Lock className="w-10 h-10 text-gray-600 mx-auto mb-3" />
              <p className="text-white font-bold">No AI risk records yet</p>
              <p className="text-gray-500 text-sm mt-1">Run your first assessment. Your history stays private to your account.</p>
            </div>
          )}
          {records.map((record) => (
            <div key={record.id} className="cyber-card border border-cyber-border rounded-xl p-5">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-white font-bold text-lg">{record.title}</h2>
                  <p className="text-gray-500 text-xs font-mono">{record.targetRole} • {record.level} • {new Date(record.createdAt).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-cyber-green font-display font-bold text-2xl">{record.riskScore}</p>
                  <p className="text-gray-500 text-xs font-mono">Risk Score</p>
                </div>
              </div>
              <pre className="whitespace-pre-wrap text-gray-300 text-sm leading-6 font-sans bg-cyber-dark/60 border border-cyber-border rounded-lg p-4">{record.result}</pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
