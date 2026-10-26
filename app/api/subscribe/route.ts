import { NextResponse } from "next/server";
import { sendTelegramNotification } from "@/lib/telegram";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { plan, planTitle, price, vendorName, vendorWa, email, cluster } = body;

    const orderId = `RT-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const message = `🔔 *ORDER SUBSCRIPTION BARU: RADARTENDER.ID*
━━━━━━━━━━━━━━━━━━━━
📌 *Order ID:* \`${orderId}\`
📦 *Paket:* ${planTitle} (${plan})
💰 *Nominal:* Rp ${Number(price).toLocaleString("id-ID")}
🏢 *Vendor / PT:* ${vendorName || "-"}
📱 *WhatsApp:* [https://wa.me/${(vendorWa || "").replace(/[^0-9]/g, "")}](${vendorWa || "-"})
📧 *Email:* ${email || "-"}
🏷️ *Kluster Fokus:* ${cluster || "Semua"}
⏰ *Waktu:* ${new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })} WIB
━━━━━━━━━━━━━━━━━━━━
_Sistem QRIS statis / dinamis telah disajikan ke user. Siap verifikasi pembayaran via WA!_`;

    await sendTelegramNotification(message);

    return NextResponse.json({
      success: true,
      orderId,
      amount: price,
      message: "Order berhasil dibuat",
    });
  } catch (error) {
    console.error("[Subscribe API] Error:", error);
    return NextResponse.json({ success: false, error: "Gagal memproses langganan" }, { status: 500 });
  }
}
