"use client";

import React from "react";
import Link from "next/link";
import { Radar, Shield, ExternalLink, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Radar className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg text-white tracking-tight">
                RadarTender<span className="text-amber-400">.id</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Platform intelijen pengadaan lelang nasional (LPSE / SPSE / SIRUP / BUMN) terintegrasi simulasi dan layanan asistensi penerbitan Surety Bond &amp; Bank Garansi terpercaya.
            </p>
            <div className="pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                <span>⚡ Engineered &amp; Managed by</span>
                <a
                  href="https://www.qirasolution.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-amber-400 hover:underline flex items-center gap-1"
                >
                  Qira
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Navigasi Layanan */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Layanan Intelijen
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#radar-feed" className="hover:text-white transition">
                  Radar Tender LPSE
                </a>
              </li>
              <li>
                <a href="#kalkulator-jaminan" className="hover:text-white transition">
                  Kalkulator Jaminan Proyek
                </a>
              </li>
              <li>
                <a href="#harga" className="hover:text-white transition">
                  Paket Langganan Notifikasi
                </a>
              </li>
              <li>
                <a href="#faq-lelang" className="hover:text-white transition">
                  Tanya Jawab &amp; FAQ
                </a>
              </li>
              <li>
                <a href="#kepatuhan-ojk" className="hover:text-white transition">
                  SOP Kepatuhan Regulasi
                </a>
              </li>
            </ul>
          </div>

          {/* Produk Penjaminan */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Produk Penjaminan
            </h4>
            <ul className="space-y-2 text-xs">
              <li>Jaminan Penawaran (Bid Bond)</li>
              <li>Jaminan Pelaksanaan (Performance Bond)</li>
              <li>Jaminan Uang Muka (Advance Payment Bond)</li>
              <li>Jaminan Pemeliharaan (Maintenance Bond)</li>
              <li>Kontra Bank Garansi Devisa</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} RadarTender.id — All rights reserved.</p>
          <p className="flex items-center gap-1">
            Teknologi Pengadaan Digital Karya Anak Bangsa
          </p>
        </div>
      </div>
    </footer>
  );
}
