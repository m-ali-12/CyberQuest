// app/api/lessons/[lessonId]/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: { lessonId: string } }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = session.user.id as string;

  const lesson = await prisma.lesson.findUnique({
    where: { id: params.lessonId },
    include: { module: { include: { course: { select: { isPremium: true } } } } },
  });

  if (!lesson) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { plan: true } });
  const locked = lesson.isPremium || lesson.module.isPremium || lesson.module.course.isPremium;
  if (locked && user?.plan !== 'PRO') {
    return NextResponse.json({ error: 'Upgrade required for this Pro lesson' }, { status: 402 });
  }

  return NextResponse.json({
    ...lesson,
    moduleTitle: lesson.module.title,
  });
}
