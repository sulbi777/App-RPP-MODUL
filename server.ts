import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const currentFilename = typeof __filename !== 'undefined' ? __filename : '';
const currentDirname = typeof __dirname !== 'undefined' ? __dirname : (currentFilename ? path.dirname(currentFilename) : process.cwd());

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initialize Google GenAI SDK
let aiClient: GoogleGenAI | null = null;
function getGenAIClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY || '';
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// API Routes

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    school: 'SMAN 106 Jakarta',
    geminiConfigured: !!process.env.GEMINI_API_KEY,
    systemTime: new Date().toISOString(),
  });
});

// Generate Full RPP / Modul Ajar via Gemini AI
app.post('/api/gemini/generate-rpp', async (req, res) => {
  try {
    const {
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
      diferensiasiReq,
      instruksiTambahan
    } = req.body;

    const prompt = `
Anda adalah Pakar Kurikulum Merdeka dan Pengembang Modul Ajar Senior Kementerian Pendidikan Dasar dan Menengah (Kemendikdasmen) RI untuk SMAN 106 Jakarta (Jl. Gandaria I No. 32 Pekayon, Pasar Rebo, Jakarta Timur).
Tugas Anda adalah merancang Modul Ajar / RPP Kurikulum Merdeka yang sangat detail, profesional, dan siap pakai sesuai standar Kemendikdasmen terbaru.

Parameter RPP:
- Template Standar Kemendikdasmen: ${templateRPP || 'Kemendikdasmen Lengkap (Modul Ajar Komponen Utuh)'}
- Mata Pelajaran: ${mataPelajaran || 'Matematika'}
- Kelas / Fase: Kelas ${kelas || 'X'} (Fase ${fase || 'E'})
- Semester: ${semester || 'Ganjil'}
- Alokasi Waktu: ${alokasiWaktu || '4 JP (2 x Pertemuan)'}
- Topik / Materi Utama: ${topik || 'Fungsi Eksponen dan Pertumbuhan Kontekstual'}
- Model Pembelajaran: ${modelPembelajaran || 'Problem Based Learning (PBL)'}
- Guru Penyusun: ${penyusun || 'Budi Santoso, M.Pd'} (NIP: ${nipPenyusun || '197508152005011003'})
- Kepala Sekolah: ${kepalaSekolah || 'Dra. Hj. Sri Rahayu, M.Pd'} (NIP: ${nipKepalaSekolah || '196804121994032001'})
- Catatan Khusus Diferensiasi: ${diferensiasiReq || 'Diferensiasi Konten (Visual/Audio/Kinestetik), Proses (Diskusi Berjenjang), dan Produk (Infografis/Video/Slide)'}
- Instruksi Tambahan: ${instruksiTambahan || 'Sertakan contoh kasus kontekstual kehidupan sehari-hari di Kota Jakarta'}

Instruksi Format Berdasarkan Template Kemendikdasmen:
1. Jika Template = "Kemendikdasmen Sederhana (Format Ringkas 3 Komponen)": Susun RPP super ringkas, fokus tajam pada 3 komponen esensial (Tujuan Pembelajaran, Kegiatan Pembelajaran, dan Asesmen).
2. Jika Template = "Kemendikdasmen Deep Learning (Mindful, Meaningful, Joyful)": Berikan penekanan khusus pada tahap kegiatan inti yang mencakup Mindful Learning (Apersepsi & Kesadaran Emosi), Meaningful Learning (Kebermaknaan Kontekstual Jakarta), dan Joyful Learning (Aktivitas Kolaboratif Menyenangkan & Refleksi Mendalam).
3. Jika Template = "Kemendikdasmen P5 & STEM Interdisipliner": Integrasikan kerangka kerja STEM (Sains, Teknologi, Rekayasa, Matematika) dan penguatan Profil Pelajar Pancasila secara eksplisit.
4. Jika Template = "Kemendikdasmen Lengkap": Susun komponen utuh mencakup Informasi Umum, Komponen Inti, dan Lampiran LKPD/Glosarium.

Buatkan respon JSON murni (valid JSON) sesuai struktur berikut tanpa pembungkus markdown tambahan jika memungkinkan (atau di dalam block json):
{
  "judul": "Modul Ajar ...",
  "capaianPembelajaran": "Penjelasan CP...",
  "tujuanPembelajaran": ["TP 1...", "TP 2...", "TP 3..."],
  "alurTujuanPembelajaran": "Langkah ATP...",
  "profilPancasila": {
    "berimanBertaqwa": true,
    "berkebinekaanGlobal": false,
    "gotongRoyong": true,
    "mandiri": true,
    "bernalarKritis": true,
    "kreatif": true
  },
  "pemahamanBermakna": "Penjelasan manfaat nyata materi...",
  "pertanyaanPemantik": ["Pertanyaan 1...", "Pertanyaan 2..."],
  "saranaPrasarana": "Chromebook SMAN 106, Proyektor, Interactive Board, LKPD",
  "targetPesertaDidik": "Peserta Didik Reguler SMAN 106 Jakarta",
  "strategiDiferensiasi": {
    "konten": "Penjelasan diferensiasi konten...",
    "proses": "Penjelasan diferensiasi proses...",
    "produk": "Penjelasan diferensiasi produk..."
  },
  "kegiatanPembelajaran": [
    {
      "pertemuanKe": 1,
      "alokasiWaktu": "2 x 45 Menit",
      "pendahuluan": ["Aktivitas 1...", "Aktivitas 2..."],
      "kegiatanInti": [
        {
          "langkahModel": "Langkah 1 Model...",
          "aktivitasGuru": "Tugas guru...",
          "aktivitasSiswa": "Aktivitas siswa...",
          "diferensiasi": "Catatan diferensiasi..."
        }
      ],
      "penutup": ["Penutup 1...", "Penutup 2..."]
    }
  ],
  "asesmen": {
    "diagnostik": "Penjelasan asesmen awal...",
    "formatif": "Penjelasan asesmen proses...",
    "sumatif": "Penjelasan tes akhir bab...",
    "kktp": "Kriteria Ketercapaian Tujuan Pembelajaran...",
    "rubrikNilai": "Rubrik penilaian detail..."
  },
  "lampiran": {
    "lkpd": "Ringkasan Lembar Kerja Peserta Didik...",
    "bahanBacaan": "Bahan bacaan siswa dan guru...",
    "glosarium": "Daftar istilah penting...",
    "daftarPustaka": "Daftar referensi buku dan sumber digital..."
  }
}
`;

    const response = await getGenAIClient().models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: 'Anda adalah Asisten AI Kurikulum Merdeka resmi untuk SMAN 106 Jakarta. Keluarkan selalu format data yang terstruktur, lengkap, presisi, dan kaya akan elemen pembelajaran berkualitas.',
        responseMimeType: 'application/json',
      },
    });

    const textOutput = response.text || '{}';
    let parsedData;
    try {
      parsedData = JSON.parse(textOutput);
    } catch {
      // Fallback clean markdown code block if present
      const cleanJson = textOutput.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedData = JSON.parse(cleanJson);
    }

    res.json({ success: true, data: parsedData });
  } catch (err: any) {
    console.error('Error in generate-rpp:', err);
    res.status(500).json({ success: false, error: err.message || 'Gagal menghasilkan Modul Ajar.' });
  }
});

