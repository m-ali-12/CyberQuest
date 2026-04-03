// app/dashboard/roadmap/page.tsx
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle, Lock, Play, ChevronRight, Shield, Globe, Code, Search, Key, Network } from 'lucide-react';

const ROADMAP = [
  {
    phase: '01', title: 'Foundations', color: '#00ff88', icon: Shield,
    description: 'Build the fundamental knowledge every security professional needs',
    courses: [
      { title: 'Cybersecurity Fundamentals', slug: 'cybersecurity-fundamentals', free: true, xp: 1000 },
      { title: 'Networking Basics', slug: 'networking-basics', free: true, xp: 800 },
      { title: 'Linux for Hackers', slug: 'linux-hackers', free: true, xp: 900 },
    ],
    skills: ['CIA Triad', 'OSI Model', 'TCP/IP', 'Linux CLI', 'Threat Types'],
  },
  {
    phase: '02', title: 'Web Security', color: '#00d4ff', icon: Globe,
    description: 'Master web application vulnerabilities and defenses',
    courses: [
      { title: 'Web App Security', slug: 'web-application-security', free: true, xp: 2000 },
      { title: 'OWASP Top 10 Deep Dive', slug: 'owasp-top-10', free: false, xp: 1500 },
      { title: 'API Security', slug: 'api-security', free: false, xp: 1200 },
    ],
    skills: ['SQL Injection', 'XSS', 'CSRF', 'IDOR', 'JWT attacks'],
  },
  {
    phase: '03', title: 'Cryptography', color: '#f59e0b', icon: Key,
    description: 'Understand encryption algorithms and how to break them',
    courses: [
      { title: 'Cryptography Fundamentals', slug: 'cryptography', free: true, xp: 2500 },
      { title: 'Crypto CTF Challenges', slug: 'crypto-ctf', free: false, xp: 1800 },
    ],
    skills: ['Symmetric/Asymmetric', 'RSA', 'AES', 'Hashing', 'PKI'],
  },
  {
    phase: '04', title: 'Network Hacking', color: '#ff6b35', icon: Network,
    description: 'Attack and defend network infrastructure',
    courses: [
      { title: 'Network Security', slug: 'network-security', free: false, xp: 2800 },
      { title: 'Wireless Hacking', slug: 'wireless-hacking', free: false, xp: 2000 },
      { title: 'Packet Analysis', slug: 'packet-analysis', free: false, xp: 1500 },
    ],
    skills: ['Wireshark', 'Nmap', 'ARP spoofing', 'WiFi cracking', 'MITM'],
  },
  {
    phase: '05', title: 'Exploitation', color: '#ff0055', icon: Code,
    description: 'Advanced exploitation techniques used by elite hackers',
    courses: [
      { title: 'Ethical Hacking', slug: 'ethical-hacking', free: false, xp: 3500 },
      { title: 'Metasploit Mastery', slug: 'metasploit', free: false, xp: 2500 },
      { title: 'Buffer Overflows', slug: 'buffer-overflows', free: false, xp: 3000 },
    ],
    skills: ['Metasploit', 'Privilege Escalation', 'Buffer Overflow', 'Shellcode', 'Post-Exploitation'],
  },
  {
    phase: '06', title: 'Forensics & DFIR', color: '#7c3aed', icon: Search,
    description: 'Investigate attacks and respond to incidents',
    courses: [
      { title: 'Digital Forensics', slug: 'digital-forensics', free: false, xp: 3000 },
      { title: 'Malware Analysis', slug: 'malware-analysis', free: false, xp: 2800 },
      { title: 'Incident Response', slug: 'incident-response', free: false, xp: 2500 },
    ],
    skills: ['Memory Forensics', 'Log Analysis', 'Chain of Custody', 'YARA', 'Threat Hunting'],
  },
];

