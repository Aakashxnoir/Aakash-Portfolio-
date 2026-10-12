import type { Metadata } from "next";
import Container from "@/components/Container";
import EnterTitle from "@/components/EnterTitle";
import Reveal from "@/components/motion/Reveal";
import PageHeader from "@/components/PageHeader";
import WorkRow from "@/components/WorkRow";
import { also, projects } from "@/content/projects";
import { workSection } from "@/content/site";

export const metadata: Metadata = {
  title: "Work",
  description: `Case files: ${projects.map((project) => project.title).join(", ")}.`,
};

export default function WorkPage() {
  return (
    <section aria-labelledby="work-title">
      <Container>
        <PageHeader label={workSection.label}>
          <EnterTitle id="work-title" className="type-display mt-8 text-title font-bold text-text">
            {workSection.heading}
          </EnterTitle>
        </PageHeader>

        <div className="mt-24">
          {projects.map((project) => (
            <WorkRow key={project.slug} project={project} />
          ))}
        </div>

        <Reveal className="grid grid-cols-12 gap-x-8 border-t border-rule pt-10">
          <p className="type-label col-span-7 text-text-muted">{also.label}</p>
          <p className="col-span-5 text-[0.9375rem] leading-relaxed text-text-muted">
            {also.items.map((item, i) => (
              <span key={item.name}>
                <span className="text-text-soft">{item.name}</span>
                {item.rest}
                {i < also.items.length - 1 ? ". " : "."}
              </span>
            ))}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
