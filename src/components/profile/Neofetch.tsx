import { outside, stack } from "@/content/profile";
import { site } from "@/content/site";

/** The CHENG circle, as the neofetch logo. */
const LOGO = String.raw`
       .:::::::.
    .::'       '::.
  .::'    ___    '::.
 ::'    .'   '.    '::
::     :       :     ::
::     :       :     ::
 ::.    '.___.'    .::
  '::.           .::'
    '::.       .::'
       ':::::::'`.slice(1);

const SWATCHES = ["bg-bg", "bg-surface", "bg-rule", "bg-text-muted", "bg-text-soft", "bg-text", "bg-accent"];

/** Stack and outside-work facts as a `neofetch` readout. */
export default function Neofetch() {
  const user = `aakash@${site.host}`;
  return (
    <figure className="border border-text-muted bg-surface shadow-[4px_4px_0_0_var(--rule)]">
      <figcaption className="flex items-center gap-3 border-b border-text-muted px-4 py-2 text-ui text-text-muted">
        <span aria-hidden className="flex gap-1.5">
          <span className="size-2.5 bg-accent" />
          <span className="size-2.5 bg-text-muted" />
          <span className="size-2.5 bg-text-muted" />
        </span>
        {user} ~ {stack.command}
      </figcaption>
      <div className="grid gap-8 p-6 md:grid-cols-[auto_1fr] md:gap-12 md:p-8">
        <pre aria-hidden className="hidden text-[13px] leading-[1.25] text-accent md:block">
          {LOGO}
        </pre>
        <div className="min-w-0 text-ui md:text-body">
          <p className="text-accent">{user}</p>
          <p aria-hidden className="text-text-muted">
            {"-".repeat(user.length)}
          </p>
          <dl className="mt-1">
            {stack.groups.map((group) => (
              <div key={group.label} className="flex gap-2">
                <dt className="shrink-0 text-accent">{group.label}:</dt>
                <dd className="text-text-soft">{group.items.join(", ")}</dd>
              </div>
            ))}
            {outside.items.map((item) => (
              <div key={item.label} className="flex gap-2">
                <dt className="shrink-0 text-accent">{item.label}:</dt>
                <dd className="text-text-soft">{item.value}</dd>
              </div>
            ))}
          </dl>
          <div aria-hidden className="mt-4 flex">
            {SWATCHES.map((swatch) => (
              <span key={swatch} className={`h-4 w-6 ${swatch}`} />
            ))}
          </div>
        </div>
      </div>
    </figure>
  );
}
