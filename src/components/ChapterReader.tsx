import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Bookmark, 
  CheckCircle2, 
  Circle, 
  Printer, 
  Share2, 
  Edit3, 
  Trash2, 
  BookOpen, 
  Quote, 
  FileText, 
  Target, 
  Sparkles, 
  Lightbulb, 
  ListOrdered, 
  HelpCircle, 
  Maximize2, 
  Minimize2,
  Save,
  MessageSquare,
  Check,
  AlertCircle
} from 'lucide-react';
import { Chapter, ReaderSettings } from '../types';
import { IslamicStarIcon, ArabesqueDivider } from './IslamicPattern';

interface ChapterReaderProps {
  chapter: Chapter;
  previousChapter: Chapter | null;
  nextChapter: Chapter | null;
  isBookmarked: boolean;
  isCompleted: boolean;
  personalNote: string;
  settings: ReaderSettings;
  onNavigateChapter: (chapterId: string) => void;
  onToggleBookmark: (chapterId: string) => void;
  onToggleCompleted: (chapterId: string) => void;
  onSavePersonalNote: (chapterId: string, note: string) => void;
  onEditChapter: (chapter: Chapter) => void;
  onDeleteChapter: (chapterId: string, title: string) => void;
  onOpenShare: (chapter: Chapter) => void;
  onBack: () => void;
  onUpdateSettings: (settings: Partial<ReaderSettings>) => void;
}

