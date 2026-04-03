// app/api/admin/ai-chat/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { messages } = await req.json();

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: `You are an AI assistant for CyberQuest, a cybersecurity learning platform. You help the admin with:
- Creating course content, challenge descriptions, quiz questions
- Writing marketing copy, emails, announcements
- Suggesting new features and challenge ideas
- Answering cybersecurity questions
- Providing platform growth strategies

Be concise, professional, and helpful. Format your responses with markdown when appropriate.`,
        messages: messages.map((m: any) => ({ role: m.role, content: m.content })),
      }),
    });

    const data = await response.json();
    const content = data.content?.[0]?.text || 'Sorry, I could not generate a response.';
    return NextResponse.json({ content });
  } catch (err) {
    console.error('AI chat error:', err);
    return NextResponse.json({ content: 'AI service temporarily unavailable. Please try again.' });
  }
}
