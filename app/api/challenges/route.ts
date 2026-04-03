// app/api/challenges/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = session.user.id as string;
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { plan: true } });

  const challenges = await prisma.challenge.findMany({
    where: { isActive: true },
    orderBy: [{ difficulty: 'asc' }, { points: 'asc' }],
  });

  const solved = await prisma.challengeAttempt.findMany({
    where: { userId, isCorrect: true },
    select: { challengeId: true },
  });
  const solvedIds = new Set(solved.map(s => s.challengeId));

  return NextResponse.json(
    challenges.map(c => ({
      id: c.id,
      title: c.title,
      description: c.description,
      category: c.category,
      difficulty: c.difficulty,
      points: c.points,
      hints: c.hints,
      isPremium: c.isPremium,
      unlocked: !c.isPremium || user?.plan === 'PRO',
      solved: solvedIds.has(c.id),
    }))
  );
}
