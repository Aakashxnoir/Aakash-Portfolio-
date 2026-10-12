import Link from "next/link";
import Reveal from "./motion/Reveal";
import { caseNumber, type Project } from "@/content/projects";
import { labels } from "@/content/site";

/** /work: one case file. Title and kind on the left, description and stack on the right. */
export default function WorkRow({ project }: { project: Project }) {
  const href = `/work/${project.slug}`;

  return (
    <Reveal as="article" className="grid grid-cols-12 gap-x-8 border-t border-rule py-14">
      <div className="col-span-7">
        <p className="type-label text-text-muted">
          {labels.case} {caseNumber(project)}
        </p>
        <h2 className="type-display mt-5 text-row font-bold text-text transition-colors duration-300 hover:text-accent">
          <Link href={href}>{project.title}</Link>
        </h2>
        <p className="type-label mt-6 text-text-muted">
          {project.kind}, {project.year}
        </p>
        {project.award && (
          <p className="type-label mt-3 text-accent">{project.award}</p>
        )}
      </div>
      <div className="col-span-5 pt-10">
        <p className="text-body text-text-soft">{project.description}</p>
        <p className="mt-6 text-[0.9375rem] leading-relaxed text-text-muted">
          <span className="type-label mr-3">{labels.stack}</span>
          {project.stack.join(", ")}
        </p>
        <Link
          href={href}
          aria-label={`${labels.readCase}: ${project.title}`}
          className="link-primary mt-8 inline-block"
        >
          {labels.readCase}
        </Link>
      </div>
    </Reveal>
  );
}
