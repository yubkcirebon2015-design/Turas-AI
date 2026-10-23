import React, { useState, useEffect, useCallback } from 'react';
import { 
  Chapter, 
  ViewState, 
  UserProgress, 
  ReaderSettings, 
  JilidId 
} from './types';
import { 
  getStoredChapters, 
  getStoredProgress, 
  getStoredSettings, 
  saveStoredChapters, 
  saveStoredProgress, 
  saveStoredSettings,
  addChapter, 
  updateChapter, 
  deleteChapter, 
  resetChaptersToDefault,
  toggleBookmark, 
  toggleCompleted, 
  setLastReadChapter, 
  savePersonalNote, 
  saveQuizScore 
} from './utils/storage';

import { Navbar } from './components/Navbar';
import { HomeHero } from './components/HomeHero';
import { CurriculumView } from './components/CurriculumView';
import { ChapterReader } from './components/ChapterReader';
import { SmartSearch } from './components/SmartSearch';
import { BookmarksView } from './components/BookmarksView';
import { ProgressView } from './components/ProgressView';
import { QuizView } from './components/QuizView';
import { ReferencesDirectoryView } from './components/ReferencesDirectoryView';
import { AboutView } from './components/AboutView';
import { SettingsModal } from './components/SettingsModal';
import { ShareModal } from './components/ShareModal';
import { ChapterFormModal } from './components/ChapterFormModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';

