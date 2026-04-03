'use client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { xpProgress } from '@/lib/utils';
import { BookOpen, Terminal, Award, Flame, Zap, Trophy } from 'lucide-react';

interface Props {
  user: any;
  weeklyXp: { day: string; xp: number }[];
  stats: { solvedChallenges: number; totalAttempts: number; passedExams: number; totalExams: number; avgExamScore: number; lessonsCompleted: number };
  achievements: any[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-cyber-card border border-cyber-border rounded-lg p-3 font-mono text-sm">
        <p className="text-gray-400">{label}</p>
        <p className="text-cyber-green font-bold">+{payload[0].value} XP</p>
      </div>
    );
  }
  return null;
};

export default function StatsClient({ user, weeklyXp, stats, achievements }: Props) {
  const prog = xpProgress(user?.xp || 0);
  const accuracy = stats.totalAttempts > 0 ? Math.round((stats.solvedChallenges / stats.totalAttempts) * 100) : 0;

  const statCards = [
    { label: 'Lessons Done', value: stats.lessonsCompleted, icon: BookOpen, color: 'cyber-blue' },
    { label: 'Challenges', value: `${stats.solvedChallenges}/${stats.totalAttempts}`, icon: Terminal, color: 'cyber-green' },
    { label: 'Exams Passed', value: `${stats.passedExams}/${stats.totalExams}`, icon: Award, color: 'cyber-yellow' },
    { label: 'Avg Exam Score', value: `${stats.avgExamScore}%`, icon: Trophy, color: 'orange-400' },
    { label: 'Day Streak', value: user?.streak || 0, icon: Flame, color: 'orange-400' },
    { label: 'Total XP', value: (user?.xp || 0).toLocaleString(), icon: Zap, color: 'cyber-green' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-white mb-2">My <span className="text-cyber-blue">Stats</span></h1>
        <p className="text-gray-400 font-mono text-sm">Your learning journey analytics</p>
      </div>

      {/* Level card */}
      <div className="cyber-card rounded-xl p-6 border border-cyber-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-gray-400 font-mono text-xs uppercase tracking-wider mb-1">Current Level</p>
            <p className="text-4xl font-display font-black text-white">Level <span className="text-cyber-green">{prog.level}</span></p>
          </div>
          <div className="text-right">
            <p className="text-cyber-green font-mono font-bold text-xl">{(user?.xp || 0).toLocaleString()} XP</p>
            <p className="text-gray-500 font-mono text-sm">{prog.current} / {prog.needed} to next</p>
          </div>
        </div>
        <div className="progress-bar h-4 rounded-xl">
          <div className="progress-fill rounded-xl" style={{ width: `${prog.percent}%` }} />
        </div>
        <p className="text-gray-500 font-mono text-xs mt-2">{prog.percent}% progress to Level {prog.level + 1}</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="cyber-card rounded-xl p-4 border border-cyber-border text-center">
            <Icon className={`w-5 h-5 text-${color} mx-auto mb-2`} />
            <p className={`text-lg font-display font-bold text-${color}`}>{value}</p>
            <p className="text-gray-500 font-mono text-[10px] mt-1 leading-tight">{label}</p>
          </div>
        ))}
      </div>

      {/* Weekly XP chart */}
      <div className="cyber-card rounded-xl border border-cyber-border p-6">
        <h2 className="text-white font-bold text-lg mb-6">XP Earned — Last 7 Days</h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={weeklyXp} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,45,74,0.8)" vertical={false} />
            <XAxis dataKey="day" tick={{ fill: '#6b7280', fontFamily: 'JetBrains Mono', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#6b7280', fontFamily: 'JetBrains Mono', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,255,136,0.05)' }} />
            <Bar dataKey="xp" fill="url(#xpGrad)" radius={[4, 4, 0, 0]} />
            <defs>
              <linearGradient id="xpGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00ff88" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#00d4ff" stopOpacity={0.5} />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Challenge accuracy */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="cyber-card rounded-xl border border-cyber-border p-6">
          <h2 className="text-white font-bold mb-4">Challenge Accuracy</h2>
          <div className="flex items-end gap-4">
            <div className="text-5xl font-display font-black text-cyber-green">{accuracy}%</div>
            <p className="text-gray-400 font-mono text-sm pb-1">{stats.solvedChallenges} solved out of {stats.totalAttempts} attempts</p>
          </div>
          <div className="progress-bar h-3 mt-4">
            <div className="progress-fill" style={{ width: `${accuracy}%` }} />
          </div>
        </div>

        <div className="cyber-card rounded-xl border border-cyber-border p-6">
          <h2 className="text-white font-bold mb-4">Exam Performance</h2>
          <div className="flex items-end gap-4">
            <div className="text-5xl font-display font-black text-cyber-yellow">{stats.avgExamScore}%</div>
            <p className="text-gray-400 font-mono text-sm pb-1">avg score across {stats.totalExams} exams</p>
          </div>
          <div className="progress-bar h-3 mt-4">
            <div className="progress-fill" style={{ width: `${stats.avgExamScore}%`, background: 'linear-gradient(90deg, #fbbf24, #f59e0b)' }} />
          </div>
        </div>
      </div>

      {/* Achievements */}
      {achievements.length > 0 && (
        <div>
          <h2 className="text-white font-bold text-lg mb-4">Achievements Earned ({achievements.length})</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((ua: any) => (
              <div key={ua.id} className="cyber-card rounded-xl p-4 border border-cyber-border flex items-center gap-4">
                <div className="text-3xl">{ua.achievement.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-sm">{ua.achievement.title}</p>
                  <p className="text-gray-400 font-mono text-xs">{ua.achievement.description}</p>
                  <p className="text-cyber-green font-mono text-xs mt-0.5">+{ua.achievement.xpReward} XP</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
