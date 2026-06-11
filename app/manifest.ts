import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BarberíaOS",
    short_name: "BarberíaOS",
    description: "Reservas, agenda, caja y clientes para tu barbería",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#0D0D0F",
    theme_color: "#D4AF37",
    orientation: "portrait-primary",
    categories: ["business", "productivity"],
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Nueva cita",
        short_name: "Cita",
        description: "Abrir agenda",
        url: "/dashboard/agenda",
        icons: [{ src: "/icon.svg", sizes: "any" }],
      },
      {
        name: "Clientes",
        short_name: "Clientes",
        url: "/dashboard/clientes",
        icons: [{ src: "/icon.svg", sizes: "any" }],
      },
    ],
  };
}
