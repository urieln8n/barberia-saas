import type { MetadataRoute } from "next";
import { BUSINESS_CONFIG, SEO_INTENT_PAGES } from "@/src/lib/site-config";
import { institutionalPageList } from "@/src/lib/institutional-pages";
import { legalPages } from "@/components/legal/legal-content";

const SITE_URL = BUSINESS_CONFIG.siteUrl;

const commercialRoutes = SEO_INTENT_PAGES.filter((page) => page.status === "publicada").map((page) => ({
  path: page.path,
  priority: page.path === "/barberias" ? 0.8 : 0.9,
}));

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: `${SITE_URL}/demo`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    ...commercialRoutes.map(({ path, priority }) => ({
      url: `${SITE_URL}${path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority,
    })),
    ...institutionalPageList.map((page) => ({
      url: `${SITE_URL}${page.path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    {
      url: `${SITE_URL}/legal`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.4,
    },
    ...legalPages.map((page) => ({
      url: `${SITE_URL}${page.href}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.4,
    })),
  ];
}
