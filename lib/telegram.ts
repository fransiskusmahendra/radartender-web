export async function sendTelegramNotification(message: string): Promise<boolean> {
  // Dedicated RadarTender Bot Token & Chat ID
  const defaultToken = Buffer.from(
    "ODgzMzg2NzA1MjpBQUVOTXNZOVJuUmhfWWNsMXRnamFLXzNQaGd2Q0FNalJGcw==",
    "base64"
  ).toString("utf-8");
  const defaultChatId = "1013981853";

  const token =
    process.env.RADARTENDER_BOT_TOKEN ||
    process.env.TELEGRAM_BOT_TOKEN ||
    defaultToken;
  const chatId =
    process.env.RADARTENDER_CHAT_ID ||
    process.env.TELEGRAM_CHAT_ID ||
    defaultChatId;

  if (!token || !chatId) {
    console.warn("[RadarTender Telegram] Bot token or Chat ID not configured.");
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
