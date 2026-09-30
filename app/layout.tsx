import type { Metadata, Viewport } from "next";
// Self-hosted variable fonts (no third-party requests at build or runtime)
import "@fontsource-variable/sora/wght.css";
import "@fontsource-variable/inter/wght.css";
import { SITE } from "@/content/site";
import "./globals.css";


export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: "SIENA — AI Solutions & Systems | The Evolution of Business Systems",
  description: SITE.description,
  openGraph: {
    title: "SIENA — The Evolution of Business Systems",
    description: "From paper. To software. To intelligence.",
    images: [{ url: "/brand/og.jpg", width: 1200, height: 630, alt: "SIENA — AI Solutions & Systems" }],
    type: "website",
  },
};

export const viewport: Viewport = { themeColor: "#03060e", colorScheme: "dark" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
