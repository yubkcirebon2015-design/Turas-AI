import { Chapter, UserProgress, ReaderSettings } from '../types';
import { INITIAL_CHAPTERS } from '../data/initialChapters';

const STORAGE_KEYS = {
  CHAPTERS: 'maktabah_ahlu_sunnah_chapters_v1',
  PROGRESS: 'maktabah_ahlu_sunnah_progress_v1',
  SETTINGS: 'maktabah_ahlu_sunnah_settings_v1',
};

export const DEFAULT_SETTINGS: ReaderSettings = {
  arabicFontSize: 26,
  indoFontSize: 17,
  lineHeight: 'relaxed',
  theme: 'light',
};

export const DEFAULT_PROGRESS: UserProgress = {
  completedChapterIds: [],
  bookmarkedChapterIds: [],
  lastReadChapterId: null,
  personalNotes: {},
  quizScores: {},
  streakDays: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
};

// --- CHAPTERS MANAGEMENT (CRUD) ---

export function getStoredChapters(): Chapter[] {
  if (typeof window === 'undefined') return INITIAL_CHAPTERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CHAPTERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CHAPTERS, JSON.stringify(INITIAL_CHAPTERS));
      return INITIAL_CHAPTERS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_CHAPTERS;
  } catch (err) {
    console.error('Error reading chapters from storage:', err);
    return INITIAL_CHAPTERS;
  }
}

export function saveStoredChapters(chapters: Chapter[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CHAPTERS, JSON.stringify(chapters));
  } catch (err) {
    console.error('Error saving chapters to storage:', err);
  }
}

export function resetChaptersToDefault(): Chapter[] {
  saveStoredChapters(INITIAL_CHAPTERS);
  return INITIAL_CHAPTERS;
}

export function addChapter(newChapter: Chapter): Chapter[] {
  const current = getStoredChapters();
  const updated = [...current, newChapter];
  saveStoredChapters(updated);
  return updated;
}

export function updateChapter(updatedChapter: Chapter): Chapter[] {
  const current = getStoredChapters();
  const index = current.findIndex((c) => c.id === updatedChapter.id);
  if (index === -1) {
    return current;
  }
  const updatedList = [...current];
  updatedList[index] = {
    ...updatedChapter,
    updatedAt: new Date().toISOString().split('T')[0],
    versionHistory: [
      ...(current[index].versionHistory || []),
      {
        timestamp: new Date().toLocaleString('id-ID'),
        note: 'Pembaruan materi bab',
      },
    ],
  };
  saveStoredChapters(updatedList);
  return updatedList;
}

export function deleteChapter(chapterId: string): Chapter[] {
  const current = getStoredChapters();
  const filtered = current.filter((c) => c.id !== chapterId);
  saveStoredChapters(filtered);
  return filtered;
}

// --- USER PROGRESS MANAGEMENT ---

export function getStoredProgress(): UserProgress {
  if (typeof window === 'undefined') return DEFAULT_PROGRESS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(DEFAULT_PROGRESS));
      return DEFAULT_PROGRESS;
    }
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PROGRESS,
      ...parsed,
    };
  } catch (err) {
    console.error('Error reading progress:', err);
    return DEFAULT_PROGRESS;
  }
}

export function saveStoredProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
  } catch (err) {
    console.error('Error saving progress:', err);
  }
}

export function toggleBookmark(chapterId: string): UserProgress {
  const current = getStoredProgress();
  const exists = current.bookmarkedChapterIds.includes(chapterId);
  const updatedBookmarks = exists
    ? current.bookmarkedChapterIds.filter((id) => id !== chapterId)
    : [...current.bookmarkedChapterIds, chapterId];

  const updated: UserProgress = {
    ...current,
    bookmarkedChapterIds: updatedBookmarks,
  };
  saveStoredProgress(updated);
  return updated;
}

export function toggleCompleted(chapterId: string): UserProgress {
  const current = getStoredProgress();
  const exists = current.completedChapterIds.includes(chapterId);
  const updatedCompleted = exists
    ? current.completedChapterIds.filter((id) => id !== chapterId)
    : [...current.completedChapterIds, chapterId];

  const updated: UserProgress = {
    ...current,
    completedChapterIds: updatedCompleted,
  };
  saveStoredProgress(updated);
  return updated;
}

export function setLastReadChapter(chapterId: string): UserProgress {
  const current = getStoredProgress();
  const today = new Date().toISOString().split('T')[0];
  let streak = current.streakDays;
  if (current.lastActiveDate !== today) {
    streak += 1;
  }

  const updated: UserProgress = {
    ...current,
    lastReadChapterId: chapterId,
    lastActiveDate: today,
    streakDays: streak,
  };
  saveStoredProgress(updated);
  return updated;
}

export function savePersonalNote(chapterId: string, noteText: string): UserProgress {
  const current = getStoredProgress();
  const updatedNotes = {
    ...current.personalNotes,
    [chapterId]: noteText,
  };
  const updated: UserProgress = {
    ...current,
    personalNotes: updatedNotes,
  };
  saveStoredProgress(updated);
  return updated;
}

export function saveQuizScore(chapterId: string, score: number, total: number): UserProgress {
  const current = getStoredProgress();
  const updatedScores = {
    ...current.quizScores,
    [chapterId]: {
      score,
      total,
      date: new Date().toLocaleDateString('id-ID'),
    },
  };
  const updated: UserProgress = {
    ...current,
    quizScores: updatedScores,
  };
  saveStoredProgress(updated);
  return updated;
}

// --- READER SETTINGS ---

export function getStoredSettings(): ReaderSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
      return DEFAULT_SETTINGS;
    }
    return {
      ...DEFAULT_SETTINGS,
      ...JSON.parse(raw),
    };
  } catch (err) {
    return DEFAULT_SETTINGS;
  }
}

export function saveStoredSettings(settings: ReaderSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('Error saving settings:', err);
  }
}

// --- BACKUP & RESTORE DATA ---

export function exportDataAsJSON(): string {
  const data = {
    app: 'Maktabah Ahlu Sunnah',
    exportDate: new Date().toISOString(),
    chapters: getStoredChapters(),
    progress: getStoredProgress(),
    settings: getStoredSettings(),
  };
  return JSON.stringify(data, null, 2);
}

export function importDataFromJSON(jsonString: string): { success: boolean; message: string } {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || (!parsed.chapters && !parsed.progress)) {
      return { success: false, message: 'Format data JSON tidak valid untuk Maktabah Ahlu Sunnah.' };
    }

    if (Array.isArray(parsed.chapters) && parsed.chapters.length > 0) {
      saveStoredChapters(parsed.chapters);
    }
    if (parsed.progress) {
      saveStoredProgress({ ...DEFAULT_PROGRESS, ...parsed.progress });
    }
    if (parsed.settings) {
      saveStoredSettings({ ...DEFAULT_SETTINGS, ...parsed.settings });
    }

    return { success: true, message: 'Data cadangan perpustakaan berhasil dipulihkan dengan sempurna.' };
  } catch (err: any) {
    return { success: false, message: 'Gagal membaca berkas: ' + (err.message || 'Error parsing JSON') };
  }
}
