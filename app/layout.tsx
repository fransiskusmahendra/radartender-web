import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://radartender.id"),
  title: "RadarTender.id — Intelijen Pengadaan & Jaminan Proyek (Surety Bond)",
  description:
    "Pantau lelang proyek LPSE & BUMN se-Indonesia dengan hitung mundur batas upload dokumen, serta simulasi instan Jaminan Penawaran & Pelaksanaan (Surety Bond).",
  keywords: [
    "Radar Tender",
    "Tender LPSE",
    "LPSE Indonesia",
    "Surety Bond",
    "Bank Garansi",
    "Jaminan Penawaran",
    "Jaminan Pelaksanaan",
    "Pengadaan Barang dan Jasa",
    "LKPP",
  ],
  authors: [{ name: "CV QIRA Solusi Digital", url: "https://www.qirasolution.com" }],
  openGraph: {
    title: "RadarTender.id — Intelijen Pengadaan & Kalkulator Jaminan Proyek",
    description:
      "Pantau lelang LPSE & BUMN bernilai miliaran rupiah dengan hitung mundur batas penawaran serta asistensi penerbitan Surety Bond express.",
    url: "https://radartender.id",
    siteName: "RadarTender.id",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RadarTender.id — Intelijen Pengadaan & Jaminan Proyek",
    description:
      "Pantau lelang LPSE & BUMN se-Indonesia dengan hitung mundur batas dokumen dan kalkulator Surety Bond instan.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className="bg-slate-950 text-slate-100 antialiased min-h-screen flex flex-col justify-between">
        {children}
      </body>
    </html>
  );
}
