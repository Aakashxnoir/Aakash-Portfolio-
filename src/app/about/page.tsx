import type { Metadata } from "next";
import Image from "next/image";
import Section, { FactRows } from "@/components/Section";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import RecognitionList from "@/components/RecognitionList";
import Rich from "@/components/Rich";
import { enterDelay } from "@/components/motion/enter";
import { about, education, outside, recognition, stack } from "@/content/about";
import { richToString } from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  description: richToString(about.statement),
};

export default function AboutPage() {
  return (
    <Container>
      <PageHeader label={about.label}>
        <div className="mt-10 grid grid-cols-12 gap-x-8">
          <div className="col-span-7">
            <h1 className="enter-fade text-statement font-light text-text" style={enterDelay(100)}>
              <Rich text={about.statement} />
            </h1>
            <p
              className="enter-fade mt-10 max-w-[560px] text-body text-text-soft"
              style={enterDelay(250)}
            >
              {about.body}
            </p>
          </div>
          {/* The frame is the mask: the photo rises into it and settles from a slight zoom. */}
          <div className="relative col-span-4 col-start-9 aspect-[4/5] overflow-hidden border border-rule bg-surface">
            <div className="enter-line absolute inset-0" style={enterDelay(250)}>
              <div className="enter-zoom absolute inset-0" style={enterDelay(250)}>
                <Image
                  src={about.portrait.src}
                  alt={about.portrait.alt}
                  fill
                  priority
                  sizes="(min-width: 1440px) 420px, 30vw"
                  className="noir-portrait object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </PageHeader>

      <Section id="education-heading" heading={education.heading}>
        <FactRows
          rows={[
            { label: education.degree, value: `${education.school}, ${education.place}` },
            { label: education.yearsLabel, value: education.years },
          ]}
        />
      </Section>

      <Section id="recognition-heading" heading={recognition.heading}>
        <RecognitionList />
      </Section>

      <Section id="stack-heading" heading={stack.heading}>
        <FactRows
          rows={stack.groups.map((group) => ({
            label: group.label,
            value: group.items.join(", "),
          }))}
        />
      </Section>

      <Section id="outside-heading" heading={outside.heading}>
        <FactRows rows={outside.items} />
      </Section>
    </Container>
  );
}
