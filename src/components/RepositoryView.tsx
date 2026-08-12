import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Edit, 
  Copy, 
  Trash2, 
  Cloud, 
  Printer, 
  Share2,
  Send,
  Eye
} from 'lucide-react';
import { ModulAjar, StatusApproval, UserProfile } from '../types';

interface RepositoryViewProps {
  modulList: ModulAjar[];
  onSelectModulForEdit: (modul: ModulAjar) => void;
  onOpenDocExport: (modul: ModulAjar) => void;
  onDeleteModul: (id: string) => void;
  onDuplicateModul: (modul: ModulAjar) => void;
  onSubmitForApproval: (modulId: string) => void;
  currentUser: UserProfile;
  onCreateNew: () => void;
}

export const RepositoryView: React.FC<RepositoryViewProps> = ({
  modulList,
  onSelectModulForEdit,
  onOpenDocExport,
  onDeleteModul,
  onDuplicateModul,
  onSubmitForApproval,
  currentUser,
  onCreateNew,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('Semua');
  const [selectedKelas, setSelectedKelas] = useState('Semua');
  const [selectedStatus, setSelectedStatus] = useState<string>('Semua');

  // Filter Modules
  const filteredModules = modulList.filter(mod => {
    const matchSearch = mod.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        mod.penyusun.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        mod.mataPelajaran.toLowerCase().includes(searchTerm.toLowerCase());
    const matchSubject = selectedSubject === 'Semua' || mod.mataPelajaran === selectedSubject;
    const matchKelas = selectedKelas === 'Semua' || mod.kelas === selectedKelas;
    const matchStatus = selectedStatus === 'Semua' || mod.status === selectedStatus;
    return matchSearch && matchSubject && matchKelas && matchStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            Bank Modul Ajar SMAN 106 Jakarta
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Kumpulan RPP & Modul Ajar Kurikulum Merdeka yang dapat diedit, direvisi, dan disetujui Kepala Sekolah
          </p>
        </div>

        <button
          onClick={onCreateNew}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Modul Ajar Baru</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-3">
        {/* Search Field */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari judul modul, penyusun, atau mata pelajaran..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="Semua">Semua Mapel</option>
            <option value="Matematika">Matematika</option>
            <option value="Fisika">Fisika</option>
            <option value="Bahasa Indonesia">Bahasa Indonesia</option>
            <option value="Informatika">Informatika</option>
            <option value="Biologi">Biologi</option>
            <option value="Kimia">Kimia</option>
            <option value="Bahasa Inggris">Bahasa Inggris</option>
          </select>

          <select
            value={selectedKelas}
            onChange={(e) => setSelectedKelas(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="Semua">Semua Kelas</option>
            <option value="X">Kelas X (Fase E)</option>
            <option value="XI">Kelas XI (Fase F)</option>
            <option value="XII">Kelas XII (Fase F)</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="Semua">Semua Status</option>
            <option value="Disetujui">Disetujui Kepala Sekolah</option>
            <option value="Menunggu Review">Menunggu Review</option>
            <option value="Draft">Draft Saya</option>
          </select>
        </div>
      </div>

      {/* Grid of Modul Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map((mod) => (
          <div
            key={mod.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition p-5 flex flex-col justify-between group"
          >
            <div>
              {/* Top Tags */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {mod.mataPelajaran} • Kelas {mod.kelas} (Fase {mod.fase})
                </span>

                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md flex items-center gap-1 ${
                  mod.status === 'Disetujui'
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200'
                    : mod.status === 'Menunggu Review'
                    ? 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200'
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200'
                }`}>
                  {mod.status === 'Disetujui' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                  {mod.status === 'Menunggu Review' && <Clock className="w-3 h-3 text-amber-600" />}
                  {mod.status}
                </span>
              </div>

              {/* Title & Penyusun */}
              <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition mb-2">
                {mod.judul}
              </h3>

              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                Oleh: <span className="font-semibold text-slate-700 dark:text-slate-300">{mod.penyusun}</span>
              </p>

              {/* Model & Diferensiasi Preview */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 text-xs space-y-1.5 mb-4">
                <p className="text-blue-800 dark:text-blue-300 font-semibold truncate">
                  Model: {mod.modelPembelajaran}
                </p>
                <p className="text-slate-600 dark:text-slate-400 text-[11px] line-clamp-2">
                  CP: {mod.capaianPembelajaran}
                </p>
              </div>

              {/* Headmaster Catatan if any */}
              {mod.catatanKepalaSekolah && (
                <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-[11px] mb-4">
                  <p className="font-bold mb-0.5">Catatan Kepala Sekolah:</p>
                  <p className="italic">"{mod.catatanKepalaSekolah}"</p>
                </div>
              )}
            </div>

            {/* Bottom Card Actions */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onSelectModulForEdit(mod)}
                  className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 hover:bg-blue-100 font-semibold text-xs flex items-center gap-1 transition"
                  title="Edit di Gemini Canvas"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit Canvas</span>
                </button>

                <button
                  onClick={() => onOpenDocExport(mod)}
                  className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
                  title="Cetak & Ekspor"
                >
                  <Printer className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-1">
                {mod.status === 'Draft' && (
                  <button
                    onClick={() => onSubmitForApproval(mod.id)}
                    className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 hover:bg-blue-100 transition text-[11px] font-semibold flex items-center gap-1"
                    title="Ajukan ke Kepala Sekolah"
                  >
                    <Send className="w-3 h-3" />
                    <span>Ajukan</span>
                  </button>
                )}

                <button
                  onClick={() => onDuplicateModul(mod)}
                  className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
                  title="Duplikat Modul"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onDeleteModul(mod.id)}
                  className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 text-rose-600 dark:text-rose-400 transition"
                  title="Hapus Modul"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
