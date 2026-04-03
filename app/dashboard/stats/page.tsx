// app/dashboard/stats/page.tsx
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import StatsClient from './StatsClient';

export default async function StatsPage() {
  const session = await auth();
  const userId = session!.user!.id as string;

  const [user, allProgress, challengeAttempts, examAttempts, achievements] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { xp: true, level: true, streak: true, createdAt: true, loginCount: true, name: true } }),
    prisma.userProgress.findMany({ where: { userId, status: 'COMPLETED' }, select: { xpEarned: true, completedAt: true, lessonId: true, courseId: true } }),
    prisma.challengeAttempt.findMany({ where: { userId }, select: { isCorrect: true, xpEarned: true, attemptedAt: true } }),
    prisma.examAttempt.findMany({ where: { userId }, select: { score: true, passed: true, completedAt: true } }),
    prisma.userAchievement.findMany({
      where: { userId },
      include: { achievement: true },
      orderBy: { earnedAt: 'desc' },
    }),
  ]);

  // Build weekly XP data (last 7 days)
  const last7days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });

  const xpByDay: Record<string, number> = {};
  last7days.forEach(d => { xpByDay[d] = 0; });
  allProgress.forEach(p => {
    if (p.completedAt) {
      const day = new Date(p.completedAt).toISOString().slice(0, 10);
      if (xpByDay[day] !== undefined) xpByDay[day] += p.xpEarned;
    }
  });

  const weeklyXp = last7days.map(d => ({
    day: new Date(d).toLocaleDateString('en-US', { weekday: 'short' }),
    xp: xpByDay[d],
  }));

  const solvedChallenges = challengeAttempts.filter(a => a.isCorrect).length;
  const totalAttempts = challengeAttempts.length;
  const passedExams = examAttempts.filter(e => e.passed).length;
  const avgExamScore = examAttempts.length > 0
    ? Math.round(examAttempts.reduce((a, e) => a + e.score, 0) / examAttempts.length)
    : 0;

  return (
    <StatsClient
      user={user as any}
      weeklyXp={weeklyXp}
      stats={{ solvedChallenges, totalAttempts, passedExams, totalExams: examAttempts.length, avgExamScore, lessonsCompleted: allProgress.length }}
      achievements={achievements as any}
    />
  );
}
