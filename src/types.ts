export type Role = 'guru' | 'kepala_sekolah' | 'tim_kurikulum';

export type FaseKurikulum = 'E' | 'F';
export type KelasSMA = 'X' | 'XI' | 'XII';
export type Semester = 'Ganjil' | 'Genap';

export type ModelPembelajaran = 
  | 'Problem Based Learning (PBL)'
  | 'Project Based Learning (PjBL)'
  | 'STEM (Science, Tech, Engineering, Math)'
  | 'Discovery Learning'
  | 'Inquiry Learning'
  | 'Cooperative Learning'
  | 'Deep Learning'
  | 'Differentiated Learning';

export type StatusApproval = 'Draft' | 'Menunggu Review' | 'Disetujui' | 'Perlu Perbaikan';

export type TemplateRPPKemendikdasmen =
  | 'Kemendikdasmen Lengkap (Modul Ajar Komponen Utuh)'
  | 'Kemendikdasmen Sederhana (Format Ringkas 3 Komponen)'
  | 'Kemendikdasmen Deep Learning (Mindful, Meaningful, Joyful)'
  | 'Kemendikdasmen P5 & STEM Interdisipliner';

export interface ProfilPelajarPancasila {
  berimanBertaqwa: boolean;
  berkebinekaanGlobal: boolean;
  gotongRoyong: boolean;
  mandiri: boolean;
  bernalarKritis: boolean;
  kreatif: boolean;
}

export interface KegiatanPertemuan {
  pertemuanKe: number;
  alokasiWaktu: string;
  pendahuluan: string[];
  kegiatanInti: {
    langkahModel: string;
    aktivitasGuru: string;
    aktivitasSiswa: string;
    diferensiasi?: string;
  }[];
  penutup: string[];
}

export interface ModulAjar {
  id: string;
  judul: string;
  mataPelajaran: string;
  kelas: KelasSMA;
  fase: FaseKurikulum;
  semester: Semester;
  alokasiWaktu: string;
  penyusun: string;
  nipPenyusun: string;
  kepalaSekolah?: string;
  nipKepalaSekolah?: string;
  sekolah: string; // SMAN 106 Jakarta
  tahunAjaran: string;
  
  // Elemen Kurikulum Merdeka
  capaianPembelajaran: string;
  tujuanPembelajaran: string[];
  alurTujuanPembelajaran: string;
  profilPancasila: ProfilPelajarPancasila;
  pemahamanBermakna: string;
  pertanyaanPemantik: string[];
  saranaPrasarana: string;
  targetPesertaDidik: string;
  modelPembelajaran: ModelPembelajaran;
  
  // Strategi & Kegiatan
  strategiDiferensiasi: {
    konten: string;
    proses: string;
    produk: string;
  };
  kegiatanPembelajaran: KegiatanPertemuan[];
  
  // Asesmen & Evaluation
  asesmen: {
    diagnostik: string;
    formatif: string;
    sumatif: string;
    kktp: string; // Kriteria Ketercapaian Tujuan Pembelajaran
    rubrikNilai: string;
  };
  
  // Lampiran
  lampiran: {
    lkpd: string; // Lembar Kerja Peserta Didik
    bahanBacaan: string;
    glosarium: string;
    daftarPustaka: string;
  };

  // Status & Metadata
  status: StatusApproval;
  templateRPP?: TemplateRPPKemendikdasmen;
  catatanKepalaSekolah?: string;
  tanggalDibuat: string;
  terakhirDiubah: string;
  versi: number;
  syncedToDrive: boolean;
  driveFileId?: string;
}

export interface UserProfile {
  id: string;
  nama: string;
  nip: string;
  email: string;
  role: Role;
  mataPelajaran: string;
  pangkatGolongan: string;
  jabatan: string;
  tandaTanganUrl?: string;
}

export interface CommentItem {
  id: string;
  modulId: string;
  authorNama: string;
  authorRole: string;
  avatarText: string;
  content: string;
  timestamp: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'approval' | 'comment' | 'system' | 'sync';
  linkId?: string;
}

export interface MgmpForumPost {
  id: string;
  authorName: string;
  authorSubject: string;
  title: string;
  content: string;
  timestamp: string;
  likes: number;
  commentsCount: number;
  tags: string[];
}

export interface BugReportLog {
  id: string;
  timestamp: string;
  component: string;
  severity: 'low' | 'medium' | 'high';
  message: string;
  status: 'resolved' | 'monitoring' | 'open';
}

export interface AnalyticsSummary {
  totalModul: number;
  approvedModul: number;
  pendingReviewModul: number;
  activeTeachers: number;
  syncSuccessRate: number;
  dailyCreatedStats: { date: string; created: number; approved: number }[];
  modelDistribution: { name: string; value: number }[];
  subjectCoverage: { subject: string; percentage: number }[];
}
