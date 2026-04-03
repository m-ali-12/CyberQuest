// app/dashboard/courses/page.tsx
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Lock, Play, CheckCircle, BookOpen } from 'lucide-react';
import { difficultyColor, difficultyBg } from '@/lib/utils';

export default async function CoursesPage() {
  const session = await auth();
  const userId = session!.user!.id as string;
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { plan: true } });

  const courses = await prisma.course.findMany({
    orderBy: { order: 'asc' },
    include: {
      progress: { where: { userId, lessonId: { not: null }, status: 'COMPLETED' } },
      _count: { select: { modules: true } },
    },
  });

  const lessonCounts = await prisma.lesson.groupBy({
    by: ['moduleId'],
    _count: { id: true },
  });

  // Build total lesson counts per course
  const modulesByCourse = await prisma.module.findMany({ select: { id: true, courseId: true } });
  const lessonCountMap: Record<string, number> = {};
  modulesByCourse.forEach(m => {
    const lc = lessonCounts.find(l => l.moduleId === m.id)?._count?.id || 0;
    lessonCountMap[m.courseId] = (lessonCountMap[m.courseId] || 0) + lc;
  });

  const isPro = user?.plan === 'PRO';

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-white mb-2">Learning <span className="text-cyber-green">Paths</span></h1>
        <p className="text-gray-400 font-mono text-sm">Structured courses from beginner to expert</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {['All', 'Free', 'Beginner', 'Intermediate', 'Advanced'].map(f => (
          <button key={f} className="badge bg-cyber-card border-cyber-border hover:border-cyber-green/40 text-gray-400 hover:text-white transition-all cursor-pointer py-1.5 px-4 text-sm">
            {f}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {courses.map((course: any) => {
          const completedLessons = course.progress.length;
          const totalLessons = lessonCountMap[course.id] || 0;
          const pct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
          const locked = course.isPremium && !isPro;
          const started = completedLessons > 0;

          return (
            <div key={course.id} className={`cyber-card rounded-xl overflow-hidden border ${locked ? 'border-cyber-border opacity-80' : 'border-cyber-border hover:border-cyber-green/40'} transition-all group`}>
              {/* Header */}
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{course.icon}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        {locked && <Lock className="w-4 h-4 text-gray-500" />}
                        {pct === 100 && <CheckCircle className="w-4 h-4 text-cyber-green" />}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`badge ${difficultyColor(course.difficulty)} ${difficultyBg(course.difficulty)}`}>
                      {course.difficulty}
                    </span>
                    {course.isPremium ? (
                      <span className="badge bg-cyber-yellow/10 text-cyber-yellow text-[10px]">PRO</span>
                    ) : (
                      <span className="badge bg-cyber-green/10 text-cyber-green text-[10px]">FREE</span>
                    )}
                  </div>
                </div>

                <h3 className="text-white font-bold text-lg mb-2 group-hover:text-cyber-green transition-colors">
                  {course.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">{course.description}</p>
              </div>

              {/* Stats */}
              <div className="px-6 pb-4">
                <div className="flex items-center gap-4 text-xs font-mono text-gray-500 mb-3">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3 h-3" /> {course._count.modules} modules
                  </span>
                  <span>{totalLessons} lessons</span>
                  <span>{course.totalXp} XP</span>
                </div>

                {/* Progress bar */}
                {started && (
                  <div>
                    <div className="flex justify-between text-xs font-mono text-gray-500 mb-1">
                      <span>Progress</span>
                      <span className="text-cyber-green">{pct}%</span>
                    </div>
                    <div className="progress-bar h-1.5">
                      <div className="progress-fill" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )}
              </div>

              {/* CTA */}
              <div className="px-6 pb-6">
                {locked ? (
                  <Link href="/dashboard/upgrade" className="w-full btn-cyber text-center text-sm py-2.5 rounded-lg block">
                    🔒 Unlock with Pro
                  </Link>
                ) : pct === 100 ? (
                  <Link href={`/dashboard/courses/${course.slug}`} className="w-full py-2.5 rounded-lg text-sm font-mono font-bold bg-cyber-green/10 text-cyber-green border border-cyber-green/30 text-center flex items-center justify-center gap-2 hover:bg-cyber-green/20 transition-colors">
                    <CheckCircle className="w-4 h-4" /> Review Course
                  </Link>
                ) : (
                  <Link href={`/dashboard/courses/${course.slug}`} className="w-full btn-cyber-solid text-center text-sm py-2.5 rounded-lg block flex items-center justify-center gap-2">
                    <Play className="w-4 h-4" /> {started ? 'Continue' : 'Start Course'}
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
