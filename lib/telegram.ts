export async function sendTelegramNotification(message: string): Promise<boolean> {
  // Dedicated Radar Tender Bot Token
  const token =
    process.env.RADARTENDER_BOT_TOKEN ||
    process.env.TELEGRAM_BOT_TOKEN;
  const chatId =
    process.env.RADARTENDER_CHAT_ID ||
    process.env.TELEGRAM_CHAT_ID ||
    "1013981853";

  if (!token || !chatId) {
    console.warn("[RadarTender Telegram] Bot token or Chat ID not configured. Please set RADARTENDER_BOT_TOKEN.");
    return false;
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown",
      }),
    });
    return res.ok;
  } catch (err) {
    console.error("[RadarTender Telegram] Error sending alert:", err);
    return false;
  }
}

