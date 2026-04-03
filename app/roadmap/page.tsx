'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, ChevronRight, Lock, Map } from 'lucide-react';

const PHASES = [
  { phase: '01', title: 'Security Fundamentals', color: '#00ff88', free: true, skills: ['CIA Triad', 'OSI Model', 'TCP/IP', 'Linux CLI', 'Threat Types'] },
  { phase: '02', title: 'Web Application Security', color: '#00d4ff', free: true, skills: ['SQL Injection', 'XSS', 'CSRF', 'IDOR', 'OWASP Top 10'] },
  { phase: '03', title: 'Cryptography', color: '#f59e0b', free: true, skills: ['Symmetric/Asymmetric', 'RSA', 'AES', 'Hashing', 'PKI'] },
  { phase: '04', title: 'Network Hacking', color: '#ff6b35', free: false, skills: ['Wireshark', 'Nmap', 'ARP Spoofing', 'WiFi Cracking', 'MITM'] },
  { phase: '05', title: 'Ethical Hacking', color: '#ff0055', free: false, skills: ['Metasploit', 'Privilege Escalation', 'Buffer Overflow', 'Shellcode', 'Post-Exploitation'] },
  { phase: '06', title: 'Digital Forensics', color: '#7c3aed', free: false, skills: ['Memory Forensics', 'Log Analysis', 'YARA', 'Threat Hunting', 'Incident Response'] },
];

export default function PublicRoadmapPage() {
  return (
    <div className="min-h-screen bg-cyber-dark cyber-grid">
      {/* Nav */}
      <nav className="border-b border-cyber-border bg-cyber-dark/90 backdrop-blur-xl px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-cyber-green rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-black" />
          </div>
          <span className="font-display font-bold text-white tracking-wider">CYBER<span className="text-cyber-green">QUEST</span></span>
        </Link>
        <div className="flex gap-3">
          <Link href="/login" className="text-gray-400 hover:text-white font-mono text-sm px-4 py-2 transition-colors">Login</Link>
          <Link href="/register" className="btn-cyber-solid text-sm px-5 py-2 rounded-lg">Start Free</Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-cyber-green/10 border border-cyber-green/30 rounded-full px-4 py-2 mb-6">
            <Map className="w-4 h-4 text-cyber-green" />
            <span className="text-cyber-green font-mono text-sm">Complete Learning Roadmap</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            From Zero to <span className="text-cyber-green">Hacker</span>
          </h1>
          <p className="text-gray-400 font-mono max-w-xl mx-auto">6 structured phases — beginner to expert cybersecurity professional</p>
        </div>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-cyber-green via-cyber-blue to-cyber-purple opacity-40" />

          <div className="space-y-6">
            {PHASES.map((phase, i) => (
              <div key={phase.phase} className="flex gap-6 items-start">
                {/* Node */}
                <div className="w-16 h-16 rounded-xl flex-shrink-0 flex items-center justify-center font-display font-bold text-sm border-2 z-10 relative"
                  style={{ background: phase.color + '15', borderColor: phase.color + '60', color: phase.color }}>
                  {phase.phase}
                </div>

                {/* Card */}
                <div className="flex-1 cyber-card rounded-xl p-5 border border-cyber-border hover:border-cyber-green/30 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-white font-display font-bold text-lg">{phase.title}</h3>
                      <span className={`badge text-xs mt-1 ${phase.free ? 'bg-cyber-green/10 text-cyber-green border-cyber-green/30' : 'bg-gray-500/10 text-gray-400 border-gray-500/30'}`}>
                        {phase.free ? '🆓 FREE' : '🔒 PRO'}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {phase.skills.map(skill => (
                      <span key={skill} className="text-xs font-mono px-2 py-1 rounded bg-black/30 border border-cyber-border text-gray-400">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Link href="/register" className="btn-cyber-solid px-10 py-4 rounded-xl text-base font-bold inline-flex items-center gap-2">
            Start Phase 01 — Free <ChevronRight className="w-5 h-5" />
          </Link>
          <p className="text-gray-500 font-mono text-sm mt-3">No credit card required</p>
        </div>
      </div>
    </div>
  );
}
