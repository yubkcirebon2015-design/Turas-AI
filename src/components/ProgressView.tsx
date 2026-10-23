import React from 'react';
import { 
  BarChart2, 
  CheckCircle2, 
  BookOpen, 
  Flame, 
  Calendar, 
  Clock, 
  Award, 
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { Chapter, UserProgress } from '../types';
import { JILID_LIST } from '../data/jilids';
import { IslamicStarIcon, ArabesqueDivider } from './IslamicPattern';

interface ProgressViewProps {
  chapters: Chapter[];
  progress: UserProgress;
  onSelectChapter: (chapterId: string) => void;
  onOpenCurriculum: () => void;
  onResetProgress: () => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  chapters,
  progress,
  onSelectChapter,
  onOpenCurriculum,
  onResetProgress,
}) => {
  const total = chapters.length;
  const completed = progress.completedChapterIds.length;
  const percentOverall = Math.round((completed / (total || 1)) * 100);

  const lastReadChapter = progress.lastReadChapterId 
    ? chapters.find((c) => c.id === progress.lastReadChapterId)
    : null;

  return (
    <div className="space-y-10 pb-16 max-w-4xl mx-auto">
      
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
          <IslamicStarIcon size={16} />
          <span>Statistik Pembelajaran</span>
        </div>
        <h1 className="font-display text-2xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100">
          Progres Belajar Akidah Islam
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-md mx-auto">
          Pantau konsistensi belajar Anda, materi yang telah tuntas, serta pencapaian pemahaman di setiap jilid.
        </p>
      </div>

      {/* Main Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Overall Completion */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-800 to-teal-950 text-white shadow-md space-y-3">
          <div className="flex items-center justify-between text-emerald-200 text-xs font-bold uppercase tracking-wider">
            <span>Kemajuan Keseluruhan</span>
            <CheckCircle2 size={18} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-extrabold text-amber-200">
              {percentOverall}%
            </span>
            <span className="text-xs text-emerald-200">
              ({completed}/{total} Bab)
            </span>
          </div>
          <div className="w-full bg-emerald-950/80 rounded-full h-2 overflow-hidden border border-emerald-700/40">
            <div
              className="bg-gradient-to-r from-amber-400 to-amber-300 h-2 rounded-full transition-all duration-500"
              style={{ width: `${percentOverall}%` }}
            />
          </div>
        </div>

        {/* Learning Streak */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#121c18] border border-stone-200 dark:border-stone-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-amber-600 text-xs font-bold uppercase tracking-wider">
            <span>Keistiqamahan</span>
            <Flame size={18} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-extrabold text-stone-900 dark:text-stone-100">
              {progress.streakDays}
            </span>
            <span className="text-xs text-stone-500">Hari Beruntun</span>
          </div>
          <p className="text-xs text-stone-500">
            Terakhir aktif: {progress.lastActiveDate || 'Hari ini'}
          </p>
        </div>

        {/* Personal Notes Count */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#121c18] border border-stone-200 dark:border-stone-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-teal-700 dark:text-teal-400 text-xs font-bold uppercase tracking-wider">
            <span>Catatan Faedah</span>
            <BookOpen size={18} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-extrabold text-stone-900 dark:text-stone-100">
              {Object.keys(progress.personalNotes).length}
            </span>
            <span className="text-xs text-stone-500">Bab Dicatat</span>
          </div>
          <p className="text-xs text-stone-500">
            {progress.bookmarkedChapterIds.length} Bab ditandai favorit
          </p>
        </div>
      </div>

      {/* Last Read Quick Jump Banner */}
      {lastReadChapter && (
        <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider">
              Lanjutkan Membaca
            </span>
            <h3 className="font-display text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
              Bab {lastReadChapter.number}: {lastReadChapter.title}
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400">
              {lastReadChapter.jilidTitle}
            </p>
          </div>
          <button
            onClick={() => onSelectChapter(lastReadChapter.id)}
            className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-800 text-amber-200 hover:bg-emerald-700 transition flex items-center gap-2 shrink-0 shadow-xs"
          >
            <span>Buka Materi</span>
            <ArrowRight size={16} />
          </button>
        </div>
      )}

      {/* Progress Breakdown Per Jilid */}
      <section className="space-y-5">
        <h2 className="font-display text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
          <BarChart2 size={22} className="text-emerald-700 dark:text-emerald-400" />
          <span>Kemajuan Belajar per Jilid</span>
        </h2>

        <div className="space-y-4">
          {JILID_LIST.map((jilid) => {
            const jilidChapters = chapters.filter((c) => c.jilidId === jilid.id);
            const jilidCompleted = jilidChapters.filter((c) => progress.completedChapterIds.includes(c.id)).length;
            const jilidPercent = Math.round((jilidCompleted / (jilidChapters.length || 1)) * 100);

            return (
              <div
                key={jilid.id}
                className="p-5 rounded-2xl bg-white dark:bg-[#121c18] border border-stone-200 dark:border-stone-800 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase">
                      Jilid {jilid.numberRoman}
                    </span>
                    <h3 className="font-display text-base font-bold text-stone-900 dark:text-stone-100">
                      {jilid.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-stone-500">
                      {jilidCompleted} dari {jilidChapters.length} Bab
                    </span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400 text-sm">
                      {jilidPercent}%
                    </span>
                  </div>
                </div>

                <div className="w-full bg-stone-100 dark:bg-stone-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${jilidPercent}%` }}
                  />
                </div>

                {/* Chapter micro ticks */}
                <div className="grid grid-cols-10 gap-1 pt-1">
                  {jilidChapters.map((ch) => {
                    const isDone = progress.completedChapterIds.includes(ch.id);
                    return (
                      <button
                        key={ch.id}
                        onClick={() => onSelectChapter(ch.id)}
                        className={`h-6 rounded-md text-[10px] font-bold flex items-center justify-center transition ${
                          isDone
                            ? 'bg-emerald-600 text-white'
                            : 'bg-stone-100 dark:bg-stone-800 text-stone-400 hover:bg-stone-200'
                        }`}
                        title={`Bab ${ch.number}: ${ch.title} (${isDone ? 'Selesai' : 'Belum'})`}
                      >
                        {ch.number}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Completed Chapters List */}
      <section className="space-y-4">
        <h2 className="font-display text-xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
          <CheckCircle2 size={20} className="text-emerald-600" />
          <span>Daftar Bab yang Telah Selesai ({completed})</span>
        </h2>

        {completed > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {chapters
              .filter((c) => progress.completedChapterIds.includes(c.id))
              .map((c) => (
                <div
                  key={c.id}
                  onClick={() => onSelectChapter(c.id)}
                  className="p-3 rounded-xl bg-white dark:bg-[#121c18] border border-stone-200 dark:border-stone-800 hover:border-emerald-600 cursor-pointer flex items-center justify-between"
                >
                  <span className="font-medium text-stone-800 dark:text-stone-200 line-clamp-1">
                    Bab {c.number}: {c.title}
                  </span>
                  <ArrowRight size={14} className="text-emerald-600 shrink-0 ml-2" />
                </div>
              ))}
          </div>
        ) : (
          <p className="text-xs text-stone-500 italic">
            Belum ada bab yang ditandai selesai dibaca. Mulailah membaca bab pertama!
          </p>
        )}
      </section>

      {/* Reset Progress Section */}
      <div className="pt-6 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs text-stone-400">
        <span>Data progres tersimpan di penyimpanan lokal perangkat Anda.</span>
        <button
          onClick={onResetProgress}
          className="text-red-500 hover:text-red-600 flex items-center gap-1 hover:underline"
        >
          <RotateCcw size={13} />
          <span>Reset Progres</span>
        </button>
      </div>

    </div>
  );
};
