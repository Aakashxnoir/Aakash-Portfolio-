import type { RichText } from "@/content/site";

/** Renders copy where `{ em }` parts are the italic accent words. */
export default function Rich({ text }: { text: RichText }) {
  return (
    <>
      {text.map((part, index) =>
        typeof part === "string" ? (
          part
        ) : (
          <em key={index} className="text-accent italic">
            {part.em}
          </em>
        ),
      )}
    </>
  );
}
