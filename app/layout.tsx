import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RadarTender.id — Intelijen Tender Pengadaan & Penjaminan Proyek (Surety Bond)",
  description:
    "Pantau lelang LPSE & BUMN se-Indonesia dengan hitung mundur batas upload dan fasilitas penerbitan Surety Bond & Bank Garansi resmi berizin OJK.",
  keywords: [
    "Radar Tender",
    "Tender LPSE",
    "LPSE Indonesia",
    "Surety Bond",
    "Bank Garansi",
    "Jaminan Penawaran",
    "Jaminan Pelaksanaan",
    "Pengadaan Barang dan Jasa",
  ],
  authors: [{ name: "CV QIRA Solusi Digital", url: "https://www.qirasolution.com" }],
  openGraph: {
    title: "RadarTender.id — Intelijen Pengadaan & Penjaminan Proyek",
    description:
      "Pantau lelang proyek miliaran rupiah dan dapatkan asistensi penerbitan jaminan tender (Surety Bond & Bank Garansi) express.",
    url: "https://radartender.id",
    siteName: "RadarTender.id",
    locale: "id_ID",
    type: "website",
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
