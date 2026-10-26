import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "RadarTender.id — Intelijen Tender & Jaminan Proyek",
    short_name: "RadarTender",
    description: "Pantau ratusan lelang LPSE & BUMN se-Indonesia dengan hitung mundur batas upload dan kalkulator Surety Bond resmi.",
    start_url: "/",
    display: "standalone",
    background_color: "#020617",
    theme_color: "#020617",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
