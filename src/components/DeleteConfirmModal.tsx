import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  chapterTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  chapterTitle,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white dark:bg-[#121c18] rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95">
        
        <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto border border-red-200 dark:border-red-800">
          <AlertTriangle size={24} />
        </div>

        <div className="text-center space-y-2">
          <h3 className="font-display text-lg font-bold text-stone-900 dark:text-stone-100">
            Konfirmasi Penghapusan Materi
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
            Apakah Anda yakin ingin menghapus materi bab ini dari perpustakaan?
          </p>
          <div className="p-3 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs font-semibold text-stone-800 dark:text-stone-200 line-clamp-2">
            "{chapterTitle}"
          </div>
          <p className="text-[11px] text-red-600 dark:text-red-400 font-medium pt-1">
            Tindakan ini tidak dapat dibatalkan setelah disetujui.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 transition"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-red-600 text-white hover:bg-red-700 transition flex items-center justify-center gap-2 shadow-xs"
          >
            <Trash2 size={16} />
            <span>Hapus Sekarang</span>
          </button>
        </div>

      </div>
    </div>
  );
};
