import Link from 'next/link';
import { Mail, MessageSquare } from 'lucide-react';
export default function ContactPage() {
  return (
    <div className="min-h-screen bg-cyber-dark cyber-grid">
      <div className="max-w-xl mx-auto px-6 py-24 text-center">
        <MessageSquare className="w-12 h-12 text-cyber-green mx-auto mb-6" />
        <h1 className="text-3xl font-display font-bold text-white mb-4">Contact Us</h1>
        <p className="text-gray-400 font-mono mb-8">Have a question? Reach out and we will respond within 24 hours.</p>
        <a href="mailto:support@cyberquest.io" className="btn-cyber-solid px-8 py-3 rounded-xl inline-flex items-center gap-2">
          <Mail className="w-4 h-4" /> support@cyberquest.io
        </a>
        <div className="mt-6"><Link href="/" className="text-cyber-green font-mono text-sm hover:underline">← Back to Home</Link></div>
      </div>
    </div>
  );
}
