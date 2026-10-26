"use client";

import React, { useState, useMemo } from "react";
import {
  getEnrichedTenders,
  formatRupiah,
  EnrichedTenderItem,
} from "@/lib/tenders-data";
import {
  Search,
  Filter,
  Clock,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Building2,
  DollarSign,
  AlertTriangle,
  Lock,
  Zap,
  MessageCircle,
  Crown,
  FileText,
} from "lucide-react";

const CATEGORIES = [
  "Semua Kluster",
  "Pekerjaan Konstruksi",
  "Pengadaan Barang",
  "Jasa Konsultansi",
  "Jasa Lainnya",
];

const REGIONS = [
  "Semua Wilayah",
  "IKN & Kalimantan",
  "DKI Jakarta",
  "Jawa Timur",
  "Jawa Barat",
  "Jawa Tengah",
  "Sumatera",
  "Sulawesi",
];

const URGENCIES = [
  "Semua Waktu",
  "🔥 Segera Ditutup (≤ 3 Hari)",
  "⚡ Sedang Buka (4-7 Hari)",
  "✨ Baru Tayang (> 7 Hari)",
];

const HPS_RANGES = [
  "Semua Nilai Proyek",
  "Rp 1 Miliar - Rp 10 Miliar",
  "Rp 10 Miliar - Rp 50 Miliar",
  "Mega Proyek (> Rp 50 Miliar)",
];

interface TenderFeedProps {
  onSelectTenderForSurety: (tender: EnrichedTenderItem) => void;
  isPro?: boolean;
  onOpenSubscribe: () => void;
  onOpenEstimationModal: (data: any) => void;
}

