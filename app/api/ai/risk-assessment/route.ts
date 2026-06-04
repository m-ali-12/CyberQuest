import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { cybersecuritySystemPrompt, generateCyberQuestAI } from '@/lib/ai';

const allowedLevels = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'] as const;

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = (session.user as any).id as string;

  const records = await prisma.aiRiskAssessment.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });

  return NextResponse.json({ records });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = (session.user as any).id as string;
  const plan = (session.user as any).plan;
  const { title, targetRole, level, scenario } = await req.json();

  if (!title || !targetRole || !scenario) {
    return NextResponse.json({ error: 'Title, target role and scenario are required.' }, { status: 400 });
  }

  const safeLevel = allowedLevels.includes(level) ? level : 'BEGINNER';
  const previous = await prisma.aiRiskAssessment.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 5,
    select: { title: true, targetRole: true, level: true, riskScore: true, createdAt: true },
  });

  if (plan !== 'PRO') {
    const todayCount = await prisma.aiRiskAssessment.count({
      where: { userId, createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
    });
    if (todayCount >= 3) return NextResponse.json({ error: 'Free plan allows 3 AI risk scans per day. Upgrade to Pro for unlimited scans.' }, { status: 402 });
  }

  const content = await generateCyberQuestAI(
    cybersecuritySystemPrompt(),
    [{
      role: 'user',
      content: `Create a fresh defensive cybersecurity risk assessment. Do not repeat generic advice.\nTarget role: ${targetRole}\nUser level: ${safeLevel}\nScenario/title: ${title}\nUser scenario:\n${scenario}\nPrevious private records for this same user only:\n${JSON.stringify(previous)}\n\nReturn sections: Risk Score 0-100, Main Risks, Missing Skills, Defensive Action Plan, Learning Path, Practice Labs, Interview Questions to prepare.`,
    }],
    1600
  );

  const scoreMatch = content.match(/(?:Risk Score|Score)\D*(\d{1,3})/i);
  const riskScore = Math.min(100, Math.max(0, scoreMatch ? Number(scoreMatch[1]) : 50));
  const recommendations = content
    .split('\n')
    .filter((line) => /action|learn|practice|improve|mitigate|recommend/i.test(line))
    .slice(0, 8)
    .map((line) => line.replace(/^[-*\d.\s]+/, '').trim())
    .filter(Boolean);

  const record = await prisma.aiRiskAssessment.create({
    data: {
      userId,
      title,
      targetRole,
      level: safeLevel,
      scenario,
      riskScore,
      result: content,
      recommendations,
    },
  });

  return NextResponse.json({ record });
}
