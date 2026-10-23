import React, { useRef, useState } from 'react';
import { 
  X, 
  Settings, 
  Moon, 
  Sun, 
  Download, 
  Upload, 
  RotateCcw, 
  Check, 
  AlertCircle,
  Type
} from 'lucide-react';
import { ReaderSettings } from '../types';
import { exportDataAsJSON, importDataFromJSON } from '../utils/storage';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ReaderSettings;
  onUpdateSettings: (newSettings: Partial<ReaderSettings>) => void;
  onResetToDefault: () => void;
  onRefreshData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onResetToDefault,
  onRefreshData,
}) => {
  if (!isOpen) return null;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importNotice, setImportNotice] = useState<{ success: boolean; text: string } | null>(null);

  const handleExport = () => {
    const jsonStr = exportDataAsJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `maktabah_ahlu_sunnah_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = importDataFromJSON(content);
      if (res.success) {
        setImportNotice({ success: true, text: res.message });
        onRefreshData();
      } else {
        setImportNotice({ success: false, text: res.message });
      }
      setTimeout(() => setImportNotice(null), 4000);
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#121c18] rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl p-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
              <Settings size={20} />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-stone-900 dark:text-stone-100">
                Pengaturan Maktabah
              </h2>
              <p className="text-xs text-stone-500">
                Kustomisasi tampilan & pengelolaan data perpustakaan
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-stone-400 hover:text-stone-600 rounded-lg">
            <X size={18} />
          </button>
        </div>

        {importNotice && (
          <div className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
            importNotice.success
              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border border-emerald-300'
              : 'bg-red-50 dark:bg-red-950/60 text-red-800 dark:text-red-200 border border-red-300'
          }`}>
            {importNotice.success ? <Check size={16} /> : <AlertCircle size={16} />}
            <span>{importNotice.text}</span>
          </div>
        )}

        {/* 1. Theme Setting */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
            Mode Tampilan Aplikasi
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onUpdateSettings({ theme: 'light' })}
              className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition ${
                settings.theme === 'light'
                  ? 'border-emerald-700 bg-emerald-50 text-emerald-900 shadow-xs'
                  : 'border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300'
              }`}
            >
              <Sun size={16} className="text-amber-600" />
              <span>Mode Terang</span>
            </button>
            <button
              onClick={() => onUpdateSettings({ theme: 'dark' })}
              className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition ${
                settings.theme === 'dark'
                  ? 'border-emerald-500 bg-emerald-950/60 text-emerald-200 shadow-xs'
                  : 'border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300'
              }`}
            >
              <Moon size={16} className="text-amber-400" />
              <span>Mode Gelap</span>
            </button>
          </div>
        </div>

        {/* 2. Font Sizing Separately */}
        <div className="space-y-4 pt-2 border-t border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
            <Type size={16} className="text-emerald-700" />
            <span>Pengaturan Ukuran Huruf Membaca</span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-stone-700 dark:text-stone-300">Ukuran Teks Latin (Indonesia)</span>
              <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">{settings.indoFontSize} px</span>
            </div>
            <input
              type="range"
              min="14"
              max="24"
              value={settings.indoFontSize}
              onChange={(e) => onUpdateSettings({ indoFontSize: Number(e.target.value) })}
              className="w-full accent-emerald-700"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-stone-700 dark:text-stone-300">Ukuran Teks Arab (Ayat & Hadis)</span>
              <span className="font-mono font-bold text-amber-600 dark:text-amber-400">{settings.arabicFontSize} px</span>
            </div>
            <input
              type="range"
              min="20"
              max="40"
              value={settings.arabicFontSize}
              onChange={(e) => onUpdateSettings({ arabicFontSize: Number(e.target.value) })}
              className="w-full accent-amber-600"
            />
          </div>
        </div>

        {/* 3. Backup and Restore */}
        <div className="space-y-3 pt-2 border-t border-stone-100 dark:border-stone-800">
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
            Cadangan & Pemulihan Data
          </label>
          <p className="text-[11px] text-stone-500">
            Ekspor data materi, penanda buku, dan progres ke berkas JSON untuk disimpan atau dipindahkan ke perangkat lain.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleExport}
              className="p-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-xs font-semibold text-stone-800 dark:text-stone-200 hover:bg-emerald-50 dark:hover:bg-emerald-950 transition flex items-center justify-center gap-2"
            >
              <Download size={16} />
              <span>Unduh Cadangan JSON</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-xs font-semibold text-stone-800 dark:text-stone-200 hover:bg-emerald-50 dark:hover:bg-emerald-950 transition flex items-center justify-center gap-2"
            >
              <Upload size={16} />
              <span>Pulihkan dari JSON</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
          </div>
        </div>

        {/* 4. Reset Default Curriculum */}
        <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
          <div className="text-[11px] text-stone-500 max-w-xs">
            Kembalikan 50 bab kurikulum ke konten asli bawaan perpustakaan.
          </div>
          <button
            onClick={() => {
              if (window.confirm('Kembalikan seluruh materi bab ke 50 bab kurikulum asli bawaan? Perubahan manual akan direset.')) {
                onResetToDefault();
                onClose();
              }
            }}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 border border-red-200 dark:border-red-900/40 transition flex items-center gap-1.5"
          >
            <RotateCcw size={14} />
            <span>Reset ke Bawaan</span>
          </button>
        </div>

      </div>
    </div>
  );
};
