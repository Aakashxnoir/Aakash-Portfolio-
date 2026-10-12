import Link from "next/link";
import Container from "../Container";
import Reveal from "../motion/Reveal";
import WorkStory from "./WorkStory";
import { caseNumber, projects } from "@/content/projects";
import { labels, workSection } from "@/content/site";

/**
 * Home work section, in two layouts from the same content. With motion: a pinned,
 * horizontally scrolling track of panels. Without motion (reduced motion, no JS):
 * a vertical list of rows. CSS shows one and removes the other (`fx:` variant), so
 * only one is ever in the accessibility tree.
 */
export default function WorkIndex() {
  return (
    <WorkStory
      labelledBy="work-heading"
      className="mt-section fx:flex fx:h-svh fx:flex-col fx:justify-center fx:overflow-clip fx:pt-nav"
    >
      <Container>
        <div className="flex items-end justify-between gap-8 pb-10">
          <Reveal as="h2" split id="work-heading" className="type-display text-section font-bold text-text">
            {workSection.heading}
          </Reveal>
          <Link href="/work" className="link mb-2">
            {labels.viewAllWork}
          </Link>
        </div>
      </Container>

      {/* Vertical list: reduced motion and no JS. */}
      <Container className="fx:hidden">
        <ol className="border-b border-rule">
          {projects.map((project) => (
            <li key={project.slug} className="border-t border-rule">
              <Link
                href={`/work/${project.slug}`}
                className="group grid grid-cols-12 items-baseline gap-x-8 py-7"
              >
                <span className="type-label col-span-1 text-text-muted">{caseNumber(project)}</span>
                <span className="type-display col-span-6 text-section font-bold text-text transition-colors duration-300 group-hover:text-accent">
                  {project.title}
                </span>
                <span className="type-label col-span-4 text-text-muted">
                  {project.kind}, {project.year}
                </span>
                <span
                  aria-hidden="true"
                  className="col-span-1 justify-self-end text-lead text-text-muted transition-colors duration-300 group-hover:text-accent"
                >
                  →
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </Container>

      {/* Horizontal track: motion on. */}
      <div className="hidden fx:block">
        <ol data-work-track="" className="flex h-[min(62svh,600px)] w-max px-page">
          {projects.map((project) => (
            <li
              key={project.slug}
              data-work-panel=""
              className="relative w-[min(60vw,860px)] shrink-0 border-l border-rule last:border-r"
            >
              {/* The big case number is drawn by CSS (decorative, not text). */}
              <Link
                href={`/work/${project.slug}`}
                data-index={caseNumber(project)}
                className="group flex h-full flex-col justify-between px-12 py-2 before:type-display before:pointer-events-none before:absolute before:left-12 before:top-0 before:text-section before:leading-none before:font-extrabold before:text-text-faint/50 before:content-[attr(data-index)]"
              >
                <span className="type-label relative self-end pt-2 text-text-muted">
                  {labels.case} {caseNumber(project)}, {project.year}
                </span>
                <span className="relative">
                  <span className="type-display block text-row font-bold text-text transition-colors duration-300 group-hover:text-accent">
                    {project.title}
                  </span>
                  <span className="type-label mt-5 block text-text-muted">{project.kind}</span>
                  {project.award && (
                    <span className="type-label mt-2 block text-accent">{project.award}</span>
                  )}
                </span>
                <span className="relative line-clamp-4 max-w-[520px] text-body text-text-soft">
                  {project.description}
                </span>
                <span className="relative flex items-baseline justify-between gap-8">
                  <span className="text-[0.9375rem] text-text-muted">{project.stack.slice(0, 5).join(" / ")}</span>
                  <span className="link-primary shrink-0">{labels.readCase}</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
        <Container className="mt-12">
          <div className="h-px bg-rule">
            <div
              data-work-progress=""
              className="h-px origin-left bg-accent"
              style={{ transform: "scaleX(0)" }}
            />
          </div>
        </Container>
      </div>
    </WorkStory>
  );
}
