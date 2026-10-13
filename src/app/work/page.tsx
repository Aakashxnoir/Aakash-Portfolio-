import type { Metadata } from "next";
import PathBar from "@/components/shell/PathBar";
import Window from "@/components/shell/Window";
import WorkList from "@/components/work/WorkList";
import WorkView from "@/components/work/WorkView";
import { caseNumber, projects, workLabels } from "@/content/projects";
import { getApp } from "@/content/site";

const app = getApp("work");

export const metadata: Metadata = {
  title: workLabels.title,
  description: projects.map((p) => `${p.title}: ${p.kind}`).join(". "),
};

export default function WorkPage() {
  const tiles = projects.map((p) => ({
    slug: p.slug,
    title: p.title,
    kind: p.kind,
    year: p.year,
    number: caseNumber(p),
    art: p.art,
  }));
  return (
    <Window>
      <div className="pt-path">
        <PathBar trail={[{ label: app.file }]} />
        <h1 className="sr-only">{workLabels.title}</h1>
        <WorkView tiles={tiles} list={<WorkList />} />
      </div>
    </Window>
  );
}
