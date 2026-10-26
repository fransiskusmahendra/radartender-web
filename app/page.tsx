"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { TenderFeed } from "@/components/TenderFeed";
import { SuretyCalculator } from "@/components/SuretyCalculator";
import { PricingSection } from "@/components/PricingSection";
import { ComplianceNotice } from "@/components/ComplianceNotice";
import { Footer } from "@/components/Footer";
import { SubscribeModal } from "@/components/SubscribeModal";
import { SuretyModal } from "@/components/SuretyModal";
import { EnrichedTenderItem } from "@/lib/tenders-data";

export default function HomePage() {
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{
    id: "starter" | "pro" | "vip";
    title: string;
    price: number;
  }>({
    id: "pro",
    title: "Pro Kontraktor (3 Bulan)",
    price: 249000,
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

  return (
    <>
      <Navbar onOpenSuretyModal={() => setIsSuretyModalOpen(true)} />

      <main className="flex-1">
        <Hero onOpenSubscribeModal={() => handleOpenSubscribe()} />
        <TenderFeed onSelectTenderForSurety={handleSelectTenderForSurety} />
        <SuretyCalculator onOpenSuretyModalWithData={handleOpenSuretyWithCustomData} />
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
    </>
  );
}
