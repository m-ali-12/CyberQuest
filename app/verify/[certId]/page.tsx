// app/verify/[certId]/page.tsx
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Shield, Award, CheckCircle, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default async function VerifyCertPage({ params }: { params: { certId: string } }) {
  const cert = await prisma.certification.findUnique({
    where: { certId: params.certId },
    include: { user: { select: { name: true } } },
  });

  if (!cert) notFound();

  return (
    <div className="min-h-screen bg-cyber-dark cyber-grid flex items-center justify-center px-4">
      <div className="max-w-xl w-full">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-10 h-10 bg-cyber-green rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-black" />
            </div>
            <span className="font-display font-bold text-2xl text-white">CYBER<span className="text-cyber-green">QUEST</span></span>
          </Link>
        </div>

        <div className="cyber-card rounded-2xl overflow-hidden border border-cyber-green/30">
          {/* Certificate design */}
          <div className="relative bg-gradient-to-br from-cyber-card via-black to-cyber-card p-10 border-b border-cyber-border">
            <div className="absolute inset-4 border border-cyber-green/15 rounded-xl pointer-events-none" />
            <div className="absolute inset-5 border border-cyber-green/8 rounded-lg pointer-events-none" />

            <div className="text-center relative">
              <div className="w-20 h-20 bg-cyber-green/10 border-2 border-cyber-green/40 rounded-full flex items-center justify-center mx-auto mb-5">
                <Award className="w-10 h-10 text-cyber-green" />
              </div>
              <p className="text-gray-500 font-mono text-xs uppercase tracking-[0.3em] mb-3">Certificate of Completion</p>
              <p className="text-white font-display font-bold text-3xl mb-2">{cert.user.name}</p>
              <div className="h-px bg-gradient-to-r from-transparent via-cyber-green/40 to-transparent my-4" />
              <p className="text-gray-400 font-mono text-sm mb-1">has successfully completed</p>
              <p className="text-cyber-green font-display font-bold text-xl">{cert.title}</p>
              <p className="text-gray-500 font-mono text-xs mt-4">
                Issued on {new Date(cert.issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Verification info */}
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-3 p-4 bg-cyber-green/5 border border-cyber-green/20 rounded-xl">
              <CheckCircle className="w-6 h-6 text-cyber-green flex-shrink-0" />
              <div>
                <p className="text-cyber-green font-bold">Certificate Verified ✓</p>
                <p className="text-gray-400 font-mono text-xs mt-0.5">This certificate is authentic and was issued by CyberQuest</p>
              </div>
            </div>

            <div className="bg-black/30 rounded-xl p-4 space-y-2">
              {[
                { label: 'Certificate ID', value: cert.certId },
                { label: 'Recipient', value: cert.user.name },
                { label: 'Course', value: cert.title },
                { label: 'Issue Date', value: new Date(cert.issueDate).toLocaleDateString() },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-gray-500 font-mono text-xs">{label}</span>
                  <span className="text-white font-mono text-xs">{value}</span>
                </div>
              ))}
            </div>

            <Link href="/" className="w-full flex items-center justify-center gap-2 py-2.5 border border-cyber-border rounded-lg text-gray-400 hover:text-white font-mono text-sm transition-colors">
              <ExternalLink className="w-4 h-4" /> Visit CyberQuest
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
