'use client';
import { useState } from 'react';
import { Users, BookOpen, Terminal, Award, Ban, CheckCircle, Clock, Search, Crown, DollarSign, Zap, TrendingUp, Bot } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface Props {
  stats: { totalUsers: number; proUsers: number; totalChallenges: number; totalCourses: number; bannedUsers: number; examAttempts: number; challengeAttempts: number; revenue: number };
  recentUsers: any[];
}

export default function AdminOverviewClient({ stats, recentUsers }: Props) {
  const [users, setUsers] = useState(recentUsers);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState<string | null>(null);

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleBan = async (userId: string, action: 'ban' | 'unban') => {
    setLoading(userId + action);
    try {
      const res = await fetch(`/api/admin/users/${userId}/${action}`, { method: 'POST' });
      if (res.ok) {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, isBanned: action === 'ban' } : u));
        toast.success(`User ${action === 'ban' ? 'banned' : 'unbanned'} ✅`);
      }
    } catch { toast.error('Action failed'); }
    finally { setLoading(null); }
  };

  const handlePlan = async (userId: string, plan: string) => {
    setLoading(userId + 'plan');
    try {
      const newPlan = plan === 'PRO' ? 'FREE' : 'PRO';
      const res = await fetch(`/api/admin/users/${userId}/plan`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: newPlan }),
      });
      if (res.ok) {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, plan: newPlan } : u));
        toast.success(`Plan → ${newPlan}`);
      }
    } catch { toast.error('Failed'); }
    finally { setLoading(null); }
  };

  const handleRoleToggle = async (userId: string, role: string) => {
    setLoading(userId + 'role');
    try {
      const newRole = role === 'ADMIN' ? 'USER' : 'ADMIN';
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
        toast.success(`Role → ${newRole}`);
      }
    } catch { toast.error('Failed'); }
    finally { setLoading(null); }
  };

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'blue', href: '/admin/users' },
    { label: 'Pro Users', value: stats.proUsers, icon: Crown, color: 'yellow', href: '/admin/users' },
    { label: 'Monthly Revenue', value: `$${stats.revenue}`, icon: DollarSign, color: 'green', href: '/admin/pricing' },
    { label: 'Challenges', value: stats.totalChallenges, icon: Terminal, color: 'green', href: '/admin/challenges' },
    { label: 'Courses', value: stats.totalCourses, icon: BookOpen, color: 'purple', href: '/admin/courses' },
    { label: 'Banned Users', value: stats.bannedUsers, icon: Ban, color: 'red', href: '/admin/users' },
    { label: 'Exam Attempts', value: stats.examAttempts, icon: Award, color: 'orange', href: '/admin/courses' },
    { label: 'Challenges Solved', value: stats.challengeAttempts, icon: Zap, color: 'cyan', href: '/admin/challenges' },
  ];

  const colorMap: Record<string, string> = {
    blue: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    yellow: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    green: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    purple: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
    red: 'text-red-400 bg-red-400/10 border-red-400/20',
    orange: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
    cyan: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Admin <span className="text-red-400">Panel</span></h1>
          <p className="text-gray-400 font-mono text-sm">Platform overview & management</p>
        </div>
        <Link href="/admin/ai-assistant"
          className="flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 text-purple-300 px-4 py-2.5 rounded-xl font-mono text-sm hover:border-purple-400/50 transition-all">
          <Bot className="w-4 h-4" /> AI Assistant
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color, href }) => (
          <Link key={label} href={href}
            className={`rounded-xl p-5 border cursor-pointer hover:scale-105 transition-transform ${colorMap[color]}`}>
            <Icon className={`w-5 h-5 mb-3`} />
            <p className="text-2xl font-bold text-white mb-1">{value}</p>
            <p className="text-xs font-mono opacity-70">{label}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { href: '/admin/users', label: 'Manage Users', icon: Users, color: 'bg-blue-500/10 border-blue-500/20 text-blue-400 hover:border-blue-400/40' },
          { href: '/admin/courses', label: 'Manage Courses', icon: BookOpen, color: 'bg-purple-500/10 border-purple-500/20 text-purple-400 hover:border-purple-400/40' },
          { href: '/admin/challenges', label: 'Manage Challenges', icon: Terminal, color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:border-emerald-400/40' },
          { href: '/admin/pricing', label: 'Pricing & Plans', icon: DollarSign, color: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400 hover:border-yellow-400/40' },
        ].map(({ href, label, icon: Icon, color }) => (
          <Link key={href} href={href}
            className={`flex items-center gap-3 p-4 rounded-xl border font-mono text-sm transition-all ${color}`}>
            <Icon className="w-5 h-5" /> {label}
          </Link>
        ))}
      </div>

      {/* User Management Table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">User Management</h2>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search users..."
                className="bg-[#0f0f18] border border-gray-700 rounded-xl pl-9 pr-4 py-2 text-white text-sm font-mono focus:outline-none focus:border-red-500/50 placeholder-gray-600 w-64" />
            </div>
            <Link href="/admin/users" className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-mono hover:border-red-400/40 transition-all">
              View All →
            </Link>
          </div>
        </div>

        <div className="rounded-xl border border-gray-800 overflow-hidden bg-[#0f0f18]">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800 bg-black/20">
                  {['User', 'Email', 'Level', 'XP', 'Plan', 'Role', 'Logins', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-mono text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => {
                  const isBanned = user.isBanned && user.banUntil && new Date(user.banUntil) > new Date();
                  const isLoading = loading?.startsWith(user.id);
                  return (
                    <tr key={user.id} className={`border-b border-gray-800/50 hover:bg-white/2 transition-colors ${isBanned ? 'opacity-50' : ''}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center text-white text-xs font-bold">
                            {user.name?.[0]?.toUpperCase()}
                          </div>
                          <span className="text-white text-sm font-bold whitespace-nowrap">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-400 font-mono text-xs whitespace-nowrap">{user.email}</td>
                      <td className="px-4 py-3 text-white font-mono text-sm">Lv.{user.level}</td>
                      <td className="px-4 py-3 text-emerald-400 font-mono text-sm font-bold">{user.xp?.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => handlePlan(user.id, user.plan)} disabled={isLoading}
                          className={`px-2 py-1 rounded-lg text-xs font-mono font-bold border transition-all hover:scale-105 ${user.plan === 'PRO' ? 'bg-yellow-400/10 text-yellow-400 border-yellow-400/30 hover:bg-yellow-400/20' : 'bg-gray-500/10 text-gray-400 border-gray-500/30 hover:bg-gray-500/20'}`}>
                          {user.plan}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => handleRoleToggle(user.id, user.role)} disabled={isLoading}
                          className={`px-2 py-1 rounded-lg text-xs font-mono border transition-all ${user.role === 'ADMIN' ? 'bg-red-400/10 text-red-400 border-red-400/30' : 'bg-gray-500/10 text-gray-400 border-gray-500/30'}`}>
                          {user.role}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-gray-400 font-mono text-xs">{user.loginCount || 0}</td>
                      <td className="px-4 py-3">
                        {isBanned
                          ? <span className="flex items-center gap-1 text-red-400 font-mono text-xs"><Clock className="w-3 h-3" /> Banned</span>
                          : <span className="flex items-center gap-1 text-emerald-400 font-mono text-xs"><CheckCircle className="w-3 h-3" /> Active</span>
                        }
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => handleBan(user.id, isBanned ? 'unban' : 'ban')} disabled={isLoading}
                          className={`text-xs font-mono px-3 py-1.5 rounded-lg border transition-all whitespace-nowrap ${isBanned ? 'border-emerald-400/30 text-emerald-400 hover:bg-emerald-400/10' : 'border-red-400/30 text-red-400 hover:bg-red-400/10'}`}>
                          {isLoading ? '...' : isBanned ? '✓ Unban' : '⛔ Ban'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
