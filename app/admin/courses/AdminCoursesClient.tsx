'use client';
import { useState } from 'react';
import { BookOpen, Lock, Unlock, Eye, EyeOff, Edit3, Users } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminCoursesClient({ courses: initial }: { courses: any[] }) {
  const [courses, setCourses] = useState(initial);
  const [loading, setLoading] = useState<string | null>(null);

  const togglePremium = async (courseId: string, isPremium: boolean) => {
    setLoading(courseId);
    try {
      const res = await fetch(`/api/admin/courses/${courseId}/toggle-premium`, { method: 'POST' });
      if (res.ok) {
        setCourses(p => p.map(c => c.id === courseId ? { ...c, isPremium: !isPremium } : c));
        toast.success(`Course ${!isPremium ? 'locked to Pro' : 'made Free'}`);
      }
    } catch { toast.error('Failed'); } finally { setLoading(null); }
  };

  const diffColor: Record<string, string> = {
    BEGINNER: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    INTERMEDIATE: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    ADVANCED: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
    EXPERT: 'text-red-400 bg-red-400/10 border-red-400/20',
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Course <span className="text-purple-400">Management</span></h1>
          <p className="text-gray-400 font-mono text-sm">{courses.length} courses · {courses.filter(c => c.isPremium).length} premium</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {courses.map(course => (
          <div key={course.id} className={`rounded-xl border bg-[#0f0f18] overflow-hidden transition-all hover:scale-[1.01] ${course.isPremium ? 'border-yellow-500/20' : 'border-gray-700'}`}>
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <span className="text-4xl">{course.icon}</span>
                <div className="flex flex-col items-end gap-1">
                  <span className={`px-2 py-0.5 rounded-md text-xs font-mono font-bold border ${diffColor[course.difficulty] || 'text-gray-400 bg-gray-400/10 border-gray-400/20'}`}>
                    {course.difficulty}
                  </span>
                  <span className={`px-2 py-0.5 rounded-md text-xs font-mono font-bold border ${course.isPremium ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' : 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'}`}>
                    {course.isPremium ? '🔒 PRO' : '🆓 FREE'}
                  </span>
                </div>
              </div>
              <h3 className="text-white font-bold text-base mb-1">{course.title}</h3>
              <p className="text-gray-400 text-xs font-mono mb-4 leading-relaxed line-clamp-2">{course.description}</p>

              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                  { label: 'Modules', value: course._count.modules },
                  { label: 'Lessons', value: course.lessonCount },
                  { label: 'Enrolled', value: course.enrollments },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-black/30 rounded-lg p-2 text-center border border-gray-800">
                    <p className="text-white font-bold text-sm">{value}</p>
                    <p className="text-gray-500 font-mono text-[10px]">{label}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <button onClick={() => togglePremium(course.id, course.isPremium)} disabled={loading === course.id}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-mono border transition-all ${course.isPremium ? 'border-emerald-400/30 text-emerald-400 hover:bg-emerald-400/10' : 'border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10'}`}>
                  {loading === course.id ? '...' : course.isPremium ? <><Unlock className="w-3 h-3" /> Make Free</> : <><Lock className="w-3 h-3" /> Make Pro</>}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
