import { MetadataRoute } from "next";
import { PROGRAMMATIC_PAGES } from "@/lib/programmatic-seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://radartender.id";
  const now = new Date();

  const programmaticRoutes: MetadataRoute.Sitemap = Object.keys(PROGRAMMATIC_PAGES).map((slug) => ({
    url: `${baseUrl}/tender/${slug}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.85,
  }));

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/kalkulator`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/harga`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...programmaticRoutes,
  ];
}
