/**
 * RadarTender.id — Cloud Subscription & Authentication Engine
 * ==========================================================
 * Mengelola database langganan kontraktor secara aman, mendukung autentikasi
 * berbasis NOMOR WHATSAPP LINTAS PERANGKAT (HP, Laptop, PC), pelacakan masa aktif,
 * dan aktivasi 1-klik via Telegram untuk admin (Ko Mahen).
 */

import { createHmac } from "crypto";
import initialSubscribers from "@/data/subscribers.json";

export interface SubscriptionRecord {
  orderId: string;
  vendorName: string;
  contactPerson: string;
  whatsapp: string;
  email: string;
  plan: "starter" | "pro" | "vip";
  planTitle: string;
  amount: number;
  status: "pending_payment" | "active" | "expired";
  createdAt: string;
  activatedAt?: string;
  expiresAt?: string;
  token: string;
  preferredRegion?: string;
  cluster?: string;
  specialKeywords?: string;
}

const ADMIN_SECRET = process.env.ADMIN_SECRET || "qira_radar_secret_2026_x89";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";
const REPO_OWNER = "fransiskusmahendra";
const REPO_NAME = "radartender-web";

// Server-side persistent storage cache (seeded from data/subscribers.json)
const GLOBAL_SUBSCRIPTIONS = new Map<string, SubscriptionRecord>();

// Seed in-memory cache
try {
  for (const [key, val] of Object.entries(initialSubscribers)) {
    const rec = val as SubscriptionRecord;
    GLOBAL_SUBSCRIPTIONS.set(key, rec);
    if (rec.orderId) {
      GLOBAL_SUBSCRIPTIONS.set(rec.orderId.toUpperCase(), rec);
    }
    if (rec.whatsapp) {
      GLOBAL_SUBSCRIPTIONS.set(rec.whatsapp, rec);
    }
  }
} catch (e) {
  console.error("[Subscription DB] Seed error:", e);
}

// Helper to normalize WhatsApp phone numbers (e.g. 0812 -> 62812, +62 812 -> 62812)
export function normalizePhone(raw: string): string {
  const digits = (raw || "").replace(/\D/g, "");
  if (digits.startsWith("0")) {
    return "62" + digits.slice(1);
  }
  return digits;
}

// Generate secure signature token for subscription activation
export function generateToken(orderId: string, phone: string): string {
  return createHmac("sha256", ADMIN_SECRET)
    .update(`${orderId}:${normalizePhone(phone)}`)
    .digest("hex")
    .slice(0, 16)
    .toUpperCase();
}

/**
 * Sync subscribers to GitHub data/subscribers.json for permanent cloud persistence
 */
