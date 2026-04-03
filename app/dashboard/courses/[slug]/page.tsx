// app/dashboard/courses/[slug]/page.tsx
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { Lock, CheckCircle, Play, Clock, Zap, ChevronRight, ArrowLeft } from 'lucide-react';
import { difficultyColor, difficultyBg } from '@/lib/utils';

export default async function CoursePage({ params }: { params: { slug: string } }) {
  const session = await auth();
  const userId = session!.user!.id as string;
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { plan: true } });

  const course = await prisma.course.findUnique({
    where: { slug: params.slug },
    include: {
      modules: {
        orderBy: { order: 'asc' },
        include: {
          lessons: { orderBy: { order: 'asc' } },
          progress: { where: { userId } },
        },
      },
      exams: { select: { id: true, title: true, duration: true, passingScore: true, isPremium: true } },
    },
  });

  if (!course) notFound();

  const isPro = user?.plan === 'PRO';
  const courseLocked = course.isPremium && !isPro;

  // Get all lesson progress
  const lessonProgress = await prisma.userProgress.findMany({
    where: { userId, lessonId: { not: null } },
    select: { lessonId: true, status: true, xpEarned: true },
  });
  const progressMap = new Map(lessonProgress.map(p => [p.lessonId, p]));

  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedLessons = lessonProgress.filter(p => p.status === 'COMPLETED').length;
  const pct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Back */}
      <Link href="/dashboard/courses" className="flex items-center gap-2 text-gray-400 hover:text-white font-mono text-sm transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Courses
      </Link>

      {/* Header */}
      <div className="cyber-card rounded-xl p-8 border border-cyber-border">
        <div className="flex items-start gap-6">
          <span className="text-6xl">{course.icon}</span>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className={`badge ${difficultyColor(course.difficulty)} ${difficultyBg(course.difficulty)}`}>
                {course.difficulty}
              </span>
              {course.isPremium ? (
                <span className="badge bg-cyber-yellow/10 text-cyber-yellow">PRO</span>
              ) : (
                <span className="badge bg-cyber-green/10 text-cyber-green">FREE</span>
              )}
              {pct === 100 && <span className="badge bg-cyber-green/10 text-cyber-green">✓ COMPLETED</span>}
            </div>
            <h1 className="text-3xl font-display font-bold text-white mb-3">{course.title}</h1>
            <p className="text-gray-400 leading-relaxed mb-6">{course.description}</p>

            <div className="flex items-center gap-6 text-sm font-mono text-gray-400 mb-4">
              <span>{course.modules.length} modules</span>
              <span>{totalLessons} lessons</span>
              <span className="text-cyber-green">{course.totalXp} XP total</span>
            </div>

            {/* Progress */}
            <div>
              <div className="flex justify-between text-xs font-mono text-gray-400 mb-1">
                <span>{completedLessons}/{totalLessons} lessons completed</span>
                <span className="text-cyber-green">{pct}%</span>
              </div>
              <div className="progress-bar h-2">
                <div className="progress-fill" style={{ width: `${pct}%` }} />
              </div>
            </div>
          </div>
        </div>

        {courseLocked && (
          <div className="mt-6 p-4 rounded-xl border border-cyber-yellow/30 bg-cyber-yellow/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-cyber-yellow" />
              <div>
                <p className="text-cyber-yellow font-bold text-sm">Premium Course</p>
                <p className="text-gray-400 text-xs font-mono">Upgrade to Pro to unlock all modules</p>
              </div>
            </div>
            <Link href="/dashboard/upgrade" className="btn-cyber-solid text-sm px-5 py-2 rounded-lg">
              Upgrade to Pro
            </Link>
          </div>
        )}
      </div>

      {/* Modules */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white font-display">Course Curriculum</h2>
        {course.modules.map((mod, modIdx) => {
          const modLessons = mod.lessons;
          const modCompleted = modLessons.filter(l => progressMap.get(l.id)?.status === 'COMPLETED').length;
          const modLocked = mod.isPremium && !isPro;

          return (
            <div key={mod.id} className="cyber-card rounded-xl border border-cyber-border overflow-hidden">
              {/* Module header */}
              <div className="flex items-center gap-4 p-5 border-b border-cyber-border bg-black/20">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-sm flex-shrink-0 ${modLocked ? 'bg-gray-700 text-gray-500' : 'bg-cyber-green/10 text-cyber-green border border-cyber-green/30'}`}>
                  {modIdx + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-bold">{mod.title}</h3>
                    {modLocked && <Lock className="w-4 h-4 text-gray-500" />}
                  </div>
                  <p className="text-gray-400 text-sm font-mono">{mod.description}</p>
                </div>
                <div className="text-right text-xs font-mono">
                  <p className="text-gray-400">{modCompleted}/{modLessons.length} done</p>
                  <p className="text-cyber-green">+{mod.xpReward} XP</p>
                </div>
              </div>

              {/* Lessons */}
              <div>
                {modLessons.map((lesson, lIdx) => {
                  const lp = progressMap.get(lesson.id);
                  const done = lp?.status === 'COMPLETED';
                  const lessonLocked = (courseLocked || modLocked) && !done;

                  return (
                    <div key={lesson.id} className={`flex items-center gap-4 p-4 ${lIdx < modLessons.length - 1 ? 'border-b border-cyber-border/50' : ''} ${lessonLocked ? 'opacity-60' : 'hover:bg-white/2'} transition-colors`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${done ? 'bg-cyber-green' : 'border border-cyber-border'}`}>
                        {done ? <CheckCircle className="w-4 h-4 text-black" /> : <span className="text-gray-600 text-xs">{lIdx + 1}</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-bold truncate ${done ? 'text-gray-400' : 'text-white'}`}>{lesson.title}</p>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-gray-600 font-mono text-xs flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {lesson.duration}m
                          </span>
                          <span className="text-gray-600 font-mono text-xs">{lesson.type}</span>
                          <span className="text-cyber-green font-mono text-xs flex items-center gap-1">
                            <Zap className="w-3 h-3" /> {lesson.xpReward} XP
                          </span>
                        </div>
                      </div>
                      {lessonLocked ? (
                        <Lock className="w-4 h-4 text-gray-600 flex-shrink-0" />
                      ) : (
                        <Link
                          href={`/dashboard/courses/${course.slug}/lesson/${lesson.id}`}
                          className={`flex items-center gap-1 text-xs font-mono px-3 py-1.5 rounded transition-all flex-shrink-0 ${done ? 'text-gray-500 hover:text-white border border-cyber-border hover:border-gray-500' : 'btn-cyber'}`}
                        >
                          {done ? 'Review' : <><Play className="w-3 h-3" /> Start</>}
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Exams */}
      {course.exams.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-white font-display mb-4">Exams & Certification</h2>
          {course.exams.map((exam: any) => {
            const locked = exam.isPremium && !isPro;
            return (
              <div key={exam.id} className="cyber-card rounded-xl p-6 border border-cyber-border flex items-center justify-between">
                <div>
                  <h3 className="text-white font-bold mb-1">📝 {exam.title}</h3>
                  <div className="flex gap-4 text-xs font-mono text-gray-400">
                    <span>{exam.duration} minutes</span>
                    <span>Pass: {exam.passingScore}%</span>
                  </div>
                </div>
                {locked ? (
                  <Link href="/dashboard/upgrade" className="btn-cyber text-sm px-4 py-2 rounded-lg">
                    🔒 Unlock
                  </Link>
                ) : pct < 80 ? (
                  <div className="text-gray-500 text-sm font-mono">Complete 80% to unlock</div>
                ) : (
                  <Link href={`/dashboard/exams/${exam.id}`} className="btn-cyber-solid text-sm px-5 py-2 rounded-lg">
                    Take Exam
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
