import Link from 'next/link';
import { Shield } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-cyber-dark">
      <nav className="border-b border-cyber-border px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-cyber-green rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-black" />
          </div>
          <span className="font-display font-bold text-white">CYBER<span className="text-cyber-green">QUEST</span></span>
        </Link>
      </nav>
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-display font-bold text-white mb-8">Privacy Policy</h1>
        <div className="space-y-6 text-gray-300 font-mono text-sm leading-relaxed">
          <p>We collect: your name, email address, and learning progress data.</p>
          <p>We use this data to: provide the learning platform, track your progress, and send important account notifications.</p>
          <p>We do NOT sell your data to advertisers or third parties.</p>
          <p>Your password is encrypted using bcrypt with 12 salt rounds. We cannot see your password.</p>
          <p>You can request deletion of your account and all data at any time by emailing us.</p>
          <p>Contact: <a href="mailto:privacy@cyberquest.io" className="text-cyber-green">privacy@cyberquest.io</a></p>
        </div>
      </div>
    </div>
  );
}
