import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { cybersecuritySystemPrompt, generateCyberQuestAI } from '@/lib/ai';

const allowedLevels = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'] as const;

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = (session.user as any).id as string;
  const records = await prisma.aiMockInterview.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 30 });
  return NextResponse.json({ records });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = (session.user as any).id as string;
  const plan = (session.user as any).plan;
  const { targetRole, level, mode, answer, lastQuestion } = await req.json();
  const safeLevel = allowedLevels.includes(level) ? level : 'BEGINNER';
  const role = targetRole || 'Cybersecurity Analyst';

  const previous = await prisma.aiMockInterview.findMany({
    where: { userId, targetRole: role },
    orderBy: { createdAt: 'desc' },
    take: 10,
    select: { question: true, score: true, createdAt: true },
  });

  if (plan !== 'PRO') {
    const todayCount = await prisma.aiMockInterview.count({ where: { userId, createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } } });
    if (todayCount >= 5) return NextResponse.json({ error: 'Free plan allows 5 AI interview attempts per day. Upgrade to Pro for unlimited practice.' }, { status: 402 });
  }

  if (mode === 'feedback') {
    if (!lastQuestion || !answer) return NextResponse.json({ error: 'Question and answer are required for feedback.' }, { status: 400 });
    const feedback = await generateCyberQuestAI(
      cybersecuritySystemPrompt(),
      [{ role: 'user', content: `Act as a cybersecurity interviewer. Evaluate this answer safely and constructively.\nRole: ${role}\nLevel: ${safeLevel}\nQuestion: ${lastQuestion}\nCandidate answer: ${answer}\n\nReturn: Score 0-100, What was strong, What was weak, Ideal answer outline, Next follow-up question. Do not repeat previous questions: ${JSON.stringify(previous)}` }],
      1400
    );
    const scoreMatch = feedback.match(/(?:Score)\D*(\d{1,3})/i);
    const score = Math.min(100, Math.max(0, scoreMatch ? Number(scoreMatch[1]) : 60));
    const record = await prisma.aiMockInterview.create({ data: { userId, targetRole: role, level: safeLevel, question: lastQuestion, answer, feedback, score } });
    return NextResponse.json({ record });
  }

  const question = await generateCyberQuestAI(
    cybersecuritySystemPrompt(),
    [{ role: 'user', content: `Generate ONE fresh mock interview question for a ${role}. Level: ${safeLevel}. Make it practical, scenario-based, and current for modern cybersecurity work. Avoid repeating these previous questions from this user: ${JSON.stringify(previous)}. Include only the question and 2 short evaluation hints for the interviewer.` }],
    700
  );

  return NextResponse.json({ question });
}
