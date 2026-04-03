// app/dashboard/layout.tsx
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect('/login');

  return (
    <div className="flex h-screen bg-cyber-dark overflow-hidden">
      <Sidebar user={session.user as any} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar user={session.user as any} />
        <main className="flex-1 overflow-y-auto p-6 cyber-grid">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
