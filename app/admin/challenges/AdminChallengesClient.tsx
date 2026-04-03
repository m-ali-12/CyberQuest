'use client';
import { useState } from 'react';
import { Terminal, Lock, Unlock, Eye, EyeOff, Plus, Flag } from 'lucide-react';
import toast from 'react-hot-toast';

const catIcon: Record<string, string> = { WEB: '🌐', CRYPTO: '🔐', FORENSICS: '🔍', NETWORK: '📡', REVERSE: '⚙️', OSINT: '👁️', STEGANOGRAPHY: '🖼️' };
const diffColor: Record<string, string> = {
  BEGINNER: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  INTERMEDIATE: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  ADVANCED: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
  EXPERT: 'text-red-400 bg-red-400/10 border-red-400/20',
};

export default function AdminChallengesClient({ challenges: initial }: { challenges: any[] }) {
  const [challenges, setChallenges] = useState(initial);
  const [loading, setLoading] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newChallenge, setNewChallenge] = useState({ title: '', description: '', category: 'WEB', difficulty: 'BEGINNER', points: 100, flag: '', hint: '', isPremium: false });

  const togglePremium = async (id: string, isPremium: boolean) => {
    setLoading(id);
    try {
      const res = await fetch(`/api/admin/challenges/${id}/toggle-premium`, { method: 'POST' });
      if (res.ok) { setChallenges(p => p.map(c => c.id === id ? { ...c, isPremium: !isPremium } : c)); toast.success('Updated!'); }
    } catch { toast.error('Failed'); } finally { setLoading(null); }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    setLoading(id + 'active');
    try {
      const res = await fetch(`/api/admin/challenges/${id}/toggle-active`, { method: 'POST' });
      if (res.ok) { setChallenges(p => p.map(c => c.id === id ? { ...c, isActive: !isActive } : c)); toast.success('Updated!'); }
    } catch { toast.error('Failed'); } finally { setLoading(null); }
  };

  const handleAddChallenge = async () => {
    if (!newChallenge.title || !newChallenge.flag) return toast.error('Title and flag required');
    try {
      const res = await fetch('/api/admin/challenges', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newChallenge, hints: newChallenge.hint ? [newChallenge.hint] : [] }),
      });
      if (res.ok) {
        const data = await res.json();
        setChallenges(p => [data, ...p]);
        setShowAdd(false);
        setNewChallenge({ title: '', description: '', category: 'WEB', difficulty: 'BEGINNER', points: 100, flag: '', hint: '', isPremium: false });
        toast.success('Challenge created! 🎉');
      }
    } catch { toast.error('Failed'); }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Challenge <span className="text-emerald-400">Management</span></h1>
          <p className="text-gray-400 font-mono text-sm">{challenges.length} challenges · {challenges.filter(c => c.isPremium).length} premium</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-2.5 rounded-xl text-sm font-mono hover:border-emerald-400/50 transition-all">
          <Plus className="w-4 h-4" /> Add Challenge
        </button>
      </div>

      {/* Add Challenge Form */}
      {showAdd && (
        <div className="rounded-xl border border-emerald-500/20 bg-[#0f0f18] p-6">
          <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2"><Plus className="w-5 h-5 text-emerald-400" /> New Challenge</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { label: 'Title', key: 'title', type: 'text', placeholder: 'Challenge name' },
              { label: 'Flag (answer)', key: 'flag', type: 'text', placeholder: 'FLAG{answer}' },
              { label: 'Points', key: 'points', type: 'number', placeholder: '100' },
              { label: 'Hint (optional)', key: 'hint', type: 'text', placeholder: 'Hint text' },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key}>
                <label className="block text-xs font-mono text-gray-400 mb-1 uppercase">{label}</label>
                <input type={type} value={(newChallenge as any)[key]} placeholder={placeholder}
                  onChange={e => setNewChallenge(p => ({ ...p, [key]: type === 'number' ? parseInt(e.target.value) || 0 : e.target.value }))}
                  className="w-full bg-black/30 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-emerald-500/50" />
              </div>
            ))}
            <div>
              <label className="block text-xs font-mono text-gray-400 mb-1 uppercase">Category</label>
              <select value={newChallenge.category} onChange={e => setNewChallenge(p => ({ ...p, category: e.target.value }))}
                className="w-full bg-black/30 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-emerald-500/50">
                {['WEB','CRYPTO','FORENSICS','NETWORK','REVERSE','OSINT','STEGANOGRAPHY'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-400 mb-1 uppercase">Difficulty</label>
              <select value={newChallenge.difficulty} onChange={e => setNewChallenge(p => ({ ...p, difficulty: e.target.value }))}
                className="w-full bg-black/30 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-emerald-500/50">
                {['BEGINNER','INTERMEDIATE','ADVANCED','EXPERT'].map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-mono text-gray-400 mb-1 uppercase">Description</label>
              <textarea value={newChallenge.description} onChange={e => setNewChallenge(p => ({ ...p, description: e.target.value }))}
                placeholder="Challenge description..." rows={3}
                className="w-full bg-black/30 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-emerald-500/50 resize-none" />
            </div>
            <div className="md:col-span-2 flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={newChallenge.isPremium} onChange={e => setNewChallenge(p => ({ ...p, isPremium: e.target.checked }))} className="rounded" />
                <span className="text-gray-300 text-sm font-mono">Pro Only</span>
              </label>
              <button onClick={handleAddChallenge} className="ml-auto bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-6 py-2 rounded-lg text-sm font-mono hover:bg-emerald-500/30 transition-all">
                Create Challenge
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl border border-gray-800 overflow-hidden bg-[#0f0f18]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800 bg-black/30">
                {['Challenge', 'Category', 'Difficulty', 'Points', 'Attempts', 'Solved', 'Plan', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-mono text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {challenges.map(c => (
                <tr key={c.id} className={`border-b border-gray-800/40 hover:bg-white/2 transition-colors ${!c.isActive ? 'opacity-40' : ''}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{catIcon[c.category] || '💻'}</span>
                      <span className="text-white font-bold text-sm">{c.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-400 font-mono text-xs">{c.category}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-mono border ${diffColor[c.difficulty]}`}>{c.difficulty}</span>
                  </td>
                  <td className="px-4 py-3 text-yellow-400 font-mono text-sm font-bold">{c.points}</td>
                  <td className="px-4 py-3 text-gray-400 font-mono text-sm">{c._count.attempts}</td>
                  <td className="px-4 py-3 text-emerald-400 font-mono text-sm">{c.solvedCount}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => togglePremium(c.id, c.isPremium)}
                      className={`px-2 py-1 rounded text-xs font-mono border transition-all ${c.isPremium ? 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10' : 'text-gray-400 border-gray-600 bg-gray-500/10'}`}>
                      {c.isPremium ? '🔒 Pro' : '🆓 Free'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-mono ${c.isActive ? 'text-emerald-400' : 'text-red-400'}`}>
                      {c.isActive ? '● Active' : '● Hidden'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleActive(c.id, c.isActive)}
                      className="text-xs font-mono px-2 py-1 rounded border border-gray-600 text-gray-400 hover:border-gray-400 transition-all">
                      {c.isActive ? 'Hide' : 'Show'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
