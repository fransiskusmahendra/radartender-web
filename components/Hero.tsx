"use client";

import React from "react";
import { Radar, Bell, Shield, ArrowRight, CheckCircle2 } from "lucide-react";

export function Hero({ onOpenSubscribeModal }: { onOpenSubscribeModal: () => void }) {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background radial gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-orange-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold tracking-wide uppercase mb-6 animate-pulse">
          <Radar className="w-3.5 h-3.5 text-amber-400" />
          Intelijen Tender LPSE &amp; BUMN Terintegrasi Jaminan Proyek
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto mb-6">
          Jangan Ketinggalan Tender Miliaran &amp; Terkendala{" "}
          <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-300 bg-clip-text text-transparent">
            Jaminan Proyek Lagi.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">
          Pantau lelang pemerintah &amp; BUMN (SPSE / LPSE / SIRUP) secara real-time dengan hitung mundur batas upload, dilengkapi kalkulator instan serta fast-track penerbitan <strong>Surety Bond &amp; Bank Garansi</strong> resmi berizin OJK.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <a
            href="#radar-feed"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-base hover:from-amber-400 hover:to-orange-400 transition shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 group"
          >
            Lihat Tender Aktif Hari Ini
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
          </a>
          <button
            onClick={onOpenSubscribeModal}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900 border border-slate-700 text-white font-semibold text-base hover:bg-slate-800 transition flex items-center justify-center gap-2"
          >
            <Bell className="w-4 h-4 text-amber-400" />
            Berlangganan Notifikasi WhatsApp (Mulai Rp 99rb)
          </button>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-amber-400 mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Update Harian</span>
            </div>
            <p className="text-lg font-bold text-white">500+ Paket Lelang</p>
            <p className="text-xs text-slate-400">LPSE &amp; BUMN se-Indonesia</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-cyan-400 mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Hitung Mundur</span>
            </div>
            <p className="text-lg font-bold text-white">Anti Gagal Upload</p>
            <p className="text-xs text-slate-400">Tracking batas submisi lelang</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-emerald-400 mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Surety Bond Cepat</span>
            </div>
            <p className="text-lg font-bold text-white">1 - 2 Hari Terbit</p>
            <p className="text-xs text-slate-400">Asuransi &amp; Bank Devisa Rekanan</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-purple-400 mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Kepatuhan OJK</span>
            </div>
            <p className="text-lg font-bold text-white">100% Legal &amp; Resmi</p>
            <p className="text-xs text-slate-400">Tanpa praktik rebating ilegal</p>
          </div>
        </div>
      </div>
    </section>
  );
}
