import { ModulAjar, UserProfile, NotificationItem, MgmpForumPost, BugReportLog, AnalyticsSummary } from '../types';

export const INITIAL_HEADMASTER: UserProfile = {
  id: 'usr_kepsek',
  nama: 'Dra. Hj. Sri Rahayu, M.Pd',
  nip: '196804121994032001',
  email: 'sri.rahayu@sman106jkt.sch.id',
  role: 'kepala_sekolah',
  mataPelajaran: 'Manajemen Pendidikan',
  pangkatGolongan: 'Pembina Utama Muda / IV c',
  jabatan: 'Kepala SMAN 106 Jakarta',
};

export const INITIAL_TEACHERS: UserProfile[] = [
  {
    id: 'usr_01',
    nama: 'Budi Santoso, M.Pd',
    nip: '197508152005011003',
    email: 'budi.santoso@sman106jkt.sch.id',
    role: 'guru',
    mataPelajaran: 'Matematika',
    pangkatGolongan: 'Penata Tk. I / III d',
    jabatan: 'Guru Ahli Madya / Ketua MGMP Matematika',
  },
  {
    id: 'usr_02',
    nama: 'Dr. Siti Nurhaliza, S.Si, M.Si',
    nip: '198203202008042002',
    email: 'siti.nurhaliza@sman106jkt.sch.id',
    role: 'guru',
    mataPelajaran: 'Fisika',
    pangkatGolongan: 'Penata / III c',
    jabatan: 'Guru Ahli Muda / Pembina KIR SMAN 106',
  },
  {
    id: 'usr_03',
    nama: 'Ahmad Fauzi, S.Pd',
    nip: '199001122019031008',
    email: 'ahmad.fauzi@sman106jkt.sch.id',
    role: 'guru',
    mataPelajaran: 'Bahasa Indonesia',
    pangkatGolongan: 'Penata Muda Tk. I / III b',
    jabatan: 'Guru Ahli Pertama / Tim Kurikulum Merdeka',
  },
  {
    id: 'usr_04',
    nama: 'Dewi Lestari, S.T, M.Kom',
    nip: '198711052014022001',
    email: 'dewi.lestari@sman106jkt.sch.id',
    role: 'guru',
    mataPelajaran: 'Informatika',
    pangkatGolongan: 'Penata / III c',
    jabatan: 'Guru Informatika / Kepala Lab Komputer SMAN 106',
  }
];

