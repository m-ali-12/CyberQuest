'use client';
import { useState } from 'react';
import { Users, Search, Ban, CheckCircle, Clock, Crown, Shield, Filter, Download, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminUsersClient({ users: initialUsers }: { users: any[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState('');
  const [filterPlan, setFilterPlan] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [loading, setLoading] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);

  const filtered = users.filter(u => {
    const matchSearch = u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase());
    const matchPlan = filterPlan === 'ALL' || u.plan === filterPlan;
    const isBanned = u.isBanned && u.banUntil && new Date(u.banUntil) > new Date();
    const matchStatus = filterStatus === 'ALL' || (filterStatus === 'BANNED' ? isBanned : !isBanned);
    return matchSearch && matchPlan && matchStatus;
  });

  const apiCall = async (userId: string, endpoint: string, body?: any) => {
    setLoading(userId + endpoint);
    try {
      const res = await fetch(`/api/admin/users/${userId}/${endpoint}`, {
        method: 'POST',
        headers: body ? { 'Content-Type': 'application/json' } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });
      return res.ok;
    } catch { return false; }
    finally { setLoading(null); }
  };

  const handleBan = async (userId: string, banned: boolean) => {
    const ok = await apiCall(userId, banned ? 'unban' : 'ban');
    if (ok) { setUsers(p => p.map(u => u.id === userId ? { ...u, isBanned: !banned } : u)); toast.success(banned ? 'User unbanned' : 'User banned'); }
  };

  const handlePlan = async (userId: string, plan: string) => {
    const newPlan = plan === 'PRO' ? 'FREE' : 'PRO';
    const ok = await apiCall(userId, 'plan', { plan: newPlan });
    if (ok) { setUsers(p => p.map(u => u.id === userId ? { ...u, plan: newPlan } : u)); toast.success(`Plan updated to ${newPlan}`); }
  };

  const handleRole = async (userId: string, role: string) => {
    const newRole = role === 'ADMIN' ? 'USER' : 'ADMIN';
    const ok = await apiCall(userId, 'role', { role: newRole });
    if (ok) { setUsers(p => p.map(u => u.id === userId ? { ...u, role: newRole } : u)); toast.success(`Role → ${newRole}`); }
  };

  const handleResetXP = async (userId: string) => {
    const ok = await apiCall(userId, 'reset-xp');
    if (ok) { setUsers(p => p.map(u => u.id === userId ? { ...u, xp: 0, level: 1 } : u)); toast.success('XP reset'); }
  };

  const handleBulkPro = async () => {
    for (const id of selected) {
      await fetch(`/api/admin/users/${id}/plan`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ plan: 'PRO' }) });
    }
    setUsers(p => p.map(u => selected.includes(u.id) ? { ...u, plan: 'PRO' } : u));
    setSelected([]);
    toast.success(`${selected.length} users upgraded to Pro!`);
  };

  const proCount = users.filter(u => u.plan === 'PRO').length;
  const bannedCount = users.filter(u => u.isBanned).length;

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">User <span className="text-blue-400">Management</span></h1>
          <p className="text-gray-400 font-mono text-sm">{users.length} total users · {proCount} pro · {bannedCount} banned</p>
        </div>
        <div className="flex gap-3">
          {selected.length > 0 && (
            <button onClick={handleBulkPro} className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 px-4 py-2 rounded-xl text-sm font-mono hover:border-yellow-400/50 transition-all">
              <Crown className="w-4 h-4" /> Upgrade {selected.length} to Pro
            </button>
          )}
          <button onClick={() => {
            const csv = [['Name','Email','Plan','Level','XP','Logins'], ...users.map(u => [u.name,u.email,u.plan,u.level,u.xp,u.loginCount])].map(r=>r.join(',')).join('\n');
            const a = document.createElement('a'); a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv); a.download = 'users.csv'; a.click();
          }} className="flex items-center gap-2 bg-gray-500/10 border border-gray-500/30 text-gray-400 px-4 py-2 rounded-xl text-sm font-mono hover:border-gray-400/50 transition-all">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..."
            className="w-full bg-[#0f0f18] border border-gray-700 rounded-xl pl-9 pr-4 py-2.5 text-white text-sm font-mono focus:outline-none focus:border-blue-500/50 placeholder-gray-600" />
        </div>
        <select value={filterPlan} onChange={e => setFilterPlan(e.target.value)}
          className="bg-[#0f0f18] border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm font-mono focus:outline-none focus:border-blue-500/50">
          <option value="ALL">All Plans</option>
          <option value="FREE">Free</option>
          <option value="PRO">Pro</option>
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="bg-[#0f0f18] border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm font-mono focus:outline-none focus:border-blue-500/50">
          <option value="ALL">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="BANNED">Banned</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-800 overflow-hidden bg-[#0f0f18]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800 bg-black/30">
                <th className="px-4 py-3 text-left">
                  <input type="checkbox" onChange={e => setSelected(e.target.checked ? users.map(u => u.id) : [])} className="rounded" />
                </th>
                {['User', 'Email', 'Level/XP', 'Streak', 'Plan', 'Role', 'Certs', 'Logins', 'Joined', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-mono text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => {
                const isBanned = user.isBanned && user.banUntil && new Date(user.banUntil) > new Date();
                const isLoading = loading?.startsWith(user.id);
                return (
                  <tr key={user.id} className={`border-b border-gray-800/40 transition-colors hover:bg-white/2 ${isBanned ? 'opacity-50' : ''}`}>
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={selected.includes(user.id)}
                        onChange={e => setSelected(p => e.target.checked ? [...p, user.id] : p.filter(id => id !== user.id))} className="rounded" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {user.name?.[0]?.toUpperCase()}
                        </div>
                        <span className="text-white font-bold text-sm whitespace-nowrap">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs whitespace-nowrap">{user.email}</td>
                    <td className="px-4 py-3">
                      <span className="text-white font-mono text-sm">Lv.{user.level}</span>
                      <span className="text-emerald-400 font-mono text-xs ml-2">{user.xp?.toLocaleString()} XP</span>
                    </td>
                    <td className="px-4 py-3 text-orange-400 font-mono text-sm">🔥 {user.streak || 0}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => handlePlan(user.id, user.plan)} disabled={isLoading}
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition-all hover:scale-105 ${user.plan === 'PRO' ? 'bg-yellow-400/10 text-yellow-400 border-yellow-400/30' : 'bg-gray-500/10 text-gray-400 border-gray-500/30'}`}>
                        {user.plan === 'PRO' ? '⚡ PRO' : 'FREE'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleRole(user.id, user.role)} disabled={isLoading}
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono border transition-all ${user.role === 'ADMIN' ? 'bg-red-400/10 text-red-400 border-red-400/30' : 'bg-gray-500/10 text-gray-400 border-gray-500/30'}`}>
                        {user.role}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-purple-400 font-mono text-sm">{user._count?.certifications || 0}</td>
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs">{user.loginCount || 0}</td>
                    <td className="px-4 py-3 text-gray-500 font-mono text-xs whitespace-nowrap">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      {isBanned
                        ? <span className="flex items-center gap-1 text-red-400 font-mono text-xs whitespace-nowrap"><Clock className="w-3 h-3" /> Banned</span>
                        : <span className="flex items-center gap-1 text-emerald-400 font-mono text-xs whitespace-nowrap"><CheckCircle className="w-3 h-3" /> Active</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => handleBan(user.id, isBanned)}
                          className={`text-xs font-mono px-2 py-1 rounded border transition-all whitespace-nowrap ${isBanned ? 'border-emerald-400/30 text-emerald-400 hover:bg-emerald-400/10' : 'border-red-400/30 text-red-400 hover:bg-red-400/10'}`}>
                          {isBanned ? 'Unban' : 'Ban'}
                        </button>
                        <button onClick={() => handleResetXP(user.id)}
                          className="text-xs font-mono px-2 py-1 rounded border border-gray-600 text-gray-400 hover:border-gray-400 transition-all whitespace-nowrap">
                          Reset XP
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500 font-mono">No users found</div>
        )}
      </div>
    </div>
  );
}
