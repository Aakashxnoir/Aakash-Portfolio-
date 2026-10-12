import Container from "../Container";
import Rich from "../Rich";
import Status from "../Status";
import Magnetic from "../motion/Magnetic";
import Reveal from "../motion/Reveal";
import { contact, site } from "@/content/site";

/** Home closing call: the contact heading, the email and the status. */
export default function ContactCall() {
  return (
    <section aria-labelledby="contact-call-heading" className="mt-section">
      <Container>
        <div className="border-t border-rule pt-10">
          <p className="type-label text-text-muted">{contact.label}</p>
          <Reveal
            as="h2"
            split
            id="contact-call-heading"
            className="type-display mt-10 max-w-[1100px] text-balance text-contact font-bold text-text"
          >
            <Rich text={contact.heading} />
          </Reveal>
          <Reveal delay={0.2} className="mt-14 flex flex-wrap items-baseline gap-x-12 gap-y-4">
            <Magnetic>
              <a href={`mailto:${site.email}`} className="link-primary text-lead">
                {site.email}
              </a>
            </Magnetic>
            <Status />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
