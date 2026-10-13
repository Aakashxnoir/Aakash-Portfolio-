import { Fragment } from "react";
import type { RichText } from "@/content/site";

/**
 * Rich copy split into words for the scroll lighting (MotionController lights
 * each `[data-word]` from muted to full). Put `data-lit` on the parent. Without
 * motion it reads like <Rich>: plain text with the accent words in italics.
 */
export default function LitText({ text }: { text: RichText }) {
  return (
    <>
      {text.map((part, p) => {
        const accent = typeof part !== "string";
        const words = (accent ? part.em : part).split(/(\s+)/).map((word, w) =>
          !word || /^\s+$/.test(word) ? (
            word
          ) : (
            <span key={w} data-word>
              {word}
            </span>
          ),
        );
        return accent ? (
          <em key={p} className="text-accent italic">
            {words}
          </em>
        ) : (
          <Fragment key={p}>{words}</Fragment>
        );
      })}
    </>
  );
}
