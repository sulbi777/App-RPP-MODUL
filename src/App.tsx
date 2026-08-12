import React, { useState, useEffect } from 'react';
import { 
  INITIAL_HEADMASTER, 
  INITIAL_TEACHERS, 
  INITIAL_MODUL_LIST, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_MGMP_POSTS, 
  MOCK_BUG_LOGS, 
  INITIAL_ANALYTICS 
} from './data/mockData';
import { ModulAjar, UserProfile, NotificationItem, MgmpForumPost, BugReportLog, AnalyticsSummary } from './types';
import { Navbar } from './components/Navbar';
import { GeminiCanvas } from './components/GeminiCanvas';
import { RepositoryView } from './components/RepositoryView';
import { HeadmasterDashboard } from './components/HeadmasterDashboard';
import { CollaborationHub } from './components/CollaborationHub';
import { AnalyticsView } from './components/AnalyticsView';
import { NotificationDrawer } from './components/NotificationDrawer';
import { ProfileModal } from './components/ProfileModal';
import { DocExportPreviewModal } from './components/DocExportPreviewModal';
import { DriveModal } from './components/DriveModal';
import { WindowsInstallerModal } from './components/WindowsInstallerModal';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<string>('canvas');

  // Dark Mode State
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Sync dark class on root document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Online / Offline State
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [syncing, setSyncing] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Users State
  const allUsers: UserProfile[] = [INITIAL_HEADMASTER, ...INITIAL_TEACHERS];
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_TEACHERS[0]);

  // Modules List State (persisted to localStorage)
  const [modulList, setModulList] = useState<ModulAjar[]>(() => {
    const saved = localStorage.getItem('sman106_modul_list');
    return saved ? JSON.parse(saved) : INITIAL_MODUL_LIST;
  });

  useEffect(() => {
    localStorage.setItem('sman106_modul_list', JSON.stringify(modulList));
  }, [modulList]);

  // Active Modul for Canvas Editor
  const [currentModul, setCurrentModul] = useState<ModulAjar>(modulList[0] || INITIAL_MODUL_LIST[0]);

  // Forum Posts State
  const [posts, setPosts] = useState<MgmpForumPost[]>(INITIAL_MGMP_POSTS);

  // Notifications State
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const unreadNotifCount = notifications.filter(n => !n.read).length;

  // Bug Logs & Analytics State
  const [bugLogs] = useState<BugReportLog[]>(MOCK_BUG_LOGS);
  const [analytics] = useState<AnalyticsSummary>(INITIAL_ANALYTICS);

  // Modals & Drawers
  const [isNotifDrawerOpen, setIsNotifDrawerOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isDocExportModalOpen, setIsDocExportModalOpen] = useState(false);
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);
  const [isWindowsInstallerOpen, setIsWindowsInstallerOpen] = useState(false);
  const [exportTargetModul, setExportTargetModul] = useState<ModulAjar>(currentModul);

  const handleImportBackup = (imported: any) => {
    if (imported.moduls && Array.isArray(imported.moduls)) {
      setModulList(imported.moduls);
      if (imported.moduls.length > 0) {
        setCurrentModul(imported.moduls[0]);
      }
    } else if (imported.data && imported.data.moduls) {
      setModulList(imported.data.moduls);
      if (imported.data.moduls.length > 0) {
        setCurrentModul(imported.data.moduls[0]);
      }
    }
  };

  // Handlers for Module Modifications
  const handleSaveModul = async (savedModul: ModulAjar) => {
    setSyncing(true);
    
    // Update locally
    setModulList(prev => {
      const exists = prev.some(m => m.id === savedModul.id);
      if (exists) {
        return prev.map(m => m.id === savedModul.id ? savedModul : m);
      } else {
        return [savedModul, ...prev];
      }
    });

    // Simulate E2EE Google Drive Sync API call
    try {
      await fetch('/api/drive/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modulId: savedModul.id, title: savedModul.judul })
      });
    } catch (err) {
      console.log('GDrive offline sync queued locally');
    } finally {
      setTimeout(() => setSyncing(false), 800);
    }
  };

  const handleDeleteModul = (id: string) => {
    setModulList(prev => prev.filter(m => m.id !== id));
  };

  const handleDuplicateModul = (modul: ModulAjar) => {
    const duplicated: ModulAjar = {
      ...modul,
      id: `mod_106_${Date.now()}`,
      judul: `${modul.judul} (Salinan)`,
      status: 'Draft',
      tanggalDibuat: new Date().toISOString().split('T')[0],
      terakhirDiubah: new Date().toISOString().split('T')[0],
      versi: 1
    };
    setModulList(prev => [duplicated, ...prev]);
  };

  const handleSubmitForApproval = (modulId: string) => {
    setModulList(prev => prev.map(m => {
      if (m.id === modulId) {
        return { ...m, status: 'Menunggu Review' };
      }
      return m;
    }));

    // Add notification
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: 'Pengajuan Modul Ajar Baru',
      message: `${currentUser.nama} telah mengajukan modul ajar untuk ditinjau Kepala Sekolah.`,
      timestamp: 'Baru saja',
      read: false,
      type: 'approval',
      linkId: modulId
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleApproveModul = (modulId: string, catatan: string) => {
    setModulList(prev => prev.map(m => {
      if (m.id === modulId) {
        return {
          ...m,
          status: 'Disetujui',
          catatanKepalaSekolah: catatan,
          terakhirDiubah: new Date().toISOString().split('T')[0]
        };
      }
      return m;
    }));

    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: 'Modul Ajar Disetujui!',
      message: `Kepala Sekolah Dra. Hj. Sri Rahayu, M.Pd telah menyetujui modul ajar Anda.`,
      timestamp: 'Baru saja',
      read: false,
      type: 'approval',
      linkId: modulId
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleRejectModul = (modulId: string, catatan: string) => {
    setModulList(prev => prev.map(m => {
      if (m.id === modulId) {
        return {
          ...m,
          status: 'Perlu Perbaikan',
          catatanKepalaSekolah: catatan,
          terakhirDiubah: new Date().toISOString().split('T')[0]
        };
      }
      return m;
    }));
  };

  const handleCreateNewModul = () => {
    const newBlank: ModulAjar = {
      id: `mod_106_${Date.now()}`,
      judul: 'Modul Ajar Baru SMAN 106 Jakarta',
      mataPelajaran: currentUser.mataPelajaran || 'Matematika',
      kelas: 'X',
      fase: 'E',
      semester: 'Ganjil',
      alokasiWaktu: '4 JP (2 x Pertemuan)',
      penyusun: currentUser.nama,
      nipPenyusun: currentUser.nip,
      sekolah: 'SMAN 106 Jakarta',
      tahunAjaran: '2025/2026',
      capaianPembelajaran: 'Tuliskan Capaian Pembelajaran (CP)...',
      tujuanPembelajaran: ['Tujuan Pembelajaran 1', 'Tujuan Pembelajaran 2'],
      alurTujuanPembelajaran: 'Alur TP...',
      profilPancasila: {
        berimanBertaqwa: true,
        berkebinekaanGlobal: false,
        gotongRoyong: true,
        mandiri: true,
        bernalarKritis: true,
        kreatif: true
      },
      pemahamanBermakna: 'Tuliskan pemahaman bermakna...',
      pertanyaanPemantik: ['Pertanyaan Pemantik 1?', 'Pertanyaan Pemantik 2?'],
      saranaPrasarana: 'Chromebook SMAN 106, Proyektor, LKPD',
      targetPesertaDidik: 'Peserta Didik Reguler',
      modelPembelajaran: 'Problem Based Learning (PBL)',
      strategiDiferensiasi: {
        konten: 'Diferensiasi konten...',
        proses: 'Diferensiasi proses...',
        produk: 'Diferensiasi produk...'
      },
      kegiatanPembelajaran: [
        {
          pertemuanKe: 1,
          alokasiWaktu: '2 x 45 Menit',
          pendahuluan: ['Salam, doa, apersepsi.'],
          kegiatanInti: [
            {
              langkahModel: 'Orientasi Masalah',
              aktivitasGuru: 'Menyajikan masalah.',
              aktivitasSiswa: 'Mengamati dan mendiskusikan.'
            }
          ],
          penutup: ['Kesimpulan dan doa.']
        }
      ],
      asesmen: {
        diagnostik: 'Kuis singkat.',
        formatif: 'Observasi keaktifan.',
        sumatif: 'Tes tertulis.',
        kktp: 'KKTP minimal 75.',
        rubrikNilai: 'Rubrik berjenjang.'
      },
      lampiran: {
        lkpd: 'LKPD Siswa...',
        bahanBacaan: 'Buku teks utama.',
        glosarium: 'Glosarium istilah.',
        daftarPustaka: 'Kemendikbudristek 2022.'
      },
      status: 'Draft',
      tanggalDibuat: new Date().toISOString().split('T')[0],
      terakhirDiubah: new Date().toISOString().split('T')[0],
      versi: 1,
      syncedToDrive: true
    };

    setCurrentModul(newBlank);
    setActiveTab('canvas');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-[#1E293B] dark:text-slate-100 flex flex-col font-sans transition-colors selection:bg-blue-600 selection:text-white">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        allUsers={allUsers}
        unreadNotifCount={unreadNotifCount}
        onOpenNotifications={() => setIsNotifDrawerOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenDriveModal={() => setIsDriveModalOpen(true)}
        onOpenWindowsInstaller={() => setIsWindowsInstallerOpen(true)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        isOnline={isOnline}
        syncing={syncing}
      />

      {/* Main Dynamic View Content */}
      <main className="flex-1">
        {activeTab === 'canvas' && (
          <GeminiCanvas
            currentModul={currentModul}
            setCurrentModul={setCurrentModul}
            onSaveModul={handleSaveModul}
            onOpenDocExport={(mod) => {
              setExportTargetModul(mod);
              setIsDocExportModalOpen(true);
            }}
            onOpenDriveModal={() => setIsDriveModalOpen(true)}
            currentUser={currentUser}
          />
        )}

        {activeTab === 'repository' && (
          <RepositoryView
            modulList={modulList}
            onSelectModulForEdit={(mod) => {
              setCurrentModul(mod);
              setActiveTab('canvas');
            }}
            onOpenDocExport={(mod) => {
              setExportTargetModul(mod);
              setIsDocExportModalOpen(true);
            }}
            onDeleteModul={handleDeleteModul}
            onDuplicateModul={handleDuplicateModul}
            onSubmitForApproval={handleSubmitForApproval}
            currentUser={currentUser}
            onCreateNew={handleCreateNewModul}
          />
        )}

        {activeTab === 'headmaster' && (
          <HeadmasterDashboard
            modulList={modulList}
            onApproveModul={handleApproveModul}
            onRejectModul={handleRejectModul}
            bugLogs={bugLogs}
            headmasterProfile={INITIAL_HEADMASTER}
            onOpenDocExport={(mod) => {
              setExportTargetModul(mod);
              setIsDocExportModalOpen(true);
            }}
          />
        )}

        {activeTab === 'collaboration' && (
          <CollaborationHub
            posts={posts}
            onAddPost={(newP) => setPosts([newP, ...posts])}
            currentUser={currentUser}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView analytics={analytics} />
        )}
      </main>

      {/* Drawers & Modals */}
      <NotificationDrawer
        isOpen={isNotifDrawerOpen}
        onClose={() => setIsNotifDrawerOpen(false)}
        notifications={notifications}
        onMarkAllRead={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentUser={currentUser}
        onSaveProfile={(updated) => setCurrentUser(updated)}
      />

      <DocExportPreviewModal
        isOpen={isDocExportModalOpen}
        onClose={() => setIsDocExportModalOpen(false)}
        modul={exportTargetModul}
        onOpenDriveModal={() => setIsDriveModalOpen(true)}
      />

      <DriveModal
        isOpen={isDriveModalOpen}
        onClose={() => setIsDriveModalOpen(false)}
        activeModul={currentModul}
        allModuls={modulList}
        onImportBackup={handleImportBackup}
      />

      <WindowsInstallerModal
        isOpen={isWindowsInstallerOpen}
        onClose={() => setIsWindowsInstallerOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-4 text-center text-xs text-slate-500 dark:text-slate-400">
        <p className="font-semibold text-slate-700 dark:text-slate-300">
          Canvas RPP & Modul Ajar Kurikulum Merdeka — SMAN 106 Jakarta
        </p>
        <p className="text-[10px] mt-0.5 text-slate-400">
          Jl. Gandaria I No. 32, Pekayon, Pasar Rebo, Jakarta Timur • Terhubung ke Gemini AI & Google Drive SMAN 106
        </p>
      </footer>
    </div>
  );
}