export async function syncSubscriberToGitHub(record: SubscriptionRecord): Promise<void> {
  try {
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/data/subscribers.json`;
    const headers = {
      "User-Agent": "RadarTender-CloudSync/1.0",
      Authorization: `token ${GITHUB_TOKEN}`,
      "Content-Type": "application/json",
    };

    let currentSha = "";
    let currentData: Record<string, SubscriptionRecord> = {};

    try {
      const getRes = await fetch(url, { headers, cache: "no-store" });
      if (getRes.ok) {
        const fileJson = await getRes.json();
        currentSha = fileJson.sha;
        const decoded = Buffer.from(fileJson.content, "base64").toString("utf-8");
        currentData = JSON.parse(decoded);
      }
    } catch (err) {
      console.warn("[CloudSync] Fetch existing failed, creating new:", err);
    }

    // Add or update record keyed by normalized phone number
    const cleanPhone = normalizePhone(record.whatsapp);
    currentData[cleanPhone] = record;

    const updatedContent = Buffer.from(JSON.stringify(currentData, null, 2)).toString("base64");

    const putRes = await fetch(url, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        message: `chore(subscribers): activate ${record.whatsapp} (${record.vendorName})`,
        content: updatedContent,
        sha: currentSha || undefined,
      }),
    });

    if (putRes.ok) {
      console.log(`[CloudSync] Successfully saved subscriber ${cleanPhone} to GitHub permanently.`);
    } else {
      console.error("[CloudSync] GitHub API error:", putRes.status, await putRes.text());
    }
  } catch (error) {
    console.error("[CloudSync] Failed to sync subscriber to GitHub:", error);
  }
}

/**
 * Buat order langganan baru (Status: pending_payment)
 */
export function createSubscription(data: {
  orderId: string;
  vendorName: string;
  contactPerson?: string;
  whatsapp: string;
  email?: string;
  plan: "starter" | "pro" | "vip";
  planTitle: string;
  amount: number;
  preferredRegion?: string;
  cluster?: string;
  specialKeywords?: string;
}): SubscriptionRecord {
  const cleanPhone = normalizePhone(data.whatsapp);
  const token = generateToken(data.orderId, cleanPhone);

  const record: SubscriptionRecord = {
    orderId: data.orderId,
    vendorName: data.vendorName || "Kontraktor",
    contactPerson: data.contactPerson || "",
    whatsapp: cleanPhone,
    email: data.email || "",
    plan: data.plan,
    planTitle: data.planTitle,
    amount: data.amount,
    status: "pending_payment",
    createdAt: new Date().toISOString(),
    token,
    preferredRegion: data.preferredRegion || "Semua Wilayah",
    cluster: data.cluster || "Semua Kluster",
    specialKeywords: data.specialKeywords || "",
  };

  GLOBAL_SUBSCRIPTIONS.set(data.orderId.toUpperCase(), record);
  GLOBAL_SUBSCRIPTIONS.set(cleanPhone, record);

  return record;
}

/**
 * Mengambil seluruh pelanggan yang aktif berlangganan untuk kurasi alert
 */
export function getAllActiveSubscribers(): SubscriptionRecord[] {
  const seenPhones = new Set<string>();
  const activeList: SubscriptionRecord[] = [];

  for (const record of Array.from(GLOBAL_SUBSCRIPTIONS.values())) {
    if (record.status === "active" && record.whatsapp && !seenPhones.has(record.whatsapp)) {
      seenPhones.add(record.whatsapp);
      activeList.push(record);
    }
  }

  return activeList;
}

/**
 * Aktivasi langganan oleh Admin (Ko Mahen)
 * Masa aktif: Starter (30 hari), Pro (90 hari), VIP (365 hari)
 */
export function activateSubscriptionByAdmin(
  orderId: string,
  providedToken?: string
): { success: boolean; record?: SubscriptionRecord; message: string } {
  const cleanId = (orderId || "").trim().toUpperCase();
  let record = GLOBAL_SUBSCRIPTIONS.get(cleanId);

  // If order was generated dynamically, synthesize record
  if (!record) {
    record = {
      orderId: cleanId,
      vendorName: "Member Kontraktor",
      contactPerson: "Estimator",
      whatsapp: "6281314620473",
      email: "",
      plan: cleanId.includes("VIP") ? "vip" : "pro",
      planTitle: cleanId.includes("VIP") ? "VIP Tahunan" : "Pro Kontraktor",
      amount: 199000,
      status: "pending_payment",
      createdAt: new Date().toISOString(),
      token: generateToken(cleanId, "6281314620473"),
    };
  }

  // Duration in days
  let durationDays = 90; // Default PRO (3 bulan)
  if (record.plan === "starter") durationDays = 30;
  if (record.plan === "vip") durationDays = 365;

  const now = new Date();
  const expires = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000);

  record.status = "active";
  record.activatedAt = now.toISOString();
  record.expiresAt = expires.toISOString();

  // Save to memory
  GLOBAL_SUBSCRIPTIONS.set(cleanId, record);
  if (record.whatsapp) {
    GLOBAL_SUBSCRIPTIONS.set(record.whatsapp, record);
  }

  // Asynchronously sync to GitHub cloud storage
  syncSubscriberToGitHub(record).catch(() => {});

  return {
    success: true,
    record,
    message: `Langganan ${record.orderId} (${record.planTitle}) berhasil diaktifkan hingga ${expires.toLocaleDateString("id-ID")}`,
  };
}

/**
 * Verifikasi login kontraktor HANYA DENGAN NOMOR WHATSAPP (atau Kode Promo/Order ID)
 */
export async function authenticateContractor(
  phoneOrCode: string,
  accessCode?: string
): Promise<{
  authenticated: boolean;
  isPro: boolean;
  record?: SubscriptionRecord;
  daysRemaining?: number;
  message: string;
}> {
  const cleanInput = (phoneOrCode || "").trim().toUpperCase();
  const cleanCode = (accessCode || "").trim().toUpperCase();
  const normalizedPhone = normalizePhone(cleanInput);

  // 1. Universal master promo keys
  const MASTER_CODES = ["RADARPRO", "QIRA-PRO", "VIP2026", "KONTRAKTORJUARA"];
  if (MASTER_CODES.includes(cleanInput) || MASTER_CODES.includes(cleanCode)) {
    const futureDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
    return {
      authenticated: true,
      isPro: true,
      daysRemaining: 365,
      record: {
        orderId: cleanCode || cleanInput,
        vendorName: "VIP Member",
        contactPerson: "Partner",
        whatsapp: normalizedPhone || "6281314620473",
        email: "",
        plan: "vip",
        planTitle: "VIP Akses Penuh",
        amount: 599000,
        status: "active",
        createdAt: new Date().toISOString(),
        expiresAt: futureDate.toISOString(),
        token: "MASTER-VIP",
      },
      message: "Kode Akses VIP Master Valid. Akun PRO aktif.",
    };
  }

  // 2. Cek memori lokal
  let record =
    GLOBAL_SUBSCRIPTIONS.get(normalizedPhone) ||
    GLOBAL_SUBSCRIPTIONS.get(cleanInput) ||
    (cleanCode ? GLOBAL_SUBSCRIPTIONS.get(cleanCode) : undefined);

  // 3. Jika belum di memori lokal, coba fetch live dari GitHub raw
  if (!record && normalizedPhone) {
    try {
      const liveRes = await fetch(
        `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/data/subscribers.json?t=${Date.now()}`,
        { cache: "no-store" }
      );
      if (liveRes.ok) {
        const liveData = await liveRes.json();
        if (liveData[normalizedPhone]) {
          record = liveData[normalizedPhone];
          GLOBAL_SUBSCRIPTIONS.set(normalizedPhone, record!);
          if (record?.orderId) {
            GLOBAL_SUBSCRIPTIONS.set(record.orderId.toUpperCase(), record);
          }
        }
      }
    } catch (e) {
      // offline or raw fetch error, proceed to fallback
    }
  }

  // 4. Jika menggunakan Order ID RT-XXXX langsung
  if (!record && (cleanInput.startsWith("RT-") || cleanCode.startsWith("RT-"))) {
    const orderKey = cleanInput.startsWith("RT-") ? cleanInput : cleanCode;
    const futureDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
    record = {
      orderId: orderKey,
      vendorName: "Member Kontraktor",
      contactPerson: "",
      whatsapp: normalizedPhone || "6281314620473",
      email: "",
      plan: "pro",
      planTitle: "Pro Kontraktor (3 Bulan)",
      amount: 199000,
      status: "active",
      createdAt: new Date().toISOString(),
      expiresAt: futureDate.toISOString(),
      token: generateToken(orderKey, normalizedPhone || "6281314620473"),
    };
    GLOBAL_SUBSCRIPTIONS.set(orderKey, record);
    GLOBAL_SUBSCRIPTIONS.set(record.whatsapp, record);
  }

  // 5. Jika nomor tidak ditemukan sama sekali
  if (!record) {
    return {
      authenticated: false,
      isPro: false,
      message:
        "Nomor WhatsApp belum terdaftar sebagai PRO. Silakan lakukan pembayaran langganan atau hubungi Admin.",
    };
  }

  // 6. Cek Masa Aktif (Expiry)
  if (record.expiresAt) {
    const expireTime = new Date(record.expiresAt).getTime();
    const nowTime = Date.now();
    if (nowTime > expireTime) {
      record.status = "expired";
      return {
        authenticated: true,
        isPro: false,
        record,
        daysRemaining: 0,
        message: "Masa aktif langganan Anda telah berakhir. Silakan lakukan perpanjangan paket.",
      };
    }

    const daysRemaining = Math.max(0, Math.ceil((expireTime - nowTime) / (1000 * 60 * 60 * 24)));
    return {
      authenticated: true,
      isPro: record.status === "active",
      record,
      daysRemaining,
      message: `Akun PRO Aktif (Sisa ${daysRemaining} Hari)`,
    };
  }

  return {
    authenticated: true,
    isPro: record.status === "active",
    record,
    daysRemaining: record.status === "active" ? 90 : 0,
    message:
      record.status === "active"
        ? "Akun PRO Aktif"
        : "Order terdaftar, menunggu konfirmasi pembayaran admin.",
  };
}
