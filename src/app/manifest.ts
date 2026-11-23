import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SaliSu - Alfa Bari",
    short_name: "SaliSu",
    description: "Carpooling quotidiano dei pendolari di Bari",
    start_url: "/home",
    display: "standalone",
    background_color: "#F5F7F5",
    theme_color: "#86BC25",
    icons: [
      { src: "/icons/icon-192.svg", sizes: "192x192", type: "image/svg+xml" },
      { src: "/icons/icon-512.svg", sizes: "512x512", type: "image/svg+xml", purpose: "any" },
      { src: "/icons/icon-maskable-512.svg", sizes: "512x512", type: "image/svg+xml", purpose: "maskable" },
    ],
  };
}
