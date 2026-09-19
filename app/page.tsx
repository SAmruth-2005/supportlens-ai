import { IssueInput } from "@/components/IssueInput";

/** The product story, stated once, in the order the system actually runs. */
const FLOW = [
  { label: "Describe", detail: "The issue, in your words" },
  { label: "Diagnose", detail: "Category, severity, causes" },
  { label: "Troubleshoot", detail: "One safe check at a time" },
  { label: "Resolve", detail: "Or escalate with evidence" },
] as const;

export default function HomePage() {
  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="grid-texture pointer-events-none absolute inset-x-0 top-0 h-[26rem]"
      />

      <div className="relative mx-auto w-full max-w-[1100px] px-5 py-10 sm:px-8 sm:py-14">
        <div className="mx-auto max-w-[46rem] space-y-8 sm:space-y-10">
          <header className="space-y-4">
            <p className="eyebrow text-muted-foreground flex items-center gap-2">
              <span
                aria-hidden="true"
                className="bg-primary inline-block size-1.5 rounded-full"
              />
              AI incident troubleshooting
            </p>

            <h1 className="text-display font-bold text-balance">
              Diagnose the issue.
              <br className="hidden sm:block" />{" "}
              <span className="text-muted-foreground">Then fix it, step by step.</span>
            </h1>

            <p className="text-muted-foreground max-w-[56ch] text-lg leading-[1.6] text-pretty">
              Describe an IT problem and SupportLens returns an evidence-based
              diagnosis, then guides you through one safe check at a time until
              the issue is resolved or ready to escalate.
            </p>
          </header>

          <IssueInput />

          <section aria-labelledby="flow" className="space-y-4">
            <h2 id="flow" className="eyebrow text-muted-foreground">
              How an investigation runs
            </h2>

            <ol className="grid grid-cols-1 gap-px overflow-hidden rounded-xl bg-border/70 shadow-[inset_0_0_0_1px_color-mix(in_oklch,var(--foreground)_9%,transparent)] sm:grid-cols-2 lg:grid-cols-4">
              {FLOW.map((stage, index) => (
                <li
                  key={stage.label}
                  className="bg-card animate-rise-stagger relative flex flex-col gap-1 p-4"
                  style={{ "--i": index } as React.CSSProperties}
                >
                  <div className="flex items-center gap-2">
                    <span className="ordinal text-muted-foreground text-[0.6875rem]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span
                      aria-hidden="true"
                      className={
                        index === 0
                          ? "bg-primary h-px flex-1"
                          : "bg-border h-px flex-1"
                      }
                    />
                  </div>
                  <h3 className="text-sm font-semibold">{stage.label}</h3>
                  <p className="text-muted-foreground text-xs leading-[1.5] text-pretty">
                    {stage.detail}
                  </p>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
}
