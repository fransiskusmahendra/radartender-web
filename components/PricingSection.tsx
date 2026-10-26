"use client";

import React from "react";
import { Check, Zap, Sparkles, Shield, Gift } from "lucide-react";

interface PricingSectionProps {
  onSelectPlan: (plan: { id: "starter" | "pro" | "vip"; title: string; price: number }) => void;
}

export function PricingSection({ onSelectPlan }: PricingSectionProps) {
  return (
    <section id="harga" className="py-20 md:py-28 bg-slate-900/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Zap className="w-4 h-4" />
            Investasi Terjangkau &amp; Transparan
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-4">
            Pilihan Paket Berlangganan Radar Tender
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Akses intelijen lelang berharga miliaran rupiah dengan biaya berlangganan paling kompetitif di Indonesia. Bayar instan via QRIS semua e-wallet &amp; mobile banking.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-12">
          {/* Plan 1: Starter */}
          <div className="flex flex-col justify-between p-8 rounded-3xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Starter Bulanan
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Paket Coba 1 Bulan</h3>
              <div className="mb-6">
                <span className="text-4xl font-black text-white">Rp 79.000</span>
                <span className="text-xs text-slate-400"> / bulan</span>
              </div>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                Cocok untuk kontraktor pemula atau vendor spesialis yang ingin memantau peluang lelang terdekat.
              </p>
              <ul className="space-y-3 text-xs text-slate-300 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  Akses Radar Tender LPSE &amp; BUMN Nasional
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  Filter Kategori Pengadaan
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  Countdown Batas Submisi Lelang
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  Kalkulator Kebutuhan Surety Bond
                </li>
              </ul>
            </div>
            <button
              onClick={() =>
                onSelectPlan({
                  id: "starter",
                  title: "Starter Bulanan",
                  price: 79000,
                })
              }
              className="w-full py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition"
            >
              Langganan Rp 79.000 via QRIS
            </button>
          </div>

          {/* Plan 2: Pro Kontraktor (Featured) */}
          <div className="flex flex-col justify-between p-8 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-amber-500 shadow-2xl shadow-amber-500/10 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-[11px] font-black uppercase tracking-wider shadow">
              🔥 Paling Banyak Dipilih
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
                Pro Kontraktor (3 Bulan)
              </div>
              <h3 className="text-2xl font-black text-white mb-4">Kuartal Siap Menang</h3>
              <div className="mb-6">
                <span className="text-4xl font-black text-white">Rp 199.000</span>
                <span className="text-xs text-slate-400"> / 3 bulan</span>
                <div className="text-[11px] text-amber-400 mt-1 font-semibold">
                  Hanya ~Rp 66.000/bln (Hemat 16%)
                </div>
              </div>
              <p className="text-xs text-slate-300 mb-6 leading-relaxed">
                Rekomendasi terbaik bagi kontraktor aktif yang ingin selalu unggul dalam kecepatan submit dokumen.
              </p>
              <ul className="space-y-3 text-xs text-slate-200 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <strong>Real-time Alert WhatsApp Bot Instan</strong>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  Akses Penuh Seluruh Kluster &amp; Seluruh Wilayah
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  Radar Mega Proyek HPS &gt; Rp 50 Miliar
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  Prioritas Fast-Track Asistensi Surety Bond
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  Dukungan Teknis via WhatsApp Prioritas
                </li>
              </ul>
            </div>
            <button
              onClick={() =>
                onSelectPlan({
                  id: "pro",
                  title: "Pro Kontraktor (3 Bulan)",
                  price: 199000,
                })
              }
              className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm transition shadow-lg shadow-amber-500/20"
            >
              Langganan Rp 199.000 via QRIS
            </button>
          </div>

          {/* Plan 3: VIP Tahunan */}
          <div className="flex flex-col justify-between p-8 rounded-3xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">
                VIP Tahunan + Fasilitas Jaminan
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Enterprise 1 Tahun</h3>
              <div className="mb-6">
                <span className="text-4xl font-black text-white">Rp 599.000</span>
                <span className="text-xs text-slate-400"> / tahun</span>
                <div className="text-[11px] text-cyan-400 mt-1 font-semibold">
                  Hanya ~Rp 49.000/bln (Hemat 38%)
                </div>
              </div>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                Untuk perusahaan kontraktor yang menangani multi-proyek sepanjang tahun anggaran kalender.
              </p>
              <ul className="space-y-3 text-xs text-slate-300 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  Akses 365 Hari Seluruh Fitur Tanpa Batas
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <strong>Dedicated Penjaminan Account Officer</strong>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  Free Asistensi Verifikasi Legalitas &amp; Dokumen Bank
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  Penerbitan Polis Express (1-2 Hari Kerja)
                </li>
              </ul>
            </div>
            <button
              onClick={() =>
                onSelectPlan({
                  id: "vip",
                  title: "VIP Tahunan (12 Bulan)",
                  price: 599000,
                })
              }
              className="w-full py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition"
            >
              Langganan Rp 599.000 via QRIS
            </button>
          </div>
        </div>

        {/* Special Bundling Banner (Zero-Cost SaaS Offer) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 border border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
              <Gift className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="inline-block text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 mb-1">
                Program Bundling Solusi Digital
              </div>
              <h4 className="text-lg font-bold text-white">
                Gratis Akses RadarTender.id 1 Tahun dengan Fasilitas Penjaminan Proyek
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                Bila perusahaan Anda menerbitkan Jaminan Proyek (Surety Bond atau Bank Garansi) melalui jaringan agensi rekanan kami, seluruh biaya langganan RadarTender.id selama 1 tahun akan <strong>dibebaskan (Rp 0 / Gratis)</strong> sebagai fasilitas bundling eksklusif dari tim RadarTender.id.
              </p>
            </div>
          </div>
          <a
            href="#kalkulator-jaminan"
            className="shrink-0 px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-amber-500/20"
          >
            Konsultasikan Jaminan Proyek
          </a>
        </div>
      </div>
    </section>
  );
}
