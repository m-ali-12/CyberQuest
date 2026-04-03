'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, ChevronLeft, ChevronRight, Flag, AlertTriangle, CheckCircle } from 'lucide-react';
import { formatTime } from '@/lib/utils';
import toast from 'react-hot-toast';

interface Props { params: { examId: string } }

export default function ExamPage({ params }: Props) {
  const router = useRouter();
  const [exam, setExam] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQ, setCurrentQ] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    fetch(`/api/exams/${params.examId}`)
      .then(r => r.json())
      .then(d => { setExam(d); setTimeLeft(d.duration * 60); setLoading(false); });
  }, [params.examId]);

  useEffect(() => {
    if (!started || result) return;
    if (timeLeft <= 0) { handleSubmit(); return; }
    const t = setInterval(() => setTimeLeft(s => s - 1), 1000);
    return () => clearInterval(t);
  }, [started, timeLeft, result]);

  const handleSubmit = useCallback(async () => {
    if (submitting || result) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/exams/${params.examId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });
      const data = await res.json();
      setResult(data);
    } catch { toast.error('Submit failed'); }
    finally { setSubmitting(false); }
  }, [answers, params.examId, result, submitting]);

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <div className="w-12 h-12 border-2 border-cyber-blue/30 border-t-cyber-blue rounded-full animate-spin" />
    </div>
  );

  if (!exam) return <div className="text-gray-400 font-mono">Exam not found</div>;

  // Result screen
  if (result) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="cyber-card rounded-2xl p-10 border border-cyber-border text-center">
          <div className="text-6xl mb-4">{result.passed ? '🎉' : '📚'}</div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">
            {result.passed ? 'Exam Passed!' : 'Exam Failed'}
          </h1>
          <p className="text-gray-400 font-mono mb-8">{exam.title}</p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="cyber-card rounded-xl p-4">
              <p className="text-3xl font-display font-bold text-white mb-1">{result.score}%</p>
              <p className="text-gray-500 font-mono text-xs">Your Score</p>
            </div>
            <div className="cyber-card rounded-xl p-4">
              <p className="text-3xl font-display font-bold text-cyber-green mb-1">{exam.passingScore}%</p>
              <p className="text-gray-500 font-mono text-xs">Passing Score</p>
            </div>
            <div className={`cyber-card rounded-xl p-4 ${result.passed ? 'border-cyber-green/30 bg-cyber-green/5' : 'border-cyber-red/30 bg-cyber-red/5'}`}>
              <p className={`text-3xl font-display font-bold mb-1 ${result.passed ? 'text-cyber-green' : 'text-cyber-red'}`}>
                {result.passed ? 'PASS' : 'FAIL'}
              </p>
              <p className="text-gray-500 font-mono text-xs">Result</p>
            </div>
          </div>

          {result.passed && (
            <div className="bg-cyber-green/10 border border-cyber-green/30 rounded-xl p-4 mb-6">
              <p className="text-cyber-green font-bold">+{result.xpEarned} XP Earned!</p>
              <p className="text-gray-400 text-sm font-mono mt-1">Certification will be available shortly</p>
            </div>
          )}

          <div className="flex gap-3 justify-center">
            <button onClick={() => router.back()} className="btn-cyber px-5 py-2.5 rounded-lg text-sm">
              Back to Course
            </button>
            {result.passed && (
              <a href="/dashboard/certifications" className="btn-cyber-solid px-5 py-2.5 rounded-lg text-sm">
                View Certificate
              </a>
            )}
          </div>
        </div>

        {/* Answer review */}
        <div className="mt-6 space-y-3">
          <h2 className="text-white font-bold text-lg">Answer Review</h2>
          {exam.questions.map((q: any, i: number) => {
            const userAns = answers[q.id];
            const correct = userAns === q.answer;
            return (
              <div key={q.id} className={`cyber-card rounded-xl p-4 border ${correct ? 'border-cyber-green/30 bg-cyber-green/5' : 'border-cyber-red/30 bg-cyber-red/5'}`}>
                <div className="flex items-start gap-3 mb-2">
                  {correct ? <CheckCircle className="w-4 h-4 text-cyber-green mt-0.5 flex-shrink-0" /> : <AlertTriangle className="w-4 h-4 text-cyber-red mt-0.5 flex-shrink-0" />}
                  <p className="text-white text-sm font-bold">Q{i + 1}. {q.text}</p>
                </div>
                <p className={`text-xs font-mono ml-7 ${correct ? 'text-cyber-green' : 'text-cyber-red'}`}>
                  Your answer: {q.options[parseInt(userAns)] || userAns || 'Not answered'}
                </p>
                {!correct && <p className="text-xs font-mono text-gray-400 ml-7 mt-0.5">Correct: {q.options[parseInt(q.answer)] || q.answer}</p>}
                {q.explanation && <p className="text-xs text-gray-500 ml-7 mt-1 italic">{q.explanation}</p>}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Intro screen
  if (!started) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="cyber-card rounded-2xl p-10 border border-cyber-border text-center">
          <div className="text-6xl mb-4">📝</div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">{exam.title}</h1>
          <p className="text-gray-400 font-mono mb-8">{exam.description}</p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Questions', value: exam.questions.length },
              { label: 'Duration', value: `${exam.duration} min` },
              { label: 'Pass Score', value: `${exam.passingScore}%` },
            ].map(({ label, value }) => (
              <div key={label} className="cyber-card rounded-xl p-4">
                <p className="text-xl font-display font-bold text-white mb-1">{value}</p>
                <p className="text-gray-500 font-mono text-xs">{label}</p>
              </div>
            ))}
          </div>

          <div className="bg-cyber-yellow/5 border border-cyber-yellow/20 rounded-xl p-4 mb-8 text-left">
            <p className="text-cyber-yellow font-bold text-sm mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Before you start
            </p>
            <ul className="space-y-1 text-gray-400 text-sm font-mono">
              <li>• Timer starts once you click Start</li>
              <li>• You can navigate between questions</li>
              <li>• All unanswered questions count as wrong</li>
              <li>• You need {exam.passingScore}% to pass</li>
            </ul>
          </div>

          <button onClick={() => setStarted(true)} className="btn-cyber-solid px-10 py-3 rounded-lg text-base font-bold">
            Start Exam →
          </button>
        </div>
      </div>
    );
  }

  const question = exam.questions[currentQ];
  const answered = Object.keys(answers).length;
  const timerColor = timeLeft < 300 ? 'text-cyber-red' : timeLeft < 600 ? 'text-cyber-yellow' : 'text-cyber-green';

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Timer + Progress */}
      <div className="flex items-center justify-between cyber-card rounded-xl p-4 border border-cyber-border">
        <div>
          <p className="text-xs text-gray-500 font-mono mb-1">Progress</p>
          <p className="text-white font-bold">{answered}/{exam.questions.length} answered</p>
        </div>
        <div className="flex-1 mx-6 progress-bar h-2">
          <div className="progress-fill" style={{ width: `${(answered / exam.questions.length) * 100}%` }} />
        </div>
        <div className={`flex items-center gap-2 ${timerColor} font-mono font-bold text-lg`}>
          <Clock className="w-5 h-5" /> {formatTime(timeLeft)}
        </div>
      </div>

      {/* Question */}
      <div className="cyber-card rounded-xl border border-cyber-border overflow-hidden">
        <div className="p-6 border-b border-cyber-border bg-black/20">
          <div className="flex items-center justify-between mb-4">
            <span className="badge bg-cyber-blue/10 text-cyber-blue border-cyber-blue/30">
              Question {currentQ + 1} of {exam.questions.length}
            </span>
            <span className="text-gray-500 font-mono text-sm">{question.points} pts</span>
          </div>
          <p className="text-white text-lg leading-relaxed">{question.text}</p>
        </div>

        <div className="p-6 space-y-3">
          {question.options.map((opt: string, idx: number) => {
            const selected = answers[question.id] === String(idx);
            return (
              <button
                key={idx}
                onClick={() => setAnswers(prev => ({ ...prev, [question.id]: String(idx) }))}
                className={`w-full text-left p-4 rounded-xl border font-mono text-sm transition-all ${
                  selected
                    ? 'border-cyber-blue bg-cyber-blue/10 text-cyber-blue'
                    : 'border-cyber-border hover:border-cyber-blue/30 hover:bg-cyber-blue/5 text-gray-300'
                }`}
              >
                <span className={`font-bold mr-3 ${selected ? 'text-cyber-blue' : 'text-gray-500'}`}>
                  {String.fromCharCode(65 + idx)}.
                </span>
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button onClick={() => setCurrentQ(q => Math.max(0, q - 1))} disabled={currentQ === 0}
          className="flex items-center gap-2 btn-cyber px-4 py-2.5 rounded-lg text-sm disabled:opacity-40">
          <ChevronLeft className="w-4 h-4" /> Prev
        </button>

        {/* Question dots */}
        <div className="flex gap-1.5 flex-wrap justify-center max-w-md">
          {exam.questions.map((_: any, i: number) => (
            <button key={i} onClick={() => setCurrentQ(i)}
              className={`w-7 h-7 rounded text-xs font-mono font-bold transition-all ${
                i === currentQ ? 'bg-cyber-blue text-white' :
                answers[exam.questions[i].id] ? 'bg-cyber-green/20 text-cyber-green border border-cyber-green/30' :
                'bg-cyber-card border border-cyber-border text-gray-500 hover:border-gray-400'
              }`}>
              {i + 1}
            </button>
          ))}
        </div>

        {currentQ < exam.questions.length - 1 ? (
          <button onClick={() => setCurrentQ(q => q + 1)} className="flex items-center gap-2 btn-cyber px-4 py-2.5 rounded-lg text-sm">
            Next <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button onClick={handleSubmit} disabled={submitting}
            className="flex items-center gap-2 btn-cyber-solid px-5 py-2.5 rounded-lg text-sm">
            <Flag className="w-4 h-4" /> {submitting ? 'Submitting...' : 'Submit Exam'}
          </button>
        )}
      </div>
    </div>
  );
}
