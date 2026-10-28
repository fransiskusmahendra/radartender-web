import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PROGRAMMATIC_PAGES } from "@/lib/programmatic-seo";
import { TenderCategoryClient } from "./TenderCategoryClient";

interface PageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return Object.keys(PROGRAMMATIC_PAGES).map((slug) => ({
    slug,
  }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const config = PROGRAMMATIC_PAGES[params.slug];
  if (!config) return { title: "Tender Tidak Ditemukan | RadarTender.id" };

  const url = `https://radartender.id/tender/${config.slug}`;

  return {
    title: config.metaTitle,
    description: config.metaDescription,
    keywords: config.keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: config.metaTitle,
      description: config.metaDescription,
      url,
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
}

export default function TenderProgrammaticPage({ params }: PageProps) {
  const config = PROGRAMMATIC_PAGES[params.slug];
  if (!config) notFound();

  // Structured Data Schema for Breadcrumb and Category Collection
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
        item: `https://radartender.id/tender/${config.slug}`,
      },
    ],
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: config.heading,
    description: config.description,
    url: `https://radartender.id/tender/${config.slug}`,
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
