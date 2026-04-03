// app/admin/page.tsx
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import AdminOverviewClient from './AdminOverviewClient';

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'ADMIN') redirect('/dashboard');

  const [totalUsers, proUsers, totalChallenges, totalCourses, bannedUsers, recentUsers, examAttempts, challengeAttempts] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { plan: 'PRO' } }),
    prisma.challenge.count(),
    prisma.course.count(),
    prisma.user.count({ where: { isBanned: true } }),
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' }, take: 20,
      select: { id: true, name: true, email: true, xp: true, level: true, plan: true, role: true, isBanned: true, banUntil: true, createdAt: true, loginCount: true },
    }),
    prisma.examAttempt.count(),
    prisma.challengeAttempt.count({ where: { isCorrect: true } }),
  ]);

  // Revenue estimate
  const revenue = proUsers * 12;

  return (
    <AdminOverviewClient
      stats={{ totalUsers, proUsers, totalChallenges, totalCourses, bannedUsers, examAttempts, challengeAttempts, revenue }}
      recentUsers={recentUsers as any}
    />
  );
}
