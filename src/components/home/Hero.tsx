import Link from "next/link";
import Container from "../Container";
import SocialLinks from "../SocialLinks";
import Status from "../Status";
import Magnetic from "../motion/Magnetic";
import { enterDelay } from "../motion/enter";
import HeroScene from "../three/HeroScene";
import { hero, labels, site } from "@/content/site";

/**
 * First screen: label and intro column at the top, the name anchored to the
 * bottom across the width, the 3D object behind it. The name rises line by line
 * on first paint; the scene fades in once it has rendered.
 */
export default function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="relative">
      <HeroScene />
      <Container className="relative flex min-h-svh flex-col justify-between pb-12 pt-[calc(var(--nav-height)+2.5rem)]">
        <div className="grid grid-cols-12 gap-x-8">
          <p className="enter-fade type-label col-span-6 text-text-muted" style={enterDelay(500)}>
            {hero.label}
          </p>
          <div className="col-span-4 col-start-9">
            <p className="enter-fade text-lead text-text-soft" style={enterDelay(600)}>
              {hero.line}
            </p>
            <Status className="enter-fade mt-8" style={enterDelay(700)} />
            <div
              className="enter-fade mt-10 flex flex-wrap items-baseline gap-x-8 gap-y-4"
              style={enterDelay(800)}
            >
              <Magnetic>
                <Link href="/work" className="link-primary">
                  {labels.viewWork}
                </Link>
              </Magnetic>
              <Magnetic>
                <a href={site.resume} download className="link">
                  {labels.downloadResume}
                </a>
              </Magnetic>
            </div>
            <SocialLinks className="enter-fade mt-5" style={enterDelay(900)} />
          </div>
        </div>

        <h1
          id="hero-heading"
          className="type-display mt-20 text-hero font-extrabold text-text"
        >
          <span className="mask">
            <span className="enter-line block" style={enterDelay(100)}>
              {hero.name.first}
            </span>
          </span>{" "}
          <span className="mask">
            <span className="enter-line block" style={enterDelay(190)}>
              {hero.name.last}
            </span>
          </span>
        </h1>
      </Container>
    </section>
  );
}
