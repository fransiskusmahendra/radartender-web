import { NextRequest, NextResponse } from "next/server";
import { authenticateContractor } from "@/lib/subscription-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { whatsapp, accessCode } = body;

    if (!whatsapp && !accessCode) {
      return NextResponse.json(
        { success: false, message: "Nomor WhatsApp atau Kode Akses wajib diisi." },
        { status: 400 }
      );
    }

    const authResult = authenticateContractor(whatsapp, accessCode);

    if (!authResult.authenticated && !authResult.isPro) {
      return NextResponse.json({
        success: false,
        message: authResult.message,
      });
    }

    return NextResponse.json({
      success: true,
      isPro: authResult.isPro,
      message: authResult.message,
      daysRemaining: authResult.daysRemaining || 0,
      user: {
        companyName: authResult.record?.vendorName || "Member Kontraktor",
        contactPerson: authResult.record?.contactPerson || "",
        whatsapp: authResult.record?.whatsapp || whatsapp,
        email: authResult.record?.email || "",
        plan: authResult.record?.plan || "pro",
        planTitle: authResult.record?.planTitle || "Pro Kontraktor",
        orderId: authResult.record?.orderId,
        expiresAt: authResult.record?.expiresAt,
        isPro: authResult.isPro,
      },
    });
  } catch (error: any) {
    console.error("[Auth API] Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan sistem saat proses masuk." },
      { status: 500 }
    );
  }
}
