'use client';
import Link from 'next/link';
import { xpProgress, difficultyColor, difficultyBg } from '@/lib/utils';
import { Trophy, Terminal, Award, BookOpen, Flame, TrendingUp, ChevronRight, Lock, Play } from 'lucide-react';

interface Props {
  user: any;
  recentProgress: any[];
  totalChallenges: number;
  solvedChallenges: number;
  certs: number;
  leaderboard: any[];
  courses: any[];
}

export default function DashboardClient({ user, recentProgress, totalChallenges, solvedChallenges, certs, leaderboard, courses }: Props) {
  const prog = xpProgress(user?.xp || 0);

  const stats = [
    { label: 'Total XP', value: (user?.xp || 0).toLocaleString(), icon: '⚡', color: 'cyber-green' },
    { label: 'Challenges Solved', value: `${solvedChallenges}/${totalChallenges}`, icon: '🔓', color: 'cyber-blue' },
    { label: 'Certifications', value: certs, icon: '🎓', color: 'cyber-yellow' },
    { label: 'Day Streak', value: user?.streak || 0, icon: '🔥', color: 'orange-400' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-1">
            Welcome back, <span className="text-cyber-green">{user?.name?.split(' ')[0] || 'Hacker'}</span> 👾
          </h1>
          <p className="text-gray-400 font-mono text-sm">Continue your journey — every line of code counts.</p>
        </div>
        {user?.plan === 'FREE' && (
          <Link href="/dashboard/upgrade" className="btn-cyber-solid px-5 py-2 rounded-lg text-sm flex items-center gap-2">
            ⚡ Upgrade to Pro
          </Link>
        )}
      </div>

      {/* XP Progress */}
      <div className="cyber-card rounded-xl p-6 border border-cyber-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-gray-400 font-mono text-xs uppercase tracking-wider mb-1">Level Progress</p>
            <p className="text-white font-display font-bold text-2xl">Level {prog.level}</p>
          </div>
          <div className="text-right">
            <p className="text-cyber-green font-mono font-bold text-lg">{user?.xp?.toLocaleString()} XP</p>
            <p className="text-gray-500 font-mono text-xs">{prog.current}/{prog.needed} to Level {prog.level + 1}</p>
          </div>
        </div>
        <div className="progress-bar h-3">
          <div className="progress-fill" style={{ width: `${prog.percent}%` }} />
        </div>
        <p className="text-gray-500 font-mono text-xs mt-2">{prog.percent}% complete</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon, color }) => (
          <div key={label} className="cyber-card rounded-xl p-5 border border-cyber-border">
            <div className="text-2xl mb-3">{icon}</div>
            <div className={`text-2xl font-display font-bold text-${color} mb-1`}>{value}</div>
            <div className="text-gray-500 font-mono text-xs">{label}</div>
          </div>
        ))}
      </div>

      {/* Courses + Leaderboard */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Courses */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-bold text-lg flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-cyber-green" /> Learning Paths
            </h2>
            <Link href="/dashboard/courses" className="text-cyber-green text-sm font-mono hover:underline flex items-center gap-1">
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {courses.slice(0, 5).map((course: any) => {
              const completed = course.progress?.filter((p: any) => p.status === 'COMPLETED').length || 0;
              const total = course._count?.modules || 1;
              const pct = Math.round((completed / total) * 100);
              const locked = course.isPremium && user?.plan !== 'PRO';

              return (
                <div key={course.id} className={`cyber-card rounded-xl p-4 flex items-center gap-4 ${locked ? 'opacity-60' : 'hover:border-cyber-green/30'} transition-all`}>
                  <div className="text-3xl">{course.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-white font-bold text-sm truncate">{course.title}</p>
                      {locked && <Lock className="w-3 h-3 text-gray-500 flex-shrink-0" />}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`badge text-xs ${difficultyColor(course.difficulty)} ${difficultyBg(course.difficulty)}`}>
                        {course.difficulty}
                      </span>
                      <span className="text-gray-500 font-mono text-xs">{completed}/{total} modules</span>
                    </div>
                    <div className="progress-bar h-1.5 mt-2">
                      <div className="progress-fill" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  {locked ? (
                    <Link href="/dashboard/upgrade" className="btn-cyber text-xs px-3 py-1.5 rounded flex-shrink-0">Unlock</Link>
                  ) : (
                    <Link href={`/dashboard/courses/${course.slug}`} className="btn-cyber text-xs px-3 py-1.5 rounded flex-shrink-0 flex items-center gap-1">
                      <Play className="w-3 h-3" /> Go
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Leaderboard */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-bold text-lg flex items-center gap-2">
              <Trophy className="w-5 h-5 text-cyber-yellow" /> Top Hackers
            </h2>
            <Link href="/dashboard/leaderboard" className="text-cyber-green text-sm font-mono hover:underline flex items-center gap-1">
              Full <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="cyber-card rounded-xl overflow-hidden border border-cyber-border">
            {leaderboard.map((u: any, i: number) => (
              <div key={u.id} className={`flex items-center gap-3 p-3 ${i < leaderboard.length - 1 ? 'border-b border-cyber-border' : ''}`}>
                <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold font-mono flex-shrink-0 ${
                  i === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                  i === 1 ? 'bg-gray-400/20 text-gray-300' :
                  i === 2 ? 'bg-orange-600/20 text-orange-400' : 'text-gray-500'
                }`}>
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-bold truncate">{u.name}</p>
                  <p className="text-gray-500 font-mono text-xs">Lv.{u.level}</p>
                </div>
                <span className="text-cyber-green font-mono text-sm font-bold">{u.xp.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      {recentProgress.length > 0 && (
        <div>
          <h2 className="text-white font-bold text-lg flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-cyber-blue" /> Recent Activity
          </h2>
          <div className="cyber-card rounded-xl border border-cyber-border overflow-hidden">
            {recentProgress.map((p: any, i: number) => (
              <div key={p.id} className={`flex items-center gap-4 p-4 ${i < recentProgress.length - 1 ? 'border-b border-cyber-border' : ''}`}>
                <div className="text-2xl">{p.course?.icon || '📚'}</div>
                <div className="flex-1">
                  <p className="text-white text-sm font-bold">{p.lesson?.title || 'Lesson completed'}</p>
                  <p className="text-gray-500 font-mono text-xs">{p.course?.title}</p>
                </div>
                <div className="text-right">
                  <span className="text-cyber-green font-mono text-sm">+{p.xpEarned} XP</span>
                  <p className="text-gray-600 font-mono text-xs">
                    {p.completedAt ? new Date(p.completedAt).toLocaleDateString() : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { href: '/dashboard/challenges', icon: Terminal, label: 'Start a Challenge', desc: 'Test your skills', color: 'cyber-green' },
          { href: '/dashboard/exams', icon: Award, label: 'Take an Exam', desc: 'Earn certifications', color: 'cyber-blue' },
          { href: '/dashboard/roadmap', icon: TrendingUp, label: 'View Roadmap', desc: 'Plan your path', color: 'cyber-yellow' },
        ].map(({ href, icon: Icon, label, desc, color }) => (
          <Link key={href} href={href} className={`cyber-card rounded-xl p-5 border border-${color}/20 hover:border-${color}/50 hover:bg-${color}/5 transition-all flex items-center gap-4`}>
            <div className={`w-10 h-10 bg-${color}/10 rounded-lg flex items-center justify-center`}>
              <Icon className={`w-5 h-5 text-${color}`} />
            </div>
            <div>
              <p className="text-white font-bold text-sm">{label}</p>
              <p className="text-gray-500 font-mono text-xs">{desc}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-600 ml-auto" />
          </Link>
        ))}
      </div>
    </div>
  );
}
