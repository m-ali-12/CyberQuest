// app/dashboard/settings/page.tsx
'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { User, Lock, Bell, Shield, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const [name, setName] = useState(session?.user?.name || '');
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [saving, setSaving] = useState(false);

  const handleSaveName = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        await update({ name });
        toast.success('Profile updated!');
      }
    } catch { toast.error('Update failed'); }
    finally { setSaving(false); }
  };

  const handleChangePassword = async () => {
    if (passwords.new !== passwords.confirm) return toast.error('Passwords do not match');
    if (passwords.new.length < 8) return toast.error('Password too short');
    setSaving(true);
    try {
      const res = await fetch('/api/users/me/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.new }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Password changed!');
        setPasswords({ current: '', new: '', confirm: '' });
      } else {
        toast.error(data.error || 'Failed to change password');
      }
    } catch { toast.error('Update failed'); }
    finally { setSaving(false); }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400 font-mono text-sm">Manage your account preferences</p>
      </div>

      {/* Profile */}
      <div className="cyber-card rounded-xl border border-cyber-border overflow-hidden">
        <div className="flex items-center gap-3 p-5 border-b border-cyber-border bg-black/20">
          <User className="w-5 h-5 text-cyber-green" />
          <h2 className="text-white font-bold">Profile Information</h2>
        </div>
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-mono text-gray-400 mb-2 uppercase tracking-wider">Display Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-black/30 border border-cyber-border rounded-lg px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-cyber-green/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-gray-400 mb-2 uppercase tracking-wider">Email</label>
            <input
              type="email"
              value={session?.user?.email || ''}
              disabled
              className="w-full bg-black/20 border border-cyber-border rounded-lg px-4 py-3 text-gray-500 font-mono text-sm cursor-not-allowed"
            />
            <p className="text-gray-600 font-mono text-xs mt-1">Email cannot be changed</p>
          </div>
          <button onClick={handleSaveName} disabled={saving} className="btn-cyber-solid px-6 py-2.5 rounded-lg text-sm flex items-center gap-2">
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Password */}
      <div className="cyber-card rounded-xl border border-cyber-border overflow-hidden">
        <div className="flex items-center gap-3 p-5 border-b border-cyber-border bg-black/20">
          <Lock className="w-5 h-5 text-cyber-blue" />
          <h2 className="text-white font-bold">Change Password</h2>
        </div>
        <div className="p-6 space-y-4">
          {[
            { label: 'Current Password', key: 'current', value: passwords.current },
            { label: 'New Password', key: 'new', value: passwords.new },
            { label: 'Confirm New Password', key: 'confirm', value: passwords.confirm },
          ].map(({ label, key, value }) => (
            <div key={key}>
              <label className="block text-xs font-mono text-gray-400 mb-2 uppercase tracking-wider">{label}</label>
              <input
                type="password"
                value={value}
                onChange={e => setPasswords(p => ({ ...p, [key]: e.target.value }))}
                className="w-full bg-black/30 border border-cyber-border rounded-lg px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-cyber-blue/50 transition-colors"
              />
            </div>
          ))}
          <button onClick={handleChangePassword} disabled={saving} className="btn-cyber text-sm px-6 py-2.5 rounded-lg flex items-center gap-2">
            <Lock className="w-4 h-4" /> {saving ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </div>

      {/* Security info */}
      <div className="cyber-card rounded-xl border border-cyber-border overflow-hidden">
        <div className="flex items-center gap-3 p-5 border-b border-cyber-border bg-black/20">
          <Shield className="w-5 h-5 text-cyber-yellow" />
          <h2 className="text-white font-bold">Security Settings</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-cyber-border">
            <div>
              <p className="text-white font-bold text-sm">Active Session Limit</p>
              <p className="text-gray-400 font-mono text-xs mt-0.5">Maximum 3 browsers simultaneously</p>
            </div>
            <span className="badge bg-cyber-green/10 text-cyber-green border border-cyber-green/20">Enabled</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-cyber-border">
            <div>
              <p className="text-white font-bold text-sm">Auto-lock on Violation</p>
              <p className="text-gray-400 font-mono text-xs mt-0.5">40+ min temporary ban on session overflow</p>
            </div>
            <span className="badge bg-cyber-green/10 text-cyber-green border border-cyber-green/20">Active</span>
          </div>
          <p className="text-gray-600 font-mono text-xs">
            These security features protect your account from unauthorized access.
          </p>
        </div>
      </div>
    </div>
  );
}
