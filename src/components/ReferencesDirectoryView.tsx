import React, { useState } from 'react';
import { BookOpen, Search, PlusCircle, Trash2, Edit3, ExternalLink, Check, BookmarkCheck, X } from 'lucide-react';
import { ReferenceItem } from '../types';
import { MASTER_REFERENCES } from '../data/masterReferences';
import { IslamicStarIcon } from './IslamicPattern';

export const ReferencesDirectoryView: React.FC = () => {
  const [references, setReferences] = useState<ReferenceItem[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('maktabah_references_list_v1');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          return MASTER_REFERENCES;
        }
      }
    }
    return MASTER_REFERENCES;
  });

  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  
  // Modal for add/edit reference
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRef, setEditingRef] = useState<ReferenceItem | null>(null);
  const [titleInput, setTitleInput] = useState('');
  const [authorInput, setAuthorInput] = useState('');
  const [typeInput, setTypeInput] = useState<ReferenceItem['type']>('Kitab Primer');
  const [notesInput, setNotesInput] = useState('');

  const saveReferences = (newList: ReferenceItem[]) => {
    setReferences(newList);
    if (typeof window !== 'undefined') {
      localStorage.setItem('maktabah_references_list_v1', JSON.stringify(newList));
    }
  };

  const handleOpenAdd = () => {
    setEditingRef(null);
    setTitleInput('');
    setAuthorInput('');
    setTypeInput('Kitab Primer');
    setNotesInput('');
    setModalOpen(true);
  };

  const handleOpenEdit = (ref: ReferenceItem) => {
    setEditingRef(ref);
    setTitleInput(ref.title);
    setAuthorInput(ref.author);
    setTypeInput(ref.type);
    setNotesInput(ref.notes || '');
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Hapus kitab referensi ini dari direktori?')) {
      const updated = references.filter((r) => r.id !== id);
      saveReferences(updated);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleInput.trim() || !authorInput.trim()) return;

    if (editingRef) {
      const updated = references.map((r) =>
        r.id === editingRef.id
          ? {
              ...r,
              title: titleInput.trim(),
              author: authorInput.trim(),
              type: typeInput,
              notes: notesInput.trim(),
            }
          : r
      );
      saveReferences(updated);
    } else {
      const newRef: ReferenceItem = {
        id: `ref-${Date.now()}`,
        title: titleInput.trim(),
        author: authorInput.trim(),
        type: typeInput,
        notes: notesInput.trim(),
      };
      saveReferences([...references, newRef]);
    }
    setModalOpen(false);
  };

  const filteredReferences = references.filter((r) => {
    if (selectedType !== 'all' && r.type !== selectedType) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return r.title.toLowerCase().includes(q) || r.author.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
            <IslamicStarIcon size={16} />
            <span>Katalog Bibliografi Otoritatif</span>
          </div>
          <h1 className="font-display text-2xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100 mt-1">
            Daftar Referensi & Kitab Rujukan
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1">
            Sumber primer dan sekunder yang menjadi landasan penyusunan materi Maktabah Ahlu Sunnah.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-700 text-white hover:bg-emerald-800 shadow-xs transition shrink-0"
        >
          <PlusCircle size={16} />
          <span>+ Tambah Referensi</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#121c18] border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Cari judul kitab atau nama pengarang ulama..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
          />
        </div>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-3 py-2 rounded-xl text-xs font-semibold bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300"
        >
          <option value="all">Semua Jenis Rujukan</option>
          <option value="Kitab Primer">Kitab Primer</option>
          <option value="Kitab Syarah">Kitab Syarah</option>
          <option value="Tafsir">Tafsir</option>
          <option value="Karya Kontemporer">Karya Kontemporer</option>
          <option value="Dokumen Resmi">Dokumen Resmi</option>
        </select>
      </div>

      {/* Reference Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredReferences.map((ref) => (
          <div
            key={ref.id}
            className="p-5 rounded-2xl bg-white dark:bg-[#121c18] border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300/40">
                  {ref.type}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(ref)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition"
                    title="Edit Referensi"
                  >
                    <Edit3 size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(ref.id)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 transition"
                    title="Hapus Referensi"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              <h3 className="font-display text-base font-bold text-stone-900 dark:text-stone-100">
                {ref.title}
              </h3>
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                Penulis / Ulama: {ref.author}
              </p>
              {ref.notes && (
                <p className="text-xs text-stone-500 leading-relaxed">
                  {ref.notes}
                </p>
              )}
            </div>

            <div className="pt-2 border-t border-stone-100 dark:border-stone-800/80 text-[11px] text-stone-400 flex items-center gap-1.5">
              <BookmarkCheck size={14} className="text-emerald-600" />
              <span>Rujukan Otoritatif Terverifikasi</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white dark:bg-[#121c18] rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-stone-800">
              <h3 className="font-display text-lg font-bold text-stone-900 dark:text-stone-100">
                {editingRef ? 'Edit Referensi Kitab' : 'Tambah Referensi Kitab Baru'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-stone-400 hover:text-stone-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                  Judul Kitab / Sumber *
                </label>
                <input
                  type="text"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  placeholder="Misal: Al-Aqidah Al-Wasithiyyah"
                  className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                  Pengarang / Ulama *
                </label>
                <input
                  type="text"
                  value={authorInput}
                  onChange={(e) => setAuthorInput(e.target.value)}
                  placeholder="Misal: Syaikhul Islam Ibnu Taimiyyah"
                  className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                  Klasifikasi Rujukan
                </label>
                <select
                  value={typeInput}
                  onChange={(e) => setTypeInput(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
                >
                  <option value="Kitab Primer">Kitab Primer</option>
                  <option value="Kitab Syarah">Kitab Syarah</option>
                  <option value="Tafsir">Tafsir</option>
                  <option value="Karya Kontemporer">Karya Kontemporer</option>
                  <option value="Dokumen Resmi">Dokumen Resmi</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                  Catatan / Keterangan Edisi
                </label>
                <input
                  type="text"
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  placeholder="Misal: Edisi tahqiq Syaikh Al-Albani"
                  className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl font-semibold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold bg-emerald-700 text-white hover:bg-emerald-800 transition"
                >
                  Simpan Referensi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