export default function App() {
  // Main state
  const [chapters, setChapters] = useState<Chapter[]>(() => getStoredChapters());
  const [progress, setProgress] = useState<UserProgress>(() => getStoredProgress());
  const [settings, setSettings] = useState<ReaderSettings>(() => getStoredSettings());
  
  // Navigation & History Stack (preserves back-navigation without wiping data)
  const [currentView, setCurrentView] = useState<ViewState>({ type: 'home' });
  const [historyStack, setHistoryStack] = useState<ViewState[]>([]);

  // Modals state
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [chapterToDelete, setChapterToDelete] = useState<{ id: string; title: string } | null>(null);

  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [chapterToShare, setChapterToShare] = useState<Chapter | null>(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  }, []);

  // Sync dark theme on root html
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    saveStoredSettings(settings);
  }, [settings]);

  // Navigate with history tracking
  const navigateTo = useCallback((newView: ViewState) => {
    setHistoryStack((prev) => [...prev, currentView]);
    setCurrentView(newView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  // Handle Back Button
  const handleBack = useCallback(() => {
    if (historyStack.length > 0) {
      const prevView = historyStack[historyStack.length - 1];
      setHistoryStack((prev) => prev.slice(0, prev.length - 1));
      setCurrentView(prevView);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setCurrentView({ type: 'home' });
    }
  }, [historyStack]);

  // Toggle Theme
  const handleToggleTheme = useCallback(() => {
    setSettings((prev) => {
      const updated: ReaderSettings = {
        ...prev,
        theme: prev.theme === 'dark' ? 'light' : 'dark',
      };
      saveStoredSettings(updated);
      return updated;
    });
  }, []);

  // Update Settings
  const handleUpdateSettings = useCallback((newSettings: Partial<ReaderSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      saveStoredSettings(updated);
      return updated;
    });
  }, []);

  // Bookmark Toggle
  const handleToggleBookmark = useCallback((chapterId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = toggleBookmark(chapterId);
    setProgress(updated);
    const isNowBookmarked = updated.bookmarkedChapterIds.includes(chapterId);
    showToast(isNowBookmarked ? 'Bab berhasil ditambahkan ke penanda buku' : 'Bab dihapus dari penanda buku');
  }, [showToast]);

  // Completed Toggle
  const handleToggleCompleted = useCallback((chapterId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = toggleCompleted(chapterId);
    setProgress(updated);
    const isNowCompleted = updated.completedChapterIds.includes(chapterId);
    showToast(isNowCompleted ? 'Materi bab ditandai selesai dipelajari' : 'Tanda selesai dibatalkan');
  }, [showToast]);

  // Select Chapter to Read
  const handleSelectChapter = useCallback((chapterId: string) => {
    const updatedProgress = setLastReadChapter(chapterId);
    setProgress(updatedProgress);
    navigateTo({ type: 'chapter', chapterId });
  }, [navigateTo]);

  // Personal Notes Save
  const handleSaveNote = useCallback((chapterId: string, noteText: string) => {
    const updated = savePersonalNote(chapterId, noteText);
    setProgress(updated);
    showToast('Catatan pribadi berhasil disimpan');
  }, [showToast]);

  // Quiz Score Save
  const handleSaveQuizScore = useCallback((chapterId: string, score: number, total: number) => {
    const updated = saveQuizScore(chapterId, score, total);
    setProgress(updated);
  }, []);

  // Open Add Chapter Modal
  const handleOpenAddModal = useCallback(() => {
    setEditingChapter(null);
    setFormModalOpen(true);
  }, []);

  // Open Edit Chapter Modal
  const handleOpenEditModal = useCallback((chapter: Chapter, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingChapter(chapter);
    setFormModalOpen(true);
  }, []);

  // Open Delete Confirmation Modal
  const handleOpenDeleteModal = useCallback((chapterId: string, title: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setChapterToDelete({ id: chapterId, title });
    setDeleteModalOpen(true);
  }, []);

  // Confirm Chapter Delete
  const handleConfirmDelete = useCallback(() => {
    if (!chapterToDelete) return;
    const updatedList = deleteChapter(chapterToDelete.id);
    setChapters(updatedList);
    setDeleteModalOpen(false);
    showToast(`Materi "${chapterToDelete.title}" telah dihapus.`);
    setChapterToDelete(null);

    // If currently viewing deleted chapter, navigate back to curriculum
    if (currentView.type === 'chapter' && currentView.chapterId === chapterToDelete.id) {
      setCurrentView({ type: 'curriculum' });
    }
  }, [chapterToDelete, currentView, showToast]);

  // Save Added or Edited Chapter
  const handleSaveChapter = useCallback((chapter: Chapter) => {
    if (editingChapter) {
      const updated = updateChapter(chapter);
      setChapters(updated);
      showToast('Perubahan materi berhasil diperbarui');
    } else {
      const updated = addChapter(chapter);
      setChapters(updated);
      showToast('Materi pembahasan baru berhasil ditambahkan ke perpustakaan');
    }
    setFormModalOpen(false);
    setEditingChapter(null);
  }, [editingChapter, showToast]);

  // Share Chapter
  const handleOpenShare = useCallback((chapter: Chapter) => {
    setChapterToShare(chapter);
    setShareModalOpen(true);
  }, []);

  // Reset Everything to Default
  const handleResetToDefault = useCallback(() => {
    const defaultChapters = resetChaptersToDefault();
    setChapters(defaultChapters);
    showToast('Koleksi 50 bab telah dikembalikan ke kondisi rujukan awal');
  }, [showToast]);

  // Reset Learning Progress
  const handleResetProgress = useCallback(() => {
    const freshProgress: UserProgress = {
      completedChapterIds: [],
      bookmarkedChapterIds: [],
      lastReadChapterId: null,
      personalNotes: {},
      quizScores: {},
      streakDays: 1,
      lastActiveDate: new Date().toISOString().split('T')[0],
    };
    saveStoredProgress(freshProgress);
    setProgress(freshProgress);
    showToast('Riwayat progres belajar telah diatur ulang');
  }, [showToast]);

  // Refresh data from disk/localStorage
  const handleRefreshData = useCallback(() => {
    setChapters(getStoredChapters());
    setProgress(getStoredProgress());
    setSettings(getStoredSettings());
    showToast('Data perpustakaan berhasil disinkronkan');
  }, [showToast]);

  // Current active chapter for Reader
  const currentChapter = currentView.type === 'chapter'
    ? chapters.find((c) => c.id === currentView.chapterId) || null
    : null;

  // Next and Previous chapters in current order
  const currentChapterIndex = currentChapter ? chapters.findIndex((c) => c.id === currentChapter.id) : -1;
  const prevChapter = currentChapterIndex > 0 ? chapters[currentChapterIndex - 1] : null;
  const nextChapter = currentChapterIndex >= 0 && currentChapterIndex < chapters.length - 1 ? chapters[currentChapterIndex + 1] : null;

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5] dark:bg-[#0c1311] text-stone-800 dark:text-stone-200 transition-colors selection:bg-amber-300 selection:text-emerald-950">
      
      {/* Sticky App Header & Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={navigateTo}
        onBack={handleBack}
        canGoBack={historyStack.length > 0 || currentView.type !== 'home'}
        settings={settings}
        onToggleTheme={handleToggleTheme}
        onOpenAddModal={handleOpenAddModal}
        onOpenSettings={() => setSettingsOpen(true)}
        completedCount={progress.completedChapterIds.length}
        totalChapters={chapters.length}
      />

      {/* Main View Router */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20">
        
        {/* VIEW 1: HOME */}
        {currentView.type === 'home' && (
          <HomeHero
            chapters={chapters}
            progress={progress}
            onStartReading={() => {
              if (progress.lastReadChapterId) {
                handleSelectChapter(progress.lastReadChapterId);
              } else if (chapters.length > 0) {
                handleSelectChapter(chapters[0].id);
              }
            }}
            onOpenCurriculum={() => navigateTo({ type: 'curriculum' })}
            onOpenJilid={(jilidId: JilidId) => navigateTo({ type: 'jilid', jilidId })}
            onOpenChapter={handleSelectChapter}
            onOpenSearch={() => navigateTo({ type: 'search' })}
            onOpenAbout={() => navigateTo({ type: 'about' })}
          />
        )}

        {/* VIEW 2: CURRICULUM (50 Chapters / All Jilids) */}
        {currentView.type === 'curriculum' && (
          <CurriculumView
            chapters={chapters}
            progress={progress}
            activeJilidId={null}
            onSelectChapter={handleSelectChapter}
            onToggleBookmark={handleToggleBookmark}
            onToggleCompleted={handleToggleCompleted}
            onEditChapter={handleOpenEditModal}
            onDeleteChapter={handleOpenDeleteModal}
            onOpenAddModal={handleOpenAddModal}
          />
        )}

        {/* VIEW 3: SINGLE JILID VIEW */}
        {currentView.type === 'jilid' && (
          <CurriculumView
            chapters={chapters}
            progress={progress}
            activeJilidId={currentView.jilidId}
            onSelectChapter={handleSelectChapter}
            onToggleBookmark={handleToggleBookmark}
            onToggleCompleted={handleToggleCompleted}
            onEditChapter={handleOpenEditModal}
            onDeleteChapter={handleOpenDeleteModal}
            onOpenAddModal={handleOpenAddModal}
          />
        )}

        {/* VIEW 4: CHAPTER READER */}
        {currentView.type === 'chapter' && currentChapter && (
          <ChapterReader
            chapter={currentChapter}
            previousChapter={prevChapter}
            nextChapter={nextChapter}
            isBookmarked={progress.bookmarkedChapterIds.includes(currentChapter.id)}
            isCompleted={progress.completedChapterIds.includes(currentChapter.id)}
            personalNote={progress.personalNotes[currentChapter.id] || ''}
            settings={settings}
            onNavigateChapter={handleSelectChapter}
            onToggleBookmark={handleToggleBookmark}
            onToggleCompleted={handleToggleCompleted}
            onSavePersonalNote={handleSaveNote}
            onEditChapter={handleOpenEditModal}
            onDeleteChapter={handleOpenDeleteModal}
            onOpenShare={handleOpenShare}
            onBack={handleBack}
            onUpdateSettings={handleUpdateSettings}
          />
        )}

        {/* Fallback if chapter not found */}
        {currentView.type === 'chapter' && !currentChapter && (
          <div className="text-center py-20 space-y-4">
            <h2 className="text-xl font-bold">Materi Bab Tidak Ditemukan</h2>
            <p className="text-stone-500 text-sm">Materi bab mungkin telah dipindahkan atau dihapus.</p>
            <button
              onClick={() => setCurrentView({ type: 'curriculum' })}
              className="px-5 py-2.5 rounded-xl bg-emerald-700 text-white font-semibold text-sm hover:bg-emerald-800"
            >
              Kembali ke Daftar 50 Pembahasan
            </button>
          </div>
        )}

        {/* VIEW 5: SMART SEARCH */}
        {currentView.type === 'search' && (
          <SmartSearch
            chapters={chapters}
            onSelectChapter={handleSelectChapter}
            initialQuery={currentView.query || ''}
          />
        )}

        {/* VIEW 6: BOOKMARKS */}
        {currentView.type === 'bookmarks' && (
          <BookmarksView
            chapters={chapters}
            bookmarkedIds={progress.bookmarkedChapterIds}
            onSelectChapter={handleSelectChapter}
            onRemoveBookmark={handleToggleBookmark}
            onOpenCurriculum={() => navigateTo({ type: 'curriculum' })}
          />
        )}

        {/* VIEW 7: PROGRESS & LEARNING ANALYTICS */}
        {currentView.type === 'progress' && (
          <ProgressView
            chapters={chapters}
            progress={progress}
            onSelectChapter={handleSelectChapter}
            onOpenCurriculum={() => navigateTo({ type: 'curriculum' })}
            onResetProgress={handleResetProgress}
          />
        )}

        {/* VIEW 8: AKIDAH QUIZ */}
        {currentView.type === 'quiz' && (
          <QuizView
            chapters={chapters}
            onOpenChapter={handleSelectChapter}
            onSaveQuizScore={handleSaveQuizScore}
          />
        )}

        {/* VIEW 9: BIBLIOGRAPHY & REFERENCES DIRECTORY */}
        {currentView.type === 'references' && (
          <ReferencesDirectoryView />
        )}

        {/* VIEW 10: ABOUT & DEVELOPER CREDENTIALS */}
        {currentView.type === 'about' && (
          <AboutView />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-emerald-900/10 dark:border-emerald-500/10 bg-white/60 dark:bg-[#070e0c]/60 py-8 px-4 sm:px-6 lg:px-8 text-center text-xs text-stone-500 dark:text-stone-400 space-y-2">
        <p className="font-semibold text-stone-700 dark:text-stone-300">
          Maktabah Ahlu Sunnah — Perpustakaan Digital Akidah Islam
        </p>
        <p>
          Berdasarkan Al-Qur'an dan Sunnah yang Sahih dengan Pemahaman As-Salafus Shalih.
        </p>
        <p className="pt-2 text-[11px] text-emerald-800 dark:text-emerald-400 font-medium">
          Dikembangkan oleh: <strong>Jundi Abdul Syahid, S.Pd.</strong> (Orang Dalam Genetik Jawa)
        </p>
      </footer>

      {/* MODALS */}
      
      {/* 1. Add / Edit Chapter Form Modal */}
      <ChapterFormModal
        isOpen={formModalOpen}
        initialChapter={editingChapter}
        existingCount={chapters.length}
        onClose={() => {
          setFormModalOpen(false);
          setEditingChapter(null);
        }}
        onSave={handleSaveChapter}
      />

      {/* 2. Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        chapterTitle={chapterToDelete?.title || ''}
        onCancel={() => {
          setDeleteModalOpen(false);
          setChapterToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />

      {/* 3. Settings & Data Backup / Restore Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onResetToDefault={handleResetToDefault}
        onRefreshData={handleRefreshData}
      />

      {/* 4. Social Sharing Modal */}
      <ShareModal
        isOpen={shareModalOpen}
        chapter={chapterToShare}
        onClose={() => {
          setShareModalOpen(false);
          setChapterToShare(null);
        }}
      />

      {/* Interactive Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5">
          <div className="px-4 py-3 rounded-2xl bg-emerald-950 text-amber-200 border border-amber-500/40 shadow-xl text-xs sm:text-sm font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

    </div>
  );
}

