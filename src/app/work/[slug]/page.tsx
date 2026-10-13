import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CaseStudy from "@/components/case/CaseStudy";
import PathBar from "@/components/shell/PathBar";
import Window from "@/components/shell/Window";
import { getNextProject, getPreviousProject, getProject, projects } from "@/content/projects";
import { getApp, labels } from "@/content/site";

// Only the case files in projects.ts exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return {};
  return { title: project.title, description: project.description };
}

export default async function CasePage({ params }: PageProps<"/work/[slug]">) {
  const project = getProject((await params).slug);
  if (!project) notFound();
  const app = getApp("work");
  return (
    <Window>
      <div className="pt-path">
        <PathBar
          trail={[{ label: app.file, href: app.href }, { label: project.slug }]}
          up={app.href}
          esc={labels.escClose}
        />
        <CaseStudy
          project={project}
          previous={getPreviousProject(project)}
          next={getNextProject(project)}
        />
      </div>
    </Window>
  );
}
