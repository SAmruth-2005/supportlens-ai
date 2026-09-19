import type { LikelyCause } from "@/types/supportlens";

export function CausesList({ causes }: { causes: LikelyCause[] }) {
  if (causes.length === 0) return null;

  return (
    <section
      aria-labelledby="causes-heading"
      className="bg-card overflow-hidden rounded-xl ring-1 ring-foreground/10"
    >
      <div className="border-border/70 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b px-5 py-3.5 sm:px-6">
        <h2 id="causes-heading" className="eyebrow text-muted-foreground">
          Likely causes
        </h2>
        <p className="text-muted-foreground text-xs">
          Ranked by fit — none confirmed yet
        </p>
      </div>

      <ol className="divide-border/70 divide-y">
        {causes.map((cause, index) => (
          <li
            key={cause.cause}
            className="flex gap-3.5 px-5 py-4 sm:gap-4 sm:px-6"
          >
            <span
              aria-hidden="true"
              className="text-muted-foreground tabular bg-muted mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md font-mono text-[0.6875rem]"
            >
              {index + 1}
            </span>
            <div className="min-w-0 space-y-1">
              <h3 className="text-sm font-semibold text-pretty">
                {cause.cause}
              </h3>
              <p className="text-muted-foreground max-w-[68ch] text-sm leading-[1.6] text-pretty">
                {cause.reason}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
