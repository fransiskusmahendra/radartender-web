"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { TenderFeed } from "@/components/TenderFeed";
import { SuretyCalculator } from "@/components/SuretyCalculator";
import { PricingSection } from "@/components/PricingSection";
import { FAQSection } from "@/components/FAQSection";
import { ComplianceNotice } from "@/components/ComplianceNotice";
import { Footer } from "@/components/Footer";
import { SubscribeModal } from "@/components/SubscribeModal";
import { SuretyModal } from "@/components/SuretyModal";
import { LoginModal } from "@/components/LoginModal";
import { EstimationSheetModal } from "@/components/EstimationSheetModal";
import { EnrichedTenderItem } from "@/lib/tenders-data";
import { Crown, CheckCircle2, Sparkles, X } from "lucide-react";

export interface UserProfile {
  companyName: string;
  contactPerson: string;
  whatsapp: string;
  email?: string;
  isPro?: boolean;
  activationCode?: string;
  planTitle?: string;
  daysRemaining?: number;
  expiresAt?: string;
  orderId?: string;
  cluster?: string;
  preferredRegion?: string;
  specialKeywords?: string;
}

export default function HomePage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

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

  // Load user profile & check 1-click activation link (e.g. ?activate=RT-XXXX or ?activate=PRO)
  useEffect(() => {
    try {
      const saved = localStorage.getItem("radartender_user_profile");
      let currentProfile: UserProfile | null = saved ? JSON.parse(saved) : null;

      // Check URL query parameters for instant 1-click activation from WhatsApp
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("activate") || params.get("code");

        if (code) {
          const clean = code.trim().toUpperCase();
          if (
            clean.startsWith("RT-") ||
            clean === "PRO" ||
            clean === "RADARPRO" ||
            clean === "QIRA-PRO" ||
            clean.startsWith("VIP")
          ) {
            currentProfile = {
              companyName: currentProfile?.companyName || "Perusahaan Kontraktor",
              contactPerson: currentProfile?.contactPerson || "",
              whatsapp: currentProfile?.whatsapp || "",
              isPro: true,
              activationCode: clean,
            };
            localStorage.setItem("radartender_user_profile", JSON.stringify(currentProfile));
            setShowCelebration(true);
          }
        }
      }

      setUserProfile(currentProfile);

      // Silent cloud verification to keep daysRemaining and expiry up to date
      if (currentProfile && (currentProfile.whatsapp || currentProfile.activationCode)) {
        fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            whatsapp: currentProfile.whatsapp,
            accessCode: currentProfile.activationCode,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success && data.user) {
              const updated: UserProfile = {
                ...currentProfile!,
                isPro: Boolean(data.isPro),
                planTitle: data.user.planTitle || currentProfile?.planTitle,
                daysRemaining: data.daysRemaining,
                expiresAt: data.user.expiresAt || currentProfile?.expiresAt,
                orderId: data.user.orderId || currentProfile?.orderId,
                cluster: data.user.cluster || currentProfile?.cluster,
                preferredRegion: data.user.preferredRegion || currentProfile?.preferredRegion,
                specialKeywords: data.user.specialKeywords || currentProfile?.specialKeywords,
              };
              setUserProfile(updated);
              localStorage.setItem("radartender_user_profile", JSON.stringify(updated));
            }
          })
          .catch(() => {});
      }
    } catch (e) {}
  }, []);

  const handleSaveProfile = (profile: UserProfile | null) => {
    setUserProfile(profile);
    if (profile) {
      localStorage.setItem("radartender_user_profile", JSON.stringify(profile));
      if (profile.isPro) {
        setShowCelebration(true);
      }
    } else {
      localStorage.removeItem("radartender_user_profile");
    }
  };

  const handleOpenSubscribe = (plan?: {
    id: "starter" | "pro" | "vip";
    title: string;
    price: number;
  }) => {
    if (plan) setSelectedPlan(plan);
    setIsSubscribeModalOpen(true);
  };

  const handleSelectTenderForSurety = (tender: EnrichedTenderItem) => {
    setSuretyInitialData({
      guaranteeType: "Jaminan Penawaran (Bid Bond)",
      projectValue: tender.hps_value,
      bondValue: tender.bid_bond_min,
      tenderTitle: tender.title,
      tenderCode: tender.tender_code,
      obligeeName: tender.agency_name,
      sourceUrl: tender.source_url,
    });
    setIsSuretyModalOpen(true);
  };

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

      {/* Celebration Banner when PRO is successfully activated */}
      {showCelebration && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-lg p-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 text-slate-950 shadow-2xl flex items-center justify-between gap-3 animate-bounce-once">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-950/20 flex items-center justify-center shrink-0">
              <Crown className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider block">
                🎉 Selamat! Akun PRO Telah Aktif
              </span>
              <span className="text-xs font-medium">
                Seluruh 500+ lelang &amp; kalkulasi penjaminan telah terbuka penuh untuk Anda.
              </span>
            </div>
          </div>
          <button
            onClick={() => setShowCelebration(false)}
            className="p-1 rounded-lg hover:bg-slate-950/20 text-slate-950"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      <main className="flex-1">
        <Hero onOpenSubscribeModal={() => handleOpenSubscribe()} />

        <TenderFeed
          onSelectTenderForSurety={handleSelectTenderForSurety}
          isPro={Boolean(userProfile?.isPro)}
          onOpenSubscribe={() => handleOpenSubscribe()}
          onOpenEstimationModal={handleOpenEstimation}
        />

        <SuretyCalculator
          onOpenSuretyModalWithData={handleOpenSuretyWithCustomData}
          onOpenEstimationModal={handleOpenEstimation}
        />

        <PricingSection onSelectPlan={(plan) => handleOpenSubscribe(plan)} />

        <FAQSection />

        <ComplianceNotice />
      </main>

      <Footer />

      <SubscribeModal
        isOpen={isSubscribeModalOpen}
        onClose={() => setIsSubscribeModalOpen(false)}
        initialPlan={selectedPlan}
      />

      <SuretyModal
        isOpen={isSuretyModalOpen}
        onClose={() => setIsSuretyModalOpen(false)}
        initialData={suretyInitialData}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        userProfile={userProfile}
        onSaveProfile={handleSaveProfile}
        onOpenSubscribe={() => handleOpenSubscribe()}
      />

      <EstimationSheetModal
        isOpen={isEstimationModalOpen}
        onClose={() => setIsEstimationModalOpen(false)}
        data={estimationData}
      />
    </>
  );
}
