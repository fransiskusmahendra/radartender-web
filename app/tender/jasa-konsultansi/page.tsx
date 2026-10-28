import { Metadata } from "next";
import { PROGRAMMATIC_PAGES } from "@/lib/programmatic-seo";
import { TenderCategoryClient } from "@/components/TenderCategoryClient";

const config = PROGRAMMATIC_PAGES["jasa-konsultansi"];

export const metadata: Metadata = {
  title: config.metaTitle,
  description: config.metaDescription,
  keywords: config.keywords,
  alternates: {
    canonical: "https://radartender.id/tender/jasa-konsultansi",
  },
  openGraph: {
    title: config.metaTitle,
    description: config.metaDescription,
    url: "https://radartender.id/tender/jasa-konsultansi",
    siteName: "RadarTender.id",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: config.metaTitle,
    description: config.metaDescription,
  },
};

export default function TenderJasaKonsultansiPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Beranda",
        item: "https://radartender.id",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Katalog Tender",
        item: "https://radartender.id/#radar-feed",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: config.title,
        item: "https://radartender.id/tender/jasa-konsultansi",
      },
    ],
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: config.heading,
    description: config.description,
    url: "https://radartender.id/tender/jasa-konsultansi",
    isPartOf: {
      "@type": "WebSite",
      name: "RadarTender.id",
      url: "https://radartender.id",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <TenderCategoryClient config={config} />
    </>
  );
}
