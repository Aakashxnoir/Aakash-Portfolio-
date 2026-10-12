import type { Metadata } from "next";
import Container from "@/components/Container";
import EnterTitle from "@/components/EnterTitle";
import Magnetic from "@/components/motion/Magnetic";
import { enterDelay } from "@/components/motion/enter";
import PageHeader from "@/components/PageHeader";
import Rich from "@/components/Rich";
import SocialLinks from "@/components/SocialLinks";
import Status from "@/components/Status";
import { contact, richToString, site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description: richToString(contact.heading),
};

export default function ContactPage() {
  return (
    <Container>
      <PageHeader label={contact.label}>
        <EnterTitle className="type-display mt-8 max-w-[1100px] text-balance text-contact font-bold text-text">
          <Rich text={contact.heading} />
        </EnterTitle>
        <div
          className="enter-fade mt-16 flex flex-wrap items-baseline gap-x-12 gap-y-4"
          style={enterDelay(350)}
        >
          <Magnetic>
            <a href={`mailto:${site.email}`} className="link-primary text-statement font-light">
              {site.email}
            </a>
          </Magnetic>
          <Status />
        </div>
        <SocialLinks resume className="enter-fade mt-12" style={enterDelay(450)} />
      </PageHeader>
    </Container>
  );
}
