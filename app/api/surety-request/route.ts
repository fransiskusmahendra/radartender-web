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
      underwritingDocs,
    } = body;

    const leadId = `SB-${Date.now().toString(36).toUpperCase()}`;
    const rawWa = (whatsapp || "").replace(/[^0-9]/g, "");
    const waClean = rawWa.startsWith("0") ? `62${rawWa.slice(1)}` : rawWa;

    // Build Underwriting Docs inventory for Underwriter / Admin Telegram
    let docsSection = "";
    if (underwritingDocs) {
      const { legalDocs, financialDocs, tenderDocs, companyProfileDoc, driveUrl } = underwritingDocs;
      const docLines: string[] = [];

      if (Array.isArray(legalDocs) && legalDocs.length > 0) {
        docLines.push(`• 📄 *Legalitas PT:* ${legalDocs.join(", ")}`);
      }
      if (Array.isArray(financialDocs) && financialDocs.length > 0) {
        docLines.push(`• 📊 *Keuangan & Rekening:* ${financialDocs.join(", ")}`);
      }
      if (Array.isArray(tenderDocs) && tenderDocs.length > 0) {
        docLines.push(`• 📑 *RKS / Dokumen Lelang:* ${tenderDocs.join(", ")}`);
      }
      if (Array.isArray(companyProfileDoc) && companyProfileDoc.length > 0) {
        docLines.push(`• 🏢 *Company Profile:* ${companyProfileDoc.join(", ")}`);
      }
      if (driveUrl) {
        docLines.push(`• 🔗 *Tautan Cloud Drive:* ${driveUrl}`);
      }

      if (docLines.length > 0) {
        docsSection = `\n📁 *BERKAS UNDERWRITING ASURANSI (TERLAMPIR):*\n${docLines.join("\n")}\n━━━━━━━━━━━━━━━━━━━━`;
      }
    }

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
━━━━━━━━━━━━━━━━━━━━${docsSection}
_Berkas underwriting siap dianalisa. Hubungi kontraktor via WhatsApp untuk konfirmasi penawaran & approval polis!_`;

    await sendTelegramNotification(message);

    return NextResponse.json({
      success: true,
      leadId,
      message: "Pengajuan penjaminan beserta berkas underwriting berhasil dikirim ke analis asuransi.",
    });
  } catch (error) {
    console.error("[Surety API] Error:", error);
    return NextResponse.json({ success: false, error: "Gagal memproses pengajuan" }, { status: 500 });
  }
}
