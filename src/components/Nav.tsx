"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Container from "./Container";
import Magnetic from "./motion/Magnetic";
import { labels, nav, site } from "@/content/site";

function isCurrent(href: string, pathname: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Fixed top bar with a solid `--bg` fill, so page content scrolling under it
 * is hidden instead of colliding with the labels.
 */
export default function Nav() {
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-0 z-40 bg-bg">
      <Container className="flex h-nav items-center justify-between">
        <Link href="/" className="type-label text-text">
          {site.shortName}
        </Link>
        <nav aria-label="Primary">
          <ul className="flex items-center gap-10">
            {nav.map((link) => {
              const current = isCurrent(link.href, pathname);
              return (
                <li key={link.href}>
                  <Magnetic>
                    <Link
                      href={link.href}
                      aria-current={current ? "page" : undefined}
                      className={`type-label border-b pb-1 transition-colors duration-300 hover:text-text ${
                        current ? "border-text text-text" : "border-transparent text-text-muted"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </Magnetic>
                </li>
              );
            })}
            <li>
              <Magnetic>
                <a
                  href={site.resume}
                  download
                  className="type-label border-b border-transparent pb-1 text-text-muted transition-colors duration-300 hover:text-text"
                >
                  {labels.resume}
                </a>
              </Magnetic>
            </li>
          </ul>
        </nav>
      </Container>
    </header>
  );
}
