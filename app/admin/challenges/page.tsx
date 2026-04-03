// app/admin/challenges/page.tsx
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import AdminChallengesClient from './AdminChallengesClient';

export default async function AdminChallengesPage() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'ADMIN') redirect('/dashboard');

  const challenges = await prisma.challenge.findMany({
    orderBy: [{ difficulty: 'asc' }, { points: 'asc' }],
    include: { _count: { select: { attempts: true } } },
  });

  const solved = await prisma.challengeAttempt.groupBy({
    by: ['challengeId'], where: { isCorrect: true }, _count: { userId: true },
  });
  const solvedMap: Record<string, number> = {};
  solved.forEach(s => { solvedMap[s.challengeId] = s._count.userId; });

  return (
    <AdminChallengesClient
      challenges={challenges.map(c => ({ ...c, solvedCount: solvedMap[c.id] || 0 })) as any}
    />
  );
}
