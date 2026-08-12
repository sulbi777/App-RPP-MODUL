import React, { useState } from 'react';
import { 
  X, 
  CloudUpload, 
  Save, 
  HardDriveDownload, 
  FileCheck, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ShieldCheck, 
  Layers,
  FolderPlus
} from 'lucide-react';
import { ModulAjar } from '../types';
import { uploadToGoogleDrive, requestGoogleAccessToken, exportApplicationBackup } from '../lib/gdrive';

interface DriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeModul: ModulAjar;
  allModuls: ModulAjar[];
  onImportBackup: (importedData: any) => void;
}

export const DriveModal: React.FC<DriveModalProps> = ({
  isOpen,
  onClose,
  activeModul,
  allModuls,
  onImportBackup,
}) => {
  const [activeTab, setActiveTab] = useState<'save_gdrive' | 'save_app'>('save_gdrive');
  const [selectedModulId, setSelectedModulId] = useState<string>(activeModul?.id || allModuls[0]?.id || '');
  const [exportFormat, setExportFormat] = useState<'html' | 'doc' | 'json'>('html');
  const [loading, setLoading] = useState(false);
  const [driveResult, setDriveResult] = useState<{ success: boolean; link?: string; message?: string } | null>(null);
  const [customAccessToken, setCustomAccessToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(false);

  if (!isOpen) return null;

  const currentModulToSave = allModuls.find(m => m.id === selectedModulId) || activeModul;

  // Handle uploading Modul Ajar to Google Drive
  const handleUploadResultToDrive = async () => {
    setLoading(true);
    setDriveResult(null);

    try {
      let token = customAccessToken.trim();

      // If token not manually provided, trigger GSI token client popup
      if (!token) {
        token = await requestGoogleAccessToken();
      }

      let fileContent = '';
      let mimeType = 'text/html';
      let extension = '.html';

      if (exportFormat === 'json') {
        fileContent = JSON.stringify(currentModulToSave, null, 2);
        mimeType = 'application/json';
        extension = '.json';
      } else if (exportFormat === 'doc') {
        const fullDocHtml = `
          <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
          <head>
            <meta charset='utf-8'>
            <title>${currentModulToSave.judul}</title>
            <style>
              body { font-family: 'Times New Roman', serif; font-size: 11pt; line-height: 1.4; color: #000; }
              table { width: 100%; border-collapse: collapse; margin-bottom: 12pt; }
              th, td { border: 1px solid #000; padding: 6pt; text-align: left; vertical-align: top; }
              .kop-header { text-align: center; font-weight: bold; margin-bottom: 15pt; border-bottom: 3px double #000; padding-bottom: 8pt; }
            </style>
          </head>
          <body>
            <div className="kop-header">
              <h2>PEMERINTAH PROVINSI DKI JAKARTA - DINAS PENDIDIKAN</h2>
              <h1>SMA NEGERI 106 JAKARTA</h1>
              <p>Jl. Gandaria I No. 32, Pekayon, Pasar Rebo, Jakarta Timur</p>
            </div>
            <h2>MODUL AJAR: ${currentModulToSave.judul}</h2>
            <p><strong>Mata Pelajaran:</strong> ${currentModulToSave.mataPelajaran}</p>
            <p><strong>Guru Penyusun:</strong> ${currentModulToSave.penyusun} (NIP: ${currentModulToSave.nipPenyusun})</p>
            <p><strong>Capaian Pembelajaran:</strong> ${currentModulToSave.capaianPembelajaran}</p>
            <p><strong>Model Pembelajaran:</strong> ${currentModulToSave.modelPembelajaran}</p>
          </body>
          </html>
        `;
        fileContent = '\ufeff' + fullDocHtml;
        mimeType = 'application/msword';
        extension = '.doc';
      } else {
        // Standard HTML
        fileContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>${currentModulToSave.judul}</title>
            <style>
              body { font-family: system-ui, sans-serif; padding: 20px; line-height: 1.6; color: #1e293b; max-width: 800px; margin: 0 auto; }
              h1, h2 { color: #1e3a8a; }
              .kop { text-align: center; border-bottom: 3px double #1e293b; padding-bottom: 10px; margin-bottom: 20px; }
              .box { background: #f8fafc; border: 1px solid #cbd5e1; padding: 15px; border-radius: 8px; margin-bottom: 15px; }
            </style>
          </head>
          <body>
            <div class="kop">
              <h2>PEMERINTAH PROVINSI DKI JAKARTA</h2>
              <h1>SMA NEGERI 106 JAKARTA</h1>
              <p>Jl. Gandaria I No. 32, Pekayon, Pasar Rebo, Jakarta Timur</p>
            </div>
            <h1>${currentModulToSave.judul}</h1>
            <div class="box">
              <p><strong>Guru Penyusun:</strong> ${currentModulToSave.penyusun} (NIP. ${currentModulToSave.nipPenyusun})</p>
              <p><strong>Kepala Sekolah:</strong> ${currentModulToSave.kepalaSekolah || 'Dra. Hj. Sri Rahayu, M.Pd'} (NIP. ${currentModulToSave.nipKepalaSekolah || '196804121994032001'})</p>
              <p><strong>Mata Pelajaran:</strong> ${currentModulToSave.mataPelajaran} | Kelas ${currentModulToSave.kelas} | Fase ${currentModulToSave.fase}</p>
              <p><strong>Model Pembelajaran:</strong> ${currentModulToSave.modelPembelajaran}</p>
            </div>
            <div class="box">
              <h3>Capaian Pembelajaran (CP)</h3>
              <p>${currentModulToSave.capaianPembelajaran}</p>
            </div>
          </body>
          </html>
        `;
        mimeType = 'text/html';
        extension = '.html';
      }

      const fileName = `ModulAjar_SMAN106_${currentModulToSave.mataPelajaran}_${currentModulToSave.kelas}_${Date.now()}${extension}`;

      const res = await uploadToGoogleDrive({
        fileName,
        content: fileContent,
        mimeType,
        accessToken: token,
      });

      if (res.success) {
        setDriveResult({
          success: true,
          link: res.webViewLink,
          message: `Berhasil menyimpan file "${fileName}" ke Google Drive!`,
        });
      } else {
        setDriveResult({
          success: false,
          message: res.error || 'Gagal menyimpan ke Google Drive. Silakan coba lagi.',
        });
      }
    } catch (err: any) {
      setDriveResult({
        success: false,
        message: err.message || 'Proses otentikasi Google Drive dibatalkan atau gagal.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle uploading full application backup to Google Drive
  const handleUploadAppBackupToDrive = async () => {
    setLoading(true);
    setDriveResult(null);

    try {
      let token = customAccessToken.trim();
      if (!token) {
        token = await requestGoogleAccessToken();
      }

      const backupData = {
        app: 'SMAN 106 Jakarta Portal Modul Ajar',
        version: '2.0',
        timestamp: new Date().toISOString(),
        moduls: allModuls,
        activeModulId: selectedModulId,
      };

      const fileName = `Cadangan_Aplikasi_SMAN106_${new Date().toISOString().slice(0, 10)}.json`;

      const res = await uploadToGoogleDrive({
        fileName,
        content: JSON.stringify(backupData, null, 2),
        mimeType: 'application/json',
        accessToken: token,
      });

      if (res.success) {
        setDriveResult({
          success: true,
          link: res.webViewLink,
          message: `Berhasil mencadangkan seluruh data aplikasi ke Google Drive!`,
        });
      } else {
        setDriveResult({
          success: false,
          message: res.error || 'Gagal menyimpan cadangan aplikasi ke Google Drive.',
        });
      }
    } catch (err: any) {
      setDriveResult({
        success: false,
        message: err.message || 'Gagal mengunggah cadangan aplikasi.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Import Backup File handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.data || parsed.moduls) {
          onImportBackup(parsed);
          alert('Berhasil memulihkan data aplikasi dari berkas cadangan!');
          onClose();
        } else {
          alert('Format berkas cadangan tidak valid.');
        }
      } catch (err) {
        alert('Gagal membaca berkas JSON cadangan.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 my-8 overflow-hidden flex flex-col">
        {/* Modal Top Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md">
              <CloudUpload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Google Drive & Simpan Aplikasi</h3>
              <p className="text-xs text-slate-400">SMAN 106 Jakarta — Penyimpanan Cloud & Lokal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-2 gap-2">
          <button
            onClick={() => { setActiveTab('save_gdrive'); setDriveResult(null); }}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              activeTab === 'save_gdrive'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800'
            }`}
          >
            <CloudUpload className="w-4 h-4" />
            <span>Simpan Hasil ke Google Drive</span>
          </button>

          <button
            onClick={() => { setActiveTab('save_app'); setDriveResult(null); }}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              activeTab === 'save_app'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800'
            }`}
          >
            <Save className="w-4 h-4" />
            <span>Simpan / Cadangkan Aplikasi</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 text-sm text-slate-800 dark:text-slate-200">
          {activeTab === 'save_gdrive' ? (
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-950/40 p-4 rounded-2xl border border-blue-200 dark:border-blue-800/60 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-900 dark:text-blue-200 leading-relaxed">
                  Hasil Modul Ajar RPP akan diunggah secara aman langsung ke akun <strong>Google Drive</strong> Anda dengan izin OAuth aktif (<code className="bg-blue-100 dark:bg-blue-900/60 px-1 py-0.5 rounded">drive.file</code>).
                </p>
              </div>

              {/* Select Modul */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Pilih Modul Ajar Yang Ingin Disimpan:
                </label>
                <select
                  value={selectedModulId}
                  onChange={(e) => setSelectedModulId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold text-xs focus:ring-2 focus:ring-blue-500"
                >
                  {allModuls.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.judul} — {m.mataPelajaran} (Kelas {m.kelas})
                    </option>
                  ))}
                </select>
              </div>

              {/* Format Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Format Berkas Google Drive:
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setExportFormat('html')}
                    className={`p-3 rounded-xl border text-xs font-bold transition flex flex-col items-center gap-1 ${
                      exportFormat === 'html'
                        ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-600 text-blue-700 dark:text-blue-300'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>Dokumen Web (.html)</span>
                    <span className="text-[10px] font-normal text-slate-500">Pratinjau Langsung</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setExportFormat('doc')}
                    className={`p-3 rounded-xl border text-xs font-bold transition flex flex-col items-center gap-1 ${
                      exportFormat === 'doc'
                        ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-600 text-blue-700 dark:text-blue-300'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>Microsoft Word (.doc)</span>
                    <span className="text-[10px] font-normal text-slate-500">Siap Edit MS Office</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setExportFormat('json')}
                    className={`p-3 rounded-xl border text-xs font-bold transition flex flex-col items-center gap-1 ${
                      exportFormat === 'json'
                        ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-600 text-blue-700 dark:text-blue-300'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>Data Mentah (.json)</span>
                    <span className="text-[10px] font-normal text-slate-500">Struktur Data RPP</span>
                  </button>
                </div>
              </div>

              {/* Option to toggle manual OAuth Access Token if popup fails */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowTokenInput(!showTokenInput)}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  {showTokenInput ? '▲ Sembunyikan Input Manual Token' : '▼ Gunakan Token Akses Manual (Jika Pop-up Terblokir)'}
                </button>
                {showTokenInput && (
                  <div className="mt-2 p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                      OAuth Access Token Google Drive:
                    </label>
                    <input
                      type="text"
                      value={customAccessToken}
                      onChange={(e) => setCustomAccessToken(e.target.value)}
                      placeholder="ya29.a0... (Tempel Access Token dari OAuth Playground / Google GSI)"
                      className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                )}
              </div>

              {/* Action Button */}
              <button
                onClick={handleUploadResultToDrive}
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Menghubungkan & Mengunggah ke Google Drive...</span>
                  </>
                ) : (
                  <>
                    <CloudUpload className="w-4 h-4" />
                    <span>Unggah Modul Ajar Ini Ke Google Drive Saya</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-wide text-blue-800 dark:text-blue-400 flex items-center gap-2">
                  <Save className="w-4 h-4 text-blue-600" />
                  Simpan & Cadangkan Aplikasi SMAN 106
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Fitur ini menyimpan seluruh status aplikasi (termasuk seluruh Modul Ajar yang pernah dibuat, daftar pengguna, dan setelan) ke dalam format berkas cadangan resmi SMAN 106 Jakarta.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Local JSON Backup */}
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 flex items-center justify-center mb-2">
                      <HardDriveDownload className="w-4 h-4" />
                    </div>
                    <h5 className="font-bold text-xs text-slate-900 dark:text-white">Simpan Berkas Cadangan Lokal</h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      Unduh berkas .json cadangan seluruh data aplikasi ke perangkat Anda.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      exportApplicationBackup({ moduls: allModuls, activeModulId: selectedModulId });
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Unduh Cadangan (.json)</span>
                  </button>
                </div>

                {/* Cloud Google Drive Backup */}
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-300 flex items-center justify-center mb-2">
                      <CloudUpload className="w-4 h-4" />
                    </div>
                    <h5 className="font-bold text-xs text-slate-900 dark:text-white">Cadangkan Ke Google Drive</h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      Simpan file cadangan .json seluruh aplikasi langsung ke Google Drive.
                    </p>
                  </div>
                  <button
                    onClick={handleUploadAppBackupToDrive}
                    disabled={loading}
                    className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CloudUpload className="w-3.5 h-3.5" />}
                    <span>Cadangkan ke GDrive</span>
                  </button>
                </div>
              </div>

              {/* Restore / Import Section */}
              <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-2">
                <h5 className="font-bold text-xs text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                  <FolderPlus className="w-4 h-4 text-amber-600" />
                  Pulihkan / Impor Data Aplikasi
                </h5>
                <p className="text-[11px] text-amber-800 dark:text-amber-300">
                  Pilih berkas cadangan (.json) dari perangkat Anda untuk memulihkan seluruh data modul ajar:
                </p>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-600 file:text-white hover:file:bg-amber-700 cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* Drive Upload Result Alert */}
          {driveResult && (
            <div
              className={`p-4 rounded-2xl border flex items-start gap-3 ${
                driveResult.success
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                  : 'bg-red-50 dark:bg-red-950/50 border-red-300 dark:border-red-800 text-red-900 dark:text-red-200'
              }`}
            >
              {driveResult.success ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1 text-xs">
                <p className="font-bold">{driveResult.message}</p>
                {driveResult.link && (
                  <a
                    href={driveResult.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-blue-600 dark:text-blue-400 hover:underline mt-1"
                  >
                    <span>Buka Berkas di Google Drive</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
