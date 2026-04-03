// app/dashboard/certifications/page.tsx
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Award, Download, Share2, ExternalLink } from 'lucide-react';

export default async function CertificationsPage() {
  const session = await auth();
  const userId = session!.user!.id as string;
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { name: true } });

  const certs = await prisma.certification.findMany({
    where: { userId },
    orderBy: { issueDate: 'desc' },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-white mb-2">
          My <span className="text-cyber-green">Certifications</span>
        </h1>
        <p className="text-gray-400 font-mono text-sm">
          Proof of your cybersecurity expertise
        </p>
      </div>

      {certs.length === 0 ? (
        <div className="cyber-card rounded-xl border border-cyber-border p-16 text-center">
          <Award className="w-16 h-16 text-gray-700 mx-auto mb-4" />
          <p className="text-gray-400 font-mono text-lg mb-2">No certifications yet</p>
          <p className="text-gray-600 font-mono text-sm mb-6">Complete courses and pass exams to earn certifications</p>
          <a href="/dashboard/courses" className="btn-cyber-solid px-6 py-2.5 rounded-lg text-sm">Browse Courses</a>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {certs.map((cert) => (
            <div key={cert.id} className="cyber-card rounded-xl border border-cyber-border overflow-hidden group hover:border-cyber-green/40 transition-all">
              {/* Certificate preview */}
              <div className="relative bg-gradient-to-br from-cyber-card to-black p-8 border-b border-cyber-border">
                {/* Decorative border */}
                <div className="absolute inset-3 border border-cyber-green/20 rounded-lg pointer-events-none" />
                <div className="absolute inset-4 border border-cyber-green/10 rounded pointer-events-none" />

                <div className="text-center relative">
                  <div className="w-16 h-16 bg-cyber-green/10 border-2 border-cyber-green/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-cyber-green" />
                  </div>
                  <p className="text-gray-500 font-mono text-xs uppercase tracking-widest mb-1">Certificate of Completion</p>
                  <p className="text-white font-display font-bold text-sm">{user?.name}</p>
                  <div className="mt-2 h-px bg-gradient-to-r from-transparent via-cyber-green/30 to-transparent" />
                  <p className="text-cyber-green font-bold mt-2 text-sm">{cert.title}</p>
                </div>
              </div>

              {/* Details */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-white font-bold text-sm">{cert.title}</p>
                    <p className="text-gray-500 font-mono text-xs mt-0.5">
                      Issued {new Date(cert.issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>

                <div className="bg-black/30 rounded-lg p-2 mb-4">
                  <p className="text-gray-600 font-mono text-[10px] uppercase tracking-wider mb-0.5">Certificate ID</p>
                  <p className="text-cyber-green font-mono text-xs">{cert.certId}</p>
                </div>

                <div className="flex gap-2">
                  <a
                    href={`/verify/${cert.certId}`}
                    target="_blank"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-cyber-border rounded-lg text-xs font-mono text-gray-400 hover:text-white hover:border-gray-500 transition-all"
                  >
                    <ExternalLink className="w-3 h-3" /> Verify
                  </a>
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-cyber-green/30 bg-cyber-green/5 rounded-lg text-xs font-mono text-cyber-green hover:bg-cyber-green/10 transition-all">
                    <Download className="w-3 h-3" /> Download
                  </button>
                  <button className="w-9 h-9 flex items-center justify-center border border-cyber-border rounded-lg text-gray-400 hover:text-white hover:border-gray-500 transition-all">
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
