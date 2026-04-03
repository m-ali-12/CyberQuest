// app/admin/users/page.tsx
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import AdminUsersClient from './AdminUsersClient';

export default async function AdminUsersPage() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'ADMIN') redirect('/dashboard');

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true, name: true, email: true, xp: true, level: true,
      plan: true, role: true, isBanned: true, banUntil: true,
      createdAt: true, loginCount: true, streak: true,
      _count: { select: { certifications: true, challengeAttempts: true } },
    },
  });

  return <AdminUsersClient users={users as any} />;
}
