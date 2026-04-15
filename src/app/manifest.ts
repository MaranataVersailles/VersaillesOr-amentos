import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Versailles - Gerador de Orçamentos",
    short_name: "Versailles",
    description:
      "Sistema de geração de orçamentos profissionais para vidraçaria",
    start_url: "/",
    display: "standalone",
    background_color: "#0d0d0d",
    theme_color: "#BE9610",
    orientation: "portrait",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
