import React from 'react';
import { Bookmark, BookOpen, Trash2, ArrowRight } from 'lucide-react';
import { Chapter } from '../types';
import { IslamicStarIcon } from './IslamicPattern';

interface BookmarksViewProps {
  chapters: Chapter[];
  bookmarkedIds: string[];
  onSelectChapter: (chapterId: string) => void;
  onRemoveBookmark: (chapterId: string, e: React.MouseEvent) => void;
  onOpenCurriculum: () => void;
}

export const BookmarksView: React.FC<BookmarksViewProps> = ({
  chapters,
  bookmarkedIds,
  onSelectChapter,
  onRemoveBookmark,
  onOpenCurriculum,
}) => {
  const bookmarkedChapters = chapters.filter((c) => bookmarkedIds.includes(c.id));

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
          <IslamicStarIcon size={16} />
          <span>Koleksi Favorit</span>
        </div>
        <h1 className="font-display text-2xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100">
          Penanda Buku Materi Akidah
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-md mx-auto">
          Daftar pembahasan yang telah Anda simpan untuk dibaca kembali atau dipelajari lebih mendalam.
        </p>
      </div>

      {bookmarkedChapters.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-stone-500 font-semibold px-1">
            <span>Menampilkan {bookmarkedChapters.length} Bab Tersimpan</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bookmarkedChapters.map((chapter) => (
              <div
                key={chapter.id}
                onClick={() => onSelectChapter(chapter.id)}
                className="cursor-pointer p-5 rounded-2xl bg-white dark:bg-[#121c18] border border-amber-500/30 dark:border-amber-500/20 shadow-xs hover:shadow-md hover:border-amber-500 transition space-y-3 group"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-lg text-xs font-extrabold bg-emerald-800 text-amber-200">
                    Bab {chapter.number}
                  </span>

                  <button
                    onClick={(e) => onRemoveBookmark(chapter.id, e)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition"
                    title="Hapus dari penanda buku"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div>
                  <h3 className="font-display text-base font-bold text-stone-900 dark:text-stone-100 group-hover:text-emerald-800 dark:group-hover:text-emerald-300 transition-colors line-clamp-1">
                    {chapter.title}
                  </h3>
                  <p className="text-xs text-stone-500 line-clamp-2 mt-1">
                    {chapter.introduction}
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-xs text-stone-400">
                  <span>{chapter.jilidTitle.split('—')[0]}</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Baca</span>
                    <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-white dark:bg-[#121c18] rounded-3xl border border-dashed border-stone-300 dark:border-stone-800 space-y-4">
          <Bookmark size={40} className="mx-auto text-amber-500/60" />
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-stone-800 dark:text-stone-200">
              Belum Ada Penanda Buku
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto">
              Saat membaca bab materi, klik ikon penanda buku pada kartu atau bilah atas untuk menyimpannya di sini.
            </p>
          </div>
          <button
            onClick={onOpenCurriculum}
            className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-800 text-amber-200 hover:bg-emerald-700 transition"
          >
            Buka Daftar 50 Pembahasan
          </button>
        </div>
      )}

    </div>
  );
};
