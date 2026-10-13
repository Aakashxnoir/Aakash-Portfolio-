import Link from "next/link";
import { also, caseNumber, projects, workLabels } from "@/content/projects";

/** Every case file as a row: the no-JS, phone and "List" view of projects.vol. */
export default function WorkList() {
  return (
    <div className="px-read pt-10 pb-24">
      <div
        aria-hidden
        className="type-label hidden grid-cols-12 gap-6 pb-3 text-text-muted md:grid"
      >
        <span className="col-span-1">{workLabels.index}</span>
        <span className="col-span-5">{workLabels.name}</span>
        <span className="col-span-3">{workLabels.kind}</span>
        <span className="col-span-1">{workLabels.year}</span>
        <span className="col-span-2">{workLabels.stack}</span>
      </div>
      <ol className="border-b border-rule">
        {projects.map((project) => (
          <li key={project.slug}>
            <Link
              href={`/work/${project.slug}`}
              transitionTypes={["open"]}
              className="group grid grid-cols-[auto_1fr] gap-x-5 gap-y-1 border-t border-rule py-6 md:grid-cols-12 md:items-baseline md:gap-6"
            >
              <span className="type-display text-[22px] text-accent md:col-span-1">
                {caseNumber(project)}
              </span>
              <span className="type-display text-[34px] leading-none text-text transition-colors group-hover:text-accent md:col-span-5 md:text-[52px]">
                {project.title}
              </span>
              <span className="col-start-2 text-text-soft md:col-span-3 md:col-start-auto">
                {project.kind}
                {project.award && <span className="block text-accent">{project.award}</span>}
              </span>
              <span className="col-start-2 text-text-muted md:col-span-1 md:col-start-auto">
                {project.year}
              </span>
              <span className="col-start-2 text-ui text-text-muted md:col-span-2 md:col-start-auto">
                {project.stack.slice(0, 3).join(" · ")}
              </span>
            </Link>
          </li>
        ))}
      </ol>
      <p className="mt-10 max-w-[90ch] text-text-soft">
        <span className="type-label mr-3 text-text-muted">{also.label}</span>
        {also.items.map((item, index) => (
          <span key={item.name}>
            {item.href ? (
              <a href={item.href} target="_blank" rel="noreferrer" className="link">
                {item.name}
              </a>
            ) : (
              <span className="text-text">{item.name}</span>
            )}
            {item.rest}
            {index < also.items.length - 1 ? "; " : "."}
          </span>
        ))}
      </p>
    </div>
  );
}
