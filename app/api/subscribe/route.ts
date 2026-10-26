import { NextResponse } from "next/server";
import { sendTelegramNotification } from "@/lib/telegram";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { plan, planTitle, price, uniqueAmount, vendorName, vendorWa, email, cluster } = body;

    const finalAmount = uniqueAmount || price;
    const orderId = `RT-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const message = `🔔 *ORDER LANGGANAN BARU: RADARTENDER.ID*
━━━━━━━━━━━━━━━━━━━━
📌 *Order ID:* \`${orderId}\`
📦 *Paket:* ${planTitle} (${plan})
💰 *Nominal Transfer:* *Rp ${Number(finalAmount).toLocaleString("id-ID")}*
🏦 *Tujuan Bayar:* Bank BCA \`4210122848\` a/n Fransiskus Xaverius Mahendra Kotualubun
🏢 *Perusahaan / PT:* ${vendorName || "-"}
📱 *WhatsApp:* [https://wa.me/${(vendorWa || "").replace(/[^0-9]/g, "")}](${vendorWa || "-"})
📧 *Email:* ${email || "-"}
🏷️ *Kluster Fokus:* ${cluster || "Semua"}
⏰ *Waktu:* ${new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })} WIB
━━━━━━━━━━━━━━━━━━━━
_Instruksi pembayaran BCA & QRIS telah disajikan ke customer. Menunggu konfirmasi transfer via WhatsApp._`;

    await sendTelegramNotification(message);

    return NextResponse.json({
      success: true,
      orderId,
      amount: finalAmount,
      message: "Order berhasil dibuat",
    });
  } catch (error) {
    console.error("[Subscribe API] Error:", error);
    return NextResponse.json({ success: false, error: "Gagal memproses langganan" }, { status: 500 });
  }
}
