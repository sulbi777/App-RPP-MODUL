import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Award, 
  Users, 
  FileCheck, 
  Send, 
  Check, 
  AlertTriangle, 
  Activity, 
  ShieldCheck,
  Building2,
  FileText
} from 'lucide-react';
import { ModulAjar, BugReportLog, UserProfile } from '../types';

interface HeadmasterDashboardProps {
  modulList: ModulAjar[];
  onApproveModul: (modulId: string, catatan: string) => void;
  onRejectModul: (modulId: string, catatan: string) => void;
  bugLogs: BugReportLog[];
  headmasterProfile: UserProfile;
  onOpenDocExport: (modul: ModulAjar) => void;
}

export const HeadmasterDashboard: React.FC<HeadmasterDashboardProps> = ({
  modulList,
  onApproveModul,
  onRejectModul,
  bugLogs,
  headmasterProfile,
  onOpenDocExport,
}) => {
  const [selectedModulId, setSelectedModulId] = useState<string | null>(null);
  const [catatanInput, setCatatanInput] = useState('Modul Ajar disetujui. Langkah pembelajaran dan diferensiasi sudah sangat baik.');

  // Pending modules requiring review
  const pendingModules = modulList.filter(m => m.status === 'Menunggu Review');
  const approvedModules = modulList.filter(m => m.status === 'Disetujui');
  const draftModules = modulList.filter(m => m.status === 'Draft' || m.status === 'Perlu Perbaikan');

  const selectedModul = modulList.find(m => m.id === selectedModulId) || pendingModules[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Headmaster Welcome Banner */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-sm border border-slate-800 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-blue-600 flex items-center justify-center text-white text-xl font-bold shadow-md shadow-blue-500/20">
              SR
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight">{headmasterProfile.nama}</h2>
                <span className="bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2.5 py-0.5 rounded text-[10px] uppercase tracking-wider font-semibold">
                  NIP: {headmasterProfile.nip}
                </span>
              </div>
              <p className="text-slate-300 text-xs mt-1">
                {headmasterProfile.jabatan} — Pembina Utama Muda / IV c
              </p>
              <p className="text-slate-400 text-[11px] mt-0.5">
                Visi SMAN 106: Beralamat Pancasila, Unggul dalam Prestasi, Berwawasan Global & Peduli Lingkungan
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-800 px-4 py-2.5 rounded-xl border border-slate-700/80 text-center">
              <span className="block text-2xl font-bold text-white">{approvedModules.length}</span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Modul Disetujui</span>
            </div>
            <div className="bg-blue-950/80 px-4 py-2.5 rounded-xl border border-blue-800/80 text-center">
              <span className="block text-2xl font-bold text-blue-400">{pendingModules.length}</span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-blue-300">Menunggu Review</span>
            </div>
          </div>
        </div>
      </div>

      {/* Review & Approval Queue Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Module List Queue (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[640px]">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-3 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" /> Antrean Peninjauan Modul Ajar
            </span>
            <span className="bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 px-2 py-0.5 rounded-full text-[11px] font-bold">
              {pendingModules.length} Pending
            </span>
          </h3>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {pendingModules.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-50" />
                <p className="font-bold">Semua pengajuan Modul Ajar telah ditinjau!</p>
                <p>Tidak ada antrean pending saat ini.</p>
              </div>
            ) : (
              pendingModules.map((m) => (
                <div
                  key={m.id}
                  onClick={() => setSelectedModulId(m.id)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer ${
                    selectedModul?.id === m.id
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">
                      {m.mataPelajaran} • Kelas {m.kelas}
                    </span>
                    <span>{m.terakhirDiubah}</span>
                  </div>

                  <h4 className="font-bold text-slate-900 dark:text-white text-xs line-clamp-1 mb-1">
                    {m.judul}
                  </h4>

                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                    Penyusun: {m.penyusun}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Detail & Approval Box (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between min-h-[640px]">
          {selectedModul ? (
            <div className="space-y-4">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {selectedModul.mataPelajaran} • Kelas {selectedModul.kelas} (Fase {selectedModul.fase})
                  </span>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base mt-2">
                    {selectedModul.judul}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Guru Penyusun: <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedModul.penyusun}</span> (NIP: {selectedModul.nipPenyusun})
                  </p>
                </div>

                <button
                  onClick={() => onOpenDocExport(selectedModul)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-500" />
                  <span>Preview Lengkap</span>
                </button>
              </div>

              {/* Element Summaries */}
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Capaian Pembelajaran (CP):</span>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{selectedModul.capaianPembelajaran}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <span className="font-bold text-emerald-800 dark:text-emerald-300 block mb-1">Model Pembelajaran:</span>
                    <p className="font-semibold">{selectedModul.modelPembelajaran}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <span className="font-bold text-amber-800 dark:text-amber-300 block mb-1">Diferensiasi Produk:</span>
                    <p className="truncate">{selectedModul.strategiDiferensiasi.produk}</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Tujuan Pembelajaran:</span>
                  <ul className="list-disc pl-4 space-y-0.5 text-slate-600 dark:text-slate-400">
                    {selectedModul.tujuanPembelajaran.map((tp, i) => (
                      <li key={i}>{tp}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Headmaster Catatan & Approval Box */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <label className="block font-bold text-xs text-slate-800 dark:text-slate-200">
                  Catatan / Umpan Balik Kepala Sekolah:
                </label>
                <textarea
                  rows={2}
                  value={catatanInput}
                  onChange={(e) => setCatatanInput(e.target.value)}
                  placeholder="Berikan masukan atau apresiasi bagi guru..."
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => onRejectModul(selectedModul.id, catatanInput)}
                    className="px-4 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 text-rose-700 dark:text-rose-300 text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Minta Perbaikan</span>
                  </button>

                  <button
                    onClick={() => onApproveModul(selectedModul.id, catatanInput)}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Setujui & Tanda Tangan Digital</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-24 text-slate-400 text-xs">
              <FileCheck className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              Pilih modul dari antrean sebelah kiri untuk ditinjau.
            </div>
          )}
        </div>
      </div>

      {/* Automated Stability & Bug Monitor Logs Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4 text-indigo-500" />
          Sistem Pemantauan Stabilitas & Log Otomatis SMAN 106
        </h3>

        <div className="space-y-2">
          {bugLogs.map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full ${
                  log.status === 'resolved' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'
                }`} />
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200">{log.component}: <span className="font-normal">{log.message}</span></p>
                  <p className="text-[10px] text-slate-400">{log.timestamp}</p>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[10px] uppercase">
                {log.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
