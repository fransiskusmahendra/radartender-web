import { NextRequest, NextResponse } from "next/server";
import { runTenderCrawl, broadcastTenderTelegramAlert } from "@/lib/crawler-engine";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const cronSecret = process.env.CRON_SECRET;
    const authHeader = req.headers.get("authorization");

    // Optional verification if CRON_SECRET is set
    if (cronSecret && authHeader && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized cron invocation" }, { status: 401 });
    }

    const crawlResult = runTenderCrawl();

    // Broadcast alert to dedicated Telegram bot
    const shouldNotify = req.nextUrl.searchParams.get("notify") !== "false";
    let telegramSent = false;

    if (shouldNotify) {
      telegramSent = await broadcastTenderTelegramAlert(crawlResult);
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      engine: "RadarTender.id Autonomous Crawler & Alert Engine",
      telegramSent,
      summary: {
        totalMonitored: crawlResult.totalMonitored,
        totalHpsValue: crawlResult.totalHpsValue,
        urgentCount: crawlResult.urgentCount,
      },
      topUrgent: crawlResult.topUrgentTenders.map((t) => ({
        code: t.tender_code,
        title: t.title,
        hps: t.hps_value,
        days_remaining: t.days_remaining,
      })),
    });
  } catch (error: any) {
    console.error("[Tender Crawler API] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to execute tender crawl",
      },
      { status: 500 }
    );
  }
}