// Refine Canvas Content (AI inline editing & polish)
app.post('/api/gemini/refine-canvas', async (req, res) => {
  try {
    const { sectionName, currentText, actionType, userPrompt } = req.body;

    let systemCommand = 'Anda adalah editor AI profesional Kurikulum Merdeka SMAN 106 Jakarta.';
    let promptStr = '';

    if (actionType === 'simplify') {
      promptStr = `Sederhanakan teks bagian "${sectionName}" berikut agar lebih ringkas, padat, dan mudah dipahami siswa SMA tanpa mengurangi substansi Kurikulum Merdeka:\n\n${currentText}`;
    } else if (actionType === 'expand') {
      promptStr = `Perluas dan tambahkan detail konkret, contoh situasi nyata di Kota Jakarta, serta langkah operasional pada bagian "${sectionName}" berikut:\n\n${currentText}`;
    } else if (actionType === 'add_differentiation') {
      promptStr = `Tambahkan aspek diferensiasi pembelajaran (Konten, Proses, dan Produk) yang aplikatif untuk kelas heterogen di SMAN 106 Jakarta pada bagian "${sectionName}" berikut:\n\n${currentText}`;
    } else if (actionType === 'rubric_kktp') {
      promptStr = `Formatkan bagian "${sectionName}" berikut menjadi Kriteria Ketercapaian Tujuan Pembelajaran (KKTP) dan Rubrik Penilaian berjenjang (Sangat Baik, Baik, Cukup, Perlu Bimbingan) yang jelas:\n\n${currentText}`;
    } else {
      promptStr = `Lakukan penyesuaian/perbaikan pada bagian "${sectionName}" berdasarkan instruksi berikut: "${userPrompt}".\n\nTeks Asal:\n${currentText}`;
    }

    const response = await getGenAIClient().models.generateContent({
      model: 'gemini-3.6-flash',
      contents: promptStr,
      config: {
        systemInstruction: systemCommand,
      },
    });

    res.json({ success: true, refinedText: response.text });
  } catch (err: any) {
    console.error('Error in refine-canvas:', err);
    res.status(500).json({ success: false, error: err.message || 'Gagal memperbarui Canvas.' });
  }
});

