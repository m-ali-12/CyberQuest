// app/api/users/me/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id as string },
    select: { xp: true, level: true, streak: true, plan: true, name: true },
  });

  return NextResponse.json(user);
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { name } = await req.json();
  if (!name || name.trim().length < 2) return NextResponse.json({ error: 'Name too short' }, { status: 400 });
  const user = await prisma.user.update({
    where: { id: session.user.id as string },
    data: { name: name.trim() },
    select: { name: true },
  });
  return NextResponse.json(user);
}
