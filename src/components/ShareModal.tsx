import React, { useState } from 'react';
import { X, Copy, Check, Share2, BookOpen } from 'lucide-react';
import { Chapter } from '../types';

interface ShareModalProps {
  chapter: Chapter | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  chapter,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !chapter) return null;

  const [copied, setCopied] = useState(false);

  const shareText = `*Maktabah Ahlu Sunnah — Perpustakaan Digital Akidah Islam*
Bab ${chapter.number}: ${chapter.title}

_${chapter.introduction}_

Dalil Al-Qur'an:
Q.S. ${chapter.quranVerses[0]?.surahName || ''} [${chapter.quranVerses[0]?.surahNumber || ''}:${chapter.quranVerses[0]?.verseNumber || ''}]:
"${chapter.quranVerses[0]?.translation || ''}"

Dalil Hadis:
${chapter.hadiths[0]?.book || ''} (${chapter.hadiths[0]?.narrator || ''}):
"${chapter.hadiths[0]?.translation || ''}"

Dikembangkan oleh: Jundi Abdul Syahid, S.Pd. (Orang Dalam Genetik Jawa)
Pelajari selengkapnya di aplikasi Maktabah Ahlu Sunnah.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#121c18] rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl p-6 space-y-4">
        
        <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <Share2 size={18} className="text-emerald-700" />
            <h3 className="font-display text-lg font-bold text-stone-900 dark:text-stone-100">
              Bagikan Materi Bab {chapter.number}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-stone-400 hover:text-stone-600 rounded-lg">
            <X size={18} />
          </button>
        </div>

        <p className="text-xs text-stone-500">
          Salin ringkasan dan dalil bab ini untuk dibagikan ke WhatsApp, Telegram, atau media sosial Anda:
        </p>

        <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs font-mono text-stone-800 dark:text-stone-200 max-h-60 overflow-y-auto whitespace-pre-line leading-relaxed">
          {shareText}
        </div>

        <div className="pt-2 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300"
          >
            Tutup
          </button>
          <button
            onClick={handleCopy}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-800 text-amber-200 hover:bg-emerald-700 transition flex items-center gap-2 shadow-xs"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span>{copied ? 'Tersalin ke Clipboard!' : 'Salin Teks Ringkasan'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
