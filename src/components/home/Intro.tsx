import Container from "../Container";
import Words from "../Words";
import IntroStory from "./IntroStory";
import { about, education } from "@/content/about";
import { labels } from "@/content/site";

/** The About statement, lit word by word on scroll, with the education line under it. */
export default function Intro() {
  return (
    <IntroStory labelledBy="intro-heading" className="mt-section">
      <Container className="grid grid-cols-12 gap-x-8">
        <h2 id="intro-heading" className="type-label col-span-3 pt-4 text-text-muted">
          {about.label}
        </h2>
        <div className="col-span-9">
          <p className="text-statement font-light text-text">
            <Words text={about.statement} />
          </p>
          <dl className="mt-16 grid grid-cols-9 gap-x-8 border-t border-rule pt-6">
            <dt className="type-label col-span-2 pt-1 text-text-muted">{labels.education}</dt>
            <dd className="col-span-7 text-body text-text-soft">
              {education.degree}, {education.school}, {education.place}. {education.years}
            </dd>
          </dl>
        </div>
      </Container>
    </IntroStory>
  );
}
