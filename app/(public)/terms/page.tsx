import Link from 'next/link';
export default function TermsPage() {
  return (
    <div className="min-h-screen bg-cyber-dark">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-display font-bold text-white mb-8">Terms of Service</h1>
        <div className="space-y-6 text-gray-300 font-mono text-sm leading-relaxed">
          <p>By using CyberQuest, you agree to use this platform for lawful, educational purposes only.</p>
          <p>All cybersecurity techniques taught are for defensive and educational use. Applying these techniques without authorization is illegal and strictly prohibited.</p>
          <p>Your account and progress data is stored securely. We do not sell your data to third parties.</p>
          <p>CyberQuest reserves the right to suspend accounts that violate these terms.</p>
          <p>Contact: <a href="mailto:support@cyberquest.io" className="text-cyber-green">support@cyberquest.io</a></p>
        </div>
        <Link href="/" className="inline-flex mt-8 text-cyber-green font-mono text-sm hover:underline">← Back to Home</Link>
      </div>
    </div>
  );
}
