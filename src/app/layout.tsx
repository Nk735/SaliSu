import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { ServiceWorker } from "@/components/shell/ServiceWorker";

export const metadata: Metadata = {
  title: "SaliSu (Alfa Bari)",
  description: "Carpooling quotidiano dei pendolari di Bari",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "SaliSu" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F6F5F1" },
    { media: "(prefers-color-scheme: dark)", color: "#08080A" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body>{children}<ServiceWorker /><Analytics /></body>
    </html>
  );
}
