import Image from "next/image";
import type { ProjectMedia } from "@/content/projects";

/**
 * Screenshots and clips for a case study, full width of the text column, hairline
 * frame, true colour. Videos never autoplay; they load metadata only until played.
 */
export default function CaseMedia({ media }: { media: ProjectMedia[] }) {
  return (
    <div className="space-y-12">
      {media.map((item) => (
        <figure key={item.src}>
          <div className="border border-rule bg-surface">
            {item.type === "image" ? (
              <Image
                src={item.src}
                alt={item.alt}
                width={item.width}
                height={item.height}
                sizes="(min-width: 1440px) 760px, 55vw"
                className="h-auto w-full"
              />
            ) : (
              <video
                src={item.src}
                poster={item.poster}
                width={item.width}
                height={item.height}
                controls
                playsInline
                preload="metadata"
                aria-label={item.alt}
                className="h-auto w-full"
              />
            )}
          </div>
          {item.caption && (
            <figcaption className="type-label mt-4 text-text-muted">{item.caption}</figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}
