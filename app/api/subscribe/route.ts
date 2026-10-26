import { NextResponse } from "next/server";
import { sendTelegramNotification } from "@/lib/telegram";
import { createSubscription } from "@/lib/subscription-db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      plan,
      planTitle,
      price,
      uniqueAmount,
      vendorName,
      vendorPic,
      vendorWa,
      email,
      cluster,
      preferredRegion,
      specialKeywords,
    } = body;

    const finalAmount = uniqueAmount || price;
    const orderId = `RT-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Create record in cloud database with curation preferences
    const subscription = createSubscription({
      orderId,
      vendorName,
      contactPerson: vendorPic,
      whatsapp: vendorWa,
      email,
      plan: plan || "pro",
      planTitle: planTitle || "Pro Kontraktor",
      amount: finalAmount,
      preferredRegion: preferredRegion || "Semua Wilayah",
      cluster: cluster || "Semua Kluster",
      specialKeywords: specialKeywords || "",
    });

    const activateUrl = `https://radartender.id/api/admin/activate?orderId=${orderId}&token=${subscription.token}`;
    const rawVendorWa = (vendorWa || "").replace(/[^0-9]/g, "");
    const waVendorClean = rawVendorWa.startsWith("0") ? `62${rawVendorWa.slice(1)}` : rawVendorWa;

    const message = `🔔 *ORDER LANGGANAN BARU: RADARTENDER.ID*
━━━━━━━━━━━━━━━━━━━━
📌 *Order ID:* \`${orderId}\`
📦 *Paket:* ${planTitle} (${plan})
💰 *Nominal Transfer:* *Rp ${Number(finalAmount).toLocaleString("id-ID")}*
🏦 *Tujuan Bayar:* Bank BCA \`4210122848\` a/n Fransiskus Xaverius Mahendra Kotualubun
🏢 *Perusahaan / PT:* ${vendorName || "-"}
👤 *PIC / Estimator:* ${vendorPic || "-"}
📱 *WhatsApp:* [Klik Chat Customer](https://wa.me/${waVendorClean}) (\`${vendorWa || "-"}\`)
📧 *Email:* ${email || "-"}
━━━━━━━━━━━━━━━━━━━━
🎯 *PROFIL KURASI ALERT WHATSAPP:*
📍 *Wilayah Fokus:* ${preferredRegion || "Semua Wilayah (Nasional)"}
🏗️ *Kluster Pengadaan:* ${cluster || "Semua Kluster"}
🔍 *Kata Kunci Khusus:* ${specialKeywords || "Standar (Semua Lelang Relevan)"}
⏰ *Waktu Order:* ${new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })} WIB
━━━━━━━━━━━━━━━━━━━━
⚡ *Tombol Verifikasi & Aktivasi (1-Klik):*
${activateUrl}
━━━━━━━━━━━━━━━━━━━━
_Setelah mutasi BCA masuk, klik link di atas untuk langsung mengaktifkan akun PRO kontraktor secara otomatis._`;

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
