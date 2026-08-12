import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  FileCheck, 
  CloudCheck, 
  Download, 
  Sparkles,
  PieChart as PieIcon,
  Layers
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { AnalyticsSummary } from '../types';
import jsPDF from 'jspdf';

interface AnalyticsViewProps {
  analytics: AnalyticsSummary;
}

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899'];

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ analytics }) => {
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.setTextColor(16, 185, 129); // emerald-600
    doc.text('SMAN 106 JAKARTA - LAPORAN RINGKASAN AKTIVITAS RPP', 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    doc.text(`Tanggal Cetak: ${new Date().toLocaleDateString('id-ID')}`, 14, 28);
    doc.text(`Total Modul Dibuat: ${analytics.totalModul} Modul`, 14, 36);
    doc.text(`Modul Disetujui Kepala Sekolah: ${analytics.approvedModul} Modul`, 14, 44);
    doc.text(`Modul Menunggu Review: ${analytics.pendingReviewModul} Modul`, 14, 52);
    doc.text(`Tingkat Keberhasilan Sync Cloud GDrive: ${analytics.syncSuccessRate}%`, 14, 60);

    doc.text('Distribusi Model Pembelajaran Kurikulum Merdeka:', 14, 72);
    analytics.modelDistribution.forEach((m, idx) => {
      doc.text(`- ${m.name}: ${m.value} Modul`, 20, 80 + idx * 8);
    });

    doc.save('Laporan_Aktivitas_RPP_SMAN106.pdf');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Banner & Export */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            Dasbor Analitik & Stabilitas Kurikulum SMAN 106
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Ringkasan statistik harian, tingkat ketercapaian modul per mapel, dan analisis model pembelajaran
          </p>
        </div>

        <button
          onClick={handleExportPDF}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition"
        >
          <Download className="w-4 h-4" />
          <span>Ekspor Laporan PDF</span>
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase">Total Modul Ajar</span>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{analytics.totalModul}</p>
            <span className="text-[10px] text-emerald-600 font-semibold">100% Tercatat</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
            <FileCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase">Disetujui Kepala Sekolah</span>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{analytics.approvedModul}</p>
            <span className="text-[10px] text-slate-500">Telah Bertanda Tangan Digital</span>
          </div>
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase">Guru Pendidik Aktif</span>
            <p className="text-2xl font-bold text-purple-600 mt-1">{analytics.activeTeachers}</p>
            <span className="text-[10px] text-slate-500">SMAN 106 Jakarta</span>
          </div>
          <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase">Akurasi Sync GDrive</span>
            <p className="text-2xl font-bold text-amber-600 mt-1">{analytics.syncSuccessRate}%</p>
            <span className="text-[10px] text-emerald-600 font-semibold">Terenkripsi E2EE</span>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600">
            <CloudCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Recharts Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Daily Production Area Chart (8 cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            Grafik Aktivitas Harian Pembuatan & Persetujuan Modul Ajar
          </h3>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.dailyCreatedStats}>
                <defs>
                  <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorApproved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip />
                <Area type="monotone" dataKey="created" stroke="#10b981" fillOpacity={1} fill="url(#colorCreated)" name="Modul Dibuat" />
                <Area type="monotone" dataKey="approved" stroke="#3b82f6" fillOpacity={1} fill="url(#colorApproved)" name="Modul Disetujui" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Model Pembelajaran Pie Chart (4 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-indigo-600" />
            Distribusi Model Pembelajaran
          </h3>

          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.modelDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {analytics.modelDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1 text-[11px]">
            {analytics.modelDistribution.map((m, idx) => (
              <div key={idx} className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1.5 truncate">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span className="truncate">{m.name}</span>
                </span>
                <span className="font-bold text-slate-900 dark:text-white">{m.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
