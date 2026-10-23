import React from 'react';
import { User, ShieldCheck, BookOpen, AlertCircle, Award, CheckCircle2, Heart } from 'lucide-react';
import { IslamicStarIcon, ArabesqueDivider } from './IslamicPattern';

export const AboutView: React.FC = () => {
  return (
    <div className="space-y-10 pb-16 max-w-3xl mx-auto">
      
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
          <IslamicStarIcon size={16} />
          <span>Informasi & Pengembang</span>
        </div>
        <h1 className="font-display text-2xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100">
          Tentang Maktabah Ahlu Sunnah
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
          Perpustakaan Digital Ilmu Akidah Islam Berdasarkan Al-Qur'an dan Sunnah yang Sahih.
        </p>
      </div>

      {/* Main Vision Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#121c18] border border-stone-200 dark:border-stone-800 shadow-sm space-y-4 text-xs sm:text-sm leading-relaxed text-stone-800 dark:text-stone-200">
        <p>
          <strong>Maktabah Ahlu Sunnah</strong> adalah perpustakaan digital yang dikembangkan sebagai sarana pembelajaran dan pengkajian ilmu akidah Islam melalui materi yang tersusun secara sistematis, disertai dalil Al-Qur'an, hadis, dan referensi ilmiah.
        </p>
        <p>
          Aplikasi ini dirancang untuk membantu pengguna mempelajari dasar-dasar akidah secara bertahap, menelusuri sumber rujukan, menguji pemahaman, dan mengembangkan kebiasaan belajar yang teratur.
        </p>
      </div>

      {/* Developer Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-950 to-[#07241c] text-white border border-amber-500/30 shadow-lg space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-400/40 flex items-center justify-center shrink-0">
            <User size={32} />
          </div>
          <div>
            <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider block">
              Pengembang Aplikasi
            </span>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-amber-100">
              Jundi Abdul Syahid, S.Pd.
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200/90 font-medium">
              (Orang Dalam Genetik Jawa)
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-emerald-800/60 grid grid-cols-2 gap-4 text-xs text-emerald-200">
          <div>
            <span className="text-stone-400 block text-[11px]">Tahun Pengembangan:</span>
            <span className="font-semibold text-white">2026 Masehi / 1447–1448 Hijriyah</span>
          </div>
          <div>
            <span className="text-stone-400 block text-[11px]">Versi Aplikasi:</span>
            <span className="font-semibold text-white">Versi 1.0 (Edisi Kurikulum Lengkap 50 Bab)</span>
          </div>
        </div>
      </div>

      {/* Methodology Standards */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#121c18] border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
        <h3 className="font-display text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
          <ShieldCheck size={20} className="text-emerald-700" />
          <span>Metodologi Penyusunan & Verifikasi Dalil</span>
        </h3>
        <ul className="space-y-3 text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
          <li className="flex items-start gap-2.5">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Teks Al-Qur'an & Terjemah:</strong> Seluruh ayat dicantumkan dengan teks Arab rasm Utsmani yang diverifikasi serta terjemahan resmi standar Kementerian Agama Republik Indonesia.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Otoritas Hadis:</strong> Mengutamakan hadis-hadis sahih riwayat Imam Al-Bukhari dan Imam Muslim serta periwayatan sunan yang telah dinilai sahih oleh ulama mu'tabar.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Syarah Ulama Salaf:</strong> Mengutip pemaparan para imam ahlus sunnah terdahulu seperti Imam Abu Hanifah, Imam Malik, Imam Asy-Syafi'i, Imam Ahmad bin Hanbal, Imam Ath-Thahawi, Ibnu Katsir, Ibnu Hajar, dan Ibnu Taimiyyah.</span>
          </li>
        </ul>
      </div>

      {/* Scientific Disclaimer Note */}
      <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-600/30 flex items-start gap-3 text-xs sm:text-sm text-stone-800 dark:text-stone-200">
        <AlertCircle size={20} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="font-semibold block text-amber-900 dark:text-amber-300">
            Catatan Keilmuan:
          </strong>
          <p className="leading-relaxed">
            Materi dalam aplikasi ini perlu terus ditinjau dan ditelaah berdasarkan sumber-sumber ilmiah yang dapat diverifikasi. Aplikasi ini dibangun dengan mengedepankan ketelitian dalil syar'i dan menjauhi penisbatan riwayat yang tidak berdasar.
          </p>
        </div>
      </div>

      <ArabesqueDivider />

      <footer className="text-center text-xs text-stone-400 space-y-1">
        <p>Maktabah Ahlu Sunnah — Hak Cipta Keilmuan untuk Seluruh Umat Islam</p>
        <p>Kompilasi Digital oleh: Jundi Abdul Syahid, S.Pd. (Orang Dalam Genetik Jawa)</p>
      </footer>

    </div>
  );
};