// AI Chat Assistant for SMAN 106 Teachers
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { message, history } = req.body;

    const chat = getGenAIClient().chats.create({
      model: 'gemini-3.6-flash',
      config: {
        systemInstruction: `
Anda adalah Asisten Cerdas Kurikulum Merdeka SMAN 106 Jakarta.
Anda membantu guru-guru SMAN 106 Jakarta menyusun Modul Ajar, ATP, CP, merancang asesmen diagnostik/formatif/sumatif, menyusun KKTP, menerapkan model pembelajaran (PBL, PjBL, Discovery Learning, Deep Learning, Differentiated Instruction), serta mematuhi kebijakan Dinas Pendidikan DKI Jakarta & SMAN 106 Jakarta.
Berikan jawaban yang ramah, terstruktur, praktis, dan menyemangati para pendidik.
        `,
      },
    });

    const response = await chat.sendMessage({ message });
    res.json({ success: true, reply: response.text });
  } catch (err: any) {
    console.error('Error in gemini chat:', err);
    res.status(500).json({ success: false, error: err.message || 'Gagal merespons percakapan.' });
  }
});

// Simulate E2EE Google Drive Sync
app.post('/api/drive/sync', (req, res) => {
  const { modulId, title } = req.body;
  const mockDriveFileId = `gdrive_106_sync_${Date.now()}`;
  res.json({
    success: true,
    status: 'synced',
    driveFileId: mockDriveFileId,
    encryptedAt: new Date().toISOString(),
    encryptionAlgorithm: 'AES-256-GCM (End-to-End Encrypted)',
    cloudLocation: 'Google Drive SMAN 106 Jakarta / ModulAjar_2025_2026',
    message: `Modul "${title || 'RPP'}" telah tersimpan secara aman di Google Drive sekolah.`
  });
});

// Setup Vite or Static Serving
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const cwdDist = path.join(process.cwd(), 'dist');
    const dirnameDist = currentDirname ? path.resolve(currentDirname, '../dist') : cwdDist;
    const distPath = fs.existsSync(cwdDist) ? cwdDist : (fs.existsSync(dirnameDist) ? dirnameDist : cwdDist);

    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      const indexPath = path.join(distPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send('Application build not found.');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server RPP SMAN 106 Jakarta running on http://0.0.0.0:${PORT}`);
  });
}

setupServer().catch((err) => {
  console.error('Failed to start server:', err);
});
