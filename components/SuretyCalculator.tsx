"use client";

import React, { useState } from "react";
import { formatRupiah } from "@/lib/tenders-data";
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  Building,
  Send,
  FileText,
  MessageSquare,
} from "lucide-react";

interface SuretyCalculatorProps {
  onOpenSuretyModalWithData: (data: {
    guaranteeType: string;
    projectValue: number;
    bondValue: number;
  }) => void;
  onOpenEstimationModal: (data: any) => void;
}

export function SuretyCalculator({ onOpenSuretyModalWithData, onOpenEstimationModal }: SuretyCalculatorProps) {
  const [projectValue, setProjectValue] = useState<number>(10000000000); // 10 Miliar default
  const [bondType, setBondType] = useState<"bid" | "performance" | "advance" | "maintenance">("performance");
  const [bondPercentage, setBondPercentage] = useState<number>(5);
  const [institutionType, setInstitutionType] = useState<"surety" | "bank">("surety");

  // Handle bond type change
  const handleBondTypeChange = (type: "bid" | "performance" | "advance" | "maintenance") => {
    setBondType(type);
    if (type === "bid") setBondPercentage(2); // 2%
    if (type === "performance") setBondPercentage(5); // 5%
    if (type === "advance") setBondPercentage(20); // 20%
    if (type === "maintenance") setBondPercentage(5); // 5%
  };

  const calculatedBondValue = Math.round((projectValue * bondPercentage) / 100);

  // Estimasi rate premi kasar (0.3% - 0.75% dari nilai jaminan per 3 bulan tergantung rating principal)
  const estimatedPremiumLow = Math.round(calculatedBondValue * 0.0035);
  const estimatedPremiumHigh = Math.round(calculatedBondValue * 0.0065);

  const getBondTypeName = () => {
    switch (bondType) {
      case "bid":
        return "Jaminan Penawaran (Bid Bond)";
      case "performance":
        return "Jaminan Pelaksanaan (Performance Bond)";
      case "advance":
        return "Jaminan Uang Muka (Advance Payment Bond)";
      case "maintenance":
        return "Jaminan Pemeliharaan (Maintenance Bond)";
    }
  };

  return (
    <section id="kalkulator-jaminan" className="py-20 md:py-28 bg-slate-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-4 h-4" />
            Simulasi Cepat &amp; Fasilitas Penerbitan
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-4">
            Kalkulator Surety Bond &amp; Bank Garansi
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Hitung estimasi kebutuhan jaminan proyek Anda dalam hitungan detik. Diterbitkan melalui Asuransi Umum &amp; Bank Devisa terkemuka yang terdaftar dan diawasi OJK / Bank Indonesia.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Calculator Input Form */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-200 mb-2">
                1. Pilih Jenis Jaminan Proyek:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: "bid", label: "Penawaran (Bid)", defaultPct: 2 },
                  { id: "performance", label: "Pelaksanaan (Perf)", defaultPct: 5 },
                  { id: "advance", label: "Uang Muka (Advance)", defaultPct: 20 },
                  { id: "maintenance", label: "Pemeliharaan", defaultPct: 5 },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleBondTypeChange(item.id as any)}
                    className={`py-3 px-3 rounded-xl text-xs font-bold transition text-center border ${
                      bondType === item.id
                        ? "bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20"
                        : "bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Nilai Proyek (HPS / Kontrak) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-slate-200">
                  2. Nilai HPS / Kontrak Proyek:
                </label>
                <span className="text-amber-400 font-extrabold text-base">
                  {formatRupiah(projectValue)}
                </span>
              </div>
              <input
                type="range"
                min={500000000}
                max={100000000000}
                step={500000000}
                value={projectValue}
                onChange={(e) => setProjectValue(Number(e.target.value))}
                className="w-full accent-amber-500 bg-slate-950 cursor-pointer h-2 rounded-lg"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                <span>Rp 500 Juta</span>
                <span>Rp 25 Miliar</span>
                <span>Rp 50 Miliar</span>
                <span>Rp 100 Miliar+</span>
              </div>
            </div>

            {/* Persentase Jaminan */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-slate-200">
                  3. Persentase Jaminan Diminta Pemilik Proyek (Obligee):
                </label>
                <span className="text-white font-bold text-sm bg-slate-800 px-2 py-0.5 rounded">
                  {bondPercentage}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 5, 10, 15, 20].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setBondPercentage(pct)}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition border ${
                      bondPercentage === pct
                        ? "bg-slate-100 text-slate-950 border-white"
                        : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            {/* Lembaga Penerbit */}
            <div>
              <label className="block text-sm font-bold text-slate-200 mb-2">
                4. Opsi Lembaga Penerbit:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setInstitutionType("surety")}
                  className={`p-4 rounded-2xl text-left border transition ${
                    institutionType === "surety"
                      ? "bg-amber-500/10 border-amber-500 text-white"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div className="font-bold text-sm text-white mb-1 flex items-center justify-between">
                    <span>Surety Bond (Asuransi)</span>
                    {institutionType === "surety" && <CheckCircle className="w-4 h-4 text-amber-400" />}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Proses 1-2 hari kerja, tanpa agunan fisik / collateral ringan. Cocok untuk LPSE &amp; BUMN.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setInstitutionType("bank")}
                  className={`p-4 rounded-2xl text-left border transition ${
                    institutionType === "bank"
                      ? "bg-cyan-500/10 border-cyan-500 text-white"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div className="font-bold text-sm text-white mb-1 flex items-center justify-between">
                    <span>Bank Garansi (Bank Devisa)</span>
                    {institutionType === "bank" && <CheckCircle className="w-4 h-4 text-cyan-400" />}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Penerbitan via Bank BUMN / Swasta devisa nasional. Mendukung skema Kontra Bank Garansi.
                  </p>
                </button>
              </div>
            </div>
          </div>

          {/* Calculator Output & Action Card */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/30 shadow-2xl space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Ringkasan Estimasi Penjaminan
              </span>
              <h3 className="text-2xl font-black text-white mt-1">
                {getBondTypeName()}
              </h3>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <div>
                <span className="text-xs text-slate-400 block mb-1">
                  Nilai Penjaminan yang Dibutuhkan:
                </span>
                <span className="text-3xl font-black text-amber-400 tracking-tight">
                  {formatRupiah(calculatedBondValue)}
                </span>
                <span className="text-xs text-slate-500 block mt-0.5">
                  ({bondPercentage}% dari Nilai Proyek {formatRupiah(projectValue)})
                </span>
              </div>

              <div className="pt-3 border-t border-slate-800/80">
                <span className="text-xs text-slate-400 block mb-1">
                  Estimasi Biaya Service Charge / Premi Jasa:
                </span>
                <span className="text-lg font-bold text-white">
                  {formatRupiah(estimatedPremiumLow)} s/d {formatRupiah(estimatedPremiumHigh)}
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  *Tergantung durasi masa laku polis (30/60/90 hari) &amp; underwriting score.
                </span>
              </div>
            </div>

            {/* Checklist Syarat Cepat */}
            <div>
              <span className="text-xs font-bold text-slate-300 block mb-2 uppercase tracking-wide">
                Persyaratan Cepat Dokumen:
              </span>
              <ul className="space-y-2 text-xs text-slate-400">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  Legalitas PT/CV (Akta, NIB, NPWP Perusahaan)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  Rekening Koran 3 Bulan Terakhir / Laporan Keuangan
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  Dokumen Tender (RKS / Undangan Lelang / SPK Proyek)
                </li>
              </ul>
            </div>

            {/* Direct Action */}
            <div className="space-y-2.5">
              <button
                onClick={() =>
                  onOpenSuretyModalWithData({
                    guaranteeType: getBondTypeName(),
                    projectValue,
                    bondValue: calculatedBondValue,
                  })
                }
                className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 text-slate-950 font-black text-sm uppercase tracking-wider hover:brightness-110 transition shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Proses Penerbitan Jaminan Sekarang
              </button>

              <button
                type="button"
                onClick={() =>
                  onOpenEstimationModal({
                    tenderTitle: "Simulasi Jaminan Proyek Mandiri",
                    projectValue,
                    bondType: getBondTypeName(),
                    bondValue: calculatedBondValue,
                  })
                }
                className="w-full py-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition"
              >
                <FileText className="w-4 h-4 text-amber-400" />
                📄 Download Draf Estimasi Resmi (PDF)
              </button>

              {/* Instant WhatsApp Lead Capture */}
              <a
                href={`https://wa.me/6281314620473?text=${encodeURIComponent(
                  `Halo Tim Penjaminan RadarTender,\n\n` +
                  `Saya ingin konsultasi persyaratan dan penerbitan jaminan proyek:\n` +
                  `• Jenis: ${getBondTypeName()} (${institutionType === "surety" ? "Surety Bond Asuransi" : "Bank Garansi Devisa"})\n` +
                  `• Nilai Proyek: ${formatRupiah(projectValue)}\n` +
                  `• Nilai Jaminan (${bondPercentage}%): ${formatRupiah(calculatedBondValue)}\n` +
                  `• Estimasi Premi: ${formatRupiah(estimatedPremiumLow)} s/d ${formatRupiah(estimatedPremiumHigh)}\n\n` +
                  `Mohon informasi kelengkapan berkas dan jalur prioritas proses 1-2 hari kerjanya. Terima kasih!`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center gap-1.5 transition"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                💬 Kirim Estimasi ini ke WhatsApp CS Penjaminan
              </a>
            </div>
            <p className="text-[11px] text-center text-slate-500">
              Konsultasi langsung dengan tim fasilitator penjaminan terpercaya. Respon cepat &lt; 15 menit.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
