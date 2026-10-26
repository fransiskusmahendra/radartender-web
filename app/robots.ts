import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/admin/", "/api/cron/"],
      },
      {
        userAgent: [
          "Googlebot",
          "Bingbot",
          "Applebot",
          "PerplexityBot",
          "GPTBot",
          "ChatGPT-User",
          "ClaudeBot",
          "Google-Extended",
        ],
        allow: "/",
        disallow: ["/api/admin/", "/api/cron/"],
      },
    ],
    sitemap: "https://radartender.id/sitemap.xml",
    host: "https://radartender.id",
  };
}
