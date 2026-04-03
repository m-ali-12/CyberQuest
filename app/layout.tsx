// app/layout.tsx
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { SessionProvider } from './providers';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://cyber-quest.vercel.app';

export const viewport: Viewport = {
  themeColor: '#00ff88',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'CyberQuest — Learn Cybersecurity Online | Ethical Hacking Courses',
    template: '%s | CyberQuest',
  },
  description: 'Master cybersecurity with CyberQuest. Free & paid courses on ethical hacking, web security, CTF challenges, network hacking, digital forensics. Earn certifications. Join 50,000+ hackers.',
  keywords: [
    'cybersecurity course', 'learn ethical hacking', 'CTF challenges', 'web security',
    'penetration testing', 'cybersecurity certification', 'free hacking course',
    'OWASP', 'SQL injection', 'network security', 'cyber security training',
    'hacking course online', 'bug bounty', 'information security', 'cyber security beginner',
  ],
  authors: [{ name: 'CyberQuest', url: APP_URL }],
  creator: 'CyberQuest',
  publisher: 'CyberQuest',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: APP_URL,
    siteName: 'CyberQuest',
    title: 'CyberQuest — Learn Cybersecurity Online',
    description: 'Master cybersecurity with gamified learning. CTF challenges, courses, certifications. From beginner to expert hacker.',
    images: [{ url: `${APP_URL}/og-image.png`, width: 1200, height: 630, alt: 'CyberQuest' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CyberQuest — Learn Cybersecurity Online',
    description: 'Master ethical hacking, web security, CTF challenges. Free courses + certifications.',
    images: [`${APP_URL}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  alternates: { canonical: APP_URL },
  manifest: '/manifest.json',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=JetBrains+Mono:wght@300;400;600&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'EducationalOrganization',
              name: 'CyberQuest',
              url: APP_URL,
              description: 'Online cybersecurity education platform with courses, CTF challenges, and certifications.',
              offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', description: 'Free cybersecurity courses' },
            }),
          }}
        />
      </head>
      <body className="scanlines">
        <SessionProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#0f1629',
                color: '#e2e8f0',
                border: '1px solid #1e2d4a',
                borderRadius: '8px',
                fontFamily: 'JetBrains Mono, monospace',
              },
              success: { iconTheme: { primary: '#00ff88', secondary: '#000' } },
              error: { iconTheme: { primary: '#ff0055', secondary: '#fff' } },
            }}
          />
        </SessionProvider>
      </body>
    </html>
  );
}
