import Link from "next/link";
import type { ReactNode } from "react";
import CaseMedia from "./CaseMedia";
import Container from "./Container";
import EnterTitle from "./EnterTitle";
import PageHeader from "./PageHeader";
import Magnetic from "./motion/Magnetic";
import Reveal from "./motion/Reveal";
import { enterDelay } from "./motion/enter";
import { caseNumber, type Project } from "@/content/projects";
import { caseLabels, labels } from "@/content/site";

/** One fact in the facts row; renders nothing without a value. */
function Fact({ label, span, children }: { label: string; span: string; children: ReactNode }) {
  return (
    <div className={span}>
      <dt className="type-label text-text-muted">{label}</dt>
      <dd className="mt-3 text-body text-text-soft">{children}</dd>
    </div>
  );
}

/** A labelled text section on the 12-column grid: label left, text from column 5. */
function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Reveal as="section" className="grid grid-cols-12 gap-x-8 border-t border-rule pt-8">
      <h2 className="type-label col-span-4 pt-1 text-text-muted">{title}</h2>
      <div className="col-span-7 col-start-5">{children}</div>
    </Reveal>
  );
}

/** /work/[slug]. Only fields that exist on the project are shown. */
export default function CaseStudy({ project, next }: { project: Project; next: Project }) {
  return (
    <article aria-labelledby="case-title">
      <Container>
        <PageHeader label={`${labels.case} ${caseNumber(project)} / ${project.kind}`}>
          <EnterTitle id="case-title" className="type-display mt-8 text-title font-bold text-text">
            {project.title}
          </EnterTitle>
          {project.award && (
            <p className="enter-fade type-label mt-6 text-accent" style={enterDelay(250)}>
              {project.award}
            </p>
          )}
        </PageHeader>

        <dl
          className="enter-fade mt-20 grid grid-cols-12 gap-x-8 border-t border-rule pt-6"
          style={enterDelay(300)}
        >
          <Fact label={caseLabels.year} span="col-span-2">
            {project.year}
          </Fact>
          {project.role && (
            <Fact label={caseLabels.role} span="col-span-2">
              {project.role}
            </Fact>
          )}
          {project.team && (
            <Fact label={caseLabels.team} span="col-span-2">
              {project.team}
            </Fact>
          )}
          <Fact label={caseLabels.stack} span="col-span-4">
            {project.stack.join(", ")}
          </Fact>
          {project.links.length > 0 && (
            <Fact label={caseLabels.links} span="col-span-2">
              <ul className="space-y-2">
                {project.links.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} target="_blank" rel="noopener noreferrer" className="link">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </Fact>
          )}
        </dl>

        <div className="mt-28 space-y-20">
          <Section title={caseLabels.overview}>
            <p className="text-lead text-text">{project.description}</p>
          </Section>
          {project.media.length > 0 && (
            <Section title={caseLabels.media}>
              <CaseMedia media={project.media} />
            </Section>
          )}
          {project.problem && (
            <Section title={caseLabels.problem}>
              <p className="text-body text-text-soft">{project.problem}</p>
            </Section>
          )}
          <Section title={caseLabels.built}>
            <ul className="space-y-5">
              {project.built.map((item) => (
                <li key={item} className="flex gap-5 text-body text-text-soft">
                  <span aria-hidden="true" className="mt-[0.7em] h-px w-4 shrink-0 bg-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </Section>
          {project.outcome && (
            <Section title={caseLabels.outcome}>
              <p className="text-body text-text-soft">{project.outcome}</p>
            </Section>
          )}
        </div>

        <Reveal
          as="nav"
          aria-label={caseLabels.caseNav}
          className="mt-section flex items-end justify-between gap-8 border-t border-rule pt-10"
        >
          <Link href="/work" className="link">
            {labels.backToWork}
          </Link>
          <Magnetic>
            <Link href={`/work/${next.slug}`} className="group block text-right">
              <span className="type-label block text-text-muted">{labels.nextCase}</span>
              <span className="type-display mt-3 block text-section font-bold text-text transition-colors duration-300 group-hover:text-accent">
                {next.title}
              </span>
            </Link>
          </Magnetic>
        </Reveal>
      </Container>
    </article>
  );
}
