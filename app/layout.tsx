// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { SessionProvider } from './providers';

export const metadata: Metadata = {
  title: 'CyberQuest — Learn Cybersecurity',
  description: 'Master cybersecurity through gamified learning. Challenges, exams, certifications — from beginner to expert.',
  keywords: 'cybersecurity, ethical hacking, CTF, learn security, penetration testing',
  authors: [{ name: 'CyberQuest' }],
  themeColor: '#00ff88',
  openGraph: {
    title: 'CyberQuest — Learn Cybersecurity',
    description: 'Master cybersecurity through gamified learning.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=JetBrains+Mono:wght@300;400;600&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
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
              success: {
                iconTheme: { primary: '#00ff88', secondary: '#000' },
              },
              error: {
                iconTheme: { primary: '#ff0055', secondary: '#fff' },
              },
            }}
          />
        </SessionProvider>
      </body>
    </html>
  );
}
