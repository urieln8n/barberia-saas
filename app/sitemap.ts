import type { MetadataRoute } from "next";
import { BUSINESS_CONFIG, SEO_INTENT_PAGES } from "@/src/lib/site-config";
import { institutionalPageList } from "@/src/lib/institutional-pages";
import { legalPages } from "@/components/legal/legal-content";
import { createClient } from "@/src/lib/supabase/server";

const SITE_URL = BUSINESS_CONFIG.siteUrl;

const commercialRoutes = SEO_INTENT_PAGES.filter((page) => page.status === "publicada").map(
  (page) => ({
    path: page.path,
    priority: page.path === "/barberias" ? 0.8 : 0.9,
  }),
);

function citySlug(value: string | null) {
  return encodeURIComponent((value ?? "").trim().toLowerCase());
}

function profileSlug(profile: { public_slug?: string | null; slug?: string | null }) {
  return (profile.public_slug ?? profile.slug ?? "").trim();
}

async function getMarketplaceProfiles() {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("barbershop_public_profiles")
      .select("slug, public_slug, city, updated_at")
      .eq("is_published", true)
      .eq("marketplace_enabled", true);

    return data ?? [];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const marketplaceProfiles = await getMarketplaceProfiles();

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
      url: `${SITE_URL}/alternativa-a-booksy`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/calculadora-booksy`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/pedir-demo`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/barberias-fundadoras`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/blog/cuanto-cobra-booksy`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/instagram`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
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
    ...marketplaceProfiles
      .filter((profile) => profileSlug(profile) && profile.city)
      .map((profile) => ({
        url: `${SITE_URL}/barberias/${citySlug(profile.city)}/${profileSlug(profile)}`,
        lastModified: profile.updated_at ? new Date(profile.updated_at) : now,
        changeFrequency: "weekly" as const,
        priority: profileSlug(profile) === "demo-barber" ? 0.6 : 0.7,
      })),
  ];
}
