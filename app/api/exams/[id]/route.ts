// app/api/exams/[id]/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const exam = await prisma.exam.findUnique({
    where: { id: params.id },
    include: {
      questions: { orderBy: { order: 'asc' }, select: { id: true, text: true, type: true, options: true, points: true, order: true } },
      course: { select: { title: true, isPremium: true } },
    },
  });
  if (!exam) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const plan = (session.user as any).plan;
  if ((exam.isPremium || exam.course.isPremium) && plan !== 'PRO') {
    return NextResponse.json({ error: 'Upgrade required for this Pro exam' }, { status: 402 });
  }

  return NextResponse.json({
    id: exam.id,
    title: exam.title,
    description: exam.description,
    duration: exam.duration,
    passingScore: exam.passingScore,
    xpReward: exam.xpReward,
    courseTitle: exam.course.title,
    questions: exam.questions,
  });
}
