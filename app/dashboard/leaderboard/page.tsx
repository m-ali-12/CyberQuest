// app/dashboard/leaderboard/page.tsx
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Trophy, Crown } from 'lucide-react';
import { xpProgress } from '@/lib/utils';

export default async function LeaderboardPage() {
  const session = await auth();
  const userId = session!.user!.id as string;

  const [topUsers, currentUser] = await Promise.all([
    prisma.user.findMany({
      orderBy: { xp: 'desc' },
      take: 50,
      select: { id: true, name: true, xp: true, level: true, plan: true, createdAt: true },
    }),
    prisma.user.findUnique({
      where: { id: userId },
      select: { xp: true, level: true },
    }),
  ]);

  const myRank = topUsers.findIndex(u => u.id === userId) + 1;

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-white mb-2">
          <span className="text-cyber-yellow">Leaderboard</span>
        </h1>
        <p className="text-gray-400 font-mono text-sm">Top hackers ranked by XP</p>
      </div>

      {/* My rank */}
      {myRank > 0 && (
        <div className="cyber-card rounded-xl p-5 border border-cyber-yellow/20 bg-cyber-yellow/5 flex items-center gap-4">
          <div className="w-10 h-10 bg-cyber-yellow/10 rounded-lg flex items-center justify-center">
            <Trophy className="w-5 h-5 text-cyber-yellow" />
          </div>
          <div className="flex-1">
            <p className="text-white font-bold">Your Ranking</p>
            <p className="text-gray-400 font-mono text-sm">Keep grinding to climb the leaderboard!</p>
          </div>
          <div className="text-right">
            <p className="text-cyber-yellow font-display font-bold text-2xl">#{myRank}</p>
            <p className="text-gray-400 font-mono text-sm">{currentUser?.xp?.toLocaleString()} XP</p>
          </div>
        </div>
      )}

      {/* Top 3 podium */}
      <div className="grid grid-cols-3 gap-4">
        {[topUsers[1], topUsers[0], topUsers[2]].map((u, i) => {
          if (!u) return <div key={i} />;
          const positions = [2, 1, 3];
          const pos = positions[i];
          const heights = ['h-28', 'h-36', 'h-24'];
          const colors = ['border-gray-400/30 bg-gray-400/5', 'border-cyber-yellow/40 bg-cyber-yellow/10', 'border-orange-600/30 bg-orange-600/5'];

          return (
            <div key={u.id} className={`cyber-card rounded-xl border ${colors[i]} flex flex-col items-center justify-end pb-5 pt-4 ${heights[i]} relative`}>
              {pos === 1 && <Crown className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 text-cyber-yellow" />}
              <p className="text-2xl mb-1">{medals[pos - 1]}</p>
              <p className="text-white font-bold text-sm text-center truncate w-full px-2">{u.name}</p>
              <p className="text-gray-400 font-mono text-xs">{u.xp.toLocaleString()} XP</p>
              <p className="text-gray-500 font-mono text-xs">Lv.{u.level}</p>
            </div>
          );
        })}
      </div>

      {/* Full list */}
      <div className="cyber-card rounded-xl border border-cyber-border overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-cyber-border bg-black/20">
          <div className="col-span-1 text-xs font-mono text-gray-500 uppercase">#</div>
          <div className="col-span-5 text-xs font-mono text-gray-500 uppercase">Hacker</div>
          <div className="col-span-2 text-xs font-mono text-gray-500 uppercase">Level</div>
          <div className="col-span-2 text-xs font-mono text-gray-500 uppercase">XP</div>
          <div className="col-span-2 text-xs font-mono text-gray-500 uppercase">Plan</div>
        </div>
        {topUsers.map((u, i) => {
          const isMe = u.id === userId;
          return (
            <div key={u.id} className={`grid grid-cols-12 gap-4 px-5 py-4 ${i < topUsers.length - 1 ? 'border-b border-cyber-border/50' : ''} ${isMe ? 'bg-cyber-green/5 border-l-2 border-l-cyber-green' : ''} transition-colors hover:bg-white/2`}>
              <div className="col-span-1 flex items-center">
                <span className={`font-mono font-bold text-sm ${i === 0 ? 'text-cyber-yellow' : i === 1 ? 'text-gray-400' : i === 2 ? 'text-orange-500' : 'text-gray-600'}`}>
                  {i < 3 ? medals[i] : `#${i + 1}`}
                </span>
              </div>
              <div className="col-span-5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyber-green/30 to-cyber-blue/30 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {u.name?.[0]?.toUpperCase() || '?'}
                </div>
                <div className="min-w-0">
                  <p className={`text-sm font-bold truncate ${isMe ? 'text-cyber-green' : 'text-white'}`}>
                    {u.name} {isMe && '(You)'}
                  </p>
                </div>
              </div>
              <div className="col-span-2 flex items-center">
                <span className="text-white font-mono text-sm">Lv.{u.level}</span>
              </div>
              <div className="col-span-2 flex items-center">
                <span className="text-cyber-green font-mono text-sm font-bold">{u.xp.toLocaleString()}</span>
              </div>
              <div className="col-span-2 flex items-center">
                {u.plan === 'PRO' ? (
                  <span className="badge bg-cyber-yellow/10 text-cyber-yellow border border-cyber-yellow/20 text-[10px]">⚡ PRO</span>
                ) : (
                  <span className="text-gray-600 font-mono text-xs">Free</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
