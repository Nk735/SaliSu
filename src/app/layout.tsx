import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { ServiceWorker } from "@/components/shell/ServiceWorker";

export const metadata: Metadata = {
  title: "SaliSu (Alfa Bari)",
  description: "Carpooling quotidiano dei pendolari di Bari",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "SaliSu" },
};

export const viewport: Viewport = { themeColor: "#86BC25", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body>{children}<ServiceWorker /><Analytics /></body>
    </html>
  );
}
