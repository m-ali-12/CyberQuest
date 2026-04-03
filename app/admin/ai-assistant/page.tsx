'use client';
import { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Sparkles, RefreshCw, Copy } from 'lucide-react';
import toast from 'react-hot-toast';

interface Message { role: 'user' | 'assistant'; content: string; time: Date; }

const QUICK_PROMPTS = [
  'How many users signed up this week?',
  'Write a new cybersecurity challenge about XSS',
  'Generate a module description for "Network Hacking"',
  'Suggest 5 new CTF challenge ideas',
  'Write course description for "Cloud Security"',
  'How can I improve user retention?',
  'Draft email to announce Pro plan features',
  'Create quiz questions about SQL Injection',
];

export default function AdminAIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '👋 Hello! I\'m your CyberQuest AI Assistant. I can help you:\n\n• **Create content** — challenges, course descriptions, quiz questions\n• **Write communications** — emails, announcements\n• **Generate ideas** — new features, challenge concepts\n• **Answer questions** — cybersecurity topics, platform strategy\n\nWhat can I help you with today?',
      time: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');

    const userMsg: Message = { role: 'user', content: msg, time: new Date() };
    setMessages(p => [...p, userMsg]);
    setLoading(true);

    try {
      const res = await fetch('/api/admin/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })) }),
      });
      const data = await res.json();
      setMessages(p => [...p, { role: 'assistant', content: data.content || 'Sorry, something went wrong.', time: new Date() }]);
    } catch {
      setMessages(p => [...p, { role: 'assistant', content: '⚠️ Connection error. Please try again.', time: new Date() }]);
    } finally { setLoading(false); }
  };

  const copyMsg = (content: string) => { navigator.clipboard.writeText(content); toast.success('Copied!'); };
  const clearChat = () => setMessages([{ role: 'assistant', content: 'Chat cleared. How can I help you?', time: new Date() }]);

  const formatContent = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="text-gray-300">$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-black/50 text-emerald-400 px-1 rounded font-mono text-xs">$1</code>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <div className="flex flex-col h-screen p-8 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-500/20 rounded-xl border border-purple-500/30 flex items-center justify-center">
            <Bot className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">AI <span className="text-purple-400">Assistant</span></h1>
            <p className="text-gray-400 font-mono text-xs">Powered by Claude AI · For admins only</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-emerald-400/10 border border-emerald-400/20 rounded-full px-3 py-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 font-mono text-xs">Online</span>
          </div>
          <button onClick={clearChat} className="flex items-center gap-1.5 bg-gray-500/10 border border-gray-500/20 text-gray-400 px-3 py-1.5 rounded-lg text-xs font-mono hover:border-gray-400/40 transition-all">
            <RefreshCw className="w-3 h-3" /> Clear
          </button>
        </div>
      </div>

      {/* Quick Prompts */}
      <div className="flex gap-2 flex-wrap flex-shrink-0">
        {QUICK_PROMPTS.slice(0, 4).map(p => (
          <button key={p} onClick={() => sendMessage(p)}
            className="text-xs font-mono px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 text-purple-300 rounded-lg hover:border-purple-400/40 hover:bg-purple-500/15 transition-all">
            {p}
          </button>
        ))}
      </div>

      {/* Chat */}
      <div className="flex-1 overflow-y-auto rounded-xl border border-gray-800 bg-[#0f0f18] p-4 space-y-4 min-h-0">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-blue-500/20 border border-blue-500/30' : 'bg-purple-500/20 border border-purple-500/30'}`}>
              {msg.role === 'user' ? <User className="w-4 h-4 text-blue-400" /> : <Bot className="w-4 h-4 text-purple-400" />}
            </div>
            <div className={`flex-1 max-w-3xl ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
              <div className={`rounded-xl px-4 py-3 text-sm leading-relaxed ${msg.role === 'user' ? 'bg-blue-500/10 border border-blue-500/20 text-gray-200 ml-12' : 'bg-gray-800/50 border border-gray-700 text-gray-300 mr-12'}`}
                dangerouslySetInnerHTML={{ __html: formatContent(msg.content) }} />
              <div className={`flex items-center gap-2 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                <span className="text-gray-600 font-mono text-[10px]">{msg.time.toLocaleTimeString()}</span>
                {msg.role === 'assistant' && (
                  <button onClick={() => copyMsg(msg.content)} className="text-gray-600 hover:text-gray-400 transition-colors">
                    <Copy className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
              <Bot className="w-4 h-4 text-purple-400" />
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 flex items-center gap-2">
              <div className="flex gap-1">
                {[0,1,2].map(i => (
                  <div key={i} className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
              <span className="text-gray-400 text-xs font-mono">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* More quick prompts */}
      <div className="flex gap-2 flex-wrap flex-shrink-0">
        {QUICK_PROMPTS.slice(4).map(p => (
          <button key={p} onClick={() => sendMessage(p)}
            className="text-xs font-mono px-3 py-1.5 bg-gray-500/10 border border-gray-500/20 text-gray-400 rounded-lg hover:border-gray-400/40 hover:text-white transition-all">
            {p}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-3 flex-shrink-0">
        <div className="flex-1 relative">
          <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            placeholder="Ask me anything — create content, generate ideas, get help..."
            className="w-full bg-[#0f0f18] border border-gray-700 rounded-xl pl-10 pr-4 py-3.5 text-white text-sm font-mono focus:outline-none focus:border-purple-500/50 placeholder-gray-600 transition-colors"
          />
        </div>
        <button onClick={() => sendMessage()} disabled={loading || !input.trim()}
          className="bg-purple-500/20 border border-purple-500/30 text-purple-400 px-5 rounded-xl hover:bg-purple-500/30 hover:border-purple-400/50 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
