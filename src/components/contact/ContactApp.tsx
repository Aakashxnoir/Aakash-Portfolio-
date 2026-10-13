"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { contact, labels, site } from "@/content/site";

/**
 * contact.app: a mail window. Send opens the visitor's own mail app with the
 * subject and message filled in. Without JS the form still works: it is a GET
 * form to `mailto:`, which browsers turn into the same link.
 */
export default function ContactApp() {
  const [copied, setCopied] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const from = String(form.get("from") ?? "").trim();
    const message = String(form.get("body") ?? "").trim();
    const subject = String(form.get("subject") ?? "");
    const body = [message, from && `\n${contact.from}: ${from}`].filter(Boolean).join("\n");
    const query = new URLSearchParams({ subject, body }).toString().replace(/\+/g, "%20");
    window.location.href = `mailto:${site.email}?${query}`;
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      window.location.href = `mailto:${site.email}`;
    }
  };

  const row = "grid grid-cols-[5.5rem_1fr] border-b border-text-muted";
  const cell = "type-label border-r border-text-muted px-4 py-4 text-text-muted";

  return (
    <section
      aria-labelledby="contact-window"
      className="border border-text-muted bg-surface shadow-[4px_4px_0_0_var(--rule)]"
    >
      <div className="flex items-center border-b border-text-muted">
        <Link
          href="/"
          transitionTypes={["close"]}
          aria-label={labels.home}
          className="flex size-11 items-center justify-center border-r border-text-muted text-text-muted transition-colors hover:bg-accent hover:text-bg"
        >
          ×
        </Link>
        <h2 id="contact-window" className="flex-1 text-center text-ui text-text">
          {contact.window}
        </h2>
        <span className="size-11" aria-hidden />
      </div>

      <form action={`mailto:${site.email}`} method="get" onSubmit={onSubmit}>
        <div className={row}>
          <span className={cell}>{contact.to}</span>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3">
            <a href={`mailto:${site.email}`} className="text-text hover:text-accent">
              {site.email}
            </a>
            <button
              type="button"
              onClick={copy}
              className="js-only type-label border border-rule px-2 py-0.5 text-text-muted transition-colors hover:border-text hover:text-text"
            >
              {copied ? labels.copied : labels.copyEmail}
            </button>
            <span className="type-label w-full text-accent">{contact.availability}</span>
          </div>
        </div>

        <label className={`${row} js-only`}>
          <span className={cell}>{contact.from}</span>
          <input
            name="from"
            type="email"
            autoComplete="email"
            placeholder={contact.fromPlaceholder}
            className="bg-transparent px-4 py-3 text-text placeholder:text-text-muted focus:outline-none focus-visible:bg-bg"
          />
        </label>

        <fieldset className={row}>
          <legend className="sr-only">{contact.subject}</legend>
          <span aria-hidden className={cell}>
            {contact.subject}
          </span>
          <div className="flex flex-wrap gap-2 px-4 py-3">
            {contact.subjects.map((subject, index) => (
              <label key={subject} className="relative">
                <input
                  type="radio"
                  name="subject"
                  value={subject}
                  defaultChecked={index === 0}
                  className="peer absolute inset-0 opacity-0"
                />
                <span className="block border border-rule px-3 py-1 text-ui text-text-soft transition-colors peer-checked:border-accent peer-checked:bg-accent peer-checked:text-bg peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent hover:border-text">
                  {subject}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <label className="block">
          <span className="sr-only">{contact.message}</span>
          <textarea
            name="body"
            rows={8}
            placeholder={contact.messagePlaceholder}
            className="block w-full resize-none bg-transparent px-5 py-4 text-text placeholder:text-text-muted focus:outline-none focus-visible:bg-bg"
          />
        </label>

        <div className="flex flex-wrap items-center gap-4 border-t border-text-muted">
          <button
            type="submit"
            className="type-label bg-accent px-6 py-4 text-bg transition-colors hover:bg-text"
          >
            {contact.send} ↵
          </button>
          <span className="text-ui text-text-muted">{contact.sendNote}</span>
        </div>
      </form>
    </section>
  );
}
