'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard, BookOpen, Terminal, Trophy, FileCheck,
  Award, Map, BarChart2, Settings, LogOut, Shield, Crown, ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { href: '/dashboard/courses', icon: BookOpen, label: 'Courses' },
  { href: '/dashboard/challenges', icon: Terminal, label: 'Challenges' },
  { href: '/dashboard/exams', icon: FileCheck, label: 'Exams' },
  { href: '/dashboard/certifications', icon: Award, label: 'Certifications' },
  { href: '/dashboard/roadmap', icon: Map, label: 'Roadmap' },
  { href: '/dashboard/leaderboard', icon: Trophy, label: 'Leaderboard' },
  { href: '/dashboard/stats', icon: BarChart2, label: 'My Stats' },
];

interface Props {
  user: { name?: string | null; email?: string | null; image?: string | null; role?: string; plan?: string; xp?: number; level?: number };
}

export default function Sidebar({ user }: Props) {
  const path = usePathname();
  const isAdmin = user.role === 'ADMIN';
  const isPro = user.plan === 'PRO';

  return (
    <aside className="w-64 flex-shrink-0 bg-cyber-card border-r border-cyber-border flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b border-cyber-border">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-cyber-green rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-black" />
          </div>
          <span className="font-display font-bold text-white tracking-wider">
            CYBER<span className="text-cyber-green">QUEST</span>
          </span>
        </Link>
      </div>

      {/* User info */}
      <div className="p-4 border-b border-cyber-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyber-green to-cyber-blue flex items-center justify-center text-black font-bold text-sm flex-shrink-0">
            {user.name?.[0]?.toUpperCase() || 'H'}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-white text-sm font-bold truncate">{user.name || 'Hacker'}</p>
              {isPro && <Crown className="w-3 h-3 text-cyber-yellow flex-shrink-0" />}
            </div>
            <p className="text-gray-500 text-xs font-mono truncate">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {NAV.map(({ href, icon: Icon, label, exact }) => {
          const active = exact ? path === href : path.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-mono transition-all group',
                active
                  ? 'bg-cyber-green/10 text-cyber-green border border-cyber-green/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              )}
            >
              <Icon className={cn('w-4 h-4 flex-shrink-0', active ? 'text-cyber-green' : 'text-gray-500 group-hover:text-gray-300')} />
              {label}
              {active && <ChevronRight className="w-3 h-3 ml-auto" />}
            </Link>
          );
        })}

        {isAdmin && (
          <>
            <div className="pt-3 pb-1 px-3">
              <p className="text-xs text-gray-600 font-mono uppercase tracking-wider">Admin</p>
            </div>
            <Link
              href="/admin"
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-mono transition-all',
                path.startsWith('/admin')
                  ? 'bg-cyber-red/10 text-cyber-red border border-cyber-red/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              )}
            >
              <Shield className="w-4 h-4 text-cyber-red flex-shrink-0" />
              Admin Panel
            </Link>
          </>
        )}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-cyber-border space-y-0.5">
        <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-mono text-gray-400 hover:text-white hover:bg-white/5 transition-all">
          <Settings className="w-4 h-4 text-gray-500" />
          Settings
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-mono text-gray-400 hover:text-cyber-red hover:bg-cyber-red/5 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
