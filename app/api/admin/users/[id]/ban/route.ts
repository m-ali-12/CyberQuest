// app/api/admin/users/[id]/ban/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const banUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
  await prisma.user.update({
    where: { id: params.id },
    data: { isBanned: true, banUntil },
  });

  return NextResponse.json({ success: true });
}
