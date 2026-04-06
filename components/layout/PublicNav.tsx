'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, Menu, X, ChevronRight } from 'lucide-react';

const NAV_LINKS = [
  { href: '/courses', label: 'Courses' },
  { href: '/challenges', label: 'Challenges' },
  { href: '/roadmap', label: 'Roadmap' },
  { href: '/#pricing', label: 'Pricing' },
];

export default function PublicNav() {
  const [open, setOpen] = useState(false);
  const path = usePathname();

  return (
    <nav className="fixed top-0 w-full z-50 bg-cyber-dark/90 backdrop-blur-xl border-b border-cyber-border">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-cyber-green rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-black" />
          </div>
          <span className="font-display font-bold text-white text-lg tracking-wider">
            CYBER<span className="text-cyber-green">QUEST</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ href, label }) => (
            <Link key={href} href={href}
              className={`font-mono text-sm transition-colors ${path === href ? 'text-cyber-green' : 'text-gray-400 hover:text-cyber-green'}`}>
              {label}
            </Link>
          ))}
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" className="text-gray-400 hover:text-white font-mono text-sm px-4 py-2 transition-colors">
            Login
          </Link>
          <Link href="/register" className="btn-cyber-solid text-sm px-5 py-2 rounded-lg">
            Start Free
          </Link>
        </div>

        {/* Mobile menu button */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-gray-400 hover:text-white">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {open && (
        <div className="md:hidden bg-cyber-card border-b border-cyber-border px-6 py-4 space-y-3">
          {NAV_LINKS.map(({ href, label }) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}
              className="flex items-center justify-between py-2 text-gray-400 hover:text-cyber-green font-mono text-sm transition-colors">
              {label} <ChevronRight className="w-4 h-4" />
            </Link>
          ))}
          <div className="pt-3 border-t border-cyber-border flex gap-3">
            <Link href="/login" onClick={() => setOpen(false)}
              className="flex-1 text-center py-2.5 border border-cyber-border rounded-lg text-gray-400 font-mono text-sm hover:border-gray-500 transition-colors">
              Login
            </Link>
            <Link href="/register" onClick={() => setOpen(false)}
              className="flex-1 text-center py-2.5 btn-cyber-solid rounded-lg text-sm font-bold">
              Start Free
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
