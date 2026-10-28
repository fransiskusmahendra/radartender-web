import { Metadata } from "next";
import { PROGRAMMATIC_PAGES } from "@/lib/programmatic-seo";
import { TenderCategoryClient } from "../TenderCategoryClient";

const config = PROGRAMMATIC_PAGES["ikn"];

export const metadata: Metadata = {
  title: config.metaTitle,
  description: config.metaDescription,
  keywords: config.keywords,
  alternates: {
    canonical: "https://radartender.id/tender/ikn",
  },
  openGraph: {
    title: config.metaTitle,
    description: config.metaDescription,
    url: "https://radartender.id/tender/ikn",
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

export default function TenderIknPage() {
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
        item: "https://radartender.id/tender/ikn",
      },
    ],
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: config.heading,
    description: config.description,
    url: "https://radartender.id/tender/ikn",
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
