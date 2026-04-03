'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, CheckCircle, Zap, BookOpen, Code, HelpCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface Props {
  params: { slug: string; lessonId: string };
}

export default function LessonPage({ params }: Props) {
  const router = useRouter();
  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizResult, setQuizResult] = useState<'correct' | 'wrong' | null>(null);
  const [xpPopup, setXpPopup] = useState<number | null>(null);
  const [startTime] = useState(Date.now());
  const [sectionIdx, setSectionIdx] = useState(0);

  useEffect(() => {
    fetch(`/api/lessons/${params.lessonId}`)
      .then(r => r.json())
      .then(d => { setLesson(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [params.lessonId]);

  const handleComplete = async () => {
    if (completed) return;
    try {
      const res = await fetch(`/api/lessons/${params.lessonId}/complete`, { method: 'POST' });
      const data = await res.json();
      if (data.xpEarned) {
        setXpPopup(data.xpEarned);
        setCompleted(true);
        toast.success(`🎉 Lesson complete! +${data.xpEarned} XP`);
        setTimeout(() => {
          setXpPopup(null);
          if (data.nextLessonId) {
            router.push(`/dashboard/courses/${params.slug}/lesson/${data.nextLessonId}`);
          } else {
            router.push(`/dashboard/courses/${params.slug}`);
          }
        }, 2000);
      }
    } catch { toast.error('Error saving progress'); }
  };

  const handleQuiz = (optIdx: number) => {
    if (!lesson || quizResult) return;
    const content = JSON.parse(lesson.content || '{}');
    const quiz = content.sections?.find((s: any) => s.type === 'quiz');
    if (!quiz) return;
    setQuizAnswer(optIdx);
    if (optIdx === quiz.answer) {
      setQuizResult('correct');
      toast.success('✅ Correct!');
    } else {
      setQuizResult('wrong');
      toast.error('❌ Wrong answer. Try again!');
      setTimeout(() => { setQuizResult(null); setQuizAnswer(null); }, 1500);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-cyber-green/30 border-t-cyber-green rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 font-mono text-sm">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (!lesson) return <div className="text-gray-400 font-mono">Lesson not found.</div>;

  let content: any = {};
  try { content = JSON.parse(lesson.content); } catch {}
  const sections = content.sections || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* XP Popup */}
      {xpPopup && (
        <div className="fixed top-24 right-8 z-50 bg-cyber-green text-black font-bold font-mono px-5 py-3 rounded-xl shadow-cyber xp-popup text-lg">
          +{xpPopup} XP ⚡
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="w-9 h-9 rounded-lg border border-cyber-border flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-500 transition-all">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1">
          <p className="text-gray-500 font-mono text-xs mb-1">{lesson.moduleTitle}</p>
          <h1 className="text-xl font-display font-bold text-white">{lesson.title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-cyber-green font-mono text-sm">
            <Zap className="w-4 h-4" />{lesson.xpReward} XP
          </span>
          {lesson.type === 'LAB' && (
            <span className="badge bg-cyber-blue/10 text-cyber-blue border border-cyber-blue/30">LAB</span>
          )}
        </div>
      </div>

      {/* Lesson content */}
      <div className="cyber-card rounded-xl border border-cyber-border overflow-hidden">
        <div className="p-6 space-y-6">
          {sections.map((section: any, i: number) => (
            <div key={i}>
              {section.type === 'intro' && (
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-cyber-blue/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <BookOpen className="w-4 h-4 text-cyber-blue" />
                  </div>
                  <p className="text-gray-300 leading-relaxed text-base">{section.text}</p>
                </div>
              )}

              {section.type === 'keypoint' && (
                <div className="border-l-4 border-cyber-green bg-cyber-green/5 rounded-r-xl p-4">
                  <p className="text-xs font-mono text-cyber-green uppercase tracking-wider mb-1">Key Point</p>
                  <p className="text-white leading-relaxed">{section.text}</p>
                </div>
              )}

              {section.type === 'example' && (
                <div className="border-l-4 border-cyber-blue bg-cyber-blue/5 rounded-r-xl p-4">
                  <p className="text-xs font-mono text-cyber-blue uppercase tracking-wider mb-1">Example</p>
                  <p className="text-gray-300 leading-relaxed">{section.text}</p>
                </div>
              )}

              {section.type === 'scenario' && (
                <div className="border-l-4 border-cyber-yellow bg-cyber-yellow/5 rounded-r-xl p-4">
                  <p className="text-xs font-mono text-cyber-yellow uppercase tracking-wider mb-1">Scenario</p>
                  <p className="text-gray-300 leading-relaxed">{section.text}</p>
                </div>
              )}

              {section.type === 'list' && (
                <div className="cyber-card rounded-xl p-5 bg-black/20">
                  <p className="text-white font-bold mb-3">{section.title}</p>
                  <ul className="space-y-2">
                    {section.items?.map((item: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3 text-gray-300">
                        <span className="text-cyber-green font-mono text-sm mt-0.5">{'>'}</span>
                        <span className="font-mono text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {section.type === 'layers' && (
                <div className="grid grid-cols-7 gap-2">
                  {section.layers?.map((layer: string, idx: number) => {
                    const colors = ['bg-cyber-red/20 border-cyber-red/40', 'bg-orange-500/20 border-orange-500/40', 'bg-cyber-yellow/20 border-cyber-yellow/40', 'bg-cyber-green/20 border-cyber-green/40', 'bg-cyber-blue/20 border-cyber-blue/40', 'bg-cyber-purple/20 border-cyber-purple/40', 'bg-pink-500/20 border-pink-500/40'];
                    return (
                      <div key={idx} className={`rounded-lg border p-2 text-center ${colors[idx]}`}>
                        <p className="text-white text-xs font-bold font-mono">{idx + 1}</p>
                        <p className="text-white text-[10px] mt-1">{layer}</p>
                      </div>
                    );
                  })}
                </div>
              )}

              {section.type === 'mnemonic' && (
                <div className="bg-cyber-purple/10 border border-cyber-purple/30 rounded-xl p-4">
                  <p className="text-xs font-mono text-cyber-purple uppercase tracking-wider mb-1">Memory Trick</p>
                  <p className="text-white font-bold">{section.text}</p>
                </div>
              )}

              {section.type === 'code' && (
                <div className="code-block">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Code className="w-4 h-4 text-cyber-green" />
                      <span className="text-cyber-green font-mono text-xs uppercase">{section.language}</span>
                    </div>
                    <button
                      onClick={() => { navigator.clipboard.writeText(section.code); toast.success('Copied!'); }}
                      className="text-xs text-gray-500 hover:text-white font-mono transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                  <pre className="text-cyber-green font-mono text-sm overflow-x-auto whitespace-pre-wrap">{section.code}</pre>
                </div>
              )}

              {section.type === 'quiz' && (
                <div className="bg-black/30 border border-cyber-border rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <HelpCircle className="w-5 h-5 text-cyber-yellow" />
                    <p className="text-white font-bold">Quick Check</p>
                  </div>
                  <p className="text-gray-200 mb-4 leading-relaxed">{section.question}</p>
                  <div className="grid grid-cols-1 gap-2">
                    {section.options?.map((opt: string, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => handleQuiz(idx)}
                        disabled={!!quizResult && quizAnswer !== idx}
                        className={`text-left p-3 rounded-lg border font-mono text-sm transition-all ${
                          quizAnswer === idx
                            ? quizResult === 'correct'
                              ? 'border-cyber-green bg-cyber-green/10 text-cyber-green'
                              : 'border-cyber-red bg-cyber-red/10 text-cyber-red'
                            : 'border-cyber-border hover:border-cyber-blue/50 hover:bg-cyber-blue/5 text-gray-300'
                        }`}
                      >
                        <span className="text-gray-500 mr-2">{String.fromCharCode(65 + idx)}.</span> {opt}
                      </button>
                    ))}
                  </div>
                  {quizResult === 'correct' && (
                    <p className="text-cyber-green font-mono text-sm mt-3 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" /> Correct! Great job.
                    </p>
                  )}
                </div>
              )}

              {section.type === 'lab' && (
                <div className="border border-cyber-blue/30 bg-cyber-blue/5 rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🧪</span>
                    <p className="text-cyber-blue font-bold">Hands-on Lab</p>
                  </div>
                  <p className="text-gray-300 text-sm mb-4">{section.description}</p>
                  <a href={`/labs/${section.labId}`} target="_blank" className="btn-cyber text-sm px-4 py-2 rounded-lg inline-flex items-center gap-2">
                    Launch Lab Environment <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Complete button */}
        <div className="border-t border-cyber-border p-6 bg-black/20 flex items-center justify-between">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-400 hover:text-white font-mono text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" /> Previous
          </button>
          <button
            onClick={handleComplete}
            disabled={completed}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold font-mono text-sm transition-all ${
              completed
                ? 'bg-cyber-green/20 text-cyber-green border border-cyber-green/30 cursor-not-allowed'
                : 'btn-cyber-solid'
            }`}
          >
            {completed ? (
              <><CheckCircle className="w-4 h-4" /> Completed!</>
            ) : (
              <>Complete & Next <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