export const INITIAL_MODUL_LIST: ModulAjar[] = [
  {
    id: 'mod_106_01',
    judul: 'Modul Ajar Matematika - Persamaan dan Pertidaksamaan Eksponen',
    mataPelajaran: 'Matematika',
    kelas: 'X',
    fase: 'E',
    semester: 'Ganjil',
    alokasiWaktu: '4 JP (2 x Pertemuan)',
    penyusun: 'Budi Santoso, M.Pd',
    nipPenyusun: '197508152005011003',
    kepalaSekolah: 'Dra. Hj. Sri Rahayu, M.Pd',
    nipKepalaSekolah: '196804121994032001',
    sekolah: 'SMAN 106 Jakarta',
    tahunAjaran: '2025/2026',
    capaianPembelajaran: 'Di akhir fase E, peserta didik dapat menggeneralisasi sifat-sifat operasi bilangan berpangkat (eksponen) serta menggunakannya dalam menyelesaikan masalah nyata matematika.',
    tujuanPembelajaran: [
      'Peserta didik dapat mengidentifikasi bentuk fungsi dan grafik eksponen dengan benar.',
      'Peserta didik mampu menyelesaikan masalah kontekstual pertumbuhan dan peluruhan menggunakan konsep eksponen.',
      'Peserta didik dapat menganalisis sifat-sifat eksponen melalui diskusi kelompok terbimbing.'
    ],
    alurTujuanPembelajaran: 'Eksponen Dasar -> Fungsi Eksponen -> Model Pertumbuhan Kontekstual -> Evaluasi & Asesmen Sumatif',
    profilPancasila: {
      berimanBertaqwa: true,
      berkebinekaanGlobal: false,
      gotongRoyong: true,
      mandiri: true,
      bernalarKritis: true,
      kreatif: true,
    },
    pemahamanBermakna: 'Konsep eksponen digunakan secara luas dalam menghitung pertumbuhan penduduk DKI Jakarta, perhitungan bunga majemuk perbankan, dan estimasi peluruhan zat radioaktif.',
    pertanyaanPemantik: [
      'Bagaimana cara memprediksi jumlah penduduk Pasar Rebo Jakarta Timur dalam 10 tahun ke depan?',
      'Mengapa sifat perkalian eksponen $a^m \\times a^n = a^{m+n}$ berlaku?'
    ],
    saranaPrasarana: 'Proyektor Interactive Board, Chromebook SMAN 106, Geogebra App, LKPD Digital Google Drive',
    targetPesertaDidik: 'Peserta Didik Reguler/Tipikal (Kelas X SMAN 106 Jakarta, 36 Siswa)',
    modelPembelajaran: 'Problem Based Learning (PBL)',
    strategiDiferensiasi: {
      konten: 'Audio-visual tutorial YouTube Geogebra untuk gaya belajar visual; Lembar rumus taktis untuk gaya belajar kinestetik/pemula.',
      proses: 'Kelompok diskusi heterogen (saling tutor sebaya) didampingi pendampingan khusus guru bagi kelompok berdiferensiasi rendah.',
      produk: 'Siswa dapat memilih bentuk laporan tugas akhir: Slide Presentasi Canva, Video TikTok Edukasi, atau Infografis PDF.'
    },
    kegiatanPembelajaran: [
      {
        pertemuanKe: 1,
        alokasiWaktu: '2 x 45 Menit',
        pendahuluan: [
          'Guru membuka pembelajaran dengan salam, berdoa bersama, dan mengecek kehadiran siswa.',
          'Apersepsi: Guru mengaitkan konsep eksponen dengan fenomena perkembangan virus dan pertumbuhan investasi.',
          'Guru menyampaikan tujuan pembelajaran dan penilaian KKTP.'
        ],
        kegiatanInti: [
          {
            langkahModel: 'Orientasi Siswa Pada Masalah',
            aktivitasGuru: 'Menampilkan permasalahan nyata penataan populasi kota Jakarta di layar proyektor.',
            aktivitasSiswa: 'Mengamati stimulus dan mencatat pertanyaan kunci terkait pertumbuhan eksponensial.',
            diferensiasi: 'Siswa kelompok paham utuh menganalisis data kompleks; kelompok butuh bimbingan menggunakan LKPD terbimbing.'
          },
          {
            langkahModel: 'Mengorganisasi Siswa untuk Belajar',
            aktivitasGuru: 'Membagi kelas menjadi 6 kelompok heterogen dan membagikan LKPD Eksponen.',
            aktivitasSiswa: 'Berdiskusi dalam kelompok merumuskan hipotesis sifat eksponen.'
          },
          {
            langkahModel: 'Membimbing Penyelidikan Kelompok',
            aktivitasGuru: 'Mendatangi setiap kelompok, memberikan scaffolding bagi yang membutuhkan.',
            aktivitasSiswa: 'Mencoba formulasi matematis pada aplikasi Geogebra di Chromebook.'
          }
        ],
        penutup: [
          'Siswa bersama guru menyimpulkan sifat-sifat eksponen yang ditemukan.',
          'Guru memberikan refleksi pembelajaran via Google Forms.',
          'Menyampaikan rencana materi pertemuan ke-2.'
        ]
      }
    ],
    asesmen: {
      diagnostik: 'Kuis singkat 5 soal pilihan ganda via Kahoot sebelum materi dimulai untuk memetakan kesiapan belajar (Readiness).',
      formatif: 'Observasi keaktifan diskusi kelompok, penilaian ketaatan tenggat LKPD, dan kuis uji pemahaman di tengah sesion.',
      sumatif: 'Tes Tertulis Essay 3 soal studi kasus kontekstual pada akhir bab.',
      kktp: 'Tercapai jika siswa memperoleh nilai minimal 75 pada rubrik pemahaman konsep dan keterampilan penalaran kritis.',
      rubrikNilai: 'Skor 4: Sangat Mahir (Penalaran runtut & tanpa salah hitung). Skor 3: Mahir. Skor 2: Layak. Skor 1: Perlu Bimbingan.'
    },
    lampiran: {
      lkpd: 'LKPD-Eksponen-SMAN106-K10.pdf (Termasuk petunjuk eksperimen grafik Geogebra & soal tantangan HOTS)',
      bahanBacaan: 'Buku Teks Utama Matematika Kelas X Kurikulum Merdeka Kemendikbudristek & Modul Digital SMAN 106',
      glosarium: 'Eksponen, Basis, Anuitas, Pertumbuhan Eksponensial, Peluruhan, Logaritma.',
      daftarPustaka: 'Kemendikbudristek. 2022. Buku Siswa Matematika Kelas X. Jakarta: Pusat Kurikulum dan Perbukuan.'
    },
    status: 'Disetujui',
    catatanKepalaSekolah: 'Modul Ajar sangat lengkap, diferensiasi konten & produk tampak jelas. Sangat direkomendasikan jadi contoh di MGMP SMAN 106.',
    tanggalDibuat: '2026-08-01',
    terakhirDiubah: '2026-08-10',
    versi: 2,
    syncedToDrive: true,
    driveFileId: 'gdrive_106_mat_01'
  },
  {
    id: 'mod_106_02',
    judul: 'Modul Ajar Fisika - Gelombang Elektromagnetik & Penerapan Teknologi',
    mataPelajaran: 'Fisika',
    kelas: 'XI',
    fase: 'F',
    semester: 'Ganjil',
    alokasiWaktu: '6 JP (3 x Pertemuan)',
    penyusun: 'Dr. Siti Nurhaliza, S.Si, M.Si',
    nipPenyusun: '198203202008042002',
    sekolah: 'SMAN 106 Jakarta',
    tahunAjaran: '2025/2026',
    capaianPembelajaran: 'Pada akhir fase F, peserta didik mampu menerapkan konsep gelombang elektromagnetik dalam menjelaskan fenomena teknologi transmisi data tanpa kabel (Wi-Fi, 5G, Remote Sensing).',
    tujuanPembelajaran: [
      'Peserta didik mampu mengklasifikasikan spektrum gelombang elektromagnetik berdasarkan frekuensi dan panjang gelombang.',
      'Peserta didik mampu merancang miniatur pemancar/penerima gelombang sederhana melalui metode PjBL.'
    ],
    alurTujuanPembelajaran: 'Spektrum GEM -> Bahaya & Manfaat Radiasi -> Proyek Sederhana Antena/Sensor -> Pameran Hasil Karya',
    profilPancasila: {
      berimanBertaqwa: true,
      berkebinekaanGlobal: false,
      gotongRoyong: true,
      mandiri: true,
      bernalarKritis: true,
      kreatif: true,
    },
    pemahamanBermakna: 'Memahami bahwa sinyal seluler dan Wi-Fi yang setiap hari digunakan siswa SMAN 106 adalah contoh nyata radiasi gelombang elektromagnetik non-ionisasi.',
    pertanyaanPemantik: [
      'Mengapa ponsel kita bisa menerima sinyal internet tanpa kabel terhubung?',
      'Apakah sinar ultraviolet dari matahari sama jenisnya dengan gelombang radio?'
    ],
    saranaPrasarana: 'Kit Eksperimen Fisika SMAN 106, Oscilloscope Digital, Sensor Radiasi UV, Laptop/Chromebook',
    targetPesertaDidik: 'Peserta Didik Peminatan MIPA Kelas XI SMAN 106 Jakarta (34 Siswa)',
    modelPembelajaran: 'Project Based Learning (PjBL)',
    strategiDiferensiasi: {
      konten: 'Menyediakan infografis spektrum gelombang, simulasi PhET Interactive, dan artikel jurnal ilmiah terpopuler.',
      proses: 'Siswa memilih jenis proyek: Pembuatan Sangkar Faraday, Radio Kristal Sederhana, atau Analisis Dampak Radiasi HP.',
      produk: 'Laporan berbentuk Prototype Alat + Video Dokumentasi Pembuatan.'
    },
    kegiatanPembelajaran: [
      {
        pertemuanKe: 1,
        alokasiWaktu: '2 x 45 Menit',
        pendahuluan: [
          'Guru memberi salam dan melakukan ice breaking kesiapan belajar.',
          'Mendemonstrasikan hilangnya sinyal HP saat dibungkus aluminium foil (Sangkar Faraday).'
        ],
        kegiatanInti: [
          {
            langkahModel: 'Pertanyaan Mendasar PjBL',
            aktivitasGuru: 'Mengajukan tantangan: "Bagaimana cara memblokir sinyal tertentu untuk keamanan data?"',
            aktivitasSiswa: 'Siswa menyampaikan gagasan dan mengajukan hipotesis dasar.'
          }
        ],
        penutup: [
          'Menyepakati jadwal proyek dan pembagian peran anggota tim.'
        ]
      }
    ],
    asesmen: {
      diagnostik: 'Tes Awal Kemampuan Gelombang Mekanik via Google Forms.',
      formatif: 'Penilaian Jurnal Kemajuan Proyek Mingguan & Rubrik Diskusi Kelompok.',
      sumatif: 'Penilaian Produk Alat / Prototype & Presentasi Karya PjBL.',
      kktp: 'Minimal 78 dengan komponen fungsionalitas produk dan penguasaan teori.',
      rubrikNilai: 'Sangat Baik (Alat bekerja 100% + Analisis Ilmiah Tajam), Baik, Cukup, Perlu Bimbingan.'
    },
    lampiran: {
      lkpd: 'LKPD-PjBL-Fisika-GEM-SMAN106.pdf',
      bahanBacaan: 'Modul Fisika Gelombang SMAN 106 & Artikel IEEE Spectrum',
      glosarium: 'Spektrum, Frekuensi, Foton, Sangkar Faraday, Attenuation, Bandwidth.',
      daftarPustaka: 'Halliday, Resnick. 2021. Fundamentals of Physics. Wiley.'
    },
    status: 'Menunggu Review',
    catatanKepalaSekolah: '',
    tanggalDibuat: '2026-08-08',
    terakhirDiubah: '2026-08-11',
    versi: 1,
    syncedToDrive: true,
    driveFileId: 'gdrive_106_fis_02'
  },
  {
    id: 'mod_106_03',
    judul: 'Modul Ajar Bahasa Indonesia - Menulis Teks Argumentasi Bertema Isu Lingkungan',
    mataPelajaran: 'Bahasa Indonesia',
    kelas: 'X',
    fase: 'E',
    semester: 'Ganjil',
    alokasiWaktu: '4 JP (2 x Pertemuan)',
    penyusun: 'Ahmad Fauzi, S.Pd',
    nipPenyusun: '199001122019031008',
    sekolah: 'SMAN 106 Jakarta',
    tahunAjaran: '2025/2026',
    capaianPembelajaran: 'Peserta didik mampu menulis gagasan, pikiran, pandangan, atau pesan tertulis dalam bentuk teks argumentasi secara kritis, terstruktur, dan santun.',
    tujuanPembelajaran: [
      'Peserta didik mampu mengidentifikasi struktur teks argumentasi (Tesis, Argumen, Penegasan Ulang) dari artikel opini.',
      'Peserta didik mampu menyusun teks argumentasi bertema pengelolaan sampah di SMAN 106 Jakarta.'
    ],
    alurTujuanPembelajaran: 'Membaca Opini -> Bedah Tesis & Data -> Menyusun Kerangka -> Draft Argumentasi -> Peer Editing',
    profilPancasila: {
      berimanBertaqwa: true,
      berkebinekaanGlobal: true,
      gotongRoyong: true,
      mandiri: true,
      bernalarKritis: true,
      kreatif: true,
    },
    pemahamanBermakna: 'Kemampuan menyampaikan gagasan kritis berlandaskan data empiris adalah pilar utama budaya literasi warga SMAN 106 Jakarta.',
    pertanyaanPemantik: [
      'Apakah larangan plastik sekali pakai di lingkungan sekolah sudah cukup efektif?',
      'Bagaimana fakta dan data membedakan pendapat objektif dengan opini emosional?'
    ],
    saranaPrasarana: 'Artikel Berita Kompas/Tempo, Chromebook, Padlet Kolaboratif',
    targetPesertaDidik: 'Peserta Didik Kelas X Reguler (36 Siswa)',
    modelPembelajaran: 'Discovery Learning',
    strategiDiferensiasi: {
      konten: 'Berita teks cetak, podcast artikel audio, dan vlogging esai.',
      proses: 'Panduan pola kalimat pendukung untuk siswa yang memerlukan dukungan tata bahasa.',
      produk: 'Artikel Majalah Dinding Sekolah, Blog Medium, atau Esai Suara.'
    },
    kegiatanPembelajaran: [
      {
        pertemuanKe: 1,
        alokasiWaktu: '2 x 45 Menit',
        pendahuluan: ['Salam, doa, apersepsi kebersihan lingkungan sekolah SMAN 106.'],
        kegiatanInti: [
          {
            langkahModel: 'Stimulation & Problem Statement',
            aktivitasGuru: 'Menyajikan dua teks kontras: esai emosional vs esai berbasis data fakta.',
            aktivitasSiswa: 'Siswa membandingkan bobot kebenaran kedua teks tersebut.'
          }
        ],
        penutup: ['Refleksi dan penugasan kerangka karangan.']
      }
    ],
    asesmen: {
      diagnostik: 'Kuis Singkat Ciri Paragraf Argumentasi.',
      formatif: 'Lembar Peer-Review Kerangka Paragraf.',
      sumatif: 'Produk Akhir Teks Argumentasi 500 Kata.',
      kktp: 'Nilai Kriteria Minimal 76.',
      rubrikNilai: 'Kesesuaian Struktur (30%), Kebenaran Data (30%), Ejaan & Kohesi (40%).'
    },
    lampiran: {
      lkpd: 'LKPD-BIndo-Argumentasi-SMAN106.pdf',
      bahanBacaan: 'Pedoman Umum Ejaan Bahasa Indonesia (PUEBI) & Contoh Esai Opini',
      glosarium: 'Tesis, Kohesi, Koherensi, Data Sekunder, Argumentasi, Premis.',
      daftarPustaka: 'Kemendikbudristek. 2022. Cerdas Cergas Berbahasa Indonesia SMA Kelas X.'
    },
    status: 'Draft',
    tanggalDibuat: '2026-08-11',
    terakhirDiubah: '2026-08-12',
    versi: 1,
    syncedToDrive: false
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    title: 'Modul Ajar Disetujui',
    message: 'Kepala Sekolah telah menyetujui Modul Ajar Matematika K-10 Anda dengan catatan apresiasi.',
    timestamp: '10 Menit lalu',
    read: false,
    type: 'approval',
    linkId: 'mod_106_01'
  },
  {
    id: 'notif_2',
    title: 'Komentar Baru di Forum MGMP',
    message: 'Dr. Siti Nurhaliza menanggapi topik "Penggunaan PhET Simulation di Kelas XI".',
    timestamp: '1 Jam lalu',
    read: false,
    type: 'comment'
  },
  {
    id: 'notif_3',
    title: 'Pengumuman Kurikulum Merdeka',
    message: 'Jadwal Pendampingan Review Modul Ajar Semester Ganjil SMAN 106 Jakarta dilaksanakan hari Jumat.',
    timestamp: '3 Jam lalu',
    read: true,
    type: 'system'
  },
  {
    id: 'notif_4',
    title: 'Sync Cloud Google Drive',
    message: 'Seluruh Modul Ajar berhasil disinkronkan secara aman dengan enkripsi E2EE ke Google Drive SMAN 106.',
    timestamp: 'Yesterday',
    read: true,
    type: 'sync'
  }
];

