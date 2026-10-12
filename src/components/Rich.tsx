import type { RichText } from "@/content/site";

/** Renders copy where `{ em }` segments are the italic accent words. */
export default function Rich({ text }: { text: RichText }) {
  return (
    <>
      {text.map((part, i) =>
        typeof part === "string" ? (
          part
        ) : (
          <em key={i} className="italic text-accent">
            {part.em}
          </em>
        ),
      )}
    </>
  );
}
