// app/admin/layout.tsx
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import AdminSidebar from './AdminSidebar';

const ADMIN_LINKS = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/courses', label: 'Courses' },
  { href: '/admin/challenges', label: 'Challenges' },
  { href: '/admin/pricing', label: 'Pricing' },
  { href: '/admin/ai-assistant', label: 'AI Assistant' },
  { href: '/admin/settings', label: 'Settings' },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'ADMIN') redirect('/dashboard');

  return (
    <div className="min-h-screen bg-[#0a0a0f] md:flex">
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        <div className="md:hidden sticky top-0 z-40 bg-[#0f0f18]/95 backdrop-blur border-b border-red-900/20">
          <div className="px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-white font-bold text-sm tracking-wider">ADMIN PANEL</p>
              <p className="text-red-400 font-mono text-[11px]">CyberQuest Control</p>
            </div>
            <Link href="/dashboard" className="text-xs font-mono text-gray-400 border border-red-900/30 rounded-lg px-3 py-2">
              App
            </Link>
          </div>
          <div className="px-4 pb-3 flex gap-2 overflow-x-auto no-scrollbar">
            {ADMIN_LINKS.map(link => (
              <Link key={link.href} href={link.href} className="shrink-0 text-xs font-mono text-gray-300 bg-white/5 border border-white/10 rounded-full px-3 py-2">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <main className="overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
