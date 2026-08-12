import React, { useState } from 'react';
import { 
  Sparkles, 
  Wand2, 
  Send, 
  Save, 
  FileDown, 
  Printer, 
  CheckCircle2, 
  RefreshCw, 
  Layers, 
  BookOpen, 
  Compass, 
  GraduationCap, 
  Clock, 
  Target, 
  Sliders, 
  Cloud, 
  Bot, 
  User, 
  FileText,
  Copy,
  ChevronRight,
  SendHorizontal,
  CloudUpload
} from 'lucide-react';
import { ModulAjar, ModelPembelajaran, KelasSMA, FaseKurikulum, Semester, UserProfile, TemplateRPPKemendikdasmen } from '../types';

interface GeminiCanvasProps {
  currentModul: ModulAjar;
  setCurrentModul: React.Dispatch<React.SetStateAction<ModulAjar>>;
  onSaveModul: (modul: ModulAjar) => void;
  onOpenDocExport: (modul: ModulAjar) => void;
  onOpenDriveModal?: () => void;
  currentUser: UserProfile;
}

export const GeminiCanvas: React.FC<GeminiCanvasProps> = ({
  currentModul,
  setCurrentModul,
  onSaveModul,
  onOpenDocExport,
  onOpenDriveModal,
  currentUser,
}) => {
  // Left panel mode: 'prompt_builder' or 'ai_chat'
  const [leftDockMode, setLeftDockMode] = useState<'prompt_builder' | 'ai_chat'>('prompt_builder');
  
  // Active canvas section tab
  const [activeCanvasSection, setActiveCanvasSection] = useState<'identitas' | 'tujuan' | 'kegiatan' | 'diferensiasi' | 'asesmen' | 'lampiran'>('identitas');

  // Generation Form States
  const [topik, setTopik] = useState('Persamaan dan Pertidaksamaan Eksponen');
  const [penyusun, setPenyusun] = useState(currentModul.penyusun || currentUser.nama);
  const [nipPenyusun, setNipPenyusun] = useState(currentModul.nipPenyusun || currentUser.nip);
  const [kepalaSekolah, setKepalaSekolah] = useState(currentModul.kepalaSekolah || 'Dra. Hj. Sri Rahayu, M.Pd');
  const [nipKepalaSekolah, setNipKepalaSekolah] = useState(currentModul.nipKepalaSekolah || '196804121994032001');
  const [mataPelajaran, setMataPelajaran] = useState(currentModul.mataPelajaran || currentUser.mataPelajaran || 'Matematika');
  const [kelas, setKelas] = useState<KelasSMA>('X');
  const [fase, setFase] = useState<FaseKurikulum>('E');
  const [semester, setSemester] = useState<Semester>('Ganjil');
  const [alokasiWaktu, setAlokasiWaktu] = useState('4 JP (2 x Pertemuan)');
  const [modelPembelajaran, setModelPembelajaran] = useState<ModelPembelajaran>('Problem Based Learning (PBL)');
  const [templateRPP, setTemplateRPP] = useState<TemplateRPPKemendikdasmen>(
    currentModul.templateRPP || 'Kemendikdasmen Lengkap (Modul Ajar Komponen Utuh)'
  );
  const [diferensiasiNote, setDiferensiasiNote] = useState('Gaya belajar visual & kinestetik, tugas kelompok heterogen, produk presentasi/infografis');
  const [instruksiTambahan, setInstruksiTambahan] = useState('Sertakan konteks kota Jakarta dan analisis grafik Geogebra');

  // Synchronize state when active module or currentUser updates
  React.useEffect(() => {
    if (currentModul) {
      setPenyusun(currentModul.penyusun || currentUser.nama);
      setNipPenyusun(currentModul.nipPenyusun || currentUser.nip);
      setKepalaSekolah(currentModul.kepalaSekolah || 'Dra. Hj. Sri Rahayu, M.Pd');
      setNipKepalaSekolah(currentModul.nipKepalaSekolah || '196804121994032001');
      setMataPelajaran(currentModul.mataPelajaran || currentUser.mataPelajaran || 'Matematika');
    }
  }, [currentModul.id, currentUser]);

  // AI Loading & Status
  const [generating, setGenerating] = useState(false);
  const [refining, setRefining] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // AI Chat Messages
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'ai'; text: string; time: string }[]>([
    {
      sender: 'ai',
      text: 'Halo Bapak/Ibu Guru SMAN 106 Jakarta! Ada yang ingin didiskusikan mengenai pemetaan CP, ATP, atau penyesuaian strategi diferensiasi Kurikulum Merdeka?',
      time: 'Baru saja'
    }
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  // Quick Topic Chips
  const topicChips = [
    'Proyek STEM Alat Penyaring Air Baku Jakarta',
    'Fungsi Eksponen & Logaritma',
    'Gelombang Elektromagnetik & Wi-Fi',
    'Menulis Teks Argumentasi Lingkungan Jakarta',
    'Struktur Data & Algoritma Dasar',
    'Sistem Transportasi Membran Sel'
  ];

  // Trigger Full AI RPP Generation
  const handleGenerateRPP = async () => {
    setGenerating(true);
    setStatusMessage('Menghubungi Gemini AI & menyusun RPP Kurikulum Merdeka SMAN 106...');

    try {
      const res = await fetch('/api/gemini/generate-rpp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topik,
          mataPelajaran,
          kelas,
          fase,
          semester,
          alokasiWaktu,
          modelPembelajaran,
          templateRPP,
          penyusun,
          nipPenyusun,
          kepalaSekolah,
          nipKepalaSekolah,
          diferensiasiReq: diferensiasiNote,
          instruksiTambahan
        })
      });

      const data = await res.json();
      if (data.success && data.data) {
        const generated = data.data;
        const newModul: ModulAjar = {
          ...currentModul,
          id: `mod_106_${Date.now()}`,
          judul: generated.judul || `Modul Ajar ${mataPelajaran} - ${topik}`,
          mataPelajaran,
          kelas,
          fase,
          semester,
          alokasiWaktu,
          penyusun,
          nipPenyusun,
          kepalaSekolah,
          nipKepalaSekolah,
          sekolah: 'SMAN 106 Jakarta',
          tahunAjaran: '2025/2026',
          capaianPembelajaran: generated.capaianPembelajaran || currentModul.capaianPembelajaran,
          tujuanPembelajaran: generated.tujuanPembelajaran || currentModul.tujuanPembelajaran,
          alurTujuanPembelajaran: generated.alurTujuanPembelajaran || currentModul.alurTujuanPembelajaran,
          profilPancasila: generated.profilPancasila || currentModul.profilPancasila,
          pemahamanBermakna: generated.pemahamanBermakna || currentModul.pemahamanBermakna,
          pertanyaanPemantik: generated.pertanyaanPemantik || currentModul.pertanyaanPemantik,
          saranaPrasarana: generated.saranaPrasarana || currentModul.saranaPrasarana,
          targetPesertaDidik: generated.targetPesertaDidik || currentModul.targetPesertaDidik,
          modelPembelajaran,
          templateRPP,
          strategiDiferensiasi: generated.strategiDiferensiasi || currentModul.strategiDiferensiasi,
          kegiatanPembelajaran: generated.kegiatanPembelajaran || currentModul.kegiatanPembelajaran,
          asesmen: generated.asesmen || currentModul.asesmen,
          lampiran: generated.lampiran || currentModul.lampiran,
          status: 'Draft',
          tanggalDibuat: new Date().toISOString().split('T')[0],
          terakhirDiubah: new Date().toISOString().split('T')[0],
          versi: (currentModul.versi || 1) + 1,
          syncedToDrive: true
        };

        setCurrentModul(newModul);
        onSaveModul(newModul);
        setStatusMessage('Modul Ajar berhasil diproduksi & disimpan!');
      } else {
        setStatusMessage('Terjadi kendala saat generate RPP. Menggunakan data lokal.');
      }
    } catch (err) {
      console.error(err);
      setStatusMessage('Gagal terhubung ke Gemini API. Pastikan jaringan stabil.');
    } finally {
      setGenerating(false);
    }
  };

  // Trigger AI Inline Section Refinement
  const handleRefineSection = async (actionType: string, userPromptCustom?: string) => {
    setRefining(true);
    let targetText = '';
    let sectionName = activeCanvasSection;

    if (activeCanvasSection === 'identitas') targetText = currentModul.capaianPembelajaran;
    else if (activeCanvasSection === 'tujuan') targetText = currentModul.pemahamanBermakna;
    else if (activeCanvasSection === 'diferensiasi') targetText = currentModul.strategiDiferensiasi.proses;
    else if (activeCanvasSection === 'asesmen') targetText = currentModul.asesmen.kktp;
    else if (activeCanvasSection === 'lampiran') targetText = currentModul.lampiran.lkpd;

    try {
      const res = await fetch('/api/gemini/refine-canvas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionName,
          currentText: targetText,
          actionType,
          userPrompt: userPromptCustom || ''
        })
      });

      const data = await res.json();
      if (data.success && data.refinedText) {
        if (activeCanvasSection === 'identitas') {
          setCurrentModul(prev => ({ ...prev, capaianPembelajaran: data.refinedText }));
        } else if (activeCanvasSection === 'tujuan') {
          setCurrentModul(prev => ({ ...prev, pemahamanBermakna: data.refinedText }));
        } else if (activeCanvasSection === 'diferensiasi') {
          setCurrentModul(prev => ({
            ...prev,
            strategiDiferensiasi: { ...prev.strategiDiferensiasi, proses: data.refinedText }
          }));
        } else if (activeCanvasSection === 'asesmen') {
          setCurrentModul(prev => ({
            ...prev,
            asesmen: { ...prev.asesmen, kktp: data.refinedText }
          }));
        } else if (activeCanvasSection === 'lampiran') {
          setCurrentModul(prev => ({
            ...prev,
            lampiran: { ...prev.lampiran, lkpd: data.refinedText }
          }));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRefining(false);
    }
  };

  // Send AI Chat Message
  const handleSendChat = async () => {
    if (!chatInput.trim()) return;
    const userText = chatInput;
    setChatInput('');
    setChatMessages(prev => [
      ...prev,
      { sender: 'user', text: userText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    setChatLoading(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText })
      });
      const data = await res.json();
      if (data.success && data.reply) {
        setChatMessages(prev => [
          ...prev,
          { sender: 'ai', text: data.reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
        ]);
      }
    } catch (err) {
      console.error(err);
      setChatMessages(prev => [
        ...prev,
        { sender: 'ai', text: 'Maaf, terjadi masalah koneksi dengan Gemini AI.', time: 'Baru saja' }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Canvas Top Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-600 rounded-xl text-white shadow-sm shadow-blue-500/20">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={currentModul.judul}
                onChange={(e) => setCurrentModul({ ...currentModul, judul: e.target.value })}
                className="font-bold text-slate-900 dark:text-white text-base sm:text-lg bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 px-2 py-0.5 rounded-lg border border-transparent hover:border-slate-300 transition w-full sm:w-[480px]"
              />
              <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-md ${
                currentModul.status === 'Disetujui'
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200'
                  : currentModul.status === 'Menunggu Review'
                  ? 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200'
                  : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200'
              }`}>
                {currentModul.status}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2 flex-wrap">
              <span>{currentModul.mataPelajaran} • Kelas {currentModul.kelas} (Fase {currentModul.fase})</span>
              <span>•</span>
              <span>Penyusun: {currentModul.penyusun}</span>
              <span>•</span>
              <span className="text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1">
                <Cloud className="w-3 h-3" /> Encrypted GDrive Synced
              </span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {onOpenDriveModal && (
            <button
              id="btn-gdrive-upload-canvas"
              onClick={onOpenDriveModal}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition"
            >
              <CloudUpload className="w-4 h-4" />
              <span>Simpan ke GDrive</span>
            </button>
          )}

          <button
            id="btn-save-canvas"
            onClick={() => {
              onSaveModul(currentModul);
              setStatusMessage('Modul berhasil disimpan ke Bank Modul Ajar SMAN 106!');
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition border border-slate-200 dark:border-slate-700"
          >
            <Save className="w-4 h-4 text-blue-600" />
            <span>Simpan Modul</span>
          </button>

          <button
            id="btn-doc-preview-modal"
            onClick={() => onOpenDocExport(currentModul)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm shadow-blue-500/20 transition"
          >
            <Printer className="w-4 h-4" />
            <span>Kop & Ekspor (PDF/Word)</span>
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {statusMessage}
          </span>
          <button onClick={() => setStatusMessage('')} className="font-bold hover:underline">
            Tutup
          </button>
        </div>
      )}

      {/* Main Split Grid (Prompt Control Dock + Canvas Document Editor) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side AI Control Dock (4 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-4 flex flex-col h-[780px]">
          {/* Dock Header Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-4 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setLeftDockMode('prompt_builder')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                leftDockMode === 'prompt_builder'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Prompt Generator</span>
            </button>
            <button
              onClick={() => setLeftDockMode('ai_chat')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                leftDockMode === 'ai_chat'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Tanya Asisten AI</span>
            </button>
          </div>

          {leftDockMode === 'prompt_builder' ? (
            <div className="flex-1 overflow-y-auto pr-1 space-y-4 text-xs">
              {/* Quick Topic Chips */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1.5 flex items-center justify-between">
                  <span>Rekomendasi Topik Pembelajaran:</span>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-normal">Klik untuk isi</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {topicChips.map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => setTopik(chip)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950 text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-300 border border-slate-200 dark:border-slate-700 transition text-[11px] font-medium"
                    >
                      + {chip}
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Input Parameters */}
              <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1 flex items-center justify-between">
                    <span>Template Standar Kemendikdasmen:</span>
                    <span className="text-[10px] text-blue-600 dark:text-blue-400 font-normal">Terbaru 2025/2026</span>
                  </label>
                  <select
                    value={templateRPP}
                    onChange={(e) => setTemplateRPP(e.target.value as TemplateRPPKemendikdasmen)}
                    className="w-full px-2.5 py-2 rounded-xl bg-blue-50/50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-semibold text-[11px]"
                  >
                    <option value="Kemendikdasmen Lengkap (Modul Ajar Komponen Utuh)">📘 Kemendikdasmen Lengkap (Modul Ajar Komponen Utuh)</option>
                    <option value="Kemendikdasmen Sederhana (Format Ringkas 3 Komponen)">⚡ Kemendikdasmen Sederhana (Format Ringkas 3 Komponen)</option>
                    <option value="Kemendikdasmen Deep Learning (Mindful, Meaningful, Joyful)">💡 Kemendikdasmen Deep Learning (Mindful, Meaningful, Joyful)</option>
                    <option value="Kemendikdasmen P5 & STEM Interdisipliner">🔬 Kemendikdasmen P5 & STEM Interdisipliner</option>
                  </select>
                </div>

                {/* Inputs for Teacher Name and NIP */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                      Guru Penyusun:
                    </label>
                    <input
                      type="text"
                      value={penyusun}
                      onChange={(e) => setPenyusun(e.target.value)}
                      placeholder="Nama Guru & Gelar"
                      className="w-full px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                      NIP Guru:
                    </label>
                    <input
                      type="text"
                      value={nipPenyusun}
                      onChange={(e) => setNipPenyusun(e.target.value)}
                      placeholder="NIP / NIPPPK"
                      className="w-full px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none text-xs font-semibold"
                    />
                  </div>
                </div>

                {/* Inputs for Headmaster Name and NIP */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                      Kepala Sekolah:
                    </label>
                    <input
                      type="text"
                      value={kepalaSekolah}
                      onChange={(e) => setKepalaSekolah(e.target.value)}
                      placeholder="Nama Kepala Sekolah"
                      className="w-full px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                      NIP Kepala Sekolah:
                    </label>
                    <input
                      type="text"
                      value={nipKepalaSekolah}
                      onChange={(e) => setNipKepalaSekolah(e.target.value)}
                      placeholder="NIP Kepala Sekolah"
                      className="w-full px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none text-xs font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Topik / Judul Materi Utama:
                  </label>
                  <input
                    type="text"
                    value={topik}
                    onChange={(e) => setTopik(e.target.value)}
                    placeholder="Contoh: Persamaan Eksponen & Kasus Populasi"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                      Mata Pelajaran:
                    </label>
                    <input
                      type="text"
                      list="mata-pelajaran-prompt-list"
                      value={mataPelajaran}
                      onChange={(e) => setMataPelajaran(e.target.value)}
                      placeholder="Ketik/pilih mapel"
                      className="w-full px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none text-xs font-semibold"
                    />
                    <datalist id="mata-pelajaran-prompt-list">
                      <option value="Matematika" />
                      <option value="Matematika Tingkat Lanjut" />
                      <option value="Fisika" />
                      <option value="Kimia" />
                      <option value="Biologi" />
                      <option value="Informatika" />
                      <option value="Bahasa Indonesia" />
                      <option value="Bahasa Inggris" />
                      <option value="Sejarah" />
                      <option value="Pendidikan Pancasila" />
                      <option value="Seni Budaya" />
                      <option value="PJOK" />
                      <option value="Bimbingan Konseling (BK)" />
                    </datalist>
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                      Kelas & Fase:
                    </label>
                    <select
                      value={`${kelas}-${fase}`}
                      onChange={(e) => {
                        const [k, f] = e.target.value.split('-');
                        setKelas(k as KelasSMA);
                        setFase(f as FaseKurikulum);
                      }}
                      className="w-full px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="X-E">Kelas X (Fase E)</option>
                      <option value="XI-F">Kelas XI (Fase F)</option>
                      <option value="XII-F">Kelas XII (Fase F)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Model Pembelajaran Utama:
                  </label>
                  <select
                    value={modelPembelajaran}
                    onChange={(e) => setModelPembelajaran(e.target.value as ModelPembelajaran)}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium text-blue-800 dark:text-blue-300"
                  >
                    <option value="Problem Based Learning (PBL)">Problem Based Learning (PBL)</option>
                    <option value="Project Based Learning (PjBL)">Project Based Learning (PjBL)</option>
                    <option value="STEM (Science, Tech, Engineering, Math)">STEM (Science, Technology, Engineering & Math)</option>
                    <option value="Discovery Learning">Discovery Learning</option>
                    <option value="Inquiry Learning">Inquiry Learning</option>
                    <option value="Cooperative Learning">Cooperative Learning</option>
                    <option value="Deep Learning">Deep Learning (Meaningful & Engaged)</option>
                    <option value="Differentiated Learning">Differentiated Learning Focus</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Strategi Diferensiasi Tambahan:
                  </label>
                  <textarea
                    rows={2}
                    value={diferensiasiNote}
                    onChange={(e) => setDiferensiasiNote(e.target.value)}
                    placeholder="Catatan diferensiasi konten, proses, atau produk..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Instruksi Khusus (Konteks SMAN 106):
                  </label>
                  <input
                    type="text"
                    value={instruksiTambahan}
                    onChange={(e) => setInstruksiTambahan(e.target.value)}
                    placeholder="Sertakan tugas kelompok kontekstual DKI Jakarta..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Generate RPP Main Trigger Button */}
              <button
                id="btn-generate-rpp-gemini"
                onClick={handleGenerateRPP}
                disabled={generating}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition disabled:opacity-50 mt-4"
              >
                {generating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                    <span>Menyusun Modul Ajar AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4.5 h-4.5 text-amber-300" />
                    <span>Generate Modul Ajar via Gemini</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            /* AI Chat Assistant Tab */
            <div className="flex-1 flex flex-col justify-between overflow-hidden">
              <div className="flex-1 overflow-y-auto pr-1 space-y-3 mb-3">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs shrink-0 ${
                      msg.sender === 'user' ? 'bg-blue-600' : 'bg-slate-800'
                    }`}>
                      {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5 text-blue-400" />}
                    </div>
                    <div className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-tr-none shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200 dark:border-slate-700'
                    }`}>
                      <p>{msg.text}</p>
                      <span className="text-[10px] opacity-70 block mt-1 text-right">{msg.time}</span>
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex items-center gap-2 text-xs text-slate-500 p-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
                    <span>Gemini AI sedang berpikir...</span>
                  </div>
                )}
              </div>

              {/* Chat Input Bar */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                  placeholder="Tanya perancangan RPP / KKTP..."
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <button
                  onClick={handleSendChat}
                  disabled={chatLoading}
                  className="p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  <SendHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Side Gemini Canvas Document Editor (8 cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col min-h-[780px]">
          {/* Section Navigation Tabs */}
          <div className="flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-800 pb-3 mb-4 overflow-x-auto">
            <button
              onClick={() => setActiveCanvasSection('identitas')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                activeCanvasSection === 'identitas'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              1. Identitas & CP
            </button>
            <button
              onClick={() => setActiveCanvasSection('tujuan')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                activeCanvasSection === 'tujuan'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              2. Tujuan & Pertanyaan Pemantik
            </button>
            <button
              onClick={() => setActiveCanvasSection('kegiatan')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                activeCanvasSection === 'kegiatan'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              3. Kegiatan Pembelajaran
            </button>
            <button
              onClick={() => setActiveCanvasSection('diferensiasi')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                activeCanvasSection === 'diferensiasi'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              4. Diferensiasi (Konten/Proses/Produk)
            </button>
            <button
              onClick={() => setActiveCanvasSection('asesmen')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                activeCanvasSection === 'asesmen'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              5. Asesmen & KKTP
            </button>
            <button
              onClick={() => setActiveCanvasSection('lampiran')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                activeCanvasSection === 'lampiran'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              6. Lampiran & LKPD
            </button>
          </div>

          {/* AI Canvas Section Quick Actions Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 mb-4 text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Poles AI Seksi Ini:
            </span>
            
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => handleRefineSection('simplify')}
                disabled={refining}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-blue-500 text-slate-700 dark:text-slate-300 text-[11px] font-medium transition"
              >
                ⚡ Sederhanakan
              </button>
              <button
                onClick={() => handleRefineSection('expand')}
                disabled={refining}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-blue-500 text-slate-700 dark:text-slate-300 text-[11px] font-medium transition"
              >
                🔍 Perluas & Detail
              </button>
              <button
                onClick={() => handleRefineSection('add_differentiation')}
                disabled={refining}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-blue-500 text-slate-700 dark:text-slate-300 text-[11px] font-medium transition"
              >
                🎯 Tambah Diferensiasi
              </button>
              <button
                onClick={() => handleRefineSection('rubric_kktp')}
                disabled={refining}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-blue-500 text-slate-700 dark:text-slate-300 text-[11px] font-medium transition"
              >
                📊 Rubrik KKTP
              </button>
            </div>
          </div>

          {/* Active Canvas Editor Area */}
          <div className="flex-1 overflow-y-auto space-y-4 text-sm text-slate-800 dark:text-slate-200">
            {activeCanvasSection === 'identitas' && (
              <div className="space-y-4">
                <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                    <h3 className="font-bold text-xs uppercase tracking-wide text-blue-800 dark:text-blue-400 flex items-center gap-1.5">
                      <User className="w-4 h-4 text-blue-600" />
                      Identitas Pengembang & Modul Ajar SMAN 106
                    </h3>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                      ✍️ Metode Input Langsung
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Nama Guru Penyusun:
                      </label>
                      <input
                        type="text"
                        value={currentModul.penyusun || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCurrentModul({ ...currentModul, penyusun: val });
                          setPenyusun(val);
                        }}
                        placeholder="Contoh: Drs. Iswahyudi, M.Pd"
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        NIP Guru Penyusun:
                      </label>
                      <input
                        type="text"
                        value={currentModul.nipPenyusun || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCurrentModul({ ...currentModul, nipPenyusun: val });
                          setNipPenyusun(val);
                        }}
                        placeholder="Contoh: 197805122005011002"
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Nama Kepala Sekolah:
                      </label>
                      <input
                        type="text"
                        value={currentModul.kepalaSekolah || 'Dra. Hj. Sri Rahayu, M.Pd'}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCurrentModul({ ...currentModul, kepalaSekolah: val });
                          setKepalaSekolah(val);
                        }}
                        placeholder="Contoh: Dra. Hj. Sri Rahayu, M.Pd"
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        NIP Kepala Sekolah:
                      </label>
                      <input
                        type="text"
                        value={currentModul.nipKepalaSekolah || '196804121994032001'}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCurrentModul({ ...currentModul, nipKepalaSekolah: val });
                          setNipKepalaSekolah(val);
                        }}
                        placeholder="Contoh: 196804121994032001"
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Mata Pelajaran:
                      </label>
                      <input
                        type="text"
                        list="canvas-mapel-list"
                        value={currentModul.mataPelajaran || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCurrentModul({ ...currentModul, mataPelajaran: val });
                          setMataPelajaran(val);
                        }}
                        placeholder="Contoh: Matematika, Fisika, Informatika..."
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                      <datalist id="canvas-mapel-list">
                        <option value="Matematika" />
                        <option value="Matematika Tingkat Lanjut" />
                        <option value="Fisika" />
                        <option value="Kimia" />
                        <option value="Biologi" />
                        <option value="Informatika" />
                        <option value="Bahasa Indonesia" />
                        <option value="Bahasa Inggris" />
                        <option value="Sejarah" />
                        <option value="Pendidikan Pancasila" />
                        <option value="Seni Budaya" />
                        <option value="PJOK" />
                        <option value="Bimbingan Konseling (BK)" />
                      </datalist>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Satuan Pendidikan:
                      </label>
                      <input
                        type="text"
                        value={currentModul.sekolah || ''}
                        onChange={(e) => setCurrentModul({ ...currentModul, sekolah: e.target.value })}
                        placeholder="SMAN 106 Jakarta"
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Tahun Ajaran:
                      </label>
                      <input
                        type="text"
                        value={currentModul.tahunAjaran || ''}
                        onChange={(e) => setCurrentModul({ ...currentModul, tahunAjaran: e.target.value })}
                        placeholder="2025/2026"
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Model Pembelajaran:
                      </label>
                      <select
                        value={currentModul.modelPembelajaran || 'Problem Based Learning (PBL)'}
                        onChange={(e) => setCurrentModul({ ...currentModul, modelPembelajaran: e.target.value as ModelPembelajaran })}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        <option value="Problem Based Learning (PBL)">Problem Based Learning (PBL)</option>
                        <option value="Project Based Learning (PjBL)">Project Based Learning (PjBL)</option>
                        <option value="STEM (Science, Tech, Engineering, Math)">STEM (Science, Technology, Engineering & Math)</option>
                        <option value="Discovery Learning">Discovery Learning</option>
                        <option value="Inquiry Learning">Inquiry Learning</option>
                        <option value="Cooperative Learning">Cooperative Learning</option>
                        <option value="Deep Learning">Deep Learning (Meaningful & Engaged)</option>
                        <option value="Differentiated Learning">Differentiated Learning Focus</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Capaian Pembelajaran (CP):
                  </label>
                  <textarea
                    rows={4}
                    value={currentModul.capaianPembelajaran}
                    onChange={(e) => setCurrentModul({ ...currentModul, capaianPembelajaran: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none text-xs leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Sarana, Prasarana & Media Pembelajaran:
                  </label>
                  <input
                    type="text"
                    value={currentModul.saranaPrasarana}
                    onChange={(e) => setCurrentModul({ ...currentModul, saranaPrasarana: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                  />
                </div>
              </div>
            )}

            {activeCanvasSection === 'tujuan' && (
              <div className="space-y-4">
                <div>
                  <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Tujuan Pembelajaran (TP):
                  </label>
                  <div className="space-y-2">
                    {currentModul.tujuanPembelajaran.map((tp, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <input
                          type="text"
                          value={tp}
                          onChange={(e) => {
                            const newTp = [...currentModul.tujuanPembelajaran];
                            newTp[idx] = e.target.value;
                            setCurrentModul({ ...currentModul, tujuanPembelajaran: newTp });
                          }}
                          className="flex-1 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Pemahaman Bermakna:
                  </label>
                  <textarea
                    rows={3}
                    value={currentModul.pemahamanBermakna}
                    onChange={(e) => setCurrentModul({ ...currentModul, pemahamanBermakna: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Pertanyaan Pemantik:
                  </label>
                  <div className="space-y-2">
                    {currentModul.pertanyaanPemantik.map((pemantik, idx) => (
                      <input
                        key={idx}
                        type="text"
                        value={pemantik}
                        onChange={(e) => {
                          const newPem = [...currentModul.pertanyaanPemantik];
                          newPem[idx] = e.target.value;
                          setCurrentModul({ ...currentModul, pertanyaanPemantik: newPem });
                        }}
                        className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeCanvasSection === 'kegiatan' && (
              <div className="space-y-4">
                {currentModul.kegiatanPembelajaran.map((pertemuan, pIdx) => (
                  <div key={pIdx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-emerald-800 dark:text-emerald-300 text-xs uppercase">
                        Pertemuan Ke-{pertemuan.pertemuanKe} ({pertemuan.alokasiWaktu})
                      </h4>
                    </div>

                    <div>
                      <span className="font-semibold text-xs text-slate-700 dark:text-slate-300">Pendahuluan:</span>
                      <ul className="list-disc pl-5 text-xs text-slate-600 dark:text-slate-400 space-y-1 mt-1">
                        {pertemuan.pendahuluan.map((p, i) => (
                          <li key={i}>{p}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <span className="font-semibold text-xs text-slate-700 dark:text-slate-300">Kegiatan Inti Sintaks:</span>
                      <div className="space-y-2 mt-1">
                        {pertemuan.kegiatanInti.map((inti, iIdx) => (
                          <div key={iIdx} className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                            <p className="font-bold text-emerald-700 dark:text-emerald-400">{inti.langkahModel}</p>
                            <p><span className="font-medium text-slate-500">Aktivitas Guru:</span> {inti.aktivitasGuru}</p>
                            <p><span className="font-medium text-slate-500">Aktivitas Siswa:</span> {inti.aktivitasSiswa}</p>
                            {inti.diferensiasi && (
                              <p className="text-amber-700 dark:text-amber-400 font-medium bg-amber-50 dark:bg-amber-950/40 p-1.5 rounded">
                                Diferensiasi: {inti.diferensiasi}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeCanvasSection === 'diferensiasi' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div>
                    <label className="block font-bold text-emerald-800 dark:text-emerald-300 text-xs mb-1">
                      Diferensiasi Konten:
                    </label>
                    <textarea
                      rows={2}
                      value={currentModul.strategiDiferensiasi.konten}
                      onChange={(e) => setCurrentModul({
                        ...currentModul,
                        strategiDiferensiasi: { ...currentModul.strategiDiferensiasi, konten: e.target.value }
                      })}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-emerald-800 dark:text-emerald-300 text-xs mb-1">
                      Diferensiasi Proses:
                    </label>
                    <textarea
                      rows={2}
                      value={currentModul.strategiDiferensiasi.proses}
                      onChange={(e) => setCurrentModul({
                        ...currentModul,
                        strategiDiferensiasi: { ...currentModul.strategiDiferensiasi, proses: e.target.value }
                      })}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-emerald-800 dark:text-emerald-300 text-xs mb-1">
                      Diferensiasi Produk:
                    </label>
                    <textarea
                      rows={2}
                      value={currentModul.strategiDiferensiasi.produk}
                      onChange={(e) => setCurrentModul({
                        ...currentModul,
                        strategiDiferensiasi: { ...currentModul.strategiDiferensiasi, produk: e.target.value }
                      })}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeCanvasSection === 'asesmen' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-xs mb-1">Asesmen Diagnostik (Awal):</label>
                    <textarea
                      rows={3}
                      value={currentModul.asesmen.diagnostik}
                      onChange={(e) => setCurrentModul({
                        ...currentModul,
                        asesmen: { ...currentModul.asesmen, diagnostik: e.target.value }
                      })}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-xs mb-1">Asesmen Formatif (Proses):</label>
                    <textarea
                      rows={3}
                      value={currentModul.asesmen.formatif}
                      onChange={(e) => setCurrentModul({
                        ...currentModul,
                        asesmen: { ...currentModul.asesmen, formatif: e.target.value }
                      })}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-xs mb-1">KKTP (Kriteria Ketercapaian Tujuan Pembelajaran):</label>
                  <textarea
                    rows={3}
                    value={currentModul.asesmen.kktp}
                    onChange={(e) => setCurrentModul({
                      ...currentModul,
                      asesmen: { ...currentModul.asesmen, kktp: e.target.value }
                    })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-xs mb-1">Rubrik Penilaian Berjenjang:</label>
                  <textarea
                    rows={4}
                    value={currentModul.asesmen.rubrikNilai}
                    onChange={(e) => setCurrentModul({
                      ...currentModul,
                      asesmen: { ...currentModul.asesmen, rubrikNilai: e.target.value }
                    })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs leading-relaxed"
                  />
                </div>
              </div>
            )}

            {activeCanvasSection === 'lampiran' && (
              <div className="space-y-4">
                <div>
                  <label className="block font-bold text-xs mb-1">Lembar Kerja Peserta Didik (LKPD):</label>
                  <textarea
                    rows={4}
                    value={currentModul.lampiran.lkpd}
                    onChange={(e) => setCurrentModul({
                      ...currentModul,
                      lampiran: { ...currentModul.lampiran, lkpd: e.target.value }
                    })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block font-bold text-xs mb-1">Glosarium & Daftar Pustaka:</label>
                  <textarea
                    rows={3}
                    value={`${currentModul.lampiran.glosarium}\n\n${currentModul.lampiran.daftarPustaka}`}
                    onChange={(e) => setCurrentModul({
                      ...currentModul,
                      lampiran: { ...currentModul.lampiran, glosarium: e.target.value }
                    })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
