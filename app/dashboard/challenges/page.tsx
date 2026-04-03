// app/dashboard/challenges/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { Terminal, Lock, CheckCircle, Flag, HelpCircle, Send, Filter } from 'lucide-react';
import { categoryIcon, difficultyColor, difficultyBg } from '@/lib/utils';
import toast from 'react-hot-toast';

const CATEGORIES = ['ALL', 'WEB', 'CRYPTO', 'FORENSICS', 'NETWORK', 'REVERSE', 'OSINT', 'STEGANOGRAPHY'];
const DIFFICULTIES = ['ALL', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED'];

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState('ALL');
  const [diff, setDiff] = useState('ALL');
  const [selected, setSelected] = useState<any>(null);
  const [flag, setFlag] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hintIdx, setHintIdx] = useState(0);

  useEffect(() => {
    fetch('/api/challenges').then(r => r.json()).then(d => { setChallenges(d); setLoading(false); });
  }, []);

  const filtered = challenges.filter(c =>
    (cat === 'ALL' || c.category === cat) &&
    (diff === 'ALL' || c.difficulty === diff)
  );

  const handleSubmit = async () => {
    if (!flag.trim() || !selected) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/challenges/${selected.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flag }),
      });
      const data = await res.json();
      if (data.correct) {
        toast.success(`🎉 Correct! +${selected.points} XP`);
        setChallenges(prev => prev.map(c => c.id === selected.id ? { ...c, solved: true } : c));
        setSelected({ ...selected, solved: true });
        setFlag('');
      } else {
        toast.error('❌ Wrong flag. Keep trying!');
      }
    } catch { toast.error('Error submitting'); }
    finally { setSubmitting(false); }
  };

  const solvedCount = challenges.filter(c => c.solved).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">
            <span className="text-cyber-green">CTF</span> Challenges
          </h1>
          <p className="text-gray-400 font-mono text-sm">Solve challenges, earn XP, prove your skills</p>
        </div>
        <div className="cyber-card rounded-xl px-4 py-3 border border-cyber-green/30">
          <p className="text-xs font-mono text-gray-400 mb-1">Solved</p>
          <p className="text-2xl font-display font-bold text-cyber-green">{solvedCount}/{challenges.length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className={`badge py-1.5 px-3 text-xs cursor-pointer transition-all ${cat === c ? 'bg-cyber-green/10 text-cyber-green border-cyber-green/50' : 'bg-cyber-card border-cyber-border text-gray-400 hover:border-gray-500'}`}>
              {c === 'ALL' ? '🌐 All' : `${categoryIcon(c)} ${c}`}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {DIFFICULTIES.map(d => (
            <button key={d} onClick={() => setDiff(d)}
              className={`badge py-1.5 px-3 text-xs cursor-pointer transition-all ${diff === d ? 'bg-cyber-blue/10 text-cyber-blue border-cyber-blue/50' : 'bg-cyber-card border-cyber-border text-gray-400 hover:border-gray-500'}`}>
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Challenge List */}
        <div className="lg:col-span-1 space-y-3">
          {loading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="cyber-card rounded-xl p-4 h-24 skeleton" />
            ))
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-500 font-mono">No challenges found</div>
          ) : (
            filtered.map((c: any) => (
              <button
                key={c.id}
                onClick={() => { setSelected(c); setFlag(''); setShowHint(false); setHintIdx(0); }}
                className={`w-full text-left cyber-card rounded-xl p-4 border transition-all ${
                  selected?.id === c.id ? 'border-cyber-green/50 bg-cyber-green/5' :
                  c.solved ? 'border-cyber-green/20 opacity-70' :
                  c.isPremium && !c.unlocked ? 'border-cyber-border opacity-60' :
                  'border-cyber-border hover:border-cyber-blue/30'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-lg">{categoryIcon(c.category)}</span>
                  <div className="flex items-center gap-1.5">
                    {c.solved && <CheckCircle className="w-4 h-4 text-cyber-green" />}
                    {c.isPremium && !c.unlocked && <Lock className="w-3 h-3 text-gray-500" />}
                    <span className="text-cyber-yellow font-mono text-xs font-bold">{c.points}pts</span>
                  </div>
                </div>
                <p className="text-white text-sm font-bold mb-1">{c.title}</p>
                <div className="flex items-center gap-2">
                  <span className={`badge text-[10px] ${difficultyColor(c.difficulty)} ${difficultyBg(c.difficulty)}`}>{c.difficulty}</span>
                  <span className="text-gray-500 font-mono text-[10px]">{c.category}</span>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Challenge Detail */}
        <div className="lg:col-span-2">
          {!selected ? (
            <div className="cyber-card rounded-xl border border-cyber-border h-full flex items-center justify-center p-12">
              <div className="text-center">
                <Terminal className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                <p className="text-gray-500 font-mono">Select a challenge to begin</p>
              </div>
            </div>
          ) : (
            <div className="cyber-card rounded-xl border border-cyber-border overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-cyber-border bg-black/20">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{categoryIcon(selected.category)}</span>
                    <div>
                      <h2 className="text-xl font-display font-bold text-white">{selected.title}</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`badge text-xs ${difficultyColor(selected.difficulty)} ${difficultyBg(selected.difficulty)}`}>
                          {selected.difficulty}
                        </span>
                        <span className="text-gray-500 font-mono text-xs">{selected.category}</span>
                        <span className="text-cyber-yellow font-mono text-xs font-bold">⚡ {selected.points} XP</span>
                      </div>
                    </div>
                  </div>
                  {selected.solved && (
                    <div className="flex items-center gap-2 bg-cyber-green/10 border border-cyber-green/30 rounded-lg px-3 py-1.5">
                      <CheckCircle className="w-4 h-4 text-cyber-green" />
                      <span className="text-cyber-green font-mono text-sm font-bold">SOLVED</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Body */}
              <div className="p-6 space-y-6">
                {/* Locked */}
                {selected.isPremium && !selected.unlocked ? (
                  <div className="text-center py-8">
                    <Lock className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400 font-mono mb-4">This is a Pro challenge</p>
                    <a href="/dashboard/upgrade" className="btn-cyber-solid px-6 py-2.5 rounded-lg text-sm">Upgrade to Pro</a>
                  </div>
                ) : (
                  <>
                    <div>
                      <p className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">Description</p>
                      <p className="text-gray-200 leading-relaxed">{selected.description}</p>
                    </div>

                    {/* Hints */}
                    {selected.hints?.length > 0 && (
                      <div>
                        <button
                          onClick={() => setShowHint(!showHint)}
                          className="flex items-center gap-2 text-cyber-yellow font-mono text-sm hover:text-yellow-300 transition-colors"
                        >
                          <HelpCircle className="w-4 h-4" />
                          {showHint ? 'Hide Hint' : `Show Hint (${selected.hints.length} available)`}
                        </button>
                        {showHint && (
                          <div className="mt-3 bg-cyber-yellow/5 border border-cyber-yellow/20 rounded-xl p-4">
                            <p className="text-cyber-yellow font-mono text-sm font-bold mb-1">Hint {hintIdx + 1}/{selected.hints.length}:</p>
                            <p className="text-gray-300 text-sm">{selected.hints[hintIdx]}</p>
                            {hintIdx < selected.hints.length - 1 && (
                              <button onClick={() => setHintIdx(hintIdx + 1)} className="mt-2 text-xs text-gray-500 hover:text-white font-mono transition-colors">
                                Next hint →
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Flag submission */}
                    {!selected.solved && (
                      <div>
                        <p className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-3">Submit Flag</p>
                        <div className="flex gap-3">
                          <div className="flex-1 relative">
                            <Flag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                              type="text"
                              value={flag}
                              onChange={e => setFlag(e.target.value)}
                              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                              placeholder="FLAG{your_answer_here}"
                              className="w-full bg-black/30 border border-cyber-border rounded-lg pl-10 pr-4 py-3 text-cyber-green placeholder-gray-600 font-mono text-sm focus:outline-none focus:border-cyber-green/50 transition-colors"
                            />
                          </div>
                          <button
                            onClick={handleSubmit}
                            disabled={submitting || !flag.trim()}
                            className="btn-cyber-solid px-5 py-3 rounded-lg flex items-center gap-2 text-sm disabled:opacity-50"
                          >
                            {submitting ? <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
                            Submit
                          </button>
                        </div>
                        <p className="text-gray-600 font-mono text-xs mt-2">Format: FLAG{'{...}'} or CYBERQUEST{'{...}'}</p>
                      </div>
                    )}

                    {selected.solved && (
                      <div className="bg-cyber-green/10 border border-cyber-green/30 rounded-xl p-5 text-center">
                        <p className="text-4xl mb-2">🎉</p>
                        <p className="text-cyber-green font-display font-bold text-lg">Challenge Solved!</p>
                        <p className="text-gray-400 font-mono text-sm mt-1">+{selected.points} XP earned</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
