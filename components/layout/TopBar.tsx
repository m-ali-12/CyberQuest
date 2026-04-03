'use client';
import { useState, useEffect } from 'react';
import { Bell, Flame, Zap, Star } from 'lucide-react';
import { xpProgress } from '@/lib/utils';

interface Props {
  user: { name?: string | null; xp?: number; level?: number; streak?: number; plan?: string };
}

export default function TopBar({ user }: Props) {
  const [userData, setUserData] = useState({
    xp: user.xp || 0,
    level: user.level || 1,
    streak: user.streak || 0,
  });

  useEffect(() => {
    fetch('/api/users/me').then(r => r.json()).then(d => {
      if (d.xp !== undefined) setUserData({ xp: d.xp, level: d.level, streak: d.streak });
    }).catch(() => {});
  }, []);

  const prog = xpProgress(userData.xp);

  return (
    <header className="bg-cyber-card border-b border-cyber-border px-6 py-3 flex items-center justify-between gap-4 flex-shrink-0">
      {/* XP Bar */}
      <div className="flex items-center gap-4 flex-1 max-w-sm">
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-7 h-7 bg-cyber-green/10 border border-cyber-green/30 rounded-lg flex items-center justify-center">
            <Star className="w-4 h-4 text-cyber-green" />
          </div>
          <span className="text-white font-display font-bold text-sm">Lv.{prog.level}</span>
        </div>
        <div className="flex-1">
          <div className="flex justify-between text-xs font-mono text-gray-500 mb-1">
            <span>{userData.xp.toLocaleString()} XP</span>
            <span>{prog.current}/{prog.needed}</span>
          </div>
          <div className="progress-bar h-2">
            <div className="progress-fill" style={{ width: `${prog.percent}%` }} />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4">
        {/* Streak */}
        <div className="flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/20 rounded-lg px-3 py-1.5">
          <Flame className="w-4 h-4 text-orange-400" />
          <span className="text-orange-400 font-bold font-mono text-sm">{userData.streak}</span>
          <span className="text-gray-500 font-mono text-xs">day streak</span>
        </div>

        {/* XP badge */}
        <div className="flex items-center gap-1.5 bg-cyber-green/10 border border-cyber-green/20 rounded-lg px-3 py-1.5">
          <Zap className="w-4 h-4 text-cyber-green" />
          <span className="text-cyber-green font-bold font-mono text-sm">{userData.xp.toLocaleString()}</span>
          <span className="text-gray-500 font-mono text-xs">XP</span>
        </div>

        {/* Pro badge */}
        {user.plan === 'PRO' && (
          <div className="bg-cyber-yellow/10 border border-cyber-yellow/30 rounded-lg px-3 py-1.5">
            <span className="text-cyber-yellow font-bold font-mono text-xs">⚡ PRO</span>
          </div>
        )}

        {/* Notifications */}
        <button className="relative w-9 h-9 rounded-lg bg-white/5 border border-cyber-border flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-500 transition-all">
          <Bell className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-cyber-red rounded-full text-white text-[10px] font-bold flex items-center justify-center">3</span>
        </button>
      </div>
    </header>
  );
}
