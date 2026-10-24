import Image from "next/image";
import Window from "@/components/shell/Window";
import AppIcon from "@/components/desktop/AppIcon";
import { apps, desktop, labels, site } from "@/content/site";

const corners = [
  "md:top-8 md:left-shell",
  "md:top-8 md:right-shell",
  "md:bottom-8 md:left-shell",
  "md:bottom-8 md:right-shell",
];

export default function Desktop() {
  return (
    <Window>
      <div className="relative md:h-[calc(100svh-var(--bar-height))] md:min-h-[620px] md:overflow-hidden">
        {/* The portrait, a plain photo; its cut-off lower edge fades out under the name. */}
        <div className="relative mx-auto aspect-[540/418] w-full max-w-[520px] [mask-image:linear-gradient(to_bottom,#000_72%,transparent)] md:absolute md:inset-x-0 md:top-[4%] md:bottom-[24%] md:aspect-auto md:max-w-[min(640px,52vw)]">
          <Image
            src={desktop.portrait.src}
            alt={desktop.portrait.alt}
            fill
            priority
            sizes="(min-width: 768px) 640px, 100vw"
            className="object-contain object-bottom"
          />
        </div>

        <div className="relative z-10 px-shell text-center md:absolute md:inset-x-0 md:bottom-[9%]">
          <p className="type-label mx-auto -mt-4 inline-block bg-bg px-3 py-1 tracking-[0.3em] text-text-soft md:mt-0">
            {desktop.role}
          </p>
          <h1 data-scramble className="type-display mt-3 text-name text-text md:whitespace-nowrap">
            {desktop.name}
          </h1>
          <p className="mx-auto mt-5 max-w-[60ch] text-body text-text-soft md:text-lead">
            {desktop.line}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a href={site.resume} download className="btn btn-primary">
              {labels.downloadResume} ↓
            </a>
            <a href={site.resume} target="_blank" rel="noreferrer" className="btn bg-bg">
              {labels.viewResume} ↗
            </a>
            <a href={site.github} target="_blank" rel="noreferrer" className="btn bg-bg">
              {labels.github} ↗
            </a>
            <a href={site.linkedin} target="_blank" rel="noreferrer" className="btn bg-bg">
              {labels.linkedin} ↗
            </a>
          </div>
          <p className="type-label mt-5 text-text-muted">{desktop.education}</p>
        </div>

        <nav aria-label={labels.appsNav} className="mt-10 px-shell pb-10 md:static md:m-0 md:p-0">
          <ul className="border-t border-rule md:border-0">
            {apps.map((app, index) => (
              <li key={app.id} className={`md:absolute md:z-10 ${corners[index]}`}>
                <AppIcon app={app} align={index % 2 ? "right" : "left"} />
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </Window>
  );
}
