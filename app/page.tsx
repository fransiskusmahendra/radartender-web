"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { TenderFeed } from "@/components/TenderFeed";
import { SuretyCalculator } from "@/components/SuretyCalculator";
import { PricingSection } from "@/components/PricingSection";
import { ComplianceNotice } from "@/components/ComplianceNotice";
import { Footer } from "@/components/Footer";
import { SubscribeModal } from "@/components/SubscribeModal";
import { SuretyModal } from "@/components/SuretyModal";
import { LoginModal } from "@/components/LoginModal";
import { EstimationSheetModal } from "@/components/EstimationSheetModal";
import { EnrichedTenderItem } from "@/lib/tenders-data";

interface UserProfile {
  companyName: string;
  contactPerson: string;
  whatsapp: string;
  email?: string;
  isPro?: boolean;
}

export default function HomePage() {
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

  // Load user profile on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("radartender_user_profile");
      if (saved) {
        setUserProfile(JSON.parse(saved));
      }
    } catch (e) {}
  }, []);

  const handleSaveProfile = (profile: UserProfile | null) => {
    setUserProfile(profile);
    if (profile) {
      localStorage.setItem("radartender_user_profile", JSON.stringify(profile));
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
      />

      <EstimationSheetModal
        isOpen={isEstimationModalOpen}
        onClose={() => setIsEstimationModalOpen(false)}
        data={estimationData}
      />
    </>
  );
}
