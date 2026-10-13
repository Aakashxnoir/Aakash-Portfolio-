import type { Metadata } from "next";
import SpecTable from "@/components/case/SpecTable";
import Image from "next/image";
import LitText from "@/components/motion/LitText";
import Neofetch from "@/components/profile/Neofetch";
import PathBar from "@/components/shell/PathBar";
import Window from "@/components/shell/Window";
import { education, profile, recognition, roles, rolesLabel, stack } from "@/content/profile";
import { getApp, richToString } from "@/content/site";

const app = getApp("about");

export const metadata: Metadata = {
  title: profile.title,
  description: richToString(profile.statement),
};

export default function ProfilePage() {
  return (
    <Window>
      <div className="pt-path">
        <PathBar trail={[{ label: app.file }]} />

        <section className="grid gap-10 px-read pt-14 pb-20 md:grid-cols-12 md:gap-6">
          <div className="md:col-span-5">
            <div className="relative aspect-square overflow-hidden border border-rule bg-surface">
              <Image
                src={profile.portrait.src}
                alt={profile.portrait.alt}
                fill
                priority
                sizes="(min-width: 768px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
          <div className="md:col-span-6 md:col-start-7 md:pt-4">
            <p className="type-label text-text-muted">
              <span className="text-accent">{app.number}</span> · {app.file}
            </p>
            <h1 data-scramble className="type-display mt-3 text-title text-text">
              {profile.title}
            </h1>
            <p data-lit className="mt-10 text-statement text-text">
              <LitText text={profile.statement} />
            </p>
            <p className="mt-8 max-w-[58ch] text-lead text-text-soft">{profile.body}</p>
          </div>
        </section>

        <section aria-label={rolesLabel} className="border-t border-rule">
          {roles.map((role, index) => (
            <article
              key={role.title}
              data-reveal
              className="grid gap-6 border-b border-rule px-read py-16 md:grid-cols-12"
            >
              <p className="type-label text-accent md:col-span-1">
                {String(index + 1).padStart(2, "0")}
              </p>
              <div className="md:col-span-10">
                <h2 data-scramble className="type-display text-heading text-text">
                  {role.title}
                </h2>
                <p className="mt-6 max-w-[62ch] text-lead text-text-soft">{role.body}</p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {role.tags.map((tag) => (
                    <li key={tag} className="tag">
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </section>

        <section className="grid gap-16 px-read py-20 md:grid-cols-12 md:gap-6">
          <div data-reveal className="md:col-span-5">
            <h2 className="type-label text-text-muted">{education.heading}</h2>
            <p className="type-display mt-4 text-[32px] leading-none text-text">
              {education.degree}
            </p>
            <SpecTable
              className="mt-6"
              rows={[
                { label: education.labels.school, value: education.school },
                { label: education.labels.place, value: education.place },
                { label: education.labels.years, value: education.years },
              ]}
            />
          </div>
          <div data-reveal className="md:col-span-6 md:col-start-7">
            <h2 className="type-label text-text-muted">{recognition.heading}</h2>
            <ul className="mt-4">
              {recognition.items.map((item) => (
                <li
                  key={item.detail}
                  className="grid grid-cols-[9rem_1fr] gap-4 border-b border-rule py-4"
                >
                  <span className="text-accent">{item.title}</span>
                  <span className="text-text-soft">{item.detail}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section data-reveal className="px-read pb-24">
          <h2 className="type-label mb-4 text-text-muted">{stack.heading}</h2>
          <Neofetch />
        </section>
      </div>
    </Window>
  );
}
