import type { CSSProperties } from "react";
import { labels, site } from "@/content/site";

/** GitHub and LinkedIn (new tab), optionally the email and the résumé. */
export default function SocialLinks({
  email = false,
  resume = false,
  className = "",
  style,
}: {
  email?: boolean;
  resume?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <ul className={`flex flex-wrap items-baseline gap-x-8 gap-y-3 ${className}`} style={style}>
      {email && (
        <li>
          <a href={`mailto:${site.email}`} className="link">
            {labels.email}
          </a>
        </li>
      )}
      <li>
        <a href={site.github} target="_blank" rel="noopener noreferrer" className="link">
          {labels.github}
        </a>
      </li>
      <li>
        <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className="link">
          {labels.linkedin}
        </a>
      </li>
      {resume && (
        <li>
          <a href={site.resume} download className="link">
            {labels.resumePdf}
          </a>
        </li>
      )}
    </ul>
  );
}
