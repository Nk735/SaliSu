import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ServiceWorker } from "@/components/shell/ServiceWorker";

export const metadata: Metadata = {
  title: "SaliSu (Alfa Bari)",
  description: "Carpooling quotidiano dei pendolari di Bari",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "SaliSu" },
};

export const viewport: Viewport = { themeColor: "#BE0F2D", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body>{children}<ServiceWorker /></body>
    </html>
  );
}
