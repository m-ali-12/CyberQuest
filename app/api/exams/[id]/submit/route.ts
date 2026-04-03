// app/api/exams/[id]/submit/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { calculateLevel } from '@/lib/utils';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = session.user.id as string;
  const { answers } = await req.json();

  const exam = await prisma.exam.findUnique({
    where: { id: params.id },
    include: { questions: true, course: { select: { title: true } } },
  });
  if (!exam) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // Score it
  let correct = 0;
  const totalPoints = exam.questions.reduce((acc, q) => acc + q.points, 0);
  let earnedPoints = 0;

  exam.questions.forEach(q => {
    if (answers[q.id] === q.answer) { correct++; earnedPoints += q.points; }
  });

  const score = Math.round((earnedPoints / totalPoints) * 100);
  const passed = score >= exam.passingScore;
  const xpEarned = passed ? exam.xpReward : Math.round(exam.xpReward * 0.1);

  // Save attempt
  await prisma.examAttempt.create({
    data: { userId, examId: params.id, answers, score, passed, xpEarned, completedAt: new Date() },
  });

  // Award XP
  const user = await prisma.user.update({
    where: { id: userId },
    data: { xp: { increment: xpEarned } },
    select: { xp: true, level: true },
  });
  const newLevel = calculateLevel(user.xp);
  if (newLevel > user.level) await prisma.user.update({ where: { id: userId }, data: { level: newLevel } });

  // Issue certification
  let certId = null;
  if (passed) {
    const cert = await prisma.certification.create({
      data: {
        userId,
        title: `${exam.course.title} — Certified`,
        courseId: exam.courseId,
        certId: `CQ-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      },
    });
    certId = cert.certId;

    // Perfect score achievement
    if (score === 100) {
      const ach = await prisma.achievement.findFirst({ where: { condition: 'perfect_exam' } });
      if (ach) {
        try {
          await prisma.userAchievement.create({ data: { userId, achievementId: ach.id } });
          await prisma.user.update({ where: { id: userId }, data: { xp: { increment: ach.xpReward } } });
        } catch {}
      }
    }
  }

  return NextResponse.json({ score, passed, correct, total: exam.questions.length, xpEarned, certId });
}
