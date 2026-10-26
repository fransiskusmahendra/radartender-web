import { NextRequest, NextResponse } from "next/server";
import { getEnrichedTenders } from "@/lib/tenders-data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const cluster = searchParams.get("cluster");
    const urgency = searchParams.get("urgency");
    const query = searchParams.get("q")?.toLowerCase();
    const limit = Number(searchParams.get("limit")) || 50;

    let tenders = getEnrichedTenders();

    if (cluster && cluster !== "Semua Kluster") {
      tenders = tenders.filter((t) => t.procurement_type === cluster);
    }

    if (urgency === "urgent") {
      tenders = tenders.filter((t) => t.days_remaining <= 3);
    } else if (urgency === "active") {
      tenders = tenders.filter((t) => t.days_remaining > 3 && t.days_remaining <= 7);
    } else if (urgency === "fresh") {
      tenders = tenders.filter((t) => t.days_remaining > 7);
    }

    if (query) {
      tenders = tenders.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          t.agency_name.toLowerCase().includes(query) ||
          t.location.toLowerCase().includes(query) ||
          t.tender_code.toLowerCase().includes(query)
      );
    }

    return NextResponse.json({
      success: true,
      count: tenders.length,
      data: tenders.slice(0, limit),
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch tenders" },
      { status: 500 }
    );
  }
}
