'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard, Users, BookOpen, Terminal, Settings,
  Home, LogOut, Shield, DollarSign, Bot, BarChart3, ChevronRight
} from 'lucide-react';

const NAV = [
  { href: '/admin', icon: LayoutDashboard, label: 'Overview', exact: true },
  { href: '/admin/users', icon: Users, label: 'Users' },
  { href: '/admin/courses', icon: BookOpen, label: 'Courses' },
  { href: '/admin/challenges', icon: Terminal, label: 'Challenges' },
  { href: '/admin/pricing', icon: DollarSign, label: 'Pricing & Plans' },
  { href: '/admin/ai-assistant', icon: Bot, label: 'AI Assistant' },
  { href: '/admin/settings', icon: Settings, label: 'Settings' },
];

export default function AdminSidebar() {
  const path = usePathname();

  return (
    <aside className="w-64 flex-shrink-0 bg-[#0f0f18] border-r border-red-900/20 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-5 border-b border-red-900/20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-red-500/20 rounded-lg border border-red-500/30 flex items-center justify-center">
            <Shield className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <p className="text-white font-bold text-sm tracking-wider">ADMIN</p>
            <p className="text-red-400 font-mono text-xs">Control Panel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {NAV.map(({ href, icon: Icon, label, exact }) => {
          const active = exact ? path === href : path.startsWith(href);
          return (
            <Link key={href} href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-mono transition-all ${
                active
                  ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}>
              <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-red-400' : 'text-gray-500'}`} />
              {label}
              {active && <ChevronRight className="w-3 h-3 ml-auto text-red-400" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-red-900/20 space-y-1">
        <Link href="/dashboard"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-mono text-gray-500 hover:text-white hover:bg-white/5 transition-all">
          <Home className="w-4 h-4" /> Back to App
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-mono text-gray-500 hover:text-red-400 hover:bg-red-500/5 transition-all">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </aside>
  );
}
