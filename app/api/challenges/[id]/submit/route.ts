// app/api/challenges/[id]/submit/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { calculateLevel } from '@/lib/utils';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = session.user.id as string;
  const { flag } = await req.json();

  const challenge = await prisma.challenge.findUnique({ where: { id: params.id } });
  if (!challenge) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // Check if already solved
  const alreadySolved = await prisma.challengeAttempt.findFirst({
    where: { userId, challengeId: params.id, isCorrect: true },
  });
  if (alreadySolved) return NextResponse.json({ correct: true, alreadySolved: true });

  const correct = flag.trim().toLowerCase() === challenge.flag.toLowerCase();
  const xpEarned = correct ? challenge.points : 0;

  await prisma.challengeAttempt.create({
    data: { userId, challengeId: params.id, answer: flag, isCorrect: correct, xpEarned },
  });

  if (correct) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { xp: { increment: xpEarned } },
      select: { xp: true, level: true },
    });
    const newLevel = calculateLevel(user.xp);
    if (newLevel > user.level) {
      await prisma.user.update({ where: { id: userId }, data: { level: newLevel } });
    }

    // Achievement: first challenge
    const count = await prisma.challengeAttempt.count({ where: { userId, isCorrect: true } });
    if (count === 1) {
      const ach = await prisma.achievement.findFirst({ where: { condition: 'first_challenge' } });
      if (ach) {
        try {
          await prisma.userAchievement.create({ data: { userId, achievementId: ach.id } });
          await prisma.user.update({ where: { id: userId }, data: { xp: { increment: ach.xpReward } } });
        } catch {}
      }
    }
  }

  return NextResponse.json({ correct, xpEarned });
}
