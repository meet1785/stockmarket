import { useState, useEffect } from 'react';
import { BookOpen, CheckCircle, Award, Target, TrendingUp, ShieldAlert, CheckCircle2, ChevronRight, ChevronDown } from 'lucide-react';
import { LESSONS } from '../utils/constants';
import { useAuthStore } from '../stores/authStore';
import { loadFromStorage, saveToStorage } from '../services/storage';
import type { Lesson, QuizQuestion } from '../types';

export default function LearningPage() {
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizResults, setQuizResults] = useState<Record<string, { correct: boolean; explanation: string; correctIdx?: number }>>({});
  const addXP = useAuthStore(s => s.addXP);

  useEffect(() => {
    setCompletedLessons(loadFromStorage<string[]>('completedLessons', []));
  }, []);

  const saveCompleted = (ids: string[]) => { setCompletedLessons(ids); saveToStorage('completedLessons', ids); };

  const handleQuizSubmit = (lessonId: string, quiz: QuizQuestion) => {
    if (quizAnswers[lessonId] === undefined) return;
    const isCorrect = quizAnswers[lessonId] === quiz.correctIndex;
    setQuizResults(prev => ({ ...prev, [lessonId]: { correct: isCorrect, explanation: quiz.explanation, correctIdx: quiz.correctIndex } }));
    if (isCorrect && !completedLessons.includes(lessonId)) {
      saveCompleted([...completedLessons, lessonId]);
      addXP(50);
    }
  };

  const categories = [...new Set(LESSONS.map(l => l.category))];
  const progress = LESSONS.length > 0 ? (completedLessons.length / LESSONS.length) * 100 : 0;

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Basics': return <BookOpen className="w-5 h-5 text-brand-400" />;
      case 'Trading': return <Target className="w-5 h-5 text-brand-400" />;
      case 'Technical Analysis': return <TrendingUp className="w-5 h-5 text-brand-400" />;
      case 'Risk': return <ShieldAlert className="w-5 h-5 text-brand-400" />;
      default: return <BookOpen className="w-5 h-5 text-brand-400" />;
    }
  };

  const getLevelBadge = (level: number) => {
    if (level <= 1) return 'bg-green-500/20 text-green-400';
    if (level <= 2) return 'bg-yellow-500/20 text-yellow-400';
    return 'bg-red-500/20 text-red-400';
  };

  const getLevelLabel = (level: number) => {
    if (level <= 1) return 'Beginner';
    if (level <= 2) return 'Intermediate';
    return 'Advanced';
  };

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><BookOpen className="w-6 h-6 text-brand-400" /> Learning Academy</h1>
          <p className="text-gray-400 text-sm mt-1">Master trading concepts step by step</p>
        </div>
        <div className="card p-4 min-w-[250px]">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Progress</span><span>{completedLessons.length}/{LESSONS.length}</span>
          </div>
          <div className="h-2 w-full bg-surface-2 rounded-full overflow-hidden">
            <div className="h-full bg-brand-600 transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      {categories.map(cat => (
        <div key={cat} className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2 border-b border-gray-700/50 pb-2">{getCategoryIcon(cat)} {cat}</h2>
          <div className="grid gap-4">
            {LESSONS.filter(l => l.category === cat).map(lesson => {
              const isExpanded = expandedLesson === lesson.id;
              const isCompleted = completedLessons.includes(lesson.id);
              const quiz = lesson.quiz?.[0]; // Use first quiz question

              return (
                <div key={lesson.id} className={`card overflow-hidden transition-all ${isExpanded ? 'ring-1 ring-brand-500/30' : ''}`}>
                  <div className="p-4 cursor-pointer flex items-center justify-between hover:bg-surface-2/50" onClick={() => setExpandedLesson(isExpanded ? null : lesson.id)}>
                    <div className="flex items-center gap-4">
                      {isCompleted ? <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0" /> : <div className="w-6 h-6 rounded-full border-2 border-gray-600 flex-shrink-0" />}
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{lesson.title}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getLevelBadge(lesson.level)}`}>{getLevelLabel(lesson.level)}</span>
                        </div>
                        <p className="text-sm text-gray-400 line-clamp-1">{lesson.description}</p>
                      </div>
                    </div>
                    {isExpanded ? <ChevronDown className="text-gray-400 w-5 h-5" /> : <ChevronRight className="text-gray-400 w-5 h-5" />}
                  </div>

                  {isExpanded && (
                    <div className="border-t border-gray-700/50 p-4 md:p-6 space-y-6">
                      <div className="prose prose-invert max-w-none text-sm md:text-base leading-relaxed whitespace-pre-wrap">{lesson.content}</div>

                      {quiz && (
                        <div className="bg-surface-2/50 rounded-xl p-4 md:p-6 border border-gray-700/50">
                          <h4 className="font-semibold mb-4 flex items-center gap-2"><Award className="w-5 h-5 text-brand-400" /> Knowledge Check</h4>
                          <p className="mb-4">{quiz.question}</p>
                          <div className="space-y-2 mb-4">
                            {quiz.options.map((option: string, idx: number) => (
                              <label key={idx} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${quizAnswers[lesson.id] === idx ? 'border-brand-500 bg-brand-500/10' : 'border-gray-600 hover:bg-surface-2'}`}>
                                <input type="radio" name={`quiz-${lesson.id}`} checked={quizAnswers[lesson.id] === idx} onChange={() => setQuizAnswers(prev => ({ ...prev, [lesson.id]: idx }))} className="w-4 h-4 accent-brand-600" disabled={!!quizResults[lesson.id]?.correct} />
                                {option}
                              </label>
                            ))}
                          </div>
                          {!quizResults[lesson.id]?.correct && (
                            <button className="btn-primary" onClick={() => handleQuizSubmit(lesson.id, quiz)} disabled={quizAnswers[lesson.id] === undefined}>Submit Answer</button>
                          )}
                          {quizResults[lesson.id] && (
                            <div className={`mt-4 p-4 rounded-lg flex gap-3 ${quizResults[lesson.id].correct ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                              {quizResults[lesson.id].correct ? <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" /> : <ShieldAlert className="w-5 h-5 mt-0.5 flex-shrink-0" />}
                              <div>
                                <p className="font-semibold mb-1">{quizResults[lesson.id].correct ? 'Correct! +50 XP 🎉' : 'Not quite right.'}</p>
                                {!quizResults[lesson.id].correct && quizResults[lesson.id].correctIdx !== undefined && (
                                  <p className="text-sm opacity-90 mb-1">Correct answer: <strong>{quiz.options[quizResults[lesson.id].correctIdx!]}</strong></p>
                                )}
                                <p className="text-sm opacity-90">{quizResults[lesson.id].explanation}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
