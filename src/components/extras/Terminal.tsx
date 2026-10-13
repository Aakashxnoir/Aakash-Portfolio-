"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { terminal } from "@/content/extras";
import { openExtra } from "@/lib/extras";
import { writePrefs } from "@/lib/prefs";
import { markOpen } from "@/lib/window";
import AppWindow from "./AppWindow";
import { complete, run, type Context, type Line } from "./commands";

type Entry = { id: number; input?: string; lines: Line[] };

/**
 * Extras > Terminal: a shell that answers real commands about Aakash (`help`
 * lists them), opens windows, and switches the phosphor, CRT and motion.
 * Up and down walk the history; Tab completes.
 */
export default function Terminal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [entries, setEntries] = useState<Entry[]>([
    { id: 0, lines: terminal.welcome.map((l) => [l]) },
  ]);
  const [value, setValue] = useState("");
  const history = useRef<string[]>([]);
  const cursor = useRef(0);
  const nextId = useRef(1);
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [entries]);

  const push = (entry: Omit<Entry, "id">) =>
    setEntries((list) => [...list, { ...entry, id: nextId.current++ }]);

  const context = (): Context => ({
    navigate: (href) => {
      onClose();
      markOpen(window.innerWidth / 2, window.innerHeight / 2);
      router.push(href, { transitionTypes: ["open"] });
    },
    openUrl: (href) => window.open(href, "_blank", "noopener,noreferrer"),
    openExtra,
    setPrefs: writePrefs,
    copy: (text) => void navigator.clipboard?.writeText(text).catch(() => {}),
    clear: () => setEntries([]),
    close: onClose,
    history: history.current,
  });

  const submit = () => {
    const input = value;
    setValue("");
    if (input.trim()) history.current.push(input.trim());
    cursor.current = history.current.length;
    const lines = run(input, context());
    if (input.trim().toLowerCase() !== "clear") push({ input, lines });
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      submit();
    } else if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
      const list = history.current;
      cursor.current = Math.max(
        0,
        Math.min(list.length, cursor.current + (event.key === "ArrowUp" ? -1 : 1)),
      );
      setValue(list[cursor.current] ?? "");
    } else if (event.key === "Tab") {
      if (!value.trim()) return;
      event.preventDefault();
      const options = complete(value);
      if (options.length === 1) setValue(`${options[0]} `);
      else if (options.length > 1)
        push({ input: value, lines: [[options.map((o) => o.split(" ").pop()).join("  ")]] });
    } else if (event.key === "l" && event.ctrlKey) {
      event.preventDefault();
      setEntries([]);
    }
  };

  return (
    <AppWindow
      title={`${terminal.title} - ${terminal.prompt.replace(/:~\$$/, "")}`}
      closeLabel={terminal.close}
      open={open}
      onClose={onClose}
    >
      <div
        ref={logRef}
        role="log"
        aria-live="polite"
        className="h-[min(26rem,60svh)] overflow-y-auto px-4 py-3 text-ui whitespace-pre-wrap"
        onClick={() => {
          if (!window.getSelection()?.toString()) inputRef.current?.focus();
        }}
      >
        {entries.map((entry) => (
          <div key={entry.id}>
            {entry.input !== undefined && (
              <p>
                <span className="text-accent">{terminal.prompt}</span>{" "}
                <span className="text-text">{entry.input}</span>
              </p>
            )}
            {entry.lines.map((line, i) => (
              <p key={i} className="text-text-soft">
                {line.map((part, j) =>
                  typeof part === "string" ? (
                    part
                  ) : part.external ? (
                    <a key={j} href={part.href} target="_blank" rel="noreferrer" className="link">
                      {part.text}
                    </a>
                  ) : (
                    <Link
                      key={j}
                      href={part.href}
                      transitionTypes={["open"]}
                      onClick={onClose}
                      className="link"
                    >
                      {part.text}
                    </Link>
                  ),
                )}
              </p>
            ))}
          </div>
        ))}
      </div>
      <label className="flex items-center gap-2 border-t border-text-muted px-4 py-3 text-ui">
        <span className="shrink-0 text-accent">{terminal.prompt}</span>
        <span className="sr-only">{terminal.inputLabel}</span>
        <input
          ref={inputRef}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={onKeyDown}
          autoFocus
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="send"
          className="min-w-0 flex-1 bg-transparent text-text caret-accent focus:outline-none"
        />
      </label>
    </AppWindow>
  );
}
