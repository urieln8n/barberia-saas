import type { MetadataRoute } from "next";
import { SITE_URL } from "@/src/lib/site-url";
import { legalPages } from "@/components/legal/legal-content";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = ["", "/login", "/legal"];

  return [
    ...staticRoutes.map((route) => ({
      url: `${SITE_URL}${route}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : route === "/legal" ? 0.7 : 0.4,
    })),
    ...legalPages.map((page) => ({
      url: `${SITE_URL}${page.href}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
