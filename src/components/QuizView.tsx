import React, { useState, useMemo } from 'react';
import { 
  HelpCircle, 
  Award, 
  Check, 
  X, 
  RotateCcw, 
  ChevronRight, 
  Sparkles, 
  Trophy,
  BookOpen
} from 'lucide-react';
import { Chapter, JilidId, QuizQuestion } from '../types';
import { JILID_LIST } from '../data/jilids';
import { IslamicStarIcon, ArabesqueDivider } from './IslamicPattern';

interface QuizViewProps {
  chapters: Chapter[];
  onOpenChapter: (chapterId: string) => void;
  onSaveQuizScore: (chapterId: string, score: number, total: number) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({
  chapters,
  onOpenChapter,
  onSaveQuizScore,
}) => {
  const [selectedJilid, setSelectedJilid] = useState<number | 'all'>('all');
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Pool questions based on selected jilid
  const quizPool = useMemo(() => {
    const questions: Array<{
      question: QuizQuestion;
      chapterNumber: number;
      chapterTitle: string;
      chapterId: string;
    }> = [];

    const targetChapters = selectedJilid === 'all'
      ? chapters
      : chapters.filter((c) => c.jilidId === selectedJilid);

    targetChapters.forEach((ch) => {
      ch.quizQuestions.forEach((q) => {
        questions.push({
          question: q,
          chapterNumber: ch.number,
          chapterTitle: ch.title,
          chapterId: ch.id,
        });
      });
    });

    // Shuffle and pick 10 questions
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 10);
  }, [chapters, selectedJilid, quizStarted]);

  const handleStartQuiz = () => {
    setUserAnswers({});
    setCurrentQuestionIndex(0);
    setQuizCompleted(false);
    setQuizStarted(true);
  };

