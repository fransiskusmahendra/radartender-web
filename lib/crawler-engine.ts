/**
 * RadarTender.id — Automated Tender Crawler & Intelligence Engine
 * ===============================================================
 * Menghimpun, memperkaya, dan memfilter data lelang pengadaan nasional (LPSE, SPSE, BUMN)
 * dengan nilai HPS > Rp 1 Miliar, serta menyusun notifikasi kurasi pintar personal
 * untuk masing-masing pelanggan WhatsApp sesuai kriteria wilayah, kluster & kata kunci.
 */

import { EnrichedTenderItem, formatRupiah, getEnrichedTenders } from "./tenders-data";
import { sendTelegramNotification } from "./telegram";
import { SubscriptionRecord } from "./subscription-db";

export interface CrawlResult {
  totalMonitored: number;
  totalHpsValue: number;
  urgentCount: number;
  activeCount: number;
  freshCount: number;
  topUrgentTenders: EnrichedTenderItem[];
  topMegaTenders: EnrichedTenderItem[];
  timestamp: string;
}

export function runTenderCrawl(): CrawlResult {
  const tenders = getEnrichedTenders();
  const totalHpsValue = tenders.reduce((acc, t) => acc + t.hps_value, 0);

  const urgentTenders = tenders
    .filter((t) => t.days_remaining <= 3)
    .sort((a, b) => a.days_remaining - b.days_remaining);

  const megaTenders = tenders
    .filter((t) => t.hps_value >= 30_000_000_000)
    .sort((a, b) => b.hps_value - a.hps_value);

  const activeCount = tenders.filter((t) => t.days_remaining > 3 && t.days_remaining <= 7).length;
  const freshCount = tenders.filter((t) => t.days_remaining > 7).length;

  return {
    totalMonitored: tenders.length,
    totalHpsValue,
    urgentCount: urgentTenders.length,
    activeCount,
    freshCount,
    topUrgentTenders: urgentTenders.slice(0, 4),
    topMegaTenders: megaTenders.slice(0, 3),
    timestamp: new Date().toISOString(),
  };
}

/**
 * Kurasi pintar tender khusus untuk masing-masing profil pelanggan PRO
 * Memfilter wilayah, jenis pengadaan, dan kata kunci spesifik
 */
export function curateTendersForSubscriber(
  subscriber: SubscriptionRecord,
  allTenders?: EnrichedTenderItem[]
): {
  matchedTenders: EnrichedTenderItem[];
  whatsappMessage: string;
} {
  const tenders = allTenders || getEnrichedTenders();

  const prefRegion = (subscriber.preferredRegion || "Semua Wilayah").toLowerCase();
  const prefCluster = (subscriber.cluster || "Semua Kluster").toLowerCase();
  const rawKeywords = (subscriber.specialKeywords || "")
    .toLowerCase()
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);

  // 1. Filter candidates matching criteria
  const candidates = tenders.filter((t) => {
    // Cluster check
    if (prefCluster !== "semua kluster" && prefCluster !== "semua") {
      if (t.procurement_type.toLowerCase() !== prefCluster) {
        return false;
      }
    }

    // Region check
    if (prefRegion !== "semua wilayah" && prefRegion !== "semua" && prefRegion !== "nasional") {
      const loc = t.location.toLowerCase();
      // Handle mapping (e.g. "ikn & kalimantan" matches "ikn" or "kalimantan")
      const regionKeywords = prefRegion.split(/[\s,&]+/).filter((w) => w.length > 2);
      const matchesRegion = regionKeywords.some((w) => loc.includes(w));
      if (!matchesRegion) {
        return false;
      }
    }

    // Special Keywords check (if provided, bonus priority or filter)
    if (rawKeywords.length > 0) {
      const targetText = `${t.title} ${t.agency_name} ${t.location}`.toLowerCase();
      const hasKeyword = rawKeywords.some((k) => targetText.includes(k));
      if (!hasKeyword) {
        return false;
      }
    }

    return true;
  });

  // 2. Sort candidates by Urgency (sisa hari paling sedikit) and HPS terbesar
  candidates.sort((a, b) => {
    if (a.days_remaining !== b.days_remaining) {
      return a.days_remaining - b.days_remaining;
    }
    return b.hps_value - a.hps_value;
  });

  // 3. Fallback: jika filter terlalu sempit (< 3 tender), isi dengan tender paling mendesak di kluster/wilayah umum
  let finalSelection = candidates.slice(0, 3);
  if (finalSelection.length < 3) {
    const backupUrgent = tenders
      .filter((t) => !finalSelection.some((s) => s.id === t.id))
      .sort((a, b) => a.days_remaining - b.days_remaining)
      .slice(0, 3 - finalSelection.length);
    finalSelection = [...finalSelection, ...backupUrgent];
  }

  // 4. Susun pesan WhatsApp kurasi pintar dengan link tender & kontak PIC Pokja pendaftaran
  const customerGreeting = subscriber.contactPerson
    ? `Yth. ${subscriber.contactPerson} (${subscriber.vendorName})`
    : `Yth. Pimpinan ${subscriber.vendorName}`;

  let msg = `🔔 *RADARTENDER SMART INTELLIGENCE*\n`;
  msg += `Khusus: *${customerGreeting}*\n`;
  msg += `🎯 *Profil Alert:* ${subscriber.cluster || "Semua Kluster"} | 📍 *Wilayah:* ${subscriber.preferredRegion || "Nasional"}`;
  if (subscriber.specialKeywords) {
    msg += `\n🔍 *Fokus Proyek:* "${subscriber.specialKeywords}"`;
  }
  msg += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `Selamat pagi! Berikut *${finalSelection.length} tender terkurasi paling relevan & mendesak* untuk perusahaan Anda hari ini:\n\n`;

  finalSelection.forEach((t, i) => {
    const urgencyIcon = t.days_remaining <= 3 ? "🔥" : "⚡";
    msg += `${i + 1}. ${urgencyIcon} *[${t.tender_code}]* ⏳ *Sisa ${t.days_remaining} Hari*\n`;
    msg += `   *${t.title}*\n`;
    msg += `   🏢 *Satker:* ${t.agency_name} (${t.location})\n`;
    msg += `   💰 *HPS:* ${formatRupiah(t.hps_value)}\n`;
    msg += `   🛡️ *Kebutuhan Bid Bond (1-3%):* ${formatRupiah(t.bid_bond_min)} s/d ${formatRupiah(t.bid_bond_max)}\n`;
    msg += `   🔗 *Link Portal Tender:* ${t.registration_url || t.source_url}\n`;
    msg += `   📞 *Kontak Pokja / Pendaftaran:* ${t.pic_contact || "Helpdesk LPSE Satker"}\n\n`;
  });

  msg += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `💻 *Portal Tender Lengkap (500+ Proyek Aktif Hari Ini):*\n`;
  msg += `Buka dashboard lelang Anda (Akses Langsung Tanpa Login):\n`;
  msg += `👉 https://radartender.id?token=${subscriber.orderId || "PRO"}\n\n`;
  msg += `🛡️ *Butuh Jaminan Penawaran (Bid Bond) Express Proyek di Atas?*\n`;
  msg += `Balas chat ini atau hubungi tim penjaminan resmi kami:\n`;
  msg += `👉 https://wa.me/6281314620473?text=Halo%20Admin%20RadarTender%2C%20saya%20ingin%20mengajukan%20Bid%20Bond%20untuk%20tender%20terkurasi%20hari%20ini`;

  return {
    matchedTenders: finalSelection,
    whatsappMessage: msg,
  };
}

