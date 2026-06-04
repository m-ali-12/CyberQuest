'use client';

import { useEffect, useState } from 'react';
import { Bot, Loader2, MessageSquare, Sparkles } from 'lucide-react';

type InterviewRecord = { id: string; targetRole: string; level: string; question: string; answer: string; feedback: string; score: number; createdAt: string };

export default function MockInterviewPage() {
  const [targetRole, setTargetRole] = useState('SOC Analyst');
  const [level, setLevel] = useState('BEGINNER');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [records, setRecords] = useState<InterviewRecord[]>([]);
  const [loadingQuestion, setLoadingQuestion] = useState(false);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [error, setError] = useState('');

  async function loadRecords() {
    const res = await fetch('/api/ai/mock-interview');
    const data = await res.json();
    if (res.ok) setRecords(data.records || []);
  }

  useEffect(() => { loadRecords(); }, []);

  async function generateQuestion() {
    setLoadingQuestion(true);
    setError('');
    try {
      const res = await fetch('/api/ai/mock-interview', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetRole, level, mode: 'question' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Question generation failed');
      setQuestion(data.question);
      setAnswer('');
    } catch (err: any) { setError(err.message); }
    finally { setLoadingQuestion(false); }
  }

  async function submitAnswer() {
    if (!question || !answer) return;
    setLoadingFeedback(true);
    setError('');
    try {
      const res = await fetch('/api/ai/mock-interview', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetRole, level, mode: 'feedback', lastQuestion: question, answer }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Feedback failed');
      setRecords([data.record, ...records]);
      setQuestion('');
      setAnswer('');
    } catch (err: any) { setError(err.message); }
    finally { setLoadingFeedback(false); }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-cyber-blue font-mono text-sm uppercase tracking-wider mb-2">Role Based Practice</p>
        <h1 className="text-3xl font-display font-bold text-white flex items-center gap-3"><Bot className="w-8 h-8 text-cyber-blue" /> AI Mock Interview</h1>
        <p className="text-gray-400 mt-2 max-w-3xl">Fresh AI-generated cybersecurity interview questions, answer scoring, and private feedback records for each user.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="cyber-card border border-cyber-border rounded-xl p-5 space-y-4">
          <div>
            <label className="text-gray-400 text-xs font-mono">Target Role</label>
            <select value={targetRole} onChange={(e) => setTargetRole(e.target.value)} className="w-full mt-1 bg-cyber-dark border border-cyber-border rounded-lg p-3 text-white">
              <option>SOC Analyst</option><option>Penetration Tester</option><option>Bug Bounty Hunter</option><option>Cloud Security Engineer</option><option>Incident Responder</option><option>Cybersecurity GRC Analyst</option>
            </select>
          </div>
          <div>
            <label className="text-gray-400 text-xs font-mono">Level</label>
            <select value={level} onChange={(e) => setLevel(e.target.value)} className="w-full mt-1 bg-cyber-dark border border-cyber-border rounded-lg p-3 text-white">
              <option value="BEGINNER">Beginner</option><option value="INTERMEDIATE">Intermediate</option><option value="ADVANCED">Advanced</option><option value="EXPERT">Expert</option>
            </select>
          </div>
          <button onClick={generateQuestion} disabled={loadingQuestion} className="btn-cyber-solid w-full rounded-lg py-3 flex items-center justify-center gap-2">
            {loadingQuestion ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />} New Fresh Question
          </button>
          {error && <p className="text-cyber-red text-sm">{error}</p>}
        </div>

        <div className="lg:col-span-2 cyber-card border border-cyber-border rounded-xl p-5 space-y-4">
          <h2 className="text-white font-bold flex items-center gap-2"><MessageSquare className="w-5 h-5 text-cyber-green" /> Current Interview</h2>
          {question ? <pre className="whitespace-pre-wrap text-gray-300 text-sm leading-6 font-sans bg-cyber-dark/60 border border-cyber-border rounded-lg p-4">{question}</pre> : <p className="text-gray-500">Generate a new question to start.</p>}
          <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} rows={7} placeholder="Type your interview answer here..." className="w-full bg-cyber-dark border border-cyber-border rounded-lg p-3 text-white" />
          <button onClick={submitAnswer} disabled={!question || !answer || loadingFeedback} className="btn-cyber rounded-lg px-5 py-3 flex items-center gap-2">
            {loadingFeedback && <Loader2 className="w-4 h-4 animate-spin" />} Submit Answer for AI Feedback
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-white font-bold text-lg">My Private Interview Record</h2>
        {records.map((r) => (
          <div key={r.id} className="cyber-card border border-cyber-border rounded-xl p-5">
            <div className="flex justify-between gap-4 mb-3">
              <p className="text-white font-bold">{r.targetRole} • {r.level}</p>
              <p className="text-cyber-green font-bold">Score {r.score}/100</p>
            </div>
            <p className="text-gray-500 text-xs font-mono mb-3">{new Date(r.createdAt).toLocaleString()}</p>
            <pre className="whitespace-pre-wrap text-gray-300 text-sm leading-6 font-sans">Question: {r.question}\n\nYour answer: {r.answer}\n\nAI feedback:\n{r.feedback}</pre>
          </div>
        ))}
      </div>
    </div>
  );
}
