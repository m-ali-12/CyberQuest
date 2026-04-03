import Link from 'next/link';
import { Shield } from 'lucide-react';

export default function TermsPage() {
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
        <h1 className="text-3xl font-display font-bold text-white mb-8">Terms of Service</h1>
        <div className="prose prose-invert space-y-6 text-gray-300 font-mono text-sm leading-relaxed">
          <p>By using CyberQuest, you agree to use this platform for lawful, educational purposes only.</p>
          <p>All cybersecurity techniques taught are for defensive and educational use. Applying these techniques without authorization is illegal and strictly prohibited.</p>
          <p>Your account and progress data is stored securely. We do not sell your data to third parties.</p>
          <p>CyberQuest reserves the right to suspend accounts that violate these terms.</p>
          <p>For questions: <a href="mailto:support@cyberquest.io" className="text-cyber-green">support@cyberquest.io</a></p>
        </div>
      </div>
    </div>
  );
}