export function TenderFeed({
  onSelectTenderForSurety,
  isPro,
  onOpenSubscribe,
  onOpenEstimationModal,
}: TenderFeedProps) {
  const [selectedCategory, setSelectedCategory] = useState("Semua Kluster");
  const [selectedRegion, setSelectedRegion] = useState("Semua Wilayah");
  const [selectedUrgency, setSelectedUrgency] = useState("Semua Waktu");
  const [selectedHps, setSelectedHps] = useState("Semua Nilai Proyek");
  const [searchQuery, setSearchQuery] = useState("");

  const tendersData = useMemo(() => getEnrichedTenders(), []);

  const filteredTenders = useMemo(() => {
    return tendersData.filter((item) => {
      // Category match
      const matchCat =
        selectedCategory === "Semua Kluster" || item.procurement_type === selectedCategory;

      // Region match
      let matchReg = true;
      if (selectedRegion !== "Semua Wilayah") {
        if (selectedRegion === "IKN & Kalimantan") {
          matchReg = item.location.toLowerCase().includes("ikn") || item.location.toLowerCase().includes("kaltim");
        } else if (selectedRegion === "DKI Jakarta") {
          matchReg = item.location.toLowerCase().includes("jakarta");
        } else if (selectedRegion === "Jawa Timur") {
          matchReg = item.location.toLowerCase().includes("jawa timur") || item.location.toLowerCase().includes("surabaya");
        } else if (selectedRegion === "Jawa Barat") {
          matchReg = item.location.toLowerCase().includes("jawa barat") || item.location.toLowerCase().includes("bandung");
        } else if (selectedRegion === "Jawa Tengah") {
          matchReg = item.location.toLowerCase().includes("jawa tengah") || item.location.toLowerCase().includes("semarang");
        } else if (selectedRegion === "Sumatera") {
          matchReg = item.location.toLowerCase().includes("sumatera") || item.location.toLowerCase().includes("padang");
        } else if (selectedRegion === "Sulawesi") {
          matchReg = item.location.toLowerCase().includes("sulawesi") || item.location.toLowerCase().includes("makassar");
        }
      }

      // Urgency match
      let matchUrg = true;
      if (selectedUrgency.includes("≤ 3 Hari")) {
        matchUrg = item.days_remaining <= 3;
      } else if (selectedUrgency.includes("4-7 Hari")) {
        matchUrg = item.days_remaining >= 4 && item.days_remaining <= 7;
      } else if (selectedUrgency.includes("> 7 Hari")) {
        matchUrg = item.days_remaining > 7;
      }

      // HPS match
      let matchHps = true;
      if (selectedHps === "Rp 1 Miliar - Rp 10 Miliar") {
        matchHps = item.hps_value >= 1_000_000_000 && item.hps_value <= 10_000_000_000;
      } else if (selectedHps === "Rp 10 Miliar - Rp 50 Miliar") {
        matchHps = item.hps_value > 10_000_000_000 && item.hps_value <= 50_000_000_000;
      } else if (selectedHps === "Mega Proyek (> Rp 50 Miliar)") {
        matchHps = item.hps_value > 50_000_000_000;
      }

      // Search match
      const matchSearch =
        searchQuery === "" ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.agency_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tender_code.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCat && matchReg && matchUrg && matchHps && matchSearch;
    });
  }, [tendersData, selectedCategory, selectedRegion, selectedUrgency, selectedHps, searchQuery]);

  const totalHpsSum = useMemo(() => {
    return filteredTenders.reduce((acc, curr) => acc + curr.hps_value, 0);
  }, [filteredTenders]);

  return (
    <section id="radar-feed" className="py-16 md:py-24 bg-slate-900/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* WhatsApp Bot Alert Pitch Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-amber-500/10 border border-emerald-500/30 mb-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">
                  Bot WhatsApp Radar Tender
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-bold">
                  AUTO-ALERT
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 mt-0.5">
                Ingin lelang di wilayah Anda dikirim otomatis ke WhatsApp setiap pagi pukul 08:30 WIB?
              </p>
            </div>
          </div>
          <button
            onClick={onOpenSubscribe}
            className="shrink-0 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5" />
            Aktifkan Alert WhatsApp (Mulai Rp 66rb/bln)
          </button>
        </div>

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              Live Procurement Feed
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Radar Tender &amp; Lelang Aktif
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Data paket pengadaan terkurasi nilai HPS &gt; Rp 1 Miliar dengan estimasi kebutuhan Jaminan Penawaran &amp; Pelaksanaan.
            </p>
          </div>
          <div className="mt-4 md:mt-0 text-left md:text-right">
            <span className="text-xs text-slate-400 block">Total Nilai HPS Terfilter:</span>
            <span className="text-2xl font-black text-amber-400">
              {formatRupiah(totalHpsSum)}
            </span>
          </div>
        </div>

        {/* Filter Toolbar (5 Columns including Region) */}
        <div className="p-4 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 mb-10 shadow-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Search Input */}
            <div className="relative lg:col-span-1 sm:col-span-2">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="text"
                placeholder="Cari kata kunci..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500 placeholder:text-slate-500"
              />
            </div>

            {/* Region Filter */}
            <div>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
              >
                {REGIONS.map((reg) => (
                  <option key={reg} value={reg}>
                    📍 {reg}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Urgency Filter */}
            <div>
              <select
                value={selectedUrgency}
                onChange={(e) => setSelectedUrgency(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
              >
                {URGENCIES.map((urg) => (
                  <option key={urg} value={urg}>
                    {urg}
                  </option>
                ))}
              </select>
            </div>

            {/* HPS Filter */}
            <div>
              <select
                value={selectedHps}
                onChange={(e) => setSelectedHps(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
              >
                {HPS_RANGES.map((hps) => (
                  <option key={hps} value={hps}>
                    {hps}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tenders Grid */}
        {filteredTenders.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/50 rounded-2xl border border-dashed border-slate-800">
            <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">Tidak Ada Paket Tender Ditemukan</h3>
            <p className="text-sm text-slate-400">
              Coba ganti filter kluster, wilayah, batas waktu, atau hapus kata kunci pencarian Anda.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredTenders.map((tender, index) => {
              // Freemium Gate: If not PRO, tenders after index 3 are locked / preview mode
              const isLocked = !isPro && index >= 4;

              return (
                <div
                  key={tender.id}
                  className="flex flex-col justify-between p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition duration-200 group relative overflow-hidden"
                >
                  {/* Top badges */}
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {tender.tender_code}
                      </span>
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${
                          tender.urgency_badge === "urgent"
                            ? "bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse"
                            : tender.urgency_badge === "active"
                            ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                            : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        {tender.days_remaining <= 2
                          ? `🔥 ${tender.days_remaining * 24} Jam Menuju Penutupan`
                          : tender.urgency_label}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition leading-snug mb-3">
                      {tender.title}
                    </h3>

                    {/* Agency & Location */}
                    <div className="space-y-1.5 text-xs text-slate-400 mb-5">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="truncate">{tender.agency_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>{tender.location}</span>
                      </div>
                    </div>

                    {/* Locked View overlay for free accounts */}
                    {isLocked ? (
                      <div className="p-5 rounded-2xl bg-slate-950/90 border border-amber-500/30 text-center mb-6 relative">
                        <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center mx-auto mb-2">
                          <Lock className="w-5 h-5" />
                        </div>
                        <h4 className="text-sm font-bold text-white">
                          Rincian HPS &amp; Dokumen Lelang Terkunci
                        </h4>
                        <p className="text-xs text-slate-400 mt-1 mb-3">
                          Tersedia lengkap untuk Akun Berlangganan PRO Kontraktor.
                        </p>
                        <button
                          onClick={onOpenSubscribe}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs uppercase tracking-wider hover:brightness-110 transition shadow-md shadow-amber-500/20 inline-flex items-center gap-1.5"
                        >
                          <Crown className="w-3.5 h-3.5" />
                          Buka Akses 500+ Lelang PRO
                        </button>
                      </div>
                    ) : (
                      <>
                        {/* HPS Value Box */}
                        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 mb-5">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-slate-400">Nilai HPS / Pagu:</span>
                            <span className="text-xs text-cyan-400 font-semibold">{tender.procurement_type}</span>
                          </div>
                          <div className="text-xl font-extrabold text-white">
                            {formatRupiah(tender.hps_value)}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            Tahapan saat ini: <span className="text-slate-300 font-medium">{tender.current_stage}</span>
                          </div>
                        </div>

                        {/* Surety Bond Estimates */}
                        <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 mb-6">
                          <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold mb-2">
                            <ShieldCheck className="w-4 h-4" />
                            Estimasi Kebutuhan Jaminan Proyek (Surety Bond)
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-slate-400 block text-[11px]">Jaminan Penawaran (1-3%):</span>
                              <span className="text-slate-200 font-semibold">
                                {formatRupiah(tender.bid_bond_min)} s/d {formatRupiah(tender.bid_bond_max)}
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[11px]">Jaminan Pelaksanaan (5%):</span>
                              <span className="text-slate-200 font-semibold">
                                {formatRupiah(tender.performance_bond)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Card Actions */}
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <button
                      onClick={() => onSelectTenderForSurety(tender)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/15 transition"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Minta Penawaran Jaminan Ini
                    </button>

                    <button
                      onClick={() =>
                        onOpenEstimationModal({
                          tenderTitle: tender.title,
                          tenderCode: tender.tender_code,
                          obligeeName: tender.agency_name,
                          projectValue: tender.hps_value,
                        })
                      }
                      title="Download Lembar Estimasi Resmi PDF"
                      className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-semibold text-xs flex items-center justify-center gap-1 transition border border-slate-700"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      Draf PDF
                    </button>

                    <a
                      href={tender.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 font-medium text-xs flex items-center justify-center gap-1 transition border border-slate-800"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      LPSE
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
