'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Shield, Terminal, Trophy, Zap, Lock, Users, Star, ChevronRight, Globe, Code, Eye } from 'lucide-react';
import PublicNav from '@/components/layout/PublicNav';

const TYPING_TEXTS = [
  'Learn Ethical Hacking',
  'Master Web Security',
  'Solve CTF Challenges',
  'Earn Certifications',
  'Become a Pro Hacker',
];

function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const chars = '01アイウエオカキクケコサシスセソ';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(1);
    
    const draw = () => {
      ctx.fillStyle = 'rgba(10, 14, 26, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#00ff88';
      ctx.font = `${fontSize}px JetBrains Mono`;
      
      drops.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * fontSize, y * fontSize);
        if (y * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      });
    };
    
    const interval = setInterval(draw, 50);
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', resize);
    return () => { clearInterval(interval); window.removeEventListener('resize', resize); };
  }, []);
  
  return <canvas ref={canvasRef} className="fixed inset-0 opacity-5 pointer-events-none" />;
}

function TypingText() {
  const [textIndex, setTextIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    const current = TYPING_TEXTS[textIndex];
    const timer = setTimeout(() => {
      if (!isDeleting) {
        setDisplayed(current.slice(0, displayed.length + 1));
        if (displayed.length === current.length) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        setDisplayed(current.slice(0, displayed.length - 1));
        if (displayed.length === 0) {
          setIsDeleting(false);
          setTextIndex((textIndex + 1) % TYPING_TEXTS.length);
        }
      }
    }, isDeleting ? 50 : 100);
    return () => clearTimeout(timer);
  }, [displayed, isDeleting, textIndex]);
  
  return (
    <span className="text-cyber-green font-mono">
      {displayed}<span className="animate-pulse">_</span>
    </span>
  );
}

const COURSES = [
  { icon: '🛡️', title: 'Cybersecurity Fundamentals', level: 'Beginner', free: true, modules: 8, students: '12.4k' },
  { icon: '🌐', title: 'Web App Security', level: 'Intermediate', free: true, modules: 12, students: '8.2k' },
  { icon: '⚔️', title: 'Ethical Hacking', level: 'Advanced', free: false, modules: 20, students: '5.1k' },
  { icon: '🔐', title: 'Cryptography', level: 'Intermediate', free: true, modules: 10, students: '6.8k' },
  { icon: '🔍', title: 'Digital Forensics', level: 'Advanced', free: false, modules: 15, students: '3.9k' },
  { icon: '📡', title: 'Network Security', level: 'Advanced', free: false, modules: 18, students: '4.5k' },
];

const STATS = [
  { value: '50,000+', label: 'Students', icon: Users },
  { value: '200+', label: 'Challenges', icon: Terminal },
  { value: '30+', label: 'Certifications', icon: Trophy },
  { value: '98%', label: 'Satisfaction', icon: Star },
];