export async function broadcastTenderTelegramAlert(crawl: CrawlResult): Promise<boolean> {
  const now = new Date();
  const timeStr = now.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  });
  const dateStr = now.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  });

  let message = `🏛️ *[RADARTENDER.ID] INTELIJEN PENGADAAN & JAMINAN PROYEK*\n`;
  message += `📅 *${dateStr}* | ⏰ *${timeStr} WIB*\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  message += `📊 *Ringkasan Radar Lelang Nasional:*\n`;
  message += `• Total Paket Terpantau: *${crawl.totalMonitored} Paket Aktif*\n`;
  message += `• Akumulasi Nilai HPS: *${formatRupiah(crawl.totalHpsValue)}*\n`;
  message += `• 🔥 Segera Tutup (≤ 3 Hari): *${crawl.urgentCount} Paket*\n`;
  message += `• ⚡ Sedang Buka (4-7 Hari): *${crawl.activeCount} Paket*\n\n`;

  message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `🔥 *PAKET MENDESAK (PRIORITAS PENAWARAN & BID BOND):*\n\n`;

  crawl.topUrgentTenders.forEach((t, i) => {
    message += `${i + 1}. *[${t.tender_code}]* ${t.title}\n`;
    message += `   🏢 *Satker:* ${t.agency_name} (${t.location})\n`;
    message += `   💰 *HPS:* ${formatRupiah(t.hps_value)} | ⏳ *Sisa: ${t.days_remaining} Hari*\n`;
    message += `   🛡️ *Estimasi Jaminan:* Bid Bond ${formatRupiah(t.bid_bond_min)} - ${formatRupiah(t.bid_bond_max)} | Perf Bond ${formatRupiah(t.performance_bond)}\n`;
    message += `   🔗 *Link Portal:* ${t.registration_url || t.source_url}\n`;
    message += `   📞 *Kontak Pokja / PIC:* ${t.pic_contact || "Helpdesk LPSE"}\n\n`;
  });

  message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `🌐 *Portal Radar Tender:* https://radartender.id\n`;
  message += `🛡️ *Kalkulator Jaminan:* https://radartender.id/#kalkulator-jaminan\n`;
  message += `_Notifikasi otomatis dikirimkan oleh RadarTender.id Crawler Engine._`;

  return await sendTelegramNotification(message);
}
