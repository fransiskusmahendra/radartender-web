import { NextRequest, NextResponse } from "next/server";
import { verifyMidtransSignature } from "@/lib/midtrans";
import { activateSubscriptionByAdmin } from "@/lib/subscription-db";
import { sendTelegramNotification } from "@/lib/telegram";
import { getEnrichedTenders } from "@/lib/tenders-data";
import { curateTendersForSubscriber } from "@/lib/crawler-engine";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
      payment_type,
    } = body;

    if (!order_id || !status_code || !gross_amount || !signature_key) {
      return NextResponse.json(
        { success: false, message: "Payload webhook Midtrans tidak lengkap" },
        { status: 400 }
      );
    }

    // 1. Verifikasi Keaslian Signature Midtrans
    const isValid = verifyMidtransSignature(
      order_id,
      status_code,
      gross_amount,
      signature_key
    );

    if (!isValid) {
      console.warn(`[Midtrans Webhook] Invalid signature for order: ${order_id}`);
      return NextResponse.json(
        { success: false, message: "Signature verification failed" },
        { status: 403 }
      );
    }

    console.log(`[Midtrans Webhook] Order ${order_id} status: ${transaction_status}, type: ${payment_type}`);

    // 2. Evaluasi Status Pembayaran
    const isSuccess =
      transaction_status === "settlement" ||
      (transaction_status === "capture" && fraud_status === "accept");

    if (isSuccess) {
      // 3. Otomatis Aktifkan Akun Kontraktor
      const activation = activateSubscriptionByAdmin(order_id);
      const record = activation.record;

      const expiresFormatted = record?.expiresAt
        ? new Date(record.expiresAt).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : "-";

      // 4. Susun Notifikasi Sukses ke Telegram Ko Mahen
      const telegramMsg = `🎉 *PEMBAYARAN MIDTRANS SUKSES (OTOMATIS)*
━━━━━━━━━━━━━━━━━━━━
📌 *Order ID:* \`${order_id}\`
🏢 *Perusahaan:* ${record?.vendorName || "Kontraktor"}
📱 *WhatsApp:* ${record?.whatsapp || "-"}
📦 *Paket:* ${record?.planTitle || "Pro"}
💰 *Nominal Terverifikasi:* Rp ${Number(gross_amount).toLocaleString("id-ID")}
💳 *Metode Pembayaran:* \`${payment_type || "Midtrans Gateway"}\`
⏳ *Masa Aktif PRO:* Hingga ${expiresFormatted}
━━━━━━━━━━━━━━━━━━━━
⚡ *STATUS:* Akun telah aktif secara otomatis tanpa perlu intervensi manual! Kontraktor sudah dapat menikmati seluruh alert lelang.`;

      await sendTelegramNotification(telegramMsg);

      // Siapkan kurasi alert jika record tersedia
      if (record) {
        const curation = curateTendersForSubscriber(record, getEnrichedTenders());
        console.log(`[Midtrans Webhook] Curated ${curation.matchedTenders.length} tenders for ${record.vendorName}`);
      }

      return NextResponse.json({
        success: true,
        message: "Payment successfully verified and account activated",
      });
    }

    // Handle status pending atau expired
    if (transaction_status === "pending") {
      console.log(`[Midtrans Webhook] Order ${order_id} is pending customer payment.`);
    }

    return NextResponse.json({
      success: true,
      message: `Midtrans transaction status acknowledged: ${transaction_status}`,
    });
  } catch (error: any) {
    console.error("[Midtrans Webhook] Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
