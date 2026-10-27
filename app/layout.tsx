import type { Metadata, Viewport } from "next";
import "./globals.css";
import { FAQ_DATA } from "@/lib/faq-data";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";

export const viewport: Viewport = {
  themeColor: "#020617",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://radartender.id"),
  title: {
    default: "RadarTender.id — Portal Intelijen Tender LPSE & BUMN Terbesar, Kalkulator Surety Bond Online",
    template: "%s | RadarTender.id",
  },
  description:
    "Pantau 500+ lelang LPSE kementerian, pemprov, & BUMN bernilai miliaran rupiah secara real-time. Dilengkapi hitung mundur batas upload dokumen, cetak draf estimasi PDF, dan kalkulator jaminan proyek (Surety Bond & Bank Garansi) resmi.",
  keywords: [
    "Radar Tender",
    "Tender LPSE hari ini",
    "Info lelang LPSE 2026",
    "Tender BUMN terbaru",
    "Lelang konstruksi Indonesia",
    "Kalkulator Surety Bond",
    "Jaminan Penawaran Bid Bond",
    "Jaminan Pelaksanaan Performance Bond",
    "Jaminan Uang Muka Advance Payment",
    "Jaminan Pemeliharaan Maintenance Bond",
    "Bank Garansi proyek",
    "Asuransi umum penjaminan",
    "Pengadaan Barang dan Jasa LKPP",
    "Tender IKN Nusantara",
    "Draf estimasi tender PDF",
    "RadarTender",
    "Aplikasi pemantau lelang",
  ],
  authors: [{ name: "RadarTender Indonesia", url: "https://radartender.id" }],
  creator: "Fransiskus Xaverius Mahendra",
  publisher: "RadarTender.id",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://radartender.id",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "RadarTender.id — Intelijen Pengadaan BUMN/LPSE & Kalkulator Jaminan Proyek",
    description:
      "Pantau lelang LPSE & BUMN bernilai miliaran rupiah se-Indonesia dengan hitung mundur batas dokumen dan asistensi penerbitan Surety Bond express.",
    url: "https://radartender.id",
    siteName: "RadarTender.id",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RadarTender.id — Intelijen Pengadaan LPSE & Surety Bond",
    description:
      "Agregasi ratusan lelang konstruksi & BUMN se-Indonesia dengan hitung mundur batas penawaran dan kalkulator jaminan proyek.",
  },
  category: "Business & Procurement Intelligence",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Schema.org JSON-LD Structured Data
  const jsonLdWebSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "RadarTender.id",
    url: "https://radartender.id",
    description:
      "Platform intelijen pengadaan lelang LPSE & BUMN se-Indonesia dan kalkulator Surety Bond resmi.",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://radartender.id/?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  const jsonLdOrganization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "RadarTender.id",
    url: "https://radartender.id",
    logo: "https://radartender.id/icon.png",
    founder: {
      "@type": "Person",
      name: "Fransiskus Xaverius Mahendra Kotualubun",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+62-813-1462-0473",
      email: "kontak@radartender.id",
      contactType: "customer service",
      areaServed: "ID",
      availableLanguage: ["Indonesian"],
    },
    sameAs: [
      "https://www.linkedin.com/company/radartender",
      "https://www.instagram.com/radartender.id",
    ],
  };

  const jsonLdSoftwareApp = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "RadarTender.id SaaS Platform",
    operatingSystem: "All (Web Browser, iOS, Android, Windows, Mac)",
    applicationCategory: "BusinessApplication",
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "IDR",
      lowPrice: "79000",
      highPrice: "599000",
      offerCount: "3",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "182",
      bestRating: "5",
      worstRating: "1",
    },
  };

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_DATA.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <html lang="id" className="scroll-smooth">
      <head>
        <link rel="canonical" href="https://radartender.id" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="RadarTender" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSoftwareApp) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
        />
      </head>
      <body className="bg-slate-950 text-slate-100 antialiased min-h-screen flex flex-col justify-between">
        {children}
        <PWAInstallPrompt />
      </body>
    </html>
  );
}
