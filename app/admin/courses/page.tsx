// app/admin/courses/page.tsx
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import AdminCoursesClient from './AdminCoursesClient';

export default async function AdminCoursesPage() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'ADMIN') redirect('/dashboard');

  const courses = await prisma.course.findMany({
    orderBy: { order: 'asc' },
    include: {
      _count: { select: { modules: true } },
    },
  });

  const modulesWithLessons = await prisma.module.findMany({
    include: { _count: { select: { lessons: true } } },
  });

  const lessonCounts: Record<string, number> = {};
  modulesWithLessons.forEach(m => {
    lessonCounts[m.courseId] = (lessonCounts[m.courseId] || 0) + m._count.lessons;
  });

  const enrollments = await prisma.userProgress.groupBy({
    by: ['courseId'], where: { courseId: { not: null } }, _count: { userId: true },
  });
  const enrollMap: Record<string, number> = {};
  enrollments.forEach(e => { if (e.courseId) enrollMap[e.courseId] = e._count.userId; });

  return (
    <AdminCoursesClient
      courses={courses.map(c => ({ ...c, lessonCount: lessonCounts[c.id] || 0, enrollments: enrollMap[c.id] || 0 })) as any}
    />
  );
}
