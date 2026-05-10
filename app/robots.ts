import type { MetadataRoute } from "next";
import { SITE_URL } from "@/src/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/legal", "/legal/", "/r/"],
        disallow: ["/admin", "/dashboard", "/api", "/login", "/onboarding"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
