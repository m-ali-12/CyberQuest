'use client';

import { useEffect, useState } from 'react';
import { Brain, Loader2, Compass, ShieldCheck, Target, Lock } from 'lucide-react';

type RecordItem = {
  id: string;
  currentLevel: string;
  recommendedPath: string;
  confidenceScore: number;
  counselingSummary: string;
  nextMilestones: string[];
  createdAt: string;
};

const paths = [
  ['SOC_ANALYST', 'SOC Analyst'],
  ['BLUE_TEAM_DEFENDER', 'Blue Team Defender'],
  ['RED_TEAM_OPERATOR', 'Red Team Operator'],
  ['PENETRATION_TESTER', 'Penetration Tester'],
  ['BUG_BOUNTY_RESEARCHER', 'Bug Bounty Researcher'],
  ['INCIDENT_RESPONDER', 'Incident Responder'],
  ['DIGITAL_FORENSICS_ANALYST', 'Digital Forensics Analyst'],
  ['CLOUD_SECURITY_ENGINEER', 'Cloud Security Engineer'],
  ['DEVSECOPS_ENGINEER', 'DevSecOps Engineer'],
  ['GRC_ANALYST', 'GRC Analyst'],
  ['MALWARE_ANALYST', 'Malware Analyst'],
  ['AI_SECURITY_SPECIALIST', 'AI Security Specialist'],
];

function pretty(value: string) {
  return value.replaceAll('_', ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

export default function CareerCounselorPage() {
  const [currentLevel, setCurrentLevel] = useState('BEGINNER');
  const [preferredPath, setPreferredPath] = useState('');
  const [interests, setInterests] = useState('logs, investigation, networking');
  const [strengths, setStrengths] = useState('problem solving, patience');
  const [weakAreas, setWeakAreas] = useState('Linux, scripting, cloud');
  const [goals, setGoals] = useState('I want AI to judge whether SOC Analyst, Blue Team, or Red Team is best for me and give me a realistic roadmap.');
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function loadRecords() {
    const res = await fetch('/api/ai/career-counselor');
    const data = await res.json();
    if (res.ok) setRecords(data.records || []);
  }

  useEffect(() => { loadRecords(); }, []);

  async function runCounseling() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/ai/career-counselor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentLevel, preferredPath: preferredPath || undefined, interests, strengths, weakAreas, goals }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Career counseling failed');
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
        <p className="text-cyber-green font-mono text-sm uppercase tracking-wider mb-2">AI Career Judgment</p>
        <h1 className="text-3xl font-display font-bold text-white flex items-center gap-3"><Brain className="w-8 h-8 text-cyber-green" /> AI Cyber Career Counselor</h1>
        <p className="text-gray-400 mt-2 max-w-4xl">AI compares SOC Analyst, Blue Team, Red Team, penetration testing, incident response, cloud security, GRC and other paths. It uses only the logged-in user's private progress, answers and history.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="cyber-card border border-cyber-border rounded-xl p-5"><Compass className="w-6 h-6 text-cyber-blue mb-2" /><p className="text-white font-bold">Path Judgment</p><p className="text-gray-500 text-sm">Finds the best field based on level, interests and platform activity.</p></div>
        <div className="cyber-card border border-cyber-border rounded-xl p-5"><ShieldCheck className="w-6 h-6 text-cyber-green mb-2" /><p className="text-white font-bold">SOC / Blue / Red Readiness</p><p className="text-gray-500 text-sm">Shows readiness for defensive operations, monitoring, response and ethical red team tracks.</p></div>
        <div className="cyber-card border border-cyber-border rounded-xl p-5"><Target className="w-6 h-6 text-cyber-yellow mb-2" /><p className="text-white font-bold">30 & 90 Day Roadmap</p><p className="text-gray-500 text-sm">Creates practical milestones, portfolio projects and interview preparation.</p></div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="cyber-card border border-cyber-border rounded-xl p-5 space-y-4">
          <div>
            <label className="text-gray-400 text-xs font-mono">Current Level</label>
            <select value={currentLevel} onChange={(e) => setCurrentLevel(e.target.value)} className="w-full mt-1 bg-cyber-dark border border-cyber-border rounded-lg p-3 text-white">
              <option value="BEGINNER">Beginner</option><option value="INTERMEDIATE">Intermediate</option><option value="ADVANCED">Advanced</option><option value="EXPERT">Expert</option>
            </select>
          </div>
          <div>
            <label className="text-gray-400 text-xs font-mono">Preferred Path Optional</label>
            <select value={preferredPath} onChange={(e) => setPreferredPath(e.target.value)} className="w-full mt-1 bg-cyber-dark border border-cyber-border rounded-lg p-3 text-white">
              <option value="">AI should judge</option>
              {paths.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </div>
          <div><label className="text-gray-400 text-xs font-mono">Interests</label><textarea value={interests} onChange={(e) => setInterests(e.target.value)} rows={3} className="w-full mt-1 bg-cyber-dark border border-cyber-border rounded-lg p-3 text-white" /></div>
          <div><label className="text-gray-400 text-xs font-mono">Strengths</label><textarea value={strengths} onChange={(e) => setStrengths(e.target.value)} rows={3} className="w-full mt-1 bg-cyber-dark border border-cyber-border rounded-lg p-3 text-white" /></div>
          <div><label className="text-gray-400 text-xs font-mono">Weak Areas</label><textarea value={weakAreas} onChange={(e) => setWeakAreas(e.target.value)} rows={3} className="w-full mt-1 bg-cyber-dark border border-cyber-border rounded-lg p-3 text-white" /></div>
          <div><label className="text-gray-400 text-xs font-mono">Career Goal</label><textarea value={goals} onChange={(e) => setGoals(e.target.value)} rows={5} className="w-full mt-1 bg-cyber-dark border border-cyber-border rounded-lg p-3 text-white" /></div>
          {error && <p className="text-cyber-red text-sm">{error}</p>}
          <button onClick={runCounseling} disabled={loading} className="btn-cyber-solid w-full rounded-lg py-3 flex items-center justify-center gap-2">{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />} Judge My Best Field</button>
        </div>

        <div className="lg:col-span-2 space-y-4">
          {records.length === 0 && <div className="cyber-card border border-cyber-border rounded-xl p-10 text-center"><Lock className="w-10 h-10 text-gray-600 mx-auto mb-3" /><p className="text-white font-bold">No counseling records yet</p><p className="text-gray-500 text-sm mt-1">Your AI career judgment history stays private to your account.</p></div>}
          {records.map(record => (
            <div key={record.id} className="cyber-card border border-cyber-border rounded-xl p-5">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-white font-bold text-lg">Recommended: {pretty(record.recommendedPath)}</h2>
                  <p className="text-gray-500 text-xs font-mono">{record.currentLevel} • {new Date(record.createdAt).toLocaleString()}</p>
                </div>
                <div className="text-right"><p className="text-cyber-green font-display font-bold text-2xl">{record.confidenceScore}</p><p className="text-gray-500 text-xs font-mono">Confidence</p></div>
              </div>
              {record.nextMilestones?.length > 0 && <div className="mb-4 flex flex-wrap gap-2">{record.nextMilestones.slice(0, 5).map((m, i) => <span key={i} className="text-xs border border-cyber-border rounded-full px-3 py-1 text-gray-300">{m.slice(0, 80)}</span>)}</div>}
              <pre className="whitespace-pre-wrap text-gray-300 text-sm leading-6 font-sans bg-cyber-dark/60 border border-cyber-border rounded-lg p-4">{record.counselingSummary}</pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
