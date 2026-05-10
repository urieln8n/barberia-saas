import type { MetadataRoute } from "next";
import { SITE_URL } from "@/src/lib/site-url";
import { legalPages } from "@/components/legal/legal-content";

const commercialRoutes = [
  { path: "/software-para-barberias", priority: 0.9 },
  { path: "/agenda-online-barberia", priority: 0.9 },
  { path: "/programa-reservas-barberia", priority: 0.85 },
  { path: "/alternativa-booksy-barberias", priority: 0.85 },
  { path: "/barberias", priority: 0.8 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    ...commercialRoutes.map(({ path, priority }) => ({
      url: `${SITE_URL}${path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority,
    })),
    {
      url: `${SITE_URL}/login`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
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