export const INITIAL_MGMP_POSTS: MgmpForumPost[] = [
  {
    id: 'post_1',
    authorName: 'Budi Santoso, M.Pd',
    authorSubject: 'Matematika',
    title: 'Integrasi Alat Bantu Geogebra untuk Materi Eksponen & Logaritma Kelas X',
    content: 'Rekan-rekan guru MIPA SMAN 106, saya telah membuat template LKPD interaktif Geogebra yang terhubung langsung dengan Google Classroom. Hasilnya siswa lebih cepat paham sifat grafik eksponen. Silakan cek di repositori bersama!',
    timestamp: 'Kemarin, 14:20 WIB',
    likes: 12,
    commentsCount: 5,
    tags: ['Matematika', 'KurikulumMerdeka', 'Geogebra', 'InovasiPembelajaran']
  },
  {
    id: 'post_2',
    authorName: 'Dewi Lestari, S.T, M.Kom',
    authorSubject: 'Informatika',
    title: 'Tips Penerapan Model Deep Learning pada Modul Ajar Algoritma',
    content: 'Penerapan Deep Learning dengan siklus Meaningful Learning, Engaged Learning, dan Mindful Learning sangat cocok untuk melatih Computational Thinking siswa SMAN 106. Ada yang berminat kolaborasi lintas mapel (Informatika + Fisika)?',
    timestamp: '2 Hari lalu',
    likes: 18,
    commentsCount: 8,
    tags: ['Informatika', 'DeepLearning', 'KolaborasiLintasMapel']
  }
];

