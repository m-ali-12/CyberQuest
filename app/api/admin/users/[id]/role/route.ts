// app/api/admin/users/[id]/role/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { role } = await req.json();
  if (!['USER', 'ADMIN'].includes(role)) return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
  await prisma.user.update({ where: { id: params.id }, data: { role } });
  return NextResponse.json({ success: true });
}
