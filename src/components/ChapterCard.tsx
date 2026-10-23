import React from 'react';
import { Bookmark, CheckCircle2, Circle, Clock, Edit3, Trash2, ArrowRight } from 'lucide-react';
import { Chapter } from '../types';

interface ChapterCardProps {
  chapter: Chapter;
  isBookmarked: boolean;
  isCompleted: boolean;
  onSelect: (chapterId: string) => void;
  onToggleBookmark: (chapterId: string, e: React.MouseEvent) => void;
  onToggleCompleted: (chapterId: string, e: React.MouseEvent) => void;
  onEdit: (chapter: Chapter, e: React.MouseEvent) => void;
  onDelete: (chapterId: string, title: string, e: React.MouseEvent) => void;
}

export const ChapterCard: React.FC<ChapterCardProps> = ({
  chapter,
  isBookmarked,
  isCompleted,
  onSelect,
  onToggleBookmark,
  onToggleCompleted,
  onEdit,
  onDelete,
}) => {
  const getStatusBadge = (status: Chapter['status']) => {
    switch (status) {
      case 'Telah ditinjau':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300/40">
            ✓ Telah Ditinjau
          </span>
        );
      case 'Siap ditinjau':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-300/40">
            Siap Ditinjau
          </span>
        );
      case 'Perlu verifikasi':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300/40">
            Perlu Verifikasi
          </span>
        );
      case 'Draf':
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-300">
            Draf
          </span>
        );
    }
  };

  return (
    <div
      onClick={() => onSelect(chapter.id)}
      className={`group cursor-pointer rounded-2xl bg-white dark:bg-[#121c18] border transition-all duration-200 p-5 flex flex-col justify-between space-y-4 shadow-xs hover:shadow-md hover:-translate-y-0.5 ${
        isCompleted
          ? 'border-emerald-500/40 bg-emerald-50/20 dark:bg-emerald-950/20'
          : 'border-stone-200/80 dark:border-stone-800 hover:border-amber-500/40'
      }`}
    >
      <div className="space-y-2.5">
        
        {/* Top Badges & Bookmark */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-emerald-800 text-amber-200 shadow-xs">
              Bab {chapter.number}
            </span>
            {getStatusBadge(chapter.status)}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={(e) => onToggleCompleted(chapter.id, e)}
              className="p-1.5 rounded-lg text-stone-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
              title={isCompleted ? 'Tandai belum selesai' : 'Tandai selesai dibaca'}
            >
              {isCompleted ? (
                <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400 fill-emerald-100 dark:fill-emerald-950" />
              ) : (
                <Circle size={18} />
              )}
            </button>

            <button
              onClick={(e) => onToggleBookmark(chapter.id, e)}
              className="p-1.5 rounded-lg text-stone-400 hover:text-amber-500 transition"
              title={isBookmarked ? 'Hapus penanda buku' : 'Simpan ke penanda buku'}
            >
              <Bookmark
                size={18}
                className={isBookmarked ? 'text-amber-500 fill-amber-500' : ''}
              />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-display text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 group-hover:text-emerald-800 dark:group-hover:text-emerald-300 transition-colors line-clamp-2">
          {chapter.title}
        </h3>

        {/* Introduction Snippet */}
        <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2 leading-relaxed">
          {chapter.introduction}
        </p>
      </div>

      {/* Footer Info & Action buttons */}
      <div className="pt-3 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Clock size={13} />
            <span>6-8 mnt</span>
          </span>
          <span className="hidden sm:inline">
            {chapter.quranVerses.length} Ayat • {chapter.hadiths.length} Hadis
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={(e) => onEdit(chapter, e)}
            className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 hover:text-stone-900 dark:hover:text-stone-200 transition"
            title="Edit Materi Bab Ini"
          >
            <Edit3 size={15} />
          </button>
          <button
            onClick={(e) => onDelete(chapter.id, chapter.title, e)}
            className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 text-stone-500 hover:text-red-600 transition"
            title="Hapus Materi Bab Ini"
          >
            <Trash2 size={15} />
          </button>
          <div className="pl-1 flex items-center text-emerald-700 dark:text-emerald-400 font-semibold group-hover:translate-x-1 transition-transform">
            <ArrowRight size={16} />
          </div>
        </div>
      </div>
    </div>
  );
};
