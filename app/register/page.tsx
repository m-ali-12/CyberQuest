'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, Eye, EyeOff, Lock, Mail, User, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const STRENGTH_COLORS = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-cyber-green'];
const STRENGTH_LABELS = ['Weak', 'Fair', 'Good', 'Strong'];

function getPasswordStrength(pwd: string): number {
  let s = 0;
  if (pwd.length >= 8) s++;
  if (/[A-Z]/.test(pwd)) s++;
  if (/[0-9]/.test(pwd)) s++;
  if (/[^A-Za-z0-9]/.test(pwd)) s++;
  return s;
}

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agree, setAgree] = useState(false);

  const strength = getPasswordStrength(form.password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agree) return toast.error('Please accept terms');
    if (form.password !== form.confirm) return toast.error('Passwords do not match');
    if (strength < 2) return toast.error('Password too weak');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');

      toast.success('Account created! Welcome, Hacker! 🎉');
      router.push('/login');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cyber-dark cyber-grid flex items-center justify-center px-4 py-10">
      <div className="absolute inset-0 bg-glow-blue opacity-15 pointer-events-none" />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-10 h-10 bg-cyber-green rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-black" />
            </div>
            <span className="font-display font-bold text-2xl text-white">CYBER<span className="text-cyber-green">QUEST</span></span>
          </Link>
          <p className="text-gray-500 font-mono text-sm mt-2">Create your hacker identity</p>
        </div>

        <div className="cyber-card rounded-2xl p-8 border border-cyber-border">
          <h1 className="text-2xl font-display font-bold text-white mb-2">Join CyberQuest</h1>
          <p className="text-gray-500 font-mono text-sm mb-8">Start your free journey today</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-mono text-gray-400 mb-2 uppercase tracking-wider">Display Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="YourHackerName"
                  required
                  minLength={2}
                  className="w-full bg-black/30 border border-cyber-border rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-600 font-mono text-sm focus:outline-none focus:border-cyber-green/50 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-400 mb-2 uppercase tracking-wider">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  required
                  className="w-full bg-black/30 border border-cyber-border rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-600 font-mono text-sm focus:outline-none focus:border-cyber-green/50 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-400 mb-2 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="Min 8 characters"
                  required
                  minLength={8}
                  className="w-full bg-black/30 border border-cyber-border rounded-lg pl-10 pr-10 py-3 text-white placeholder-gray-600 font-mono text-sm focus:outline-none focus:border-cyber-green/50 transition-colors"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[0,1,2,3].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded ${i < strength ? STRENGTH_COLORS[strength - 1] : 'bg-cyber-border'} transition-all`} />
                    ))}
                  </div>
                  <p className="text-xs font-mono text-gray-500">{STRENGTH_LABELS[strength - 1] || 'Very weak'}</p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-400 mb-2 uppercase tracking-wider">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="password"
                  value={form.confirm}
                  onChange={e => setForm({ ...form, confirm: e.target.value })}
                  placeholder="Repeat password"
                  required
                  className="w-full bg-black/30 border border-cyber-border rounded-lg pl-10 pr-10 py-3 text-white placeholder-gray-600 font-mono text-sm focus:outline-none focus:border-cyber-green/50 transition-colors"
                />
                {form.confirm && (
                  <CheckCircle className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 ${form.password === form.confirm ? 'text-cyber-green' : 'text-cyber-red'}`} />
                )}
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} className="mt-1 rounded" />
              <span className="text-gray-400 text-sm font-mono leading-relaxed">
                I agree to the{' '}
                <Link href="/terms" className="text-cyber-green hover:underline">Terms of Service</Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-cyber-green hover:underline">Privacy Policy</Link>
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-cyber-solid py-3 rounded-lg font-bold font-mono text-sm"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : '> Initialize Account'}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm font-mono mt-6">
            Already a member?{' '}
            <Link href="/login" className="text-cyber-green hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
