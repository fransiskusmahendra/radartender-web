"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar, UserProfile } from "@/components/Navbar";
import { SuretyCalculator } from "@/components/SuretyCalculator";
import { ComplianceNotice } from "@/components/ComplianceNotice";
import { Footer } from "@/components/Footer";
import { SuretyModal } from "@/components/SuretyModal";
import { EstimationSheetModal } from "@/components/EstimationSheetModal";
import { LoginModal } from "@/components/LoginModal";
import { SubscribeModal } from "@/components/SubscribeModal";
import {
  ShieldAlert,
  ShieldCheck,
  ChevronRight,
  Calculator,
  FileCheck2,
  Clock,
  CheckCircle2,
  PhoneCall,
  Sparkles,
} from "lucide-react";

export default function KalkulatorPage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);

  const [isSuretyModalOpen, setIsSuretyModalOpen] = useState(false);
  const [suretyInitialData, setSuretyInitialData] = useState<{
    guaranteeType?: string;
    projectValue?: number;
    bondValue?: number;
  }>({});

  const [isEstimationModalOpen, setIsEstimationModalOpen] = useState(false);
  const [estimationData, setEstimationData] = useState<{
    tenderTitle?: string;
    tenderCode?: string;
    obligeeName?: string;
    projectValue: number;
    bondType?: string;
    bondValue?: number;
    companyName?: string;
    contactPerson?: string;
  }>({ projectValue: 10000000000 });

  useEffect(() => {
    try {
      const saved = localStorage.getItem("radartender_user_profile");
      if (saved) setUserProfile(JSON.parse(saved));
    } catch (e) {}
  }, []);

  const handleOpenSuretyWithCustomData = (data: {
    guaranteeType: string;
    projectValue: number;
    bondValue: number;
  }) => {
    setSuretyInitialData(data);
    setIsSuretyModalOpen(true);
  };

  const handleOpenEstimation = (data: any) => {
    setEstimationData({
      ...data,
      companyName: userProfile?.companyName,
      contactPerson: userProfile?.contactPerson,
    });
    setIsEstimationModalOpen(true);
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
          <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6">
              <Link href="/" className="hover:text-amber-400 transition">
                Beranda
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-white font-medium">Kalkulator Surety Bond</span>
            </nav>

            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold tracking-wide uppercase mb-4">
                <Calculator className="w-3.5 h-3.5" />
                Simulasi Nilai Jaminan &amp; Estimasi Premi Transparan
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
                Kalkulator Jaminan Proyek{" "}
                <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-300 bg-clip-text text-transparent">
                  LPSE &amp; BUMN
                </span>
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Hitung persentase nilai jaminan (Bid Bond 1-3%, Performance Bond 5%, Uang Muka 5-20%, Pemeliharaan 5%) sesuai regulasi Perpres Pengadaan Barang/Jasa Pemerintah. Unduh lembar draf estimasi PDF langsung untuk kelengkapan administrasi Anda.
              </p>
            </div>

            {/* Quick Benefits Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-slate-900">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Proses Cepat 1-2 Hari</h4>
                  <p className="text-xs text-slate-400">Jalur prioritas fast-track untuk kontraktor terdaftar</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
                  <FileCheck2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Draf Estimasi Siap Cetak</h4>
                  <p className="text-xs text-slate-400">Format PDF rapi berstandar dokumen pengadaan resmi</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Mitra Asuransi &amp; Bank Terkemuka</h4>
                  <p className="text-xs text-slate-400">Dijamin sah dan diakui Pokja LPSE seluruh Indonesia</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Embedded Interactive Calculator */}
        <SuretyCalculator
          onOpenSuretyModalWithData={handleOpenSuretyWithCustomData}
          onOpenEstimationModal={handleOpenEstimation}
        />

        {/* Panduan Ketentuan Jaminan LPSE Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Ketentuan Standar Nilai Jaminan Pengadaan (LKPP / LPSE)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300">
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-amber-400 font-bold uppercase tracking-wider text-[11px] block">
                  1. Jaminan Penawaran (Bid Bond)
                </span>
                <p className="text-slate-400 leading-relaxed">
                  Dipersyaratkan untuk pengadaan pekerjaan konstruksi bernilai di atas Rp 10 Miliar. Besaran jaminan berkisar antara <strong>1% hingga 3%</strong> dari total Nilai HPS (Harga Perkiraan Sendiri). Masa berlaku umumnya 30 s.d. 90 hari kalender.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-cyan-400 font-bold uppercase tracking-wider text-[11px] block">
                  2. Jaminan Pelaksanaan (Performance Bond)
                </span>
                <p className="text-slate-400 leading-relaxed">
                  Diberikan oleh pemenang lelang sebelum penandatanganan kontrak. Besaran jaminan sebesar <strong>5% dari nilai kontrak</strong> (atau 5% dari HPS jika penawaran di bawah 80% HPS). Masa berlaku hingga serah terima pertama (PHO).
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-emerald-400 font-bold uppercase tracking-wider text-[11px] block">
                  3. Jaminan Uang Muka (Advance Payment Bond)
                </span>
                <p className="text-slate-400 leading-relaxed">
                  Wajib diserahkan kontraktor untuk mencairkan uang muka kerja proyek. Nilai jaminan <strong>100% sama dengan jumlah uang muka yang diambil</strong> (maksimal 20% s.d. 30% dari total nilai kontrak).
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-purple-400 font-bold uppercase tracking-wider text-[11px] block">
                  4. Jaminan Pemeliharaan (Maintenance Bond)
                </span>
                <p className="text-slate-400 leading-relaxed">
                  Menjamin masa garansi pemeliharaan pekerjaan fisik setelah PHO hingga Serah Terima Akhir (FHO). Nilai jaminan umumnya <strong>5% dari total nilai kontrak</strong> selama 6 s.d. 12 bulan masa pemeliharaan.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-white">Butuh konsultasi berkas persyaratan jaminan hari ini?</h4>
                <p className="text-xs text-slate-400">Tim kami siap membantu verifikasi dokumen dan pengajuan express.</p>
              </div>
              <a
                href="https://wa.me/6281314620473?text=Halo%20Tim%20RadarTender,%20saya%20ingin%20konsultasi%20pengajuan%20Surety%20Bond/Bank%20Garansi"
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs hover:from-amber-400 hover:to-orange-400 transition flex items-center gap-2 shrink-0"
              >
                <PhoneCall className="w-4 h-4" />
                Hubungi Tim Penjaminan via WhatsApp
              </a>
            </div>
          </div>
        </section>

        <ComplianceNotice />
      </main>

      <Footer />

      <SuretyModal
        isOpen={isSuretyModalOpen}
        onClose={() => setIsSuretyModalOpen(false)}
        initialData={suretyInitialData}
      />

      <EstimationSheetModal
        isOpen={isEstimationModalOpen}
        onClose={() => setIsEstimationModalOpen(false)}
        data={estimationData}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        userProfile={userProfile}
        onSaveProfile={(p) => setUserProfile(p)}
        onOpenSubscribe={() => setIsSubscribeModalOpen(true)}
      />

      <SubscribeModal
        isOpen={isSubscribeModalOpen}
        onClose={() => setIsSubscribeModalOpen(false)}
      />
    </>
  );
}
