export type AiMessage = { role: 'user' | 'assistant'; content: string };

export async function generateCyberQuestAI(system: string, messages: AiMessage[], maxTokens = 1400) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    const last = messages[messages.length - 1]?.content || '';
    return `AI demo mode is active because ANTHROPIC_API_KEY is not configured.\n\nRequest received:\n${last}\n\nRecommended next step: add your AI API key in .env, redeploy, and this feature will generate fresh personalized cybersecurity guidance for every user.`;
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: process.env.AI_MODEL || 'claude-sonnet-4-20250514',
      max_tokens: maxTokens,
      system,
      messages,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`AI provider error ${response.status}: ${text}`);
  }

  const data = await response.json();
  return data.content?.[0]?.text || 'AI could not generate a response right now.';
}

export function cybersecuritySystemPrompt() {
  return `You are CyberQuest AI, an ethical cybersecurity learning assistant.
Rules:
- Help only with defensive, educational, legal cybersecurity learning.
- Do not provide real-world exploitation steps, credential theft, malware, persistence, evasion, or unauthorized attack instructions.
- Give safe lab-based guidance, learning roadmaps, risk ratings, mock interview questions, and improvement feedback.
- Keep advice current by focusing on modern domains: cloud security, AI security, identity, web security, SOC, incident response, malware analysis concepts, DevSecOps, bug bounty ethics, and governance.
- Personalize answers to the user's level and previous record when provided.
- Never reveal another user's record.`;
}
