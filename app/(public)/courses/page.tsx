'use client';
import Link from 'next/link';
import { Lock, Play } from 'lucide-react';

const COURSES = [
  { icon: '🛡️', title: 'Cybersecurity Fundamentals', level: 'Beginner', free: true, modules: 8, xp: 1000, desc: 'CIA Triad, threat landscape, networking basics, security mindset.' },
  { icon: '🌐', title: 'Web Application Security', level: 'Intermediate', free: true, modules: 12, xp: 2000, desc: 'OWASP Top 10, SQL injection, XSS, CSRF, authentication attacks.' },
  { icon: '🔐', title: 'Cryptography', level: 'Intermediate', free: true, modules: 10, xp: 2500, desc: 'From Caesar cipher to AES-256, PKI, and real-world crypto attacks.' },
  { icon: '⚔️', title: 'Ethical Hacking', level: 'Advanced', free: false, modules: 20, xp: 3500, desc: 'Full pentest methodology — recon, exploitation, post-exploitation.' },
  { icon: '📡', title: 'Network Security', level: 'Advanced', free: false, modules: 18, xp: 2800, desc: 'Wireshark, Nmap, packet analysis, wireless hacking, MITM attacks.' },
  { icon: '🔍', title: 'Digital Forensics', level: 'Advanced', free: false, modules: 15, xp: 3000, desc: 'Investigate cyber crimes, memory forensics, incident response.' },
  { icon: '🦠', title: 'Malware Analysis', level: 'Expert', free: false, modules: 14, xp: 3500, desc: 'Static and dynamic analysis, reverse engineering malicious code.' },
  { icon: '☁️', title: 'Cloud Security', level: 'Advanced', free: false, modules: 12, xp: 2500, desc: 'AWS/Azure security, IAM misconfigs, cloud penetration testing.' },
];

const levelColor: Record<string, string> = {
  Beginner: 'text-cyber-green border-cyber-green bg-cyber-green/10',
  Intermediate: 'text-yellow-400 border-yellow-400 bg-yellow-400/10',
  Advanced: 'text-orange-400 border-orange-400 bg-orange-400/10',
  Expert: 'text-cyber-red border-cyber-red bg-cyber-red/10',
};

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-cyber-dark cyber-grid">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            All <span className="text-cyber-green">Courses</span>
          </h1>
          <p className="text-gray-400 font-mono max-w-xl mx-auto">From absolute beginner to elite security professional — structured, hands-on learning.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {COURSES.map((c) => (
            <div key={c.title} className="cyber-card rounded-xl border border-cyber-border hover:border-cyber-green/40 transition-all overflow-hidden group">
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-4xl">{c.icon}</span>
                  <span className={`badge text-[10px] border ${c.free ? 'bg-cyber-green/10 text-cyber-green border-cyber-green/30' : 'bg-yellow-400/10 text-yellow-400 border-yellow-400/30'}`}>
                    {c.free ? 'FREE' : 'PRO'}
                  </span>
                </div>
                <h3 className="text-white font-bold mb-1 group-hover:text-cyber-green transition-colors">{c.title}</h3>
                <p className="text-gray-500 text-xs font-mono mb-3 leading-relaxed">{c.desc}</p>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`badge text-[10px] border ${levelColor[c.level]}`}>{c.level}</span>
                  <span className="text-gray-600 font-mono text-[10px]">{c.modules} modules</span>
                  <span className="text-cyber-green font-mono text-[10px]">+{c.xp} XP</span>
                </div>
                <Link href="/register" className={`w-full text-center text-xs font-mono py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${c.free ? 'btn-cyber-solid' : 'btn-cyber'}`}>
                  {c.free ? <><Play className="w-3 h-3" /> Start Free</> : <><Lock className="w-3 h-3" /> Unlock with Pro</>}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
