export async function sendTelegramNotification(message: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN || "8691156717:AAEjRYYDEudqEekI3CUr-YFkJMKRE_9yFTw";
  const chatId = process.env.TELEGRAM_CHAT_ID || "1013981853";

  if (!token || !chatId) {
    console.warn("[Telegram] Token or Chat ID not configured");
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
    console.error("[Telegram] Error sending alert:", err);
    return false;
  }
}
