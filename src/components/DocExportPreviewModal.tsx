import React, { useState } from 'react';
import { X, Printer, FileDown, FileText, Download, Layers, CloudUpload } from 'lucide-react';
import { ModulAjar, TemplateRPPKemendikdasmen } from '../types';
import jsPDF from 'jspdf';

interface DocExportPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  modul: ModulAjar;
  onOpenDriveModal?: () => void;
}

export const DocExportPreviewModal: React.FC<DocExportPreviewModalProps> = ({
  isOpen,
  onClose,
  modul,
  onOpenDriveModal,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateRPPKemendikdasmen>(
    modul.templateRPP || 'Kemendikdasmen Lengkap (Modul Ajar Komponen Utuh)'
  );

  const kepalaSekolahNama = modul.kepalaSekolah || 'Dra. Hj. Sri Rahayu, M.Pd';
  const kepalaSekolahNip = modul.nipKepalaSekolah || '196804121994032001';

  if (!isOpen) return null;

  // Print Handler
  const handlePrint = () => {
    window.print();
  };

  // Export to Word (.doc) Handler
  const handleExportWord = () => {
    const contentHtml = document.getElementById('printable-rpp-document')?.innerHTML;
    if (!contentHtml) return;

    const fullHtml = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>${modul.judul}</title>
        <style>
          body { font-family: 'Times New Roman', serif; font-size: 11pt; line-height: 1.4; color: #000; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 12pt; }
          th, td { border: 1px solid #000; padding: 6pt; text-align: left; vertical-align: top; }
          .kop-header { text-align: center; font-weight: bold; margin-bottom: 15pt; border-bottom: 3px double #000; padding-bottom: 8pt; }
          .section-title { font-size: 12pt; font-weight: bold; background-color: #f0f0f0; margin-top: 10pt; padding: 4pt; border: 1px solid #000; }
          .sig-table { border: none !important; margin-top: 30pt; }
          .sig-table td { border: none !important; }
        </style>
      </head>
      <body>
        ${contentHtml}
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', fullHtml], {
      type: 'application/msword'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ModulAjar_SMAN106_${modul.mataPelajaran}_Kelas${modul.kelas}.doc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export to PDF via jsPDF
  const handleExportPDF = () => {
    const doc = new jsPDF('p', 'pt', 'a4');
    const margin = 40;
    let y = 40;

    doc.setFont('Times', 'Bold');
    doc.setFontSize(14);
    doc.text('PEMERINTAH PROVINSI DKI JAKARTA', 297, y, { align: 'center' });
    y += 16;
    doc.text('DINAS PENDIDIKAN', 297, y, { align: 'center' });
    y += 16;
    doc.setFontSize(16);
    doc.text('SEKOLAH MENENGAH ATAS (SMA) NEGERI 106 JAKARTA', 297, y, { align: 'center' });
    y += 14;
    doc.setFont('Times', 'Normal');
    doc.setFontSize(9);
    doc.text('Jl. Gandaria I No. 32, Pekayon, Pasar Rebo, Jakarta Timur 13710 | Telp: (021) 8711382 | NPSN: 20103289', 297, y, { align: 'center' });
    y += 10;
    
    doc.setLineWidth(1.5);
    doc.line(margin, y, 595 - margin, y);
    y += 20;

    doc.setFont('Times', 'Bold');
    doc.setFontSize(14);
    doc.text('MODUL AJAR KURIKULUM MERDEKA', 297, y, { align: 'center' });
    y += 25;

    doc.setFontSize(10);
    doc.setFont('Times', 'Bold');
    doc.text(`1. IDENTITAS MODUL`, margin, y);
    y += 15;
    doc.setFont('Times', 'Normal');
    doc.text(`Nama Mata Pelajaran : ${modul.mataPelajaran}`, margin + 10, y); y += 14;
    doc.text(`Kelas / Fase / Semester : Kelas ${modul.kelas} / Fase ${modul.fase} / Semester ${modul.semester}`, margin + 10, y); y += 14;
    doc.text(`Alokasi Waktu : ${modul.alokasiWaktu}`, margin + 10, y); y += 14;
    doc.text(`Guru Penyusun : ${modul.penyusun} (NIP. ${modul.nipPenyusun})`, margin + 10, y); y += 20;

    doc.setFont('Times', 'Bold');
    doc.text(`2. CAPAIAN PEMBELAJARAN (CP)`, margin, y);
    y += 15;
    doc.setFont('Times', 'Normal');
    const cpLines = doc.splitTextToSize(modul.capaianPembelajaran, 500);
    doc.text(cpLines, margin + 10, y);
    y += cpLines.length * 12 + 15;

    doc.setFont('Times', 'Bold');
    doc.text(`3. MODEL & STRATEGI DIFERENSIASI`, margin, y);
    y += 15;
    doc.setFont('Times', 'Normal');
    doc.text(`Model Pembelajaran : ${modul.modelPembelajaran}`, margin + 10, y); y += 14;
    doc.text(`Diferensiasi Konten : ${modul.strategiDiferensiasi.konten}`, margin + 10, y); y += 14;
    doc.text(`Diferensiasi Produk : ${modul.strategiDiferensiasi.produk}`, margin + 10, y); y += 25;

    // Signatures
    doc.setFont('Times', 'Normal');
    doc.text('Mengetahui,', margin, y);
    doc.text('Jakarta, ' + new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }), 380, y);
    y += 14;
    doc.text('Kepala SMAN 106 Jakarta', margin, y);
    doc.text('Guru Mata Pelajaran', 380, y);
    y += 50;
    doc.setFont('Times', 'Bold');
    doc.text(kepalaSekolahNama, margin, y);
    doc.text(modul.penyusun, 380, y);
    y += 12;
    doc.setFont('Times', 'Normal');
    doc.text('NIP. ' + kepalaSekolahNip, margin, y);
    doc.text('NIP. ' + modul.nipPenyusun, 380, y);

    doc.save(`ModulAjar_SMAN106_${modul.mataPelajaran}_Kelas${modul.kelas}.pdf`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 my-8 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Control Header */}
        <div className="p-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="font-bold text-sm">
                Kop Surat & Pratinjau Dokumen Resmi SMAN 106 Jakarta
              </h3>
              <p className="text-[11px] text-slate-400 font-sans">
                Standar Kementerian Pendidikan Dasar dan Menengah RI
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenDriveModal && (
              <button
                onClick={onOpenDriveModal}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
              >
                <CloudUpload className="w-3.5 h-3.5" />
                <span>Simpan ke GDrive</span>
              </button>
            )}

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / PDF</span>
            </button>

            <button
              onClick={handleExportWord}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Unduh Word (.doc)</span>
            </button>

            <button
              onClick={handleExportPDF}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Template Selector Bar */}
        <div className="px-4 py-2.5 bg-slate-800 text-white flex flex-wrap items-center justify-between gap-2 border-b border-slate-700 text-xs">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-400" />
            <span className="font-semibold text-slate-300">Format Template Kemendikdasmen:</span>
          </div>

          <select
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value as TemplateRPPKemendikdasmen)}
            className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-700 text-blue-300 font-bold focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="Kemendikdasmen Lengkap (Modul Ajar Komponen Utuh)">📘 Format Kemendikdasmen Lengkap (Komponen Utuh)</option>
            <option value="Kemendikdasmen Sederhana (Format Ringkas 3 Komponen)">⚡ Format Kemendikdasmen Sederhana (3 Komponen Utama)</option>
            <option value="Kemendikdasmen Deep Learning (Mindful, Meaningful, Joyful)">💡 Format Kemendikdasmen Deep Learning (Mindful, Meaningful, Joyful)</option>
            <option value="Kemendikdasmen P5 & STEM Interdisipliner">🔬 Format Kemendikdasmen P5 & STEM Interdisipliner</option>
          </select>
        </div>

        {/* Printable Document Preview Canvas Container */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-100 dark:bg-slate-950 flex justify-center">
          <div
            id="printable-rpp-document"
            className="w-full max-w-[720px] bg-white text-slate-900 p-8 shadow-xl rounded-sm border border-slate-300 print:shadow-none print:p-0 print:border-none font-serif text-xs leading-relaxed"
          >
            {/* Kop Surat Header SMAN 106 Jakarta */}
            <div className="text-center pb-3 border-b-4 border-double border-slate-900 mb-6">
              <p className="font-bold uppercase text-[11pt] tracking-tight">Pemerintah Provinsi DKI Jakarta</p>
              <p className="font-bold uppercase text-[12pt] tracking-tight">Dinas Pendidikan</p>
              <p className="font-bold uppercase text-[14pt] tracking-wide text-slate-900 mt-0.5">
                SMA NEGERI 106 JAKARTA
              </p>
              <p className="text-[9pt] text-slate-700 font-sans mt-1">
                Jl. Gandaria I No. 32, Pekayon, Pasar Rebo, Jakarta Timur 13710 | Telp: (021) 8711382
              </p>
              <p className="text-[9pt] text-slate-700 font-sans">
                NPSN: 20103289 • Akreditasi A • Email: info@sman106jkt.sch.id
              </p>
            </div>

            {/* Title */}
            <div className="text-center mb-6">
              <h1 className="font-bold uppercase text-[13pt] underline tracking-wide">
                MODUL AJAR KURIKULUM MERDEKA
              </h1>
              <p className="font-sans font-bold text-[9pt] text-blue-900 dark:text-blue-400 mt-1 uppercase tracking-tight">
                STANDAR KEMENDIKDASMEN: {selectedTemplate}
              </p>
              <p className="font-sans font-semibold text-[10pt] text-slate-700 mt-0.5">
                TAHUN AJARAN {modul.tahunAjaran}
              </p>
            </div>

            {/* Table 1: Identitas */}
            <div className="mb-4">
              <h2 className="font-bold uppercase bg-slate-100 p-1.5 border border-slate-400 text-[10pt] mb-2">
                I. IDENTITAS MODUL
              </h2>
              <table className="w-full border-collapse border border-slate-400 text-xs">
                <tbody>
                  <tr>
                    <td className="p-2 font-bold w-1/3 border border-slate-400 bg-slate-50">Nama Mata Pelajaran</td>
                    <td className="p-2 border border-slate-400 font-semibold">{modul.mataPelajaran}</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold border border-slate-400 bg-slate-50">Fase / Kelas / Semester</td>
                    <td className="p-2 border border-slate-400">Fase {modul.fase} / Kelas {modul.kelas} / Semester {modul.semester}</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold border border-slate-400 bg-slate-50">Alokasi Waktu</td>
                    <td className="p-2 border border-slate-400">{modul.alokasiWaktu}</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold border border-slate-400 bg-slate-50">Guru Penyusun</td>
                    <td className="p-2 border border-slate-400">{modul.penyusun} (NIP. {modul.nipPenyusun})</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold border border-slate-400 bg-slate-50">Model Pembelajaran Utama</td>
                    <td className="p-2 border border-slate-400 font-bold text-emerald-800">{modul.modelPembelajaran}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Table 2: Capaian & Tujuan */}
            <div className="mb-4">
              <h2 className="font-bold uppercase bg-slate-100 p-1.5 border border-slate-400 text-[10pt] mb-2">
                II. KOMPETENSI INTI & CAPAIAN PEMBELAJARAN
              </h2>
              <div className="space-y-2 p-3 border border-slate-400 rounded-sm">
                <p><strong>Capaian Pembelajaran (CP):</strong> {modul.capaianPembelajaran}</p>
                <div>
                  <strong>Tujuan Pembelajaran (TP):</strong>
                  <ul className="list-disc pl-5 mt-1 space-y-0.5">
                    {modul.tujuanPembelajaran.map((tp, idx) => (
                      <li key={idx}>{tp}</li>
                    ))}
                  </ul>
                </div>
                <p><strong>Pemahaman Bermakna:</strong> {modul.pemahamanBermakna}</p>
              </div>
            </div>

            {/* Table 3: Diferensiasi & Asesmen */}
            <div className="mb-6">
              <h2 className="font-bold uppercase bg-slate-100 p-1.5 border border-slate-400 text-[10pt] mb-2">
                III. STRATEGI DIFERENSIASI & ASESMEN KKTP
              </h2>
              <table className="w-full border-collapse border border-slate-400 text-xs mb-3">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="p-2 border border-slate-400 text-left font-bold">Diferensiasi Konten</th>
                    <th className="p-2 border border-slate-400 text-left font-bold">Diferensiasi Proses</th>
                    <th className="p-2 border border-slate-400 text-left font-bold">Diferensiasi Produk</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 border border-slate-400">{modul.strategiDiferensiasi.konten}</td>
                    <td className="p-2 border border-slate-400">{modul.strategiDiferensiasi.proses}</td>
                    <td className="p-2 border border-slate-400">{modul.strategiDiferensiasi.produk}</td>
                  </tr>
                </tbody>
              </table>

              <div className="p-3 border border-slate-400 space-y-1">
                <p><strong>KKTP & Rubrik Asesmen:</strong> {modul.asesmen.kktp}</p>
              </div>
            </div>

            {/* Official Signature Table */}
            <div className="pt-6 mt-8 border-t border-slate-300">
              <table className="w-full border-0 text-center font-serif text-xs">
                <tbody>
                  <tr>
                    <td className="w-1/2 align-top">
                      <p>Mengetahui,</p>
                      <p className="font-bold">Kepala SMAN 106 Jakarta</p>
                      <div className="h-16 flex items-center justify-center">
                        <span className="text-[10px] text-emerald-800 italic font-mono border border-emerald-600 px-2 py-0.5 rounded">
                          [ Tanda Tangan Digital Disetujui ]
                        </span>
                      </div>
                      <p className="font-bold underline">{kepalaSekolahNama}</p>
                      <p>NIP. {kepalaSekolahNip}</p>
                    </td>

                    <td className="w-1/2 align-top">
                      <p>Jakarta, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                      <p className="font-bold">Guru Mata Pelajaran</p>
                      <div className="h-16 flex items-center justify-center">
                        <span className="text-[10px] text-slate-500 italic font-mono">
                          [ Tanda Tangan Guru ]
                        </span>
                      </div>
                      <p className="font-bold underline">{modul.penyusun}</p>
                      <p>NIP. {modul.nipPenyusun}</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
