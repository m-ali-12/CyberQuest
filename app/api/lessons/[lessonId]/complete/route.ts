// app/api/lessons/[lessonId]/complete/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { calculateLevel } from '@/lib/utils';

export async function POST(req: Request, { params }: { params: { lessonId: string } }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = session.user.id as string;

  const lesson = await prisma.lesson.findUnique({
    where: { id: params.lessonId },
    include: { module: { select: { courseId: true, id: true } } },
  });
  if (!lesson) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // Check if already completed
  const existing = await prisma.userProgress.findFirst({
    where: { userId, lessonId: params.lessonId, status: 'COMPLETED' },
  });
  if (existing) return NextResponse.json({ xpEarned: 0, alreadyCompleted: true });

  // Mark as completed
  await prisma.userProgress.upsert({
    where: { userId_courseId_moduleId_lessonId: {
      userId, courseId: lesson.module.courseId, moduleId: lesson.module.id, lessonId: params.lessonId
    }},
    update: { status: 'COMPLETED', completedAt: new Date(), xpEarned: lesson.xpReward },
    create: {
      userId, courseId: lesson.module.courseId, moduleId: lesson.module.id, lessonId: params.lessonId,
      status: 'COMPLETED', completedAt: new Date(), xpEarned: lesson.xpReward,
    },
  });

  // Award XP to user
  const user = await prisma.user.update({
    where: { id: userId },
    data: { xp: { increment: lesson.xpReward } },
    select: { xp: true, level: true },
  });

  // Update level
  const newLevel = calculateLevel(user.xp);
  if (newLevel > user.level) {
    await prisma.user.update({ where: { id: userId }, data: { level: newLevel } });
  }

  // Find next lesson
  const nextLesson = await prisma.lesson.findFirst({
    where: { moduleId: lesson.moduleId, order: { gt: lesson.order } },
    orderBy: { order: 'asc' },
    select: { id: true },
  });

  // If no next lesson in module, find next module's first lesson
  let nextLessonId = nextLesson?.id;
  if (!nextLessonId) {
    const nextModule = await prisma.module.findFirst({
      where: { courseId: lesson.module.courseId, order: { gt: (await prisma.module.findUnique({ where: { id: lesson.moduleId }, select: { order: true } }))!.order } },
      orderBy: { order: 'asc' },
      include: { lessons: { orderBy: { order: 'asc' }, take: 1 } },
    });
    nextLessonId = nextModule?.lessons?.[0]?.id;
  }

  // Check achievements
  const completedCount = await prisma.userProgress.count({ where: { userId, status: 'COMPLETED', lessonId: { not: null } } });
  if (completedCount === 1) await awardAchievement(userId, 'first-blood');
  if (completedCount === 5) await awardAchievement(userId, 'hacker-initiate');

  return NextResponse.json({ xpEarned: lesson.xpReward, nextLessonId, newLevel });
}

async function awardAchievement(userId: string, achievementId: string) {
  try {
    const ach = await prisma.achievement.findFirst({ where: { id: achievementId } });
    if (!ach) return;
    await prisma.userAchievement.create({ data: { userId, achievementId } });
    await prisma.user.update({ where: { id: userId }, data: { xp: { increment: ach.xpReward } } });
  } catch {} // Ignore if already exists
}
