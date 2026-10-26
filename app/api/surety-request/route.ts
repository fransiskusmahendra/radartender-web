import { NextResponse } from "next/server";
import { sendTelegramNotification } from "@/lib/telegram";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      companyName,
      contactPerson,
      whatsapp,
      guaranteeType,
      projectValue,
      bondValue,
      obligeeName,
      notes,
    } = body;

    const leadId = `SB-${Date.now().toString(36).toUpperCase()}`;
    const rawWa = (whatsapp || "").replace(/[^0-9]/g, "");
    const waClean = rawWa.startsWith("0") ? `62${rawWa.slice(1)}` : rawWa;

    const message = `🛡️ *PENGAJUAN PENJAMINAN PROYEK: RADARTENDER.ID*
━━━━━━━━━━━━━━━━━━━━
📌 *Ref ID:* \`${leadId}\`
🏢 *Perusahaan (Principal):* ${companyName}
👤 *Contact Person:* ${contactPerson}
📱 *WhatsApp:* [Klik Chat Kontraktor](https://wa.me/${waClean}) (\`${whatsapp}\`)
🏛️ *Obligee / Pemilik Proyek:* ${obligeeName || "-"}
📑 *Jenis Jaminan:* *${guaranteeType}*
💵 *Nilai Proyek (HPS):* Rp ${Number(projectValue || 0).toLocaleString("id-ID")}
🛡️ *Nilai Jaminan yg Diminta:* Rp ${Number(bondValue || 0).toLocaleString("id-ID")}
📝 *Catatan Tambahan:* ${notes || "-"}
⏰ *Waktu:* ${new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })} WIB
━━━━━━━━━━━━━━━━━━━━
_Follow up segera dalam kurun 15 menit via WhatsApp untuk closing penerbitan polis/kontrak!_`;

    await sendTelegramNotification(message);

    return NextResponse.json({
      success: true,
      leadId,
      message: "Pengajuan penjaminan berhasil dikirim. Tim kami akan menghubungi via WhatsApp.",
    });
  } catch (error) {
    console.error("[Surety API] Error:", error);
    return NextResponse.json({ success: false, error: "Gagal memproses pengajuan" }, { status: 500 });
  }
}
