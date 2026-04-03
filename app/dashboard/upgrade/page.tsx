// app/dashboard/upgrade/page.tsx
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { CheckCircle, Zap, Shield, Trophy, Lock } from 'lucide-react';

export default async function UpgradePage() {
  const session = await auth();
  const userId = session!.user!.id as string;
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { plan: true } });

  if (user?.plan === 'PRO') redirect('/dashboard');

  const features = [
    { icon: '⚔️', title: 'All Courses', desc: '10+ advanced courses including Ethical Hacking, DFIR, Malware Analysis' },
    { icon: '🔓', title: '200+ CTF Challenges', desc: 'All difficulty levels from beginner to expert' },
    { icon: '🧪', title: 'Lab Environments', desc: 'Browser-based practice labs — no setup required' },
    { icon: '🎓', title: 'All Certifications', desc: 'Earn verifiable certificates for every completed course' },
    { icon: '📝', title: 'Exam Access', desc: 'All certification exams unlocked' },
    { icon: '🗺️', title: 'Complete Roadmap', desc: 'Guided path from beginner to elite hacker' },
    { icon: '⚡', title: 'Priority Support', desc: 'Fast responses from security experts' },
    { icon: '💼', title: 'Job Board', desc: 'Exclusive cybersecurity job listings' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-cyber-yellow/10 border border-cyber-yellow/30 rounded-full px-4 py-2 mb-6">
          <Zap className="w-4 h-4 text-cyber-yellow" />
          <span className="text-cyber-yellow font-mono text-sm">Upgrade to Pro</span>
        </div>
        <h1 className="text-4xl font-display font-bold text-white mb-4">
          Unlock Your Full <span className="text-cyber-yellow">Potential</span>
        </h1>
        <p className="text-gray-400 font-mono max-w-xl mx-auto">
          Get access to all courses, challenges, labs, and certifications. Become a cybersecurity professional.
        </p>
      </div>

      {/* Plans */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Free */}
        <div className="cyber-card rounded-2xl p-8 border border-cyber-border">
          <p className="text-gray-400 font-mono text-sm mb-1">Current Plan</p>
          <p className="text-2xl font-display font-bold text-white mb-1">Free</p>
          <p className="text-3xl font-display font-black text-white mb-6">$0<span className="text-gray-500 text-lg font-normal">/forever</span></p>
          <ul className="space-y-3 mb-8">
            {['2 full courses', '20 challenges', 'Basic certs', 'Community access'].map(f => (
              <li key={f} className="flex items-center gap-3 text-gray-400 text-sm">
                <CheckCircle className="w-4 h-4 text-gray-600 flex-shrink-0" /> {f}
              </li>
            ))}
            {['Advanced courses', 'All challenges', 'Lab environments', 'All certifications'].map(f => (
              <li key={f} className="flex items-center gap-3 text-gray-600 text-sm line-through">
                <Lock className="w-4 h-4 text-gray-700 flex-shrink-0" /> {f}
              </li>
            ))}
          </ul>
          <div className="w-full py-3 rounded-xl bg-gray-800/50 text-gray-500 font-mono text-sm text-center">
            Current Plan
          </div>
        </div>

        {/* Pro */}
        <div className="rounded-2xl p-8 border-2 border-cyber-yellow/50 bg-cyber-yellow/5 relative">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-cyber-yellow text-black text-xs font-bold font-mono px-4 py-1.5 rounded-full">
            MOST POPULAR
          </div>
          <p className="text-cyber-yellow font-mono text-sm mb-1">Recommended</p>
          <p className="text-2xl font-display font-bold text-white mb-1">Pro</p>
          <p className="text-3xl font-display font-black text-white mb-6">
            $12<span className="text-gray-400 text-lg font-normal">/month</span>
          </p>
          <ul className="space-y-3 mb-8">
            {['All 10+ courses', '200+ challenges', 'Lab environments', 'All certifications', 'Exam prep kits', 'Priority support', 'Job board access', 'Early access to new content'].map(f => (
              <li key={f} className="flex items-center gap-3 text-gray-200 text-sm">
                <CheckCircle className="w-4 h-4 text-cyber-yellow flex-shrink-0" /> {f}
              </li>
            ))}
          </ul>
          <a
            href="https://buy.stripe.com/your-payment-link"
            className="w-full py-4 rounded-xl bg-cyber-yellow text-black font-bold font-mono text-base block text-center hover:bg-yellow-300 transition-colors"
          >
            ⚡ Upgrade Now — $12/mo
          </a>
          <p className="text-center text-gray-500 font-mono text-xs mt-3">Cancel anytime. No contracts.</p>
        </div>
      </div>

      {/* Features grid */}
      <div>
        <h2 className="text-xl font-display font-bold text-white text-center mb-6">Everything in Pro</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map(({ icon, title, desc }) => (
            <div key={title} className="cyber-card rounded-xl p-4 border border-cyber-border">
              <div className="text-2xl mb-3">{icon}</div>
              <p className="text-white font-bold text-sm mb-1">{title}</p>
              <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div>
        <h2 className="text-xl font-display font-bold text-white text-center mb-6">Frequently Asked</h2>
        <div className="space-y-3">
          {[
            { q: 'Can I cancel anytime?', a: 'Yes! Cancel anytime with no fees. Your Pro access lasts until the end of the billing period.' },
            { q: 'Is there a student discount?', a: 'Yes! Email us with your .edu address for 50% off.' },
            { q: 'Are the certifications recognized?', a: 'Our certs are verifiable online and respected in the security community. They complement industry certs like CEH and OSCP.' },
            { q: 'What payment methods do you accept?', a: 'All major credit cards, PayPal, and some crypto via Stripe.' },
          ].map(({ q, a }) => (
            <div key={q} className="cyber-card rounded-xl p-5 border border-cyber-border">
              <p className="text-white font-bold mb-1">{q}</p>
              <p className="text-gray-400 text-sm">{a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
