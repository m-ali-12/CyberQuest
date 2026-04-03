'use client';
import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Shield, Eye, EyeOff, Lock, Mail, AlertCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [banInfo, setBanInfo] = useState<{ minutes: number } | null>(null);
  const [countdown, setCountdown] = useState(0);

  const error = params.get('error');

  useEffect(() => {
    if (countdown > 0) {
      const t = setInterval(() => setCountdown(c => c - 1), 1000);
      return () => clearInterval(t);
    } else if (countdown === 0 && banInfo) {
      setBanInfo(null);
    }
  }, [countdown, banInfo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || countdown > 0) return;
    setLoading(true);
    try {
      const res = await signIn('credentials', { email, password, redirect: false });
      if (res?.error) {
        if (res.error.startsWith('BANNED:')) {
          const minutes = parseInt(res.error.split(':')[1]);
          setBanInfo({ minutes });
          setCountdown(minutes * 60);
          toast.error(`⛔ Account locked for ${minutes} minutes`);
        } else {
          toast.error('Invalid email or password');
        }
      } else {
        toast.success('Welcome back! 🛡️');
        router.push('/dashboard');
        router.refresh();
      }
    } catch { toast.error('Something went wrong.'); }
    finally { setLoading(false); }
  };

  const fmt = (s: number) => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`;

  return (
    <div className="min-h-screen bg-cyber-dark cyber-grid flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-glow-green opacity-20 pointer-events-none" />
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-cyber-green rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-black" />
            </div>
            <span className="font-display font-bold text-2xl text-white">CYBER<span className="text-cyber-green">QUEST</span></span>
          </Link>
          <p className="text-gray-500 font-mono text-sm mt-2">Access your secure terminal</p>
        </div>

        {banInfo && countdown > 0 && (
          <div className="mb-6 p-4 rounded-xl border border-cyber-red/50 bg-cyber-red/10 flex items-start gap-3">
            <Clock className="w-5 h-5 text-cyber-red flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-cyber-red font-bold text-sm mb-1">Account Temporarily Locked</p>
              <p className="text-gray-400 text-xs font-mono">Too many active sessions. Locked for: <span className="text-cyber-red font-bold">{fmt(countdown)}</span></p>
            </div>
          </div>
        )}

        {error && !banInfo && (
          <div className="mb-6 p-4 rounded-xl border border-yellow-500/30 bg-yellow-500/10 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-400" />
            <p className="text-yellow-400 text-sm font-mono">Authentication failed. Check your credentials.</p>
          </div>
        )}

        <div className="cyber-card rounded-2xl p-8 border border-cyber-border">
          <h1 className="text-2xl font-display font-bold text-white mb-2">Sign In</h1>
          <p className="text-gray-500 font-mono text-sm mb-8">Continue your hacking journey</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-mono text-gray-400 mb-2 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="hacker@example.com" required
                  className="w-full bg-black/30 border border-cyber-border rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-600 font-mono text-sm focus:outline-none focus:border-cyber-green/50 transition-colors" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-400 mb-2 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required
                  className="w-full bg-black/30 border border-cyber-border rounded-lg pl-10 pr-10 py-3 text-white placeholder-gray-600 font-mono text-sm focus:outline-none focus:border-cyber-green/50 transition-colors" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading || countdown > 0}
              className={`w-full py-3 rounded-lg font-bold font-mono text-sm transition-all ${countdown > 0 ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'btn-cyber-solid'}`}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />Authenticating...
                </span>
              ) : countdown > 0 ? `Locked — ${fmt(countdown)}` : '> Access Terminal'}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-cyber-border" /></div>
            <div className="relative flex justify-center"><span className="bg-cyber-card px-3 text-gray-600 text-xs font-mono">OR CONTINUE WITH</span></div>
          </div>

          <button onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            className="w-full py-3 rounded-lg border border-cyber-border bg-black/20 text-white font-mono text-sm hover:border-gray-500 transition-colors flex items-center justify-center gap-3">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <p className="text-center text-gray-500 text-sm font-mono mt-6">
            New hacker? <Link href="/register" className="text-cyber-green hover:underline">Create account</Link>
          </p>
        </div>
        <div className="mt-4 text-center">
          <p className="text-gray-600 text-xs font-mono flex items-center justify-center gap-1">
            <Lock className="w-3 h-3" /> Max 3 active sessions allowed per account
          </p>
        </div>
      </div>
    </div>
  );
}
