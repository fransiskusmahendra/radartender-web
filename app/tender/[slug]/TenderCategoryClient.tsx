"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar, UserProfile } from "@/components/Navbar";
import { TenderFeed } from "@/components/TenderFeed";
import { SuretyCalculator } from "@/components/SuretyCalculator";
import { QiraSynergyBanner } from "@/components/QiraSynergyBanner";
import { FAQSection } from "@/components/FAQSection";
import { Footer } from "@/components/Footer";
import { SubscribeModal } from "@/components/SubscribeModal";
import { SuretyModal } from "@/components/SuretyModal";
import { LoginModal } from "@/components/LoginModal";
import { EstimationSheetModal } from "@/components/EstimationSheetModal";
import { EnrichedTenderItem } from "@/lib/tenders-data";
import { ProgrammaticPageConfig } from "@/lib/programmatic-seo";
import { ChevronRight, ShieldCheck, Sparkles, MapPin, Layers } from "lucide-react";

interface TenderCategoryClientProps {
  config: ProgrammaticPageConfig;
}

export function TenderCategoryClient({ config }: TenderCategoryClientProps) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
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

  const [isSuretyModalOpen, setIsSuretyModalOpen] = useState(false);
  const [suretyInitialData, setSuretyInitialData] = useState<{
    guaranteeType?: string;
    projectValue?: number;
    bondValue?: number;
    tenderTitle?: string;
    tenderCode?: string;
    obligeeName?: string;
    sourceUrl?: string;
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

  const handleSelectTenderForSurety = (tender: EnrichedTenderItem) => {
    setSuretyInitialData({
      tenderTitle: tender.title,
      tenderCode: tender.tender_code,
      obligeeName: tender.agency_name,
      projectValue: tender.hps_value,
      sourceUrl: tender.source_url,
    });
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

  const handleOpenSubscribe = (plan?: any) => {
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

      <main className="flex-1 pt-24 pb-20">
        {/* SEO Header Banner */}
        <section className="bg-slate-950 border-b border-slate-900 py-10 relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-[450px] h-[450px] bg-amber-500/10 blur-[140px] rounded-full pointer-events-none -z-10" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-xs text-slate-400 mb-5">
              <Link href="/" className="hover:text-amber-400 transition">
                Beranda
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href="/#radar-feed" className="hover:text-amber-400 transition">
                Katalog Lelang
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-amber-400 font-semibold">{config.title}</span>
            </nav>

            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                {config.badge}
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                {config.heading}
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {config.description}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  Kluster: <strong className="text-white">{config.category}</strong>
                </span>
                <span className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  Wilayah: <strong className="text-white">{config.region}</strong>
                </span>
                <span className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Asistensi: <strong className="text-white">Surety Bond &amp; Bank Garansi</strong>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Filtered Tender Feed */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <TenderFeed
            onSelectTenderForSurety={handleSelectTenderForSurety}
            isPro={userProfile?.isPro}
            onOpenSubscribe={() => handleOpenSubscribe()}
            onOpenEstimationModal={handleOpenEstimation}
            initialCategory={config.category}
            initialRegion={config.region}
          />
        </section>

        {/* Calculator Widget & Synergy */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12">
          <SuretyCalculator
            onOpenSuretyModal={() => setIsSuretyModalOpen(true)}
            onOpenEstimationModal={handleOpenEstimation}
          />
          <QiraSynergyBanner />
          <FAQSection />
        </section>
      </main>

      <Footer />

      {/* Modals */}
      <SuretyModal
        isOpen={isSuretyModalOpen}
        onClose={() => setIsSuretyModalOpen(false)}
        initialData={suretyInitialData}
      />

      <SubscribeModal
        isOpen={isSubscribeModalOpen}
        onClose={() => setIsSubscribeModalOpen(false)}
        initialPlan={selectedPlan}
      />

      <EstimationSheetModal
        isOpen={isEstimationModalOpen}
        onClose={() => setIsEstimationModalOpen(false)}
        data={estimationData}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={(profile) => setUserProfile(profile)}
      />
    </>
  );
}
