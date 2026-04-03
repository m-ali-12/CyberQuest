import Link from 'next/link';
import { Shield, Mail, MessageSquare } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-cyber-dark cyber-grid">
      <nav className="border-b border-cyber-border px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-cyber-green rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-black" />
          </div>
          <span className="font-display font-bold text-white">CYBER<span className="text-cyber-green">QUEST</span></span>
        </Link>
      </nav>
      <div className="max-w-xl mx-auto px-6 py-24 text-center">
        <MessageSquare className="w-12 h-12 text-cyber-green mx-auto mb-6" />
        <h1 className="text-3xl font-display font-bold text-white mb-4">Contact Us</h1>
        <p className="text-gray-400 font-mono mb-8">Have a question or need help? Reach out and we will respond within 24 hours.</p>
        <a href="mailto:support@cyberquest.io" className="btn-cyber-solid px-8 py-3 rounded-xl inline-flex items-center gap-2">
          <Mail className="w-4 h-4" /> support@cyberquest.io
        </a>
      </div>
    </div>
  );
}
