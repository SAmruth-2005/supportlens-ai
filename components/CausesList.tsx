import type { LikelyCause } from "@/types/supportlens";

export function CausesList({ causes }: { causes: LikelyCause[] }) {
  if (causes.length === 0) return null;

  return (
    <section aria-labelledby="causes-heading" className="panel overflow-hidden">
      <div className="panel-inset border-border/70 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b px-4 py-2.5 sm:px-5">
        <h2 id="causes-heading" className="eyebrow text-muted-foreground">
          Likely causes
        </h2>
        <p className="text-muted-foreground/70 text-xs">
          Ranked by fit · none confirmed
        </p>
      </div>

      <ol className="divide-border/60 divide-y">
        {causes.map((cause, index) => (
          <li
            key={cause.cause}
            className="animate-rise-stagger flex gap-3 px-4 py-3 sm:gap-4 sm:px-5"
            style={{ "--i": index } as React.CSSProperties}
          >
            <span
              aria-hidden="true"
              className="ordinal text-muted-foreground/60 mt-px text-xs"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0 space-y-0.5">
              <h3 className="text-sm font-semibold text-pretty">
                {cause.cause}
              </h3>
              <p className="text-muted-foreground max-w-[68ch] text-sm leading-[1.55] text-pretty">
                {cause.reason}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