  const handleSelectOption = (optIndex: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: optIndex,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < quizPool.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setQuizCompleted(true);
      // Save score for record
      const score = Object.entries(userAnswers).filter(
        ([idx, ans]) => ans === quizPool[Number(idx)]?.question.correctAnswerIndex
      ).length;
      onSaveQuizScore('overall_quiz', score, quizPool.length);
    }
  };

  const currentItem = quizPool[currentQuestionIndex];

  // Final score calculation
  const score = Object.entries(userAnswers).filter(
    ([idx, ans]) => ans === quizPool[Number(idx)]?.question.correctAnswerIndex
  ).length;
  const percentage = Math.round((score / (quizPool.length || 1)) * 100);

  const getEvaluationTitle = (pct: number) => {
    if (pct >= 90) return { title: 'Mumtaz! (Istimewa)', desc: 'Masya Allah! Pemahaman akidah Anda sangat mendalam dan kokoh.' };
    if (pct >= 75) return { title: 'Jayyid Jiddan (Sangat Baik)', desc: 'Alhamdulillah, Anda telah menguasai sebagian besar pokok pembahasan dengan baik.' };
    if (pct >= 60) return { title: 'Jayyid (Baik)', desc: 'Pemahaman yang baik, teruslah mengulang materi dan mentadabburi dalil.' };
    return { title: 'Perlu Muraja\'ah (Peningkatan)', desc: 'Silakan membaca ulang bab-bab materi dan mengecek kembali dalil-dalilnya.' };
  };

  return (
    <div className="space-y-8 pb-16 max-w-3xl mx-auto">
      
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
          <IslamicStarIcon size={16} />
          <span>Uji Pemahaman Mandiri</span>
        </div>
        <h1 className="font-display text-2xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100">
          Kuis Akidah Islam
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-md mx-auto">
          Uji wawasan dan penguasaan ilmu akidah Anda dengan 10 soal acak yang bersumber langsung dari dalil Al-Qur'an dan Sunnah.
        </p>
      </div>

      {!quizStarted ? (
        <div className="p-8 rounded-3xl bg-white dark:bg-[#121c18] border border-stone-200 dark:border-stone-800 shadow-sm space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center mx-auto border border-emerald-300/40">
            <Trophy size={32} />
          </div>

          <div className="space-y-2">
            <h2 className="font-display text-xl font-bold text-stone-900 dark:text-stone-100">
              Pilih Ruang Lingkup Materi Kuis
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
              Anda dapat menguji seluruh 50 bab kurikulum sekaligus, atau fokus menguji salah satu jilid tertentu.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto">
            <button
              onClick={() => setSelectedJilid('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                selectedJilid === 'all'
                  ? 'bg-emerald-800 text-amber-200 shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-900 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800'
              }`}
            >
              Semua Jilid (Komprehensif)
            </button>
            {JILID_LIST.map((j) => (
              <button
                key={j.id}
                onClick={() => setSelectedJilid(j.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                  selectedJilid === j.id
                    ? 'bg-emerald-800 text-amber-200 shadow-xs'
                    : 'bg-stone-100 dark:bg-stone-900 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800'
                }`}
              >
                Jilid {j.numberRoman}
              </button>
            ))}
          </div>

          <div className="pt-4">
            <button
              onClick={handleStartQuiz}
              className="px-8 py-3.5 rounded-xl text-sm font-bold bg-emerald-800 text-amber-200 hover:bg-emerald-700 transition shadow-md"
            >
              Mulai Kuis 10 Soal Sekarang
            </button>
          </div>
        </div>
      ) : !quizCompleted && currentItem ? (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#121c18] border border-stone-200 dark:border-stone-800 shadow-md space-y-6">
          
          {/* Progress bar inside quiz */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-500">
              <span>Soal {currentQuestionIndex + 1} dari {quizPool.length}</span>
              <span className="text-emerald-700 dark:text-emerald-400">
                Bab {currentItem.chapterNumber}: {currentItem.chapterTitle}
              </span>
            </div>
            <div className="w-full bg-stone-100 dark:bg-stone-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / quizPool.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Text */}
          <div className="space-y-1">
            <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 leading-relaxed">
              {currentItem.question.question}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentItem.question.options.map((option, optIdx) => {
              const isSelected = userAnswers[currentQuestionIndex] === optIdx;
              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(optIdx)}
                  className={`w-full text-left p-4 rounded-xl text-xs sm:text-sm border transition flex items-center gap-3 ${
                    isSelected
                      ? 'border-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-100 font-semibold'
                      : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-900 text-stone-800 dark:text-stone-200'
                  }`}
                >
                  <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center font-bold text-xs shrink-0">
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <span className="flex-1">{option}</span>
                </button>
              );
            })}
          </div>

          {/* Next Button */}
          <div className="pt-4 flex justify-end">
            <button
              onClick={handleNext}
              disabled={userAnswers[currentQuestionIndex] === undefined}
              className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-800 text-amber-200 hover:bg-emerald-700 disabled:opacity-40 transition flex items-center gap-2 shadow-xs"
            >
              <span>{currentQuestionIndex < quizPool.length - 1 ? 'Soal Berikutnya' : 'Selesaikan Kuis'}</span>
              <ChevronRight size={16} />
            </button>
          </div>

        </div>
      ) : (
        /* Quiz Completed Screen */
        <div className="p-8 rounded-3xl bg-white dark:bg-[#121c18] border border-stone-200 dark:border-stone-800 shadow-md text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto border-2 border-amber-400">
            <Trophy size={40} />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Hasil Evaluasi Kuis</span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100">
              {getEvaluationTitle(percentage).title}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-md mx-auto">
              {getEvaluationTitle(percentage).desc}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-700/20 max-w-sm mx-auto space-y-1">
            <span className="text-xs font-semibold text-stone-500">Skor Akhir Anda</span>
            <p className="text-4xl font-extrabold text-emerald-800 dark:text-emerald-300">
              {score} / {quizPool.length}
            </p>
            <p className="text-xs font-bold text-amber-600 dark:text-amber-400">
              Persentase: {percentage}%
            </p>
          </div>

          {/* Detailed Question Review */}
          <div className="text-left space-y-4 pt-4 border-t border-stone-200 dark:border-stone-800">
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
              Tinjauan Kunci Jawaban & Penjelasan:
            </h3>

            <div className="space-y-4">
              {quizPool.map((item, idx) => {
                const userAns = userAnswers[idx];
                const isCorrect = userAns === item.question.correctAnswerIndex;

                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border text-xs sm:text-sm space-y-2 ${
                      isCorrect 
                        ? 'border-emerald-300/60 bg-emerald-50/40 dark:bg-emerald-950/30' 
                        : 'border-red-300/60 bg-red-50/40 dark:bg-red-950/30'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="flex items-center gap-1.5">
                        {isCorrect ? <Check size={16} className="text-emerald-600" /> : <X size={16} className="text-red-500" />}
                        <span>Soal {idx + 1} • Bab {item.chapterNumber}</span>
                      </span>
                      <button
                        onClick={() => onOpenChapter(item.chapterId)}
                        className="text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
                      >
                        <BookOpen size={13} />
                        <span>Pelajari Bab</span>
                      </button>
                    </div>

                    <p className="font-semibold text-stone-900 dark:text-stone-100">
                      {item.question.question}
                    </p>

                    <p className="text-xs text-stone-600 dark:text-stone-300">
                      Jawaban Anda: <strong className={isCorrect ? 'text-emerald-700' : 'text-red-600'}>
                        {userAns !== undefined ? item.question.options[userAns] : 'Tidak dijawab'}
                      </strong>
                    </p>

                    {!isCorrect && (
                      <p className="text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                        Kunci Jawaban yang Benar: {item.question.options[item.question.correctAnswerIndex]}
                      </p>
                    )}

                    <p className="text-xs text-stone-500 dark:text-stone-400 italic pt-1 border-t border-stone-200/50 dark:border-stone-800/50">
                      Penjelasan: {item.question.explanation}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-4">
            <button
              onClick={handleStartQuiz}
              className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-800 text-amber-200 hover:bg-emerald-700 transition flex items-center gap-2"
            >
              <RotateCcw size={16} />
              <span>Ulangi Kuis Baru</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
