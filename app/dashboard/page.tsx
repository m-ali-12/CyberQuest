// app/dashboard/page.tsx
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { xpProgress } from '@/lib/utils';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user!.id as string;

  const [user, recentProgress, totalChallenges, solvedChallenges, certs, leaderboard] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, xp: true, level: true, streak: true, plan: true, createdAt: true, loginCount: true },
    }),
    prisma.userProgress.findMany({
      where: { userId, status: 'COMPLETED' },
      include: { lesson: { select: { title: true } }, course: { select: { title: true, icon: true } } },
      orderBy: { completedAt: 'desc' },
      take: 5,
    }),
    prisma.challenge.count({ where: { isActive: true } }),
    prisma.challengeAttempt.count({ where: { userId, isCorrect: true } }),
    prisma.certification.count({ where: { userId } }),
    prisma.user.findMany({
      orderBy: { xp: 'desc' },
      take: 5,
      select: { id: true, name: true, xp: true, level: true },
    }),
  ]);

  const courses = await prisma.course.findMany({
    orderBy: { order: 'asc' },
    include: {
      progress: { where: { userId }, select: { status: true } },
      _count: { select: { modules: true } },
    },
  });

  return (
    <DashboardClient
      user={user as any}
      recentProgress={recentProgress as any}
      totalChallenges={totalChallenges}
      solvedChallenges={solvedChallenges}
      certs={certs}
      leaderboard={leaderboard as any}
      courses={courses as any}
    />
  );
}
