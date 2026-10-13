import type { Metadata } from "next";
import { Doto, JetBrains_Mono } from "next/font/google";
import Extras from "@/components/extras/Extras";
import Boot from "@/components/motion/Boot";
import MotionController from "@/components/motion/Motion";
import SmoothScroll from "@/components/motion/SmoothScroll";
import MenuBar from "@/components/shell/MenuBar";
import MenuController from "@/components/shell/MenuController";
import WindowOrigin from "@/components/shell/WindowOrigin";
import { desktop, labels, site, siteUrl } from "@/content/site";
import { prefsInitScript } from "@/lib/prefs";
import "./globals.css";

// Variable weight plus the dot-roundness axis.
const doto = Doto({
  variable: "--font-doto",
  subsets: ["latin"],
  axes: ["ROND"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${site.name} | ${site.os}`, template: `%s | ${site.name}` },
  description: desktop.line,
  openGraph: { type: "website", siteName: site.name },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      // The head script sets the phosphor, CRT, motion and boot attributes before hydration.
      suppressHydrationWarning
      className={`${doto.variable} ${jetbrains.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: prefsInitScript }} />
      </head>
      <body className="min-h-svh">
        <a
          href="#main"
          className="type-label fixed top-2 left-2 z-[70] -translate-y-24 bg-accent px-3 py-2 text-bg focus:translate-y-0"
        >
          {labels.skipToContent}
        </a>
        <MenuBar />
        <main id="main" className="pt-bar">
          {children}
        </main>
        <Boot />
        <Extras />
        <div className="crt" aria-hidden />
        <MenuController />
        <WindowOrigin />
        <SmoothScroll />
        <MotionController />
      </body>
    </html>
  );
}
