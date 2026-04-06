import Link from 'next/link';
export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-cyber-dark">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-display font-bold text-white mb-8">Privacy Policy</h1>
        <div className="space-y-6 text-gray-300 font-mono text-sm leading-relaxed">
          <p>We collect: your name, email address, and learning progress data.</p>
          <p>We use this data to provide the learning platform, track your progress, and send important account notifications.</p>
          <p>We do NOT sell your data to advertisers or third parties.</p>
          <p>Your password is encrypted using bcrypt with 12 salt rounds.</p>
          <p>Contact: <a href="mailto:privacy@cyberquest.io" className="text-cyber-green">privacy@cyberquest.io</a></p>
        </div>
        <Link href="/" className="inline-flex mt-8 text-cyber-green font-mono text-sm hover:underline">← Back to Home</Link>
      </div>
    </div>
  );
}
