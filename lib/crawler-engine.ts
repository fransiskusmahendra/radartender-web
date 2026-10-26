/**
 * RadarTender.id — Automated Tender Crawler & Intelligence Engine
 * ===============================================================
 * Menghimpun, memperkaya, dan memfilter data lelang pengadaan nasional (LPSE, SPSE, BUMN)
 * dengan nilai HPS > Rp 1 Miliar, serta menghitung kebutuhan Jaminan Proyek (Surety Bond).
 */

import { EnrichedTenderItem, formatRupiah, getEnrichedTenders } from "./tenders-data";
import { sendTelegramNotification } from "./telegram";

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
    message += `   🔗 *Link LPSE:* ${t.source_url}\n\n`;
  });

  message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `🌐 *Portal Radar Tender:* https://radartender.id\n`;
  message += `🛡️ *Kalkulator Jaminan:* https://radartender.id/#kalkulator-jaminan\n`;
  message += `_Notifikasi otomatis dikirimkan oleh RadarTender.id Crawler Engine._`;

  return await sendTelegramNotification(message);
}
