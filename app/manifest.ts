import type { MetadataRoute } from "next";
import { SITE_URL } from "@/src/lib/site-url";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BarberíaOS",
    short_name: "BarberíaOS",
    description: "SaaS de reservas, QR, agenda y caja para barberías",
    id: SITE_URL,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0a0a0a",
    orientation: "portrait",
    categories: ["business", "productivity"],
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
