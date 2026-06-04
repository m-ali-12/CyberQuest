import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { cybersecuritySystemPrompt, generateCyberQuestAI } from '@/lib/ai';

const allowedLevels = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'] as const;
const careerPaths = [
  'SOC_ANALYST', 'BLUE_TEAM_DEFENDER', 'RED_TEAM_OPERATOR', 'PENETRATION_TESTER',
  'BUG_BOUNTY_RESEARCHER', 'INCIDENT_RESPONDER', 'DIGITAL_FORENSICS_ANALYST',
  'CLOUD_SECURITY_ENGINEER', 'DEVSECOPS_ENGINEER', 'GRC_ANALYST', 'MALWARE_ANALYST', 'AI_SECURITY_SPECIALIST'
] as const;

function normalizePath(value: string | undefined) {
  if (!value) return 'SOC_ANALYST';
  const upper = value.toUpperCase().replace(/[^A-Z0-9]+/g, '_');
  return (careerPaths as readonly string[]).includes(upper) ? upper : 'SOC_ANALYST';
}

function splitList(value: unknown) {
  if (Array.isArray(value)) return value.map(String).filter(Boolean).slice(0, 12);
  if (typeof value === 'string') return value.split(',').map(v => v.trim()).filter(Boolean).slice(0, 12);
  return [];
}

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = (session.user as any).id as string;
  const records = await prisma.aiCareerCounseling.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 20 });
  return NextResponse.json({ records });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = (session.user as any).id as string;
  const plan = (session.user as any).plan;
  const body = await req.json();
  const currentLevel = allowedLevels.includes(body.currentLevel) ? body.currentLevel : 'BEGINNER';
  const interests = splitList(body.interests);
  const strengths = splitList(body.strengths);
  const weakAreas = splitList(body.weakAreas);
  const preferredPath = body.preferredPath ? normalizePath(body.preferredPath) : undefined;
  const goals = String(body.goals || 'I want to grow in cybersecurity but need direction.').slice(0, 3000);

  if (plan !== 'PRO') {
    const todayCount = await prisma.aiCareerCounseling.count({ where: { userId, createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } } });
    if (todayCount >= 2) return NextResponse.json({ error: 'Free plan allows 2 AI career counseling sessions per day. Upgrade to Pro for unlimited guidance.' }, { status: 402 });
  }

  const userStats = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      xp: true, level: true, plan: true,
      progress: { where: { status: 'COMPLETED' }, take: 10, include: { lesson: { select: { title: true } }, course: { select: { title: true } } } },
      challengeAttempts: { where: { isCorrect: true }, take: 10, include: { challenge: { select: { title: true, category: true, difficulty: true } } } },
    },
  });

  const previous = await prisma.aiCareerCounseling.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 5, select: { recommendedPath: true, confidenceScore: true, nextMilestones: true, createdAt: true } });

  const prompt = `Act as CyberQuest AI Career Counselor. Judge which cybersecurity field fits this user best and guide them safely.\n\nFields to compare:\n- SOC Analyst\n- Blue Team Defender\n- Red Team Operator\n- Penetration Tester\n- Bug Bounty Researcher\n- Incident Responder\n- Digital Forensics Analyst\n- Cloud Security Engineer\n- DevSecOps Engineer\n- GRC Analyst\n- Malware Analyst\n- AI Security Specialist\n\nUser level: ${currentLevel}\nPreferred path: ${preferredPath || 'not selected'}\nInterests: ${interests.join(', ') || 'not provided'}\nStrengths: ${strengths.join(', ') || 'not provided'}\nWeak areas: ${weakAreas.join(', ') || 'not provided'}\nCareer goals: ${goals}\nPrivate platform activity for this user only: ${JSON.stringify(userStats)}\nPrevious private counseling records for this user only: ${JSON.stringify(previous)}\n\nReturn these sections clearly:\n1. Recommended Field\n2. Confidence Score 0-100\n3. Why this path fits\n4. Why other paths may not fit yet\n5. SOC Analyst readiness\n6. Blue Team readiness\n7. Red Team readiness\n8. 30-day roadmap\n9. 90-day roadmap\n10. Portfolio projects\n11. Interview preparation plan\n12. Counseling advice with motivation and warnings.\n\nKeep it ethical, defensive, and learning-focused. Do not include offensive real-world exploitation instructions.`;

  const counseling = await generateCyberQuestAI(cybersecuritySystemPrompt(), [{ role: 'user', content: prompt }], 2200);
  const scoreMatch = counseling.match(/(?:Confidence Score|Score)\D*(\d{1,3})/i);
  const confidenceScore = Math.min(100, Math.max(0, scoreMatch ? Number(scoreMatch[1]) : 70));
  const recommendedRaw = careerPaths.find(path => counseling.toUpperCase().includes(path.replaceAll('_', ' '))) || preferredPath || 'SOC_ANALYST';
  const recommendedPath = normalizePath(recommendedRaw);
  const milestones = counseling.split('\n').filter(line => /day|week|project|learn|practice|interview|portfolio|cert/i.test(line)).slice(0, 10).map(line => line.replace(/^[-*\d.\s]+/, '').trim()).filter(Boolean);

  const record = await prisma.aiCareerCounseling.create({
    data: { userId, currentLevel, interests, strengths, weakAreas, preferredPath: preferredPath as any, recommendedPath: recommendedPath as any, confidenceScore, counselingSummary: counseling, roadmap: counseling, nextMilestones: milestones },
  });

  return NextResponse.json({ record });
}
