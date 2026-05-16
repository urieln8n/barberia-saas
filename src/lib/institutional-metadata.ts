import type { Metadata } from "next";
import { BUSINESS_CONFIG } from "@/src/lib/site-config";
import type { InstitutionalPage } from "@/src/lib/institutional-pages";

export function getInstitutionalMetadata(page: InstitutionalPage): Metadata {
  const url = `${BUSINESS_CONFIG.siteUrl}${page.path}`;

  return {
    title: { absolute: page.title },
    description: page.description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: page.title,
      description: page.description,
      siteName: BUSINESS_CONFIG.commercialName,
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      images: ["/opengraph-image"],
    },
  };
}
