import type { Metadata } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import "lenis/dist/lenis.css";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import Cursor from "@/components/motion/Cursor";
import Loader from "@/components/motion/Loader";
import MotionRoot from "@/components/motion/MotionRoot";
import PageTransition from "@/components/motion/PageTransition";
import { hero, labels, site, siteUrl } from "@/content/site";
import { motionInitScript } from "@/lib/motion";
import "./globals.css";

// Variable weight and width: one file per style covers the condensed display
// cuts and the normal-width body text.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  style: ["normal", "italic"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${site.name} | Portfolio`, template: `%s | ${site.name}` },
  description: hero.line,
  openGraph: { type: "website", siteName: site.name },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      // The head script adds the `motion` class before hydration.
      suppressHydrationWarning
      className={`${archivo.variable} ${jetbrains.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionInitScript }} />
      </head>
      <body className="flex min-h-screen flex-col">
        <a
          href="#main"
          className="type-label fixed left-page top-4 z-50 -translate-y-24 bg-bg px-3 py-2 text-text focus:translate-y-0"
        >
          {labels.skipToContent}
        </a>
        <MotionRoot />
        <Loader />
        <Nav />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <PageTransition />
        <Cursor />
      </body>
    </html>
  );
}
