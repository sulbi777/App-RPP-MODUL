import React, { useState, useEffect } from 'react';
import { 
  X, 
  Monitor, 
  Download, 
  CheckCircle2, 
  Laptop, 
  Terminal, 
  Cpu, 
  ExternalLink, 
  Sparkles,
  ShieldCheck,
  Folder
} from 'lucide-react';

interface WindowsInstallerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WindowsInstallerModal: React.FC<WindowsInstallerModalProps> = ({ isOpen, onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'pwa' | 'bat_script' | 'electron'>('pwa');

  useEffect(() => {
    // Listen for PWA installation prompt event on Windows 10/11
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if app is already running as standalone PWA
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  if (!isOpen) return null;

  // Trigger PWA Installation
  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setInstallSuccess(true);
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      alert(
        'Petunjuk Instalasi Windows 10 / 11:\n\n' +
        '1. Buka aplikasi di Google Chrome atau Microsoft Edge.\n' +
        '2. Klik ikon (+) "Install App" di sebelah kanan bilah alamat (Address Bar) atau titik tiga menu > "Apps" > "Install SMAN 106 Jakarta".\n' +
        '3. Pintasan aplikasi akan otomatis muncul di Desktop & Menu Start Windows 10 / 11 Anda!'
      );
    }
  };

  // Generate & Download Windows .bat Launcher Script
  const handleDownloadWindowsBat = () => {
    const batContent = `@echo off
:: Script Pembuat Pintasan Desktop Windows 10 & 11 - SMAN 106 Jakarta
title Pembuat Pintasan Aplikasi SMAN 106 Jakarta (Windows 10/11)
color 0A

echo =========================================================
echo    SMAN 106 JAKARTA - GENERATOR MODUL AJAR & RPP
echo    Pemasang Pintasan Desktop Windows 10 / 11
echo =========================================================
echo.

set APP_URL=${window.location.href}
set DESKTOP_DIR=%USERPROFILE%\\Desktop
set SHORTCUT_NAME=SMAN 106 Jakarta - Modul Ajar.url

echo Membuat pintasan di Desktop (%DESKTOP_DIR%)...
(
  echo [InternetShortcut]
  echo URL=%APP_URL%
  echo IconIndex=0
  echo IconFile=%SystemRoot%\\System32\\shell32.dll
) > "%DESKTOP_DIR%\\%SHORTCUT_NAME%"

echo.
echo [BERHASIL] Pintasan Desktop SMAN 106 Jakarta berhasil dibuat!
echo Silakan buka file "%SHORTCUT_NAME%" di Desktop Windows Anda.
echo =========================================================
pause
`;

    const blob = new Blob([batContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Install_Pintasan_SMAN106_Windows.bat';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Generate Package Config for Electron Setup
  const handleDownloadElectronConfig = () => {
    const configData = {
      appId: "com.sman106.modulajar",
      productName: "SMAN 106 Jakarta - Modul Ajar App",
      version: "1.0.0",
      targetOS: "Windows 10 / 11 (64-bit)",
      instructions: "Jalankan 'npm run build:win' di terminal project untuk menghasilkan installer .exe resmi (NSIS Setup / Portable)."
    };

    const blob = new Blob([JSON.stringify(configData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'SMAN106_Windows_Electron_Config.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8 flex flex-col">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-inner">
              <Monitor className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base">Installer Aplikasi Windows 10 & 11</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold uppercase tracking-wider">
                  Win 10/11 Ready
                </span>
              </div>
              <p className="text-xs text-blue-200">SMAN 106 Jakarta — Modul Ajar & RPP Desktop Edition</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-2 gap-1.5">
          <button
            onClick={() => setActiveTab('pwa')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              activeTab === 'pwa'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Instalasi 1-Klik PWA</span>
          </button>

          <button
            onClick={() => setActiveTab('bat_script')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              activeTab === 'bat_script'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Pintasan Desktop (.bat)</span>
          </button>

          <button
            onClick={() => setActiveTab('electron')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              activeTab === 'electron'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>Paket Installer (.exe)</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 space-y-5 text-slate-800 dark:text-slate-200 text-sm">
          {activeTab === 'pwa' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 flex items-start gap-3">
                <Laptop className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <p className="font-bold text-blue-900 dark:text-blue-200">
                    Teknologi Progressive Windows App (PWA)
                  </p>
                  <p className="text-blue-800/80 dark:text-blue-300/80 leading-relaxed">
                    Aplikasi ini dirancang sesuai standar Microsoft PWA untuk <strong>Windows 10 & Windows 11</strong>. Setelah diinstal, aplikasi akan tampil di <strong>Start Menu</strong>, <strong>Taskbar</strong>, dan berjalan dalam jendela mandiri tanpa bilah browser!
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Dukungan Sistem Operasi:</span>
                  <span className="text-blue-600 dark:text-blue-400 font-bold">Windows 10 (64-bit) & Windows 11</span>
                </div>
                {isInstalled && (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Terinstal
                  </span>
                )}
              </div>

              {/* Install Trigger Button */}
              <button
                onClick={handleInstallPWA}
                className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-lg shadow-blue-600/25 transition flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Instal Ke Windows 10 / 11 Sekarang</span>
              </button>

              {/* Manual Guide */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                <p className="font-bold text-slate-700 dark:text-slate-300">
                  💡 Cara Manual Menginstal di Microsoft Edge / Chrome (Windows 10/11):
                </p>
                <ol className="list-decimal list-inside space-y-1 text-slate-600 dark:text-slate-400">
                  <li>Lihat bagian kanan bilah alamat (Address Bar) browser Edge / Chrome Anda.</li>
                  <li>Klik ikon <strong>(+) Install App / Aplikasi</strong> atau menu titik tiga &gt; <strong>Aplikasi</strong>.</li>
                  <li>Klik <strong>Instal</strong>. Aplikasi akan otomatis tersedia di Desktop & Start Menu Windows!</li>
                </ol>
              </div>
            </div>
          )}

          {activeTab === 'bat_script' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-wide text-blue-800 dark:text-blue-400 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-blue-600" />
                  Pemasang Script Pintasan Desktop (.bat)
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Unduh berkas instalasi otomatis `.bat` untuk membuat icon pintasan aplikasi SMAN 106 Jakarta secara langsung di layar **Desktop Windows 10 & Windows 11** Anda.
                </p>
              </div>

              <div className="bg-slate-900 text-emerald-400 p-3.5 rounded-xl font-mono text-[11px] overflow-x-auto border border-slate-800">
                <code>
                  Install_Pintasan_SMAN106_Windows.bat &gt; Klik Kanan &gt; Run as Administrator
                </code>
              </div>

              <button
                onClick={handleDownloadWindowsBat}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Unduh Script Pintasan Windows (.bat)</span>
              </button>
            </div>
          )}

          {activeTab === 'electron' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-wide text-blue-800 dark:text-blue-400 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-blue-600" />
                  Konfigurasi Package Electron Windows Installer (.exe / NSIS)
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Aplikasi telah dilengkapi berkas konfigurasi **Electron Builder** (`electron/main.js` & `package.json`). Tim IT SMAN 106 Jakarta dapat membundel aplikasi ini menjadi installer `.exe` / `.msi` offline kapan saja!
                </p>
              </div>

              <div className="p-3.5 bg-slate-900 text-slate-200 rounded-xl font-mono text-[11px] space-y-1.5 border border-slate-800">
                <p className="text-slate-400">// Perintah Build Installer Windows 10/11:</p>
                <p className="text-emerald-400">npm run build:win</p>
                <p className="text-slate-400">// Hasil output di folder /dist_electron/SMAN106_Setup_Win10_11.exe</p>
              </div>

              <button
                onClick={handleDownloadElectronConfig}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-sm"
              >
                <Folder className="w-4 h-4" />
                <span>Unduh Berkas Konfigurasi Electron Installer (.json)</span>
              </button>
            </div>
          )}

          {/* Success Banner */}
          {installSuccess && (
            <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 rounded-xl flex items-center gap-2 text-emerald-900 dark:text-emerald-200 text-xs font-bold">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Aplikasi SMAN 106 Jakarta berhasil terpasang di Windows 10 / 11 Anda!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
