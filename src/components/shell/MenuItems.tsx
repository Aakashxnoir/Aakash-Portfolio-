"use client";

import { useRouter } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { labels, menus, site, type Phosphor } from "@/content/site";
import { projects } from "@/content/projects";
import { openExtra } from "@/lib/extras";
import { markOpen } from "@/lib/window";
import {
  motionAllowed,
  onPrefsChange,
  readPrefs,
  writePrefs,
  DEFAULT_PREFS,
  type Prefs,
} from "@/lib/prefs";
import { MenuButton, MenuLabel, MenuRule } from "./Menu";

function closeMenus() {
  document
    .querySelectorAll("details[data-menu][open]")
    .forEach((menu) => menu.removeAttribute("open"));
}

let cachedPrefs: Prefs = DEFAULT_PREFS;
function prefsSnapshot() {
  const next = readPrefs();
  if (
    next.phosphor !== cachedPrefs.phosphor ||
    next.crt !== cachedPrefs.crt ||
    next.motion !== cachedPrefs.motion
  ) {
    cachedPrefs = next;
  }
  return cachedPrefs;
}

export function usePrefs() {
  return useSyncExternalStore(onPrefsChange, prefsSnapshot, () => DEFAULT_PREFS);
}

export function CopyEmailItem() {
  const [copied, setCopied] = useState(false);
  return (
    <MenuButton
      className="js-only"
      note={copied ? labels.copied : undefined}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(site.email);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1600);
        } catch {
          window.location.href = `mailto:${site.email}`;
        }
      }}
    >
      {menus.file.copyEmail}
    </MenuButton>
  );
}

/** Extras: the terminal and Lights Out. */
export function ToyItems() {
  const extras = menus.extras;
  return (
    <div className="js-only">
      <MenuLabel>{extras.cartridge}</MenuLabel>
      <MenuButton
        onClick={() => {
          closeMenus();
          openExtra("terminal");
        }}
      >
        {extras.terminal}
      </MenuButton>
      <MenuButton
        note={extras.lightsOutNote}
        onClick={() => {
          closeMenus();
          openExtra("lights");
        }}
      >
        {extras.lightsOut}
      </MenuButton>
      <MenuRule />
    </div>
  );
}

export function SurpriseItem() {
  const router = useRouter();
  return (
    <MenuButton
      className="js-only"
      onClick={() => {
        const here = window.location.pathname;
        const pool = projects.filter((p) => `/work/${p.slug}` !== here);
        const pick = pool[Math.floor(Math.random() * pool.length)];
        closeMenus();
        markOpen(window.innerWidth / 2, window.innerHeight / 2);
        router.push(`/work/${pick.slug}`, { transitionTypes: ["open"] });
      }}
    >
      {menus.extras.surprise}
    </MenuButton>
  );
}

export function SystemItems() {
  const prefs = usePrefs();
  // Whether motion actually runs: "auto" follows the system setting.
  const moving = useSyncExternalStore(onPrefsChange, motionAllowed, () => true);
  const [about, setAbout] = useState(false);
  const system = menus.system;
  return (
    <div className="js-only">
      <MenuLabel>{system.phosphor}</MenuLabel>
      {system.phosphors.map((p) => (
        <MenuButton
          key={p.id}
          pressed={prefs.phosphor === p.id}
          note={prefs.phosphor === p.id ? "●" : undefined}
          onClick={() => writePrefs({ phosphor: p.id as Phosphor })}
        >
          {p.label}
        </MenuButton>
      ))}
      <MenuRule />
      <MenuButton
        pressed={prefs.crt === "on"}
        note={prefs.crt === "on" ? "on" : "off"}
        onClick={() => writePrefs({ crt: prefs.crt === "on" ? "off" : "on" })}
      >
        {system.crt}
      </MenuButton>
      <MenuButton
        pressed={moving}
        note={moving ? "on" : "off"}
        onClick={() => writePrefs({ motion: moving ? "off" : "on" })}
      >
        {system.motion}
      </MenuButton>
      <MenuRule />
      <MenuButton
        onClick={() => {
          closeMenus();
          openExtra("sleep");
        }}
      >
        {system.sleep}
      </MenuButton>
      <MenuButton note={about ? "−" : "+"} onClick={() => setAbout(!about)}>
        {system.about}
      </MenuButton>
      {about && <p className="max-w-72 px-4 py-2 text-ui text-text-muted">{system.aboutBody}</p>}
    </div>
  );
}
