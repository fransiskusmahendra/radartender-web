"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Radar, ShieldCheck, User, Crown, Menu, X } from "lucide-react";

interface UserProfile {
  companyName: string;
  contactPerson: string;
  whatsapp: string;
  email?: string;
  isPro?: boolean;
}

interface NavbarProps {
  onOpenSuretyModal: () => void;
  userProfile: UserProfile | null;
  onOpenLoginModal: () => void;
}

export function Navbar({ onOpenSuretyModal, userProfile, onOpenLoginModal }: NavbarProps) {
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
              {userProfile?.isPro ? (
                <span className="text-[10px] uppercase font-black tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center gap-1">
                  <Crown className="w-3 h-3" /> PRO
                </span>
              ) : (
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-400 border border-slate-700">
                  FREE
                </span>
              )}
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
            Regulasi Penjaminan
          </a>
        </nav>

        {/* Action Button & Account Status */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={onOpenLoginModal}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition ${
              userProfile?.isPro
                ? "bg-amber-500/10 border-amber-500/40 text-amber-300 hover:bg-amber-500/20"
                : userProfile
                ? "bg-slate-900 border-slate-700 text-white hover:bg-slate-800"
                : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            {userProfile ? (
              <span className="truncate max-w-[120px]">{userProfile.companyName || userProfile.contactPerson}</span>
            ) : (
              <span>Masuk / Akun</span>
            )}
          </button>

          <button
            onClick={onOpenSuretyModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-sm hover:from-amber-400 hover:to-orange-400 transition shadow-lg shadow-amber-500/20"
          >
            <ShieldCheck className="w-4 h-4" />
            Ajukan Jaminan Proyek
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={onOpenLoginModal}
            className="text-xs text-slate-300 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800"
          >
            {userProfile ? userProfile.companyName.slice(0, 10) : "Akun"}
          </button>
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
            Regulasi Penjaminan
          </a>
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLoginModal();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 text-slate-200 font-bold text-sm border border-slate-800"
            >
              <User className="w-4 h-4" />
              {userProfile ? `Profil: ${userProfile.companyName}` : "Masuk / Identitas Akun"}
            </button>
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
