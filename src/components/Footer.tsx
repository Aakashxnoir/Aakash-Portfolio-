import Container from "./Container";
import SocialLinks from "./SocialLinks";
import { footer } from "@/content/site";

export default function Footer() {
  return (
    <footer className="mt-section">
      <Container>
        <div className="flex items-baseline justify-between gap-8 border-t border-rule py-10">
          <p className="type-label text-text-muted">{footer.copyright}</p>
          <SocialLinks email resume className="text-[0.9375rem]" />
        </div>
      </Container>
    </footer>
  );
}
