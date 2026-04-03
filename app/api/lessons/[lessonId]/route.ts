// app/api/lessons/[lessonId]/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: { lessonId: string } }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const lesson = await prisma.lesson.findUnique({
    where: { id: params.lessonId },
    include: { module: { select: { title: true, courseId: true } } },
  });

  if (!lesson) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json({
    ...lesson,
    moduleTitle: lesson.module.title,
  });
}
