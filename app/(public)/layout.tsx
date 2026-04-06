// app/(public)/layout.tsx - Shared layout for all public pages
import PublicNav from '@/components/layout/PublicNav';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PublicNav />
      <main className="pt-16">
        {children}
      </main>
    </>
  );
}