export const MOCK_BUG_LOGS: BugReportLog[] = [
  {
    id: 'bug_101',
    timestamp: '2026-08-12 08:15:00',
    component: 'PDF Export Engine',
    severity: 'low',
    message: 'Margin header Kop SMAN 106 Jakarta disesuaikan otomatis pada resolusi layar mobile.',
    status: 'resolved'
  },
  {
    id: 'bug_102',
    timestamp: '2026-08-11 16:40:00',
    component: 'GDrive Offline Sync Queue',
    severity: 'medium',
    message: 'Antrean sinkronisasi IndexedDB otomatis terproses saat koneksi jaringan internet pulih.',
    status: 'monitoring'
  }
];

export const INITIAL_ANALYTICS: AnalyticsSummary = {
  totalModul: 42,
  approvedModul: 36,
  pendingReviewModul: 4,
  activeTeachers: 38,
  syncSuccessRate: 99.4,
  dailyCreatedStats: [
    { date: '06 Aug', created: 3, approved: 2 },
    { date: '07 Aug', created: 5, approved: 4 },
    { date: '08 Aug', created: 8, approved: 7 },
    { date: '09 Aug', created: 6, approved: 5 },
    { date: '10 Aug', created: 9, approved: 8 },
    { date: '11 Aug', created: 7, approved: 6 },
    { date: '12 Aug', created: 4, approved: 4 },
  ],
  modelDistribution: [
    { name: 'Problem Based Learning (PBL)', value: 16 },
    { name: 'Project Based Learning (PjBL)', value: 12 },
    { name: 'STEM (Science, Tech, Engineering, Math)', value: 7 },
    { name: 'Discovery Learning', value: 8 },
    { name: 'Deep Learning', value: 4 },
    { name: 'Cooperative Learning', value: 2 },
  ],
  subjectCoverage: [
    { subject: 'Matematika', percentage: 95 },
    { subject: 'Fisika', percentage: 90 },
    { subject: 'Bahasa Indonesia', percentage: 92 },
    { subject: 'Informatika', percentage: 88 },
    { subject: 'Biologi', percentage: 85 },
    { subject: 'Bahasa Inggris', percentage: 91 },
  ]
};
