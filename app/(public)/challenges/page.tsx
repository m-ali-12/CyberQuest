'use client';
import Link from 'next/link';
import { Terminal, Lock, ChevronRight, Flag } from 'lucide-react';

const SAMPLE_CHALLENGES = [
  { title: 'Caesar Says', category: 'CRYPTO', difficulty: 'BEGINNER', points: 50, solved: 1247, free: true },
  { title: 'Hidden in Plain Sight', category: 'STEGO', difficulty: 'BEGINNER', points: 75, solved: 893, free: true },
  { title: 'Login Bypass 101', category: 'WEB', difficulty: 'BEGINNER', points: 100, solved: 2103, free: true },
  { title: 'Base64 Detective', category: 'CRYPTO', difficulty: 'BEGINNER', points: 50, solved: 3421, free: true },
  { title: 'Network Sniff', category: 'NETWORK', difficulty: 'INTERMEDIATE', points: 150, solved: 542, free: false },
  { title: 'JWT Jailbreak', category: 'WEB', difficulty: 'INTERMEDIATE', points: 200, solved: 318, free: false },
  { title: 'OSINT: Find the Employee', category: 'OSINT', difficulty: 'INTERMEDIATE', points: 175, solved: 401, free: false },
  { title: 'Reverse the Binary', category: 'REVERSE', difficulty: 'ADVANCED', points: 300, solved: 189, free: false },
];

const diffColor: Record<string, string> = {
  BEGINNER: 'text-cyber-green border-cyber-green bg-cyber-green/10',
  INTERMEDIATE: 'text-yellow-400 border-yellow-400 bg-yellow-400/10',
  ADVANCED: 'text-orange-400 border-orange-400 bg-orange-400/10',
};
const catIcon: Record<string, string> = { CRYPTO: '🔐', WEB: '🌐', STEGO: '🖼️', NETWORK: '📡', OSINT: '👁️', REVERSE: '⚙️' };

export default function ChallengesPage() {
  return (
    <div className="min-h-screen bg-cyber-dark cyber-grid">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-cyber-green/10 border border-cyber-green/30 rounded-full px-4 py-2 mb-6">
            <Terminal className="w-4 h-4 text-cyber-green" />
            <span className="text-cyber-green font-mono text-sm">200+ CTF Challenges</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            <span className="text-cyber-green">CTF</span> Challenges
          </h1>
          <p className="text-gray-400 font-mono max-w-xl mx-auto">Solve real-world security challenges. Earn XP. Prove your skills.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[{ label: 'Total Challenges', value: '200+' }, { label: 'Categories', value: '8' }, { label: 'Hackers', value: '12,400+' }, { label: 'Max Points', value: '500' }].map(({ label, value }) => (
            <div key={label} className="cyber-card rounded-xl p-4 text-center border border-cyber-border">
              <p className="text-2xl font-display font-bold text-cyber-green">{value}</p>
              <p className="text-gray-500 font-mono text-xs mt-1">{label}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {SAMPLE_CHALLENGES.map((c) => (
            <div key={c.title} className={`cyber-card rounded-xl p-4 border transition-all ${c.free ? 'border-cyber-border hover:border-cyber-green/40' : 'border-cyber-border opacity-75'}`}>
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">{catIcon[c.category] || '💻'}</span>
                <div className="flex items-center gap-1">
                  {!c.free && <Lock className="w-3 h-3 text-gray-500" />}
                  <span className="text-cyber-yellow font-mono text-xs font-bold">{c.points}pts</span>
                </div>
              </div>
              <p className="text-white font-bold text-sm mb-2">{c.title}</p>
              <div className="flex items-center gap-2 mb-2">
                <span className={`badge text-[10px] border ${diffColor[c.difficulty]}`}>{c.difficulty}</span>
              </div>
              <p className="text-gray-600 font-mono text-xs">{c.solved.toLocaleString()} solved</p>
            </div>
          ))}
        </div>

        <div className="cyber-card rounded-2xl p-10 border border-cyber-green/20 text-center">
          <Flag className="w-12 h-12 text-cyber-green mx-auto mb-4" />
          <h2 className="text-2xl font-display font-bold text-white mb-2">196 More Challenges Await</h2>
          <p className="text-gray-400 font-mono mb-6 max-w-md mx-auto">Create a free account to access 20+ challenges instantly.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/register" className="btn-cyber-solid px-8 py-3 rounded-xl text-sm font-bold inline-flex items-center gap-2">
              Start Free <ChevronRight className="w-4 h-4" />
            </Link>
            <Link href="/login" className="btn-cyber px-8 py-3 rounded-xl text-sm inline-flex items-center gap-2">
              Already have account? Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
