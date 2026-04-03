// app/api/admin/users/[id]/reset-xp/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  await prisma.user.update({ where: { id: params.id }, data: { xp: 0, level: 1 } });
  return NextResponse.json({ success: true });
}
