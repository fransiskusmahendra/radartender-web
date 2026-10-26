import { NextRequest, NextResponse } from "next/server";
import { activateSubscriptionByAdmin } from "@/lib/subscription-db";
import { sendTelegramNotification } from "@/lib/telegram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const orderId = searchParams.get("orderId");
  const token = searchParams.get("token");

  if (!orderId) {
    return new NextResponse("Order ID tidak valid.", { status: 400 });
  }

  const result = activateSubscriptionByAdmin(orderId, token || undefined);

  if (result.success && result.record) {
    const record = result.record;
    const expiresFormatted = record.expiresAt
      ? new Date(record.expiresAt).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "-";

    // Broadcast success confirmation to Telegram
    const alertMsg = `✅ *SUKSES AKTIVASI ADMIN: RADARTENDER.ID*
━━━━━━━━━━━━━━━━━━━━
📌 *Order ID:* \`${record.orderId}\`
🏢 *Perusahaan:* ${record.vendorName}
📱 *WhatsApp:* ${record.whatsapp}
📦 *Paket:* ${record.planTitle}
⏳ *Masa Aktif Hingga:* ${expiresFormatted}
━━━━━━━━━━━━━━━━━━━━
_Akun telah aktif sebagai PRO. Kontraktor sudah dapat mengakses seluruh lelang & alert._`;

    await sendTelegramNotification(alertMsg);

    // WhatsApp quick reply link for Ko Mahen
    const waText = encodeURIComponent(
      `Halo Pak/Bu dari ${record.vendorName},\nPembayaran langganan RadarTender.id Anda telah kami verifikasi! ✅\n\nAkun Anda kini aktif sebagai *PRO MEMBER* (Order ID: ${record.orderId}) hingga *${expiresFormatted}*.\n\nKlik link berikut untuk membuka akses instan di perangkat Anda:\n👉 https://radartender.id?activate=${record.orderId}\n\nTerima kasih atas kepercayaannya! 🚀`
    );
    const waUrl = `https://wa.me/${record.whatsapp}?text=${waText}`;

    const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Aktivasi Sukses — RadarTender.id</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background: #020617; color: #f8fafc; padding: 2rem; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }
    .card { background: #0f172a; border: 1px solid #1e293b; border-radius: 1.5rem; padding: 2rem; max-width: 480px; width: 100%; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); text-align: center; }
    .badge { display: inline-block; background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 9999px; padding: 0.25rem 0.75rem; font-size: 0.75rem; font-weight: bold; text-transform: uppercase; margin-bottom: 1rem; }
    h1 { font-size: 1.5rem; font-weight: 900; margin: 0 0 0.5rem; color: #ffffff; }
    p { font-size: 0.875rem; color: #94a3b8; line-height: 1.5; margin: 0 0 1.5rem; }
    .details { background: #020617; border: 1px solid #1e293b; border-radius: 1rem; padding: 1rem; text-align: left; margin-bottom: 1.5rem; font-size: 0.8125rem; }
    .row { display: flex; justify-content: space-between; padding: 0.375rem 0; }
    .label { color: #64748b; }
    .val { color: #f8fafc; font-weight: 600; }
    .val-amber { color: #fbbf24; font-weight: bold; }
    .btn { display: block; width: 100%; box-sizing: border-box; background: #10b981; color: #020617; text-decoration: none; padding: 0.875rem; border-radius: 0.75rem; font-weight: 900; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.75rem; }
    .btn-secondary { background: #1e293b; color: #ffffff; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">Aktivasi Sukses</div>
    <h1>Akun PRO Berhasil Diaktifkan!</h1>
    <p>Langganan kontraktor telah terverifikasi dan aktif di sistem cloud.</p>

    <div class="details">
      <div class="row"><span class="label">Order ID:</span><span class="val font-mono">${record.orderId}</span></div>
      <div class="row"><span class="label">Perusahaan:</span><span class="val">${record.vendorName}</span></div>
      <div class="row"><span class="label">WhatsApp:</span><span class="val">${record.whatsapp}</span></div>
      <div class="row"><span class="label">Paket:</span><span class="val">${record.planTitle}</span></div>
      <div class="row"><span class="label">Masa Berlaku:</span><span class="val-amber">Hingga ${expiresFormatted}</span></div>
    </div>

    <a href="${waUrl}" target="_blank" class="btn">Kirim Pesan WhatsApp ke Kontraktor ➔</a>
    <a href="https://radartender.id" class="btn btn-secondary">Kembali ke RadarTender.id</a>
  </div>
</body>
</html>`;

    return new NextResponse(html, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  return new NextResponse("Gagal memproses aktivasi order.", { status: 500 });
}
