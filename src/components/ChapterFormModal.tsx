import React, { useState } from 'react';
import { X, Save, AlertTriangle, Plus, Trash2 } from 'lucide-react';
import { Chapter, ChapterStatus, JilidId } from '../types';

interface ChapterFormModalProps {
  initialChapter?: Chapter | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (chapter: Chapter) => void;
  existingCount: number;
}

export const ChapterFormModal: React.FC<ChapterFormModalProps> = ({
  initialChapter,
  isOpen,
  onClose,
  onSave,
  existingCount,
}) => {
  if (!isOpen) return null;

  const isEditing = Boolean(initialChapter);

  // Form states
  const [number, setNumber] = useState(initialChapter?.number || existingCount + 1);
  const [jilidId, setJilidId] = useState<JilidId>(initialChapter?.jilidId || 1);
  const [title, setTitle] = useState(initialChapter?.title || '');
  const [status, setStatus] = useState<ChapterStatus>(initialChapter?.status || 'Telah ditinjau');
  const [goalsText, setGoalsText] = useState(initialChapter?.learningGoals.join('\n') || '');
  const [introduction, setIntroduction] = useState(initialChapter?.introduction || '');
  const [explanation, setExplanation] = useState(initialChapter?.explanation || '');
  
  // Quran Dalil
  const [quranArabic, setQuranArabic] = useState(initialChapter?.quranVerses[0]?.arabic || '');
  const [surahName, setSurahName] = useState(initialChapter?.quranVerses[0]?.surahName || '');
  const [surahNumber, setSurahNumber] = useState(initialChapter?.quranVerses[0]?.surahNumber || 1);
  const [verseNumber, setVerseNumber] = useState(initialChapter?.quranVerses[0]?.verseNumber || 1);
  const [quranTranslation, setQuranTranslation] = useState(initialChapter?.quranVerses[0]?.translation || '');
  const [quranExplanation, setQuranExplanation] = useState(initialChapter?.quranVerses[0]?.explanation || '');

  // Hadith Dalil
  const [hadithArabic, setHadithArabic] = useState(initialChapter?.hadiths[0]?.arabic || '');
  const [hadithTranslation, setHadithTranslation] = useState(initialChapter?.hadiths[0]?.translation || '');
  const [hadithNarrator, setHadithNarrator] = useState(initialChapter?.hadiths[0]?.narrator || '');
  const [hadithBook, setHadithBook] = useState(initialChapter?.hadiths[0]?.book || 'Sahih Al-Bukhari');
  const [hadithNumber, setHadithNumber] = useState(initialChapter?.hadiths[0]?.hadithNumber || 'No. 1');
  const [hadithGrade, setHadithGrade] = useState<'Sahih' | 'Hasan' | 'Perlu verifikasi'>(initialChapter?.hadiths[0]?.grade || 'Sahih');
  const [hadithExplanation, setHadithExplanation] = useState(initialChapter?.hadiths[0]?.explanation || '');

  // Scholar Quote
  const [scholarName, setScholarName] = useState(initialChapter?.scholarQuotes[0]?.scholarName || '');
  const [scholarBook, setScholarBook] = useState(initialChapter?.scholarQuotes[0]?.bookTitle || '');
  const [scholarContext, setScholarContext] = useState(initialChapter?.scholarQuotes[0]?.context || '');

  // Applications & Conclusions
  const [applicationsText, setApplicationsText] = useState(initialChapter?.practicalApplications.join('\n') || '');
  const [conclusionsText, setConclusionsText] = useState(initialChapter?.conclusions.join('\n') || '');

  const [validationError, setValidationError] = useState('');

  const getJilidTitle = (id: JilidId) => {
    switch (id) {
      case 1: return 'Jilid I — Dasar-Dasar Akidah Islam';
      case 2: return 'Jilid II — Iman kepada Allah dan Tauhid';
      case 3: return 'Jilid III — Iman kepada Malaikat, Kitab, dan Rasul';
      case 4: return 'Jilid IV — Iman kepada Akhirat dan Takdir';
      case 5: return 'Jilid V — Pemurnian Akidah dan Penerapannya';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setValidationError('Judul pembahasan tidak boleh kosong.');
      return;
    }
    if (!introduction.trim()) {
      setValidationError('Pendahuluan tidak boleh kosong.');
      return;
    }
    if (!explanation.trim()) {
      setValidationError('Isi penjelasan materi tidak boleh kosong.');
      return;
    }

    const chapterToSave: Chapter = {
      id: initialChapter?.id || `bab-${number}-${Date.now().toString(36)}`,
      number: Number(number),
      jilidId: Number(jilidId) as JilidId,
      jilidTitle: getJilidTitle(Number(jilidId) as JilidId),
      title: title.trim(),
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      status,
      learningGoals: goalsText.split('\n').filter((line) => line.trim().length > 0),
      introduction: introduction.trim(),
      explanation: explanation.trim(),
      quranVerses: [
        {
          arabic: quranArabic.trim(),
          surahName: surahName.trim() || 'Al-Baqarah',
          surahNumber: Number(surahNumber) || 1,
          verseNumber: Number(verseNumber) || 1,
          translation: quranTranslation.trim(),
          source: 'Al-Qur\'an dan Terjemahnya, Kemenag RI',
          explanation: quranExplanation.trim(),
        },
      ],
      hadiths: [
        {
          arabic: hadithArabic.trim(),
          translation: hadithTranslation.trim(),
          narrator: hadithNarrator.trim() || 'Abu Hurairah radhiyallahu \'anhu',
          book: hadithBook.trim() || 'Sahih Al-Bukhari',
          hadithNumber: hadithNumber.trim() || 'No. 1',
          grade: hadithGrade,
          explanation: hadithExplanation.trim(),
        },
      ],
      scholarQuotes: [
        {
          scholarName: scholarName.trim() || 'Imam Ibnu Katsir rahimahullah',
          bookTitle: scholarBook.trim() || 'Tafsir Al-Qur\'an Al-Azhim',
          quote: '',
          context: scholarContext.trim() || 'Penjelasan ulama mengenai kaitan ayat dengan pokok akidah.',
        },
      ],
      practicalApplications: applicationsText.split('\n').filter((l) => l.trim().length > 0),
      conclusions: conclusionsText.split('\n').filter((l) => l.trim().length > 0),
      quizQuestions: initialChapter?.quizQuestions || [
        {
          id: `q-${Date.now()}-1`,
          question: `Apakah pesan pokok yang dibahas dalam Bab ${number}: ${title}?`,
          options: ['Memurnikan tauhid dan ittiba\' kepada dalil sahih', 'Mencari harta dunia', 'Membuat adat baru', 'Meninggalkan shalat'],
          correctAnswerIndex: 0,
          explanation: 'Pembahasan ini menekankan pemurnian keyakinan berlandaskan Al-Qur\'an dan Sunnah.',
        },
        {
          id: `q-${Date.now()}-2`,
          question: 'Bagaimanakah sikap seorang penuntut ilmu terhadap materi bab ini?',
          options: ['Mempelajari, meyakini, dan mengamalkannya dalam kehidupan', 'Mengabaikannya', 'Menjadikannya bahan debat kusir', 'Menolak dalil shahih'],
          correctAnswerIndex: 0,
          explanation: 'Ilmu syar\'i dipelajari untuk diamalkan dengan ikhlas.',
        },
        {
          id: `q-${Date.now()}-3`,
          question: 'Apakah sumber utama rujukan yang digunakan dalam materi ini?',
          options: ['Al-Qur\'an dan Sunnah sesuai pemahaman salaf', 'Mimpi dan ramalan', 'Koran pagi', 'Filsafat Yunani'],
          correctAnswerIndex: 0,
          explanation: 'Akidah Islam bersumber dari Al-Qur\'an dan Sunnah.',
        },
        {
          id: `q-${Date.now()}-4`,
          question: 'Apa akibat menyalahi pokok pembahasan akidah ini?',
          options: ['Terancam penyimpangan keyakinan dan kesia-siaan amal', 'Mendapat pujian orang banyak', 'Menjadi kaya mendadak', 'Tidak berdosa apa pun'],
          correctAnswerIndex: 0,
          explanation: 'Akidah adalah penentu keselamatan di akhirat.',
        },
        {
          id: `q-${Date.now()}-5`,
          question: 'Kaidah manakah yang selaras dengan bab ini?',
          options: ['Al-Ilmu qabla al-qawli wal \'amal', 'Mendahulukan akal di atas firman Allah', 'Taklid buta tanpa dalil', 'Membuat bid\'ah baru'],
          correctAnswerIndex: 0,
          explanation: 'Berilmu sebelum berkata dan bertindak adalah prinsip utama.',
        },
      ],
      essayQuestions: initialChapter?.essayQuestions || [
        {
          id: `eq-${Date.now()}-1`,
          question: `Jelaskan hikmah utama dari pembahasan materi Bab ${number} ini bagi kehidupan seorang mukmin!`,
          reflectionKey: 'Materi ini membimbing hati untuk semakin tunduk kepada Allah, memurnikan ibadah dari noda kesyirikan, dan meneladani Sunnah Rasulullah shallallahu \'alaihi wa sallam.',
        },
        {
          id: `eq-${Date.now()}-2`,
          question: 'Bagaimana cara menerapkan isi bab ini di tengah keluarga dan masyarakat?',
          reflectionKey: 'Dengan menjadi teladan akhlak mulia, mengajarkan tauhid dengan santun, serta istiqamah dalam ketaatan.',
        },
      ],
      references: initialChapter?.references || [
        { id: `ref-${Date.now()}-1`, title: 'Al-Qur\'an dan Terjemahnya', author: 'Kemenag RI', type: 'Dokumen Resmi' },
        { id: `ref-${Date.now()}-2`, title: 'Sahih Al-Bukhari', author: 'Imam Al-Bukhari', type: 'Kitab Primer' },
        { id: `ref-${Date.now()}-3`, title: 'Tafsir Ibnu Katsir', author: 'Al-Hafizh Ibnu Katsir', type: 'Tafsir' },
      ],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    onSave(chapterToSave);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl bg-white dark:bg-[#121c18] rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50/50 dark:bg-stone-900/50">
          <div>
            <h2 className="font-display text-xl font-bold text-stone-900 dark:text-stone-100">
              {isEditing ? `Edit Materi: Bab ${initialChapter?.number}` : '+ Tambah Materi Pembahasan Baru'}
            </h2>
            <p className="text-xs text-stone-500">
              Lengkapi struktur materi bab akidah sesuai kaidah keilmuan Islam berdalil shahih.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body (Scrollable) */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6 flex-1 text-xs sm:text-sm">
          
          {validationError && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 flex items-center gap-2">
              <AlertTriangle size={18} />
              <span>{validationError}</span>
            </div>
          )}

          {/* Row 1: Nomor Bab, Jilid, Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Nomor Bab
              </label>
              <input
                type="number"
                min="1"
                max="999"
                value={number}
                onChange={(e) => setNumber(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 focus:ring-2 focus:ring-emerald-700"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Kategori Jilid
              </label>
              <select
                value={jilidId}
                onChange={(e) => setJilidId(Number(e.target.value) as JilidId)}
                className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 focus:ring-2 focus:ring-emerald-700"
              >
                <option value={1}>Jilid I — Dasar-Dasar Akidah</option>
                <option value={2}>Jilid II — Iman kepada Allah & Tauhid</option>
                <option value={3}>Jilid III — Malaikat, Kitab, Rasul</option>
                <option value={4}>Jilid IV — Akhirat & Takdir</option>
                <option value={5}>Jilid V — Pemurnian Akidah</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Status Publikasi
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ChapterStatus)}
                className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 focus:ring-2 focus:ring-emerald-700"
              >
                <option value="Telah ditinjau">✓ Telah Ditinjau</option>
                <option value="Siap ditinjau">Siap Ditinjau</option>
                <option value="Perlu verifikasi">Perlu Verifikasi</option>
                <option value="Draf">Draf</option>
              </select>
            </div>
          </div>

          {/* Judul Pembahasan */}
          <div>
            <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Judul Pembahasan Bab *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Pengertian Akidah Islam dan Kedudukannya dalam Agama"
              className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 focus:ring-2 focus:ring-emerald-700 font-semibold"
              required
            />
          </div>

          {/* Tujuan Pembelajaran */}
          <div>
            <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Tujuan Pembelajaran (Satu baris untuk setiap poin)
            </label>
            <textarea
              rows={3}
              value={goalsText}
              onChange={(e) => setGoalsText(e.target.value)}
              placeholder="Memahami hakikat tauhid...&#10;Mengenal dalil Al-Qur'an...&#10;Mengaplikasikan dalam ibadah..."
              className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          {/* Pendahuluan */}
          <div>
            <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Pendahuluan *
            </label>
            <textarea
              rows={3}
              value={introduction}
              onChange={(e) => setIntroduction(e.target.value)}
              placeholder="Uraikan pengantar urgensi materi bab ini..."
              className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 focus:ring-2 focus:ring-emerald-700"
              required
            />
          </div>

          {/* Pengertian & Penjelasan */}
          <div>
            <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Pengertian dan Penjelasan Mendalam *
            </label>
            <textarea
              rows={6}
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Uraikan penjelasan sistematis, makna etimologi, terminologi, dan konsekuensinya..."
              className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 focus:ring-2 focus:ring-emerald-700"
              required
            />
          </div>

          {/* Dalil Al-Qur'an Form Block */}
          <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-stone-900/60 border border-amber-600/30 space-y-3">
            <h3 className="font-bold text-amber-900 dark:text-amber-300 text-sm">
              Dalil Utama dari Al-Qur'anul Karim
            </h3>
            <div>
              <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1">
                Teks Ayat Arab yang Benar
              </label>
              <textarea
                rows={2}
                value={quranArabic}
                onChange={(e) => setQuranArabic(e.target.value)}
                placeholder="Tuliskan teks Arab ayat Al-Qur'an yang sahih..."
                className="w-full p-2 rounded-xl bg-white dark:bg-black/30 border border-stone-200 dark:border-stone-700 font-arabic text-lg text-right"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1">Nama Surah</label>
                <input
                  type="text"
                  value={surahName}
                  onChange={(e) => setSurahName(e.target.value)}
                  placeholder="Misal: Al-Baqarah"
                  className="w-full p-2 rounded-xl bg-white dark:bg-black/30 border border-stone-200 dark:border-stone-700 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1">Nomor Surah</label>
                <input
                  type="number"
                  value={surahNumber}
                  onChange={(e) => setSurahNumber(Number(e.target.value))}
                  className="w-full p-2 rounded-xl bg-white dark:bg-black/30 border border-stone-200 dark:border-stone-700 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1">Nomor Ayat</label>
                <input
                  type="number"
                  value={verseNumber}
                  onChange={(e) => setVerseNumber(Number(e.target.value))}
                  className="w-full p-2 rounded-xl bg-white dark:bg-black/30 border border-stone-200 dark:border-stone-700 text-xs"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1">Terjemahan Kemenag RI</label>
              <textarea
                rows={2}
                value={quranTranslation}
                onChange={(e) => setQuranTranslation(e.target.value)}
                placeholder="Terjemahan resmi ayat dalam bahasa Indonesia..."
                className="w-full p-2 rounded-xl bg-white dark:bg-black/30 border border-stone-200 dark:border-stone-700 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1">Kaitan Ayat dengan Pokok Pembahasan</label>
              <input
                type="text"
                value={quranExplanation}
                onChange={(e) => setQuranExplanation(e.target.value)}
                placeholder="Jelaskan kaitan ayat ini dengan materi bab..."
                className="w-full p-2 rounded-xl bg-white dark:bg-black/30 border border-stone-200 dark:border-stone-700 text-xs"
              />
            </div>
          </div>

          {/* Dalil Hadis Form Block */}
          <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-stone-900/60 border border-emerald-700/30 space-y-3">
            <h3 className="font-bold text-emerald-900 dark:text-emerald-300 text-sm">
              Dalil Utama dari Hadis Sahih
            </h3>
            <div>
              <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1">Teks Hadis Arab</label>
              <textarea
                rows={2}
                value={hadithArabic}
                onChange={(e) => setHadithArabic(e.target.value)}
                placeholder="Teks Arab hadis jika tersedia..."
                className="w-full p-2 rounded-xl bg-white dark:bg-black/30 border border-stone-200 dark:border-stone-700 font-arabic text-lg text-right"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1">Sahabat Perawi</label>
                <input
                  type="text"
                  value={hadithNarrator}
                  onChange={(e) => setHadithNarrator(e.target.value)}
                  placeholder="Misal: Umar bin Al-Khaththab"
                  className="w-full p-2 rounded-xl bg-white dark:bg-black/30 border border-stone-200 dark:border-stone-700 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1">Kitab Hadis</label>
                <input
                  type="text"
                  value={hadithBook}
                  onChange={(e) => setHadithBook(e.target.value)}
                  placeholder="Sahih Al-Bukhari"
                  className="w-full p-2 rounded-xl bg-white dark:bg-black/30 border border-stone-200 dark:border-stone-700 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1">Nomor Hadis</label>
                <input
                  type="text"
                  value={hadithNumber}
                  onChange={(e) => setHadithNumber(e.target.value)}
                  placeholder="No. 8"
                  className="w-full p-2 rounded-xl bg-white dark:bg-black/30 border border-stone-200 dark:border-stone-700 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1">Derajat Hadis</label>
                <select
                  value={hadithGrade}
                  onChange={(e) => setHadithGrade(e.target.value as any)}
                  className="w-full p-2 rounded-xl bg-white dark:bg-black/30 border border-stone-200 dark:border-stone-700 text-xs"
                >
                  <option value="Sahih">Sahih</option>
                  <option value="Hasan">Hasan</option>
                  <option value="Perlu verifikasi">Perlu verifikasi</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1">Terjemahan Hadis</label>
              <textarea
                rows={2}
                value={hadithTranslation}
                onChange={(e) => setHadithTranslation(e.target.value)}
                placeholder="Terjemahan bahasa Indonesia yang jelas..."
                className="w-full p-2 rounded-xl bg-white dark:bg-black/30 border border-stone-200 dark:border-stone-700 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1">Penjelasan Faedah Hadis</label>
              <input
                type="text"
                value={hadithExplanation}
                onChange={(e) => setHadithExplanation(e.target.value)}
                placeholder="Hubungan hadis ini dengan pokok materi..."
                className="w-full p-2 rounded-xl bg-white dark:bg-black/30 border border-stone-200 dark:border-stone-700 text-xs"
              />
            </div>
          </div>

          {/* Penjelasan Ulama */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Nama Ulama yang Dirujuk
              </label>
              <input
                type="text"
                value={scholarName}
                onChange={(e) => setScholarName(e.target.value)}
                placeholder="Misal: Imam Ibnu Katsir rahimahullah"
                className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Judul Kitab Rujukan
              </label>
              <input
                type="text"
                value={scholarBook}
                onChange={(e) => setScholarBook(e.target.value)}
                placeholder="Misal: Tafsir Al-Qur'an Al-Azhim"
                className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
              />
            </div>
          </div>
          <div>
            <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Konteks Pendapat Ulama
            </label>
            <input
              type="text"
              value={scholarContext}
              onChange={(e) => setScholarContext(e.target.value)}
              placeholder="Uraikan intisari pendapat ulama tersebut..."
              className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
            />
          </div>

          {/* Contoh Penerapan & Kesimpulan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Contoh Penerapan (Satu baris per poin)
              </label>
              <textarea
                rows={3}
                value={applicationsText}
                onChange={(e) => setApplicationsText(e.target.value)}
                placeholder="Contoh 1...&#10;Contoh 2...&#10;Contoh 3..."
                className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Kesimpulan Inti (Satu baris per poin)
              </label>
              <textarea
                rows={3}
                value={conclusionsText}
                onChange={(e) => setConclusionsText(e.target.value)}
                placeholder="Poin kesimpulan 1...&#10;Poin kesimpulan 2...&#10;Poin kesimpulan 3..."
                className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
              />
            </div>
          </div>

          {/* Footer Submit Buttons */}
          <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-800 text-amber-200 hover:bg-emerald-700 transition flex items-center gap-2 shadow-sm"
            >
              <Save size={16} />
              <span>{isEditing ? 'Simpan Perubahan' : 'Simpan Materi Baru'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