export default function RoadmapPage() {
  const [activePhase, setActivePhase] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-white mb-2">
          Learning <span className="text-cyber-green">Roadmap</span>
        </h1>
        <p className="text-gray-400 font-mono text-sm">Your structured path from beginner to expert</p>
      </div>

      {/* Legend */}
      <div className="flex gap-4 flex-wrap">
        {[
          { color: 'bg-cyber-green', label: 'Free' },
          { color: 'bg-cyber-yellow', label: 'Pro' },
          { color: 'bg-gray-600', label: 'Locked' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-2 text-xs font-mono text-gray-400">
            <div className={`w-3 h-3 rounded-full ${color}`} />
            {label}
          </div>
        ))}
      </div>

      {/* Roadmap */}
      <div className="relative">
        {/* Center line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-cyber-green via-cyber-blue to-cyber-purple opacity-30 hidden lg:block" />

        <div className="space-y-6">
          {ROADMAP.map((phase, idx) => {
            const Icon = phase.icon;
            const isActive = activePhase === phase.phase;
            const isLeft = idx % 2 === 0;

            return (
              <div key={phase.phase} className="relative">
                {/* Desktop: Alternating layout */}
                <div className="hidden lg:flex items-start gap-8">
                  {isLeft ? (
                    <>
                      {/* Content */}
                      <div className="flex-1">
                        <div
                          onClick={() => setActivePhase(isActive ? null : phase.phase)}
                          className={`cyber-card rounded-xl p-6 cursor-pointer transition-all ${isActive ? 'border-opacity-100' : ''}`}
                          style={{ borderColor: isActive ? phase.color + '50' : undefined }}
                        >
                          <PhaseCard phase={phase} isActive={isActive} />
                        </div>
                      </div>
                      {/* Node */}
                      <div className="flex flex-col items-center flex-shrink-0 w-16">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center font-display font-bold text-sm border-2 z-10"
                          style={{ background: phase.color + '15', borderColor: phase.color + '50', color: phase.color }}>
                          {phase.phase}
                        </div>
                      </div>
                      <div className="flex-1" />
                    </>
                  ) : (
                    <>
                      <div className="flex-1" />
                      <div className="flex flex-col items-center flex-shrink-0 w-16">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center font-display font-bold text-sm border-2 z-10"
                          style={{ background: phase.color + '15', borderColor: phase.color + '50', color: phase.color }}>
                          {phase.phase}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div
                          onClick={() => setActivePhase(isActive ? null : phase.phase)}
                          className="cyber-card rounded-xl p-6 cursor-pointer transition-all"
                          style={{ borderColor: isActive ? phase.color + '50' : undefined }}
                        >
                          <PhaseCard phase={phase} isActive={isActive} />
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Mobile: Single column */}
                <div className="lg:hidden flex gap-4">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center font-display font-bold text-xs border-2"
                      style={{ background: phase.color + '15', borderColor: phase.color + '50', color: phase.color }}>
                      {phase.phase}
                    </div>
                    {idx < ROADMAP.length - 1 && <div className="w-px flex-1 mt-2" style={{ background: phase.color + '20' }} />}
                  </div>
                  <div className="flex-1 pb-4">
                    <div
                      onClick={() => setActivePhase(isActive ? null : phase.phase)}
                      className="cyber-card rounded-xl p-5 cursor-pointer transition-all"
                      style={{ borderColor: isActive ? phase.color + '50' : undefined }}
                    >
                      <PhaseCard phase={phase} isActive={isActive} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="cyber-card rounded-xl p-8 border border-cyber-green/20 bg-cyber-green/5 text-center">
        <h2 className="text-2xl font-display font-bold text-white mb-2">Ready to start?</h2>
        <p className="text-gray-400 font-mono text-sm mb-6">Begin with Phase 01 — completely free</p>
        <Link href="/dashboard/courses/cybersecurity-fundamentals" className="btn-cyber-solid px-8 py-3 rounded-lg text-sm font-bold">
          Start Phase 01 — Free →
        </Link>
      </div>
    </div>
  );
}

function PhaseCard({ phase, isActive }: { phase: typeof ROADMAP[0]; isActive: boolean }) {
  const Icon = phase.icon;
  return (
    <>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: phase.color + '15' }}>
            <Icon className="w-5 h-5" style={{ color: phase.color }} />
          </div>
          <div>
            <h3 className="text-white font-display font-bold text-lg">{phase.title}</h3>
            <p className="text-gray-400 text-sm font-mono">{phase.description}</p>
          </div>
        </div>
        <ChevronRight className={`w-4 h-4 text-gray-500 transition-transform flex-shrink-0 mt-1 ${isActive ? 'rotate-90' : ''}`} />
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-2 mb-3">
        {phase.skills.map(skill => (
          <span key={skill} className="text-xs font-mono px-2 py-0.5 rounded-md bg-black/30 text-gray-400 border border-cyber-border">
            {skill}
          </span>
        ))}
      </div>

      {/* Expanded courses */}
      {isActive && (
        <div className="mt-4 pt-4 border-t border-cyber-border space-y-2">
          {phase.courses.map(course => (
            <Link key={course.slug} href={`/dashboard/courses/${course.slug}`}
              className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-cyber-border hover:border-cyber-blue/30 transition-all"
            >
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${course.free ? 'bg-cyber-green' : 'bg-cyber-yellow'}`} />
                <span className="text-white text-sm font-bold">{course.title}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-cyber-green font-mono text-xs">+{course.xp} XP</span>
                {!course.free && <Lock className="w-3 h-3 text-gray-500" />}
                <ChevronRight className="w-3 h-3 text-gray-500" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
