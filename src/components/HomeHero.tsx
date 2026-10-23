import React from 'react';
import { 
  BookOpen, 
  Compass, 
  Sparkles, 
  CheckCircle2, 
  Bookmark, 
  Search, 
  Award, 
  User, 
  ArrowRight,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';
import { JILID_LIST } from '../data/jilids';
import { Chapter, JilidId, UserProgress } from '../types';
import { IslamicStarIcon, ArabesqueDivider } from './IslamicPattern';

interface HomeHeroProps {
  chapters: Chapter[];
  progress: UserProgress;
  onStartReading: () => void;
  onOpenCurriculum: () => void;
  onOpenJilid: (jilidId: JilidId) => void;
  onOpenChapter: (chapterId: string) => void;
  onOpenSearch: () => void;
  onOpenAbout: () => void;
}

export const HomeHero: React.FC<HomeHeroProps> = ({
  chapters,
  progress,
  onStartReading,
  onOpenCurriculum,
  onOpenJilid,
  onOpenChapter,
  onOpenSearch,
  onOpenAbout
}) => {
  const totalChapters = chapters.length;
  const completedCount = progress.completedChapterIds.length;
  const percentComplete = Math.round((completedCount / (totalChapters || 1)) * 100);
  const bookmarkCount = progress.bookmarkedChapterIds.length;

  const lastReadChapter = progress.lastReadChapterId 
    ? chapters.find(c => c.id === progress.lastReadChapterId)
    : null;

  return (
    <div className="space-y-12 pb-16">
      
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-emerald-900 via-emerald-950 to-[#07241c] text-white border border-amber-500/20 shadow-xl px-6 py-12 sm:px-12 sm:py-16 text-center">
        
        {/* Subtle Decorative Background Arabesque */}
        <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
          <div className="w-[600px] h-[600px] border-[1px] border-amber-300 rounded-full flex items-center justify-center">
            <div className="w-[450px] h-[450px] border-[1px] border-dashed border-amber-300 rotate-45" />
          </div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          
          {/* Emblem Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-800/80 border border-amber-400/40 text-amber-200 text-xs sm:text-sm font-medium shadow-inner">
            <IslamicStarIcon size={16} className="text-amber-400 animate-spin-slow" />
            <span>Koleksi 50 Pokok Pembahasan Lengkap & Berdalil Sahih</span>
          </div>

          {/* Title & Subtitle */}
          <div className="space-y-3">
            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-amber-100 drop-shadow-md">
              Maktabah Ahlu Sunnah
            </h1>
            <p className="text-base sm:text-xl text-emerald-100/90 font-light max-w-2xl mx-auto leading-relaxed">
              Perpustakaan Digital Akidah Islam Berdasarkan Al-Qur'an dan Sunnah yang Sahih
            </p>
          </div>

          {/* Developer Credential Badge */}
          <div className="pt-1">
            <button
              onClick={onOpenAbout}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-black/25 hover:bg-black/40 text-emerald-200 text-xs sm:text-sm font-medium border border-emerald-500/20 transition group"
            >
              <User size={14} className="text-amber-400" />
              <span>Dikembangkan oleh: <strong className="text-white group-hover:text-amber-300">Jundi Abdul Syahid, S.Pd.</strong> (Orang Dalam Genetik Jawa)</span>
            </button>
          </div>

          {/* Motivational Hadith Quote */}
          <div className="max-w-2xl mx-auto p-5 rounded-2xl bg-emerald-950/70 border border-amber-500/30 text-amber-100/95 space-y-2.5 shadow-md">
            <p className="font-arabic text-xl sm:text-2xl text-amber-300 leading-loose">
              مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ
            </p>
            <p className="text-xs sm:text-sm text-emerald-200 italic font-light">
              "Barangsiapa menempuh suatu jalan untuk mencari ilmu syar'i, niscaya Allah memudahkan baginya jalan menuju surga."
            </p>
            <span className="block text-[11px] text-amber-400/80 font-mono">
              — HR. Muslim no. 2699
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <button
              onClick={onStartReading}
              className="px-6 py-3.5 rounded-xl text-sm sm:text-base font-bold bg-gradient-to-r from-amber-500 to-amber-600 text-emerald-950 hover:from-amber-400 hover:to-amber-500 shadow-lg shadow-amber-600/30 hover:scale-[1.02] transition flex items-center gap-2"
            >
              <Compass size={18} />
              <span>{lastReadChapter ? 'Lanjutkan Belajar' : 'Mulai Belajar'}</span>
              <ArrowRight size={18} />
            </button>

            <button
              onClick={onOpenCurriculum}
              className="px-6 py-3.5 rounded-xl text-sm sm:text-base font-semibold bg-emerald-800/90 text-white hover:bg-emerald-700/90 border border-emerald-600/50 shadow-md hover:scale-[1.02] transition flex items-center gap-2"
            >
              <BookOpen size={18} />
              <span>Buka Perpustakaan</span>
            </button>

            <button
              onClick={onOpenSearch}
              className="px-4 py-3.5 rounded-xl text-sm font-semibold bg-white/10 hover:bg-white/15 text-emerald-100 border border-white/10 transition flex items-center gap-2"
              title="Cari ayat, hadis, atau topik"
            >
              <Search size={18} />
              <span>Pencarian</span>
            </button>
          </div>

          {/* Quick Resuming Pill if Last Read Exists */}
          {lastReadChapter && (
            <div className="pt-2">
              <p className="text-xs text-emerald-300">
                Terakhir dipelajari: {' '}
                <button
                  onClick={() => onOpenChapter(lastReadChapter.id)}
                  className="font-semibold text-amber-300 underline underline-offset-4 hover:text-amber-200"
                >
                  Bab {lastReadChapter.number}: {lastReadChapter.title}
                </button>
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Statistical Dashboard Cards */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-white dark:bg-[#121c18] border border-emerald-900/10 dark:border-emerald-500/15 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Kurikulum</span>
            <BookOpen size={18} />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100">
            50 <span className="text-sm font-normal text-stone-500">Bab</span>
          </p>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            5 Jilid Tematik Terstruktur
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#121c18] border border-emerald-900/10 dark:border-emerald-500/15 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Progres Belajar</span>
            <CheckCircle2 size={18} />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-700 dark:text-emerald-400">
            {percentComplete}%
          </p>
          <div className="w-full bg-stone-200 dark:bg-stone-800 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-emerald-600 dark:bg-emerald-500 h-1.5 rounded-full transition-all duration-500" 
              style={{ width: `${percentComplete}%` }}
            />
          </div>
          <p className="text-[11px] text-stone-500 dark:text-stone-400">
            {completedCount} dari {totalChapters} Bab Selesai
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#121c18] border border-emerald-900/10 dark:border-emerald-500/15 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-amber-600 dark:text-amber-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Penanda Buku</span>
            <Bookmark size={18} />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100">
            {bookmarkCount} <span className="text-sm font-normal text-stone-500">Favorit</span>
          </p>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Materi yang ditandai
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#121c18] border border-emerald-900/10 dark:border-emerald-500/15 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-teal-700 dark:text-teal-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Verifikasi Dalil</span>
            <ShieldCheck size={18} />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100">
            100% <span className="text-sm font-normal text-stone-500">Shahih</span>
          </p>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Al-Qur'an & Syarah Ulama
          </p>
        </div>
      </section>

      {/* 5 Thematic Volumes (Jilid I to V) Showcase */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-emerald-950 dark:text-emerald-100">
            Lima Jilid Tematik Akidah Islam
          </h2>
          <p className="text-stone-600 dark:text-stone-400 text-sm max-w-xl mx-auto">
            Pelajari akidah Islam secara bertahap dari pemahaman dasar hingga pemurnian manhaj secara ilmiah.
          </p>
          <ArabesqueDivider />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {JILID_LIST.map((jilid) => {
            const jilidChapters = chapters.filter(c => c.jilidId === jilid.id);
            const jilidCompleted = jilidChapters.filter(c => progress.completedChapterIds.includes(c.id)).length;
            const jilidPercent = Math.round((jilidCompleted / (jilidChapters.length || 1)) * 100);

            return (
              <div
                key={jilid.id}
                onClick={() => onOpenJilid(jilid.id)}
                className="group cursor-pointer rounded-2xl bg-white dark:bg-[#121c18] border border-emerald-900/10 dark:border-emerald-500/15 hover:border-amber-500/50 shadow-sm hover:shadow-md transition-all duration-300 p-6 flex flex-col justify-between space-y-4 hover:-translate-y-1"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-lg text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 border border-emerald-300/40 dark:border-emerald-700/40">
                      JILID {jilid.numberRoman}
                    </span>
                    <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                      Bab {jilid.startChapter} - {jilid.endChapter}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display text-lg font-bold text-emerald-950 dark:text-emerald-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {jilid.title}
                    </h3>
                    <p className="text-xs font-medium text-amber-700 dark:text-amber-400/90 mt-0.5">
                      {jilid.subtitle}
                    </p>
                  </div>

                  <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-3 leading-relaxed">
                    {jilid.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 dark:border-stone-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                    <span>{jilidCompleted}/{jilidChapters.length} Selesai</span>
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400">{jilidPercent}%</span>
                  </div>
                  <div className="w-full bg-stone-100 dark:bg-stone-800 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-emerald-600 h-1.5 rounded-full transition-all"
                      style={{ width: `${jilidPercent}%` }}
                    />
                  </div>
                  <div className="pt-1 flex items-center justify-end text-xs font-semibold text-emerald-700 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
                    <span>Buka Daftar Bab</span>
                    <ArrowRight size={14} className="ml-1" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Methodology & Quality Assurance Banner */}
      <section className="rounded-2xl p-6 sm:p-8 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-900/10 dark:border-emerald-600/20 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-emerald-950 dark:text-emerald-100 flex items-center gap-2">
              <GraduationCap className="text-amber-600 dark:text-amber-400" />
              <span>Standar Ilmiah & Keaslian Dalil</span>
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-3xl">
              Setiap bab materi disusun secara sistematis memuat tujuan pembelajaran, pendahuluan, uraian komprehensif, dalil Al-Qur'an Kemenag RI, hadis sahih (Bukhari & Muslim), penjelasan para ulama salaf, contoh penerapan harian, kesimpulan, serta soal evaluasi pemahaman (pilihan ganda & uraian).
            </p>
          </div>
          <button
            onClick={onOpenAbout}
            className="self-start sm:self-auto px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-800 text-amber-200 hover:bg-emerald-700 transition shrink-0"
          >
            Baca Metodologi
          </button>
        </div>
      </section>

    </div>
  );
};
