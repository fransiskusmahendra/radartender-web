"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar, UserProfile } from "@/components/Navbar";
import { PricingSection } from "@/components/PricingSection";
import { FAQSection } from "@/components/FAQSection";
import { Footer } from "@/components/Footer";
import { SubscribeModal } from "@/components/SubscribeModal";
import { LoginModal } from "@/components/LoginModal";
import { SuretyModal } from "@/components/SuretyModal";
import {
  Zap,
  ChevronRight,
  ShieldCheck,
  Check,
  X,
  CreditCard,
  QrCode,
  Building2,
  Sparkles,
  Crown,
  HelpCircle,
} from "lucide-react";

export default function HargaPage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSuretyModalOpen, setIsSuretyModalOpen] = useState(false);

  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{
    id: "starter" | "pro" | "vip";
    title: string;
    price: number;
  }>({
    id: "pro",
    title: "Pro Kontraktor (3 Bulan)",
    price: 199000,
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem("radartender_user_profile");
      if (saved) setUserProfile(JSON.parse(saved));
    } catch (e) {}
  }, []);

  const handleOpenSubscribe = (plan?: {
    id: "starter" | "pro" | "vip";
    title: string;
    price: number;
  }) => {
    if (plan) setSelectedPlan(plan);
    setIsSubscribeModalOpen(true);
  };

  return (
    <>
      <Navbar
        onOpenSuretyModal={() => setIsSuretyModalOpen(true)}
        userProfile={userProfile}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
      />

      <main className="flex-1 pt-28 pb-20">
        {/* Breadcrumb & Hero Header */}
        <section className="bg-slate-950 border-b border-slate-900 py-10 relative overflow-hidden">
          <div className="absolute top-0 left-1/3 w-[450px] h-[450px] bg-amber-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6">
              <Link href="/" className="hover:text-amber-400 transition">
                Beranda
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-white font-medium">Biaya Langganan</span>
            </nav>

            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold tracking-wide uppercase mb-4">
                <Zap className="w-3.5 h-3.5" />
                Investasi Cerdas untuk Kontraktor &amp; Vendor Nasional
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-4">
                Pilihan Paket Langganan{" "}
                <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-300 bg-clip-text text-transparent">
                  RadarTender.id
                </span>
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Dapatkan akses tanpa batas ke 500+ tender aktif LPSE &amp; BUMN se-Indonesia, alert kurasi lelang langsung ke WhatsApp Anda, dan jalur prioritas pengurusan jaminan proyek.
              </p>
            </div>
          </div>
        </section>

        {/* Embedded Pricing Section */}
        <PricingSection onSelectPlan={(plan) => handleOpenSubscribe(plan)} />

        {/* Detailed Feature Comparison Table */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h3 className="text-2xl font-bold text-white mb-2">Tabel Perbandingan Fitur Paket</h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Pilih paket yang paling sesuai dengan kebutuhan frekuensi lelang dan ukuran tim Anda.
            </p>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-950/70">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/80">
                  <th className="p-4 sm:p-5 text-slate-300 font-bold text-sm w-2/5">Fitur Layanan</th>
                  <th className="p-4 sm:p-5 text-center text-slate-300 font-bold">
                    <span className="block text-white text-sm">Starter</span>
                    <span className="text-slate-400 text-[11px] font-normal">Rp 79rb / bln</span>
                  </th>
                  <th className="p-4 sm:p-5 text-center text-amber-400 font-bold bg-amber-500/10 border-x border-amber-500/20">
                    <span className="inline-flex items-center gap-1 text-amber-300 text-sm">
                      <Crown className="w-3.5 h-3.5" /> Pro Kontraktor
                    </span>
                    <span className="text-amber-400/80 text-[11px] font-normal block">Rp 199rb / 3 bln</span>
                  </th>
                  <th className="p-4 sm:p-5 text-center text-slate-300 font-bold">
                    <span className="block text-white text-sm">VIP Tahunan</span>
                    <span className="text-slate-400 text-[11px] font-normal">Rp 599rb / thn</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-white">Masa Aktif Akses</td>
                  <td className="p-4 sm:p-5 text-center">30 Hari</td>
                  <td className="p-4 sm:p-5 text-center font-bold text-amber-300 bg-amber-500/5 border-x border-amber-500/20">
                    90 Hari (3 Bulan)
                  </td>
                  <td className="p-4 sm:p-5 text-center">365 Hari (1 Tahun)</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-white">Akses Radar Tender LPSE &amp; BUMN</td>
                  <td className="p-4 sm:p-5 text-center">100+ Tender Terbuka</td>
                  <td className="p-4 sm:p-5 text-center font-bold text-amber-300 bg-amber-500/5 border-x border-amber-500/20">
                    500+ Tender Lengkap (Semua Sektor)
                  </td>
                  <td className="p-4 sm:p-5 text-center">Seluruh Tender Nasional &amp; IKN</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-white">Hitung Mundur Batas Dokumen Real-Time</td>
                  <td className="p-4 sm:p-5 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                  <td className="p-4 sm:p-5 text-center bg-amber-500/5 border-x border-amber-500/20"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                  <td className="p-4 sm:p-5 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-white">Notifikasi Alert Harian WhatsApp</td>
                  <td className="p-4 sm:p-5 text-center"><X className="w-4 h-4 text-slate-600 mx-auto" /></td>
                  <td className="p-4 sm:p-5 text-center font-semibold text-amber-300 bg-amber-500/5 border-x border-amber-500/20">
                    Terkurasi Sesuai Wilayah/Klaster
                  </td>
                  <td className="p-4 sm:p-5 text-center">Prioritas Harian WhatsApp VIP</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-white">Kalkulator Penjaminan &amp; Unduh PDF Estimasi</td>
                  <td className="p-4 sm:p-5 text-center">Draf Standar</td>
                  <td className="p-4 sm:p-5 text-center font-bold text-amber-300 bg-amber-500/5 border-x border-amber-500/20">
                    Tanpa Batas &amp; Siap Cetak
                  </td>
                  <td className="p-4 sm:p-5 text-center">Unlimited &amp; Asistensi Khusus</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-white">Asistensi Pengurusan Surety Bond &amp; Bank Garansi</td>
                  <td className="p-4 sm:p-5 text-center">Konsultasi Standar</td>
                  <td className="p-4 sm:p-5 text-center font-bold text-amber-300 bg-amber-500/5 border-x border-amber-500/20">
                    Fast-Track 1-2 Hari Kerja
                  </td>
                  <td className="p-4 sm:p-5 text-center">Jalur Express Prioritas VIP</td>
                </tr>
                <tr className="bg-slate-900/40">
                  <td className="p-4 sm:p-5 font-bold text-white">Aksi Pemesanan</td>
                  <td className="p-4 sm:p-5 text-center">
                    <button
                      onClick={() => handleOpenSubscribe({ id: "starter", title: "Starter Bulanan", price: 79000 })}
                      className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
                    >
                      Pilih Starter
                    </button>
                  </td>
                  <td className="p-4 sm:p-5 text-center bg-amber-500/10 border-x border-amber-500/20">
                    <button
                      onClick={() => handleOpenSubscribe({ id: "pro", title: "Pro Kontraktor (3 Bulan)", price: 199000 })}
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs transition shadow-md shadow-amber-500/20"
                    >
                      Pilih Pro (Populer)
                    </button>
                  </td>
                  <td className="p-4 sm:p-5 text-center">
                    <button
                      onClick={() => handleOpenSubscribe({ id: "vip", title: "VIP Tahunan (1 Tahun)", price: 599000 })}
                      className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
                    >
                      Pilih VIP
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Payment Gateways & Instant Activation Info */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/50 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                Pembayaran Otomatis &amp; Terverifikasi
              </div>
              <h4 className="text-lg font-bold text-white">Didukung Gerbang Pembayaran Resmi Midtrans</h4>
              <p className="text-xs text-slate-400 max-w-xl">
                Pembayaran Anda diproses secara aman menggunakan enkripsi standar industri perbankan. Mendukung QRIS (GoPay, OVO, Dana, ShopeePay, BCA Mobile), Virtual Account Bank (BCA, Mandiri, BNI, BRI, Permata), dan Kartu Kredit.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">
              <span className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-300 inline-flex items-center gap-1.5">
                <QrCode className="w-3.5 h-3.5 text-amber-400" /> QRIS Instan
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-300 inline-flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-cyan-400" /> VA Bank Otomatis
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-300 inline-flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-emerald-400" /> Kartu Kredit
              </span>
            </div>
          </div>
        </section>

        <FAQSection />
      </main>

      <Footer />

      <SubscribeModal
        isOpen={isSubscribeModalOpen}
        onClose={() => setIsSubscribeModalOpen(false)}
        initialPlan={selectedPlan}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        userProfile={userProfile}
        onSaveProfile={(p) => setUserProfile(p)}
        onOpenSubscribe={() => setIsSubscribeModalOpen(true)}
      />

      <SuretyModal
        isOpen={isSuretyModalOpen}
        onClose={() => setIsSuretyModalOpen(false)}
      />
    </>
  );
}
