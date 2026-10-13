import Image from "next/image";
import Link from "next/link";
import AsciiArt from "@/components/ascii/AsciiArt";
import { caseLabels, caseNumber, projects, type Project } from "@/content/projects";
import SpecTable, { type Spec } from "./SpecTable";

function facts(project: Project): Spec[] {
  const rows: (Spec | false)[] = [
    { label: caseLabels.year, value: project.year },
    !!project.award && {
      label: caseLabels.award,
      value: <span className="text-accent">{project.award}</span>,
    },
    !!project.role && { label: caseLabels.role, value: project.role },
    !!project.team && { label: caseLabels.team, value: project.team },
    { label: caseLabels.stack, value: project.stack.join(", ") },
    project.links.length > 0 && {
      label: caseLabels.links,
      value: (
        <span className="flex flex-wrap justify-end gap-x-4">
          {project.links.map((link) => (
            <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className="link">
              {link.label} ↗
            </a>
          ))}
        </span>
      ),
    },
  ];
  return rows.filter((row): row is Spec => !!row);
}

/** One case file: artwork, title, facts, what was built, and the way on. */
export default function CaseStudy({
  project,
  previous,
  next,
}: {
  project: Project;
  previous: Project;
  next: Project;
}) {
  const number = caseNumber(project);
  return (
    <article>
      <header className="relative border-b border-rule">
        <div className="relative h-[42svh] min-h-[280px] md:h-[56svh]">
          <AsciiArt field={project.art} fontSize={11} className="absolute inset-0 size-full" />
        </div>
        <div className="px-read pb-10 md:-mt-24">
          <p className="type-label text-text-muted">
            <span className="text-accent">{number}</span> /{" "}
            {String(projects.length).padStart(2, "0")} · {project.kind}
          </p>
          <h1 data-scramble className="type-display relative mt-3 text-title text-text">
            {project.title}
          </h1>
        </div>
      </header>

      <div className="grid gap-12 px-read py-16 md:grid-cols-12 md:gap-6">
        <section data-reveal className="md:col-span-6">
          <h2 className="type-label text-text-muted">{caseLabels.overview}</h2>
          <p className="mt-4 text-lead text-text-soft">{project.description}</p>
        </section>
        <div data-reveal className="md:col-span-5 md:col-start-8">
          <SpecTable rows={facts(project)} />
        </div>
      </div>

      <section
        data-reveal
        className="grid gap-6 border-t border-rule px-read py-16 md:grid-cols-12"
      >
        <h2 className="type-label text-text-muted md:col-span-3">{caseLabels.built}</h2>
        <ol className="md:col-span-8 md:col-start-5">
          {project.built.map((item, index) => (
            <li key={item} className="flex gap-6 border-b border-rule py-5 first:pt-0">
              <span className="type-display shrink-0 text-[20px] text-accent">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-text-soft">{item}</span>
            </li>
          ))}
        </ol>
      </section>

      {project.problem && (
        <section
          data-reveal
          className="grid gap-6 border-t border-rule px-read py-16 md:grid-cols-12"
        >
          <h2 className="type-label text-text-muted md:col-span-3">{caseLabels.problem}</h2>
          <p className="text-lead text-text-soft md:col-span-8 md:col-start-5">{project.problem}</p>
        </section>
      )}
      {project.outcome && (
        <section
          data-reveal
          className="grid gap-6 border-t border-rule px-read py-16 md:grid-cols-12"
        >
          <h2 className="type-label text-text-muted md:col-span-3">{caseLabels.outcome}</h2>
          <p className="text-lead text-text-soft md:col-span-8 md:col-start-5">{project.outcome}</p>
        </section>
      )}
      {project.media.length > 0 && (
        <section data-reveal className="border-t border-rule px-read py-16">
          <h2 className="type-label text-text-muted">{caseLabels.media}</h2>
          <div className="mt-8 grid gap-10">
            {project.media.map((media, index) => (
              <figure key={media.src}>
                <div className="border border-rule">
                  {media.type === "image" ? (
                    <Image
                      src={media.src}
                      alt={media.alt}
                      width={media.width}
                      height={media.height}
                      sizes="(min-width: 768px) 90vw, 100vw"
                      className="h-auto w-full"
                    />
                  ) : (
                    <video
                      src={media.src}
                      poster={media.poster}
                      width={media.width}
                      height={media.height}
                      controls
                      preload="none"
                      aria-label={media.alt}
                      className="h-auto w-full"
                    />
                  )}
                </div>
                {media.caption && (
                  <figcaption className="type-label mt-3 text-text-muted">
                    fig. {String(index + 1).padStart(2, "0")} · {media.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </section>
      )}

      <nav
        aria-label={caseLabels.caseFiles}
        className="grid border-t border-rule md:grid-cols-[1fr_auto_1fr]"
      >
        <Link
          href={`/work/${previous.slug}`}
          transitionTypes={["open"]}
          className="group px-read py-10 transition-colors hover:bg-surface"
        >
          <span className="type-label text-text-muted">← {caseLabels.previous}</span>
          <span className="type-display mt-2 block text-[28px] text-text group-hover:text-accent">
            {previous.title}
          </span>
        </Link>
        <Link
          href="/work"
          transitionTypes={["close"]}
          className="type-label flex items-center justify-center border-y border-rule px-10 py-6 text-text-soft transition-colors hover:text-accent md:border-x md:border-y-0"
        >
          {caseLabels.allProjects} ↗
        </Link>
        <Link
          href={`/work/${next.slug}`}
          transitionTypes={["open"]}
          className="group px-read py-10 text-right transition-colors hover:bg-surface"
        >
          <span className="type-label text-text-muted">
            {caseLabels.upNext} / {caseNumber(next)} →
          </span>
          <span className="type-display mt-2 block text-[28px] text-text group-hover:text-accent">
            {next.title}
          </span>
          <span className="mt-1 block text-ui text-text-muted">{next.kind}</span>
        </Link>
      </nav>
    </article>
  );
}