const FEATURES = [
  { icon: Terminal, title: 'Hands-On Labs', desc: 'Real browser-based practice environments. No setup needed.' },
  { icon: Trophy, title: 'CTF Challenges', desc: '200+ Capture The Flag challenges from beginner to expert.' },
  { icon: Shield, title: 'Certifications', desc: 'Industry-recognized certs to boost your career.' },
  { icon: Zap, title: 'Gamified Learning', desc: 'XP, levels, streaks, badges — learning feels like a game.' },
  { icon: Globe, title: 'Live Roadmap', desc: 'Structured path from zero to security professional.' },
  { icon: Lock, title: 'Secure Platform', desc: 'Session limits, 2FA, and enterprise-grade security.' },
];

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  
  return (
    <div className="min-h-screen bg-cyber-dark overflow-x-hidden">
      <MatrixRain />
      
      <PublicNav />
      
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center cyber-grid pt-20">
        <div className="absolute inset-0 bg-glow-green opacity-30" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          
          <div className="inline-flex items-center gap-2 bg-cyber-card border border-cyber-green/30 rounded-full px-4 py-2 mb-8">
            <div className="w-2 h-2 bg-cyber-green rounded-full animate-pulse" />
            <span className="text-cyber-green font-mono text-xs tracking-widest uppercase">Free Trial Available — No Credit Card</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display font-black text-white mb-6 leading-tight">
            Become a<br />
            <TypingText />
          </h1>
          
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            The most engaging cybersecurity learning platform. Structured roadmap, hands-on challenges, real certifications — from absolute beginner to elite hacker.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/register" className="btn-cyber-solid px-8 py-4 rounded-lg text-base font-bold flex items-center gap-2 w-full sm:w-auto justify-center">
              Start Learning Free <ChevronRight className="w-5 h-5" />
            </Link>
            <Link href="/roadmap" className="btn-cyber px-8 py-4 rounded-lg text-base flex items-center gap-2 w-full sm:w-auto justify-center">
              View Roadmap <Eye className="w-5 h-5" />
            </Link>
          </div>
          
          {/* Terminal preview */}
          <div className="max-w-2xl mx-auto cyber-card rounded-xl overflow-hidden text-left">
            <div className="flex items-center gap-2 px-4 py-3 bg-black/30 border-b border-cyber-border">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="ml-2 text-gray-500 font-mono text-xs">cyberquest@terminal</span>
            </div>
            <div className="p-6 font-mono text-sm space-y-2">
              <p><span className="text-cyber-green">$</span> <span className="text-white">whoami</span></p>
              <p className="text-gray-400">cybersecurity_student → becoming_hacker</p>
              <p><span className="text-cyber-green">$</span> <span className="text-white">cat roadmap.txt</span></p>
              <p className="text-cyber-blue">Level 1: Fundamentals → Level 5: Exploitation → Level 10: Expert</p>
              <p><span className="text-cyber-green">$</span> <span className="text-white">./start_journey.sh</span></p>
              <p className="text-cyber-green animate-pulse">Initializing CyberQuest... Welcome, Hacker. ▮</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Stats */}
      <section className="py-20 border-y border-cyber-border relative">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map(({ value, label, icon: Icon }) => (
            <div key={label} className="text-center">
              <Icon className="w-8 h-8 text-cyber-green mx-auto mb-3" />
              <div className="text-3xl font-display font-bold text-white mb-1">{value}</div>
              <div className="text-gray-500 font-mono text-sm">{label}</div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-white mb-4">Why <span className="text-cyber-green">CyberQuest?</span></h2>
            <p className="text-gray-400 max-w-xl mx-auto">Not just courses — a complete journey to cybersecurity mastery</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="cyber-card p-6 rounded-xl group hover:border-cyber-green/50 transition-all">
                <div className="w-12 h-12 bg-cyber-green/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-cyber-green/20 transition-colors">
                  <Icon className="w-6 h-6 text-cyber-green" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Courses */}
      <section className="py-24 px-6 bg-cyber-card/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-white mb-4">Learning <span className="text-cyber-green">Paths</span></h2>
            <p className="text-gray-400">From zero knowledge to expert-level skills</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {COURSES.map((course) => (
              <div key={course.title} className="cyber-card rounded-xl overflow-hidden group hover:border-cyber-green/40 transition-all">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-4xl">{course.icon}</span>
                    <span className={`badge ${course.free ? 'bg-cyber-green/10 text-cyber-green border border-cyber-green/30' : 'bg-cyber-yellow/10 text-cyber-yellow border border-cyber-yellow/30'}`}>
                      {course.free ? 'FREE' : 'PRO'}
                    </span>
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">{course.title}</h3>
                  <div className="flex items-center gap-4 text-xs text-gray-500 font-mono mb-4">
                    <span>{course.level}</span>
                    <span>•</span>
                    <span>{course.modules} modules</span>
                    <span>•</span>
                    <span>{course.students} students</span>
                  </div>
                  <Link href="/register" className="w-full btn-cyber text-center text-sm py-2 rounded block">
                    {course.free ? 'Start Free' : 'Unlock with Pro'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Roadmap Preview */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-white mb-4">Your <span className="text-cyber-green">Roadmap</span></h2>
            <p className="text-gray-400">Clear path from beginner to certified professional</p>
          </div>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-cyber-green via-cyber-blue to-cyber-purple opacity-50" />
            {[
              { level: '01', title: 'Security Fundamentals', desc: 'CIA Triad, threats, basic networking', color: 'cyber-green', free: true },
              { level: '02', title: 'Web Security Basics', desc: 'OWASP Top 10, SQL injection, XSS', color: 'cyber-blue', free: true },
              { level: '03', title: 'Network Hacking', desc: 'Wireshark, Nmap, packet analysis', color: 'cyber-yellow', free: false },
              { level: '04', title: 'Exploitation', desc: 'Metasploit, buffer overflows, privesc', color: 'orange-400', free: false },
              { level: '05', title: 'Advanced Techniques', desc: 'Custom exploits, malware analysis, APTs', color: 'cyber-red', free: false },
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-6 mb-8 ml-0">
                <div className={`relative z-10 flex-shrink-0 w-16 h-16 rounded-xl cyber-card border border-${step.color}/50 flex items-center justify-center`}>
                  <span className={`font-display font-bold text-${step.color}`}>{step.level}</span>
                </div>
                <div className="cyber-card rounded-xl p-5 flex-1 flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-bold mb-1">{step.title}</h3>
                    <p className="text-gray-400 text-sm font-mono">{step.desc}</p>
                  </div>
                  <span className={`badge ml-4 flex-shrink-0 ${step.free ? 'bg-cyber-green/10 text-cyber-green' : 'bg-gray-500/10 text-gray-400'}`}>
                    {step.free ? 'FREE' : 'PRO'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Pricing */}
      <section className="py-24 px-6 bg-cyber-card/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-white mb-4">Simple <span className="text-cyber-green">Pricing</span></h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                name: 'Free', price: '$0', period: 'forever',
                features: ['2 Full courses', '20+ Challenges', 'Basic certifications', 'Community access', 'Progress tracking'],
                cta: 'Start Free', highlight: false,
              },
              {
                name: 'Pro', price: '$12', period: '/month',
                features: ['All 10+ courses', '200+ Challenges', 'All certifications', 'Lab environments', 'Priority support', 'Exam prep kits', 'Job board access'],
                cta: 'Go Pro', highlight: true,
              },
            ].map((plan) => (
              <div key={plan.name} className={`rounded-xl p-8 border ${plan.highlight ? 'border-cyber-green bg-cyber-green/5 shadow-cyber' : 'cyber-card'}`}>
                {plan.highlight && (
                  <div className="bg-cyber-green text-black text-xs font-bold font-mono px-3 py-1 rounded-full inline-block mb-4">MOST POPULAR</div>
                )}
                <div className="font-display font-bold text-2xl text-white mb-1">{plan.name}</div>
                <div className="flex items-end gap-1 mb-6">
                  <span className="text-4xl font-display font-black text-white">{plan.price}</span>
                  <span className="text-gray-400 font-mono pb-1">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-3 text-gray-300 text-sm">
                      <span className="text-cyber-green">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/register" className={`block text-center py-3 rounded-lg font-bold font-mono transition-all ${plan.highlight ? 'btn-cyber-solid' : 'btn-cyber'}`}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="text-6xl mb-6">🛡️</div>
          <h2 className="text-4xl font-display font-bold text-white mb-4">
            Ready to become a <span className="text-cyber-green">Hacker?</span>
          </h2>
          <p className="text-gray-400 mb-8">Join 50,000+ students already learning on CyberQuest. Start free, upgrade when ready.</p>
          <Link href="/register" className="btn-cyber-solid px-10 py-4 rounded-lg text-lg font-bold inline-flex items-center gap-2">
            Begin Your Journey <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t border-cyber-border py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-cyber-green" />
            <span className="font-display font-bold text-white">CYBER<span className="text-cyber-green">QUEST</span></span>
          </div>
          <p className="text-gray-500 font-mono text-sm">© 2024 CyberQuest. All rights reserved.</p>
          <div className="flex gap-6">
            {['Privacy', 'Terms', 'Contact'].map(item => (
              <Link key={item} href={`/${item.toLowerCase()}`} className="text-gray-500 hover:text-cyber-green transition-colors font-mono text-sm">{item}</Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
