import React, { useState, useMemo } from 'react';
import { Search, BookOpen, Quote, FileText, ChevronRight, Sparkles, X } from 'lucide-react';
import { Chapter } from '../types';
import { IslamicStarIcon } from './IslamicPattern';

interface SmartSearchProps {
  chapters: Chapter[];
  onSelectChapter: (chapterId: string) => void;
  initialQuery?: string;
}

export const SmartSearch: React.FC<SmartSearchProps> = ({
  chapters,
  onSelectChapter,
  initialQuery = '',
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [filterScope, setFilterScope] = useState<'all' | 'title' | 'quran' | 'hadith' | 'scholar' | 'explanation'>('all');

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const results: Array<{
      chapter: Chapter;
      matchedIn: 'title' | 'quran' | 'hadith' | 'scholar' | 'explanation';
      snippet: string;
    }> = [];

    chapters.forEach((chapter) => {
      let matched = false;

      // 1. Title match
      if ((filterScope === 'all' || filterScope === 'title') && chapter.title.toLowerCase().includes(q)) {
        results.push({
          chapter,
          matchedIn: 'title',
          snippet: `Judul Bab: ${chapter.title}`,
        });
        matched = true;
      }

      // 2. Quran verses match
      if ((filterScope === 'all' || filterScope === 'quran') && !matched) {
        for (const verse of chapter.quranVerses) {
          if (
            verse.translation.toLowerCase().includes(q) ||
            verse.surahName.toLowerCase().includes(q) ||
            verse.arabic.includes(query.trim())
          ) {
            results.push({
              chapter,
              matchedIn: 'quran',
              snippet: `Q.S. ${verse.surahName} [${verse.surahNumber}:${verse.verseNumber}]: "${verse.translation}"`,
            });
            matched = true;
            break;
          }
        }
      }

      // 3. Hadith match
      if ((filterScope === 'all' || filterScope === 'hadith') && !matched) {
        for (const hadith of chapter.hadiths) {
          if (
            hadith.translation.toLowerCase().includes(q) ||
            hadith.narrator.toLowerCase().includes(q) ||
            hadith.book.toLowerCase().includes(q) ||
            hadith.arabic.includes(query.trim())
          ) {
            results.push({
              chapter,
              matchedIn: 'hadith',
              snippet: `${hadith.book} (${hadith.narrator}): "${hadith.translation}"`,
            });
            matched = true;
            break;
          }
        }
      }

      // 4. Scholar quotes match
      if ((filterScope === 'all' || filterScope === 'scholar') && !matched) {
        for (const quote of chapter.scholarQuotes) {
          if (
            quote.scholarName.toLowerCase().includes(q) ||
            quote.bookTitle.toLowerCase().includes(q) ||
            quote.context.toLowerCase().includes(q)
          ) {
            results.push({
              chapter,
              matchedIn: 'scholar',
              snippet: `${quote.scholarName} (${quote.bookTitle}): "${quote.context}"`,
            });
            matched = true;
            break;
          }
        }
      }

      // 5. Explanation text match
      if ((filterScope === 'all' || filterScope === 'explanation') && !matched) {
        const lowerExp = chapter.explanation.toLowerCase();
        const index = lowerExp.indexOf(q);
        if (index !== -1) {
          const start = Math.max(0, index - 40);
          const end = Math.min(chapter.explanation.length, index + q.length + 80);
          results.push({
            chapter,
            matchedIn: 'explanation',
            snippet: `...${chapter.explanation.substring(start, end)}...`,
          });
        }
      }
    });

    return results;
  }, [chapters, query, filterScope]);

  const highlightMatch = (text: string, q: string) => {
    if (!q.trim()) return text;
    const parts = text.split(new RegExp(`(${q})`, 'gi'));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === q.toLowerCase() ? (
            <mark key={i} className="bg-amber-300 dark:bg-amber-700/60 text-emerald-950 dark:text-amber-100 rounded-xs px-0.5 font-bold">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  const getBadgeForScope = (scope: 'title' | 'quran' | 'hadith' | 'scholar' | 'explanation') => {
    switch (scope) {
      case 'title':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">Judul Bab</span>;
      case 'quran':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">Ayat Al-Qur'an</span>;
      case 'hadith':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">Hadis Sahih</span>;
      case 'scholar':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">Kutipan Ulama</span>;
      case 'explanation':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-200 text-stone-800 dark:bg-stone-800 dark:text-stone-300">Teks Penjelasan</span>;
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
          <IslamicStarIcon size={16} />
          <span>Fitur Pencarian Pintar</span>
        </div>
        <h1 className="font-display text-2xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100">
          Cari Materi, Ayat, Hadis & Kitab
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-lg mx-auto">
          Telusuri seluruh 50 pokok bahasan akidah Islam secara instan dengan pencarian multi-kategori.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="p-4 rounded-3xl bg-white dark:bg-[#121c18] border border-stone-200 dark:border-stone-800 shadow-md space-y-3">
        <div className="relative">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Ketik topik, ayat (misal: 'Luqman', 'Rububiyah'), hadis ('Jibril'), atau ulama ('Ibnu Katsir')..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-stone-100 text-sm sm:text-base border border-stone-200 dark:border-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-600"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Filter scope buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
          <span className="text-stone-400 font-semibold px-1">Cari Pada:</span>
          {[
            { id: 'all', label: 'Semua Bidang' },
            { id: 'title', label: 'Judul Bab' },
            { id: 'quran', label: 'Al-Qur\'an' },
            { id: 'hadith', label: 'Hadis Sahih' },
            { id: 'scholar', label: 'Ulama' },
            { id: 'explanation', label: 'Penjelasan' },
          ].map((scope) => (
            <button
              key={scope.id}
              onClick={() => setFilterScope(scope.id as any)}
              className={`px-3 py-1.5 rounded-xl font-semibold shrink-0 transition ${
                filterScope === scope.id
                  ? 'bg-emerald-800 text-amber-200 shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-400 hover:bg-stone-200'
              }`}
            >
              {scope.label}
            </button>
          ))}
        </div>
      </div>

      {/* Suggested Quick Keywords */}
      {!query && (
        <div className="p-6 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-900/10 dark:border-emerald-700/20 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300">
            Kata Kunci Populer yang Sering Dicari:
          </h3>
          <div className="flex flex-wrap gap-2 text-xs">
            {[
              'Tauhid Uluhiyah',
              'Hadis Jibril',
              'Al-Asma\'ul Husna',
              'Syirik Akbar',
              'Alam Barzakh',
              'Fitnah Dajjal',
              'Qada dan Qadar',
              'Khatamun Nabiyyin',
              'Sunnah dan Bid\'ah',
              'Istiqamah',
              'Al-Wala\' wal Bara\'',
              'Tawakal'
            ].map((keyword) => (
              <button
                key={keyword}
                onClick={() => setQuery(keyword)}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#121c18] border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-emerald-700 hover:text-emerald-800 transition"
              >
                + {keyword}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results List */}
      {query && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-stone-500 font-semibold px-1">
            <span>Hasil Pencarian: {searchResults.length} Bab Ditemukan</span>
            <span>Kata kunci: "{query}"</span>
          </div>

          {searchResults.length > 0 ? (
            <div className="space-y-3">
              {searchResults.map((res, idx) => (
                <div
                  key={idx}
                  onClick={() => onSelectChapter(res.chapter.id)}
                  className="cursor-pointer p-5 rounded-2xl bg-white dark:bg-[#121c18] border border-stone-200 dark:border-stone-800 hover:border-emerald-600 shadow-xs hover:shadow-md transition space-y-2.5 group"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-emerald-800 text-amber-200">
                        Bab {res.chapter.number}
                      </span>
                      {getBadgeForScope(res.matchedIn)}
                    </div>
                    <span className="text-xs text-stone-400 group-hover:translate-x-1 transition-transform flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-400">
                      <span>Buka Pembahasan</span>
                      <ChevronRight size={14} />
                    </span>
                  </div>

                  <h3 className="font-display text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 group-hover:text-emerald-800 dark:group-hover:text-emerald-300 transition-colors">
                    {highlightMatch(res.chapter.title, query)}
                  </h3>

                  <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-900 text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-normal">
                    {highlightMatch(res.snippet, query)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 px-4 bg-white dark:bg-[#121c18] rounded-3xl border border-dashed border-stone-300 dark:border-stone-800 space-y-2">
              <Search size={32} className="mx-auto text-stone-400" />
              <h3 className="text-base font-bold text-stone-800 dark:text-stone-200">
                Tidak Ditemukan Hasil untuk "{query}"
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Coba gunakan kata kunci lain, periksa ejaan, atau pilih filter "Semua Bidang".
              </p>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
