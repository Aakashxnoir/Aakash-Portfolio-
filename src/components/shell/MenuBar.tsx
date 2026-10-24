import Link from "next/link";
import { apps, labels, menus, site } from "@/content/site";
import Clock from "./Clock";
import { Menu, MenuLabel, MenuLink, MenuRule } from "./Menu";
import { CopyEmailItem, SurpriseItem, SystemItems, ToyItems } from "./MenuItems";

/** The OS menu bar: home mark, File / Extras / System, status, résumé, clock. */
export default function MenuBar() {
  return (
    <header
      className="fixed inset-x-0 top-0 z-50 flex h-bar items-stretch border-b border-rule bg-bg text-ui"
      style={{ viewTransitionName: "menubar" }}
    >
      <Link
        href="/"
        transitionTypes={["close"]}
        aria-label={labels.home}
        className="type-display flex items-center border-r border-rule px-3 text-[17px] text-text md:px-4"
      >
        ABK
      </Link>
      <nav aria-label={labels.menuBar} className="flex items-stretch">
        <Menu label={menus.file.label}>
          <MenuLabel>{menus.file.open}</MenuLabel>
          {apps.map((app) => (
            <MenuLink key={app.id} href={app.href} note={app.number}>
              {app.file}
            </MenuLink>
          ))}
          <MenuRule />
          <MenuLink href="/contact">{menus.file.newMessage}</MenuLink>
          <MenuLink href={site.resume} external note="↗">
            {menus.file.resume}
          </MenuLink>
          <MenuLink href={site.resume} download note="↓">
            {menus.file.downloadResume}
          </MenuLink>
          <CopyEmailItem />
          <MenuRule />
          <MenuLink href={site.github} external note="↗">
            {menus.file.github}
          </MenuLink>
          <MenuLink href={site.linkedin} external note="↗">
            {menus.file.linkedin}
          </MenuLink>
        </Menu>
        <Menu label={menus.extras.label}>
          <ToyItems />
          <SurpriseItem />
          <noscript>
            <p className="px-4 py-2 text-text-muted">{labels.noJs}</p>
          </noscript>
        </Menu>
        <Menu label={menus.system.label}>
          <SystemItems />
          <noscript>
            <p className="px-4 py-2 text-text-muted">{labels.noJs}</p>
          </noscript>
        </Menu>
      </nav>
      <div className="ml-auto flex items-stretch">
        <Link
          href="/contact"
          className="flex items-center gap-2 border-l border-rule px-3 text-accent transition-colors hover:bg-accent hover:text-bg md:px-4"
        >
          <span aria-hidden className="breathe size-2 bg-current" />
          <span className="hidden sm:inline">{labels.status}</span>
          <span className="sr-only sm:hidden">{labels.status}</span>
        </Link>
        <a
          href={site.resume}
          target="_blank"
          rel="noreferrer"
          className="hidden items-center border-l border-rule px-4 text-text-soft transition-colors hover:text-accent md:flex"
        >
          {labels.resume} ↗
        </a>
        <a
          href={site.resume}
          download
          aria-label={labels.downloadResume}
          className="hidden items-center border-l border-rule px-3 text-text-soft transition-colors hover:text-accent md:flex"
        >
          ↓
        </a>
        <Clock className="hidden items-center gap-1.5 border-l border-rule px-4 text-text-soft lg:flex" />
      </div>
    </header>
  );
}
