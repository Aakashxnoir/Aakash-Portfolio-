import type { Metadata } from "next";
import Rich from "@/components/Rich";
import ContactApp from "@/components/contact/ContactApp";
import PathBar from "@/components/shell/PathBar";
import Window from "@/components/shell/Window";
import { contact, getApp, labels, richToString, site } from "@/content/site";

const app = getApp("contact");

export const metadata: Metadata = {
  title: contact.label,
  description: `${richToString(contact.heading)} ${site.email}`,
};

export default function ContactPage() {
  const elsewhere = [
    { label: labels.linkedin, href: site.linkedin, external: true },
    { label: labels.github, href: site.github, external: true },
    { label: labels.resumePdf, href: site.resume, download: true },
  ];
  return (
    <Window>
      <div className="pt-path">
        <PathBar trail={[{ label: app.file }]} />
        <div className="grid gap-12 px-read pt-14 pb-24 md:grid-cols-12 md:gap-6">
          <div className="md:col-span-5">
            <p className="type-label text-text-muted">
              <span className="text-accent">{app.number}</span> · {app.file}
            </p>
            <h1 className="type-display mt-4 text-[clamp(2.25rem,4vw,3.75rem)] leading-[0.95] text-text">
              <Rich text={contact.heading} />
            </h1>
            <p className="type-label mt-12 text-text-muted">{contact.elsewhere}</p>
            <ul className="mt-3 border-t border-rule">
              {elsewhere.map((link) => (
                <li key={link.href} className="border-b border-rule">
                  <a
                    href={link.href}
                    {...(link.external ? { target: "_blank", rel: "noreferrer" } : {})}
                    {...(link.download ? { download: true } : {})}
                    className="flex items-center justify-between py-3 text-text transition-colors hover:text-accent"
                  >
                    {link.label}
                    <span aria-hidden className="text-text-muted">
                      {link.download ? "↓" : "↗"}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div data-reveal className="md:col-span-7 md:col-start-6 lg:col-span-6 lg:col-start-7">
            <ContactApp />
          </div>
        </div>
      </div>
    </Window>
  );
}
