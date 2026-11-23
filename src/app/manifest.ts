import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SaliSu",
    short_name: "SaliSu",
    description: "Carpooling quotidiano dei pendolari di Bari",
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#F5F7F5",
    theme_color: "#86BC25",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
