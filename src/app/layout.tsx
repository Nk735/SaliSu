import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { ServiceWorker } from "@/components/shell/ServiceWorker";

export const metadata: Metadata = {
  title: "SaliSu",
  description: "Carpooling quotidiano dei pendolari di Bari",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "SaliSu" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#08080A",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{__html:"try{document.documentElement.dataset.theme=localStorage.getItem('salisu-theme')==='light'?'light':'dark'}catch{document.documentElement.dataset.theme='dark'}"}} />
      </head>
      <body>{children}<ServiceWorker /><Analytics /></body>
    </html>
  );
}
