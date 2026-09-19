import { cn } from "@/lib/utils";
import type { Diagnosis, Severity } from "@/types/supportlens";

const SEVERITY_LEVEL: Record<Severity, number> = { low: 1, medium: 2, high: 3 };

function SeverityMeter({ severity }: { severity: Severity }) {
  const level = SEVERITY_LEVEL[severity];

  return (
    <span className="flex items-center gap-2">
      <span
        aria-hidden="true"
        className="flex items-end gap-[3px]"
        data-severity={severity}
      >
        {[1, 2, 3].map((bar) => (
          <span
            key={bar}
            className={cn(
              "w-[3px] rounded-full transition-colors",
              bar === 1 && "h-2",
              bar === 2 && "h-3",
              bar === 3 && "h-4",
              bar <= level
                ? severity === "high"
                  ? "bg-destructive"
                  : "bg-foreground"
                : "bg-foreground/15",
            )}
          />
        ))}
      </span>
      <span className="text-sm font-semibold capitalize">{severity}</span>
    </span>
  );
}

export function DiagnosisCard({ diagnosis }: { diagnosis: Diagnosis }) {
  return (
    <section
      aria-labelledby="diagnosis-heading"
      className="bg-card overflow-hidden rounded-xl ring-1 ring-foreground/10"
    >
      <div className="border-border/70 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b px-5 py-3.5 sm:px-6">
        <h2
          id="diagnosis-heading"
          className="eyebrow text-muted-foreground flex items-center gap-2"
        >
          Diagnosis
        </h2>

        <dl className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <div className="flex items-center gap-2">
            <dt className="eyebrow text-muted-foreground">Category</dt>
            <dd className="text-sm font-semibold">{diagnosis.category}</dd>
          </div>
          <div className="flex items-center gap-2">
            <dt className="eyebrow text-muted-foreground">Severity</dt>
            <dd>
              <SeverityMeter severity={diagnosis.severity} />
            </dd>
          </div>
        </dl>
      </div>

      <p className="max-w-[68ch] px-5 py-5 text-[0.9375rem] leading-[1.65] text-pretty sm:px-6">
        {diagnosis.summary}
      </p>
    </section>
  );
}
