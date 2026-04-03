// app/api/admin/challenges/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'ADMIN')
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const { title, description, category, difficulty, points, flag, hints, isPremium } = body;

  if (!title || !flag) return NextResponse.json({ error: 'Title and flag required' }, { status: 400 });

  const challenge = await prisma.challenge.create({
    data: {
      title, description: description || '', category, difficulty,
      points: parseInt(points) || 100, flag, hints: hints || [],
      isPremium: isPremium || false, isActive: true,
    },
  });

  return NextResponse.json(challenge);
}
