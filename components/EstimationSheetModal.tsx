"use client";

import React from "react";
import { X, Printer, Download, MessageSquare, ShieldCheck, Building2, CheckCircle2 } from "lucide-react";
import { formatRupiah } from "@/lib/tenders-data";

interface EstimationSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    tenderTitle?: string;
    tenderCode?: string;
    obligeeName?: string;
    projectValue: number;
    bondType?: string;
    bondValue?: number;
    companyName?: string;
    contactPerson?: string;
  };
}

export function EstimationSheetModal({ isOpen, onClose, data }: EstimationSheetModalProps) {
  if (!isOpen) return null;

  const projectValue = data.projectValue || 10000000000;
  const bidBondMin = Math.round(projectValue * 0.01);
  const bidBondMax = Math.round(projectValue * 0.03);
  const perfBond = Math.round(projectValue * 0.05);
  const advanceBond = Math.round(projectValue * 0.2);
  const maintBond = Math.round(projectValue * 0.05);

  const docNumber = `SIM-SB/${new Date().getFullYear()}/${Math.floor(100000 + Math.random() * 900000)}`;
  const dateFormatted = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `Halo Tim Penjaminan RadarTender.id,\nSaya sudah mengunduh Lembar Simulasi Jaminan No: *${docNumber}*.\n\n*Proyek:* ${data.tenderTitle || "Proyek Konstruksi"}\n*Nilai HPS:* ${formatRupiah(projectValue)}\n*Perusahaan:* ${data.companyName || "-"}\n\nMohon bantu siapkan draft penawaran resmi dan cek persyaratannya. Terima kasih!`
    );
    window.open(`https://wa.me/6281314620473?text=${text}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 my-8 text-slate-100 print:bg-white print:text-black print:p-0 print:border-none print:shadow-none print:max-w-none print:w-full">
        {/* Modal Controls (Hidden when printing) */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wide">
            <ShieldCheck className="w-4 h-4" />
            Pratinjau Lembar Estimasi Resmi
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow"
            >
              <Printer className="w-3.5 h-3.5" />
              Cetak / Simpan PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE SHEET CONTAINER */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white text-slate-900 border border-slate-200 print:border-none print:p-0 shadow-inner">
          {/* Document Header */}
          <div className="flex items-start justify-between pb-4 border-b-2 border-slate-800 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-slate-950 tracking-tight">
                  RadarTender<span className="text-amber-600">.id</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300">
                  Surety Intelligence
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Portal Asistensi Jaminan Proyek LPSE &amp; BUMN se-Indonesia
              </p>
            </div>
            <div className="text-right text-[11px] text-slate-600 space-y-0.5">
              <div className="font-mono font-bold text-slate-900">Ref: {docNumber}</div>
              <div>Tanggal: {dateFormatted}</div>
              <div className="text-[10px] text-emerald-700 font-semibold">Status: Valid Simulation</div>
            </div>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-base sm:text-lg font-black uppercase tracking-wide text-slate-900">
              Lembar Simulasi Kebutuhan Jaminan Proyek
            </h2>
            <p className="text-xs text-slate-500">
              Surety Bond (Asuransi Umum) &amp; Kontra Bank Garansi Devisa
            </p>
          </div>

          {/* Project Details Box */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5 mb-6">
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Nama Paket Pekerjaan:</span>
              <span className="font-bold text-slate-900 text-right max-w-[65%] truncate">
                {data.tenderTitle || "Pekerjaan Konstruksi / Pengadaan Terintegrasi"}
              </span>
            </div>
            {data.tenderCode && (
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Kode Lelang LPSE:</span>
                <span className="font-mono font-semibold text-slate-800">{data.tenderCode}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Pemilik Proyek (Obligee):</span>
              <span className="font-semibold text-slate-800">{data.obligeeName || "Kementerian / Dinas / BUMN Terkait"}</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-1.5">
              <span className="text-slate-700 font-bold">Nilai HPS / Kontrak:</span>
              <span className="font-black text-amber-700 text-sm">{formatRupiah(projectValue)}</span>
            </div>
          </div>

          {/* Guarantee Breakdown Table */}
          <div className="mb-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              1. Rincian Estimasi Nilai Jaminan yang Diperlukan:
            </h4>
            <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-3">Jenis Jaminan Proyek</th>
                    <th className="py-2 px-3 text-center">Standar Persen</th>
                    <th className="py-2 px-3 text-right">Nilai Jaminan (Rp)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-2 px-3 font-medium">Jaminan Penawaran (Bid Bond)</td>
                    <td className="py-2 px-3 text-center">1% - 3%</td>
                    <td className="py-2 px-3 text-right font-bold text-slate-900">
                      {formatRupiah(bidBondMin)} - {formatRupiah(bidBondMax)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-medium">Jaminan Pelaksanaan (Performance Bond)</td>
                    <td className="py-2 px-3 text-center">5%</td>
                    <td className="py-2 px-3 text-right font-bold text-slate-900">
                      {formatRupiah(perfBond)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-medium">Jaminan Uang Muka (Advance Payment Bond)</td>
                    <td className="py-2 px-3 text-center">20%</td>
                    <td className="py-2 px-3 text-right font-bold text-slate-900">
                      {formatRupiah(advanceBond)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-medium">Jaminan Pemeliharaan (Maintenance Bond)</td>
                    <td className="py-2 px-3 text-center">5%</td>
                    <td className="py-2 px-3 text-right font-bold text-slate-900">
                      {formatRupiah(maintBond)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Requirements Checklist */}
          <div className="mb-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              2. Persyaratan Dokumen Penerbitan Polis:
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                Akta Pendirian &amp; SK Kemenkumham
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                NIB, NPWP &amp; Rekening Koran 3 Bulan
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                Laporan Keuangan / SPT Tahunan
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                Dokumen Lelang / RKS / SPK Proyek
              </div>
            </div>
          </div>

          {/* Legal Disclaimer Footer */}
          <div className="pt-4 border-t border-slate-200 text-[10px] text-slate-500 leading-relaxed">
            <p>
              *Simulasi ini diterbitkan secara otomatis oleh sistem RadarTender.id. Penerbitan polis jaminan difasilitasi melalui Perusahaan Asuransi Umum &amp; Bank Devisa berizin resmi yang terdaftar dan diawasi oleh OJK dan Bank Indonesia. Bebas dari praktik rebating ilegal.
            </p>
          </div>
        </div>

        {/* Modal Bottom Actions (Hidden when printing) */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
          <button
            onClick={handlePrint}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Cetak / Download PDF
          </button>
          <button
            onClick={handleWhatsApp}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            <MessageSquare className="w-4 h-4" />
            Kirim ke WhatsApp Tim Penjaminan
          </button>
        </div>
      </div>
    </div>
  );
}
