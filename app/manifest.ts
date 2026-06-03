import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BarberíaOS",
    short_name: "BarberíaOS",
    description: "Sistema de reservas, caja, inventario y marketing para barberías.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAF7EF",
    theme_color: "#FAF7EF",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
