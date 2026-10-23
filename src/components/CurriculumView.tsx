import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Search, 
  Filter, 
  PlusCircle, 
  CheckCircle2, 
  Bookmark, 
  Sparkles,
  Layers
} from 'lucide-react';
import { Chapter, JilidId, UserProgress } from '../types';
import { JILID_LIST } from '../data/jilids';
import { ChapterCard } from './ChapterCard';
import { IslamicStarIcon } from './IslamicPattern';

interface CurriculumViewProps {
  chapters: Chapter[];
  progress: UserProgress;
  activeJilidId?: JilidId | null;
  onSelectChapter: (chapterId: string) => void;
  onToggleBookmark: (chapterId: string, e: React.MouseEvent) => void;
  onToggleCompleted: (chapterId: string, e: React.MouseEvent) => void;
  onEditChapter: (chapter: Chapter, e: React.MouseEvent) => void;
  onDeleteChapter: (chapterId: string, title: string, e: React.MouseEvent) => void;
  onOpenAddModal: () => void;
}

export const CurriculumView: React.FC<CurriculumViewProps> = ({
  chapters,
  progress,
  activeJilidId = null,
  onSelectChapter,
  onToggleBookmark,
  onToggleCompleted,
  onEditChapter,
  onDeleteChapter,
  onOpenAddModal
}) => {
  const [selectedJilid, setSelectedJilid] = useState<number | 'all'>(activeJilidId || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);
  const [onlyCompleted, setOnlyCompleted] = useState(false);

  // Filtered chapters
  const filteredChapters = useMemo(() => {
    return chapters.filter((chapter) => {
      // Jilid filter
      if (selectedJilid !== 'all' && chapter.jilidId !== selectedJilid) {
        return false;
      }
      // Status filter
      if (statusFilter !== 'all' && chapter.status !== statusFilter) {
        return false;
      }
      // Bookmark filter
      if (onlyBookmarked && !progress.bookmarkedChapterIds.includes(chapter.id)) {
        return false;
      }
      // Completed filter
      if (onlyCompleted && !progress.completedChapterIds.includes(chapter.id)) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = chapter.title.toLowerCase().includes(query);
        const matchesNumber = chapter.number.toString() === query || `bab ${chapter.number}`.includes(query);
        const matchesIntro = chapter.introduction.toLowerCase().includes(query);
        if (!matchesTitle && !matchesNumber && !matchesIntro) {
          return false;
        }
      }
      return true;
    });
  }, [chapters, selectedJilid, statusFilter, onlyBookmarked, onlyCompleted, searchQuery, progress]);

  const activeJilidInfo = typeof selectedJilid === 'number'
    ? JILID_LIST.find((j) => j.id === selectedJilid)
    : null;

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 font-semibold text-xs tracking-wider uppercase">
            <IslamicStarIcon size={16} />
            <span>Kurikulum Perpustakaan Digital</span>
          </div>
          <h1 className="font-display text-2xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100 mt-1">
            50 Pokok Pembahasan Akidah Islam
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1">
            Tersusun berurutan dari Jilid I hingga Jilid V berdasarkan dalil Al-Qur'an dan Sunnah yang sahih.
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-emerald-700 text-white hover:bg-emerald-800 shadow-sm transition shrink-0"
        >
          <PlusCircle size={18} />
          <span>+ Tambah Materi Bab</span>
        </button>
      </div>

      {/* Jilid Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedJilid('all')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold shrink-0 transition ${
            selectedJilid === 'all'
              ? 'bg-emerald-800 text-amber-200 shadow-xs'
              : 'bg-white dark:bg-[#121c18] text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-900'
          }`}
        >
          Semua (50 Bab)
        </button>

        {JILID_LIST.map((jilid) => (
          <button
            key={jilid.id}
            onClick={() => setSelectedJilid(jilid.id)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold shrink-0 transition ${
              selectedJilid === jilid.id
                ? 'bg-emerald-800 text-amber-200 shadow-xs'
                : 'bg-white dark:bg-[#121c18] text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-900'
            }`}
          >
            Jilid {jilid.numberRoman}: {jilid.title}
          </button>
        ))}
      </div>

      {/* Selected Jilid Context Banner */}
      {activeJilidInfo && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-900/10 via-amber-500/10 to-transparent border border-emerald-800/20 dark:border-emerald-700/30 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-400">
            <span>JILID {activeJilidInfo.numberRoman}</span>
            <span>•</span>
            <span>Bab {activeJilidInfo.startChapter} sampai Bab {activeJilidInfo.endChapter}</span>
          </div>
          <h2 className="font-display text-xl font-bold text-emerald-950 dark:text-emerald-100">
            {activeJilidInfo.title}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
            {activeJilidInfo.description}
          </p>
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#121c18] border border-stone-200/80 dark:border-stone-800 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        
        {/* Search input */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Cari judul bab, nomor bab, atau topik akidah..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 focus:outline-none"
          >
            <option value="all">Semua Status</option>
            <option value="Telah ditinjau">✓ Telah Ditinjau</option>
            <option value="Siap ditinjau">Siap Ditinjau</option>
            <option value="Perlu verifikasi">Perlu Verifikasi</option>
            <option value="Draf">Draf</option>
          </select>

          <button
            onClick={() => setOnlyBookmarked(!onlyBookmarked)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              onlyBookmarked
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-800'
            }`}
            title="Tampilkan hanya materi di penanda buku"
          >
            <Bookmark size={14} className={onlyBookmarked ? 'fill-white' : ''} />
            <span>Ditandai ({progress.bookmarkedChapterIds.length})</span>
          </button>

          <button
            onClick={() => setOnlyCompleted(!onlyCompleted)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              onlyCompleted
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-800'
            }`}
            title="Tampilkan hanya materi yang sudah selesai dibaca"
          >
            <CheckCircle2 size={14} />
            <span>Selesai ({progress.completedChapterIds.length})</span>
          </button>
        </div>
      </div>

      {/* Chapters Grid */}
      {filteredChapters.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredChapters.map((chapter) => (
            <ChapterCard
              key={chapter.id}
              chapter={chapter}
              isBookmarked={progress.bookmarkedChapterIds.includes(chapter.id)}
              isCompleted={progress.completedChapterIds.includes(chapter.id)}
              onSelect={onSelectChapter}
              onToggleBookmark={onToggleBookmark}
              onToggleCompleted={onToggleCompleted}
              onEdit={onEditChapter}
              onDelete={onDeleteChapter}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-white dark:bg-[#121c18] rounded-3xl border border-dashed border-stone-300 dark:border-stone-800 space-y-3">
          <BookOpen size={40} className="mx-auto text-stone-400" />
          <h3 className="text-lg font-bold text-stone-800 dark:text-stone-200">
            Tidak Ada Materi yang Cocok
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
            Tidak ditemukan bab yang sesuai dengan kata kunci pencarian atau filter yang Anda pilih. Silakan atur ulang filter pencarian Anda.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedJilid('all');
              setStatusFilter('all');
              setOnlyBookmarked(false);
              setOnlyCompleted(false);
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-700 text-white hover:bg-emerald-800 transition"
          >
            Reset Semua Filter
          </button>
        </div>
      )}

    </div>
  );
};
