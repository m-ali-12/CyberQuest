// app/api/admin/courses/[id]/toggle-premium/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const course = await prisma.course.findUnique({ where: { id: params.id }, select: { isPremium: true } });
  if (!course) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  await prisma.course.update({ where: { id: params.id }, data: { isPremium: !course.isPremium } });
  return NextResponse.json({ success: true });
}
