"use client";

import React from "react";
import {
  Code2,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Layers,
  ArrowRight,
  Sparkles,
  PhoneCall,
} from "lucide-react";

export function QiraSynergyBanner() {
  const waConsultUrl =
    "https://wa.me/6281314620473?text=" +
    encodeURIComponent(
      "Halo Pak Mahendra (Qira Solution), saya kontraktor dari RadarTender.id ingin berdiskusi seputar kebutuhan pembuatan sistem monitoring proyek lapangan kustom untuk perusahaan kami."
    );

  return (
    <section className="py-14 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-y border-slate-800/80 relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[450px] h-[450px] bg-amber-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[350px] h-[350px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-950/80 border border-slate-800 backdrop-blur-md shadow-2xl relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                Layanan Rekayasa Sistem Kustom untuk Kontraktor &amp; Vendor
              </div>

              <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                Kewalahan Mengontrol Progres{" "}
                <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-300 bg-clip-text text-transparent">
                  Proyek Lapangan vs Kantor Pusat?
                </span>
              </h3>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Menang tender miliaran adalah awal perjuangan. Melalui <strong>Qira Solution</strong> (Mitra Rekayasa Perangkat Lunak Resmi RadarTender), kami membangun <strong>Sistem Monitoring Proyek Lapangan Kustom</strong> yang 100% mengikuti SOP, format RAB, dan kebiasaan kerja mandor Anda tanpa aplikasi kaku yang membebani tim.
              </p>

              {/* 3 Keunggulan Khusus */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-slate-300">
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    100% Hak Milik
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Source code &amp; database milik perusahaan Anda permanen, bebas biaya sewa bulanan software.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="flex items-center gap-1.5 text-cyan-400 font-bold mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Mudah di HP Mandor
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Opname fisik lapangan, foto progres harian, dan bon material otomatis terekap ke kantor pusat.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Standar Arsitektur CEH
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Dirancang langsung oleh Lead Architect bersertifikasi Certified Ethical Hacker.
                  </p>
                </div>
              </div>

              {/* Call to Action Buttons */}
              <div className="pt-3 flex flex-col sm:flex-row items-center gap-3">
                <a
                  href={waConsultUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs sm:text-sm hover:from-amber-400 hover:to-orange-400 transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                >
                  <PhoneCall className="w-4 h-4" />
                  Konsultasi Alur Sistem Bersama Pak Mahendra
                </a>

                <a
                  href="https://www.qirasolution.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-semibold text-xs sm:text-sm hover:bg-slate-800 transition flex items-center justify-center gap-2"
                >
                  Kunjungi Qira Solution
                  <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                </a>
              </div>
            </div>

            {/* Right Card / Visual Diagram */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  SOP Pemetaan Sistem QIRA
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                  Zero Lock-In
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h5 className="font-bold text-white mb-0.5">Discovery &amp; Pemetaan Masalah Lapangan</h5>
                    <p className="text-slate-400 text-[11px]">
                      Memetakan friksi nota mandor, selisih material, atau keterlambatan laporan mingguan.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h5 className="font-bold text-white mb-0.5">Simulasi Skema Alur Tanpa Biaya</h5>
                    <p className="text-slate-400 text-[11px]">
                      Merancang alur tombol dan modul yang nurut persis ke struktur tim Anda.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h5 className="font-bold text-white mb-0.5">Deploy Cepat &amp; Serah Terima Penuh</h5>
                    <p className="text-slate-400 text-[11px]">
                      Aplikasi aktif di server milik perusahaan klien dengan hak cipta &amp; source code 100% utuh.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2 text-center text-[11px] text-slate-500">
                ⚡ Didukung oleh arsitektur teknologi modern yang aman &amp; reliabel.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
