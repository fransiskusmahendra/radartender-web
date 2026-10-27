"use client";

import React from "react";
import { Radar, Bell, ArrowRight, CheckCircle2, ChevronDown } from "lucide-react";

export function Hero({ onOpenSubscribeModal }: { onOpenSubscribeModal: () => void }) {
  return (
    <section className="relative pt-28 pb-10 md:pt-36 md:pb-14 overflow-hidden">
      {/* Background radial gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-amber-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-1/4 w-[320px] h-[320px] bg-orange-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold tracking-wide uppercase mb-5 animate-pulse">
          <Radar className="w-3.5 h-3.5 text-amber-400" />
          Intelijen Tender LPSE &amp; BUMN Terintegrasi Jaminan Proyek
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto mb-5">
          Jangan Ketinggalan Tender Miliaran &amp; Terkendala{" "}
          <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-300 bg-clip-text text-transparent">
            Jaminan Proyek Lagi.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
          Pantau lelang pemerintah &amp; BUMN se-Indonesia dengan hitung mundur batas dokumen, kalkulator instan, dan asistensi cepat penerbitan <strong>Surety Bond &amp; Bank Garansi</strong> resmi.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-8">
          <a
            href="#radar-feed"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-sm sm:text-base hover:from-amber-400 hover:to-orange-400 transition shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 group"
          >
            Lihat Tender Aktif Hari Ini
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </a>
          <button
            onClick={onOpenSubscribeModal}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-semibold text-sm sm:text-base hover:bg-slate-800 transition flex items-center justify-center gap-2"
          >
            <Bell className="w-4 h-4 text-amber-400" />
            Notifikasi WhatsApp (Mulai Rp 79rb)
          </button>
        </div>

        {/* Streamlined Trust Badges (Horizontal Pills - Space Saving) */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 max-w-4xl mx-auto text-xs text-slate-300 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800/80 backdrop-blur-sm">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="font-bold text-white">500+ Paket Lelang</span>
            <span className="text-slate-400 hidden sm:inline">LPSE &amp; BUMN</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800/80 backdrop-blur-sm">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="font-bold text-white">Hitung Mundur</span>
            <span className="text-slate-400 hidden sm:inline">Anti Gagal Upload</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800/80 backdrop-blur-sm">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="font-bold text-white">Surety Bond 1-2 Hari</span>
            <span className="text-slate-400 hidden sm:inline">Asuransi &amp; Bank Devisa</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800/80 backdrop-blur-sm">
            <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span className="font-bold text-white">100% Legal &amp; Resmi</span>
            <span className="text-slate-400 hidden sm:inline">Kepatuhan Regulasi</span>
          </div>
        </div>

        {/* Peek Indicator to draw attention to live feed below */}
        <a
          href="#radar-feed"
          className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-amber-400/90 hover:text-amber-300 transition animate-bounce"
        >
          <span>Lelang Terkini Langsung di Bawah</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </a>
      </div>
    </section>
  );
}
