import React from 'react';
import { 
  Sparkles, 
  FileText, 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  ShieldCheck, 
  Cloud, 
  CloudOff, 
  Bell, 
  UserCheck, 
  Moon, 
  Sun,
  Award,
  CloudUpload,
  Monitor
} from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  allUsers: UserProfile[];
  unreadNotifCount: number;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  onOpenDriveModal: () => void;
  onOpenWindowsInstaller?: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  isOnline: boolean;
  syncing: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  setCurrentUser,
  allUsers,
  unreadNotifCount,
  onOpenNotifications,
  onOpenProfile,
  onOpenDriveModal,
  onOpenWindowsInstaller,
  darkMode,
  setDarkMode,
  isOnline,
  syncing,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-slate-200 dark:border-slate-800 transition-colors">
      {/* Top Identity Banner */}
      <div className="bg-slate-900 text-slate-200 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="font-bold tracking-wider uppercase flex items-center gap-1.5 text-blue-400 text-[11px]">
            <Award className="w-3.5 h-3.5 text-blue-400" /> SMAN 106 JAKARTA
          </span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:inline text-slate-300 text-[11px]">
            Dinas Pendidikan Provinsi DKI Jakarta — NPSN: 20103289 (Akreditasi A)
          </span>
        </div>
        
        <div className="flex items-center gap-3 text-[11px]">
          <div className="flex items-center gap-1.5 bg-slate-800 px-2.5 py-0.5 rounded-md text-slate-300 border border-slate-700/60">
            <ShieldCheck className="w-3 h-3 text-blue-400" />
            <span className="font-medium text-[10px] uppercase tracking-wide">E2EE Enkripsi Active (AES-256)</span>
          </div>

          <div className="flex items-center gap-1.5">
            {isOnline ? (
              <span className="flex items-center gap-1 text-blue-400 font-medium text-[11px]">
                <Cloud className={`w-3 h-3 ${syncing ? 'animate-pulse text-amber-400' : ''}`} />
                {syncing ? 'Menyingkronkan...' : 'GDrive Secure Active'}
              </span>
            ) : (
              <span className="flex items-center gap-1 text-amber-400 font-medium text-[11px]">
                <CloudOff className="w-3 h-3" />
                <span>Mode Offline</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-500/20">
            106
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-slate-900 dark:text-white text-base leading-tight tracking-tight">
                SMAN 106
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                Jakarta Portal
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Generator & Canvas Modul Ajar
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700 overflow-x-auto max-w-full">
          <button
            id="nav-tab-canvas"
            onClick={() => setActiveTab('canvas')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'canvas'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-slate-700/60 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>RPP Canvas</span>
          </button>

          <button
            id="nav-tab-repository"
            onClick={() => setActiveTab('repository')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'repository'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-slate-700/60 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Modul Ajar</span>
          </button>

          <button
            id="nav-tab-headmaster"
            onClick={() => setActiveTab('headmaster')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'headmaster'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-slate-700/60 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Pantauan Kepsek</span>
          </button>

          <button
            id="nav-tab-collaboration"
            onClick={() => setActiveTab('collaboration')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'collaboration'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-slate-700/60 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>MGMP Kolaborasi</span>
          </button>

          <button
            id="nav-tab-analytics"
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'analytics'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-slate-700/60 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Analitik</span>
          </button>
        </nav>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2">
          {/* Windows 10 / 11 Installer Button */}
          {onOpenWindowsInstaller && (
            <button
              id="btn-install-win10-11"
              onClick={onOpenWindowsInstaller}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs transition shadow-sm border border-blue-400/30"
              title="Instal Aplikasi ke Windows 10 & 11 (Desktop & Start Menu)"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Install App Win 10/11</span>
            </button>
          )}

          {/* Simpan Aplikasi & GDrive Button */}
          <button
            id="btn-save-gdrive-modal"
            onClick={onOpenDriveModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-sm"
            title="Simpan Hasil ke Google Drive & Cadangkan Aplikasi"
          >
            <CloudUpload className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Simpan ke GDrive</span>
          </button>

          {/* User Role Switcher Dropdown */}
          <div className="relative group">
            <div className="flex items-center gap-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 transition cursor-pointer text-xs">
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                {currentUser.nama.charAt(0)}
              </div>
              <div className="text-left hidden sm:block">
                <p className="font-bold text-slate-900 dark:text-slate-100 text-xs leading-none truncate max-w-[130px]">
                  {currentUser.nama}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-tight mt-0.5">
                  {currentUser.role === 'kepala_sekolah' ? 'Kepala Sekolah' : currentUser.mataPelajaran}
                </p>
              </div>
            </div>

            {/* Switch User Flyout */}
            <div className="absolute right-0 top-full mt-1.5 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 hidden group-hover:block z-50">
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2.5 py-1.5">
                Ganti Akun Pengguna
              </p>
              {allUsers.map((usr) => (
                <button
                  key={usr.id}
                  onClick={() => setCurrentUser(usr)}
                  className={`w-full text-left p-2 rounded-xl text-xs flex items-center justify-between transition ${
                    usr.id === currentUser.id
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="truncate">
                    <p className="truncate font-semibold">{usr.nama}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">
                      {usr.role === 'kepala_sekolah' ? 'Kepala Sekolah' : usr.mataPelajaran}
                    </p>
                  </div>
                  {usr.id === currentUser.id && <UserCheck className="w-4 h-4 text-blue-600" />}
                </button>
              ))}
              <div className="border-t border-slate-100 dark:border-slate-800 mt-1 pt-1">
                <button
                  onClick={onOpenProfile}
                  className="w-full text-left px-2.5 py-1.5 rounded-xl text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
                >
                  Kelola Profil & NIP Saya
                </button>
              </div>
            </div>
          </div>

          {/* Notifications Button */}
          <button
            id="btn-notifications-drawer"
            onClick={onOpenNotifications}
            className="relative p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition"
            title="Notifikasi Real-time"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
                {unreadNotifCount}
              </span>
            )}
          </button>

          {/* Dark Mode Toggle */}
          <button
            id="btn-darkmode-toggle"
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-600" />}
          </button>
        </div>
      </div>
    </header>
  );
};
