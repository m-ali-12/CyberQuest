// app/api/admin/challenges/[id]/toggle-active/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'ADMIN')
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const c = await prisma.challenge.findUnique({ where: { id: params.id }, select: { isActive: true } });
  if (!c) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await prisma.challenge.update({ where: { id: params.id }, data: { isActive: !c.isActive } });
  return NextResponse.json({ success: true });
}
