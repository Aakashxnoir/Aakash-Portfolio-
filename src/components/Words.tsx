import type { RichText } from "@/content/site";

/** One span per word (for scroll-lit text). Accent segments stay inside an `em`. */
function split(text: string) {
  return text.split(/(\s+)/).map((part, i) =>
    part.trim() ? (
      <span key={i} data-word="">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

export default function Words({ text }: { text: RichText }) {
  return (
    <>
      {text.map((part, i) =>
        typeof part === "string" ? (
          <span key={i}>{split(part)}</span>
        ) : (
          <em key={i} className="italic text-accent">
            {split(part.em)}
          </em>
        ),
      )}
    </>
  );
}
