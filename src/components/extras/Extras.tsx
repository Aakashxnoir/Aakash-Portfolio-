"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { onExtra } from "@/lib/extras";
import Screensaver from "./Screensaver";

// The toys load the first time they are opened.
const Terminal = dynamic(() => import("./Terminal"), { ssr: false });
const LightsOut = dynamic(() => import("./LightsOut"), { ssr: false });

type Toy = "terminal" | "lights";

/** Hosts Extras (terminal, Lights Out) and the screensaver. Nothing here exists without JS. */
export default function Extras() {
  const [open, setOpen] = useState<Toy | null>(null);
  const [loaded, setLoaded] = useState<Toy[]>([]);

  useEffect(
    () =>
      onExtra((extra) => {
        if (extra === "sleep") {
          setOpen(null);
          return;
        }
        setLoaded((list) => (list.includes(extra) ? list : [...list, extra]));
        setOpen(extra);
      }),
    [],
  );

  const close = () => setOpen(null);

  return (
    <>
      {loaded.includes("terminal") && <Terminal open={open === "terminal"} onClose={close} />}
      {loaded.includes("lights") && <LightsOut open={open === "lights"} onClose={close} />}
      <Screensaver />
    </>
  );
}
