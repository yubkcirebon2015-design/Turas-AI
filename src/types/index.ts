export type JilidId = 1 | 2 | 3 | 4 | 5;

export type ChapterStatus = 'Telah ditinjau' | 'Siap ditinjau' | 'Perlu verifikasi' | 'Draf';

export interface QuranVerse {
  arabic: string;
  surahName: string;
  surahNumber: number;
  verseNumber: number;
  translation: string;
  source: string;
  explanation: string;
}

export interface Hadith {
  arabic: string;
  translation: string;
  narrator: string;
  book: string;
  hadithNumber: string;
  grade: 'Sahih' | 'Hasan' | 'Perlu verifikasi';
  scholarGrading?: string;
  explanation: string;
}

export interface ScholarQuote {
  scholarName: string;
  bookTitle: string;
  volumeAndPage?: string;
  edition?: string;
  quote: string;
  context: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface EssayQuestion {
  id: string;
  question: string;
  reflectionKey: string;
}

export interface ReferenceItem {
  id: string;
  title: string;
  author: string;
  type: 'Kitab Primer' | 'Kitab Syarah' | 'Tafsir' | 'Karya Kontemporer' | 'Dokumen Resmi';
  notes?: string;
}

export interface Chapter {
  id: string;
  number: number;
  jilidId: JilidId;
  jilidTitle: string;
  title: string;
  slug: string;
  status: ChapterStatus;
  learningGoals: string[];
  introduction: string;
  explanation: string;
  quranVerses: QuranVerse[];
  hadiths: Hadith[];
  scholarQuotes: ScholarQuote[];
  practicalApplications: string[];
  conclusions: string[];
  quizQuestions: QuizQuestion[];
  essayQuestions: EssayQuestion[];
  references: ReferenceItem[];
  updatedAt: string;
  versionHistory?: Array<{
    timestamp: string;
    note: string;
  }>;
}

export interface JilidInfo {
  id: JilidId;
  numberRoman: string;
  title: string;
  subtitle: string;
  description: string;
  startChapter: number;
  endChapter: number;
  color: string;
}

export interface UserProgress {
  completedChapterIds: string[];
  bookmarkedChapterIds: string[];
  lastReadChapterId: string | null;
  personalNotes: Record<string, string>; // chapterId -> note
  quizScores: Record<string, { score: number; total: number; date: string }>;
  streakDays: number;
  lastActiveDate: string;
}

export interface ReaderSettings {
  arabicFontSize: number; // e.g. 26
  indoFontSize: number; // e.g. 17
  lineHeight: 'normal' | 'relaxed' | 'loose';
  theme: 'light' | 'dark';
}

export type ViewState = 
  | { type: 'home' }
  | { type: 'curriculum' }
  | { type: 'jilid'; jilidId: JilidId }
  | { type: 'chapter'; chapterId: string }
  | { type: 'search'; query?: string }
  | { type: 'bookmarks' }
  | { type: 'progress' }
  | { type: 'quiz'; chapterId?: string }
  | { type: 'references' }
  | { type: 'about' }
  | { type: 'add_chapter' }
  | { type: 'edit_chapter'; chapterId: string };
