"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Radar, ShieldCheck, Zap, Menu, X } from "lucide-react";

export function Navbar({ onOpenSuretyModal }: { onOpenSuretyModal: () => void }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 p-0.5 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Radar className="w-5 h-5 text-amber-400 animate-spin-slow" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl text-white tracking-tight">
                RadarTender<span className="text-amber-400">.id</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Intelijen Pengadaan &amp; Penjaminan Proyek
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#radar-feed" className="hover:text-amber-400 transition">
            Radar Tender
          </a>
          <a href="#kalkulator-jaminan" className="hover:text-amber-400 transition">
            Kalkulator Surety Bond
          </a>
          <a href="#harga" className="hover:text-amber-400 transition">
            Biaya Langganan
          </a>
          <a href="#kepatuhan-ojk" className="hover:text-amber-400 transition">
            Regulasi OJK
          </a>
        </nav>

        {/* Action Button */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={onOpenSuretyModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-sm hover:from-amber-400 hover:to-orange-400 transition shadow-lg shadow-amber-500/20"
          >
            <ShieldCheck className="w-4 h-4" />
            Ajukan Jaminan Proyek
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-slate-400 hover:text-white p-2"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 px-4 py-6 space-y-4">
          <a
            href="#radar-feed"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-200 hover:text-amber-400 font-medium"
          >
            Radar Tender
          </a>
          <a
            href="#kalkulator-jaminan"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-200 hover:text-amber-400 font-medium"
          >
            Kalkulator Surety Bond
          </a>
          <a
            href="#harga"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-200 hover:text-amber-400 font-medium"
          >
            Biaya Langganan
          </a>
          <a
            href="#kepatuhan-ojk"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-200 hover:text-amber-400 font-medium"
          >
            Regulasi OJK
          </a>
          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSuretyModal();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-amber-500 text-slate-950 font-bold text-sm"
            >
              <ShieldCheck className="w-4 h-4" />
              Ajukan Jaminan Proyek
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
