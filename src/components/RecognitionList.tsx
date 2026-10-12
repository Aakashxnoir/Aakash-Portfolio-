import Reveal from "./motion/Reveal";
import { recognition } from "@/content/about";

/** Awards and roles, one hairline row each: title, then detail. Rows rise in turn. */
export default function RecognitionList() {
  return (
    <Reveal as="ul" stagger className="border-b border-rule">
      {recognition.items.map((item) => (
        <li
          key={`${item.title}-${item.detail}`}
          className="grid grid-cols-9 gap-x-8 border-t border-rule py-5"
        >
          <span className="col-span-3 font-medium text-text">{item.title}</span>
          <span className="col-span-6 text-text-soft">{item.detail}</span>
        </li>
      ))}
    </Reveal>
  );
}