export const ChapterReader: React.FC<ChapterReaderProps> = ({
  chapter,
  previousChapter,
  nextChapter,
  isBookmarked,
  isCompleted,
  personalNote,
  settings,
  onNavigateChapter,
  onToggleBookmark,
  onToggleCompleted,
  onSavePersonalNote,
  onEditChapter,
  onDeleteChapter,
  onOpenShare,
  onBack,
  onUpdateSettings,
}) => {
  // Reading mode state
  const [fullscreen, setFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState<'reading' | 'notes' | 'evaluation'>('reading');
  
  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showQuizResults, setShowQuizResults] = useState(false);
  
  // Essay reflection reveal state
  const [revealedEssays, setRevealedEssays] = useState<Record<string, boolean>>({});

  // Personal notes state
  const [noteInput, setNoteInput] = useState(personalNote);
  const [noteSavedNotice, setNoteSavedNotice] = useState(false);

  const handleSaveNote = () => {
    onSavePersonalNote(chapter.id, noteInput);
    setNoteSavedNotice(true);
    setTimeout(() => setNoteSavedNotice(false), 2500);
  };

  const handleAnswerSelect = (questionId: string, optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const calculateScore = () => {
    let correct = 0;
    chapter.quizQuestions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswerIndex) {
        correct++;
      }
    });
    return {
      correct,
      total: chapter.quizQuestions.length,
      percentage: Math.round((correct / (chapter.quizQuestions.length || 1)) * 100),
    };
  };

  const toggleEssayReveal = (essayId: string) => {
    setRevealedEssays((prev) => ({
      ...prev,
      [essayId]: !prev[essayId],
    }));
  };

  return (
    <article className={`space-y-8 pb-20 ${fullscreen ? 'fixed inset-0 z-50 overflow-y-auto bg-[#faf8f5] dark:bg-[#0c1311] p-4 sm:p-10' : ''}`}>
      
      {/* Top Floating Control Bar */}
      <div className="no-print sticky top-18 z-30 bg-[#faf8f5]/95 dark:bg-[#0c1311]/95 backdrop-blur-md py-3 px-4 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm flex flex-wrap items-center justify-between gap-3">
        
        {/* Left: Back button & Breadcrumb */}
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-stone-100 dark:bg-stone-900 text-stone-700 dark:text-stone-300 hover:bg-emerald-100 dark:hover:bg-emerald-950 transition border border-stone-200 dark:border-stone-800"
            title="Kembali ke daftar bab"
          >
            <ChevronLeft size={16} />
            <span>Daftar Bab</span>
          </button>

          <span className="text-xs font-bold text-amber-700 dark:text-amber-400 hidden sm:inline">
            Bab {chapter.number} dari 50
          </span>
        </div>

        {/* Center: Tabs switch (Reading, Notes, Evaluation) */}
        <div className="flex items-center bg-stone-100 dark:bg-stone-900 p-1 rounded-xl border border-stone-200 dark:border-stone-800 text-xs">
          <button
            onClick={() => setActiveTab('reading')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'reading'
                ? 'bg-emerald-800 text-amber-200 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            Materi
          </button>
          <button
            onClick={() => setActiveTab('evaluation')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'evaluation'
                ? 'bg-emerald-800 text-amber-200 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            Evaluasi ({chapter.quizQuestions.length})
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'notes'
                ? 'bg-emerald-800 text-amber-200 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            Catatan {personalNote ? '•' : ''}
          </button>
        </div>

        {/* Right: Actions toolbar (Complete, Bookmark, Share, Fullscreen, Print, Font Size) */}
        <div className="flex items-center gap-1.5">
          
          {/* Mark Complete Toggle */}
          <button
            onClick={() => onToggleCompleted(chapter.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              isCompleted
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-stone-100 dark:bg-stone-900 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800 hover:bg-emerald-50'
            }`}
            title="Tandai selesai dipelajari"
          >
            <CheckCircle2 size={16} className={isCompleted ? 'fill-white text-emerald-700' : ''} />
            <span className="hidden md:inline">{isCompleted ? 'Selesai Dibaca' : 'Tandai Selesai'}</span>
          </button>

          {/* Bookmark Toggle */}
          <button
            onClick={() => onToggleBookmark(chapter.id)}
            className={`p-2 rounded-xl text-xs font-semibold transition border ${
              isBookmarked
                ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-700'
                : 'bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-800'
            }`}
            title="Penanda buku"
          >
            <Bookmark size={16} className={isBookmarked ? 'fill-amber-500 text-amber-500' : ''} />
          </button>

          {/* Share */}
          <button
            onClick={() => onOpenShare(chapter)}
            className="p-2 rounded-xl bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-800 hover:text-stone-900 transition"
            title="Bagikan Bab Ini"
          >
            <Share2 size={16} />
          </button>

          {/* Print */}
          <button
            onClick={() => window.print()}
            className="p-2 rounded-xl bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-800 hover:text-stone-900 transition"
            title="Cetak format ramah cetak"
          >
            <Printer size={16} />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setFullscreen(!fullscreen)}
            className="p-2 rounded-xl bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-800 hover:text-stone-900 transition"
            title={fullscreen ? 'Keluar Layar Penuh' : 'Mode Layar Penuh'}
          >
            {fullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>

          {/* Edit */}
          <button
            onClick={() => onEditChapter(chapter)}
            className="p-2 rounded-xl bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-800 hover:text-stone-900 transition"
            title="Edit Materi Bab"
          >
            <Edit3 size={16} />
          </button>
        </div>
      </div>

      {/* Main Content Area based on activeTab */}
      {activeTab === 'reading' && (
        <div className="space-y-10 max-w-4xl mx-auto">
          
          {/* SECTION A: JUDUL PEMBAHASAN */}
          <header className="space-y-4 text-center border-b border-stone-200 dark:border-stone-800 pb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 border border-emerald-300/40">
              <IslamicStarIcon size={14} />
              <span>{chapter.jilidTitle}</span>
            </div>

            <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold text-stone-950 dark:text-stone-50 leading-tight">
              Bab {chapter.number}: {chapter.title}
            </h1>

            <div className="flex items-center justify-center gap-3 text-xs text-stone-500 dark:text-stone-400">
              <span className="font-semibold text-emerald-800 dark:text-emerald-400">
                Status: {chapter.status}
              </span>
              <span>•</span>
              <span>Terakhir diperbarui: {chapter.updatedAt}</span>
            </div>

            {/* Typography Sizing Quick Sliders in Toolbar */}
            <div className="no-print pt-2 flex items-center justify-center gap-6 text-xs text-stone-500">
              <div className="flex items-center gap-2">
                <span>Ukuran Latin:</span>
                <input
                  type="range"
                  min="14"
                  max="22"
                  value={settings.indoFontSize}
                  onChange={(e) => onUpdateSettings({ indoFontSize: Number(e.target.value) })}
                  className="w-20 accent-emerald-700"
                />
                <span className="font-mono">{settings.indoFontSize}px</span>
              </div>
              <div className="flex items-center gap-2">
                <span>Ukuran Arab:</span>
                <input
                  type="range"
                  min="20"
                  max="36"
                  value={settings.arabicFontSize}
                  onChange={(e) => onUpdateSettings({ arabicFontSize: Number(e.target.value) })}
                  className="w-20 accent-amber-600"
                />
                <span className="font-mono">{settings.arabicFontSize}px</span>
              </div>
            </div>
          </header>

          {/* SECTION B: TUJUAN PEMBELAJARAN */}
          <section className="p-6 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-800/15 dark:border-emerald-700/30 space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
              <Target size={18} className="text-amber-600 dark:text-amber-400" />
              <span>Tujuan Pembelajaran Bab Ini</span>
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm text-stone-800 dark:text-stone-200">
              {chapter.learningGoals.map((goal, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="text-emerald-700 dark:text-emerald-400 mt-0.5">✓</span>
                  <span>{goal}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* SECTION C: PENDAHULUAN */}
          <section className="space-y-3">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Sparkles size={20} className="text-amber-600" />
              <span>Pendahuluan</span>
            </h2>
            <div 
              style={{ fontSize: `${settings.indoFontSize}px` }}
              className="text-stone-800 dark:text-stone-200 leading-relaxed text-justify space-y-4"
            >
              <p>{chapter.introduction}</p>
            </div>
          </section>

          {/* SECTION D: PENGERTIAN DAN PENJELASAN */}
          <section className="space-y-4">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <BookOpen size={20} className="text-emerald-700" />
              <span>Pengertian dan Penjelasan Mendalam</span>
            </h2>
            <div 
              style={{ fontSize: `${settings.indoFontSize}px` }}
              className="text-stone-800 dark:text-stone-200 leading-relaxed text-justify space-y-4 whitespace-pre-line"
            >
              {chapter.explanation}
            </div>
          </section>

          <ArabesqueDivider />

          {/* SECTION E: DALIL DARI AL-QUR'AN */}
          <section className="space-y-6">
            <div className="flex items-center gap-2">
              <IslamicStarIcon size={22} className="text-amber-600 dark:text-amber-400" />
              <h2 className="font-display text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100">
                Dalil dari Al-Qur'anul Karim
              </h2>
            </div>

            <div className="space-y-5">
              {chapter.quranVerses.map((verse, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl p-6 bg-white dark:bg-[#121c18] border border-amber-600/30 dark:border-amber-500/20 shadow-xs space-y-4"
                >
                  {/* Surah Reference Tag */}
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-800 dark:text-emerald-400">
                    <span className="px-3 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 border border-emerald-300/40">
                      Q.S. {verse.surahName} [{verse.surahNumber}] : Ayat {verse.verseNumber}
                    </span>
                    <span className="text-stone-400 text-[11px] font-normal">
                      Rujukan: {verse.source}
                    </span>
                  </div>

                  {/* Arabic Text with user font size */}
                  <div 
                    style={{ fontSize: `${settings.arabicFontSize}px` }}
                    className="font-arabic text-stone-900 dark:text-stone-100 py-3 leading-loose text-right"
                  >
                    {verse.arabic}
                  </div>

                  {/* Indonesian Translation */}
                  <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-stone-900/60 border-l-4 border-amber-600 text-stone-800 dark:text-stone-200 text-xs sm:text-sm italic leading-relaxed">
                    "{verse.translation}"
                  </div>

                  {/* Relation/Explanation to topic */}
                  <div className="pt-2 text-xs sm:text-sm text-stone-700 dark:text-stone-300 space-y-1">
                    <strong className="text-emerald-900 dark:text-emerald-300 font-semibold block">
                      Kaitan Dalil dengan Pokok Pembahasan:
                    </strong>
                    <p>{verse.explanation}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION F: DALIL DARI HADIS */}
          <section className="space-y-6">
            <div className="flex items-center gap-2">
              <Quote size={22} className="text-emerald-700 dark:text-emerald-400" />
              <h2 className="font-display text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100">
                Dalil dari As-Sunnah (Hadis Sahih)
              </h2>
            </div>

            <div className="space-y-5">
              {chapter.hadiths.map((hadith, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl p-6 bg-white dark:bg-[#121c18] border border-emerald-800/20 dark:border-emerald-600/20 shadow-xs space-y-4"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-800 dark:text-emerald-400 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 border border-emerald-300/40">
                        {hadith.book} • {hadith.hadithNumber}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-700 text-white font-bold">
                        {hadith.grade}
                      </span>
                    </div>
                    <span className="text-stone-500 dark:text-stone-400 text-xs font-medium">
                      Perawi: {hadith.narrator}
                    </span>
                  </div>

                  {/* Arabic text if present */}
                  {hadith.arabic && (
                    <div 
                      style={{ fontSize: `${settings.arabicFontSize}px` }}
                      className="font-arabic text-stone-900 dark:text-stone-100 py-2 leading-loose text-right"
                    >
                      {hadith.arabic}
                    </div>
                  )}

                  {/* Indonesian translation */}
                  <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-stone-900/60 border-l-4 border-emerald-700 text-stone-800 dark:text-stone-200 text-xs sm:text-sm italic leading-relaxed">
                    "{hadith.translation}"
                  </div>

                  {/* Explanation */}
                  <div className="pt-2 text-xs sm:text-sm text-stone-700 dark:text-stone-300 space-y-1">
                    <strong className="text-emerald-900 dark:text-emerald-300 font-semibold block">
                      Penjelasan Makna dan Faedah Hadis:
                    </strong>
                    <p>{hadith.explanation}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION G: PENJELASAN ULAMA */}
          <section className="space-y-5">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <FileText size={20} className="text-amber-600" />
              <span>Penjelasan Para Ulama Mu'tabar</span>
            </h2>

            <div className="grid grid-cols-1 gap-4">
              {chapter.scholarQuotes.map((quote, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl p-5 bg-stone-50 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800 space-y-3"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-900 dark:text-emerald-300 text-sm">
                      {quote.scholarName}
                    </span>
                    <span className="text-stone-500 dark:text-stone-400 font-mono">
                      {quote.bookTitle} {quote.volumeAndPage ? `• ${quote.volumeAndPage}` : ''}
                    </span>
                  </div>

                  {quote.quote && (
                    <div className="font-arabic text-stone-800 dark:text-stone-200 text-lg py-1 text-right">
                      {quote.quote}
                    </div>
                  )}

                  <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                    {quote.context}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION H: CONTOH PENERAPAN */}
          <section className="p-6 rounded-2xl bg-amber-500/10 border border-amber-600/25 space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300 flex items-center gap-2">
              <Lightbulb size={18} className="text-amber-600 dark:text-amber-400" />
              <span>Contoh Penerapan dalam Kehidupan Sehari-hari</span>
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm text-stone-800 dark:text-stone-200">
              {chapter.practicalApplications.map((app, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="text-amber-600 dark:text-amber-400 font-bold mt-0.5">•</span>
                  <span>{app}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* SECTION I: KESIMPULAN */}
          <section className="p-6 rounded-2xl bg-emerald-900 text-amber-100 space-y-3 shadow-md">
            <h2 className="text-sm font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2">
              <IslamicStarIcon size={18} className="text-amber-300" />
              <span>Kesimpulan Inti Pembahasan</span>
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm text-emerald-100">
              {chapter.conclusions.map((conc, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="text-amber-300 font-bold mt-0.5">❖</span>
                  <span>{conc}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Quick jump to evaluation button */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#121c18] border border-stone-200 dark:border-stone-800 text-center space-y-3">
            <HelpCircle size={32} className="mx-auto text-emerald-700 dark:text-emerald-400" />
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
              Uji Pemahaman Anda tentang Bab Ini
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 max-w-md mx-auto">
              Selesaikan 5 soal pilihan ganda interaktif dan 2 pertanyaan refleksi uraian untuk menguji penguasaan materi Anda.
            </p>
            <button
              onClick={() => setActiveTab('evaluation')}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-800 text-amber-200 hover:bg-emerald-700 transition"
            >
              Mulai Evaluasi Pemahaman
            </button>
          </div>

          {/* SECTION K: DAFTAR REFERENSI */}
          <section className="p-5 rounded-2xl bg-stone-100 dark:bg-stone-900/40 border border-stone-200 dark:border-stone-800 space-y-3 text-xs">
            <h3 className="font-bold text-stone-800 dark:text-stone-200 uppercase tracking-wider">
              Daftar Referensi Kitab & Sumber Rujukan
            </h3>
            <ul className="space-y-1.5 text-stone-600 dark:text-stone-400">
              {chapter.references.map((ref, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="font-mono text-stone-400">{idx + 1}.</span>
                  <span className="font-semibold text-stone-800 dark:text-stone-200">{ref.title}</span>
                  <span>— {ref.author}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                    {ref.type}
                  </span>
                </li>
              ))}
            </ul>
          </section>

        </div>
      )}

      {/* SECTION J: EVALUASI PEMAHAMAN TAB */}
      {activeTab === 'evaluation' && (
        <div className="space-y-8 max-w-3xl mx-auto">
          
          <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-900/10 dark:border-emerald-700/30 text-center space-y-2">
            <h2 className="font-display text-2xl font-bold text-emerald-950 dark:text-emerald-100">
              Evaluasi Pemahaman: Bab {chapter.number}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300">
              Jawablah lima soal pilihan ganda berikut untuk menguji pemahaman Anda, kemudian renungkan dua pertanyaan uraian di bawahnya.
            </p>
          </div>

          {/* 5 Multiple Choice Questions */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-2">
              <ListOrdered size={18} className="text-emerald-700" />
              <span>Bagian I: Soal Pilihan Ganda (5 Soal)</span>
            </h3>

            {chapter.quizQuestions.map((q, qIndex) => {
              const selectedOpt = selectedAnswers[q.id];
              const isAnswered = selectedOpt !== undefined;
              const isCorrect = selectedOpt === q.correctAnswerIndex;

              return (
                <div
                  key={q.id}
                  className="p-6 rounded-2xl bg-white dark:bg-[#121c18] border border-stone-200 dark:border-stone-800 shadow-xs space-y-4"
                >
                  <p className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100">
                    {qIndex + 1}. {q.question}
                  </p>

                  <div className="space-y-2">
                    {q.options.map((opt, optIndex) => {
                      const isOptionSelected = selectedOpt === optIndex;
                      const isOptionTheCorrectAnswer = optIndex === q.correctAnswerIndex;

                      let buttonClass = 'border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-900 text-stone-800 dark:text-stone-200';
                      
                      if (showQuizResults) {
                        if (isOptionTheCorrectAnswer) {
                          buttonClass = 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-100 font-semibold';
                        } else if (isOptionSelected && !isOptionTheCorrectAnswer) {
                          buttonClass = 'border-red-500 bg-red-50 dark:bg-red-950/60 text-red-950 dark:text-red-100';
                        }
                      } else if (isOptionSelected) {
                        buttonClass = 'border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-semibold';
                      }

                      return (
                        <button
                          key={optIndex}
                          onClick={() => handleAnswerSelect(q.id, optIndex)}
                          className={`w-full text-left p-3.5 rounded-xl text-xs sm:text-sm border transition flex items-center gap-3 ${buttonClass}`}
                        >
                          <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center font-bold text-xs shrink-0">
                            {String.fromCharCode(65 + optIndex)}
                          </span>
                          <span className="flex-1">{opt}</span>
                          {showQuizResults && isOptionTheCorrectAnswer && (
                            <Check size={16} className="text-emerald-600 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Feedback Explanation */}
                  {showQuizResults && (
                    <div className={`p-4 rounded-xl text-xs sm:text-sm leading-relaxed ${
                      isCorrect 
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 border border-emerald-500/30' 
                        : 'bg-amber-50 dark:bg-amber-950/50 text-amber-900 dark:text-amber-200 border border-amber-500/30'
                    }`}>
                      <p className="font-bold flex items-center gap-1.5 mb-1">
                        {isCorrect ? <Check size={16} className="text-emerald-600" /> : <AlertCircle size={16} className="text-amber-600" />}
                        <span>{isCorrect ? 'Jawaban Benar!' : 'Penjelasan Kunci Jawaban:'}</span>
                      </p>
                      <p>{q.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Check Answers / Results Toolbar */}
            <div className="p-6 rounded-2xl bg-stone-100 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-stone-500">
                  Terjawab: {Object.keys(selectedAnswers).length} dari {chapter.quizQuestions.length} Soal
                </span>
                {showQuizResults && (
                  <p className="text-lg font-bold text-emerald-800 dark:text-emerald-400 mt-1">
                    Skor Anda: {calculateScore().correct} / {calculateScore().total} ({calculateScore().percentage}%)
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                {!showQuizResults ? (
                  <button
                    onClick={() => setShowQuizResults(true)}
                    disabled={Object.keys(selectedAnswers).length === 0}
                    className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-800 text-amber-200 hover:bg-emerald-700 disabled:opacity-50 transition shadow-xs"
                  >
                    Periksa Jawaban
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setShowQuizResults(false);
                      setSelectedAnswers({});
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 hover:bg-stone-300 transition"
                  >
                    Ulangi Kuis
                  </button>
                )}
              </div>
            </div>
          </div>

          <ArabesqueDivider />

          {/* 2 Essay / Reflection Questions */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-2">
              <FileText size={18} className="text-amber-600" />
              <span>Bagian II: Pertanyaan Uraian & Kunci Refleksi (2 Soal)</span>
            </h3>

            {chapter.essayQuestions.map((eq, eqIndex) => (
              <div
                key={eq.id}
                className="p-6 rounded-2xl bg-white dark:bg-[#121c18] border border-stone-200 dark:border-stone-800 shadow-xs space-y-4"
              >
                <div className="space-y-2">
                  <span className="text-xs font-bold text-amber-700 dark:text-amber-400">
                    Pertanyaan Uraian {eqIndex + 1}
                  </span>
                  <p className="text-sm sm:text-base font-semibold text-stone-900 dark:text-stone-100">
                    {eq.question}
                  </p>
                </div>

                <div>
                  <button
                    onClick={() => toggleEssayReveal(eq.id)}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-emerald-100 dark:hover:bg-emerald-950 transition"
                  >
                    {revealedEssays[eq.id] ? 'Tutup Kunci Refleksi' : 'Buka Kunci Jawaban & Refleksi'}
                  </button>
                </div>

                {revealedEssays[eq.id] && (
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-600/25 text-stone-800 dark:text-stone-200 text-xs sm:text-sm leading-relaxed space-y-1 animate-in fade-in">
                    <strong className="block text-amber-900 dark:text-amber-300 font-bold">
                      Kunci Jawaban & Panduan Refleksi:
                    </strong>
                    <p>{eq.reflectionKey}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Back to reading tab button */}
          <div className="text-center pt-4">
            <button
              onClick={() => setActiveTab('reading')}
              className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 underline underline-offset-4 hover:text-emerald-700"
            >
              ← Kembali Membaca Materi Lengkap
            </button>
          </div>
        </div>
      )}

      {/* PERSONAL NOTES TAB */}
      {activeTab === 'notes' && (
        <div className="space-y-6 max-w-3xl mx-auto">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#121c18] border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <MessageSquare size={20} className="text-emerald-700" />
                <span>Catatan Pribadi untuk Bab {chapter.number}</span>
              </h2>
              {noteSavedNotice && (
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 animate-in fade-in">
                  <Check size={14} /> Tersimpan
                </span>
              )}
            </div>

            <p className="text-xs text-stone-500 dark:text-stone-400">
              Tuliskan faedah, renungan, atau ringkasan pribadi Anda di sini. Catatan tersimpan secara aman di peramban perangkat Anda.
            </p>

            <textarea
              rows={8}
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              placeholder="Tuliskan catatan faedah ilmu, ayat yang berkesan, atau komitmen amalan di sini..."
              className="w-full p-4 rounded-xl text-xs sm:text-sm bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-700 leading-relaxed"
            />

            <div className="flex justify-end">
              <button
                onClick={handleSaveNote}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-800 text-amber-200 hover:bg-emerald-700 transition flex items-center gap-2 shadow-xs"
              >
                <Save size={16} />
                <span>Simpan Catatan</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECTION L: PREVIOUS & NEXT CHAPTER NAVIGATION */}
      <nav className="no-print pt-10 border-t border-stone-200 dark:border-stone-800 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
        {previousChapter ? (
          <button
            onClick={() => onNavigateChapter(previousChapter.id)}
            className="p-4 rounded-2xl bg-white dark:bg-[#121c18] border border-stone-200 dark:border-stone-800 hover:border-emerald-600 text-left transition flex items-center gap-3 group shadow-xs"
          >
            <ChevronLeft size={20} className="text-emerald-700 group-hover:-translate-x-1 transition-transform shrink-0" />
            <div>
              <span className="text-[11px] font-bold text-stone-400 block uppercase">
                Pembahasan Sebelumnya
              </span>
              <span className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 line-clamp-1">
                Bab {previousChapter.number}: {previousChapter.title}
              </span>
            </div>
          </button>
        ) : (
          <div className="hidden sm:block" />
        )}

        {nextChapter ? (
          <button
            onClick={() => onNavigateChapter(nextChapter.id)}
            className="p-4 rounded-2xl bg-white dark:bg-[#121c18] border border-stone-200 dark:border-stone-800 hover:border-emerald-600 text-right transition flex items-center justify-end gap-3 group shadow-xs sm:col-start-2"
          >
            <div>
              <span className="text-[11px] font-bold text-stone-400 block uppercase">
                Pembahasan Berikutnya
              </span>
              <span className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 line-clamp-1">
                Bab {nextChapter.number}: {nextChapter.title}
              </span>
            </div>
            <ChevronRight size={20} className="text-emerald-700 group-hover:translate-x-1 transition-transform shrink-0" />
          </button>
        ) : (
          <div className="p-4 rounded-2xl bg-emerald-900 text-amber-200 text-center text-xs font-semibold">
            🎉 Selamat! Anda telah menyelesaikan seluruh 50 Bab Pokok Akidah Islam.
          </div>
        )}
      </nav>

    </article>
  );
};
