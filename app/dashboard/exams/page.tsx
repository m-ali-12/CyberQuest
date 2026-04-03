// app/dashboard/exams/page.tsx
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Clock, Award, CheckCircle, Lock, FileCheck } from 'lucide-react';

export default async function ExamsPage() {
  const session = await auth();
  const userId = session!.user!.id as string;
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { plan: true } });

  const exams = await prisma.exam.findMany({
    include: {
      course: { select: { title: true, icon: true, slug: true } },
      attempts: { where: { userId }, orderBy: { completedAt: 'desc' }, take: 1 },
      _count: { select: { questions: true } },
    },
    orderBy: { createdAt: 'asc' },
  });

  const isPro = user?.plan === 'PRO';

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-white mb-2">
          <span className="text-cyber-blue">Exams</span> & Certification
        </h1>
        <p className="text-gray-400 font-mono text-sm">Test your knowledge and earn certifications</p>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {exams.map((exam: any) => {
          const lastAttempt = exam.attempts[0];
          const locked = exam.isPremium && !isPro;

          return (
            <div key={exam.id} className="cyber-card rounded-xl border border-cyber-border overflow-hidden group hover:border-cyber-blue/40 transition-all">
              <div className="p-6">
                {/* Course info */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">{exam.course.icon}</span>
                  <span className="text-gray-400 font-mono text-xs">{exam.course.title}</span>
                  {locked && <Lock className="w-3 h-3 text-gray-500 ml-auto" />}
                </div>

                <h3 className="text-white font-bold text-lg mb-4">{exam.title}</h3>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    { label: 'Questions', value: exam._count.questions },
                    { label: 'Duration', value: `${exam.duration}m` },
                    { label: 'Pass', value: `${exam.passingScore}%` },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-black/20 rounded-lg p-2 text-center border border-cyber-border">
                      <p className="text-white font-bold font-mono text-sm">{value}</p>
                      <p className="text-gray-500 font-mono text-[10px] mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>

                {/* Last attempt */}
                {lastAttempt && (
                  <div className={`flex items-center gap-3 p-3 rounded-lg mb-4 ${lastAttempt.passed ? 'bg-cyber-green/5 border border-cyber-green/20' : 'bg-cyber-red/5 border border-cyber-red/20'}`}>
                    {lastAttempt.passed
                      ? <CheckCircle className="w-4 h-4 text-cyber-green flex-shrink-0" />
                      : <FileCheck className="w-4 h-4 text-cyber-red flex-shrink-0" />
                    }
                    <div className="flex-1">
                      <p className={`text-sm font-bold ${lastAttempt.passed ? 'text-cyber-green' : 'text-cyber-red'}`}>
                        Last score: {lastAttempt.score}% {lastAttempt.passed ? '(Passed)' : '(Failed)'}
                      </p>
                    </div>
                  </div>
                )}

                {/* CTA */}
                {locked ? (
                  <Link href="/dashboard/upgrade" className="w-full btn-cyber py-2.5 rounded-lg text-sm text-center block">
                    🔒 Requires Pro
                  </Link>
                ) : (
                  <Link href={`/dashboard/exams/${exam.id}`}
                    className="w-full btn-cyber-solid py-2.5 rounded-lg text-sm text-center flex items-center justify-center gap-2">
                    <Clock className="w-4 h-4" />
                    {lastAttempt ? (lastAttempt.passed ? 'Retake Exam' : 'Try Again') : 'Start Exam'}
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
